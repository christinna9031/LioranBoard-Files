function TTSForLB() {
  const elementId = 'TTSAudio';
  const audioElement = document.createElement('audio');
  audioElement.setAttribute('id', elementId);
  document.body.appendChild(audioElement);
  audioElement.muted = false;
  const playlist = [];
  let speaking = false;
  let googleApiKey = null;
  LB.setVariable('speaking', false, 'TTSKStatus');

  const tts = {
    self: this,

    PollySettings(awsCredentials, region) {
      AWS.config.credentials = awsCredentials;
      AWS.config.region = region;
    },

    async GetPollyVoices() {
      let voices;
      const pollyAWS = new AWS.Polly();
      await pollyAWS.describeVoices().promise()
        .then((r) => voices = r)
        .catch((e) => {
          if (e.error) throw (e.error.message);
          throw (e);
        });
      return voices;
    },

    GoogleSettings(apiKey) {
      googleApiKey = apiKey;
    },

    async GetGoogleVoices() {
      let voices;
      const response = await fetch(`https://texttospeech.googleapis.com/v1beta1/voices?key=${googleApiKey}`);
      await response.json()
        .then((r) => voices = r)
        .catch((e) => { throw (e?.error?.message); });
      return voices;
    },

    // Speak
    Speak(type, msg, settings) {
      if (speaking || playlist.length !== 0) {
        playlist.push({
          type,
          msg,
          settings,
        });
        return;
      }
      say(type, msg, settings);
    },

    SpeakNext() {
      if (playlist.length === 0) return;
      const request = playlist.shift();
      say(request.type, request.msg, request.settings);
    },

    Skip() {
      audioElement.replaceWith(audioElement.cloneNode(true));
      audioElement.removeEventListener('ended', handler, false);
      tts.SpeakNext();
    },
    // Pause speaking
    Play() {
      if (audioElement.paused) {
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          speaking = true;
          LB.setVariable('speaking', true, 'TTSKStatus');
          audioElement.addEventListener('ended', handler, false);
          playPromise.catch(() => {});
        }
      }
    },

    Pause() {
      audioElement.replaceWith(audioElement.cloneNode(true));
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.then((_) => {
          audioElement.pause();
          speaking = false;
          LB.setVariable('speaking', false, 'TTSKStatus');
        })
          .catch(() => {});
      }
    },

    Mute() {
      audioElement.muted = true;
      LB.setVariable('muted', true, 'TTSKStatus');
    },

    Unmute() {
      audioElement.muted = false;
      LB.setVariable('muted', false, 'TTSKStatus');
    },

    VolumeUp() {
      const testvolume = audioElement.volume + (10 / 100);
      audioElement.volume = (testvolume <= 1) ? testvolume : 1;
    },

    VolumeDown() {
      const testvolume = audioElement.volume - (10 / 100);
      audioElement.volume = (testvolume >= 0) ? testvolume : 0;
    },

    SetVolume(v) {
      audioElement.volume = v;
    },
  };

  function handler() {
    audioElement.replaceWith(audioElement.cloneNode(true));
    audioElement.removeEventListener('ended', handler, false);
    speaking = false;
    LB.setVariable('speaking', false, 'TTSKStatus');
    tts.SpeakNext();
  }

  // Speak the message
  async function say(type, message, settings) {
    speaking = true;
    LB.setVariable('speaking', true, 'TTSKStatus');
    const cache = JSON.parse(sessionStorage.getItem('TTSCached')) || [];
    const audioStreamFiltered = cache.filter((audio) => (audio.message.toLowerCase() == message.toLowerCase() && JSON.stringify(audio.settings) == JSON.stringify(settings)));
    let audioStream = audioStreamFiltered[0]?.audioStream;
    if (type === 'Polly') audioStream = audioStreamFiltered[0]?.audioStream?.data;
    if (audioStream) {
      playAudio(type, null, null, audioStream);
      return;
    }
    await getAudio(type, message, settings)
      .then((audioStream) => playAudio(type, message, settings, audioStream))
      .catch((e) => LB.alert(`TTS Google Error: ${e}`));
  }

  // Make request
  async function getAudio(type, message, settings) {
    switch (type) {
      default:
        break;
      case 'Polly': {
        const pollyAWS = new AWS.Polly();
        //  message = message.replace(/"/g, '&quot;').replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/</g, '&lt;')
        //     .replace(/>/g, '&gt;');
        const pitch = settings.pollyVoiceEngine !== 'neural' ? `pitch="${settings.pitch}"` : '';
        const effect = settings.pollyVoiceEngine !== 'neural' ? settings.effect == 'soft' ? 'phonation="soft"' : `name="${settings.effect}"` : 'name="null"';
        const text = settings.inputType === 'manual' ? message : `<speak><prosody rate="${settings.speed}" ${pitch}><amazon:effect ${effect}>${message}</amazon:effect></prosody></speak>`;

        const params = {
          OutputFormat: 'mp3',
          Text: text,
          VoiceId: settings.pollyVoiceId || 'Brian',
          TextType: 'ssml',
          Engine: settings.pollyVoiceEngine || 'standard',
        };

        console.log(params);

        const response = await pollyAWS.synthesizeSpeech(params).promise();
        if (response.error) {
          console.log(response);
          LB.alert(`TTS Polly Error: ${response.error.message}`);
        } else {
          const audioStream = response.AudioStream;
          if (!audioStream) {
            console.log(response);
            throw (response);
          }
          return audioStream;
        }
      }
        break;
      case 'Google': {
        const params = {
          audioConfig: {
            audioEncoding: 'MP3',
            pitch: settings.pitch,
            speakingRate: settings.speed,
          },
          voice: {
            languageCode: settings.region,
            name: settings.voice,
          },
          input: {
            text: message,
          },
        };

        const response = await fetch(`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${googleApiKey}`, {
          method: 'POST',
          body: JSON.stringify(params),
        });
        const data = await response.json();
        if (!data.audioContent) {
          throw (data?.error?.message);
        }
        const mp3 = `data:audio/mp3;base64,${data.audioContent}`;
        return mp3;
      }
    }
  }

  function playAudio(type, message, settings, audioStream) {
    audioElement.addEventListener('ended', handler, false);
    let url = audioStream;
    if (type === 'Polly') {
      const uInt8Array = new Uint8Array(audioStream);
      const arrayBuffer = uInt8Array.buffer;
      const blob = new Blob([arrayBuffer]);
      url = URL.createObjectURL(blob);
    }
    audioElement.src = url;
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then((_) => {})
        .catch((e) => {
          console.log(e);
          LB.alert(`TTS Error: ${e}`);
        });
    }

    if (!message) return;
    const cache = JSON.parse(sessionStorage.getItem('TTSCached')) || [];
    cache.push({
      type,
      message,
      settings,
      audioStream,
    });
    sessionStorage.setItem('TTSCached', JSON.stringify(cache));
  }
  return tts;
}

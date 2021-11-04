function YTLiveTestEvent(e) {
    const name = ['Lioran', 'Melonax', 'Sebas', 'Cyanidesugar', 'Ramsreef', 'MisterK', 'Silverlink', 'Daryl', 'MrRubberDucky', 'MrWaldo', 'Andilippi', 'Edu', 'kelvin214', 'wellzish', 'Lyfesaver'];
    const message = ['Hello World!', "Alright, I'll be honest with ya, Bob. My name's not Kirk. It's Skywalker. Luke Skywalker.", 'Well, that never happened in any of the simulations.', 'You know, you blow up one sun and suddenly everyone expects you to walk on water.', "How's a needle in my butt gonna get water out of my ears?", 'If you immediately know the candle light is fire, then the meal was cooked a long time ago.', "So it's possible there's an alternate version of myself out there that actually understands what the hell you're talkin' about?", 'It costs nearly a billion dollars just to turn the lights on around here'];
    const randomName = name[Math.floor(Math.random() * name.length)];
    const levelName = 'Some level name';
    const randomMsg = message[Math.floor(Math.random() * message.length)];
    const channelId = 'UCxyGT_zXVj_w_7xX2-qpyeA';
    const channelUrl = 'https://www.youtube.com/channel/UCxyGT_zXVj_w_7xX2-qpyeA';
    const thumbnail = 'https://yt3.ggpht.com/yti/APfAmoHK19lqCTj6gFk3V8yFcwKZgtbbHOC919KExcrV=s108-c-k-c0x00ffffff-no-rj';
    switch (e.id) {
    default:
      break;
    case 'ytLiveTestSub':
    LBTriggerExt('YT Live Subscriber', randomName, channelId, thumbnail);
    break;
    case 'ytLiveTestMember':
    LBTriggerExt('YT Live Member', randomName, levelName, channelId, channelUrl, thumbnail);
    break;
    case 'ytLiveTestMilestone': {
    const month = document.getElementById('YTLiveMilestoneMonth').value || Math.ceil(Math.random() * 10);
    const level = document.getElementById('YTLiveMilestoneLevel').value || levelName;
    const msg = document.getElementById('YTLiveMilestoneMsg').value || randomMsg;
    LBTriggerExt('YT Live Member Milestone', randomName, level, `${month}`, msg, channelId, channelUrl, thumbnail);
    }
    break;
    case 'ytLiveTestSuperChat': {
    const amount = document.getElementById('YTLiveSuperChatAmount').value || Math.ceil(Math.random() * 100000000);
    const tier = document.getElementById('YTLiveSuperChatTier').value || Math.ceil(Math.random() * 5);
    const msg = document.getElementById('YTLiveSuperChatMsg').value || randomMsg;
    LBTriggerExt('YT Live Super Chat', randomName, `${amount}`, `USD$${Math.round(amount / 1000000)}.00`, `${tier}`, msg, channelId, channelUrl, thumbnail);
    }
    break;
    case 'ytLiveTestSuperSticker': {
    const amount = document.getElementById('YTLiveSuperStickerAmount').value || Math.ceil(Math.random() * 100000000);
    const tier = document.getElementById('YTLiveSuperStickerTier').value || Math.ceil(Math.random() * 5);
    LBTriggerExt('YT Live Super Sticker', randomName, `${amount}`, `USD$${Math.round(amount / 1000000)}.00`, tier, channelId, channelUrl, thumbnail, 'pearfect_hey_you_v2', 'Pear character turning around waving his hand, saying Hey you while lowering his glasses');
    }
    break;
    case 'ytLiveTestChatMessage': {
    const displayName = document.getElementById('YTLiveChatMessageName').value || randomName;
    const msg = document.getElementById('YTLiveChatMessageMsg').value || randomMsg;
    const badge = [];
      if (YTLiveChatMessageBroadcaster.checked) badge.push('broadcaster/1');
      if (YTLiveChatMessageMod.checked) badge.push('moderator/1');
      if (YTLiveChatMessageVerified.checked) badge.push('vip/1');
      if (YTLiveChatMessageMember.checked) badge.push('subscriber/1');
      const YtLiveMessage = {
                emotes: thumbnail,
                login: displayName.toLowerCase(),
                display_name: displayName,
                user_id: channelId,
                color: 0,
                badge: badge.join(','),
                message: msg.replace(/"/g, "'"),
                channel: channelUrl,
                topic: 'chatmessage',
                type: 'MESSAGE',
                };
                 lioranboardclient.send(JSON.stringify(YtLiveMessage));
    }
    break;
    }
    }
    
    async function YouTubeLiveINIT(refreshToken) {
    window.ytLiveSession = window.ytLiveSession || {};
    const s = window.ytLiveSession;
    const p = JSON.parse(sessionStorage.getItem('ytLiveParams')) || {};
    const y = JSON.parse(localStorage.getItem('ytLiveStorage')) || {};
    const minute = 60000;
    // set RGB colors for receiver buttons
    const btnColors = {
     red: ['137', '2', '2'], blue: ['0', '0', '218'], orange: ['211', '119', '2'], green: ['51', '197', '0'],
    };
    // reset error count to 0
    let errcount = 0;
    // create yt param objects if not defined yet
    s.ignoreMessages = s.ignoreMessages || [];
    s.myBroadcastInfo = s.myBroadcastInfo || {};
    s.errors = s.errors || [];
    y.channelIds = y.channelIds || {};
    y.banlist = y.banlist || {};
    y.myChannelInfo = y.myChannelInfo || {};
    
    // document element variables
    const ytLiveErrors = document.getElementById('ytLiveErrors');
    const ytLiveErrorsSave = document.getElementById('ytLiveErrorsSave');
    const ytLiveBroadcastTitle = document.getElementById('ytLiveBroadcastTitle');
    const ytLiveBroadcastDur = document.getElementById('ytLiveBroadcastDur');
    const ytLiveBroadcastViews = document.getElementById('ytLiveBroadcastViews');
    const ytLiveBroadcastLikes = document.getElementById('ytLiveBroadcastLikes');
    const ytLiveBroadcastDislikes = document.getElementById('ytLiveBroadcastDislikes');
    const ytLiveBroadcastViewers = document.getElementById('ytLiveBroadcastViewers');
    
    // replay variables
    const replayLog = document.getElementById('ytLiveReplay');
    const replayLogOutput = document.getElementById('ytLiveReplaylog');
    const replayCheckBox = document.getElementById('ytLiveEventCheckbox');
    const replayButton = document.getElementById('ytLiveReplaybutton');
    const payloadButton = document.getElementById('ytLivePayloadbutton');
    // check whether replay log is enabled and persist through reloads
    replayCheckBox.checked = y.ytLiveLogChecked || false;
    replayLogOutput.innerHTML = y.ytLiveLogChecked ? '<samp>Listening for traffic.</samp>' : '<samp>Event replays are disabled.</samp>';
    
    // check if refresh token is present
    if (!refreshToken || refreshToken.length < 5) { errorHandler('token', 'Refresh token is missing! Retrieve your refresh token and add it in your INIT button first', true); return; }
    
    // get access token
    await verifyAccessToken(false);
    if (!p.accessToken) return;
    // don't continue if extension is already connected and listening
    
    // attach event listener to lioranboard if there isn't one yet
    lioranboardclient.removeEventListener('message', YTExtListener);
    lioranboardclient.addEventListener('message', YTExtListener);
    
    if (s.status && s?.status[0] === 'Listening' && s.subTimeout && s.chatTimeout && s.broadcastStatsTimeout) return;
    
    // get channel info and categories
    await getMyChannelInfo();
    
    // add event listeners to error button, replay check box, dropdown box and replay button
    replayCheckBox.onclick = replayCheckboxClick;
    payloadButton.onclick = displayPayload;
    replayButton.onclick = replayEvent;
    ytLiveErrorsSave.onclick = errorsSave;
    
    // tell Receiver YT Live is ready to start listening
    changeStatus('Ready', 'blue');
    
    // start periodically updating local storage
    setTimeout(() => {
    updateYTLocalStorage();
    }, 5000);
    
    // remember user's choice to enable or disable replays
    function replayCheckboxClick() {
    y.ytLiveLogChecked = replayCheckBox.checked;
    replayLogOutput.innerHTML = (replayCheckBox.checked) ? '<samp>Listening for traffic.</samp>' : '<samp>Event replays are disabled.</samp>';
    localStorage.setItem('ytLiveStorage', JSON.stringify(y));
    }
    
    // display payload for user's selected event
    function displayPayload() {
    if (!replayLog.options[replayLog.selectedIndex]) return;
    const selected = replayLog.options[replayLog.selectedIndex].id;
    const replay = s.replays[selected];
    replayLogOutput.innerHTML = `<samp>${replay}</samp>`;
    }
    
    // replay user's selected event
    function replayEvent() {
    const selected = replayLog.options[replayLog.selectedIndex].id;
    const type = replayLog.options[replayLog.selectedIndex].value;
    const replay = s.replays[selected];
    processEvent(type, JSON.parse(replay), true);
    }
    
    // log events
    function logMessage(type, msg, id = Date.now()) {
    // format event name and display viewer name
    const title = type === 'NewSubscriber' ? 'Subscriber' : type === 'newSponsorEvent' ? 'Sponsor' : type === 'superChatEvent' ? 'Super Chat' : type === 'superStickerEvent' ? 'Super Sticker' : type === 'memberMilestoneChatEvent' ? 'Member Milestone' : type === 'chatEndedEvent' ? 'Chat Ended' : type;
    const content = (type === 'NewSubscriber') ? `${title}: ${msg.subscriberSnippet.title}` : (type === 'chatEndedEvent') ? type : `${title}: ${msg.authorDetails.displayName}`;
    const { length } = replayLog;
    // if dropdown length is more than 15, remove the children
    if (length >= 15) replayLog.removeChild(replayLog.options[length - 1]);
    // append a new child to the dropdown
    const option = document.createElement('option');
    option.setAttribute('id', id);
    option.setAttribute('value', type);
    option.innerHTML = content;
    replayLog.prepend(option);
    // add new event to the global variable
    if (!s.replays) s.replays = {};
    s.replays[id] = JSON.stringify(msg);
    // delete any old (>15) events
    if (Object.keys(s.replays).length >= 15) {
      s.replays = Object.keys(s.replays).slice(0, 15).reduce((res, key) => {
                        res[key] = s.replays[key];
                        return res;
                    }, {});
    }
    }
    
    // verify access token and its expiration, get new one if needed
    async function verifyAccessToken(regular = false) {
    if (!p.accessToken || p.accessTokenExpires - Date.now() < 60000) {
    p.accessToken = null;
    await getAccessToken()
    .then((content) => {
    p.accessToken = content.access_token;
    p.accessTokenExpires = Date.now() + (content.expires_in * 1000) - 60000;
    sessionStorage.setItem('ytLiveParams', JSON.stringify(p));
    })
    .catch((e) => {
    errorHandler('access token', e);
    changeStatus('Token error', 'orange');
    });
    }
    // set timeout to get the next access token
    if (window.YTTokenTimeout) clearTimeout(window.YTTokenTimeout);
    if (regular) {
    window.YTTokenTimeout = setTimeout(() => {
    verifyAccessToken(true);
    }, (p.accessTokenExpires - Date.now()) || 55 * minute);
    }
    }
    
    // get a new access token
    async function getAccessToken() {
    const tokenUrl = 'https://fq4adpt9rc.execute-api.us-west-2.amazonaws.com/main/accesstoken';
    const response = await fetch(tokenUrl, { headers: { Authorization: refreshToken } });
    const content = await response.json();
      if (!response.ok) {
        const error = (content.error) ? content.error.message || content.error : 'Something went wrong.';
        throw error;
      }
    return content;
    }
    
    // get broadcaster's channel info
    async function getMyChannelInfo() {
    const ytUrl = 'channels?part=snippet%2Cstatistics&mine=true';
    await fetchYouTube(ytUrl, 'getMyChannelInfo')
        .then((response) => {
          const data = response?.items[0];
          if (!data) return;
          const oldChannelId = y?.myChannelInfo?.id || undefined;
          y.myChannelInfo = {
          id: data.id, title: data.snippet.title, country: data.snippet.country, viewCount: data.statistics.viewCount, subCount: data.statistics.subscriberCount, videoCount: data.statistics.videoCount,
          };
          if (oldChannelId !== data.id || !y.categories || Object.keys(y?.categories).length === 0) getCategories();
          else {
          const categoryDiv = document.getElementById('YTLiveCategories');
          categoryDiv.innerHTML = '';
          for (const [key, value] of Object.entries(y.categories)) {
          categoryDiv.innerHTML += `${key}: ${value}<br>`;
          }
          }
      document.getElementById('ytLiveChanTitle').innerHTML = y.myChannelInfo.title;
      document.getElementById('ytLiveChanID').innerHTML = y.myChannelInfo.id;
      document.getElementById('ytLiveChanViewCount').innerHTML = y.myChannelInfo.viewCount;
      document.getElementById('ytLiveChanSubCount').innerHTML = y.myChannelInfo.subCount;
      document.getElementById('ytLiveChanVideoCount').innerHTML = y.myChannelInfo.videoCount;
      })
        .catch((e) => errorHandler('Get My Channel Info', e.message));
    }
    
    // get all categories based on region
    async function getCategories() {
    y.categories = {};
    const region = y?.myChannelInfo?.country || undefined;
    const ytUrl = `videoCategories?part=snippet&regionCode=${region}`;
    const categoryDiv = document.getElementById('YTLiveCategories');
    categoryDiv.innerHTML = '';
    await fetchYouTube(ytUrl, 'getCategories')
        .then((data) => {
        data.items.forEach((category) => {
        if (category.snippet.assignable) {
        y.categories[category.snippet.title] = category.id;
        categoryDiv.innerHTML += `${category.id}: ${category.snippet.title}<br>`;
        }
        });
      })
        .catch((e) => errorHandler('YouTube Get Categories', e.message));
    }
    
    // regularly save youtube live data into local storage
    function updateYTLocalStorage() {
    localStorage.setItem('ytLiveStorage', JSON.stringify(y));
    setTimeout(() => {
    updateYTLocalStorage();
    }, 1 * minute);
    }
    
    // listen to all receiver extension triggers
    function YTExtListener(event) {
    let data;
    if (typeof event.data === 'string' && event.data.slice(0, 1) === '3' && event.data.includes('YouTubeLive')) {
    data = JSON.parse(event.data.slice(2, event.data.length));
    if (data.datatype === 'YouTubeLiveListener') verifyAccessToken(true); else { verifyAccessToken(false); }
    switch (data.datatype) {
    default:
      break;
    case 'YouTubeLiveChatMessage': sendMessage(data.message);
    break;
    case 'YouTubeLiveListener':
    listener(data.streamID);
    break;
    case 'YouTubeLiveUpdateBroadcast': updateBroadcast(data.title, data.description, data.categoryId, data.streamId);
    break;
    case 'YouTubeLiveGetMyChannelStats':
    LBStackDelete(data.stackName);
    if (!y.myChannelInfo.title) { errorHandler('Get My Channel Stats', 'No stats found.'); return; }
    LBStackAppend(data.stackName, [y.myChannelInfo.title, y.myChannelInfo.id, y.myChannelInfo.viewCount, y.myChannelInfo.subCount, y.myChannelInfo.videoCount]);
    break;
    case 'YouTubeLiveGetMyBroadcastStats':
    LBStackDelete(data.stackName);
    if (!s.myBroadcastInfo.title) { errorHandler('Get My Broadcast Stats', 'No stats found or broadcast is offline.'); return; }
    LBStackAppend(data.stackName, [s.myBroadcastInfo.title, s.myBroadcastInfo.duration, s.myBroadcastInfo.viewCount, s.myBroadcastInfo.likeCount, s.myBroadcastInfo.dislikeCount, s.myBroadcastInfo.concurrentViewers]);
    break;
    case 'YouTubeLiveBanorUnbanUser': banUnbanUser(data.displayName, data.channelid, data.type, data.permanent, data.duration);
    break;
    case 'YouTubeLiveCheckSubStatus': checkSubStatus(data.displayName, data.channelid, data.variable);
    break;
    case 'YouTubeLiveGetMemberInfo': getMemberInfo(data.displayName, data.channelid, data.stackName);
    break;
    case 'YouTubeLiveGetCategories': {
    const categories = [];
    LBStackDelete(data.stackName);
    for (const [key, value] of Object.entries(y.categories)) {
          categories.push(`${key.replace(/&/g, 'and')}: ${value}`);
          }
    LBStackAppend(data.stackName, categories);
    }
    break;
    case 'YouTubeLiveGetStatus':
    if (s.status) changeStatus(s.status[0], s.status[1]);
    }
    }
    }
    
    // ban or unban a user
    async function banUnbanUser(username, channelid, type, permanent, duration) {
      let id;
      const chatID = p.chatID || getCurrentBroadcast();
      const channelID = (channelid.length > 2) ? channelid : y?.channelIds[username.toLowerCase()];
      if (!chatID) { errorHandler('Ban/Unban', 'No chat ID found'); return; }
      if (!channelID) { errorHandler('Ban/Unban', 'Channel ID not found.'); return; }
      if (type === 'unban') {
        if (y.banlist[channelID]) id = y.banlist[channelID];
        else { errorHandler('Ban/Unban', 'Could not find original ban ID.'); return; }
    }
      const ytUrl = (type === 'ban') ? 'liveChat/bans?part=snippet' : `liveChat/bans?id=${id}`;
      const method = (type === 'ban') ? 'POST' : 'DELETE';
      let body;
      if (type === 'ban') {
        body = {
          snippet: {
        liveChatId: chatID,
        type: (permanent == true) ? 'permanent' : 'temporary',
        banDurationSeconds: (permanent == false && type === 'ban') ? duration * 60 : undefined,
        bannedUserDetails: {
        channelId: channelID,
        },
      },
      };
    }
    await fetchYouTube(ytUrl, null, method, body)
        .then((data) => {
        if (type === 'ban' && permanent == true) y.banlist[channelID] = data.id;
        else { delete y.banlist[channelID]; }
      })
        .catch((e) => {
          if (e.reason === 'insufficientPermissions') e.message = 'Insufficient permissions or user is already banned.';
          errorHandler('Ban/Unban user', e.message);
    });
    }
    
    // check a subscriber's status
    async function checkSubStatus(username, channelid, variable) {
      const channelID = (channelid.length > 2) ? channelid : y.channelIds[username.toLowerCase()];
      if (!channelID) {
      errorHandler('Check Sub Status', 'Channel ID for the given display name not found.');
      return;
      }
      const ytUrl = `subscriptions?part=subscriberSnippet&part=snippet&forChannelId=${y.myChannelInfo.id}&channelId=${channelID}&maxResults=50`;
    await fetchYouTube(ytUrl, 'checkSubStatus')
        .then((data) => {
        const result = data?.pageInfo?.totalResults >= 1 ? 'true' : 'false';
        LBSetValue(variable, result);
        })
        .catch((e) => errorHandler('Check Sub Status', e.message));
      }
    
    // get channel member's information
    async function getMemberInfo(username, channelid, stackName) {
      LBAlert('YouTube Live Get Member Info Command is not yet functional.');
      return;
      const channelID = (channelid.length > 2) ? channelid : y.channelIds[username.toLowerCase()];
      if (!channelID) { errorHandler('Get Member Info', 'Channel ID for the given display name not found.'); return; }
      const ytUrl = `members?part=snippet&filterByMemberChannelId=${y.myChannelInfo.id}`;
    await fetchYouTube(ytUrl, 'getMemberInfo')
        .then((data) => {
        const m = data.items[0];
        const memberInfo = [m.snippet.memberDetails.displayName, m.snippet.memberDetails.channelId, m.snippet.memberDetails.channelUrl, m.snippet.memberDetails.profileImageUrl, m.snippet.membershipsDetails.highestAccessibleLevel, m.snippet.membershipsDetails.highestAccessibleLevelDisplayName, m.snippet.membershipsDetails.membershipsDuration.memberTotalDurationMonths];
        LBStackDelete(stackName);
        LBStackAppend(stackName, memberInfo);
        })
        .catch((e) => errorHandler('Get Member Info', e.message));
    }
    
    // update broadcast
    async function updateBroadcast(title, desc, categoryID, streamID) {
      if (streamID !== p.streamID) await getCurrentBroadcast();
      const ytUrl = 'videos?part=id,snippet';
      const body = {
      id: p.broadcastID,
        snippet: {
      title: (title && title != 0) ? title : s.myBroadcastInfo.title,
      description: (desc && desc != 0) ? desc : s.myBroadcastInfo.description,
      categoryId: (categoryID && categoryID != 0) ? categoryID : s.myBroadcastInfo.categoryID,
    },
    };
    await fetchYouTube(ytUrl, null, 'PUT', body)
        .then((data) => {
        LBAlert('YouTube Live: Broadcast updated!');
        s.myBroadcastInfo.title = data.snippet.title;
        s.myBroadcastInfo.description = data.snippet.description;
        s.myBroadcastInfo.categoryID = data.snippet.categoryId;
        })
        .catch((e) => errorHandler('Update Broadcast', e.message));
    }
    
    // send chat message
    async function sendMessage(message) {
    if (!p.chatID) await getCurrentBroadcast();
    if (!p.chatID) { errorHandler('Send message', 'No Chat ID found!'); return; }
    const chatUrl = 'liveChat/messages?part=snippet';
    const body = {
      snippet: {
      liveChatId: p.chatID,
      type: 'textMessageEvent',
      textMessageDetails: { messageText: message },
      },
    };
    await fetchYouTube(chatUrl, null, 'POST', body)
    .then((data) => s.ignoreMessages.push(data.id))
    .catch((e) => errorHandler('Send message', e.message));
    }
    
    // start listening to chat messages and subscribers
    async function listener(streamID) {
    if (s.status && s?.status[0] === 'Listening' && s.subTimeout && s.chatTimeout && s.broadcastStatsTimeout) { console.log('returning'); return; }
    errcount = 0;
    p.chatID = null;
    p.broadcastID = null;
    await getCurrentBroadcast(streamID);
    if (!p.chatID) return;
    // don't continue if extension is already connected and listening
    LBTriggerExt('YTLiveErrorsReset');
    getBroadcastStats();
    listenToChat();
    listenToSubs();
    changeStatus('Listening', 'green');
    }
    
    // get current broadcast ID
    async function getCurrentBroadcast(streamID) {
      const broadcastListUrl = 'liveBroadcasts?part=contentDetails&part=snippet&broadcastStatus=active';
    await fetchYouTube(broadcastListUrl, 'getCurrentBroadcast')
        .then((data) => {
        if (data.pageInfo.totalResults === 0) throw ({ message: 'No active broadcast found.' });
        if (streamID) data.items.filter((broadcast) => broadcast.contentDetails.boundStreamId === streamID);
        const broadcast = data.items[0];
        p.broadcastID = broadcast.id;
        p.chatID = broadcast.snippet.liveChatId;
        p.streamID = broadcast.contentDetails.boundStreamId;
        sessionStorage.setItem('ytLiveParams', JSON.stringify(p));
        })
        .catch((e) => errorHandler('List Broadcasts', e.message));
      return p.chatID;
    }
    
    // get current broadcast video stats
    async function getBroadcastStats() {
      if (s.broadcastStatsTimeout) clearTimeout(s.broadcastStatsTimeout);
      if (!p.broadcastID) return;
      const ytUrl = `videos?id=${p.broadcastID}&part=snippet,statistics,liveStreamingDetails`;
    await fetchYouTube(ytUrl, 'getBroadcastStats')
        .then((data) => {
        const v = data.items[0];
        const started = moment(v.liveStreamingDetails.actualStartTime);
        const dateNow = moment(new Date());
        const duration = moment.duration(dateNow.diff(started)).asHours().toFixed(1);
        // const duration = moment.duration(v.contentDetails.duration)._milliseconds;
        s.myBroadcastInfo = {
     title: v.snippet.title, categoryID: v.snippet.categoryId, description: v.snippet.description, duration, viewCount: v.statistics.viewCount, likeCount: v.statistics.likeCount, dislikeCount: v.statistics.dislikeCount, concurrentViewers: v?.liveStreamingDetails?.concurrentViewers || '0',
    };
    ytLiveBroadcastTitle.innerHTML = s.myBroadcastInfo.title;
    ytLiveBroadcastDur.innerHTML = `${s.myBroadcastInfo.duration} hours`;
    ytLiveBroadcastViews.innerHTML = s.myBroadcastInfo.viewCount;
    ytLiveBroadcastLikes.innerHTML = s.myBroadcastInfo.likeCount;
    ytLiveBroadcastDislikes.innerHTML = s.myBroadcastInfo.dislikeCount;
    ytLiveBroadcastViewers.innerHTML = s.myBroadcastInfo.concurrentViewers;
        })
        .catch((e) => errorHandler('Get Broadcast Stats', e.message));
        s.broadcastStatsTimeout = setTimeout(() => {
        getBroadcastStats();
        }, 1 * minute);
    }
    
    // process all events sent to LB and log them
    function processEvent(type, msg, replay = false) {
    if (type !== 'NewSubscriber') {
      if (y.ytLiveLogChecked && !replay && msg.snippet.type !== 'textMessageEvent') logMessage(msg.snippet.type, msg, Date.now());
        switch (msg.snippet.type) {
          default:
          break;
          case 'chatEndedEvent':
            LBAlert('YouTube Live: Chat has ended.');
            LBTriggerExt('YT Live Chat Ended');
            changeStatus('Chat ended.', 'red');
            verifyAccessToken(false);
            if (s.subTimeout) clearTimeout(s.subTimeout);
            if (s.broadcastStatsTimeout) clearTimeout(s.broadcastStatsTimeout);
            return;
          case 'textMessageEvent':
            processChatMsg(msg);
          break;
          case 'newSponsorEvent':
            LBTriggerExt('YT Live Member', msg.authorDetails.displayName, msg.snippet.newSponsorDetails.memberLevelName, msg.authorDetails.channelId, msg.authorDetails.channelUrl, msg.authorDetails.profileImageUrl);
          break;
          case 'superChatEvent':
          LBTriggerExt('YT Live Super Chat', msg.authorDetails.displayName, msg.snippet.superChatDetails.amountMicros, msg.snippet.superChatDetails.amountDisplayString, `${msg.snippet.superChatDetails.tier}`, msg.snippet.superChatDetails?.userComment?.replace(/"/g, "'"), msg.authorDetails.channelId, msg.authorDetails.channelUrl, msg.authorDetails.profileImageUrl);
          break;
          case 'superStickerEvent':
          LBTriggerExt('YT Live Super Sticker', msg.authorDetails.displayName, msg.snippet.superStickerDetails.amountMicros, msg.snippet.superStickerDetails.amountDisplayString, `${msg.snippet.superStickerDetails.tier}`, msg.authorDetails.channelId, msg.authorDetails.channelUrl, msg.authorDetails.profileImageUrl, msg.snippet.superStickerDetails.superStickerMetadata.stickerId, msg.snippet.superStickerDetails.superStickerMetadata.altText);
          break;
          case 'memberMilestoneChatEvent':
          LBTriggerExt('YT Live Member Milestone', msg.authorDetails.displayName, msg.snippet.memberMilestoneChatDetails.memberLevelName, `${msg.snippet.memberMilestoneChatDetails.memberMonth}`, msg.snippet.memberMilestoneChatDetails.userComment?.replace(/"/g, "'"), msg.authorDetails.channelId, msg.authorDetails.channelUrl, msg.authorDetails.profileImageUrl);
          break;
        }
    } else {
    if (y.ytLiveLogChecked && !replay) logMessage('NewSubscriber', msg, Date.now());
    const sub = msg.subscriberSnippet;
    LBTriggerExt('YT Live Subscriber', sub.title, sub.channelId, sub.thumbnails.default.url);
    }
    }
    
    // regularly poll subscriber api to check for new subs
    async function listenToSubs() {
    const subUrl = 'https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&part=subscriberSnippet&myRecentSubscribers=true&maxResults=50';
    let data;
    if (s.subTimeout) clearTimeout(s.subTimeout);
    const headers = { Authorization: `Bearer ${p.accessToken}`, 'If-None-Match': s.subEtag || undefined };
    const response = await fetch(subUrl, { headers });
    try { data = await response.json(); } catch (e) {}
    if (!response.ok) {
      if (response.status !== 304) {
      const e = (data.error) ? data.error.message || data.error : 'Something went wrong.';
      errorHandler('Subscriber Listener', e.message);
    }
    } else {
    if (s.subEtag) {
    for (let i = 0; i < data.items.length; i++) {
     const time = new Date(data.items[i].snippet.publishedAt).getTime();
    if (s.lastSub < time) processEvent('NewSubscriber', data.items[i]);
    /* const time = new Date(data.items[i].snippet.publishedAt).getTime();
    const sub = data.items[i].subscriberSnippet;
    if (s.lastSub < time) LBTriggerExt('YT Live Subscriber', sub.title, sub.channelId, sub.thumbnails.default.url); */
    }
    }
    s.subEtag = data.etag;
    s.lastSub = new Date(data.items[0].snippet.publishedAt).getTime();
    }
    s.subTimeout = setTimeout(() => {
    listenToSubs();
       }, 1 * minute);
    }
    
    // listen to all chat events
    async function listenToChat() {
    let timeout = s.myBroadcastInfo.concurrentViewers > 10 ? 2000 : s.myBroadcastInfo.concurrentViewers > 3 ? 5000 : 10000;
    // p.chatID = 'Cg0KC0piRk1qQzg0SnY4KicKGFVDWVJZNzQ4enhtY19XTnJuQjZVekpwZxILSmJGTWpDODRKdjg';
    if (s.chatTimeout) clearTimeout(s.chatTimeout);
    const pageToken = s.chatPageToken || '';
    const chatListenUrl = `liveChat/messages?part=snippet&part=authorDetails&liveChatId=${p.chatID}&pageToken=${pageToken}&profileImageSize=500`;
    await fetchYouTube(chatListenUrl)
    .then((data) => {
    if (s.chatPageToken) {
    for (let i = 0; i < data.items.length; i++) {
        const msg = data.items[i];
        if (s.ignoreMessages.includes(msg.id)) {
          if (s.ignoreMessages.indexOf(msg.id) === (s.ignoreMessages.length - 1)) s.ignoreMessages = [];
          continue;
        }
    
      y.channelIds[msg.authorDetails.displayName.toLowerCase()] = msg.authorDetails.channelId;
      processEvent('chat', msg);
    }
    }
    errcount = 0;
    timeout = (data.pollingIntervalMillis > timeout) ? data.pollingIntervalMillis : timeout;
    s.chatPageToken = data.nextPageToken;
    })
    .catch((e) => {
    errcount += 1;
    if (e.reason === 'pageTokenInvalid') s.chatPageToken = '';
    else if (e.reason === 'liveChatEnded') {
    errcount = 100;
    LBTriggerExt('YT Live Chat Ended');
    changeStatus('Chat Ended.', 'red');
    if (s.subTimeout) clearTimeout(s.subTimeout);
    if (s.broadcastStatsTimeout) clearTimeout(s.broadcastStatsTimeout);
    } else {
    errorHandler('Chat Listener', e.message);
    changeStatus('Chat Listener Error', 'orange');
    }
    });
    if (errcount < 20) {
      s.chatTimeout = setTimeout(() => {
      listenToChat();
        }, timeout);
    }
    }
    
    // process all incoming chat text messages
    function processChatMsg(msg) {
      const badge = [];
      if (msg.authorDetails.isChatOwner)badge.push('broadcaster/1');
        if (msg.authorDetails.isChatModerator)badge.push('moderator/1');
        if (msg.authorDetails.isChatSponsor)badge.push('subscriber/1');
      if (msg.authorDetails.isVerified)badge.push('vip/1');
                  const LBMessage = {
                emotes: msg.authorDetails.profileImageUrl,
                login: msg.authorDetails.displayName.toLowerCase(),
                display_name: msg.authorDetails.displayName,
                user_id: msg.authorDetails.channelId,
                color: 0,
                badge: badge.join(','),
                message: msg.snippet.textMessageDetails.messageText.replace(/"/g, "'"),
                channel: msg.authorDetails.channelUrl,
                topic: 'chatmessage',
                type: 'MESSAGE',
                };
                 lioranboardclient.send(JSON.stringify(LBMessage));
    }
    
    // generic function to call youtube api
    async function fetchYouTube(fetchUrl, resource = null, method = 'GET', body = null) {
    const d = {
    method,
    headers: { Authorization: `Bearer ${p.accessToken}` },
    };
    if (resource && y[resource] && y[resource].etag) d.headers['If-None-Match'] = y[resource].etag;
    if (body) d.body = JSON.stringify(body);
    const response = await fetch(`https://www.googleapis.com/youtube/v3/${fetchUrl}`, d);
    let content;
    try { content = await response.json(); } catch (e) {}
    if (!response.ok) {
        if (response.status === 304) content = y[resource];
        else {
        console.log(content?.error?.message);
        const reason = content?.error.errors[0].reason;
        const message = content?.error?.message || content?.error || 'Something went wrong.';
        const error = { reason, message };
        throw error;
      }
      }
      if (resource) y[resource] = content;
    return content;
    }
    
    // change status in Transmitter and Streamdeck
    function changeStatus(status, color) {
    const divClass = color === 'red' ? 'text-danger' : color === 'orange' ? 'text-warning' : color === 'blue' ? 'text-info' : color === 'green' ? 'text-success' : 'text-light';
    s.status = [status, color];
    LBTriggerExt('YTLiveStatus', status, btnColors[color][0], btnColors[color][1], btnColors[color][2]);
    document.getElementById('ytLiveConnection').innerHTML = `<b>Status:</b> <span class="${divClass}">${status}</span>`;
    if (ytLiveConnectionTSL) {
    document.getElementById('ytLiveConnectionTSL').innerHTML = `<span class="${divClass} d-none d-md-inline-flex" id="ytLiveConnectionTSL">${status}</span>`;
    document.getElementById('toYtLive_circle').setAttribute('fill', (color === 'blue') ? '#a3e1ff' : color);
    }
    }
    
    // handle various errors and display/save them
    function errorHandler(type, error, popup = false) {
    const err = `YouTube Live ${type} error: ${error}`;
    if (popup) LBPopUp(replaceSymbols(err)); else { LBAlert(replaceSymbols(err)); }
    LBTriggerExt('YTLiveErrors');
    s.errors.push({ [type]: error });
    ytLiveErrorsSave.setAttribute('class', 'ms-2 text-decoration-none');
    ytLiveErrors.innerHTML = s.errors.length;
    }
    
    function errorsSave() {
      const ytLiveErrorDiv = document.getElementById('ytLiveErrorDiv');
      const errorStr = JSON.stringify(s.errors);
      const hiddenElement = document.createElement('a');
      hiddenElement.href = `data:attachment/text,${encodeURI(errorStr)}`;
      hiddenElement.target = '_blank';
      hiddenElement.download = 'YouTube Live Error Log.json';
      ytLiveErrorDiv.appendChild(hiddenElement);
      hiddenElement.click();
      hiddenElement.remove();
    }
    
    // replace symbols LB doesn't like parsing
    function replaceSymbols(str) {
    str = str.replace(/(?:\r\n|\r|\n)/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    str = str.toString().replace(/"/g, "'").replace(/\//g, '/').replace(/\\/g, '\\\\');
    return str;
        }
    }
/* TalentVerse Meet – room (own UI on top of LiveKit) */
(function () {
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const ROOM_ID = (params.get('r') || '').trim();
  let USER = null, ROOM = null, hintRole = 'audience', lk = null, joined = false;
  let pre = { mic: true, cam: true, stream: null };
  let hands = new Set(), unreadChat = 0, sideTab = 'chat', sideOpen = false, hbTimer = null, roomUnsub = null;
  const tiles = new Map();           // identity -> tile element
  const L = () => window.LivekitClient;

  function show(id) { ['v-msg', 'v-pre', 'v-call'].forEach(x => $(x).classList.toggle('hidden', x !== id)); document.body.classList.toggle('inroom', id === 'v-call'); }
  function msg(h, p) { $('msg-h').textContent = h; $('msg-p').textContent = p || ''; show('v-msg'); }
  const initial = n => ((n || '?').trim()[0] || '?').toUpperCase();

  /* ---------- start ---------- */
  mWatchAuth(async user => {
    if (joined) return;
    if (!user) { location.replace('index.html'); return; }
    USER = user;
    if (!ROOM_ID) return msg('Room not found', 'This link is not complete.');
    const cfg = window.MEET_CONFIG || {};
    if (!cfg.livekitUrl || !cfg.tokenUrl) return msg('Meetings are not set up yet', 'The admin needs to finish the setup (meet/config.js).');
    const { doc, getDoc, onSnapshot } = window.firebaseFunctions;
    try {
      const s = await getDoc(doc(window.firebaseDB, 'meet_rooms', ROOM_ID));
      if (!s.exists()) return msg('Room not found', 'It may have been deleted.');
      ROOM = { id: s.id, ...s.data() };
    } catch (e) { return msg('Could not open the room', 'Please check your connection and sign in again.'); }
    if (ROOM.status === 'ended') return msg('This session has ended', ROOM.title || '');
    const email = (USER.email || '').toLowerCase();
    const isHost = email === window.MEET_MAIN_EMAIL || email === (ROOM.hostEmail || '').toLowerCase();
    const isSpeaker = (ROOM.speakers || []).map(x => String(x).toLowerCase()).includes(email);
    hintRole = isHost ? 'host' : isSpeaker ? 'speaker' : 'audience';
    // watch status (waiting room + ended)
    roomUnsub = onSnapshot(doc(window.firebaseDB, 'meet_rooms', ROOM_ID), snap => {
      if (!snap.exists()) return;
      ROOM = { id: snap.id, ...snap.data() };
      if (ROOM.status === 'ended' && joined) { leave('The host ended this session.'); }
      updateJoinBtn();
    });
    setupPre();
  });

  /* ---------- pre-join ---------- */
  function canPublishHint() { return ROOM.mode === 'meeting' || hintRole !== 'audience'; }
  function setupPre() {
    $('pre-title').textContent = ROOM.title || 'Room';
    $('pre-sub').textContent = (ROOM.mode === 'seminar' ? 'Seminar' : 'Meeting') + (ROOM.startAt ? ' · ' + mFmtTime(ROOM.startAt) : '');
    $('pre-name').value = USER.displayName || (USER.email || '').split('@')[0];
    $('pv-ph').textContent = initial($('pre-name').value);
    $('pre-name').addEventListener('input', () => { $('pv-ph').textContent = initial($('pre-name').value); });
    const cp = canPublishHint();
    $('pre-toggles').classList.toggle('hidden', !cp);
    $('pv').classList.toggle('hidden', !cp);
    $('pre-note').textContent = cp ? (ROOM.mode === 'seminar' ? 'You are joining as ' + hintRole + '.' : 'Check your camera and microphone before joining.') :
      'This is a seminar — you will join as audience. You can use chat and raise your hand to ask something.';
    if (cp) { refreshPreBtns(); startPreview(); }
    $('pre-mic').onclick = () => { pre.mic = !pre.mic; refreshPreBtns(); };
    $('pre-cam').onclick = () => { pre.cam = !pre.cam; refreshPreBtns(); pre.cam ? startPreview() : stopPreview(); };
    $('join-btn').onclick = join;
    updateJoinBtn();
    show('v-pre');
  }
  function refreshPreBtns() {
    $('pre-mic').classList.toggle('off', !pre.mic); $('pre-mic').textContent = pre.mic ? '🎤' : '🔇';
    $('pre-cam').classList.toggle('off', !pre.cam); $('pre-cam').textContent = pre.cam ? '📷' : '🚫';
  }
  async function startPreview() {
    if (!pre.cam || pre.stream || !navigator.mediaDevices) return;
    try {
      pre.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const v = $('pv-vid'); v.srcObject = pre.stream; v.classList.remove('hidden'); $('pv-ph').classList.add('hidden');
    } catch (e) { pre.cam = false; refreshPreBtns(); }
  }
  function stopPreview() {
    if (pre.stream) { pre.stream.getTracks().forEach(t => t.stop()); pre.stream = null; }
    $('pv-vid').classList.add('hidden'); $('pv-ph').classList.remove('hidden');
  }
  function updateJoinBtn() {
    const b = $('join-btn'); if (!b || joined) return;
    const waiting = ROOM.status !== 'live' && hintRole !== 'host';
    b.disabled = waiting;
    b.textContent = waiting ? 'Waiting for the host to start…' : (hintRole === 'host' && ROOM.status !== 'live' ? 'Start & join' : 'Join');
  }

  /* ---------- join ---------- */
  async function join() {
    const btn = $('join-btn'); $('join-err').textContent = ''; btn.disabled = true; btn.textContent = 'Connecting…';
    const name = ($('pre-name').value || '').trim().slice(0, 40) || 'Guest';
    try {
      if (hintRole === 'host' && ROOM.status !== 'live') {
        const { doc, updateDoc } = window.firebaseFunctions;
        await updateDoc(doc(window.firebaseDB, 'meet_rooms', ROOM_ID), { status: 'live' }).catch(() => {});
      }
      const t = await api({ action: 'join', room: ROOM_ID, name });
      stopPreview();
      lk = new (L().Room)({ adaptiveStream: true, dynacast: true });
      bindEvents();
      await lk.connect(window.MEET_CONFIG.livekitUrl, t.token);
      joined = true; window.__lk = lk;
      $('c-title').textContent = ROOM.title || 'Room';
      show('v-call');
      const wantPub = t.canPublish;
      applyControlState();
      if (wantPub) {
        if (pre.mic) await lk.localParticipant.setMicrophoneEnabled(true).catch(() => mToast('Microphone is blocked.', true));
        if (pre.cam) await lk.localParticipant.setCameraEnabled(true).catch(() => mToast('Camera is blocked.', true));
      }
      try { await lk.startAudio(); } catch (e) {}
      renderAll();
      startAttendance(name);
    } catch (e) {
      console.error(e);
      const map = { 'not-live': 'The host has not started this session yet.', 'ended': 'This session has ended.', unauthorized: 'Please sign in again.', 'not-configured': 'The meeting server is not set up yet.' };
      $('join-err').textContent = map[e.message] || 'Could not join. Please try again.';
      btn.disabled = false; updateJoinBtn();
      if (lk) { try { lk.disconnect(); } catch (x) {} lk = null; }
    }
  }
  async function api(body) {
    const idToken = await window.firebaseAuth.currentUser.getIdToken();
    const res = await fetch(window.MEET_CONFIG.tokenUrl, { method: 'POST', body: JSON.stringify({ ...body, idToken }) });
    const d = await res.json();
    if (!d.success) throw new Error(d.error || 'failed');
    return d;
  }

  /* ---------- LiveKit events ---------- */
  function bindEvents() {
    const E = L().RoomEvent;
    lk.on(E.ParticipantConnected, renderAll)
      .on(E.ParticipantDisconnected, p => { hands.delete(p.identity); renderAll(); })
      .on(E.TrackSubscribed, (track) => { if (track.kind === 'audio') { const el = track.attach(); el.style.display = 'none'; document.body.appendChild(el); } renderAll(); })
      .on(E.TrackUnsubscribed, (track) => { track.detach(); renderAll(); })
      .on(E.TrackMuted, renderAll).on(E.TrackUnmuted, renderAll)
      .on(E.LocalTrackPublished, renderAll).on(E.LocalTrackUnpublished, renderAll)
      .on(E.ParticipantMetadataChanged, renderAll)
      .on(E.ActiveSpeakersChanged, sp => {
        const ids = new Set(sp.map(s => s.identity));
        tiles.forEach((el, id) => el.classList.toggle('speaking', ids.has(id)));
      })
      .on(E.ParticipantPermissionsChanged, (prev, p) => { if (p === lk.localParticipant) onMyPermissions(prev); renderAll(); })
      .on(E.DataReceived, onData)
      .on(E.AudioPlaybackStatusChanged, () => { if (!lk.canPlaybackAudio) $('perm-note').textContent = 'Tap anywhere to turn on sound.'; $('perm-note').classList.toggle('hidden', lk.canPlaybackAudio); })
      .on(E.Disconnected, reason => { if (joined) leave(reason === L().DisconnectReason?.PARTICIPANT_REMOVED ? 'You were removed by the host.' : 'You were disconnected.'); });
    document.body.addEventListener('click', () => { if (lk && !lk.canPlaybackAudio) lk.startAudio().catch(() => {}); });
  }
  function myRole() { try { return JSON.parse(lk.localParticipant.metadata || '{}').role || hintRole; } catch (e) { return hintRole; } }
  function roleOf(p) { try { return JSON.parse(p.metadata || '{}').role || 'audience'; } catch (e) { return 'audience'; } }
  function onStage(p) { return ROOM.mode === 'meeting' || (p.permissions && p.permissions.canPublish); }
  function iCanPublish() { return !!(lk && lk.localParticipant.permissions && lk.localParticipant.permissions.canPublish); }
  async function onMyPermissions(prev) {
    applyControlState();
    if (iCanPublish() && !(prev && prev.canPublish)) {
      mToast('You are now on stage 🎤');
      hands.delete(lk.localParticipant.identity); setHandBtn(false);
      await lk.localParticipant.setMicrophoneEnabled(true).catch(() => {});
    } else if (!iCanPublish() && prev && prev.canPublish) mToast('You moved back to the audience.');
  }

  /* ---------- rendering ---------- */
  function allParticipants() { return [lk.localParticipant, ...Array.from(lk.remoteParticipants.values())]; }
  function renderAll() {
    if (!lk) return;
    const Track = L().Track;
    const ps = allParticipants();
    $('c-count').textContent = '👥 ' + ps.length;
    const stageList = ps.filter(onStage);
    const keep = new Set();
    const grid = $('grid');
    // screen share
    let screenTrack = null;
    for (const p of ps) { const pub = p.getTrackPublication(Track.Source.ScreenShare); if (pub && pub.track && !pub.isMuted) { screenTrack = pub.track; break; } }
    const sc = $('screen');
    if (screenTrack) {
      if (sc._t !== screenTrack) { sc.innerHTML = ''; sc.appendChild(screenTrack.attach()); sc._t = screenTrack; }
      sc.classList.remove('hidden');
    } else { sc.classList.add('hidden'); sc.innerHTML = ''; sc._t = null; }
    $('stage').classList.toggle('hasscreen', !!screenTrack);
    stageList.forEach(p => {
      keep.add(p.identity);
      let el = tiles.get(p.identity);
      if (!el) {
        el = document.createElement('div'); el.className = 'tile' + (p.isLocal ? ' me' : '');
        el.innerHTML = '<div class="av"></div><div class="nm"></div><div class="st"></div>';
        tiles.set(p.identity, el); grid.appendChild(el);
      }
      const nm = (p.name || p.identity) + (p.isLocal ? ' (You)' : '');
      el.querySelector('.nm').textContent = nm;
      el.querySelector('.av').textContent = initial(p.name || p.identity);
      const role = roleOf(p);
      el.querySelector('.st').innerHTML = (role === 'host' ? '<span>Host</span>' : '') + (p.isMicrophoneEnabled ? '' : '<span>🔇</span>') + (hands.has(p.identity) ? '<span>✋</span>' : '');
      const pub = p.getTrackPublication(Track.Source.Camera);
      const tr = pub && pub.track && !pub.isMuted ? pub.track : null;
      let v = el.querySelector('video');
      if (tr) {
        if (!v || el._t !== tr) { if (v) v.remove(); v = tr.attach(); v.setAttribute('playsinline', ''); el.insertBefore(v, el.firstChild); el._t = tr; }
        el.querySelector('.av').style.display = 'none';
      } else { if (v) v.remove(); el._t = null; el.querySelector('.av').style.display = ''; }
    });
    tiles.forEach((el, id) => { if (!keep.has(id)) { el.remove(); tiles.delete(id); } });
    grid.classList.toggle('one', tiles.size === 1);
    renderPeople();
    $('hand-dot').textContent = hands.size; $('hand-dot').classList.toggle('hidden', !hands.size);
    $('b-ppl').title = 'People';
  }
  function renderPeople() {
    if (!lk) return;
    const iAmHost = myRole() === 'host';
    const rows = allParticipants().map(p => {
      const role = roleOf(p), stage = onStage(p), self = p.isLocal;
      let acts = '';
      if (iAmHost && !self) {
        if (ROOM.mode === 'seminar') acts += stage ? `<button class="btn sm ghost" data-a="demote" data-i="${mEsc(p.identity)}">To audience</button>` : `<button class="btn sm green" data-a="promote" data-i="${mEsc(p.identity)}">Bring on stage</button>`;
        acts += `<button class="btn sm red" data-a="remove" data-i="${mEsc(p.identity)}">Remove</button>`;
      }
      return `<div class="pl"><div>${mEsc(p.name || p.identity)}${self ? ' (You)' : ''} ${hands.has(p.identity) ? '✋' : ''}<small>${role === 'host' ? 'Host' : stage && ROOM.mode === 'seminar' ? 'Speaker' : ROOM.mode === 'seminar' ? 'Audience' : 'Participant'}</small></div><div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">${acts}</div></div>`;
    });
    $('pane-ppl').innerHTML = rows.join('');
  }
  $('pane-ppl').addEventListener('click', async e => {
    const b = e.target.closest('button[data-a]'); if (!b) return;
    const a = b.dataset.a, id = b.dataset.i;
    if (a === 'remove' && !confirm('Remove this person from the room?')) return;
    b.disabled = true;
    try { await api({ action: a, room: ROOM_ID, identity: id }); if (a === 'promote') hands.delete(id); renderAll(); }
    catch (err) { mToast('Could not do that (' + err.message + ').', true); b.disabled = false; }
  });

  /* ---------- controls ---------- */
  function applyControlState() {
    const can = iCanPublish();
    ['b-mic', 'b-cam', 'b-scr'].forEach(id => { $(id).classList.toggle('hidden', !can); });
    if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) $('b-scr').classList.add('hidden');
    $('b-hand').classList.toggle('hidden', can || ROOM.mode !== 'seminar');
    syncBtns();
  }
  function syncBtns() {
    if (!lk) return;
    const lp = lk.localParticipant;
    $('b-mic').classList.toggle('off', !lp.isMicrophoneEnabled); $('b-mic').textContent = lp.isMicrophoneEnabled ? '🎤' : '🔇';
    $('b-cam').classList.toggle('off', !lp.isCameraEnabled); $('b-cam').textContent = lp.isCameraEnabled ? '📷' : '🚫';
    $('b-scr').classList.toggle('on', lp.isScreenShareEnabled);
  }
  setInterval(syncBtns, 700);
  $('b-mic').onclick = async () => { try { await lk.localParticipant.setMicrophoneEnabled(!lk.localParticipant.isMicrophoneEnabled); } catch (e) { mToast('Microphone is blocked.', true); } syncBtns(); renderAll(); };
  $('b-cam').onclick = async () => { try { await lk.localParticipant.setCameraEnabled(!lk.localParticipant.isCameraEnabled); } catch (e) { mToast('Camera is blocked.', true); } syncBtns(); renderAll(); };
  $('b-scr').onclick = async () => { try { await lk.localParticipant.setScreenShareEnabled(!lk.localParticipant.isScreenShareEnabled); } catch (e) {} syncBtns(); renderAll(); };
  let handUp = false;
  function setHandBtn(on) { handUp = on; $('b-hand').classList.toggle('on', on); }
  $('b-hand').onclick = () => { setHandBtn(!handUp); sendData('hand', { on: handUp }); if (handUp) hands.add(lk.localParticipant.identity); else hands.delete(lk.localParticipant.identity); renderAll(); };
  $('b-leave').onclick = () => { if (confirm('Leave this room?')) leave(); };
  $('b-chat').onclick = () => toggleSide('chat'); $('b-ppl').onclick = () => toggleSide('ppl');
  $('tab-chat').onclick = () => setTab('chat'); $('tab-ppl').onclick = () => setTab('ppl');
  function toggleSide(tab) { if (sideOpen && sideTab === tab) { sideOpen = false; } else { sideOpen = true; setTab(tab); } $('side').classList.toggle('hidden', !sideOpen); }
  function setTab(t) {
    sideTab = t; sideOpen = true; $('side').classList.remove('hidden');
    $('tab-chat').classList.toggle('on', t === 'chat'); $('tab-ppl').classList.toggle('on', t === 'ppl');
    $('pane-chat').classList.toggle('hidden', t !== 'chat'); $('cin').classList.toggle('hidden', t !== 'chat'); $('pane-ppl').classList.toggle('hidden', t !== 'ppl');
    if (t === 'chat') { unreadChat = 0; $('chat-dot').classList.add('hidden'); }
  }

  /* ---------- chat / hands (LiveKit data messages) ---------- */
  function sendData(topic, obj) {
    try { lk.localParticipant.publishData(new TextEncoder().encode(JSON.stringify(obj)), { reliable: true, topic }); } catch (e) { console.error(e); }
  }
  function addMsg(name, text, mine) {
    const m = document.createElement('div'); m.className = 'msg' + (ROOM.mode === 'seminar' ? ' q' : '');
    m.innerHTML = '<b></b><span></span>'; m.querySelector('b').textContent = mine ? 'You' : name; m.querySelector('span').textContent = text;
    const box = $('msgs'); box.appendChild(m); $('pane-chat').scrollTop = 1e9;
  }
  $('chat-send').onclick = sendChat; $('chat-in').addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });
  function sendChat() {
    const t = $('chat-in').value.trim().slice(0, 400); if (!t) return;
    sendData('chat', { t }); addMsg('', t, true); $('chat-in').value = '';
  }
  function onData(payload, participant, kind, topic) {
    let d; try { d = JSON.parse(new TextDecoder().decode(payload)); } catch (e) { return; }
    const id = participant && participant.identity;
    if (topic === 'chat' && d.t) {
      addMsg((participant && (participant.name || participant.identity)) || 'Guest', String(d.t).slice(0, 400), false);
      if (!(sideOpen && sideTab === 'chat')) { unreadChat++; $('chat-dot').textContent = unreadChat > 9 ? '9+' : unreadChat; $('chat-dot').classList.remove('hidden'); }
    } else if (topic === 'hand' && id) {
      if (d.on) hands.add(id); else hands.delete(id);
      renderAll();
    }
  }

  /* ---------- attendance (used for certificates later) ---------- */
  function startAttendance(name) {
    const { doc, setDoc, increment } = window.firebaseFunctions;
    const ref = doc(window.firebaseDB, 'meet_rooms', ROOM_ID, 'attendance', USER.uid);
    const base = { uid: USER.uid, name, email: (USER.email || '').toLowerCase() };
    setDoc(ref, { ...base, lastJoin: Date.now(), lastSeen: Date.now() }, { merge: true }).catch(() => {});
    hbTimer = setInterval(() => setDoc(ref, { lastSeen: Date.now(), seconds: increment(60) }, { merge: true }).catch(() => {}), 60000);
  }

  /* ---------- leave ---------- */
  function leave(message) {
    if (hbTimer) { clearInterval(hbTimer); hbTimer = null; }
    const was = joined; joined = false;
    try { if (lk) lk.disconnect(); } catch (e) {}
    lk = null; tiles.clear(); stopPreview();
    document.querySelectorAll('audio').forEach(a => a.remove());
    if (roomUnsub) { roomUnsub(); roomUnsub = null; }
    if (was || message) { msg(message || 'You left the room', ROOM && ROOM.title || ''); }
  }
  window.addEventListener('beforeunload', () => { try { if (lk) lk.disconnect(); } catch (e) {} });
})();

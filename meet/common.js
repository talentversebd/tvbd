/* TalentVerse Meet – shared helpers */
window.MEET_MAIN_EMAIL = 'talentversebangladesh@gmail.com';
window.mEsc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
window.mToast = function (msg, err) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = (err ? '⚠️ ' : '') + msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3200);
};
window.mReady = function () {
  return new Promise((res, rej) => {
    let n = 0;
    const t = setInterval(() => {
      if (window.firebaseAuth && window.firebaseAuthFunctions && window.firebaseDB && window.firebaseFunctions) { clearInterval(t); res(); }
      else if (++n > 150) { clearInterval(t); rej(new Error('firebase-not-ready')); }
    }, 100);
  });
};
// Is this user allowed to create/run rooms?  (main admin, or member with the "meetings" permission)
window.mIsAdmin = async function (user) {
  if (!user) return false;
  if ((user.email || '').toLowerCase() === window.MEET_MAIN_EMAIL) return true;
  try {
    const { doc, getDoc } = window.firebaseFunctions;
    const s = await getDoc(doc(window.firebaseDB, 'member_access', user.uid));
    return s.exists() && (s.data().permissions || []).includes('meetings');
  } catch (e) { return false; }
};
// { main:true } for the main admin, { member:true, limit:N } for a member with the "meetings" permission (N rooms in total), else null
window.mAccess = async function (user) {
  if (!user) return null;
  if ((user.email || '').toLowerCase() === window.MEET_MAIN_EMAIL) return { main: true, limit: Infinity };
  try {
    const { doc, getDoc } = window.firebaseFunctions;
    const s = await getDoc(doc(window.firebaseDB, 'member_access', user.uid));
    if (s.exists() && (s.data().permissions || []).includes('meetings')) return { member: true, limit: Math.max(1, parseInt(s.data().meetLimit, 10) || 1) };
  } catch (e) {}
  return null;
};
window.mLoginError = function (e) {
  const c = (e && e.code) || '';
  if (c.includes('invalid-credential') || c.includes('wrong-password') || c.includes('user-not-found') || c.includes('invalid-email')) return 'Email or password is wrong.';
  if (c.includes('too-many-requests')) return 'Too many tries. Please wait a bit.';
  if (c.includes('network')) return 'No internet connection.';
  return 'Could not sign in. Please try again.';
};
window.mSignIn = async function (email, pass) {
  await mReady();
  return window.firebaseAuthFunctions.signInWithEmailAndPassword(window.firebaseAuth, email, pass);
};
window.mSignOut = async function () { await mReady(); await window.firebaseAuthFunctions.signOut(window.firebaseAuth); };
window.mWatchAuth = async function (cb) {
  await mReady();
  window.firebaseAuthFunctions.onAuthStateChanged(window.firebaseAuth, cb);
};
window.mFmtTime = function (ms) {
  if (!ms) return '';
  try { return new Date(ms).toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }); } catch (e) { return ''; }
};

/*===== SHARED ADMIN LOGIN (real Firebase Auth) =====
   Used by admin.html, election-admin.html and form-admin.html.
   Two kinds of people can get in:
   1) the fixed admin emails of that page (full access), and
   2) official members whose account has been given access by the main admin
      (member_access/{uid} in Firestore). They only get the pages they were given.
   Firestore security rules enforce all of this on the server. */
(function () {
  function ready() {
    return new Promise((resolve, reject) => {
      let n = 0;
      const t = setInterval(() => {
        if (window.firebaseAuth && window.firebaseAuthFunctions && window.firebaseDB && window.firebaseFunctions) { clearInterval(t); resolve(); }
        else if (++n > 150) { clearInterval(t); reject(new Error('firebase-not-ready')); }
      }, 100);
    });
  }
  const norm = e => (e || '').toLowerCase().trim();

  // Returns { all:true } for fixed admins, { all:false, perms:[...] } for members, or null.
  async function resolveAccess(user, fixedEmails, perm) {
    if (!user) return null;
    if (fixedEmails.map(norm).includes(norm(user.email))) return { all: true, perms: [] };
    try {
      const { doc, getDoc } = window.firebaseFunctions;
      const snap = await getDoc(doc(window.firebaseDB, 'member_access', user.uid));
      if (snap.exists()) {
        const perms = snap.data().permissions || [];
        if (perm ? perms.includes(perm) : perms.length > 0) return { all: false, perms };
      }
    } catch (e) { console.error('Access check failed', e); }
    return null;
  }

  window.tvbdAdminAuth = {
    async login(email, pass, fixedEmails, perm) {
      await ready();
      const { signInWithEmailAndPassword, signOut } = window.firebaseAuthFunctions;
      const cred = await signInWithEmailAndPassword(window.firebaseAuth, email, pass);
      const access = await resolveAccess(cred.user, fixedEmails, perm);
      if (!access) {
        await signOut(window.firebaseAuth);
        const e = new Error('not-admin'); e.code = 'tvbd/not-admin'; throw e;
      }
      return cred.user;
    },
    async watch(fixedEmails, onAdmin, onNone, perm) {
      await ready();
      window.firebaseAuthFunctions.onAuthStateChanged(window.firebaseAuth, async user => {
        const access = await resolveAccess(user, fixedEmails, perm);
        if (access) onAdmin(user, access); else onNone(user);
      });
    },
    async logout() {
      await ready();
      await window.firebaseAuthFunctions.signOut(window.firebaseAuth);
    },
    friendlyError(e) {
      const c = (e && e.code) || '';
      if (c === 'tvbd/not-admin') return '❌ এই অ্যাকাউন্টের এই পেজে ঢোকার অনুমতি নেই।';
      if (c === 'auth/too-many-requests') return '⏳ অনেকবার ভুল হয়েছে। কিছুক্ষণ পরে চেষ্টা করুন।';
      if (c === 'auth/network-request-failed') return '📶 ইন্টারনেট সংযোগ চেক করুন।';
      if (c.startsWith('auth/')) return '❌ Incorrect email or password!';
      if (e && e.message === 'firebase-not-ready') return '⚠️ Firebase লোড হয়নি। পেজ রিফ্রেশ করুন।';
      return '❌ Login failed: ' + ((e && e.message) || 'unknown error');
    }
  };
})();

/*===== SHARED ADMIN LOGIN (real Firebase Auth) =====
   Used by admin.html, election-admin.html and form-admin.html.
   No passwords live in the code. Firebase checks the password, and the
   Firestore security rules decide which email may read/write what. */
(function () {
  function ready() {
    return new Promise((resolve, reject) => {
      let n = 0;
      const t = setInterval(() => {
        if (window.firebaseAuth && window.firebaseAuthFunctions) { clearInterval(t); resolve(); }
        else if (++n > 150) { clearInterval(t); reject(new Error('firebase-not-ready')); }
      }, 100);
    });
  }
  const norm = e => (e || '').toLowerCase().trim();
  const isAllowed = (user, allowed) => !!user && allowed.map(norm).includes(norm(user.email));

  window.tvbdAdminAuth = {
    async login(email, pass, allowed) {
      await ready();
      const { signInWithEmailAndPassword, signOut } = window.firebaseAuthFunctions;
      const cred = await signInWithEmailAndPassword(window.firebaseAuth, email, pass);
      if (!isAllowed(cred.user, allowed)) {
        await signOut(window.firebaseAuth);
        const e = new Error('not-admin'); e.code = 'tvbd/not-admin'; throw e;
      }
      return cred.user;
    },
    async watch(allowed, onAdmin, onNone) {
      await ready();
      window.firebaseAuthFunctions.onAuthStateChanged(window.firebaseAuth, user => {
        if (isAllowed(user, allowed)) onAdmin(user); else onNone(user);
      });
    },
    async logout() {
      await ready();
      await window.firebaseAuthFunctions.signOut(window.firebaseAuth);
    },
    friendlyError(e) {
      const c = (e && e.code) || '';
      if (c === 'tvbd/not-admin') return '❌ এই অ্যাকাউন্টের অ্যাডমিন অনুমতি নেই।';
      if (c === 'auth/too-many-requests') return '⏳ অনেকবার ভুল হয়েছে। কিছুক্ষণ পরে চেষ্টা করুন।';
      if (c === 'auth/network-request-failed') return '📶 ইন্টারনেট সংযোগ চেক করুন।';
      if (c.startsWith('auth/')) return '❌ Incorrect email or password!';
      if (e && e.message === 'firebase-not-ready') return '⚠️ Firebase লোড হয়নি। পেজ রিফ্রেশ করুন।';
      return '❌ Login failed: ' + ((e && e.message) || 'unknown error');
    }
  };
})();

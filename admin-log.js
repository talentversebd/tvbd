/*===== ADMIN ACTIVITY LOG =====
   Loaded only on the admin pages. It wraps the data-changing functions of data.js:
   after every SUCCESSFUL add / edit / delete the person's email, the section, the item
   and the time are saved to the admin_logs collection. Only the main admin can read it. */
(function () {
  const clip = (v, n) => String(v == null ? '' : v).slice(0, n);
  const T = ['title', 'name', 'caption'];

  function eventTitle(id) {
    try { const o = (window.getOlympiads() || []).find(x => x.id === id); return o ? o.title : id; } catch (e) { return id; }
  }
  const certLabel = c => `${(c && c.name) || ''} (${(c && c.certId) || ''})`;
  const subLabel = (a, f) => f ? `${f.name || f.email || ''}${f.quizTitle ? ' — ' + f.quizTitle : ''}` : '';

  const SPEC = {
    updateHome:           { section: 'Home Page', action: 'edit', fixed: 'Home page content' },

    addOlympiad:          { section: 'Events', action: 'add', obj: 0, keys: T },
    updateOlympiad:       { section: 'Events', action: 'edit', id: 0, obj: 1, list: 'getOlympiads', keys: T },
    deleteOlympiadData:   { section: 'Events', action: 'delete', id: 0, list: 'getOlympiads', keys: T },

    addGallery:           { section: 'Gallery', action: 'add', obj: 0, keys: T },
    updateGallery:        { section: 'Gallery', action: 'edit', id: 0, obj: 1, list: 'getGallery', keys: T },
    deleteGalleryData:    { section: 'Gallery', action: 'delete', id: 0, list: 'getGallery', keys: T },

    addNews:              { section: 'News', action: 'add', obj: 0, keys: T },
    updateNews:           { section: 'News', action: 'edit', id: 0, obj: 1, list: 'getNews', keys: T },
    deleteNewsData:       { section: 'News', action: 'delete', id: 0, list: 'getNews', keys: T },

    addTeamMember:        { section: 'Team', action: 'add', obj: 0, keys: T },
    updateTeamMember:     { section: 'Team', action: 'edit', id: 0, obj: 1, list: 'getTeam', keys: T },
    deleteTeamMember:     { section: 'Team', action: 'delete', id: 0, list: 'getTeam', keys: T },

    addNetworkPage:       { section: 'Our Network', action: 'add', obj: 0, keys: T },
    updateNetworkPage:    { section: 'Our Network', action: 'edit', id: 0, obj: 1, list: 'getNetworkPages', keys: T },
    deleteNetworkPage:    { section: 'Our Network', action: 'delete', id: 0, list: 'getNetworkPages', keys: T },

    addQuiz:              { section: 'Quizzes', action: 'add', obj: 0, keys: T },
    updateQuiz:           { section: 'Quizzes', action: 'edit', id: 0, obj: 1, list: 'getQuizzes', keys: T },
    deleteQuiz:           { section: 'Quizzes', action: 'delete', id: 0, list: 'getQuizzes', keys: T },
    gradeQuizSubmission:  { section: 'Quiz Submissions', action: 'grade', id: 0, list: 'getQuizSubmissions', label: subLabel, details: a => 'Short-answer score: ' + a[1] },
    deleteQuizSubmission: { section: 'Quiz Submissions', action: 'delete', id: 0, list: 'getQuizSubmissions', label: subLabel },

    deleteMessage:        { section: 'Messages', action: 'delete', id: 0, list: 'getMessages', label: (a, f) => f ? `${f.name || ''} — ${f.subject || f.email || ''}` : '' },
    deleteRegistration:   { section: 'Registrations', action: 'delete', id: 0, list: 'getRegistrations', label: (a, f) => f ? `${f.name || ''} — ${f.olympiad || ''}` : '' },

    addCertificate:       { section: 'Certificates', action: 'add', label: a => certLabel(a[0]) },
    updateCertificate:    { section: 'Certificates', action: 'edit', id: 0, list: 'getCertificates', label: (a, f) => certLabel(Object.assign({}, f || {}, a[1] || {})) },
    deleteCertificate:    { section: 'Certificates', action: 'delete', id: 0, list: 'getCertificates', label: (a, f) => f ? certLabel(f) : '' },
    addCertificatesBulk:  { section: 'Certificates', action: 'bulk add', label: a => `${(a[0] || []).length} certificates`, details: a => (a[0] && a[0][0]) ? a[0][0].event : '' },
    saveCertTemplate:     { section: 'Certificate Template', action: 'edit', label: a => a[1] ? eventTitle(a[1]) : 'Default design' },
    removeCertTemplate:   { section: 'Certificate Template', action: 'delete', label: a => a[0] ? eventTitle(a[0]) : 'Default design' },

    updateRegistrationSettings: { section: 'Settings', action: 'edit', fixed: 'Registration settings' },
    updatePopupSettings:  { section: 'Popup Notice', action: 'edit', fixed: 'Popup notice' },
    updateFounderSettings:{ section: "Founder's Message", action: 'edit', fixed: "Founder's message" },
    updateElectionSettings:{ section: 'Election', action: 'edit', fixed: 'Election settings' },
    addElectionCandidate: { section: 'Election', action: 'add', obj: 0, keys: T },
    updateElectionCandidate:{ section: 'Election', action: 'edit', id: 0, obj: 1, list: 'getElectionCandidates', keys: T },
    deleteElectionCandidate:{ section: 'Election', action: 'delete', id: 0, list: 'getElectionCandidates', keys: T },

    addCustomForm:        { section: 'Forms', action: 'add', obj: 0, keys: T },
    updateCustomForm:     { section: 'Forms', action: 'edit', id: 0, obj: 1, list: 'getCustomForms', keys: T },
    deleteCustomForm:     { section: 'Forms', action: 'delete', id: 0, list: 'getCustomForms', keys: T },
    deleteFormResponse:   { section: 'Forms', action: 'delete response', fixed: 'Form response' },

    secureAllQuizzes:     { section: 'Quizzes', action: 'secure', fixed: 'All quizzes (answers hidden)' },
    autoGradeQuizzes:     { section: 'Quiz Submissions', action: 'auto-grade', fixed: 'MCQ answers' },

    addAnnouncement:      { section: 'Notifications', action: 'add', label: a => a[0] || '', details: a => (a[1] || '').slice(0, 120) },
    deleteAnnouncement:   { section: 'Notifications', action: 'delete', id: 0, list: 'getAnnouncements', keys: T },
    addNotificationRecord:{ section: 'Email Notifications', action: 'send', label: a => (a[0] && (a[0].subject || a[0].title)) || 'Email campaign', details: a => (a[0] && (a[0].audience || a[0].recipients)) ? String(a[0].audience || a[0].recipients).slice(0, 120) : '' },

    saveEventLink:        { section: 'Events', action: 'edit', label: a => 'Group link — ' + eventTitle(a[0]) },
    publishQuizResults:   { section: 'Quiz Results', action: 'publish', label: a => { try { const q = (window.getQuizzes() || []).find(x => x.id === a[0]); return q ? q.title : String(a[0]); } catch (e) { return String(a[0]); } }, details: a => a[1] ? ('Top ' + (a[1].topN || 10) + (a[1].bySegment ? ', per segment' : '')) : '' },
    unpublishQuizResults: { section: 'Quiz Results', action: 'unpublish', label: a => { try { const q = (window.getQuizzes() || []).find(x => x.id === a[0]); return q ? q.title : String(a[0]); } catch (e) { return String(a[0]); } } },
    setRegistrationApproval:  { section: 'Registrations', action: 'approval', id: 0, list: 'getRegistrations', label: (a, f) => f ? `${f.name || ''} — ${f.olympiad || ''}` : '', details: a => a[1] },
    setRegistrationsApproval: { section: 'Registrations', action: 'bulk approval', label: a => `${(a[0] || []).length} registrations`, details: a => a[1] },
    saveMemberAccess:     { section: 'Member Access', action: 'grant', label: a => `${(a[1] && a[1].name) || ''} (${(a[1] && a[1].memberCode) || ''})`, details: a => ((a[1] && a[1].permissions) || []).join(', ') },
    removeMemberAccess:   { section: 'Member Access', action: 'revoke', label: a => {
        const m = (typeof window.getMemberAccessMap === 'function' ? window.getMemberAccessMap() : {})[a[0]];
        return m ? `${m.name || ''} (${m.memberCode || ''})` : String(a[0]);
      } }
  };

  async function write(entry) {
    try {
      if (typeof window.waitForFirebase === 'function') await window.waitForFirebase();
      const u = window.firebaseAuth && window.firebaseAuth.currentUser;
      if (!u) return;
      const { collection, addDoc } = window.firebaseFunctions;
      await addDoc(collection(window.firebaseDB, 'admin_logs'), {
        at: Date.now(), uid: u.uid, email: u.email || '',
        section: clip(entry.section, 60), action: clip(entry.action, 20),
        target: clip(entry.target, 200), details: clip(entry.details, 300)
      });
    } catch (e) { console.warn('Activity log not saved', e); }
  }

  function pick(obj, keys) {
    if (!obj) return '';
    for (const k of (keys || T)) if (obj[k]) return String(obj[k]);
    return '';
  }

  function wrap(name, spec) {
    const orig = window[name];
    if (typeof orig !== 'function' || orig.__logged) return;
    const fn = async function (...args) {
      // work out the description BEFORE the change (a deleted item is gone afterwards)
      let target = '', details = '';
      try {
        let found = null;
        if (spec.list && spec.id != null && typeof window[spec.list] === 'function') {
          found = (window[spec.list]() || []).find(x => x.id === args[spec.id]) || null;
        }
        if (spec.label) target = spec.label(args, found);
        else target = pick(spec.obj != null ? args[spec.obj] : null, spec.keys) || pick(found, spec.keys) || spec.fixed || '';
        if (spec.details) details = spec.details(args, found) || '';
      } catch (e) { /* the description is optional */ }

      const result = await orig.apply(this, args);
      const failed = result === false || (typeof result === 'number' && result < 0) || (result && (result.success === false || result.error));
      if (!failed) write({ section: spec.section, action: spec.action, target, details });
      return result;
    };
    fn.__logged = true;
    window[name] = fn;
  }

  let installed = false;
  function install() {
    if (installed) return; installed = true;
    Object.keys(SPEC).forEach(n => wrap(n, SPEC[n]));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();

  window.tvbdAdminLog = { write, _spec: SPEC, _install: install };
})();

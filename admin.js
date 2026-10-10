console.log("🚀 Admin.js loaded");

/*===== ADMIN ACCOUNT (real Firebase Auth) =====
   No password is stored in this file any more. Firebase checks the password,
   and the Firestore rules only accept this email as admin. */
const ADMIN_EMAIL = "talentversebangladesh@gmail.com";
const ADMIN_ALLOWED = [ADMIN_EMAIL];

/*===== PAGE PERMISSIONS (what the main admin can hand out to official members) =====
   key  = stored in member_access/{uid}.permissions and checked by Firestore rules
   sec  = which sidebar section it unlocks in this panel */
const PERM_CATALOG = [
  { key:'home',          label:'Home Page',                 sec:'home-ed' },
  { key:'olympiads',     label:'Olympiads / Events',        sec:'olymp-adm' },
  { key:'team',          label:'Team Members',              sec:'team-adm' },
  { key:'network',       label:'Our Network',               sec:'network-adm' },
  { key:'news',          label:'News',                      sec:'news-adm' },
  { key:'resources',     label:'Resource Hub',              sec:'resources-adm' },
  { key:'quizzes',       label:'Quizzes',                   sec:'quiz-adm' },
  { key:'qsubs',         label:'Quiz Submissions',          sec:'qsub-adm' },
  { key:'messages',      label:'Contact Messages',          sec:'msg-adm' },
  { key:'registrations', label:'Registrations',             sec:'reg-adm' },
  { key:'volunteers',    label:'Volunteer Applications',    sec:'vol-adm' },
  { key:'forum',         label:'Discussion Forum',          sec:'forum-adm' },
  { key:'certificates',  label:'Certificates',              sec:'cert-adm' },
  { key:'founder',       label:"Founder's Message",         sec:'founder-adm' },
  { key:'popup',         label:'Popup Notice',              sec:'popup-adm' },
  { key:'announce',      label:'Dashboard Notifications (bell)', sec:'bell-adm' },
  { key:'emailnotify',   label:'Email Notifications',       sec:'notify-adm' },
  { key:'forms',         label:'Form Builder (form-admin.html)',      page:true },
  { key:'election',      label:'Election Panel (election-admin.html)', page:true }
];
const SEC_PERM = {};
PERM_CATALOG.forEach(p => { if(p.sec) SEC_PERM[p.sec] = p.key; });

let adminAccess = null;
function canAdmin(key) {
  return !!adminAccess && (adminAccess.all || (adminAccess.perms || []).includes(key));
}
function secAllowed(sec) {
  if(sec === 'dash') return true;
  if(!adminAccess) return false;
  if(adminAccess.all) return true;
  const key = SEC_PERM[sec];
  return key ? canAdmin(key) : false;
}
function applyAccessToNav() {
  const nav = document.querySelector('.adm-nav');
  if(!nav) return;
  nav.querySelectorAll('.adm-nb').forEach(b => {
    b.style.display = secAllowed(b.getAttribute('data-sec')) ? '' : 'none';
  });
  let heading = null, any = false;
  const flush = () => { if(heading) heading.style.display = any ? '' : 'none'; };
  Array.from(nav.children).forEach(el => {
    if(el.classList.contains('adm-ns')) { flush(); heading = el; any = false; }
    else if(el.classList.contains('adm-nb') && el.style.display !== 'none') any = true;
  });
  flush();
}

/*===== ADMIN NAVIGATION =====*/
function openAdmin() {
  window.location.href = 'admin.html';
}
function closeAdmin() {
  window.location.href = 'index.html';
}

let adminBooted = false, adminWatching = false, adminBusy = false, adminFresh = false;

function adminShowErr(msg) {
  const err = document.getElementById('lerr');
  if(!err) return;
  err.textContent = msg;
  err.classList.add('show');
  setTimeout(() => err.classList.remove('show'), 4000);
}

function adminLoadData() {
  const run = (perm, loader, render) => {
    if(!canAdmin(perm)) return;
    if(typeof window[loader] === 'function') {
      window[loader]().then(() => { if(typeof window[render] === 'function') window[render](); });
    }
  };
  run('messages',      'loadMessages',      'renderMessagesTable');
  run('registrations', 'loadRegistrations', 'renderRegistrationsTable');
  run('volunteers',    'loadVolunteerApplications', 'renderVolunteerTable');
  run('forum',         'loadForumPosts',    'renderForumTable');
  run('certificates',  'loadCertificates',  'renderCertificatesTable');
  run('team',          'loadTeam',          'renderTeamTable');
  run('network',       'loadNetworkPages',  'renderNetworkTable');
  run('resources',     'loadResources',     'renderResourcesTable');
  run('quizzes',       'loadQuizzes',       'renderQuizTable');
}

/*===== LOGIN =====*/
async function doLogin() {
  if(adminBusy) return;
  const u = document.getElementById('lu').value.trim();
  const p = document.getElementById('lp').value;

  if(!u || !p) return adminShowErr("Please enter both email and password!");

  adminBusy = true;
  adminFresh = true;
  try {
    await tvbdAdminAuth.login(u, p, ADMIN_ALLOWED);
  } catch(e) {
    adminFresh = false;
    adminShowErr(tvbdAdminAuth.friendlyError(e));
  } finally {
    adminBusy = false;
  }
}

/*===== LOGOUT =====*/
async function doLogout() {
  try { await tvbdAdminAuth.logout(); } catch(e) {}
  window.location.href = 'index.html';
}

/*===== CHECK AUTH (runs once per page) =====*/
function checkAdminAuth() {
  if(adminWatching) return;
  adminWatching = true;
  const login = document.getElementById('adm-login');
  const shell = document.getElementById('adm-shell');

  tvbdAdminAuth.watch(ADMIN_ALLOWED,
    (user, access) => {
      adminAccess = access;
      applyAccessToNav();
      if(login) login.style.display = 'none';
      if(shell) shell.style.display = 'flex';
      if(!adminBooted) {
        adminBooted = true;
        renderAdminAll();
        adminLoadData();
        if(adminFresh) toast("Welcome back, Admin! 👋");
      }
    },
    () => {
      adminBooted = false;
      adminAccess = null;
      if(login) login.style.display = 'flex';
      if(shell) shell.style.display = 'none';
    }
  ).catch(e => adminShowErr(tvbdAdminAuth.friendlyError(e)));
}

document.addEventListener('DOMContentLoaded', checkAdminAuth);

/*===== SIDEBAR =====*/
function openSidebar() {
  document.getElementById('adm-sb').classList.add('open');
  document.getElementById('sb-ov').classList.add('open');
}
function closeSidebar() {
  document.getElementById('adm-sb').classList.remove('open');
  document.getElementById('sb-ov').classList.remove('open');
}

/*===== NAVIGATION =====*/
function goSec(btn) {
  const secId = btn.getAttribute('data-sec');
  if(!secAllowed(secId)) return toast('এই পেজে আপনার অ্যাক্সেস নেই।', true);

  document.querySelectorAll('.adm-sec').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(secId);
  if(sec) sec.classList.add('active');

  document.querySelectorAll('.adm-nb').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const titles = {
    'dash': 'Dashboard',
    'home-ed': 'Home Page Editor',
    'olymp-adm': 'Manage Olympiads',
    'gal-adm': 'Gallery Manager',
    'news-adm': 'News Updates',
    'resources-adm': 'Resource Hub',
    'quiz-adm': 'Manage Quizzes',
    'qsub-adm': 'Quiz Submissions',
    'team-adm': 'Team Members',
    'network-adm': 'Our Network',
    'founder-adm': "Founder's Message",
    'users-adm': "Registered Users",
    'log-adm': 'Activity Log',
    'msg-adm': 'Contact Messages',
    'reg-adm': 'Registrations',
    'vol-adm': 'Volunteer Applications',
    'forum-adm': 'Discussion Forum',
    'cert-adm': 'Certificates',
    'popup-adm': 'Popup Notice',
    'notify-adm': 'Email Notifications',
    'bell-adm': 'Notifications',
    'set-adm': 'System Settings'
  };
  const ptitle = document.getElementById('adm-ptitle');
  if(ptitle) ptitle.textContent = titles[secId] || secId;

  const actions = document.getElementById('adm-topbar-actions');
  if(actions) {
    actions.innerHTML = '';
    if(secId === 'home-ed') {
      actions.innerHTML = `<button class="save-btn" onclick="saveHomeEditor()">💾 Save Changes</button>`;
    } else if(secId === 'olymp-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openOlympiadForm()">+ Add Olympiad</button>`;
    } else if(secId === 'gal-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openGalleryForm()">+ Add Media</button>`;
    } else if(secId === 'news-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openNewsForm()">+ Add News</button>`;
    } else if(secId === 'resources-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openResourceForm()">+ Add Resource</button>`;
    } else if(secId === 'team-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openTeamForm()">+ Add Member</button>`;
    } else if(secId === 'network-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openNetworkForm()">+ Add Page</button>`;
    } else if(secId === 'reg-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="downloadRegistrationsCSV()">⬇️ Download CSV</button>`;
    } else if(secId === 'cert-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openCertificateForm()">+ Add Certificate</button>`;
    } else if(secId === 'quiz-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openQuizForm()">+ Add Quiz</button>`;
    }
  }

  if(secId === 'set-adm' && typeof loadRegistrationSettings === 'function') loadRegistrationSettings();
  if(secId === 'founder-adm' && typeof loadFounderSettingsUI === 'function') loadFounderSettingsUI();
  if(secId === 'users-adm' && typeof loadRegisteredUsersUI === 'function') loadRegisteredUsersUI();
  if(secId === 'log-adm') loadActivityLogUI();
  if(secId === 'popup-adm' && typeof loadPopupSettings === 'function') loadPopupSettings();
  if(secId === 'notify-adm' && typeof initNotifyPanel === 'function') initNotifyPanel();
  if(secId === 'bell-adm' && typeof initBellPanel === 'function') initBellPanel();
  if(secId === 'resources-adm' && typeof loadResources === 'function') {
    loadResources().then(() => renderResourcesTable());
  }
  if(secId === 'quiz-adm' && typeof loadQuizzes === 'function') loadQuizzes().then(() => renderQuizTable());
  if(secId === 'qsub-adm' && typeof loadQuizSubmissions === 'function') {
    Promise.all([loadQuizzes(), loadQuizSubmissions()]).then(() => renderQuizSubmissionsTable());
  }
  if(secId === 'vol-adm' && typeof loadVolunteerApplications === 'function') {
    document.getElementById('voltbl').innerHTML = `<tr class="empty-row"><td colspan="6">⏳ Loading...</td></tr>`;
    loadVolunteerApplications().then(() => renderVolunteerTable());
    loadVolFieldsDraft();
  }
  if(secId === 'forum-adm' && typeof loadForumPosts === 'function') {
    document.getElementById('forumtbl').innerHTML = `<tr class="empty-row"><td colspan="6">⏳ Loading...</td></tr>`;
    loadForumPosts().then(() => { renderForumTable(); renderDashboard(); });
  }
  if(window.innerWidth <= 700) closeSidebar();
}

/*===== RENDER ADMIN ALL =====*/
function renderAdminAll() {
  if(typeof renderDashboard === 'function') renderDashboard();
  if(typeof renderOlympiadTable === 'function') renderOlympiadTable();
  if(typeof renderGalleryTable === 'function') renderGalleryTable();
  if(typeof renderNewsTable === 'function') renderNewsTable();
  if(typeof renderResourcesTable === 'function') renderResourcesTable();
  if(typeof renderCertificatesTable === 'function') renderCertificatesTable();
  if(typeof renderTeamTable === 'function') renderTeamTable();
  if(typeof renderNetworkTable === 'function') renderNetworkTable();
  if(typeof loadHomeEditor === 'function') loadHomeEditor();
}

/*===== DASHBOARD =====*/
function renderDashboard() {
  const olympiads = typeof getOlympiads === 'function' ? getOlympiads() : [];
  const gallery = typeof getGallery === 'function' ? getGallery() : [];
  const news = typeof getNews === 'function' ? getNews() : [];
  const messages = typeof getMessages === 'function' ? getMessages() : [];
  const registrations = typeof getRegistrations === 'function' ? getRegistrations() : [];
  const certificates = typeof getCertificates === 'function' ? getCertificates() : [];

  const active = olympiads.filter(o => o.status === 'active').length;
  const upcoming = olympiads.filter(o => o.status === 'upcoming').length;
  const volunteerApps = typeof getVolunteerApplications === 'function' ? getVolunteerApplications() : [];
  const pendingVol = volunteerApps.filter(a => (a.status||'pending') === 'pending').length;
  const forumPosts = typeof getForumPosts === 'function' ? getForumPosts() : [];
  const pendingForum = forumPosts.filter(p => (p.status||'approved') === 'pending').length;
  const resources = typeof getResources === 'function' ? getResources() : [];

  const stats = document.getElementById('db-stats');
  if(stats) {
    stats.innerHTML = `
      <div class="stat-card"><div class="sl">Total Olympiads</div><div class="sv">${olympiads.length}</div></div>
      <div class="stat-card"><div class="sl">Active Now</div><div class="sv">${active}</div></div>
      <div class="stat-card"><div class="sl">Upcoming</div><div class="sv">${upcoming}</div></div>
      <div class="stat-card"><div class="sl">Gallery Items</div><div class="sv">${gallery.length}</div></div>
      <div class="stat-card"><div class="sl">News Posts</div><div class="sv">${news.length}</div></div>
      <div class="stat-card"><div class="sl">Resources</div><div class="sv" style="color:#a78bfa;">${resources.length}</div></div>
      <div class="stat-card"><div class="sl">Messages</div><div class="sv">${messages.length}</div></div>
      <div class="stat-card"><div class="sl">Registrations</div><div class="sv">${registrations.length}</div></div>
      <div class="stat-card"><div class="sl">Certificates</div><div class="sv" style="color:#4ade80;">${certificates.length}</div></div>
      <div class="stat-card"><div class="sl">Pending Volunteer Apps</div><div class="sv" style="color:#eab308;">${pendingVol}</div></div>
      <div class="stat-card"><div class="sl">Pending Forum Posts</div><div class="sv" style="color:#eab308;">${pendingForum}</div></div>
      <div class="stat-card"><div class="sl">Forum Posts</div><div class="sv">${forumPosts.length}</div></div>`;
  }
  const forumDot = document.getElementById('forum-pending-dot');
  if(forumDot) { forumDot.textContent = pendingForum; forumDot.style.display = pendingForum>0 ? 'inline-block' : 'none'; }

  const recent = document.getElementById('db-recent');
  if(recent) {
    if(olympiads.length === 0) {
      recent.innerHTML = `<tr class="empty-row"><td colspan="3">No olympiads added yet</td></tr>`;
    } else {
      recent.innerHTML = '';
      olympiads.slice(0, 5).forEach(o => {
        recent.innerHTML += `<tr><td>${o.title}</td><td><span class="bs bs-${o.status}">${o.status}</span></td><td>${o.date || 'TBA'}</td></tr>`;
      });
    }
  }
}

/*===== TABLE RENDERERS =====*/
function renderOlympiadTable() {
  const tbody = document.getElementById('otbl');
  if(!tbody) return;
  const data = getOlympiads();
  if(!data.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No olympiads yet.</td></tr>`; return; }
  tbody.innerHTML = '';
  data.forEach(o => {
    tbody.innerHTML += `<tr>
      <td>${o.img ? `<img src="${o.img}" class="thumb">` : '🏆'}</td>
      <td>${o.title}</td><td>${o.cat}</td><td>${o.date || 'TBA'}</td>
      <td><span class="bs bs-${o.status}">${o.status}</span></td>
      <td class="tbl-acts"><button class="e-btn" onclick="editOlympiad('${o.id}')">Edit</button><button class="d-btn" onclick="deleteOlympiad('${o.id}')">Delete</button></td></tr>`;
  });
}

function renderGalleryTable() {
  const tbody = document.getElementById('gtbl');
  if(!tbody) return;
  const data = getGallery();
  if(!data.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="4">No media yet.</td></tr>`; return; }
  tbody.innerHTML = '';
  data.forEach(g => {
    tbody.innerHTML += `<tr>
      <td>${g.type === 'video' ? '🎥' : `<img src="${g.url}" class="thumb">`}</td>
      <td>${g.cap || '—'}</td><td>${g.type}</td>
      <td class="tbl-acts"><button class="e-btn" onclick="editGallery('${g.id}')">Edit</button><button class="d-btn" onclick="deleteGallery('${g.id}')">Delete</button></td></tr>`;
  });
}

function renderNewsTable() {
  const tbody = document.getElementById('ntbl');
  if(!tbody) return;
  const data = getNews();
  if(!data.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="3">No news yet.</td></tr>`; return; }
  tbody.innerHTML = '';
  data.forEach(n => {
    tbody.innerHTML += `<tr><td>${n.title}</td><td>${n.date}</td>
      <td class="tbl-acts"><button class="e-btn" onclick="editNews('${n.id}')">Edit</button><button class="d-btn" onclick="deleteNews('${n.id}')">Delete</button></td></tr>`;
  });
}

function renderMessagesTable() {
  const tbody = document.getElementById('mtbl');
  if(!tbody) return;
  const data = getMessages();
  if(!data.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No messages yet.</td></tr>`; return; }
  tbody.innerHTML = '';
  data.forEach(m => {
    const date = m.createdAt ? new Date(m.createdAt).toLocaleString() : 'N/A';
    tbody.innerHTML += `<tr><td>${m.name}</td><td><a href="mailto:${m.email}" style="color:var(--blue-br)">${m.email}</a></td><td>${m.subject || '—'}</td><td>${date}</td>
      <td class="tbl-acts"><button class="e-btn" onclick="viewMessage('${m.id}')">View</button><button class="d-btn" onclick="deleteMessageAction('${m.id}')">Delete</button></td></tr>`;
  });
}

function viewMessage(id) {
  const m = getMessages().find(x => x.id === id);
  if(m) alert(`From: ${m.name}\nEmail: ${m.email}\nSubject: ${m.subject || 'N/A'}\n\nMessage:\n${m.message}`);
}
async function deleteMessageAction(id) {
  if(!confirm("Delete?")) return;
  if(await deleteMessage(id)) { renderMessagesTable(); renderDashboard(); toast("Deleted."); }
}

function regStatus(r) { return r.approval === 'approved' ? 'approved' : r.approval === 'rejected' ? 'rejected' : 'pending'; }

function regFiltered() {
  const ev = (document.getElementById('reg-event-filter') || {}).value || '';
  const st = (document.getElementById('reg-status-filter') || {}).value || '';
  return getRegistrations().filter(r => (!ev || r.olympiad === ev) && (!st || regStatus(r) === st));
}

function renderRegistrationsTable() {
  const tbody = document.getElementById('rtbl');
  if(!tbody) return;
  const all = getRegistrations();

  const evSel = document.getElementById('reg-event-filter');
  if(evSel) {
    const keep = evSel.value;
    const evs = [...new Set(all.map(r => r.olympiad).filter(Boolean))].sort();
    evSel.innerHTML = '<option value="">সব ইভেন্ট</option>' + evs.map(e => `<option value="${bcEsc(e)}" ${e === keep ? 'selected' : ''}>${bcEsc(e)}</option>`).join('');
  }

  const data = regFiltered();
  const count = st => data.filter(r => regStatus(r) === st).length;
  const sum = document.getElementById('reg-summary');
  if(sum) sum.innerHTML = data.length
    ? `দেখানো হচ্ছে <strong>${data.length}</strong> জন · ⏳ Pending <strong>${count('pending')}</strong> · ✅ Approved <strong>${count('approved')}</strong> · ❌ Rejected <strong>${count('rejected')}</strong>`
    : '';

  if(!data.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="9">${all.length ? 'এই ফিল্টারে কোনো রেজিস্ট্রেশন নেই।' : 'No registrations yet.'}</td></tr>`; return; }
  const badge = st => st === 'approved' ? '<span class="bs bs-active">✅ Approved</span>'
                    : st === 'rejected' ? '<span class="bs bs-past">❌ Rejected</span>'
                    : '<span class="bs bs-upcoming">⏳ Pending</span>';
  tbody.innerHTML = data.map(r => {
    const date = r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A';
    const st = regStatus(r);
    return `<tr><td>${bcEsc(r.name)}</td><td>${bcEsc(r.email)}</td><td>${bcEsc(r.phone)}</td><td>${bcEsc(r.olympiad)}</td><td>${bcEsc(r.segment || '—')}</td><td>${bcEsc(r.transactionId || '—')}</td><td>${badge(st)}</td><td>${date}</td>
      <td class="tbl-acts">
        ${st !== 'approved' ? `<button class="e-btn" onclick="setRegApproval('${r.id}','approved')">✅ Approve</button>` : ''}
        ${st !== 'rejected' ? `<button class="d-btn" onclick="setRegApproval('${r.id}','rejected')">❌ Reject</button>` : ''}
        <button class="e-btn" onclick="viewRegistration('${r.id}')">View</button><button class="d-btn" onclick="deleteRegistrationAction('${r.id}')">Delete</button>
      </td></tr>`;
  }).join('');
  }
async function setRegApproval(id, status) {
  const ok = await setRegistrationApproval(id, status);
  if(!ok) return toast('ব্যর্থ! Rules Publish করা আছে কি না দেখুন।', true);
  toast(status === 'approved' ? 'Approved ✅' : 'Rejected ❌');
  renderRegistrationsTable();
}

async function approveAllShown() {
  const ids = regFiltered().filter(r => regStatus(r) === 'pending').map(r => r.id);
  if(!ids.length) return toast('Pending কেউ নেই।', true);
  if(!confirm(`${ids.length} জন Pending ব্যক্তিকে Approve করবেন?`)) return;
  const ok = await setRegistrationsApproval(ids, 'approved');
  if(!ok) return toast('ব্যর্থ!', true);
  toast(`${ids.length} জন Approved ✅`);
  renderRegistrationsTable();
}
function viewRegistration(id) {
  const r = getRegistrations().find(x => x.id === id);
  if(r) alert(`Name: ${r.name}\nEmail: ${r.email}\nPhone: ${r.phone}\nOlympiad: ${r.olympiad}\nSegment: ${r.segment||'N/A'}\nTransaction ID: ${r.transactionId||'N/A'}\nClass: ${r.class||'N/A'}\nSchool: ${r.school||'N/A'}\nAddress: ${r.address||'N/A'}\nMessage: ${r.message||'N/A'}`);
}
async function deleteRegistrationAction(id) {
  if(!confirm("Delete?")) return;
  if(await deleteRegistration(id)) { renderRegistrationsTable(); renderDashboard(); toast("Deleted."); }
}

function downloadRegistrationsCSV() {
  const regs = getRegistrations();
  if(!regs.length) return toast("No data!", true);
  let csv = "Name,Email,Phone,Olympiad,Segment,Transaction ID,Status,Class,School,Date\n";
  regs.forEach(r => {
    csv += [r.name,r.email,r.phone,r.olympiad,r.segment,r.transactionId,regStatus(r),r.class,r.school,r.createdAt?new Date(r.createdAt).toLocaleString():''].map(x=>`"${(x||'').replace(/"/g,'""')}"`).join(',')+"\n";
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
  a.download = 'registrations.csv';
  a.click();
  toast("Downloaded! ✅");
}

/*===== CERTIFICATES TABLE =====*/
function renderCertificatesTable() {
  const tbody = document.getElementById('ctbl');
  if(!tbody) return;
  const data = getCertificates();
  if(!data.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No certificates yet.</td></tr>`; return; }
  tbody.innerHTML = '';
  data.forEach(c => {
    tbody.innerHTML += `<tr>
      <td><strong style="color:var(--blue-br)">${c.certId}</strong></td>
      <td>${c.name}</td><td>${c.event}</td>
      <td><span class="bs bs-active">${c.position}</span></td>
      <td>${c.issueDate || 'N/A'}</td>
      <td class="tbl-acts">
        <button class="e-btn" onclick="previewCertificate('${c.id}')" title="Download certificate">🎓</button>
        <button class="e-btn" onclick="viewCertificate('${c.id}')" title="View QR">👁️</button>
        <button class="e-btn" onclick="editCertificate('${c.id}')">Edit</button>
        <button class="d-btn" onclick="deleteCertificateAction('${c.id}')">Delete</button>
      </td></tr>`;
  });
}

/*===== HOME EDITOR =====*/
function loadHomeEditor() {
  const h = getHome();
  const m = {'he-badge':h.badge,'he-title':h.title,'he-sub':h.sub,'he-b1':h.b1,'he-b2':h.b2,'he-odesc':h.odesc,'he-s1n':h.s1n,'he-s1l':h.s1l,'he-s2n':h.s2n,'he-s2l':h.s2l,'he-s3n':h.s3n,'he-s3l':h.s3l,'he-quote':h.quote,'he-fdesc':h.fdesc,'he-femail':h.femail,'he-fphone':h.fphone,'he-faddr':h.faddr};
  Object.entries(m).forEach(([id,val]) => { const el=document.getElementById(id); if(el) el.value=val||''; });
}

async function saveHomeEditor() {
  const data = {};
  ['badge','title','sub','b1','b2','odesc','s1n','s1l','s2n','s2l','s3n','s3l','quote','fdesc','femail','fphone','faddr'].forEach(k => {
    data[k] = document.getElementById('he-'+k)?.value || '';
  });
  if(await updateHome(data)) toast("Home updated! ✅");
  else toast("Failed!", true);
}

/*===== FORM MODALS =====*/
function openFM(id) { document.getElementById(id)?.classList.add('open'); }
function closeFM(id) { document.getElementById(id)?.classList.remove('open'); }

/*===== QUIZ DROPDOWN HELPER (used by Olympiad form) =====*/
function populateQuizDropdown(selectedId) {
  const sel = document.getElementById('of-quiz');
  if(!sel) return;
  const quizzes = (typeof getQuizzes === 'function') ? getQuizzes() : [];
  sel.innerHTML = '<option value="">-- No Quiz Linked --</option>' +
    quizzes.map(q => `<option value="${q.id}" ${q.id === selectedId ? 'selected' : ''}>${q.title}${q.status === 'published' ? '' : ' (Draft)'}</option>`).join('');
}

/*===== CUSTOM REGISTRATION FORM DROPDOWN HELPER (used by Olympiad form) =====*/
async function populateRegFormDropdown(selectedId) {
  const sel = document.getElementById('of-regform');
  if(!sel) return;
  if(typeof loadCustomForms === 'function') await loadCustomForms();
  const forms = (typeof getCustomForms === 'function') ? getCustomForms() : [];
  sel.innerHTML = '<option value="">-- Use Simple Built-in Form (Segment/Fee/Message) --</option>' +
    forms.map(f => `<option value="${f.id}" ${f.id === selectedId ? 'selected' : ''}>${f.title}${f.status === 'published' ? '' : ' (Draft)'}</option>`).join('');
}

/*===== OLYMPIAD FORM =====*/
function openOlympiadForm() {
  document.getElementById('ofm-title').textContent = "Add Olympiad";
  document.getElementById('of-eid').value = "";
  ['of-t','of-dt','of-rd','of-v','of-pr','of-el','of-fe','of-segments','of-ds','of-fd','of-iu'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('of-cat').value = 'Mathematics';
  document.getElementById('of-st').value = 'upcoming';
  const chk = document.getElementById('of-reg-enabled'); if(chk) chk.checked = false;
  const qr = document.getElementById('of-qreg'); if(qr) qr.checked = true;
  const ap = document.getElementById('of-approve'); if(ap) ap.checked = true;
  document.getElementById('of-iprev').innerHTML = '';
  const gl = document.getElementById('of-group'); if(gl) gl.value = '';
  window._ofGroupLoaded = true;
  populateQuizDropdown('');
  populateRegFormDropdown('');
  openFM('ofm');
}
function editOlympiad(id) {
  const o = getOlympiads().find(x => x.id === id); if(!o) return;
  window._ofGroupLoaded = false;
  const glEl = document.getElementById('of-group'); if(glEl) glEl.value = '';
  getEventLink(id).then(u => {
    if(document.getElementById('of-eid').value !== id) return;
    const el = document.getElementById('of-group'); if(el) el.value = u || '';
    window._ofGroupLoaded = true;
  });
  document.getElementById('ofm-title').textContent = "Edit Olympiad";
  document.getElementById('of-eid').value = id;
  document.getElementById('of-t').value = o.title||'';
  document.getElementById('of-cat').value = o.cat||'Mathematics';
  document.getElementById('of-st').value = o.status||'upcoming';
  document.getElementById('of-dt').value = o.date||'';
  document.getElementById('of-rd').value = o.deadline||'';
  document.getElementById('of-v').value = o.venue||'';
  document.getElementById('of-pr').value = o.prize||'';
  document.getElementById('of-el').value = o.eligibility||'';
  document.getElementById('of-fe').value = o.fee||'';
  document.getElementById('of-segments').value = (o.segments||[]).join(', ');
  document.getElementById('of-ds').value = o.desc||'';
  document.getElementById('of-fd').value = o.fullDesc||'';
  document.getElementById('of-iu').value = o.img||'';
  const chk = document.getElementById('of-reg-enabled'); if(chk) chk.checked = o.regEnabled||false;
  const qr = document.getElementById('of-qreg'); if(qr) qr.checked = o.quizRegisteredOnly !== false;
  const ap = document.getElementById('of-approve'); if(ap) ap.checked = o.approvalRequired === true;
  document.getElementById('of-iprev').innerHTML = o.img ? `<img src="${o.img}">` : '';
  populateQuizDropdown(o.quizId || '');
  populateRegFormDropdown(o.registrationFormId || '');
  openFM('ofm');
}
async function saveOlympiad() {
  const title = document.getElementById('of-t').value.trim();
  const desc = document.getElementById('of-ds').value.trim();
  if(!title || !desc) return toast("Title & description required!", true);
  const segments = document.getElementById('of-segments').value.split(',').map(s => s.trim()).filter(Boolean);
  const o = { title, desc, cat:document.getElementById('of-cat').value, status:document.getElementById('of-st').value, date:document.getElementById('of-dt').value, deadline:document.getElementById('of-rd').value, venue:document.getElementById('of-v').value, prize:document.getElementById('of-pr').value, eligibility:document.getElementById('of-el').value, fee:document.getElementById('of-fe').value, segments, fullDesc:document.getElementById('of-fd').value, img:document.getElementById('of-iu').value, regEnabled:document.getElementById('of-reg-enabled')?.checked||false, quizId:document.getElementById('of-quiz')?.value || '', registrationFormId:document.getElementById('of-regform')?.value || '', quizRegisteredOnly:(document.getElementById('of-qreg')?.checked ?? true), approvalRequired:(document.getElementById('of-approve')?.checked ?? false) };
  const eid = document.getElementById('of-eid').value;
  const groupUrl = (document.getElementById('of-group')?.value || '').trim();
  if(groupUrl && !/^https?:\/\//i.test(groupUrl)) return toast("Group link must start with http:// or https://", true);
  const ok = eid === '' ? await addOlympiad(o) : await updateOlympiad(eid, o);
  if(ok && (eid === '' || window._ofGroupLoaded)) {
    const targetId = eid || (getOlympiads()[0] && getOlympiads()[0].id);
    if(targetId) await saveEventLink(targetId, groupUrl);
  }
  if(ok) { renderOlympiadTable(); renderDashboard(); closeFM('ofm'); toast("Saved! ✅"); }
}
async function deleteOlympiad(id) { if(!confirm("Delete?")) return; if(await deleteOlympiadData(id)) { renderOlympiadTable(); renderDashboard(); toast("Deleted."); } }

/*===== GALLERY FORM =====*/
function openGalleryForm() {
  document.getElementById('gfm-title').textContent = "Add Media";
  document.getElementById('gf-eid').value = '';
  document.getElementById('gf-cap').value = '';
  document.getElementById('gf-type').value = 'image';
  document.getElementById('gf-url').value = '';
  document.getElementById('gf-prev').innerHTML = '';
  openFM('gfm');
}
function editGallery(id) {
  const g = getGallery().find(x => x.id === id); if(!g) return;
  document.getElementById('gfm-title').textContent = "Edit Media";
  document.getElementById('gf-eid').value = id;
  document.getElementById('gf-cap').value = g.cap||'';
  document.getElementById('gf-type').value = g.type||'image';
  document.getElementById('gf-url').value = g.url||'';
  document.getElementById('gf-prev').innerHTML = g.type==='video' ? '🎥' : `<img src="${g.url}">`;
  openFM('gfm');
}
async function saveGallery() {
  const url = document.getElementById('gf-url').value.trim();
  if(!url) return toast("URL required!", true);
  const g = { cap:document.getElementById('gf-cap').value.trim(), type:document.getElementById('gf-type').value, url };
  const eid = document.getElementById('gf-eid').value;
  const ok = eid === '' ? await addGallery(g) : await updateGallery(eid, g);
  if(ok) { renderGalleryTable(); renderDashboard(); closeFM('gfm'); toast("Saved! ✅"); }
}
async function deleteGallery(id) { if(!confirm("Delete?")) return; if(await deleteGalleryData(id)) { renderGalleryTable(); renderDashboard(); toast("Deleted."); } }

/*===== NEWS FORM =====*/
function openNewsForm() {
  document.getElementById('nfm-title').textContent = "Add News";
  document.getElementById('nf-eid').value = '';
  document.getElementById('nf-t').value = '';
  document.getElementById('nf-b').value = '';
  document.getElementById('nf-d').value = new Date().toISOString().split('T')[0];
  openFM('nfm');
}
function editNews(id) {
  const n = getNews().find(x => x.id === id); if(!n) return;
  document.getElementById('nfm-title').textContent = "Edit News";
  document.getElementById('nf-eid').value = id;
  document.getElementById('nf-t').value = n.title||'';
  document.getElementById('nf-d').value = n.date||'';
  document.getElementById('nf-b').value = n.body||'';
  openFM('nfm');
}
async function saveNews() {
  const title = document.getElementById('nf-t').value.trim();
  const body = document.getElementById('nf-b').value.trim();
  if(!title || !body) return toast("Fields required!", true);
  const n = { title, body, date:document.getElementById('nf-d').value };
  const eid = document.getElementById('nf-eid').value;
  const ok = eid === '' ? await addNews(n) : await updateNews(eid, n);
  if(ok) { renderNewsTable(); renderDashboard(); closeFM('nfm'); toast("Saved! ✅"); }
}
async function deleteNews(id) { if(!confirm("Delete?")) return; if(await deleteNewsData(id)) { renderNewsTable(); renderDashboard(); toast("Deleted."); } }

/*===== RESOURCE HUB =====*/
function escRes(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderResourcesTable() {
  const tbody = document.getElementById('rtbl-resources');
  if(!tbody) return;
  const list = (typeof getResources === 'function' ? getResources() : []) || [];
  if(!list.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">এখনো কোনো রিসোর্স যোগ করা হয়নি।</td></tr>';
    return;
  }
  tbody.innerHTML = list.map(r => `
    <tr>
      <td><strong>${escRes(r.title)}</strong></td>
      <td>${escRes(r.category)}</td>
      <td>${escRes(r.classLevel)}</td>
      <td>${escRes(r.fileSize)}</td>
      <td>${r.downloads || 0}</td>
      <td>${escRes(r.uploadDate)}</td>
      <td><div class="tbl-acts">
        <button class="e-btn" onclick="editResource('${escRes(r.id)}')">Edit</button>
        <button class="d-btn" onclick="deleteResourceUI('${escRes(r.id)}')">Delete</button>
      </div></td>
    </tr>`).join('');
}

function openResourceForm(id) {
  const isEdit = !!id;
  document.getElementById('rfm-title').textContent = isEdit ? 'Edit Resource' : 'Add Resource';
  document.getElementById('rf-eid').value = id || '';
  document.getElementById('rf-upload-status').style.display = 'none';
  if(isEdit) {
    const r = (getResources() || []).find(x => x.id === id);
    if(r) {
      document.getElementById('rf-title').value = r.title || '';
      document.getElementById('rf-desc').value = r.description || '';
      document.getElementById('rf-cat').value = r.category || '';
      document.getElementById('rf-class').value = r.classLevel || '';
      document.getElementById('rf-subject').value = r.subject || '';
      document.getElementById('rf-link').value = r.fileUrl || '';
    }
  } else {
    ['rf-title','rf-desc','rf-cat','rf-class','rf-subject','rf-link'].forEach(i => {
      const el = document.getElementById(i); if(el) el.value = '';
    });
    const f = document.getElementById('rf-file'); if(f) f.value = '';
  }
  openFM('rfm');
}
function editResource(id) { openResourceForm(id); }

async function saveResource() {
  const id = document.getElementById('rf-eid').value;
  const title = document.getElementById('rf-title').value.trim();
  const desc = document.getElementById('rf-desc').value.trim();
  const category = document.getElementById('rf-cat').value;
  const classLevel = document.getElementById('rf-class').value;
  const subject = document.getElementById('rf-subject').value.trim();
  const file = document.getElementById('rf-file').files[0];
  const btn = document.getElementById('rf-save-btn');

  if(!title) return showResStatus('⚠️ শিরোনাম লিখুন', 'error');
  if(!category) return showResStatus('⚠️ ক্যাটাগরি সিলেক্ট করুন', 'error');
  if(!classLevel) return showResStatus('⚠️ ক্লাস সিলেক্ট করুন', 'error');
  const link = document.getElementById('rf-link').value.trim();
  if(link && !/^https:\/\//i.test(link)) return showResStatus('⚠️ লিংক অবশ্যই https:// দিয়ে শুরু হতে হবে', 'error');
  if(!id && !file && !link) return showResStatus('⚠️ ফাইলের লিংক দিন (বা ফাইল সিলেক্ট করুন)', 'error');

  try {
    btn.disabled = true;
    showResStatus('⏳ আপলোড হচ্ছে...', 'loading');

    let fileUrl = link || null, fileSize = null, fileType = null;
    if(file && !link) {
      if(file.size > 10 * 1024 * 1024) {
        btn.disabled = false;
        return showResStatus('⚠️ ফাইল ১০ MB-এর বেশি হতে পারবে না', 'error');
      }
      const fns = window.firebaseStorageFunctions || {};
      if(!fns.ref) {
        btn.disabled = false;
        return showResStatus('❌ Firebase Storage চালু নেই — ফাইল আপলোডের বদলে Google Drive লিংক দিন', 'error');
      }
      const storageRef = fns.ref(window.firebaseStorage, `resources/${Date.now()}_${file.name}`);
      await fns.uploadBytes(storageRef, file);
      fileUrl = await fns.getDownloadURL(storageRef);
      fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
      fileType = file.name.split('.').pop().toLowerCase();
    }

    const fns = window.firebaseFunctions;
    const db = window.firebaseDB;

    if(id) {
      const update = { title, description: desc, category, classLevel, subject };
      if(fileUrl) { update.fileUrl = fileUrl; update.fileSize = fileSize; update.fileType = fileType; }
      await updateResource(id, update);
    } else {
      await addResource({
        title, description: desc, category, classLevel, subject,
        fileUrl, fileSize, fileType,
        uploadedBy: (window.firebaseAuth && window.firebaseAuth.currentUser && window.firebaseAuth.currentUser.email) || 'admin',
        uploadDate: new Date().toISOString().split('T')[0],
        createdAt: Date.now(),
        views: 0, downloads: 0
      });
    }

    showResStatus('✅ সফলভাবে সেভ হয়েছে!', 'success');
    if(typeof loadResources === 'function') await loadResources();
    renderResourcesTable();
    if(typeof renderDashboard === 'function') renderDashboard();
    setTimeout(() => {
      closeFM('rfm');
      btn.disabled = false;
    }, 1200);
  } catch(err) {
    console.error(err);
    btn.disabled = false;
    showResStatus('❌ ' + err.message, 'error');
  }
}

function showResStatus(msg, type) {
  const el = document.getElementById('rf-upload-status');
  if(!el) return;
  const colors = { loading: '#3b82f6', success: '#16a34a', error: '#dc2626' };
  el.style.display = 'block';
  el.style.background = colors[type] + '20';
  el.style.color = colors[type];
  el.textContent = msg;
}

async function deleteResourceUI(id) {
  if(!confirm('এই রিসোর্সটি মুছে ফেলবেন?')) return;
  try {
    const fns = window.firebaseFunctions;
    await deleteResource(id);
    if(typeof loadResources === 'function') await loadResources();
    renderResourcesTable();
    if(typeof renderDashboard === 'function') renderDashboard();
    if(typeof toast === 'function') toast('✅ মুছে ফেলা হয়েছে');
  } catch(err) {
    console.error(err);
    if(typeof toast === 'function') toast('❌ মুছতে ব্যর্থ', true);
  }
}

/*===== IMAGE UPLOAD =====*/
async function prevOImg(input) {
  if(!input.files?.[0]) return;
  const prev = document.getElementById('of-iprev');
  prev.innerHTML = `<div style="padding:10px;color:var(--muted)">⏳ Uploading...</div>`;
  const result = await uploadToImgBB(input.files[0]);
  if(result.success) {
    document.getElementById('of-iu').value = result.url;
    prev.innerHTML = `<img src="${result.url}"><div style="color:#4ade80;font-size:.75rem;margin-top:5px">✅ Uploaded!</div>`;
    toast("Uploaded! ✅");
  } else { prev.innerHTML = `<div style="color:#f87171">❌ Failed</div>`; toast("Failed!", true); }
}
async function prevGFile(input) {
  if(!input.files?.[0]) return;
  const file = input.files[0];
  if(file.type.includes('video')) {
    if(file.size > 5*1024*1024) return toast("Video too large!", true);
    const reader = new FileReader();
    reader.onload = e => { document.getElementById('gf-url').value = e.target.result; document.getElementById('gf-type').value = 'video'; document.getElementById('gf-prev').innerHTML = '🎥'; };
    reader.readAsDataURL(file);
    return;
  }
  const prev = document.getElementById('gf-prev');
  prev.innerHTML = `<div style="padding:10px;color:var(--muted)">⏳ Uploading...</div>`;
  const result = await uploadToImgBB(file);
  if(result.success) {
    document.getElementById('gf-url').value = result.url;
    document.getElementById('gf-type').value = 'image';
    prev.innerHTML = `<img src="${result.url}">`;
    toast("Uploaded! ✅");
  } else { prev.innerHTML = `<div style="color:#f87171">❌ Failed</div>`; toast("Failed!", true); }
}

/*===== CERTIFICATE FORM =====*/
function openCertificateForm() {
  document.getElementById('cfm-title').textContent = "Add Certificate";
  document.getElementById('cf-eid').value = '';
  document.getElementById('cf-certid').value = '';
  document.getElementById('cf-certid').disabled = false;
  document.getElementById('cf-name').value = '';
  document.getElementById('cf-email').value = '';
  document.getElementById('cf-event').value = '';
  document.getElementById('cf-position').value = '';
  document.getElementById('cf-date').value = new Date().toISOString().split('T')[0];
  openFM('cfm');
}
async function editCertificate(id) {
  const c = getCertificates().find(x => x.id === id); if(!c) return;
  await loadCertificateOwners();
  document.getElementById('cfm-title').textContent = "Edit Certificate";
  document.getElementById('cf-eid').value = id;
  document.getElementById('cf-certid').value = c.certId||'';
  document.getElementById('cf-certid').disabled = true;
  document.getElementById('cf-name').value = c.name||'';
  document.getElementById('cf-email').value = getCertificateOwnerEmail(id) || c.email || '';
  document.getElementById('cf-event').value = c.event||'';
  document.getElementById('cf-position').value = c.position||'';
  document.getElementById('cf-date').value = c.issueDate||'';
  openFM('cfm');
}
async function saveCertificate() {
  const certId = document.getElementById('cf-certid').value.trim();
  const name = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim().toLowerCase();
  const event = document.getElementById('cf-event').value.trim();
  const position = document.getElementById('cf-position').value.trim();
  const issueDate = document.getElementById('cf-date').value;
  if(!certId||!name||!event||!position||!issueDate) return toast("All fields required!", true);
  const cert = { certId, name, email, event, position, issueDate };
  const eid = document.getElementById('cf-eid').value;
  const result = eid === '' ? await addCertificate(cert) : await updateCertificate(eid, cert);
  if(result.success) { renderCertificatesTable(); renderDashboard(); closeFM('cfm'); toast("Saved! ✅"); }
  else toast(result.error || "Failed!", true);
}
async function deleteCertificateAction(id) { if(!confirm("Delete?")) return; if(await deleteCertificate(id)) { renderCertificatesTable(); renderDashboard(); toast("Deleted."); } }

/*===== CERTIFICATE PREVIEW / DOWNLOAD =====*/
async function previewCertificate(id) {
  const c = getCertificates().find(x => x.id === id);
  if(!c) return;
  const shell = inner => `
    <div style="background:var(--bg,#0b1220);color:var(--txt);border:1px solid var(--bdr2);border-radius:14px;padding:18px;width:100%;max-width:640px;max-height:92vh;overflow:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <h3 style="font-family:Montserrat;font-size:1.02rem;">🎓 ${bcEsc(c.certId)}</h3>
        <button onclick="closeUserOverlay('cert-prev-ov')" style="background:none;border:none;color:var(--muted);font-size:1.3rem;cursor:pointer;">✕</button>
      </div>${inner}</div>`;
  openUserOverlay('cert-prev-ov', shell('<p style="color:var(--muted);padding:20px 0;text-align:center;">Generating…</p>'));
  try {
    const canvas = await tvbdCert.render(c);
    const url = canvas.toDataURL('image/jpeg', 0.85);
    openUserOverlay('cert-prev-ov', shell(`
      <img src="${url}" style="width:100%;border-radius:8px;border:1px solid var(--bdr);margin-bottom:14px;">
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="save-btn" style="flex:1;min-width:150px;" onclick="certDownload('${c.id}','img',this)">⬇️ Image (PNG)</button>
        <button class="save-btn" style="flex:1;min-width:150px;" onclick="certDownload('${c.id}','pdf',this)">📄 PDF</button>
      </div>`));
  } catch(e) {
    console.error(e);
    closeUserOverlay('cert-prev-ov');
    toast('Certificate তৈরি করা যায়নি!', true);
  }
}
async function certDownload(id, kind, btn) {
  const c = getCertificates().find(x => x.id === id);
  if(!c) return;
  const label = btn.textContent; btn.disabled = true; btn.textContent = 'Preparing…';
  try {
    if(kind === 'pdf') await tvbdCert.downloadPdf(c); else await tvbdCert.downloadImage(c);
  } catch(e) { console.error(e); toast('Download failed!', true); }
  btn.disabled = false; btn.textContent = label;
}

function viewCertificate(id) {
  const c = getCertificates().find(x => x.id === id); if(!c) return;
  const verifyUrl = `https://talentversebd.github.io/tvbd/verify.html?id=${encodeURIComponent(c.certId)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}`;
  document.getElementById('cv-content').innerHTML = `
    <div style="text-align:center;padding:10px;">
      <div style="background:rgba(37,99,235,.1);border:1px solid var(--bdr2);border-radius:12px;padding:20px;margin-bottom:20px;">
        <div style="font-size:2.5rem;margin-bottom:8px;">✅</div>
        <h3 style="font-family:Montserrat;color:#4ade80;">Certificate Verified</h3>
      </div>
      <div style="text-align:left;background:var(--card2);border-radius:10px;padding:16px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr);"><span style="color:var(--muted);">🆔 ID</span><strong style="color:var(--blue-br);font-family:monospace;">${c.certId}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr);"><span style="color:var(--muted);">👤 Name</span><strong>${c.name}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr);"><span style="color:var(--muted);">🏆 Event</span><strong>${c.event}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr);"><span style="color:var(--muted);">🥇 Position</span><strong style="color:#4ade80;">${c.position}</strong></div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;"><span style="color:var(--muted);">📅 Date</span><strong>${c.issueDate}</strong></div>
      </div>
      <h4 style="font-family:Montserrat;margin-bottom:12px;">📱 QR Code</h4>
      <div style="background:#fff;padding:16px;border-radius:12px;display:inline-block;margin-bottom:16px;">
        <img src="${qrUrl}" style="width:200px;height:200px;">
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
        <button onclick="downloadQR('${c.certId}','${qrUrl}')" class="fs-btn" style="padding:10px 20px;">⬇️ Download QR</button>
        <button onclick="copyVerifyLink('${verifyUrl}')" class="fs-btn" style="padding:10px 20px;background:linear-gradient(135deg,#16a34a,#15803d);">🔗 Copy Link</button>
      </div>
      <div style="margin-top:16px;padding:12px;background:var(--card2);border-radius:8px;font-size:.75rem;color:var(--muted);word-break:break-all;font-family:monospace;">${verifyUrl}</div>
    </div>`;
  openFM('cvm');
}
async function downloadQR(certId, qrUrl) {
  try {
    const r = await fetch(qrUrl); const blob = await r.blob();
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `QR_${certId}.png`; a.click();
    toast("Downloaded! ✅");
  } catch(e) { toast("Failed!", true); }
}
function copyVerifyLink(url) {
  navigator.clipboard.writeText(url).then(() => toast("Copied! ✅")).catch(() => {
    const i = document.createElement('input'); i.value = url; document.body.appendChild(i); i.select(); document.execCommand('copy'); document.body.removeChild(i); toast("Copied! ✅");
  });
}

/*===== REGISTRATION SETTINGS =====*/
async function loadRegistrationSettings() {
  if(typeof getRegistrationSettings !== 'function') return;
  const s = await getRegistrationSettings();
  const m = {'rs-title':s.title,'rs-desc':s.description,'rs-deadline':s.deadline};
  Object.entries(m).forEach(([id,val]) => { const el=document.getElementById(id); if(el) el.value=val||''; });
  const a = document.getElementById('rs-active'); if(a) a.checked = s.active||false;
}
async function saveRegistrationSettings() {
  const data = { title:document.getElementById('rs-title')?.value.trim()||'', description:document.getElementById('rs-desc')?.value.trim()||'', deadline:document.getElementById('rs-deadline')?.value||'', active:document.getElementById('rs-active')?.checked||false };
  if(data.active && !data.title) return toast("Title required!", true);
  if(await updateRegistrationSettings(data)) toast("Saved! ✅");
  else toast("Failed!", true);
}

/*===== FOUNDER'S MESSAGE SETTINGS =====*/
async function loadFounderSettingsUI() {
  if(typeof getFounderSettings !== 'function') return;
  const f = await getFounderSettings();
  const m = { 'fs-name': f.name, 'fs-title': f.title, 'fs-bio': f.bio, 'fs-photo': f.photo, 'fs-facebook': f.facebook, 'fs-linkedin': f.linkedin };
  Object.entries(m).forEach(([id, val]) => { const el = document.getElementById(id); if(el) el.value = val || ''; });
  const en = document.getElementById('fs-enabled'); if(en) en.checked = f.enabled || false;
  const prev = document.getElementById('fs-photo-prev');
  if(prev) prev.innerHTML = f.photo ? `<img src="${f.photo}" style="width:70px;height:70px;border-radius:50%;object-fit:cover;">` : '';
}

async function saveFounderSettingsUI() {
  const name = document.getElementById('fs-name')?.value.trim() || '';
  const title = document.getElementById('fs-title')?.value.trim() || '';
  const bio = document.getElementById('fs-bio')?.value.trim() || '';
  const enabled = document.getElementById('fs-enabled')?.checked || false;

  if(enabled && (!name || !title || !bio)) return toast("Name, title and message are required to show this section!", true);

  const data = {
    enabled, name, title, bio,
    photo: document.getElementById('fs-photo')?.value.trim() || '',
    facebook: document.getElementById('fs-facebook')?.value.trim() || '',
    linkedin: document.getElementById('fs-linkedin')?.value.trim() || ''
  };
  if(await updateFounderSettings(data)) toast("Saved! ✅");
  else toast("Failed to save.", true);
}

async function prevFounderPhoto(input) {
  if(!input.files?.[0]) return;
  const prev = document.getElementById('fs-photo-prev');
  prev.innerHTML = `<div style="padding:10px;color:var(--muted)">⏳ Uploading...</div>`;
  const result = await uploadToImgBB(input.files[0]);
  if(result.success) {
    document.getElementById('fs-photo').value = result.url;
    prev.innerHTML = `<img src="${result.url}" style="width:70px;height:70px;border-radius:50%;object-fit:cover;"><div style="color:#4ade80;font-size:.75rem;margin-top:5px">✅ Uploaded!</div>`;
    toast("Uploaded! ✅");
  } else { prev.innerHTML = `<div style="color:#f87171">❌ Failed</div>`; toast("Failed!", true); }
}

/*===== REGISTERED USERS + MEMBER ACCESS =====*/
function fmtUserDate(t) {
  return t ? new Date(t).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
}
function escUser(v) {
  return String(v == null || v === '' ? '—' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function userAvatar(u, size) {
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ');
  return u.photo
    ? `<img src="${escUser(u.photo)}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;">`
    : `<div style="width:${size}px;height:${size}px;border-radius:50%;background:var(--card);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${Math.round(size/2.4)}px;">${escUser((name || u.email || '?').charAt(0).toUpperCase())}</div>`;
}

async function loadRegisteredUsersUI() {
  const tbody = document.getElementById('userstbl');
  if(!tbody) return;
  tbody.innerHTML = `<tr class="empty-row"><td colspan="10">Loading…</td></tr>`;
  const [users, accessMap] = await Promise.all([
    typeof loadRegisteredUsers === 'function' ? loadRegisteredUsers() : [],
    typeof loadAllMemberAccess === 'function' ? loadAllMemberAccess() : {}
  ]);
  if(!users.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="10">No one has signed up yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = users.map(u => {
    const name = [u.firstName, u.lastName].filter(Boolean).join(' ');
    const acc = accessMap[u.id];
    const n = acc && acc.permissions ? acc.permissions.length : 0;
    return `
    <tr>
      <td>${userAvatar(u, 38)}</td>
      <td>${escUser(name)}</td>
      <td style="font-family:monospace;letter-spacing:.5px;">${escUser(u.memberCode)}</td>
      <td>${escUser(u.email)}</td>
      <td>${escUser(u.phone)}</td>
      <td>${escUser(u.institution)}</td>
      <td><span class="bs ${u.emailVerified ? 'bs-active' : 'bs-past'}">${u.emailVerified ? '✅ Verified' : '⏳ Not verified'}</span></td>
      <td>${fmtUserDate(u.createdAt)}</td>
      <td>${n ? `<span class="bs bs-active">🔑 ${n} page${n > 1 ? 's' : ''}</span>` : '—'}</td>
      <td class="tbl-acts"><button class="e-btn" onclick="viewRegisteredUser('${escUser(u.id)}')">View</button></td>
    </tr>`;
  }).join('');
}

function closeUserOverlay(id) { const el = document.getElementById(id); if(el) el.remove(); }

function openUserOverlay(id, innerHtml) {
  let ov = document.getElementById(id);
  if(!ov) {
    ov = document.createElement('div');
    ov.id = id;
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
    ov.onclick = e => { if(e.target === ov) ov.remove(); };
    document.body.appendChild(ov);
  }
  ov.innerHTML = innerHtml;
}

function viewRegisteredUser(id) {
  const u = (typeof getRegisteredUsers === 'function' ? getRegisteredUsers() : []).find(x => x.id === id);
  if(!u) return;
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ');
  const acc = (typeof getMemberAccessMap === 'function' ? getMemberAccessMap() : {})[id];
  const accText = acc && (acc.permissions || []).length
    ? acc.permissions.map(k => (PERM_CATALOG.find(p => p.key === k) || { label:k }).label).join(', ')
    : 'No extra access';
  const row = (l, v) => `<div style="display:flex;justify-content:space-between;gap:14px;padding:9px 0;border-bottom:1px solid var(--bdr);"><span style="color:var(--muted);font-size:.82rem;">${l}</span><strong style="text-align:right;font-size:.88rem;">${escUser(v)}</strong></div>`;
  openUserOverlay('user-detail-ov', `
    <div style="background:var(--bg,#0b1220);color:var(--txt);border:1px solid var(--bdr2);border-radius:14px;padding:22px;width:100%;max-width:440px;max-height:88vh;overflow:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h3 style="font-family:Montserrat;font-size:1.05rem;">👤 User Profile</h3>
        <button onclick="closeUserOverlay('user-detail-ov')" style="background:none;border:none;color:var(--muted);font-size:1.3rem;cursor:pointer;">✕</button>
      </div>
      <div style="display:flex;justify-content:center;margin-bottom:12px;">${userAvatar(u, 96)}</div>
      ${row('Member ID', u.memberCode)}
      ${row('Full Name', name)}
      ${row('Email', u.email)}
      ${row('Phone', u.phone)}
      ${row('Date of Birth', u.dob)}
      ${row('Gender', u.gender)}
      ${row('Religion', u.religion)}
      ${row('Institution', u.institution)}
      ${row('Class / Level', u.classLevel)}
      ${row('District', u.district)}
      ${row('Email Verified', u.emailVerified ? 'Yes' : 'No')}
      ${row('Account Created', fmtUserDate(u.createdAt))}
      ${row('Last Login', fmtUserDate(u.lastLoginAt))}
      ${row('Admin Access', accText)}
      <button class="save-btn" style="width:100%;margin-top:16px;" onclick="openMemberAccess('${escUser(id)}')">🔑 Manage Access</button>
    </div>`);
}

async function findMemberByCode() {
  const input = document.getElementById('user-code-search');
  let code = (input.value || '').trim().toUpperCase().replace(/\s+/g, '');
  if(!code) return toast('Member ID লিখুন!', true);
  if(!code.startsWith('TV-')) code = 'TV-' + code;
  const uid = await getUidByMemberCode(code);
  if(!uid) return toast('এই Member ID পাওয়া যায়নি।', true);
  if(!getRegisteredUsers().find(x => x.id === uid)) await loadRegisteredUsers();
  await loadAllMemberAccess();
  if(!getRegisteredUsers().find(x => x.id === uid)) return toast('ইউজারের প্রোফাইল পাওয়া যায়নি।', true);
  viewRegisteredUser(uid);
}

async function openMemberAccess(uid) {
  const u = getRegisteredUsers().find(x => x.id === uid);
  if(!u) return;
  const accessMap = await loadAllMemberAccess();
  const acc = accessMap[uid] || { permissions: [], label: '' };
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email;
  const boxes = PERM_CATALOG.map(p => `
    <label style="display:flex;align-items:center;gap:10px;padding:9px 4px;border-bottom:1px solid var(--bdr);cursor:pointer;font-size:.88rem;">
      <input type="checkbox" class="ma-perm" value="${p.key}" ${acc.permissions.includes(p.key) ? 'checked' : ''} style="width:18px;height:18px;">
      <span>${p.label}</span>
    </label>`).join('');
  openUserOverlay('member-access-ov', `
    <div style="background:var(--bg,#0b1220);color:var(--txt);border:1px solid var(--bdr2);border-radius:14px;padding:22px;width:100%;max-width:440px;max-height:90vh;overflow:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <h3 style="font-family:Montserrat;font-size:1.05rem;">🔑 Manage Access</h3>
        <button onclick="closeUserOverlay('member-access-ov')" style="background:none;border:none;color:var(--muted);font-size:1.3rem;cursor:pointer;">✕</button>
      </div>
      <p style="font-size:.85rem;margin-bottom:4px;"><strong>${escUser(name)}</strong> · <span style="font-family:monospace;">${escUser(u.memberCode)}</span></p>
      <p style="font-size:.76rem;color:var(--muted);margin-bottom:12px;line-height:1.6;">যে পেজগুলো টিক দেবেন শুধু সেগুলোই এই সদস্য নিজের অ্যাকাউন্ট দিয়ে admin.html-এ এডিট করতে পারবেন।</p>
      <div class="fg"><label>Role label (optional)</label>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <h3 style="font-family:Montserrat;font-size:1.05rem;">🔑 Manage Access</h3>
        <button onclick="closeUserOverlay('member-access-ov')" style="background:none;border:none;color:var(--muted);font-size:1.3rem;cursor:pointer;">✕</button>
      </div>
      <p style="font-size:.85rem;margin-bottom:4px;"><strong>${escUser(name)}</strong> · <span style="font-family:monospace;">${escUser(u.memberCode)}</span></p>
      <p style="font-size:.76rem;color:var(--muted);margin-bottom:12px;line-height:1.6;">যে পেজগুলো টিক দেবেন শুধু সেগুলোই এই সদস্য নিজের অ্যাকাউন্ট দিয়ে admin.html-এ এডিট করতে পারবেন। ইউজার ম্যানেজমেন্ট ও সিস্টেম সেটিংস সবসময় শুধু আপনার কাছে থাকবে।</p>
      <div class="fg"><label>Role label (optional)</label><input class="fi" id="ma-label" value="${String(acc.label || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}" placeholder="e.g. Official Member, Content Team"></div>
      <div style="display:flex;gap:10px;margin:8px 0;">
        <button class="e-btn" onclick="document.querySelectorAll('.ma-perm').forEach(c=>c.checked=true)">Select all</button>
        <button class="e-btn" onclick="document.querySelectorAll('.ma-perm').forEach(c=>c.checked=false)">Clear</button>
      </div>
      <div>${boxes}</div>
      <button class="save-btn" style="width:100%;margin-top:16px;" onclick="saveMemberAccessUI('${escUser(uid)}')">💾 Save Access</button>
    </div>`);
}

async function saveMemberAccessUI(uid) {
  const u = getRegisteredUsers().find(x => x.id === uid);
  if(!u) return;
  const perms = Array.from(document.querySelectorAll('.ma-perm')).filter(c => c.checked).map(c => c.value);
  const label = document.getElementById('ma-label').value.trim();
  let ok;
  if(!perms.length) {
    ok = await removeMemberAccess(uid);
  } else {
    ok = await saveMemberAccess(uid, {
      uid,
      memberCode: u.memberCode || '',
      name: [u.firstName, u.lastName].filter(Boolean).join(' '),
      email: u.email || '',
      permissions: perms,
      label,
      grantedAt: Date.now()
    });
  }
  if(!ok) return toast('Save failed! Rules/internet চেক করুন।', true);
  toast(perms.length ? 'Access saved! ✅' : 'সব অ্যাক্সেস সরানো হয়েছে।');
  closeUserOverlay('member-access-ov');
  closeUserOverlay('user-detail-ov');
  loadRegisteredUsersUI();
}

/*===== ONE-TIME: hide participant emails from the public certificate documents =====*/
async function migrateCertEmailsUI() {
  if(!confirm('পুরোনো সার্টিফিকেট থেকে ইমেইল সরিয়ে সুরক্ষিত জায়গায় রাখা হবে। শুরু করবেন?')) return;
  toast('কাজ চলছে…');
  const n = await migrateCertificateEmails();
  if(n < 0) return toast('ব্যর্থ! Rules Publish করা আছে কি না দেখুন।', true);
  toast(n ? `${n}টা সার্টিফিকেটের ইমেইল সুরক্ষিত হয়েছে ✅` : 'সব ইমেইল আগে থেকেই সুরক্ষিত আছে ✅');
  if(typeof renderCertificatesTable === 'function') renderCertificatesTable();
}

/*===== SECURE QUIZZES: one-click helpers =====*/
async function secureAllQuizzesUI() {
  if(!confirm('সব পুরোনো কুইজের সঠিক উত্তর খোলা ডাটাবেস থেকে সরিয়ে বন্ধ জায়গায় রাখা হবে। এরপর সেগুলোর নতুন জমা সাথে সাথে স্কোর দেখাবে না (আপনি অটো-গ্রেড করবেন)। শুরু করবেন?')) return;
  toast('কাজ চলছে…');
  const n = await secureAllQuizzes();
  if(n < 0) return toast('ব্যর্থ! Rules Publish করা আছে কি না দেখুন।', true);
  toast(n ? `${n}টা কুইজের উত্তর সুরক্ষিত হয়েছে ✅` : 'সব কুইজ আগে থেকেই সুরক্ষিত ✅');
  if(typeof renderQuizTable === 'function') renderQuizTable();
}

async function autoGradeUI() {
  toast('গ্রেডিং চলছে…');
  const r = await autoGradeQuizzes();
  if(r.error) return toast('গ্রেডিং ব্যর্থ! (Quiz Submissions ও Quizzes-এর অনুমতি আছে কি না দেখুন)', true);
  let msg = r.graded ? `${r.graded}টা সাবমিশন গ্রেড হয়েছে ✅` : 'গ্রেড করার মতো নতুন সাবমিশন নেই।';
  if(r.missingKeys) msg += ` (${r.missingKeys}টা কুইজের উত্তরের চাবি পড়া যায়নি)`;
  toast(msg, !!r.missingKeys);
  if(typeof renderQuizSubmissionsTable === 'function') renderQuizSubmissionsTable();
}

/*===== PUBLISH RESULTS / RANKING =====*/
async function openPublishResults() {
  await Promise.all([loadQuizSubmissions(), loadQuizzes()]);
  const quizzes = getQuizzes();
  const subs = getQuizSubmissions();
  const opts = quizzes.filter(q => subs.some(s => s.quizId === q.id))
    .map(q => `<option value="${bcEsc(q.id)}">${bcEsc(q.title)}</option>`).join('');
  if(!opts) return toast('এখনও কোনো কুইজ সাবমিশন নেই।', true);
  openUserOverlay('pub-res-ov', `
    <div style="background:var(--bg,#0b1220);color:var(--txt);border:1px solid var(--bdr2);border-radius:14px;padding:20px;width:100%;max-width:520px;max-height:92vh;overflow:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <h3 style="font-family:Montserrat;font-size:1.05rem;">🏆 Publish Results</h3>
        <button onclick="closeUserOverlay('pub-res-ov')" style="background:none;border:none;color:var(--muted);font-size:1.3rem;cursor:pointer;">✕</button>
      </div>
      <p style="font-size:.78rem;color:var(--muted);line-height:1.7;margin-bottom:12px;">Publish করলে প্রতিটা অংশগ্রহণকারী নিজের ড্যাশবোর্ডে স্কোর, পজিশন ও র‍্যাংক দেখবে, আর Results পেজে সেরা N জনের তালিকা সবার জন্য খুলে যাবে। শুধু গ্রেড করা সাবমিশন র‍্যাংকে ধরা হয় (স্কোর সমান হলে যে কম সময়ে শেষ করেছে সে এগিয়ে)।</p>
      <div class="fg"><label>কুইজ</label><select class="fi" id="pr-quiz" onchange="prRefresh()">${opts}</select></div>
      <div class="f-row">
        <div class="fg"><label>সেরা কতজনের তালিকা (Top N)</label><input class="fi" type="number" min="1" max="100" id="pr-top" value="10"></div>
        <div class="fg" style="display:flex;align-items:flex-end;"><div class="chk-wrap"><input type="checkbox" id="pr-seg"><label for="pr-seg"> প্রতিটি Segment আলাদা র‍্যাংক</label></div></div>
      </div>
      <div id="pr-status" style="font-size:.82rem;line-height:1.8;background:var(--card);border:1px solid var(--bdr);border-radius:10px;padding:12px;margin:8px 0;"></div>
      <button class="save-btn" id="pr-go" style="width:100%;margin-top:6px;" onclick="prPublish()">🏆 Publish Results</button>
      <button class="d-btn" id="pr-undo" style="width:100%;margin-top:10px;padding:10px;display:none;" onclick="prUnpublish()">↩️ Unpublish (ফলাফল লুকান)</button>
    </div>`);
  prRefresh();
}

function prRefresh() {
  const id = document.getElementById('pr-quiz').value;
  const subs = getQuizSubmissions().filter(s => s.quizId === id);
  const graded = subs.filter(s => s.totalScore != null).length;
  const published = subs.filter(s => s.resultPublished).length;
  const segs = getOlympiads().some(o => o.quizId === id && (o.segments || []).length > 0);
  document.getElementById('pr-seg').checked = segs;
  document.getElementById('pr-status').innerHTML =
    `মোট সাবমিশন: <strong>${subs.length}</strong><br>গ্রেড হয়েছে: <strong>${graded}</strong>` +
    (subs.length - graded ? ` <span style="color:#fbbf24;">(${subs.length - graded}টা এখনও গ্রেড হয়নি — এগুলো র‍্যাংকে ধরা হবে না)</span>` : '') +
    `<br>${published ? `<span style="color:#4ade80;">✅ ${published} জনের ফলাফল প্রকাশিত আছে (আবার Publish করলে নতুন করে হিসাব হবে)</span>` : 'এখনও প্রকাশ হয়নি'}`;
  document.getElementById('pr-undo').style.display = published ? 'block' : 'none';
}

async function prPublish() {
  const id = document.getElementById('pr-quiz').value;
  const subs = getQuizSubmissions().filter(s => s.quizId === id);
  const ungraded = subs.filter(s => s.totalScore == null).length;
  if(ungraded && !confirm(`${ungraded}টা সাবমিশন এখনও গ্রেড হয়নি, এগুলো র‍্যাংকে ধরা হবে না। তবুও Publish করবেন?`)) return;
  const btn = document.getElementById('pr-go'); btn.disabled = true; btn.textContent = 'Publishing…';
  const r = await publishQuizResults(id, { topN: document.getElementById('pr-top').value, bySegment: document.getElementById('pr-seg').checked });
  btn.disabled = false; btn.textContent = '🏆 Publish Results';
  if(!r.success) return toast(r.error || 'Publish ব্যর্থ!', true);
  toast(`${r.ranked} জনের ফলাফল প্রকাশ হয়েছে ✅`);
  prRefresh();
  if(typeof renderQuizSubmissionsTable === 'function') renderQuizSubmissionsTable();
}

async function prUnpublish() {
  const id = document.getElementById('pr-quiz').value;
  if(!confirm('ফলাফল লুকিয়ে ফেলবেন? র‍্যাংক ও লিডারবোর্ড সরে যাবে।')) return;
  const r = await unpublishQuizResults(id);
  if(!r.success) return toast(r.error || 'ব্যর্থ!', true);
  toast('ফলাফল লুকানো হয়েছে।');
  prRefresh();
  if(typeof renderQuizSubmissionsTable === 'function') renderQuizSubmissionsTable();
}

/*===== CERTIFICATE TEMPLATE EDITOR =====*/
let tplCfg = null, tplSel = 'name', tplTimer = null, tplTarget = '', tplHasOwn = false;

async function openCertTemplate(targetId) {
  tplTarget = targetId || '';
  const events = typeof getOlympiads === 'function' ? getOlympiads() : [];
  let saved = await loadCertTemplate(true, tplTarget || undefined);
  tplHasOwn = !!saved;
  if(!saved && tplTarget) {
    const base = await loadCertTemplate(true);
    saved = base ? { ...base, url: '' } : null;
  }
  tplCfg = tvbdCert.mergeCfg(saved);
  tplSel = 'name';
  const c = tplCfg;
  const evOpts = `<option value="" ${tplTarget ? '' : 'selected'}>🌐 ডিফল্ট ডিজাইন</option>` +
    events.map(o => `<option value="${bcEsc(o.id)}" ${tplTarget === o.id ? 'selected' : ''}>🎯 ${bcEsc(o.title)}</option>`).join('');
  const status = tplTarget
    ? (tplHasOwn ? '✅ এই ইভেন্টের নিজস্ব ডিজাইন আছে।' : 'ℹ️ এই ইভেন্টের নিজস্ব ডিজাইন এখনও নেই।')
    : 'এটা ডিফল্ট ডিজাইন।';
  const range = (el, key, min, max, step) =>
    `<input type="range" min="${min}" max="${max}" step="${step}" value="${c[el][key]}" oninput="tplSet('${el}','${key}',this.value)" style="width:100%;">`;
  const color = el =>
    `<input type="color" value="${c[el].color}" oninput="tplSet('${el}','color',this.value)" style="width:100%;height:38px;border:none;background:none;padding:0;">`;
  const font = ['serif-italic', 'serif', 'sans-bold'].map(f =>
    `<option value="${f}" ${c.name.font === f ? 'selected' : ''}>${f === 'serif-italic' ? 'Serif Italic' : f === 'serif' ? 'Serif Bold' : 'Sans Bold'}</option>`).join('');
  const pickBtn = (k, label) =>
    `<button class="e-btn" id="tpl-b-${k}" onclick="tplPick('${k}')" style="flex:1;padding:10px 4px;">${label}</button>`;
  openUserOverlay('cert-tpl-ov', `
    <div style="background:var(--bg,#0b1220);color:var(--txt);border:1px solid var(--bdr2);border-radius:14px;padding:18px;width:100%;max-width:680px;max-height:94vh;overflow:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <h3 style="font-family:Montserrat;font-size:1.05rem;">🖼 Certificate Template</h3>
        <button onclick="closeUserOverlay('cert-tpl-ov')" style="background:none;border:none;color:var(--muted);font-size:1.3rem;cursor:pointer;">✕</button>
      </div>
      <p style="font-size:.78rem;color:var(--muted);line-height:1.7;margin-bottom:10px;">১) সার্টিফিকেটের ছবি আপলোড করুন। ২) Name / Verify ID / QR বেছে ছবির যেখানে বসাতে চান সেখানে ট্যাপ করুন। ৩) Save করুন।</p>

      <div class="fg"><label>কোন ইভেন্টের জন্য ডিজাইন?</label>
        <select class="fi" onchange="openCertTemplate(this.value)">${evOpts}</select>
        <p style="font-size:.76rem;color:var(--muted);margin-top:6px;line-height:1.7;">${status}</p>
      </div>

      <div class="fg">
        <input type="file" accept="image/*" onchange="tplUpload(this)" style="font-size:.82rem;max-width:100%;">
        <button class="e-btn" style="margin-top:8px;" onclick="tplUseGithub()">GitHub-এর certificate-template.jpg ব্যবহার করুন</button>
      </div>
      <p id="tpl-warn" style="display:none;font-size:.78rem;line-height:1.7;margin:4px 0 8px;"></p>

      <div class="fg"><label>প্রিভিউর নাম</label><input class="fi" id="tpl-sample" value="Abdur Rahman" oninput="tplRefresh()"></div>

      <div style="display:flex;gap:8px;margin:6px 0;">${pickBtn('name', '✍️ Name')}${pickBtn('id', '🆔 Verify ID')}${pickBtn('qr', '▦ QR Code')}</div>
      <p id="tpl-hint" style="font-size:.78rem;color:var(--blue-br);margin:4px 0 8px;"></p>
      <canvas id="tpl-canvas" onclick="tplTap(event)" style="display:none;width:100%;border:1px solid var(--bdr);border-radius:8px;cursor:crosshair;background:#fff;touch-action:manipulation;"></canvas>

      <h4 style="font-size:.9rem;margin:16px 0 6px;">✍️ Name</h4>
      <div class="f-row">
        <div class="fg"><label>Size</label>${range('name', 'size', 1.5, 12, 0.1)}</div>
        <div class="fg"><label>সর্বোচ্চ চওড়া %</label>${range('name', 'maxW', 30, 95, 1)}</div>
      </div>
      <div class="f-row">
        <div class="fg"><label>Color</label>${color('name')}</div>
        <div class="fg"><label>Font</label><select class="fi" onchange="tplSet('name','font',this.value)">${font}</select></div>
      </div>

      <h4 style="font-size:.9rem;margin:12px 0 6px;">🆔 Verify ID</h4>
      <div class="chk-wrap" style="margin-bottom:6px;"><input type="checkbox" id="tpl-id-show" ${c.id.show !== false ? 'checked' : ''} onchange="tplSet('id','show',this.checked)"><label for="tpl-id-show"> দেখাবে</label></div>
      <div class="f-row">
        <div class="fg"><label>Size</label>${range('id', 'size', 0.8, 3, 0.1)}</div>
        <div class="fg"><label>Color</label>${color('id')}</div>
      </div>

      <h4 style="font-size:.9rem;margin:12px 0 6px;">▦ QR Code</h4>
      <div class="chk-wrap" style="margin-bottom:6px;"><input type="checkbox" id="tpl-qr-show" ${c.qr.show !== false ? 'checked' : ''} onchange="tplSet('qr','show',this.checked)"><label for="tpl-qr-show"> দেখাবে</label></div>
      <div class="f-row">
        <div class="fg"><label>Size</label>${range('qr', 'size', 5, 25, 0.5)}</div>
        <div class="fg"><label>Color</label>${color('qr')}</div>
      </div>

      <h4 style="font-size:.9rem;margin:16px 0 6px;">📝 সার্টিফিকেটের নিয়ম</h4>
      <div class="chk-wrap" style="margin-bottom:4px;"><input type="checkbox" id="tpl-examonly" ${c.examOnly !== false ? 'checked' : ''} onchange="tplCfg.examOnly = this.checked"><label for="tpl-examonly"> শুধু যারা Exam দিয়েছে তারাই সার্টিফিকেট পাবে</label></div>
      <p style="font-size:.74rem;color:var(--muted);line-height:1.7;margin-bottom:4px;">টিক থাকলে Bulk Generate-এ যারা Exam দেয়নি তাদের বাছা যাবে না।</p>

      <button class="save-btn" style="width:100%;margin-top:14px;" onclick="tplSave()">💾 Save Template</button>
      <button class="d-btn" style="width:100%;margin-top:10px;padding:10px;" onclick="tplRemove()">🗑 Template মুছুন</button>
    </div>`);
  tplPick('name');
  tplRefresh();
}

function tplPick(k) {
  tplSel = k;
  ['name', 'id', 'qr'].forEach(x => {
    const b = document.getElementById('tpl-b-' + x);
    if(b) b.style.outline = x === k ? '2px solid var(--blue-br)' : 'none';
  });
  const names = { name: 'নামের', id: 'Verify ID-র', qr: 'QR কোডের' };
  const h = document.getElementById('tpl-hint');
  if(h) h.textContent = `নির্বাচিত: ${names[k]} মাঝখান — ছবির যেখানে ট্যাপ করবেন, সেখানে বসবে।`;
}

function tplTap(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = Math.min(100, Math.max(0, (e.clientX - rect.left) / rect.width * 100));
  const y = Math.min(100, Math.max(0, (e.clientY - rect.top) / rect.height * 100));
  tplCfg[tplSel].x = Math.round(x * 10) / 10;
  tplCfg[tplSel].y = Math.round(y * 10) / 10;
  tplRefresh();
}

function tplSet(el, key, val) {
  if(key === 'size' || key === 'maxW') val = parseFloat(val);
  tplCfg[el][key] = val;
  tplRefresh();
}

function tplRefresh() {
  clearTimeout(tplTimer);
  tplTimer = setTimeout(tplDraw, 120);
}

async function tplDraw() {
  const pv = document.getElementById('tpl-canvas');
  const warn = document.getElementById('tpl-warn');
  if(!pv || !tplCfg) return;
  if(!tplCfg.url) {
    pv.style.display = 'none';
    warn.style.display = 'block'; warn.style.color = 'var(--muted)';
    warn.textContent = tplTarget ? 'এই ইভেন্টের জন্য ডিজাইনের ছবি আপলোড করুন।' : 'এখনও কোনো ডিফল্ট ডিজাইন বেছে নেওয়া হয়নি।';
    return;
  }
  const sample = {
    certId: 'TVBD-2026-001',
    name: (document.getElementById('tpl-sample').value || 'Sample Name').trim(),
    event: 'Sample Event', position: 'Participant',
    issueDate: new Date().toISOString().slice(0, 10)
  };
  const c = await tvbdCert.render(sample, tplCfg, { maxSide: 1400 });
  if(c.templateFailed) {
    pv.style.display = 'none';
    warn.style.display = 'block'; warn.style.color = '#f87171';
    warn.textContent = 'ছবিটা লোড করা যায়নি। GitHub-এ certificate-template.jpg নামে আপলোড করুন।';
    return;
  }
  warn.style.display = 'none';
  pv.width = c.width; pv.height = c.height; pv.style.display = 'block';
  pv.getContext('2d').drawImage(c, 0, 0);
}

async function tplUpload(input) {
  const f = input.files && input.files[0];
  if(!f) return;
  toast('Uploading…');
  const res = await uploadToImgBB(f);
  if(!res || !res.success) return toast('Upload failed!', true);
  tplCfg.url = res.url;
  toast('Uploaded ✅');
  tplDraw();
}

function tplUseGithub() {
  tplCfg.url = 'certificate-template.jpg';
  tplDraw();
}

async function tplSave() {
  if(tplTarget && !tplCfg.url) return toast('আগে এই ইভেন্টের ডিজাইনের ছবি আপলোড করুন।', true);
  const ok = await saveCertTemplate(tplCfg, tplTarget || undefined);
  if(!ok) return toast('Save failed! Rules/internet চেক করুন।', true);
  toast(tplCfg.url ? 'Template saved! ✅' : 'Saved! (বিল্ট-ইন ডিজাইন ব্যবহার হবে)');
  closeUserOverlay('cert-tpl-ov');
}

async function tplRemove() {
  if(tplTarget) {
    if(!confirm('এই ইভেন্টের নিজস্ব ডিজাইন মুছে ডিফল্ট ডিজাইনে ফিরে যাবেন?')) return;
    const ok = await removeCertTemplate(tplTarget);
    if(!ok) return toast('Failed!', true);
    toast('ইভেন্টের ডিজাইন মুছে গেছে।');
    return closeUserOverlay('cert-tpl-ov');
  }
  if(!confirm('ডিজাইনের ছবি সরিয়ে বিল্ট-ইন ডিজাইনে ফিরে যাবেন?')) return;
  tplCfg.url = '';
  const ok = await saveCertTemplate(tplCfg);
  if(!ok) return toast('Failed!', true);
  toast('ডিজাইন সরানো হয়েছে।');
  closeUserOverlay('cert-tpl-ov');
}

/*===== BULK CERTIFICATE GENERATOR =====*/
let bulkRows = [];
let bulkEvent = null;
let bulkExamOnly = true;

function bcEsc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function bcNorm(v) { return String(v || '').trim().toLowerCase(); }
function bulkEligible(r) { return !!(!bulkExamOnly || r.hasQuiz || !(bulkEvent && bulkEvent.quizId)); }
function bcIsWinner(pos) { return /champion|winner|runner|1st|2nd|3rd|first|second|third/i.test(String(pos || '')); }
function bulkSelect(mode) {
  document.querySelectorAll('.bc-chk').forEach(c => {
    if(c.disabled) return;
    if(mode === 'all') { c.checked = true; return; }
    const posEl = document.querySelector(`.bc-pos[data-i="${c.dataset.i}"]`);
    c.checked = !bcIsWinner(posEl ? posEl.value : '');
  });
  bulkUpdateCount();
}

function openBulkCert() {
  const events = typeof getOlympiads === 'function' ? getOlympiads() : [];
  if(!events.length) return toast('আগে ইভেন্ট যোগ করুন।', true);
  const opts = events.map(o => `<option value="${bcEsc(o.id)}">${bcEsc(o.title)}</option>`).join('');
  const year = new Date().getFullYear();
  const today = new Date().toISOString().slice(0, 10);
  bulkRows = []; bulkEvent = null;
  openUserOverlay('bulk-cert-ov', `
    <div style="background:var(--bg,#0b1220);color:var(--txt);border:1px solid var(--bdr2);border-radius:14px;padding:20px;width:100%;max-width:640px;max-height:92vh;overflow:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h3 style="font-family:Montserrat;font-size:1.05rem;">⚡ Bulk Certificate Generator</h3>
        <button onclick="closeUserOverlay('bulk-cert-ov')" style="background:none;border:none;color:var(--muted);font-size:1.3rem;cursor:pointer;">✕</button>
      </div>

      <div class="fg"><label>Event</label>
        <select class="fi" id="bc-event" onchange="bulkLoadEvent()"><option value="">-- ইভেন্ট বেছে নিন --</option>${opts}</select>
      </div>
      <div class="f-row">
        <div class="fg"><label>Certificate ID prefix</label><input class="fi" id="bc-prefix" value="TVBD-${year}-" style="font-family:monospace;text-transform:uppercase;" oninput="bulkUpdateCount()"></div>
        <div class="fg"><label>Issue date</label><input class="fi" type="date" id="bc-date" value="${today}"></div>
      </div>
      <div class="f-row">
        <div class="fg"><label>Merit হবে কত % বা তার বেশি স্কোরে (ফাঁকা = সবাই Participant)</label><input class="fi" type="number" min="1" max="100" id="bc-merit" placeholder="e.g. 60"></div>
        <div class="fg" style="display:flex;align-items:flex-end;"><div class="chk-wrap"><input type="checkbox" id="bc-seg"><label for="bc-seg"> প্রতিটি Segment আলাদা র‍্যাংক</label></div></div>
      </div>

      <div style="display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 10px;">
        <button class="e-btn" onclick="bulkSelect('participants')">Quiz দিয়েছে এমন সবাই (Winners বাদে)</button>
        <button class="e-btn" onclick="bulkSelect('all')">Select all</button>
        <button class="e-btn" onclick="document.querySelectorAll('.bc-chk').forEach(c=>c.checked=false);bulkUpdateCount()">Clear</button>
        <button class="e-btn" onclick="bulkRecalc()">🔄 Positions আবার হিসাব</button>
      </div>

      <p id="bc-note" style="font-size:.76rem;color:var(--muted);line-height:1.7;margin:4px 0 8px;">📝 শুধু যারা এই ইভেন্টের Exam (কুইজ) দিয়েছে তারাই সার্টিফিকেট পাবে। 🏆 Champion / Runner Up (বিজয়ী)-দের টিক ডিফল্টে বন্ধ থাকে, কারণ তাদের সার্টিফিকেট আপনি নিজে মেইল করবেন।</p>
      <datalist id="bc-pos-list">
        <option value="Champion"><option value="1st Runner Up"><option value="2nd Runner Up"><option value="Merit"><option value="Participant">
      </datalist>
      <div id="bc-list" style="border-top:1px solid var(--bdr);"><p style="color:var(--muted);font-size:.85rem;padding:14px 4px;">ওপর থেকে একটা ইভেন্ট বেছে নিন।</p></div>

      <p id="bc-summary" style="font-size:.8rem;color:var(--muted);margin:12px 0 4px;"></p>
      <button class="save-btn" id="bc-go" style="width:100%;margin-top:6px;" onclick="bulkGenerate()">⚡ Generate Certificates</button>
    </div>`);
}

async function bulkLoadEvent() {
  const id = document.getElementById('bc-event').value;
  const list = document.getElementById('bc-list');
  bulkEvent = getOlympiads().find(o => o.id === id) || null;
  bulkRows = [];
  if(!bulkEvent) { list.innerHTML = ''; return bulkUpdateCount(); }
  list.innerHTML = '<p style="color:var(--muted);font-size:.85rem;padding:14px 4px;">Loading…</p>';

  await Promise.all([
    typeof loadRegistrations === 'function' ? loadRegistrations() : null,
    typeof loadQuizSubmissions === 'function' ? loadQuizSubmissions() : null,
    typeof loadCertificates === 'function' ? loadCertificates() : null
  ]);
  const evTpl = await loadCertTemplate(true, bulkEvent.id);
  const tplSetting = evTpl || await loadCertTemplate(true);
  bulkExamOnly = !tplSetting || tplSetting.examOnly !== false;
  const note = document.getElementById('bc-note');
  if(note) note.innerHTML = bulkExamOnly
    ? '📝 শুধু যারা এই ইভেন্টের Exam (কুইজ) দিয়েছে তারাই সার্টিফিকেট পাবে। 🏆 Champion / Runner Up (বিজয়ী)-দের টিক ডিফল্টে বন্ধ থাকে, কারণ তাদের সার্টিফিকেট আপনি নিজে মেইল করবেন।'
    : '📝 Exam-এর নিয়ম এখন বন্ধ আছে, তাই রেজিস্টার করা সবাইকে বাছা যাবে।';

  const title = bcNorm(bulkEvent.title);
  const regs = getRegistrations().filter(r => bcNorm(r.olympiad) === title);
  const subs = getQuizSubmissions().filter(s => bulkEvent.quizId && s.quizId === bulkEvent.quizId);
  const issued = new Set(getCertificates().filter(c => bcNorm(c.event) === title).map(c => bcNorm(c.name)));

  const seen = new Set();
  regs.forEach(r => {
    const em = bcNorm(r.email);
    if(seen.has(em)) return;
    seen.add(em);
    const sub = subs.find(s => bcNorm(s.email) === em);
    const hasScore = sub && sub.totalScore != null;
    bulkRows.push({
      i: bulkRows.length,
      name: r.name || '',
      email: r.email || '',
      segment: r.segment || '',
      hasQuiz: !!sub,
      pending: !!sub && !hasScore,
      score: hasScore ? Number(sub.totalScore) : null,
      possible: sub ? (Number(sub.totalPossible) || 0) : 0,
      time: sub && sub.timeTakenSeconds != null ? Number(sub.timeTakenSeconds) : null,
      issued: issued.has(bcNorm(r.name)),
      position: 'Participant'
    });
  });

  document.getElementById('bc-seg').checked = bulkRows.some(r => r.segment);
  bulkRecalc();
}

function bulkRecalc() {
  const bySeg = document.getElementById('bc-seg').checked;
  const meritPct = parseFloat(document.getElementById('bc-merit').value);
  const groups = {};
  bulkRows.forEach(r => { const k = bySeg ? r.segment : 'all'; (groups[k] = groups[k] || []).push(r); });
  const titles = ['Champion', '1st Runner Up', '2nd Runner Up'];
  Object.values(groups).forEach(g => {
    const ranked = g.filter(r => r.score != null && r.score > 0)
      .sort((a, b) => (b.score - a.score) || ((a.time ?? 1e12) - (b.time ?? 1e12)));
    g.forEach(r => {
      const idx = ranked.indexOf(r);
      if(idx > -1 && idx < 3) r.position = titles[idx];
      else if(!isNaN(meritPct) && r.score != null && r.possible > 0 && (r.score / r.possible * 100) >= meritPct) r.position = 'Merit';
      else r.position = 'Participant';
    });
  });
  bulkRender();
}

function bulkRender() {
  const list = document.getElementById('bc-list');
  if(!bulkRows.length) {
    list.innerHTML = '<p style="color:var(--muted);font-size:.85rem;padding:14px 4px;line-height:1.7;">এই ইভেন্টে কেউ রেজিস্ট্রেশন করেনি।</p>';
    return bulkUpdateCount();
  }
  const sorted = [...bulkRows].sort((a, b) => ((b.score ?? -1) - (a.score ?? -1)) || a.name.localeCompare(b.name));
  list.innerHTML = sorted.map(r => {
    const score = r.pending ? '⏳ Review pending' : r.score != null ? `${r.score}/${r.possible}` : (r.hasQuiz ? '—' : 'No quiz');
    return `
    <div style="display:flex;gap:10px;align-items:center;padding:10px 4px;border-bottom:1px solid var(--bdr);flex-wrap:wrap;${(r.issued || !bulkEligible(r)) ? 'opacity:.55;' : ''}">
      <input type="checkbox" class="bc-chk" data-i="${r.i}" ${(r.issued || !bulkEligible(r)) ? 'disabled' : (bcIsWinner(r.position) ? '' : 'checked')} style="width:18px;height:18px;" onchange="bulkUpdateCount()">
      <div style="flex:1;min-width:150px;">
        <div style="font-weight:700;font-size:.88rem;">${bcEsc(r.name)}</div>
        <div style="font-size:.72rem;color:var(--muted);">${bcEsc(r.segment)}${r.segment ? ' · ' : ''}Score: ${score}${!bulkEligible(r) ? ' · 📝 Exam দেননি' : ''}${r.issued ? ' · ✅ Already issued' : (bcIsWinner(r.position) ? ' · 🏆 Winner' : '')}</div>
      </div>
      <input class="fi bc-pos" data-i="${r.i}" list="bc-pos-list" value="${bcEsc(r.position)}" ${r.issued ? 'disabled' : ''} style="width:150px;">
    </div>`;
  }).join('');
  bulkUpdateCount();
}

function bulkNextNumber(prefix) {
  let max = 0;
  getCertificates().forEach(c => {
    const id = String(c.certId || '').toUpperCase();
    if(id.startsWith(prefix)) {
      const n = parseInt(id.slice(prefix.length), 10);
      if(!isNaN(n) && n > max) max = n;
    }
  });
  return max + 1;
}

function bulkUpdateCount() {
  const el = document.getElementById('bc-summary');
  if(!el) return;
  const n = document.querySelectorAll('.bc-chk:checked').length;
  const prefix = (document.getElementById('bc-prefix').value || '').trim().toUpperCase();
  if(!bulkRows.length || !prefix) { el.textContent = ''; return; }
  const first = prefix + String(bulkNextNumber(prefix)).padStart(3, '0');
  const elig = bulkRows.filter(bulkEligible).length;
  el.textContent = `${n} জন নির্বাচিত (Exam দিয়েছেন ${elig}/${bulkRows.length} জন) · প্রথম Certificate ID: ${first}`;
}

async function bulkGenerate() {
  if(!bulkEvent) return toast('আগে ইভেন্ট বেছে নিন।', true);
  const prefix = document.getElementById('bc-prefix').value.trim().toUpperCase();
  const date = document.getElementById('bc-date').value;
  if(!prefix || !date) return toast('ID prefix ও তারিখ দিন।', true);

  const picked = Array.from(document.querySelectorAll('.bc-chk')).filter(c => c.checked).map(c => Number(c.dataset.i))
    .filter(i => { const rr = bulkRows.find(x => x.i === i); return rr && bulkEligible(rr); });
  if(!picked.length) return toast('কমপক্ষে একজনকে বেছে নিন।', true);

  const pos = {};
  document.querySelectorAll('.bc-pos').forEach(el => { pos[el.dataset.i] = el.value.trim(); });
  if(picked.some(i => !pos[i])) return toast('সবার Position লিখুন।', true);
  if(!confirm(`${picked.length}টা সার্টিফিকেট তৈরি হবে। নিশ্চিত?`)) return;

  let n = bulkNextNumber(prefix);
  const list = picked.map(i => {
    const r = bulkRows.find(x => x.i === i);
    return { certId: prefix + String(n++).padStart(3, '0'), name: r.name, email: r.email || '', event: bulkEvent.title, eventId: bulkEvent.id, position: pos[i], issueDate: date };
  });

  const btn = document.getElementById('bc-go');
  btn.disabled = true; btn.textContent = 'Generating…';
  const res = await addCertificatesBulk(list);
  btn.disabled = false; btn.textContent = '⚡ Generate Certificates';
  if(!res.success) return toast(res.error || 'Failed!', true);

  toast(`${res.count}টা সার্টিফিকেট তৈরি হয়েছে! ✅`);
  if(typeof renderCertificatesTable === 'function') renderCertificatesTable();
  bulkCreated = list;
  bulkShowResult();
}

let bulkCreated = [];
const BULK_ZIP_SIZE = 40;

function bulkShowResult() {
  const parts = Math.ceil(bulkCreated.length / BULK_ZIP_SIZE);
  const btns = Array.from({ length: parts }, (_, k) => {
    const from = k * BULK_ZIP_SIZE + 1, to = Math.min((k + 1) * BULK_ZIP_SIZE, bulkCreated.length);
    return `<button class="save-btn" id="bc-zip-${k}" style="width:100%;margin-top:10px;" onclick="bulkZipPart(${k})">⬇️ ${parts > 1 ? `ZIP ${k + 1} (${from}–${to})` : `সব সার্টিফিকেট ডাউনলোড (ZIP)`}</button>`;
  }).join('');
  openUserOverlay('bulk-cert-ov', `
    <div style="background:var(--bg,#0b1220);color:var(--txt);border:1px solid var(--bdr2);border-radius:14px;padding:22px;width:100%;max-width:440px;max-height:90vh;overflow:auto;text-align:center;">
      <div style="font-size:2.4rem;margin-bottom:6px;">✅</div>
      <h3 style="font-family:Montserrat;font-size:1.05rem;margin-bottom:8px;">${bulkCreated.length}টা সার্টিফিকেট তৈরি হয়েছে</h3>
      <p style="font-size:.82rem;color:var(--muted);line-height:1.7;">প্রতিটা সার্টিফিকেটে নাম, Verify ID ও QR কোড নিজে থেকে বসানো আছে। ${parts > 1 ? 'ফোনে ভারী না হওয়ার জন্য ৪০টা করে ZIP আলাদা করা হয়েছে।' : ''}</p>
      ${btns}
      <button class="e-btn" style="width:100%;margin-top:14px;padding:10px;" onclick="closeUserOverlay('bulk-cert-ov')">Done</button>
    </div>`);
}

async function bulkZipPart(k) {
  const certs = bulkCreated.slice(k * BULK_ZIP_SIZE, (k + 1) * BULK_ZIP_SIZE);
  const btn = document.getElementById('bc-zip-' + k);
  const label = btn.textContent; btn.disabled = true;
  try {
    const blob = await tvbdCert.zipBlob(certs, (i, n) => { btn.textContent = `Generating ${i}/${n}…`; });
    const evName = (bulkEvent && bulkEvent.title ? bulkEvent.title : 'event').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'event';
    tvbdCert.download(blob, `Certificates_${evName}_part${k + 1}.zip`);
    toast('Downloaded! ✅');
  } catch(e) { console.error(e); toast('ZIP তৈরি করা যায়নি!', true); }
  btn.disabled = false; btn.textContent = label;
}

/*===== ACTIVITY LOG VIEWER (main admin only) =====*/
let activityLogs = [];

async function loadActivityLogUI() {
  const tbody = document.getElementById('logtbl');
  if(!tbody) return;
  tbody.innerHTML = `<tr class="empty-row"><td colspan="6">Loading…</td></tr>`;
  activityLogs = await loadAdminLogs(300);
  const sel = document.getElementById('log-section');
  const keep = sel.value;
  const secs = [...new Set(activityLogs.map(l => l.section).filter(Boolean))].sort();
  sel.innerHTML = '<option value="">সব সেকশন</option>' + secs.map(x => `<option value="${bcEsc(x)}" ${x === keep ? 'selected' : ''}>${bcEsc(x)}</option>`).join('');
  renderActivityLog();
}

function renderActivityLog() {
  const tbody = document.getElementById('logtbl');
  if(!tbody) return;
  const sec = document.getElementById('log-section').value;
  const q = (document.getElementById('log-search').value || '').trim().toLowerCase();
  const rows = activityLogs.filter(l =>
    (!sec || l.section === sec) &&
    (!q || [l.email, l.target, l.details, l.section, l.action].join(' ').toLowerCase().includes(q)));
  document.getElementById('log-count').textContent = rows.length ? `${rows.length}টা এন্ট্রি` : '';
  if(!rows.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">কোনো লগ নেই।</td></tr>`;
    return;
  }
  const color = a => /delete|revoke/.test(a) ? '#f87171' : /add/.test(a) ? '#4ade80' : '#60a5fa';
  tbody.innerHTML = rows.map(l => `
    <tr>
      <td style="white-space:nowrap;">${fmtUserDate(l.at)}</td>
      <td>${escUser(l.email)}</td>
      <td><span style="color:${color(l.action || '')};font-weight:700;text-transform:capitalize;">${bcEsc(l.action)}</span></td>
      <td>${escUser(l.section)}</td>
      <td>${escUser(l.target)}</td>
      <td style="color:var(--muted);">${escUser(l.details)}</td>
    </tr>`).join('');
}

async function clearOldLogsUI() {
  if(!confirm('৩০ দিনের পুরোনো সব লগ মুছে যাবে। নিশ্চিত?')) return;
  const n = await deleteOldAdminLogs(Date.now() - 30 * 24 * 3600 * 1000);
  if(n < 0) return toast('মুছতে ব্যর্থ!', true);
  toast(`${n}টা পুরোনো লগ মুছে গেছে।`);
  loadActivityLogUI();
}

async function loadPopupSettings() {
  if(typeof getPopupSettings !== 'function') return;
  const s = await getPopupSettings();
  const m = {'ps-title':s.title,'ps-message':s.message,'ps-btn-text':s.buttonText,'ps-btn-link':s.buttonLink,'ps-deadline':s.deadline,'ps-nb-text':s.noticeBarText};
  Object.entries(m).forEach(([id,val]) => { const el=document.getElementById(id); if(el) el.value=val||''; });
  const a = document.getElementById('ps-active'); if(a) a.checked = s.active||false;
  const nb = document.getElementById('ps-nb-active'); if(nb) nb.checked = s.showNoticeBar||false;
}

async function savePopupSettings() {
  const data = { active:document.getElementById('ps-active')?.checked||false, title:document.getElementById('ps-title')?.value.trim()||'', message:document.getElementById('ps-message')?.value.trim()||'', buttonText:document.getElementById('ps-btn-text')?.value.trim()||'Apply Now', buttonLink:document.getElementById('ps-btn-link')?.value.trim()||'', deadline:document.getElementById('ps-deadline')?.value||'', showNoticeBar:document.getElementById('ps-nb-active')?.checked||false, noticeBarText:document.getElementById('ps-nb-text')?.value.trim()||'' };
  if(data.active && !data.title) return toast("Title required!", true);
  if(await updatePopupSettings(data)) toast("Saved! ✅");
  else toast("Failed!", true);
                  }
async function savePopupSettings() {
  const data = { active:document.getElementById('ps-active')?.checked||false, title:document.getElementById('ps-title')?.value.trim()||'', message:document.getElementById('ps-message')?.value.trim()||'', buttonText:document.getElementById('ps-btn-text')?.value.trim()||'Apply Now', buttonLink:document.getElementById('ps-btn-link')?.value.trim()||'', deadline:document.getElementById('ps-deadline')?.value||'', showNoticeBar:document.getElementById('ps-nb-active')?.checked||false, noticeBarText:document.getElementById('ps-nb-text')?.value.trim()||'' };
  if(data.active && !data.title) return toast("Title required!", true);
  if(await updatePopupSettings(data)) toast("Saved! ✅");
  else toast("Failed!", true);
}

/*===== TEAM MANAGEMENT =====*/
function renderTeamTable() {
  const tbody = document.getElementById('ttbl');
  if(!tbody) return;
  const team = getTeam();
  if(team.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No team members yet. Click "+ Add Member" to start.</td></tr>`;
    return;
  }
  tbody.innerHTML = '';
  team.forEach((m) => {
    tbody.innerHTML += `
      <tr>
        <td><strong style="color:var(--blue-br)">${m.order || '—'}</strong></td>
        <td>
          ${m.photo 
            ? `<img src="${m.photo}" class="thumb" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">` 
            : `<div class="thumb" style="width:40px;height:40px;border-radius:50%;background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:.8rem;color:var(--blue-br);font-weight:700;">${(m.name || 'NA').substring(0,2).toUpperCase()}</div>`}
        </td>
        <td>${m.name}</td>
        <td><span class="bs bs-active">${m.role}</span>${m.special ? ' <span class="bs" style="background:rgba(167,139,250,.14);color:#a78bfa;border:1px solid rgba(167,139,250,.3);">🔷 Special</span>' : ''}</td>
        <td style="color:var(--muted);font-size:.8rem;">${m.department || '—'}</td>
        <td style="color:var(--muted);font-size:.8rem;">${(m.description || '—').substring(0, 40)}${m.description && m.description.length > 40 ? '...' : ''}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="editTeamMember('${m.id}')">Edit</button>
          <button class="d-btn" onclick="deleteTeamMemberAction('${m.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

function openTeamForm() {
  document.getElementById('tfm-title').textContent = "Add Team Member";
  document.getElementById('tf-eid').value = '';
  document.getElementById('tf-name').value = '';
  document.getElementById('tf-role').value = '';
  document.getElementById('tf-special').value = '0';
  document.getElementById('tf-dept').value = '';
  document.getElementById('tf-desc').value = '';
  document.getElementById('tf-order').value = '';
  document.getElementById('tf-photo').value = '';
  document.getElementById('tf-prev').innerHTML = '';
  openFM('tfm');
}

function editTeamMember(id) {
  const m = getTeam().find(x => x.id === id);
  if(!m) return;
  document.getElementById('tfm-title').textContent = "Edit Team Member";
  document.getElementById('tf-eid').value = id;
  document.getElementById('tf-name').value = m.name || '';
  document.getElementById('tf-role').value = m.role || '';
  document.getElementById('tf-special').value = m.special ? '1' : '0';
  document.getElementById('tf-dept').value = m.department || '';
  document.getElementById('tf-desc').value = m.description || '';
  document.getElementById('tf-order').value = m.order || '';
  document.getElementById('tf-photo').value = m.photo || '';
  document.getElementById('tf-prev').innerHTML = m.photo ? `<img src="${m.photo}">` : '';
  openFM('tfm');
}

async function saveTeamMember() {
  const name = document.getElementById('tf-name').value.trim();
  const role = document.getElementById('tf-role').value.trim();
  const special = document.getElementById('tf-special').value === '1';
  const department = document.getElementById('tf-dept').value.trim() || 'Other';
  const description = document.getElementById('tf-desc').value.trim();
  const order = parseInt(document.getElementById('tf-order').value) || 999;
  const photo = document.getElementById('tf-photo').value.trim();
  
  if(!name) return toast("Name is required!", true);
  if(!role) return toast("Role is required!", true);
  
  const member = { name, role, department, description, order, photo, special };
  const eid = document.getElementById('tf-eid').value;
  
  const btn = document.querySelector('#tfm .fs-btn');
  btn.textContent = 'Saving...';
  btn.disabled = true;
  
  const ok = eid === '' ? await addTeamMember(member) : await updateTeamMember(eid, member);
  
  btn.textContent = 'Save Member';
  btn.disabled = false;
  
  if(ok) {
    renderTeamTable();
    renderDashboard();
    closeFM('tfm');
    toast("Team member saved! ✅");
  } else {
    toast("Save failed!", true);
  }
}

async function deleteTeamMemberAction(id) {
  if(!confirm("Delete this team member?")) return;
  const ok = await deleteTeamMember(id);
  if(ok) {
    renderTeamTable();
    renderDashboard();
    toast("Team member deleted.");
  } else {
    toast("Delete failed!", true);
  }
}

async function prevTeamPhoto(input) {
  if(!input.files?.[0]) return;
  const file = input.files[0];
  
  if(file.size > 32 * 1024 * 1024) {
    return toast("File too large! Max 32MB", true);
  }
  
  const prev = document.getElementById('tf-prev');
  prev.innerHTML = `<div style="padding:10px;color:var(--muted)">⏳ Uploading to ImgBB...</div>`;
  
  const result = await uploadToImgBB(file);
  
  if(result.success) {
    document.getElementById('tf-photo').value = result.url;
    prev.innerHTML = `<img src="${result.url}"><div style="color:#4ade80;font-size:.75rem;margin-top:5px">✅ Uploaded!</div>`;
    toast("Photo uploaded! ✅");
  } else {
    prev.innerHTML = `<div style="color:#f87171">❌ Upload failed</div>`;
    toast("Upload failed!", true);
  }
}

/*===== OUR NETWORK (affiliated pages) ADMIN =====*/
function renderNetworkTable() {
  const tbody = document.getElementById('nptbl');
  if(!tbody) return;

  const pages = getNetworkPages();
  if(pages.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No network pages yet. Click "+ Add Page" to start.</td></tr>`;
    return;
  }

  tbody.innerHTML = '';
  pages.forEach((p) => {
    tbody.innerHTML += `
      <tr>
        <td><strong style="color:var(--blue-br)">${p.order || '—'}</strong></td>
        <td>
          ${p.logo
            ? `<img src="${p.logo}" class="thumb" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">`
            : `<div class="thumb" style="width:40px;height:40px;border-radius:50%;background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:.8rem;color:var(--blue-br);font-weight:700;">${(p.name || 'NA').substring(0,2).toUpperCase()}</div>`}
        </td>
        <td>${p.name}</td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><a href="${p.url}" target="_blank" rel="noopener" style="color:var(--lblue);">${p.url}</a></td>
        <td style="color:var(--muted);font-size:.8rem;">${(p.description || '—').substring(0, 40)}${p.description && p.description.length > 40 ? '...' : ''}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="editNetworkPage('${p.id}')">Edit</button>
          <button class="d-btn" onclick="deleteNetworkPageAction('${p.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

function openNetworkForm() {
  document.getElementById('npfm-title').textContent = "Add Network Page";
  document.getElementById('np-eid').value = '';
  document.getElementById('np-name').value = '';
  document.getElementById('np-url').value = '';
  document.getElementById('np-desc').value = '';
  document.getElementById('np-order').value = '';
  document.getElementById('np-logo').value = '';
  document.getElementById('np-prev').innerHTML = '';
  openFM('npfm');
}

function editNetworkPage(id) {
  const p = getNetworkPages().find(x => x.id === id);
  if(!p) return;
  document.getElementById('npfm-title').textContent = "Edit Network Page";
  document.getElementById('np-eid').value = id;
  document.getElementById('np-name').value = p.name || '';
  document.getElementById('np-url').value = p.url || '';
  document.getElementById('np-desc').value = p.description || '';
  document.getElementById('np-order').value = p.order || '';
  document.getElementById('np-logo').value = p.logo || '';
  document.getElementById('np-prev').innerHTML = p.logo ? `<img src="${p.logo}">` : '';
  openFM('npfm');
}

async function saveNetworkPage() {
  const name = document.getElementById('np-name').value.trim();
  let url = document.getElementById('np-url').value.trim();
  const description = document.getElementById('np-desc').value.trim();
  const order = parseInt(document.getElementById('np-order').value) || 999;
  const logo = document.getElementById('np-logo').value.trim();

  if(!name) return toast("Page name is required!", true);
  if(!url) return toast("Website/Facebook URL is required!", true);
  if(!/^https?:\/\//i.test(url)) url = 'https://' + url;

  const page = { name, url, description, order, logo };
  const eid = document.getElementById('np-eid').value;

  const btn = document.querySelector('#npfm .fs-btn');
  btn.textContent = 'Saving...';
  btn.disabled = true;

  const ok = eid === '' ? await addNetworkPage(page) : await updateNetworkPage(eid, page);

  btn.textContent = 'Save Page';
  btn.disabled = false;

  if(ok) {
    renderNetworkTable();
    closeFM('npfm');
    toast("Network page saved! ✅");
  } else {
    toast("Save failed!", true);
  }
}

async function deleteNetworkPageAction(id) {
  if(!confirm("Delete this network page?")) return;
  const ok = await deleteNetworkPage(id);
  if(ok) {
    renderNetworkTable();
    toast("Network page deleted.");
  } else {
    toast("Delete failed!", true);
  }
}

async function prevNetworkLogo(input) {
  if(!input.files?.[0]) return;
  const file = input.files[0];

  if(file.size > 32 * 1024 * 1024) {
    return toast("File too large! Max 32MB", true);
  }

  const prev = document.getElementById('np-prev');
  prev.innerHTML = `<div style="padding:10px;color:var(--muted)">⏳ Uploading to ImgBB...</div>`;

  const result = await uploadToImgBB(file);

  if(result.success) {
    document.getElementById('np-logo').value = result.url;
    prev.innerHTML = `<img src="${result.url}"><div style="color:#4ade80;font-size:.75rem;margin-top:5px">✅ Uploaded!</div>`;
    toast("Logo uploaded! ✅");
  } else {
    prev.innerHTML = `<div style="color:#f87171">❌ Upload failed</div>`;
    toast("Upload failed!", true);
  }
}

/*===== QUIZ / EXAM ADMIN =====*/
let qfQuestionCount = 0;

function qfTimestampToLocalInput(ts) {
  if(!ts) return '';
  const d = new Date(ts);
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function qfLocalInputToTimestamp(val) {
  if(!val) return null;
  const t = new Date(val).getTime();
  return isNaN(t) ? null : t;
}

function openQuizForm() {
  document.getElementById('qfm-title').textContent = "Add Quiz";
  document.getElementById('qf-eid').value = '';
  document.getElementById('qf-title').value = '';
  document.getElementById('qf-desc').value = '';
  document.getElementById('qf-duration').value = '';
  document.getElementById('qf-status').value = 'draft';
  document.getElementById('qf-secure').checked = true;
  document.getElementById('qf-start').value = '';
  document.getElementById('qf-end').value = '';
  document.getElementById('qf-questions').innerHTML = '';
  qfQuestionCount = 0;
  addQuizQuestionRow();
  openFM('qfm');
}

function addQuizQuestionRow(existing) {
  qfQuestionCount++;
  const qid = existing?.id || ('q' + Date.now() + qfQuestionCount);
  const type = existing?.type || 'mcq';
  const wrap = document.createElement('div');
  wrap.className = 'qf-qrow';
  wrap.dataset.qid = qid;
  wrap.innerHTML = `
    <div class="qf-qrow-head">
      <span class="qf-qnum">Q${qfQuestionCount}</span>
      <select class="fi qf-type" onchange="toggleQfOptions(this)">
        <option value="mcq" ${type==='mcq'?'selected':''}>MCQ</option>
        <option value="short" ${type==='short'?'selected':''}>Short Answer</option>
      </select>
      <input class="fi qf-points" type="number" min="1" placeholder="Points" value="${existing?.points ?? 1}">
      <button type="button" class="qf-qdel" onclick="this.closest('.qf-qrow').remove()">🗑 Remove</button>
    </div>
    <div class="fg" style="margin-bottom:8px;">
      <textarea class="fi qf-qtext" style="min-height:50px;" placeholder="Question text...">${existing?.text ?? ''}</textarea>
    </div>
    <div class="qf-opts" style="${type==='short'?'display:none':''}">
      ${[0,1,2,3].map(i => `
        <div class="qf-opt-row">
          <input type="radio" name="correct-${qid}" value="${i}" ${existing?.correctIndex===i?'checked':''}>
          <input class="fi qf-opt" type="text" placeholder="Option ${i+1}" value="${existing?.options?.[i] ?? ''}">
        </div>`).join('')}
      <p style="font-size:.7rem;color:var(--muted);">Select the radio button next to the correct option.</p>
    </div>`;
  document.getElementById('qf-questions').appendChild(wrap);
}

function toggleQfOptions(sel) {
  const row = sel.closest('.qf-qrow');
  row.querySelector('.qf-opts').style.display = sel.value === 'short' ? 'none' : '';
}

async function editQuiz(id) {
  let q = getQuizzes().find(x => x.id === id);
  if(!q) return;
  if(q.secure) {
    const keys = await loadQuizKey(id);
    if(!keys) toast('উত্তরের চাবি পড়া যায়নি — সঠিক উত্তর নতুন করে বেছে নিন।', true);
    q = { ...q, questions: (q.questions || []).map(x => x.type === 'mcq' ? { ...x, correctIndex: keys ? keys[x.id] : undefined } : x) };
  }
  document.getElementById('qfm-title').textContent = "Edit Quiz";
  document.getElementById('qf-eid').value = id;
  document.getElementById('qf-title').value = q.title || '';
  document.getElementById('qf-desc').value = q.description || '';
  document.getElementById('qf-duration').value = q.duration || '';
  document.getElementById('qf-status').value = q.status || 'draft';
  document.getElementById('qf-secure').checked = !!q.secure;
  document.getElementById('qf-start').value = qfTimestampToLocalInput(q.startAt);
  document.getElementById('qf-end').value = qfTimestampToLocalInput(q.endAt);
  document.getElementById('qf-questions').innerHTML = '';
  qfQuestionCount = 0;
  (q.questions || []).forEach(qq => addQuizQuestionRow(qq));
  if(!q.questions || !q.questions.length) addQuizQuestionRow();
  openFM('qfm');
}

async function saveQuiz() {
  const title = document.getElementById('qf-title').value.trim();
  const description = document.getElementById('qf-desc').value.trim();
  const duration = parseInt(document.getElementById('qf-duration').value) || 30;
  const status = document.getElementById('qf-status').value;
  const eid = document.getElementById('qf-eid').value;
  const startAt = qfLocalInputToTimestamp(document.getElementById('qf-start').value);
  const endAt = qfLocalInputToTimestamp(document.getElementById('qf-end').value);

  if(!title) return toast("Quiz title is required!", true);
  if(startAt && endAt && endAt <= startAt) return toast("End time must be after start time!", true);

  const rows = document.querySelectorAll('#qf-questions .qf-qrow');
  if(!rows.length) return toast("Add at least one question!", true);

  const questions = [];
  for(const row of rows) {
    const qid = row.dataset.qid;
    const type = row.querySelector('.qf-type').value;
    const text = row.querySelector('.qf-qtext').value.trim();
    const points = parseInt(row.querySelector('.qf-points').value) || 1;
    if(!text) return toast("Every question needs text!", true);

    if(type === 'mcq') {
      const opts = Array.from(row.querySelectorAll('.qf-opt')).map(i => i.value.trim());
      const checked = row.querySelector(`input[name="correct-${qid}"]:checked`);
      if(opts.some(o => !o)) return toast("Fill in all 4 options for every MCQ!", true);
      if(!checked) return toast("Mark the correct option for every MCQ!", true);
      questions.push({ id: qid, type: 'mcq', text, options: opts, correctIndex: parseInt(checked.value), points });
    } else {
      questions.push({ id: qid, type: 'short', text, points });
    }
  }

  const quiz = { title, description, duration, status, startAt, endAt, questions, secure: document.getElementById('qf-secure').checked };

  const result = eid ? await updateQuiz(eid, quiz) : await addQuiz(quiz);
  if(result.success) {
    toast(eid ? "Quiz updated!" : "Quiz created!");
    closeFM('qfm');
    renderQuizTable();
  } else {
    toast(result.error || "Save failed!", true);
  }
}

async function deleteQuizAction(id) {
  if(!confirm("Delete this quiz? All its submissions will remain but the quiz itself will be gone.")) return;
  const ok = await deleteQuiz(id);
  if(ok) { toast("Quiz deleted!"); renderQuizTable(); }
  else toast("Delete failed!", true);
}

function renderQuizTable() {
  const tbody = document.getElementById('qtbl');
  if(!tbody) return;
  const quizzes = getQuizzes();
  if(!quizzes.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No quizzes yet. Click "+ Add Quiz" to create one.</td></tr>`;
    return;
  }
  const fmt = ts => new Date(ts).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
  tbody.innerHTML = quizzes.map(q => {
    let sched = '<span style="color:var(--muted);font-size:.78rem;">Always open</span>';
    if(q.startAt || q.endAt) {
      const avail = getQuizAvailability(q);
      const label = avail.open ? (q.endAt ? `Open · closes ${fmt(q.endAt)}` : 'Open now')
        : (avail.reason === 'not_started' ? `Opens ${fmt(q.startAt)}` : `Closed ${fmt(q.endAt)}`);
      sched = `<span style="font-size:.78rem;">${label}</span>`;
    }
    return `
    <tr>
      <td><strong>${q.title}</strong></td>
      <td>${(q.questions || []).length}</td>
      <td>${q.duration} min</td>
      <td>${sched}</td>
      <td><span class="bs ${q.status === 'published' ? 'bs-active' : 'bs-past'}">${q.status === 'published' ? 'Published' : 'Draft'}</span></td>
      <td class="tbl-acts">
        <button class="e-btn" onclick="editQuiz('${q.id}')">Edit</button>
        <button class="d-btn" onclick="deleteQuizAction('${q.id}')">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

/*----- QUIZ SUBMISSIONS (review & grade) -----*/
function renderQuizSubmissionsTable() {
  const tbody = document.getElementById('qstbl');
  if(!tbody) return;
  const subs = getQuizSubmissions();
  const quizzes = getQuizzes();
  if(!subs.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="10">No submissions yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = subs.map(s => {
    const quiz = quizzes.find(q => q.id === s.quizId);
    const statusBadge = s.status === 'reviewed'
      ? `<span class="bs bs-active">Reviewed</span>`
      : s.status === 'pending_grading'
        ? `<span class="bs bs-past">Not graded</span>`
        : `<span class="bs bs-upcoming">Pending Review</span>`;
    const startedStr = s.startedAt ? new Date(s.startedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '—';
    const submittedStr = s.submittedAt ? new Date(s.submittedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—';
    let timeTakenStr = '—';
    if(s.timeTakenSeconds != null) {
      const m = Math.floor(s.timeTakenSeconds / 60), sec = s.timeTakenSeconds % 60;
      timeTakenStr = `${m}m ${sec}s`;
    }
    return `
    <tr>
            <td><strong>${s.name}</strong><br><span style="color:var(--muted);font-size:.75rem;">${s.email || ''} ${s.phone ? '· ' + s.phone : ''}</span></td>
      <td>${quiz ? quiz.title : '(deleted quiz)'}</td>
      <td>${s.mcqScore == null ? '—' : s.mcqScore + ' / ' + (s.mcqTotal ?? 0)}</td>
      <td>${s.shortScore === null || s.shortScore === undefined ? '—' : s.shortScore + ' / ' + s.shortTotal}</td>
      <td><strong>${s.totalScore === null || s.totalScore === undefined ? '—' : s.totalScore + ' / ' + s.totalPossible}</strong></td>
      <td>${statusBadge}</td>
      <td style="white-space:nowrap;font-size:.78rem;color:var(--muted);">${startedStr}</td>
      <td style="white-space:nowrap;font-size:.78rem;color:var(--muted);">${submittedStr}</td>
      <td style="white-space:nowrap;font-size:.78rem;">${timeTakenStr}</td>
      <td class="tbl-acts">
        <button class="e-btn" onclick="openGradeModal('${s.id}')">${s.shortTotal > 0 ? 'Review' : 'View'}</button>
        <button class="d-btn" onclick="deleteQuizSubmissionAction('${s.id}')">Delete</button>
      </td>
    </tr>`;
  }).join('');
}

async function deleteQuizSubmissionAction(id) {
  if(!confirm("Delete this submission?")) return;
  const ok = await deleteQuizSubmission(id);
  if(ok) { toast("Submission deleted!"); renderQuizSubmissionsTable(); }
  else toast("Delete failed!", true);
}

async function openGradeModal(id) {
  const sub = getQuizSubmissions().find(x => x.id === id);
  if(!sub) return;
  let quiz = getQuizzes().find(q => q.id === sub.quizId);
  if(quiz && quiz.secure) {
    const keys = await loadQuizKey(quiz.id);
    quiz = { ...quiz, questions: (quiz.questions || []).map(x => x.type === 'mcq' ? { ...x, correctIndex: keys ? keys[x.id] : undefined } : x) };
  }
  document.getElementById('qg-sid').value = id;

  const shortQuestions = (quiz?.questions || []).filter(q => q.type === 'short');
  const mcqQuestions = (quiz?.questions || []).filter(q => q.type === 'mcq');

  let timeTakenStr = '—';
  if(sub.timeTakenSeconds != null) {
    const m = Math.floor(sub.timeTakenSeconds / 60), sec = sub.timeTakenSeconds % 60;
    timeTakenStr = `${m}m ${sec}s`;
  }
  const startedStr = sub.startedAt ? new Date(sub.startedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '—';
  const submittedStr = sub.submittedAt ? new Date(sub.submittedAt).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '—';

  let html = `
    <div style="background:var(--card2);border-radius:10px;padding:14px;margin-bottom:16px;">
      <strong>${sub.name}</strong><br>
      <span style="color:var(--muted);font-size:.82rem;">${sub.email || ''} ${sub.phone ? '· ' + sub.phone : ''} ${sub.registrationId ? '· Reg ID: ' + sub.registrationId : ''}</span><br>
      <span style="color:var(--lblue);font-size:.85rem;">MCQ auto-score: ${sub.mcqScore == null ? 'এখনও গ্রেড হয়নি (⚡ MCQ অটো-গ্রেড চাপুন)' : sub.mcqScore + ' / ' + (sub.mcqTotal ?? 0)}</span><br>
      <span style="color:var(--muted);font-size:.78rem;">Started: ${startedStr} · Submitted: ${submittedStr} · Time taken: ${timeTakenStr}</span>
    </div>`;

  if(mcqQuestions.length) {
    html += `<h4 style="font-size:.85rem;margin-bottom:10px;">MCQ Answers</h4>`;
    mcqQuestions.forEach((q, i) => {
      const given = sub.answers?.[q.id];
      const correct = given !== undefined && Number(given) === Number(q.correctIndex);
      html += `<div style="margin-bottom:10px;font-size:.82rem;">
        <strong>${i+1}. ${q.text}</strong><br>
        <span style="color:${correct ? '#4ade80' : '#f87171'};">
          Answered: ${q.options?.[given] ?? '(no answer)'} ${correct ? '✅' : '❌ (correct: ' + q.options?.[q.correctIndex] + ')'}
        </span>
      </div>`;
    });
  }

  if(shortQuestions.length) {
    html += `<h4 style="font-size:.85rem;margin:14px 0 10px;">Short Answers — score manually</h4>`;
    shortQuestions.forEach((q, i) => {
      const given = sub.answers?.[q.id] || '(no answer)';
      html += `<div style="margin-bottom:12px;font-size:.82rem;">
        <strong>${i+1}. ${q.text}</strong> <span style="color:var(--muted);">(${q.points} pts)</span><br>
        <div style="background:var(--card2);border-radius:8px;padding:10px;margin:6px 0;white-space:pre-wrap;">${given}</div>
      </div>`;
    });
    html += `
      <div class="fg">
        <label>Short-answer score (out of ${sub.shortTotal})</label>
        <input class="fi" type="number" id="qg-shortscore" min="0" max="${sub.shortTotal}" value="${sub.shortScore ?? ''}">
      </div>`;
  } else {
    html += `<p style="color:var(--muted);font-size:.82rem;">This quiz has no short-answer questions — score is fully automatic.</p>`;
  }

  document.getElementById('qg-body').innerHTML = html;
  openFM('qgm');
}

async function saveQuizGrade() {
  const id = document.getElementById('qg-sid').value;
  const sub = getQuizSubmissions().find(x => x.id === id);
  const shortInput = document.getElementById('qg-shortscore');

  let shortScore = 0;
  if(shortInput) {
    shortScore = parseFloat(shortInput.value);
    if(isNaN(shortScore) || shortScore < 0 || shortScore > sub.shortTotal) {
      return toast(`Enter a score between 0 and ${sub.shortTotal}`, true);
    }
  }

  const result = await gradeQuizSubmission(id, shortScore);
  if(result.success) {
    toast("Score saved!");
    closeFM('qgm');
    renderQuizSubmissionsTable();
  } else {
    toast(result.error || "Failed to save score!", true);
  }
}

/*===== EMAIL NOTIFICATIONS =====*/

const NOTIFY_TEMPLATES = {
  event: {
    subject: "New Event: [Event Name] — TalentVerse Bangladesh",
    message: "Hello,\n\nWe're excited to announce a new event: [Event Name]!\n\nDate: [Date]\nRegistration deadline: [Deadline]\n\nRegister now at https://talentversebd.github.io/tvbd/register.html\n\nSee you there!\n— TalentVerse Bangladesh"
  },
  result: {
    subject: "Results Published — [Event/Quiz Name]",
    message: "Hello,\n\nThe results for [Event/Quiz Name] have been published!\n\nCheck your result here: [link]\n\nThank you for participating.\n— TalentVerse Bangladesh"
  },
  exam: {
    subject: "Reminder: [Exam Name] starts soon!",
    message: "Hello,\n\nThis is a reminder that [Exam Name] begins on [Date/Time].\n\nMake sure to join on time at https://talentversebd.github.io/tvbd/quiz.html\n\nGood luck!\n— TalentVerse Bangladesh"
  }
};

function applyNotifyTemplate(key) {
  const t = NOTIFY_TEMPLATES[key];
  if(!t) return;
  document.getElementById('ntf-subject').value = t.subject;
  document.getElementById('ntf-message').value = t.message;
}

async function initNotifyPanel() {
  const warn = document.getElementById('ntf-config-warning');
  if(!window.NOTIFY_MAILER || !window.NOTIFY_MAILER.scriptUrl) {
    warn.style.display = 'block';
    warn.innerHTML = '⚠️ No Apps Script mailer configured yet — sending is disabled. See <code>firebase-config.js</code> → <code>NOTIFY_MAILER.scriptUrl</code> for setup instructions.';
    document.getElementById('ntf-send-btn').disabled = true;
  } else {
    warn.style.display = 'none';
    document.getElementById('ntf-send-btn').disabled = false;
  }

  if(typeof loadQuizzes === 'function') await loadQuizzes();
  const quizSelect = document.getElementById('ntf-quiz-select');
  const quizzes = typeof getQuizzes === 'function' ? getQuizzes() : [];
  quizSelect.innerHTML = quizzes.map(q => `<option value="${q.id}">${q.title}</option>`).join('') || '<option value="">(no quizzes yet)</option>';

  const canUsers = !!(adminAccess && adminAccess.all);
  const canRegs = canAdmin('registrations');
  const canSubs = canAdmin('qsubs');
  await Promise.all([
    canUsers && typeof loadRegisteredUsers === 'function' ? loadRegisteredUsers() : null,
    canRegs && typeof loadRegistrations === 'function' ? loadRegistrations() : null,
    canSubs && typeof loadQuizSubmissions === 'function' ? loadQuizSubmissions() : null
  ]);
  const audSel = document.getElementById('ntf-audience');
  const lock = (val, ok, label) => {
    const op = Array.from(audSel.options).find(o => o.value === val);
    if(!op) return;
    if(op.dataset.label === undefined) op.dataset.label = op.textContent;
    op.disabled = !ok;
    op.textContent = ok ? op.dataset.label : op.dataset.label + ' (' + label + ')';
  };
  lock('users', canUsers, 'শুধু মূল অ্যাডমিন');
  lock('registrations', canRegs, 'Registrations অনুমতি লাগবে');
  lock('quiz', canSubs, 'Quiz Submissions অনুমতি লাগবে');
  const firstOk = ['users', 'registrations', 'quiz', 'custom'].find(v => { const op = Array.from(audSel.options).find(o => o.value === v); return op && !op.disabled; });

  document.getElementById('ntf-audience').value = firstOk || 'custom';
  updateNotifyAudiencePreview();
  renderNotifyHistory();
}

function getNotifyRecipientEmails() {
  const audience = document.getElementById('ntf-audience').value;
  let emails = [];

  if(audience === 'users') {
    emails = (getRegisteredUsers() || []).map(u => u.email);
  } else if(audience === 'registrations') {
    emails = (getRegistrations() || []).map(r => r.email);
  } else if(audience === 'quiz') {
    const quizId = document.getElementById('ntf-quiz-select').value;
    emails = (getQuizSubmissions() || []).filter(s => s.quizId === quizId).map(s => s.email);
  } else if(audience === 'custom') {
    const raw = document.getElementById('ntf-custom-emails').value;
    emails = raw.split(/[\n,]/).map(e => e.trim()).filter(Boolean);
  }

  const seen = new Set();
  return emails
    .map(e => (e || '').trim().toLowerCase())
    .filter(e => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) && !seen.has(e) && seen.add(e));
}

function updateNotifyAudiencePreview() {
  const audience = document.getElementById('ntf-audience').value;
  document.getElementById('ntf-quiz-wrap').classList.toggle('qz-hidden', audience !== 'quiz');
  document.getElementById('ntf-custom-wrap').classList.toggle('qz-hidden', audience !== 'custom');

  const count = getNotifyRecipientEmails().length;
  document.getElementById('ntf-audience-count').textContent =
    count > 0 ? `📬 ${count} recipient${count !== 1 ? 's' : ''} will receive this email.` : '⚠️ No valid email addresses found for this audience yet.';
}

async function sendNotificationCampaign() {
  const subject = document.getElementById('ntf-subject').value.trim();
  const message = document.getElementById('ntf-message').value.trim();
  const audience = document.getElementById('ntf-audience').value;
  const recipients = getNotifyRecipientEmails();

  if(!subject || !message) return toast("Subject and message are required!", true);
  if(!recipients.length) return toast("No recipients found for this audience!", true);
  if(!window.NOTIFY_MAILER || !window.NOTIFY_MAILER.scriptUrl) {
    return toast("Apps Script mailer isn't configured yet — see Settings notes.", true);
  }
  if(!confirm(`Send this email to ${recipients.length} recipient(s)? This can't be undone.`)) return;

  const btn = document.getElementById('ntf-send-btn');
  btn.disabled = true;
  const progressWrap = document.getElementById('ntf-progress-wrap');
  const progressBar = document.getElementById('ntf-progress-bar');
  const progressText = document.getElementById('ntf-progress-text');
  progressWrap.style.display = 'block';

  let sent = 0, failed = 0, done = 0, abortReason = '';
  for(let i = 0; i < recipients.length; i++) {
    const to = recipients[i];
    done = i + 1;
    try {
      const idToken = await window.firebaseAuth.currentUser.getIdToken();
      const res = await fetch(window.NOTIFY_MAILER.scriptUrl, {
        method: 'POST',
        body: JSON.stringify({ idToken, to_email: to, subject, message })
      });
      const data = await res.json();
      if(data.success) sent++;
      else {
        failed++; console.error("Notify send failed for", to, data.error);
        if(data.error === 'unauthorized' || data.error === 'quota') { abortReason = data.error; break; }
      }
    } catch(err) {
      console.error("Notify send failed for", to, err);
      failed++;
    }
    const pct = Math.round(((i + 1) / recipients.length) * 100);
    progressBar.style.width = pct + '%';
    progressText.textContent = `Sending... ${i + 1} / ${recipients.length} (${sent} sent, ${failed} failed)`;
    await new Promise(r => setTimeout(r, 400));
  }

  if(abortReason) failed += recipients.length - done;
  await addNotificationRecord({ subject, audience, recipientCount: recipients.length, sent, failed });
  await loadNotificationHistory();
  renderNotifyHistory();

  if(abortReason) {
    progressText.textContent = abortReason === 'quota'
      ? `Stopped: Gmail's daily sending limit is reached (${sent} sent).`
      : `Stopped: the mailer refused this request (${sent} sent). Did you redeploy the new Code.gs?`;
    toast(abortReason === 'quota' ? 'Gmail-এর দৈনিক পাঠানোর সীমা শেষ।' : 'মেইলার অনুমতি দিচ্ছে না — নতুন Code.gs Deploy করেছেন কি?', true);
    btn.disabled = false;
    return;
  }

  progressText.textContent = `Done! ${sent} sent, ${failed} failed.`;
  toast(failed === 0 ? `Sent to all ${sent} recipients! 🎉` : `Sent to ${sent}, ${failed} failed.`, failed > 0);
  btn.disabled = false;
}

function renderNotifyHistory() {
  const tbody = document.getElementById('ntf-history-tbl');
  const history = getNotificationHistory();
  if(!history.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No campaigns sent yet.</td></tr>`;
    return;
  }
  const audienceLabels = { users: 'Registered Users', registrations: 'Registrations', quiz: 'Quiz Participants', custom: 'Custom List' };
  tbody.innerHTML = history.map(h => `
    <tr>
      <td><strong>${h.subject}</strong></td>
      <td>${audienceLabels[h.audience] || h.audience}</td>
      <td>${h.recipientCount}</td>
      <td>${h.sent} sent${h.failed ? `, ${h.failed} failed` : ''}</td>
      <td style="color:var(--muted);font-size:.78rem;">${h.sentAt ? new Date(h.sentAt).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'}</td>
    </tr>`).join('');
}

/*===== DASHBOARD NOTIFICATIONS (bell icon) =====*/

const BELL_TEMPLATES = {
  event: {
    subject: "নতুন ইভেন্ট: [ইভেন্টের নাম]",
    message: "আমরা নতুন ইভেন্ট [ইভেন্টের নাম] ঘোষণা করছি!\n\nতারিখ: [তারিখ]\nরেজিস্ট্রেশনের শেষ সময়: [শেষ তারিখ]\n\nএখনই রেজিস্ট্রেশন করুন: https://talentversebd.github.io/tvbd/register.html"
  },
  result: {
    subject: "ফলাফল প্রকাশিত — [ইভেন্ট/কুইজের নাম]",
    message: "[ইভেন্ট/কুইজের নাম]-এর ফলাফল প্রকাশ করা হয়েছে।\n\nনিজের ফলাফল দেখুন ড্যাশবোর্ডের 'My Results' অংশে।\n\nঅংশগ্রহণের জন্য ধন্যবাদ!"
  },
  exam: {
    subject: "রিমাইন্ডার: [পরীক্ষার নাম] শুরু হচ্ছে",
    message: "[পরীক্ষার নাম] শুরু হবে [তারিখ/সময়]।\n\nসময়মতো যোগ দিন: https://talentversebd.github.io/tvbd/quiz.html\n\nশুভকামনা!"
  }
};

function applyBellTemplate(key) {
  const t = BELL_TEMPLATES[key];
  if(!t) return;
  document.getElementById('bn-subject').value = t.subject;
  document.getElementById('bn-message').value = t.message;
}

async function initBellPanel() {
  await loadAnnouncements();
  renderBellList();
}

async function postBellNotification() {
  const subject = document.getElementById('bn-subject').value.trim();
  const message = document.getElementById('bn-message').value.trim();
  if(!subject || !message) return toast("শিরোনাম ও বার্তা দুটোই দিন!", true);
  if(!confirm("এটি সব লগইন করা ইউজারের ড্যাশবোর্ডের ঘণ্টায় দেখাবে। চালিয়ে যাবেন?")) return;

  const btn = document.getElementById('bn-send-btn');
  btn.disabled = true;
  const ok = await addAnnouncement(subject, message);
  btn.disabled = false;
  if(!ok) return toast("পোস্ট হয়নি — Firestore rules চেক করুন", true);

  document.getElementById('bn-subject').value = '';
  document.getElementById('bn-message').value = '';
  toast("ড্যাশবোর্ডে পোস্ট হয়েছে! 🔔");
  await loadAnnouncements();
  renderBellList();
}

async function deleteBellNotification(id) {
  if(!confirm("এই নোটিফিকেশনটি মুছে ফেলবেন? ইউজারদের ড্যাশবোর্ড থেকেও চলে যাবে।")) return;
  const ok = await deleteAnnouncement(id);
  toast(ok ? "মুছে ফেলা হয়েছে" : "মোছা যায়নি", !ok);
  await loadAnnouncements();
  renderBellList();
}

/*===== VOLUNTEER / INTERNSHIP APPLICATIONS =====*/
function renderVolunteerTable() {
  const tbody = document.getElementById('voltbl');
  if(!tbody) return;
  const typeF = document.getElementById('vol-type-filter')?.value || '';
  const statusF = document.getElementById('vol-status-filter')?.value || '';
  const order = { pending:0, approved:1, rejected:2 };
  const data = getVolunteerApplications()
    .filter(a => (!typeF || a.type === typeF) && (!statusF || (a.status||'pending') === statusF))
    .slice()
    .sort((a,b) => (order[a.status||'pending']-order[b.status||'pending']) || ((b.createdAt||0)-(a.createdAt||0)));

  if(!data.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No applications found.</td></tr>`; return; }
  tbody.innerHTML = '';
  data.forEach(a => {
    const status = a.status || 'pending';
    tbody.innerHTML += `<tr>
      <td>${escUser(a.name)}</td>
      <td style="text-transform:capitalize;">${escUser(a.type)}</td>
      <td>${escUser(a.role)}</td>
      <td><span class="st-badge st-${status}">${status}</span></td>
      <td>${fmtUserDate(a.createdAt)}</td>
      <td class="tbl-acts">
        <button class="e-btn" onclick="viewVolunteerApp('${a.id}')">View</button>
        ${status!=='approved'?`<button class="e-btn" onclick="approveVolunteerApp('${a.id}')">Approve</button>`:''}
        ${status!=='rejected'?`<button class="d-btn" onclick="rejectVolunteerApp('${a.id}')">Reject</button>`:''}
        <button class="d-btn" onclick="deleteVolunteerApp('${a.id}')">Delete</button>
      </td></tr>`;
  });
}
function viewVolunteerApp(id) {
  const a = getVolunteerApplications().find(x => x.id === id); if(!a) return;
  const status = a.status || 'pending';
  document.getElementById('vv-body').innerHTML = `
    <div class="vw-row"><b>Name</b><span>${escUser(a.name)}</span></div>
    <div class="vw-row"><b>Type</b><span style="text-transform:capitalize;">${escUser(a.type)}</span></div>
    <div class="vw-row"><b>Role</b><span>${escUser(a.role)}</span></div>
    <div class="vw-row"><b>Email</b><span>${escUser(a.email)}</span></div>
    <div class="vw-row"><b>Phone</b><span>${escUser(a.phone)}</span></div>
    <div class="vw-row"><b>Availability</b><span>${escUser(a.availability)}</span></div>
    ${/^https?:\/\//i.test(a.resumeLink||'') ? `<div class="vw-row"><b>Resume</b><span><a href="${escUser(a.resumeLink)}" target="_blank" style="color:var(--blue-br);">${escUser(a.resumeLink)}</a></span></div>` : ''}
    <div class="vw-row"><b>Status</b><span class="st-badge st-${status}">${status}</span></div>
    <div class="vw-row"><b>Submitted</b><span>${fmtUserDate(a.createdAt)}</span></div>
    <div class="vw-row" style="flex-direction:column;"><b style="margin-bottom:6px;">Skills</b><div class="vw-stmt">${escUser(a.skills) === '—' ? '(none given)' : escUser(a.skills)}</div></div>
    <div class="vw-row" style="flex-direction:column;"><b style="margin-bottom:6px;">Message</b><div class="vw-stmt">${escUser(a.message) === '—' ? '(none given)' : escUser(a.message)}</div></div>`
  + Object.entries(a.extra || {}).map(([k,v]) => {
      const label = (v && typeof v === 'object') ? v.l : ((volFieldsDraft.find(f => f.id === k) || {}).label || k);
      const val = (v && typeof v === 'object') ? v.v : v;
      return `<div class="vw-row" style="flex-direction:column;"><b style="margin-bottom:6px;">${escUser(label)}</b><div class="vw-stmt">${escUser(val)}</div></div>`;
    }).join('');
  document.getElementById('vv-foot').innerHTML = `
    ${status!=='approved'?`<button class="fs-btn" onclick="closeFM('vvm');approveVolunteerApp('${a.id}')">✅ Approve</button>`:''}
    ${status!=='rejected'?`<button class="fc-btn" style="color:#f87171;border-color:rgba(239,68,68,.35);" onclick="closeFM('vvm');rejectVolunteerApp('${a.id}')">Reject</button>`:''}
    <button class="fc-btn" onclick="closeFM('vvm')">Close</button>`;
  openFM('vvm');
}
async function approveVolunteerApp(id) {
  const ok = await updateVolunteerApplicationStatus(id, 'approved');
  if(ok) { renderVolunteerTable(); renderDashboard(); toast("Application approved! ✅"); }
  else toast("Failed to update.", true);
}
async function rejectVolunteerApp(id) {
  if(!confirm("Reject this application? This doesn't notify the applicant automatically.")) return;
  const ok = await updateVolunteerApplicationStatus(id, 'rejected');
  if(ok) { renderVolunteerTable(); renderDashboard(); toast("Application rejected."); }
  else toast("Failed to update.", true);
}
async function deleteVolunteerApp(id) {
  if(!confirm("Permanently delete this application?")) return;
  if(await deleteVolunteerApplication(id)) { renderVolunteerTable(); renderDashboard(); toast("Deleted."); }
}

/*===== FORUM MODERATION =====*/
function renderForumTable() {
  const tbody = document.getElementById('forumtbl');
  if(!tbody) return;
  const statusF = document.getElementById('forum-status-filter')?.value || '';
  const order = { pending:0, approved:1, rejected:2 };
  const data = getForumPosts()
    .filter(p => !statusF || (p.status||'approved') === statusF)
    .slice()
    .sort((a,b) => (order[a.status||'approved']-order[b.status||'approved']) || ((b.createdAt||0)-(a.createdAt||0)));
  if(!data.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No posts found.</td></tr>`; return; }
  tbody.innerHTML = '';
  data.forEach(p => {
    const status = p.status || 'approved';
    tbody.innerHTML += `<tr>
      <td>${escUser(p.title)}</td>
      <td>${escUser(p.category)}</td>
      <td>${escUser(p.authorName)}</td>
      <td><span class="st-badge st-${status}">${status}</span></td>
      <td>${p.replyCount || 0}</td>
      <td>${fmtUserDate(p.createdAt)}</td>
      <td class="tbl-acts">
        <button class="e-btn" onclick="viewForumPostAdmin('${p.id}')">View</button>
        ${status!=='approved'?`<button class="e-btn" onclick="approveForumPostAdmin('${p.id}')">Approve</button>`:''}
        ${status!=='rejected'?`<button class="d-btn" onclick="rejectForumPostAdmin('${p.id}')">Reject</button>`:''}
        <button class="d-btn" onclick="deleteForumPostAdmin('${p.id}')">Delete</button>
      </td></tr>`;
  });
}
function viewForumPostAdmin(id) {
  const p = getForumPosts().find(x => x.id === id); if(!p) return;
  const status = p.status || 'approved';
  document.getElementById('fv-body').innerHTML = `
    <div class="vw-row"><b>Title</b><span>${escUser(p.title)}</span></div>
    <div class="vw-row"><b>Category</b><span>${escUser(p.category)}</span></div>
    <div class="vw-row"><b>Author</b><span>${escUser(p.authorName)}</span></div>
    <div class="vw-row"><b>Status</b><span class="st-badge st-${status}">${status}</span></div>
    <div class="vw-row"><b>Replies</b><span>${p.replyCount || 0}</span></div>
    <div class="vw-row"><b>Posted</b><span>${fmtUserDate(p.createdAt)}</span></div>
    <div class="vw-row" style="flex-direction:column;"><b style="margin-bottom:6px;">Body</b><div class="vw-stmt">${escUser(p.body)}</div></div>`;
  document.getElementById('fv-foot').innerHTML = `
    ${status!=='approved'?`<button class="fs-btn" onclick="closeFM('fvm');approveForumPostAdmin('${p.id}')">✅ Approve</button>`:''}
    ${status!=='rejected'?`<button class="fc-btn" style="color:#f87171;border-color:rgba(239,68,68,.35);" onclick="closeFM('fvm');rejectForumPostAdmin('${p.id}')">Reject</button>`:''}
    <a class="fc-btn" style="text-decoration:none;display:inline-block;" href="forum-post.html?id=${p.id}" target="_blank">Open on site ↗</a>
    <button class="fc-btn" style="color:#f87171;border-color:rgba(239,68,68,.35);" onclick="closeFM('fvm');deleteForumPostAdmin('${p.id}')">Delete</button>
    <button class="fc-btn" onclick="closeFM('fvm')">Close</button>`;
  openFM('fvm');
}
async function approveForumPostAdmin(id) {
  const ok = await updateForumPostStatus(id, 'approved');
  if(ok) { renderForumTable(); renderDashboard(); toast("Post approved! ✅"); }
  else toast("Failed to update.", true);
}
async function rejectForumPostAdmin(id) {
  if(!confirm("Reject this post? It won't show on the public forum.")) return;
  const ok = await updateForumPostStatus(id, 'rejected');
  if(ok) { renderForumTable(); renderDashboard(); toast("Post rejected."); }
  else toast("Failed to update.", true);
}
async function deleteForumPostAdmin(id) {
  if(!confirm("Permanently delete this post and all its comments?")) return;
  if(await deleteForumPost(id)) { renderForumTable(); renderDashboard(); toast("Post deleted."); }
  else toast("Failed to delete — check Firestore rules.", true);
}

function renderBellList() {
  const tbody = document.getElementById('bn-list');
  const list = getAnnouncements();
  if(!list.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="3">এখনো কোনো নোটিফিকেশন পোস্ট করা হয়নি।</td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(a => `
    <tr>
      <td><strong>${escUser(a.title)}</strong><br><span style="color:var(--muted);font-size:.78rem;white-space:pre-wrap;">${escUser(a.message)}</span></td>
      <td style="color:var(--muted);font-size:.78rem;white-space:nowrap;">${a.createdAt ? new Date(a.createdAt).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'}</td>
      <td><button class="fc-btn" onclick="deleteBellNotification('${a.id}')">🗑️ Delete</button></td>
    </tr>`).join('');
     }


/*===== SIDEBAR MENU SEARCH =====
   Hides menu items that don't match (uses its own class so the permission-based hiding stays untouched). */
function filterAdminNav(q) {
  const nav = document.querySelector('.adm-nav');
  if(!nav) return;
  q = String(q || '').trim().toLowerCase();
  let heading = null, any = false;
  const flush = () => { if(heading) heading.classList.toggle('sb-hide', !!q && !any); };
  Array.from(nav.children).forEach(el => {
    if(el.classList.contains('adm-ns')) { flush(); heading = el; any = false; }
    else if(el.classList.contains('adm-nb')) {
      const hit = !q || el.textContent.toLowerCase().includes(q);
      el.classList.toggle('sb-hide', !hit);
      if(hit && el.style.display !== 'none') any = true;
    }
  });
  flush();
}


/*===== VOLUNTEER FORM FIELD BUILDER =====
   Admin adds extra questions; saved in settings/volunteer, shown on volunteer.html. */
let volFieldsDraft = [];
function vfEsc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
const VOL_FIELD_TYPES = { text:'Short answer', textarea:'Paragraph', number:'Number', date:'Date', url:'Link / URL', select:'Dropdown (choose one)' };
const VOL_FIELD_FOR = { all:'Volunteer + Internship', volunteer:'Volunteer only', internship:'Internship only' };
async function loadVolFieldsDraft() {
  try { const s = await getVolunteerSettings(); volFieldsDraft = (s.fields || []).map(f => ({ ...f })); } catch(e) { volFieldsDraft = []; }
  renderVolFieldsUI();
}
function renderVolFieldsUI() {
  const wrap = document.getElementById('vf-fields');
  if(!wrap) return;
  if(!volFieldsDraft.length) { wrap.innerHTML = '<p style="font-size:.8rem;color:var(--muted);margin-bottom:10px;">No extra fields yet.</p>'; return; }
  wrap.innerHTML = volFieldsDraft.map((f, i) => `
    <div class="qf-qrow">
      <div class="qf-qrow-head">
        <input type="text" class="fi" placeholder="Question, e.g. Which university are you from?" value="${vfEsc(f.label)}" oninput="updateVolField(${i},'label',this.value)">
        <select class="fi" onchange="updateVolField(${i},'type',this.value);renderVolFieldsUI()">
          ${Object.entries(VOL_FIELD_TYPES).map(([v, l]) => `<option value="${v}" ${f.type === v ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
        <button type="button" class="qf-qdel" onclick="removeVolFieldRow(${i})">Delete</button>
      </div>
      ${f.type === 'select' ? `<input type="text" class="fi" style="margin:8px 0;" placeholder="Choices, separated by commas (e.g. Dhaka, Chattogram, Other)" value="${vfEsc((f.options || []).join(', '))}" oninput="updateVolField(${i},'options',this.value)">` : ''}
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <div class="chk-wrap" style="padding:8px 10px;">
          <input type="checkbox" id="vf-req-${i}" ${f.required ? 'checked' : ''} onchange="updateVolField(${i},'required',this.checked)">
          <label for="vf-req-${i}">Required</label>
        </div>
        <select class="fi" style="width:auto;" onchange="updateVolField(${i},'for',this.value)">
          ${Object.entries(VOL_FIELD_FOR).map(([v, l]) => `<option value="${v}" ${(f.for || 'all') === v ? 'selected' : ''}>${l}</option>`).join('')}
        </select>
      </div>
    </div>`).join('');
}
function addVolFieldRow() {
  volFieldsDraft.push({ id: 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), label: '', type: 'text', required: false, for: 'all', options: [] });
  renderVolFieldsUI();
}
function updateVolField(i, key, val) {
  if(!volFieldsDraft[i]) return;
  volFieldsDraft[i][key] = key === 'options' ? String(val).split(',').map(x => x.trim()).filter(Boolean) : val;
}
function removeVolFieldRow(i) { volFieldsDraft.splice(i, 1); renderVolFieldsUI(); }
async function saveVolFields() {
  const fields = volFieldsDraft.filter(f => (f.label || '').trim()).map(f => ({
    id: f.id, label: f.label.trim().slice(0, 150), type: f.type || 'text', required: !!f.required, for: f.for || 'all',
    options: f.type === 'select' ? (f.options || []).slice(0, 30) : []
  }));
  if(fields.length > 20) return toast("Maximum 20 extra fields.", true);
  if(fields.some(f => f.type === 'select' && f.options.length < 2)) return toast("A dropdown needs at least 2 choices (comma separated).", true);
  const ok = await updateVolunteerSettings({ fields });
  if(ok) { volFieldsDraft = fields; toast("Form fields saved! ✅"); renderVolFieldsUI(); }
  else toast("Failed to save — publish the latest Firestore rules first.", true);
}

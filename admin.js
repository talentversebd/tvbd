console.log("🚀 Admin.js loaded");

/*===== ADMIN CREDENTIALS (Code based) =====*/
const ADMIN_EMAIL = "talentversebangladesh@gmail.com";
const ADMIN_PASS = "T@lentVer$eB@nglade$h";

/*===== ADMIN NAVIGATION =====*/
function openAdmin() {
  window.location.href = 'admin.html';
}

function closeAdmin() {
  window.location.href = 'index.html';
}

/*===== SIMPLE LOGIN (No Firebase Auth needed) =====*/
function doLogin() {
  const u = document.getElementById('lu').value.trim();
  const p = document.getElementById('lp').value;
  const err = document.getElementById('lerr');

  if(!u || !p) {
    err.textContent = "Please enter both email and password!";
    err.classList.add('show');
    setTimeout(() => err.classList.remove('show'), 3000);
    return;
  }

  if(u === ADMIN_EMAIL && p === ADMIN_PASS) {
    // Login SUCCESS
    sessionStorage.setItem('tvbd_admin', 'true');
    sessionStorage.setItem('tvbd_admin_email', u);
    
    document.getElementById('adm-login').style.display = 'none';
    document.getElementById('adm-shell').style.display = 'flex';
    
    renderAdminAll();
    
    // Load messages & registrations & certificates
    if(typeof loadMessages === 'function') {
      loadMessages().then(() => {
        if(typeof renderMessagesTable === 'function') renderMessagesTable();
      });
    }
    if(typeof loadRegistrations === 'function') {
      loadRegistrations().then(() => {
        if(typeof renderRegistrationsTable === 'function') renderRegistrationsTable();
      });
    }
    if(typeof loadCertificates === 'function') {
      loadCertificates().then(() => {
        if(typeof renderCertificatesTable === 'function') renderCertificatesTable();
      });
    }
    if(typeof loadTeam === 'function') {
  loadTeam().then(() => {
    if(typeof renderTeamTable === 'function') renderTeamTable();
     });
    }
    if(typeof loadNetworkPages === 'function') {
      loadNetworkPages().then(() => {
        if(typeof renderNetworkTable === 'function') renderNetworkTable();
      });
    }
    if(typeof loadQuizzes === 'function') {
      loadQuizzes().then(() => {
        if(typeof renderQuizTable === 'function') renderQuizTable();
      });
    }
    
    toast("Welcome back, Admin! 👋");
  } else {
    // Login FAILED
    err.textContent = "❌ Incorrect email or password!";
    err.classList.add('show');
    setTimeout(() => err.classList.remove('show'), 4000);
  }
}

/*===== LOGOUT =====*/
function doLogout() {
  sessionStorage.removeItem('tvbd_admin');
  sessionStorage.removeItem('tvbd_admin_email');
  window.location.href = 'index.html';
}

/*===== CHECK AUTH ON PAGE LOAD =====*/
function checkAdminAuth() {
  const isLogged = sessionStorage.getItem('tvbd_admin');
  const login = document.getElementById('adm-login');
  const shell = document.getElementById('adm-shell');
  
  if(isLogged === 'true') {
    // Already logged in
    if(login) login.style.display = 'none';
    if(shell) shell.style.display = 'flex';
    
    renderAdminAll();
    
    if(typeof loadMessages === 'function') {
      loadMessages().then(() => {
        if(typeof renderMessagesTable === 'function') renderMessagesTable();
      });
    }
    if(typeof loadRegistrations === 'function') {
      loadRegistrations().then(() => {
        if(typeof renderRegistrationsTable === 'function') renderRegistrationsTable();
      });
    }
    if(typeof loadCertificates === 'function') {
      loadCertificates().then(() => {
        if(typeof renderCertificatesTable === 'function') renderCertificatesTable();
      });
    }
    if(typeof loadTeam === 'function') {
  loadTeam().then(() => {
    if(typeof renderTeamTable === 'function') renderTeamTable();
      });
    }
    if(typeof loadNetworkPages === 'function') {
      loadNetworkPages().then(() => {
        if(typeof renderNetworkTable === 'function') renderNetworkTable();
      });
    }
    if(typeof loadQuizzes === 'function') {
      loadQuizzes().then(() => {
        if(typeof renderQuizTable === 'function') renderQuizTable();
      });
    }
  } else {
    // Not logged in - show login
    if(login) login.style.display = 'flex';
    if(shell) shell.style.display = 'none';
  }
}

// Auto check on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
});

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
    'quiz-adm': 'Manage Quizzes',
    'qsub-adm': 'Quiz Submissions',
    'team-adm': 'Team Members',
    'network-adm': 'Our Network',
    'msg-adm': 'Contact Messages',
    'reg-adm': 'Registrations',
    'cert-adm': 'Certificates',
    'popup-adm': 'Popup Notice',
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
  if(secId === 'popup-adm' && typeof loadPopupSettings === 'function') loadPopupSettings();
  if(secId === 'quiz-adm' && typeof loadQuizzes === 'function') loadQuizzes().then(() => renderQuizTable());
  if(secId === 'qsub-adm' && typeof loadQuizSubmissions === 'function') {
    Promise.all([loadQuizzes(), loadQuizSubmissions()]).then(() => renderQuizSubmissionsTable());
  }
  if(window.innerWidth <= 700) closeSidebar();
}

/*===== RENDER ADMIN ALL =====*/
function renderAdminAll() {
  if(typeof renderDashboard === 'function') renderDashboard();
  if(typeof renderOlympiadTable === 'function') renderOlympiadTable();
  if(typeof renderGalleryTable === 'function') renderGalleryTable();
  if(typeof renderNewsTable === 'function') renderNewsTable();
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

  const stats = document.getElementById('db-stats');
  if(stats) {
    stats.innerHTML = `
      <div class="stat-card"><div class="sl">Total Olympiads</div><div class="sv">${olympiads.length}</div></div>
      <div class="stat-card"><div class="sl">Active Now</div><div class="sv">${active}</div></div>
      <div class="stat-card"><div class="sl">Upcoming</div><div class="sv">${upcoming}</div></div>
      <div class="stat-card"><div class="sl">Gallery Items</div><div class="sv">${gallery.length}</div></div>
      <div class="stat-card"><div class="sl">News Posts</div><div class="sv">${news.length}</div></div>
      <div class="stat-card"><div class="sl">Messages</div><div class="sv">${messages.length}</div></div>
      <div class="stat-card"><div class="sl">Registrations</div><div class="sv">${registrations.length}</div></div>
      <div class="stat-card"><div class="sl">Certificates</div><div class="sv" style="color:#4ade80;">${certificates.length}</div></div>`;
  }

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

function renderRegistrationsTable() {
  const tbody = document.getElementById('rtbl');
  if(!tbody) return;
  const data = getRegistrations();
  if(!data.length) { tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No registrations yet.</td></tr>`; return; }
  tbody.innerHTML = '';
  data.forEach(r => {
    const date = r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A';
    tbody.innerHTML += `<tr><td>${r.name}</td><td>${r.email}</td><td>${r.phone}</td><td>${r.olympiad}</td><td>${date}</td>
      <td class="tbl-acts"><button class="e-btn" onclick="viewRegistration('${r.id}')">View</button><button class="d-btn" onclick="deleteRegistrationAction('${r.id}')">Delete</button></td></tr>`;
  });
}
function viewRegistration(id) {
  const r = getRegistrations().find(x => x.id === id);
  if(r) alert(`Name: ${r.name}\nEmail: ${r.email}\nPhone: ${r.phone}\nOlympiad: ${r.olympiad}`);
}
async function deleteRegistrationAction(id) {
  if(!confirm("Delete?")) return;
  if(await deleteRegistration(id)) { renderRegistrationsTable(); renderDashboard(); toast("Deleted."); }
}

function downloadRegistrationsCSV() {
  const regs = getRegistrations();
  if(!regs.length) return toast("No data!", true);
  let csv = "Name,Email,Phone,Olympiad,Date\n";
  regs.forEach(r => {
    csv += [r.name,r.email,r.phone,r.olympiad,r.createdAt?new Date(r.createdAt).toLocaleString():''].map(x=>`"${(x||'').replace(/"/g,'""')}"`).join(',')+"\n";
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

/*===== OLYMPIAD FORM =====*/
function openOlympiadForm() {
  document.getElementById('ofm-title').textContent = "Add Olympiad";
  document.getElementById('of-eid').value = "";
  ['of-t','of-dt','of-rd','of-v','of-pr','of-el','of-fe','of-rl','of-ds','of-fd','of-iu'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('of-cat').value = 'Mathematics';
  document.getElementById('of-st').value = 'upcoming';
  const chk = document.getElementById('of-reg-enabled'); if(chk) chk.checked = false;
  document.getElementById('of-iprev').innerHTML = '';
  populateQuizDropdown('');
  openFM('ofm');
}
function editOlympiad(id) {
  const o = getOlympiads().find(x => x.id === id); if(!o) return;
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
  document.getElementById('of-rl').value = o.regLink||'';
  document.getElementById('of-ds').value = o.desc||'';
  document.getElementById('of-fd').value = o.fullDesc||'';
  document.getElementById('of-iu').value = o.img||'';
  const chk = document.getElementById('of-reg-enabled'); if(chk) chk.checked = o.regEnabled||false;
  document.getElementById('of-iprev').innerHTML = o.img ? `<img src="${o.img}">` : '';
  populateQuizDropdown(o.quizId || '');
  openFM('ofm');
}
async function saveOlympiad() {
  const title = document.getElementById('of-t').value.trim();
  const desc = document.getElementById('of-ds').value.trim();
  if(!title || !desc) return toast("Title & description required!", true);
  const o = { title, desc, cat:document.getElementById('of-cat').value, status:document.getElementById('of-st').value, date:document.getElementById('of-dt').value, deadline:document.getElementById('of-rd').value, venue:document.getElementById('of-v').value, prize:document.getElementById('of-pr').value, eligibility:document.getElementById('of-el').value, fee:document.getElementById('of-fe').value, regLink:document.getElementById('of-rl').value, fullDesc:document.getElementById('of-fd').value, img:document.getElementById('of-iu').value, regEnabled:document.getElementById('of-reg-enabled')?.checked||false, quizId:document.getElementById('of-quiz')?.value || '' };
  const eid = document.getElementById('of-eid').value;
  const ok = eid === '' ? await addOlympiad(o) : await updateOlympiad(eid, o);
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
  document.getElementById('cf-event').value = '';
  document.getElementById('cf-position').value = '';
  document.getElementById('cf-date').value = new Date().toISOString().split('T')[0];
  openFM('cfm');
}
function editCertificate(id) {
  const c = getCertificates().find(x => x.id === id); if(!c) return;
  document.getElementById('cfm-title').textContent = "Edit Certificate";
  document.getElementById('cf-eid').value = id;
  document.getElementById('cf-certid').value = c.certId||'';
  document.getElementById('cf-certid').disabled = true;
  document.getElementById('cf-name').value = c.name||'';
  document.getElementById('cf-event').value = c.event||'';
  document.getElementById('cf-position').value = c.position||'';
  document.getElementById('cf-date').value = c.issueDate||'';
  openFM('cfm');
}
async function saveCertificate() {
  const certId = document.getElementById('cf-certid').value.trim();
  const name = document.getElementById('cf-name').value.trim();
  const event = document.getElementById('cf-event').value.trim();
  const position = document.getElementById('cf-position').value.trim();
  const issueDate = document.getElementById('cf-date').value;
  if(!certId||!name||!event||!position||!issueDate) return toast("All fields required!", true);
  const cert = { certId, name, event, position, issueDate };
  const eid = document.getElementById('cf-eid').value;
  const result = eid === '' ? await addCertificate(cert) : await updateCertificate(eid, cert);
  if(result.success) { renderCertificatesTable(); renderDashboard(); closeFM('cfm'); toast("Saved! ✅"); }
  else toast(result.error || "Failed!", true);
}
async function deleteCertificateAction(id) { if(!confirm("Delete?")) return; if(await deleteCertificate(id)) { renderCertificatesTable(); renderDashboard(); toast("Deleted."); } }

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
  const m = {'rs-title':s.title,'rs-desc':s.description,'rs-link':s.formLink,'rs-deadline':s.deadline};
  Object.entries(m).forEach(([id,val]) => { const el=document.getElementById(id); if(el) el.value=val||''; });
  const a = document.getElementById('rs-active'); if(a) a.checked = s.active||false;
}
async function saveRegistrationSettings() {
  const data = { title:document.getElementById('rs-title')?.value.trim()||'', description:document.getElementById('rs-desc')?.value.trim()||'', formLink:document.getElementById('rs-link')?.value.trim()||'', deadline:document.getElementById('rs-deadline')?.value||'', active:document.getElementById('rs-active')?.checked||false };
  if(data.active && !data.formLink) return toast("Link required!", true);
  if(await updateRegistrationSettings(data)) toast("Saved! ✅");
  else toast("Failed!", true);
}

/*===== POPUP SETTINGS =====*/
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
/*===== TEAM MANAGEMENT =====*/

// Render Team Table
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
        <td><span class="bs bs-active">${m.role}</span></td>
        <td style="color:var(--muted);font-size:.8rem;">${m.department || '—'}</td>
        <td style="color:var(--muted);font-size:.8rem;">${(m.description || '—').substring(0, 40)}${m.description && m.description.length > 40 ? '...' : ''}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="editTeamMember('${m.id}')">Edit</button>
          <button class="d-btn" onclick="deleteTeamMemberAction('${m.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

// Open Add Team Form
function openTeamForm() {
  document.getElementById('tfm-title').textContent = "Add Team Member";
  document.getElementById('tf-eid').value = '';
  document.getElementById('tf-name').value = '';
  document.getElementById('tf-role').value = '';
  document.getElementById('tf-dept').value = '';
  document.getElementById('tf-desc').value = '';
  document.getElementById('tf-order').value = '';
  document.getElementById('tf-photo').value = '';
  document.getElementById('tf-prev').innerHTML = '';
  openFM('tfm');
}

// Edit Team Member
function editTeamMember(id) {
  const m = getTeam().find(x => x.id === id);
  if(!m) return;
  document.getElementById('tfm-title').textContent = "Edit Team Member";
  document.getElementById('tf-eid').value = id;
  document.getElementById('tf-name').value = m.name || '';
  document.getElementById('tf-role').value = m.role || '';
  document.getElementById('tf-dept').value = m.department || '';
  document.getElementById('tf-desc').value = m.description || '';
  document.getElementById('tf-order').value = m.order || '';
  document.getElementById('tf-photo').value = m.photo || '';
  document.getElementById('tf-prev').innerHTML = m.photo ? `<img src="${m.photo}">` : '';
  openFM('tfm');
}

// Save Team Member
async function saveTeamMember() {
  const name = document.getElementById('tf-name').value.trim();
  const role = document.getElementById('tf-role').value.trim();
  const department = document.getElementById('tf-dept').value.trim() || 'Other';
  const description = document.getElementById('tf-desc').value.trim();
  const order = parseInt(document.getElementById('tf-order').value) || 999;
  const photo = document.getElementById('tf-photo').value.trim();
  
  if(!name) return toast("Name is required!", true);
  if(!role) return toast("Role is required!", true);
  
  const member = { name, role, department, description, order, photo };
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

// Delete Team Member
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

// Team Photo Upload
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

// Open Add Network Page Form
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

// Edit Network Page
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

// Save Network Page
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

// Delete Network Page
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

// Network Page Logo Upload
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

// datetime-local inputs need "YYYY-MM-DDTHH:mm" in local time — Date's
// own ISO string is UTC, so build it from local field values instead.
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
  document.getElementById('qf-start').value = '';
  document.getElementById('qf-end').value = '';
  document.getElementById('qf-questions').innerHTML = '';
  qfQuestionCount = 0;
  addQuizQuestionRow(); // start with one blank question
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

function editQuiz(id) {
  const q = getQuizzes().find(x => x.id === id);
  if(!q) return;
  document.getElementById('qfm-title').textContent = "Edit Quiz";
  document.getElementById('qf-eid').value = id;
  document.getElementById('qf-title').value = q.title || '';
  document.getElementById('qf-desc').value = q.description || '';
  document.getElementById('qf-duration').value = q.duration || '';
  document.getElementById('qf-status').value = q.status || 'draft';
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

  const quiz = { title, description, duration, status, startAt, endAt, questions };

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
      <td>${s.mcqScore ?? 0} / ${s.mcqTotal ?? 0}</td>
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

function openGradeModal(id) {
  const sub = getQuizSubmissions().find(x => x.id === id);
  if(!sub) return;
  const quiz = getQuizzes().find(q => q.id === sub.quizId);
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
      <span style="color:var(--lblue);font-size:.85rem;">MCQ auto-score: ${sub.mcqScore ?? 0} / ${sub.mcqTotal ?? 0}</span><br>
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

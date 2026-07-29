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
    } else if(secId === 'reg-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="downloadRegistrationsCSV()">⬇️ Download CSV</button>`;
    } else if(secId === 'cert-adm') {
      actions.innerHTML = `<button class="add-btn" onclick="openCertificateForm()">+ Add Certificate</button>`;
    }
  }

  if(secId === 'set-adm' && typeof loadRegistrationSettings === 'function') loadRegistrationSettings();
  if(secId === 'popup-adm' && typeof loadPopupSettings === 'function') loadPopupSettings();
  if(window.innerWidth <= 700) closeSidebar();
}

/*===== RENDER ADMIN ALL =====*/
function renderAdminAll() {
  if(typeof renderDashboard === 'function') renderDashboard();
  if(typeof renderOlympiadTable === 'function') renderOlympiadTable();
  if(typeof renderGalleryTable === 'function') renderGalleryTable();
  if(typeof renderNewsTable === 'function') renderNewsTable();
  if(typeof renderCertificatesTable === 'function') renderCertificatesTable();
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

/*===== OLYMPIAD FORM =====*/
function openOlympiadForm() {
  document.getElementById('ofm-title').textContent = "Add Olympiad";
  document.getElementById('of-eid').value = "";
  ['of-t','of-dt','of-rd','of-v','of-pr','of-el','of-fe','of-rl','of-ds','of-fd','of-iu'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('of-cat').value = 'Mathematics';
  document.getElementById('of-st').value = 'upcoming';
  const chk = document.getElementById('of-reg-enabled'); if(chk) chk.checked = false;
  document.getElementById('of-iprev').innerHTML = '';
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
  openFM('ofm');
}
async function saveOlympiad() {
  const title = document.getElementById('of-t').value.trim();
  const desc = document.getElementById('of-ds').value.trim();
  if(!title || !desc) return toast("Title & description required!", true);
  const o = { title, desc, cat:document.getElementById('of-cat').value, status:document.getElementById('of-st').value, date:document.getElementById('of-dt').value, deadline:document.getElementById('of-rd').value, venue:document.getElementById('of-v').value, prize:document.getElementById('of-pr').value, eligibility:document.getElementById('of-el').value, fee:document.getElementById('of-fe').value, regLink:document.getElementById('of-rl').value, fullDesc:document.getElementById('of-fd').value, img:document.getElementById('of-iu').value, regEnabled:document.getElementById('of-reg-enabled')?.checked||false };
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
  const verifyUrl = `https://talentversebd.github.io/TVBD/verify.html?id=${encodeURIComponent(c.certId)}`;
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

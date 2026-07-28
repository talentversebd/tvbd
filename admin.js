console.log("🚀 Admin.js loaded successfully");

/*===== ADMIN NAVIGATION =====*/
function openAdmin() {
  window.location.href = 'admin.html';
}

function closeAdmin() {
  window.location.href = 'index.html';
}

/*===== FIREBASE AUTH LOGIN =====*/
async function doLogin() {
  console.log("🔵 Login button clicked");
  
  const u = document.getElementById('lu').value.trim();
  const p = document.getElementById('lp').value;
  const err = document.getElementById('lerr');

  console.log("Email entered:", u);
  console.log("Password length:", p.length);

  if(!u || !p) {
    alert("⚠️ Please enter both email and password!");
    return;
  }

  // Check if Firebase is loaded
  if(!window.firebaseAuth || !window.firebaseFunctions) {
    alert("⚠️ Firebase is still loading. Please wait 5 seconds and try again.");
    console.error("Firebase not ready. Auth:", window.firebaseAuth, "Functions:", window.firebaseFunctions);
    return;
  }

  try {
    console.log("🔐 Attempting Firebase login...");
    const { signInWithEmailAndPassword } = window.firebaseFunctions;
    const userCredential = await signInWithEmailAndPassword(window.firebaseAuth, u, p);
    console.log("✅ LOGIN SUCCESS! User:", userCredential.user.email);
    
    // Force show admin panel
    const login = document.getElementById('adm-login');
    const shell = document.getElementById('adm-shell');
    
    if(login) {
      login.classList.add('hidden');
      login.style.display = 'none';
    }
    if(shell) {
      shell.classList.add('show-admin');
      shell.style.display = 'flex';
    }
    
    // Load admin data
    if(typeof renderAdminAll === 'function') {
      renderAdminAll();
    }
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
    
  } catch(error) {
    console.error("❌ LOGIN ERROR:", error.code, error.message);
    
    let errorMsg = "Login failed!";
    
    if(error.code === 'auth/user-not-found') {
      errorMsg = "❌ No account found with this email.";
    } else if(error.code === 'auth/wrong-password') {
      errorMsg = "❌ Incorrect password.";
    } else if(error.code === 'auth/invalid-email') {
      errorMsg = "❌ Invalid email format.";
    } else if(error.code === 'auth/invalid-credential') {
      errorMsg = "❌ Invalid email or password.";
    } else if(error.code === 'auth/too-many-requests') {
      errorMsg = "⚠️ Too many failed attempts. Try again later.";
    } else if(error.code === 'auth/network-request-failed') {
      errorMsg = "⚠️ Network error. Check your internet.";
    } else if(error.code === 'auth/user-disabled') {
      errorMsg = "❌ This account has been disabled.";
    } else {
      errorMsg = "❌ Error: " + error.message;
    }
    
    alert(errorMsg);
    
    if(err) {
      err.classList.add('show');
      err.textContent = errorMsg;
      setTimeout(() => err.classList.remove('show'), 5000);
    }
  }
}

/*===== LOGOUT =====*/
async function doLogout() {
  try {
    const { signOut } = window.firebaseFunctions;
    await signOut(window.firebaseAuth);
    window.location.href = 'index.html';
  } catch(err) {
    console.error("Logout error:", err);
    window.location.href = 'index.html';
  }
}

/*===== AUTH STATE CHECK =====*/
function checkAdminAuth() {
  console.log("🔍 Checking auth state...");
  
  const check = setInterval(() => {
    if(window.firebaseAuth && window.firebaseFunctions) {
      clearInterval(check);
      console.log("✅ Firebase ready, setting up auth listener");
      
      const { onAuthStateChanged } = window.firebaseFunctions;
      
      onAuthStateChanged(window.firebaseAuth, (user) => {
        const login = document.getElementById('adm-login');
        const shell = document.getElementById('adm-shell');
        
        if(user) {
          console.log("✅ User is logged in:", user.email);
          if(login) {
            login.classList.add('hidden');
            login.style.display = 'none';
          }
          if(shell) {
            shell.classList.add('show-admin');
            shell.style.display = 'flex';
          }
          
          if(typeof renderAdminAll === 'function') renderAdminAll();
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
          console.log("❌ No user logged in");
          if(login) {
            login.classList.remove('hidden');
            login.style.display = 'flex';
          }
          if(shell) {
            shell.classList.remove('show-admin');
            shell.style.display = 'none';
          }
        }
      });
    }
  }, 100);
}

// Auto start auth check when page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log("📄 DOM loaded, starting auth check");
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

  if(secId === 'set-adm' && typeof loadRegistrationSettings === 'function') {
    loadRegistrationSettings();
  }
  
  if(secId === 'popup-adm' && typeof loadPopupSettings === 'function') {
    loadPopupSettings();
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
  if(typeof loadHomeEditor === 'function') loadHomeEditor();
}

/*===== DASHBOARD =====*/
function renderDashboard() {
  const olympiads = typeof getOlympiads === 'function' ? getOlympiads() : [];
  const gallery = typeof getGallery === 'function' ? getGallery() : [];
  const news = typeof getNews === 'function' ? getNews() : [];
  const messages = typeof getMessages === 'function' ? getMessages() : [];
  const registrations = typeof getRegistrations === 'function' ? getRegistrations() : [];

  const active = olympiads.filter(o => o.status === 'active').length;
  const upcoming = olympiads.filter(o => o.status === 'upcoming').length;
  const unreadMsg = messages.filter(m => !m.read).length;

  const stats = document.getElementById('db-stats');
  if(stats) {
    stats.innerHTML = `
      <div class="stat-card"><div class="sl">Total Olympiads</div><div class="sv">${olympiads.length}</div></div>
      <div class="stat-card"><div class="sl">Active Now</div><div class="sv">${active}</div></div>
      <div class="stat-card"><div class="sl">Upcoming</div><div class="sv">${upcoming}</div></div>
      <div class="stat-card"><div class="sl">Gallery Items</div><div class="sv">${gallery.length}</div></div>
      <div class="stat-card"><div class="sl">News Posts</div><div class="sv">${news.length}</div></div>
      <div class="stat-card"><div class="sl">Messages</div><div class="sv">${messages.length}</div></div>
      <div class="stat-card"><div class="sl">Unread Msgs</div><div class="sv" style="color:#f87171;">${unreadMsg}</div></div>
      <div class="stat-card"><div class="sl">Registrations</div><div class="sv">${registrations.length}</div></div>`;
  }

  const recent = document.getElementById('db-recent');
  if(recent) {
    if(olympiads.length === 0) {
      recent.innerHTML = `<tr class="empty-row"><td colspan="3">No olympiads added yet</td></tr>`;
    } else {
      recent.innerHTML = '';
      olympiads.slice(0, 5).forEach(o => {
        recent.innerHTML += `
          <tr>
            <td>${o.title}</td>
            <td><span class="bs bs-${o.status}">${o.status}</span></td>
            <td>${o.date || 'TBA'}</td>
          </tr>`;
      });
    }
  }
}

/*===== OLYMPIAD TABLE =====*/
function renderOlympiadTable() {
  const tbody = document.getElementById('otbl');
  if(!tbody) return;
  const olympiads = getOlympiads();
  if(olympiads.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No olympiads yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = '';
  olympiads.forEach((o) => {
    tbody.innerHTML += `
      <tr>
        <td>${o.img ? `<img src="${o.img}" class="thumb">` : `<div class="thumb" style="background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:1.2rem">🏆</div>`}</td>
        <td>${o.title}</td>
        <td>${o.cat}</td>
        <td>${o.date || 'TBA'}</td>
        <td><span class="bs bs-${o.status}">${o.status}</span></td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="editOlympiad('${o.id}')">Edit</button>
          <button class="d-btn" onclick="deleteOlympiad('${o.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

/*===== GALLERY TABLE =====*/
function renderGalleryTable() {
  const tbody = document.getElementById('gtbl');
  if(!tbody) return;
  const gallery = getGallery();
  if(gallery.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="4">No media yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = '';
  gallery.forEach((g) => {
    tbody.innerHTML += `
      <tr>
        <td>${g.type === 'video' ? `<div class="thumb" style="background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:1.5rem">🎥</div>` : `<img src="${g.url}" class="thumb">`}</td>
        <td>${g.cap || '—'}</td>
        <td>${g.type}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="editGallery('${g.id}')">Edit</button>
          <button class="d-btn" onclick="deleteGallery('${g.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

/*===== NEWS TABLE =====*/
function renderNewsTable() {
  const tbody = document.getElementById('ntbl');
  if(!tbody) return;
  const news = getNews();
  if(news.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="3">No news yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = '';
  news.forEach((n) => {
    tbody.innerHTML += `
      <tr>
        <td>${n.title}</td>
        <td>${n.date}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="editNews('${n.id}')">Edit</button>
          <button class="d-btn" onclick="deleteNews('${n.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

/*===== MESSAGES TABLE =====*/
function renderMessagesTable() {
  const tbody = document.getElementById('mtbl');
  if(!tbody) return;
  const messages = getMessages();
  if(messages.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="5">No messages yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = '';
  messages.forEach((m) => {
    const date = m.createdAt ? new Date(m.createdAt).toLocaleString() : 'N/A';
    tbody.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td><a href="mailto:${m.email}" style="color:var(--blue-br)">${m.email}</a></td>
        <td>${m.subject || '(No subject)'}</td>
        <td>${date}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="viewMessage('${m.id}')">View</button>
          <button class="d-btn" onclick="deleteMessageAction('${m.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

function viewMessage(id) {
  const msg = getMessages().find(m => m.id === id);
  if(!msg) return;
  alert(`From: ${msg.name}\nEmail: ${msg.email}\nSubject: ${msg.subject || 'N/A'}\n\nMessage:\n${msg.message}`);
}

async function deleteMessageAction(id) {
  if(!confirm("Delete this message?")) return;
  const ok = await deleteMessage(id);
  if(ok) { renderMessagesTable(); renderDashboard(); toast("Message deleted."); }
}

/*===== REGISTRATIONS TABLE =====*/
function renderRegistrationsTable() {
  const tbody = document.getElementById('rtbl');
  if(!tbody) return;
  const regs = getRegistrations();
  if(regs.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No registrations yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = '';
  regs.forEach((r) => {
    const date = r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A';
    tbody.innerHTML += `
      <tr>
        <td>${r.name}</td>
        <td><a href="mailto:${r.email}" style="color:var(--blue-br)">${r.email}</a></td>
        <td>${r.phone}</td>
        <td>${r.olympiad}</td>
        <td>${date}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="viewRegistration('${r.id}')">View</button>
          <button class="d-btn" onclick="deleteRegistrationAction('${r.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

function viewRegistration(id) {
  const r = getRegistrations().find(x => x.id === id);
  if(!r) return;
  alert(`Name: ${r.name}\nEmail: ${r.email}\nPhone: ${r.phone}\nOlympiad: ${r.olympiad}\nClass: ${r.class || 'N/A'}\nSchool: ${r.school || 'N/A'}`);
}

async function deleteRegistrationAction(id) {
  if(!confirm("Delete this registration?")) return;
  const ok = await deleteRegistration(id);
  if(ok) { renderRegistrationsTable(); renderDashboard(); toast("Registration deleted."); }
}

function downloadRegistrationsCSV() {
  const regs = getRegistrations();
  if(regs.length === 0) return toast("No registrations!", true);
  let csv = "Name,Email,Phone,Olympiad,Class,School,Date\n";
  regs.forEach(r => {
    csv += [r.name, r.email, r.phone, r.olympiad, r.class || '', r.school || '', r.createdAt ? new Date(r.createdAt).toLocaleString() : ''].map(x => `"${String(x || '').replace(/"/g, '""')}"`).join(',') + "\n";
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `registrations.csv`;
  a.click();
  toast("Downloaded! ✅");
}

/*===== HOME EDITOR =====*/
function loadHomeEditor() {
  const h = getHome();
  const fields = {
    'he-badge': h.badge, 'he-title': h.title, 'he-sub': h.sub,
    'he-b1': h.b1, 'he-b2': h.b2, 'he-odesc': h.odesc,
    'he-s1n': h.s1n, 'he-s1l': h.s1l, 'he-s2n': h.s2n,
    'he-s2l': h.s2l, 'he-s3n': h.s3n, 'he-s3l': h.s3l,
    'he-quote': h.quote, 'he-fdesc': h.fdesc,
    'he-femail': h.femail, 'he-fphone': h.fphone, 'he-faddr': h.faddr
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if(el) el.value = val || '';
  });
}

async function saveHomeEditor() {
  const data = {
    badge: document.getElementById('he-badge')?.value || '',
    title: document.getElementById('he-title')?.value || '',
    sub: document.getElementById('he-sub')?.value || '',
    b1: document.getElementById('he-b1')?.value || '',
    b2: document.getElementById('he-b2')?.value || '',
    odesc: document.getElementById('he-odesc')?.value || '',
    s1n: document.getElementById('he-s1n')?.value || '',
    s1l: document.getElementById('he-s1l')?.value || '',
    s2n: document.getElementById('he-s2n')?.value || '',
    s2l: document.getElementById('he-s2l')?.value || '',
    s3n: document.getElementById('he-s3n')?.value || '',
    s3l: document.getElementById('he-s3l')?.value || '',
    quote: document.getElementById('he-quote')?.value || '',
    fdesc: document.getElementById('he-fdesc')?.value || '',
    femail: document.getElementById('he-femail')?.value || '',
    fphone: document.getElementById('he-fphone')?.value || '',
    faddr: document.getElementById('he-faddr')?.value || ''
  };
  const ok = await updateHome(data);
  if(ok) toast("Home updated! ✅");
  else toast("Update failed!", true);
}

/*===== FORM MODAL =====*/
function openFM(id) { document.getElementById(id)?.classList.add('open'); }
function closeFM(id) { document.getElementById(id)?.classList.remove('open'); }

/*===== OLYMPIAD FORM =====*/
function openOlympiadForm() {
  document.getElementById('ofm-title').textContent = "Add Olympiad";
  document.getElementById('of-eid').value = "";
  ['of-t','of-dt','of-rd','of-v','of-pr','of-el','of-fe','of-rl','of-ds','of-fd','of-iu'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = '';
  });
  document.getElementById('of-cat').value = 'Mathematics';
  document.getElementById('of-st').value = 'upcoming';
  const chk = document.getElementById('of-reg-enabled');
  if(chk) chk.checked = false;
  document.getElementById('of-iprev').innerHTML = '';
  openFM('ofm');
}

function editOlympiad(id) {
  const o = getOlympiads().find(x => x.id === id);
  if(!o) return;
  document.getElementById('ofm-title').textContent = "Edit Olympiad";
  document.getElementById('of-eid').value = id;
  document.getElementById('of-t').value = o.title || '';
  document.getElementById('of-cat').value = o.cat || 'Mathematics';
  document.getElementById('of-st').value = o.status || 'upcoming';
  document.getElementById('of-dt').value = o.date || '';
  document.getElementById('of-rd').value = o.deadline || '';
  document.getElementById('of-v').value = o.venue || '';
  document.getElementById('of-pr').value = o.prize || '';
  document.getElementById('of-el').value = o.eligibility || '';
  document.getElementById('of-fe').value = o.fee || '';
  document.getElementById('of-rl').value = o.regLink || '';
  document.getElementById('of-ds').value = o.desc || '';
  document.getElementById('of-fd').value = o.fullDesc || '';
  document.getElementById('of-iu').value = o.img || '';
  const chk = document.getElementById('of-reg-enabled');
  if(chk) chk.checked = o.regEnabled || false;
  document.getElementById('of-iprev').innerHTML = o.img ? `<img src="${o.img}">` : '';
  openFM('ofm');
}

async function saveOlympiad() {
  const title = document.getElementById('of-t').value.trim();
  const desc = document.getElementById('of-ds').value.trim();
  if(!title || !desc) return toast("Title and description required!", true);

  const o = {
    title, desc,
    cat: document.getElementById('of-cat').value,
    status: document.getElementById('of-st').value,
    date: document.getElementById('of-dt').value,
    deadline: document.getElementById('of-rd').value,
    venue: document.getElementById('of-v').value,
    prize: document.getElementById('of-pr').value,
    eligibility: document.getElementById('of-el').value,
    fee: document.getElementById('of-fe').value,
    regLink: document.getElementById('of-rl').value,
    fullDesc: document.getElementById('of-fd').value,
    img: document.getElementById('of-iu').value,
    regEnabled: document.getElementById('of-reg-enabled')?.checked || false
  };

  const eid = document.getElementById('of-eid').value;
  const ok = eid === '' ? await addOlympiad(o) : await updateOlympiad(eid, o);
  if(ok) { renderOlympiadTable(); renderDashboard(); closeFM('ofm'); toast("Saved! ✅"); }
}

async function deleteOlympiad(id) {
  if(!confirm("Delete?")) return;
  const ok = await deleteOlympiadData(id);
  if(ok) { renderOlympiadTable(); renderDashboard(); toast("Deleted."); }
}

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
  const g = getGallery().find(x => x.id === id);
  if(!g) return;
  document.getElementById('gfm-title').textContent = "Edit Media";
  document.getElementById('gf-eid').value = id;
  document.getElementById('gf-cap').value = g.cap || '';
  document.getElementById('gf-type').value = g.type || 'image';
  document.getElementById('gf-url').value = g.url || '';
  document.getElementById('gf-prev').innerHTML = g.type === 'video' ? `<div style="font-size:2rem">🎥</div>` : `<img src="${g.url}">`;
  openFM('gfm');
}

async function saveGallery() {
  const url = document.getElementById('gf-url').value.trim();
  if(!url) return toast("URL required!", true);
  const g = { cap: document.getElementById('gf-cap').value.trim(), type: document.getElementById('gf-type').value, url };
  const eid = document.getElementById('gf-eid').value;
  const ok = eid === '' ? await addGallery(g) : await updateGallery(eid, g);
  if(ok) { renderGalleryTable(); renderDashboard(); closeFM('gfm'); toast("Saved! ✅"); }
}

async function deleteGallery(id) {
  if(!confirm("Delete?")) return;
  const ok = await deleteGalleryData(id);
  if(ok) { renderGalleryTable(); renderDashboard(); toast("Deleted."); }
}

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
  const n = getNews().find(x => x.id === id);
  if(!n) return;
  document.getElementById('nfm-title').textContent = "Edit News";
  document.getElementById('nf-eid').value = id;
  document.getElementById('nf-t').value = n.title || '';
  document.getElementById('nf-d').value = n.date || '';
  document.getElementById('nf-b').value = n.body || '';
  openFM('nfm');
}

async function saveNews() {
  const title = document.getElementById('nf-t').value.trim();
  const body = document.getElementById('nf-b').value.trim();
  if(!title || !body) return toast("Fields required!", true);
  const n = { title, body, date: document.getElementById('nf-d').value };
  const eid = document.getElementById('nf-eid').value;
  const ok = eid === '' ? await addNews(n) : await updateNews(eid, n);
  if(ok) { renderNewsTable(); renderDashboard(); closeFM('nfm'); toast("Saved! ✅"); }
}

async function deleteNews(id) {
  if(!confirm("Delete?")) return;
  const ok = await deleteNewsData(id);
  if(ok) { renderNewsTable(); renderDashboard(); toast("Deleted."); }
}

/*===== IMAGE UPLOAD =====*/
async function prevOImg(input) {
  if(!input.files?.[0]) return;
  const file = input.files[0];
  if(file.size > 32 * 1024 * 1024) return toast("File too large!", true);
  const prev = document.getElementById('of-iprev');
  prev.innerHTML = `<div style="padding:10px;color:var(--muted)">⏳ Uploading...</div>`;
  const result = await uploadToImgBB(file);
  if(result.success) {
    document.getElementById('of-iu').value = result.url;
    prev.innerHTML = `<img src="${result.url}">`;
    toast("Uploaded! ✅");
  } else {
    prev.innerHTML = `<div style="color:#f87171">❌ Failed</div>`;
    toast("Failed!", true);
  }
}

async function prevGFile(input) {
  if(!input.files?.[0]) return;
  const file = input.files[0];
  const isVideo = file.type.includes('video');
  if(isVideo) {
    if(file.size > 5 * 1024 * 1024) return toast("Video too large!", true);
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('gf-url').value = e.target.result;
      document.getElementById('gf-type').value = 'video';
      document.getElementById('gf-prev').innerHTML = `<div style="font-size:2rem">🎥</div>`;
    };
    reader.readAsDataURL(file);
    return;
  }
  if(file.size > 32 * 1024 * 1024) return toast("File too large!", true);
  const prev = document.getElementById('gf-prev');
  prev.innerHTML = `<div style="padding:10px;color:var(--muted)">⏳ Uploading...</div>`;
  const result = await uploadToImgBB(file);
  if(result.success) {
    document.getElementById('gf-url').value = result.url;
    document.getElementById('gf-type').value = 'image';
    prev.innerHTML = `<img src="${result.url}">`;
    toast("Uploaded! ✅");
  } else {
    prev.innerHTML = `<div style="color:#f87171">❌ Failed</div>`;
    toast("Failed!", true);
  }
}

/*===== REGISTRATION SETTINGS =====*/
async function loadRegistrationSettings() {
  const settings = await getRegistrationSettings();
  const map = {
    'rs-title': settings.title, 'rs-desc': settings.description,
    'rs-link': settings.formLink, 'rs-deadline': settings.deadline
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if(el) el.value = val || '';
  });
  const active = document.getElementById('rs-active');
  if(active) active.checked = settings.active || false;
}

async function saveRegistrationSettings() {
  const data = {
    title: document.getElementById('rs-title')?.value.trim() || '',
    description: document.getElementById('rs-desc')?.value.trim() || '',
    formLink: document.getElementById('rs-link')?.value.trim() || '',
    deadline: document.getElementById('rs-deadline')?.value || '',
    active: document.getElementById('rs-active')?.checked || false
  };
  if(data.active && !data.formLink) return toast("Google Form link required!", true);
  if(data.active && !data.title) return toast("Title required!", true);
  const ok = await updateRegistrationSettings(data);
  if(ok) toast("Saved! ✅");
  else toast("Failed!", true);
}

/*===== POPUP NOTICE SETTINGS =====*/
async function loadPopupSettings() {
  const settings = await getPopupSettings();
  const map = {
    'ps-title': settings.title, 'ps-message': settings.message,
    'ps-btn-text': settings.buttonText, 'ps-btn-link': settings.buttonLink,
    'ps-deadline': settings.deadline, 'ps-nb-text': settings.noticeBarText
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if(el) el.value = val || '';
  });
  const active = document.getElementById('ps-active');
  const nbActive = document.getElementById('ps-nb-active');
  if(active) active.checked = settings.active || false;
  if(nbActive) nbActive.checked = settings.showNoticeBar || false;
}

async function savePopupSettings() {
  const data = {
    active: document.getElementById('ps-active')?.checked || false,
    title: document.getElementById('ps-title')?.value.trim() || '',
    message: document.getElementById('ps-message')?.value.trim() || '',
    buttonText: document.getElementById('ps-btn-text')?.value.trim() || 'Apply Now',
    buttonLink: document.getElementById('ps-btn-link')?.value.trim() || '',
    deadline: document.getElementById('ps-deadline')?.value || '',
    showNoticeBar: document.getElementById('ps-nb-active')?.checked || false,
    noticeBarText: document.getElementById('ps-nb-text')?.value.trim() || ''
  };
  if(data.active && !data.title) return toast("Title required!", true);
  if(data.active && !data.message) return toast("Message required!", true);
  const ok = await updatePopupSettings(data);
  if(ok) toast("Saved! ✅");
  else toast("Failed!", true);
}
/*===== CERTIFICATE MANAGEMENT =====*/

// Render Certificates Table
function renderCertificatesTable() {
  const tbody = document.getElementById('ctbl');
  if(!tbody) return;
  
  const certs = getCertificates();
  if(certs.length === 0) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="6">No certificates yet. Click "+ Add Certificate" to start.</td></tr>`;
    return;
  }
  
  tbody.innerHTML = '';
  certs.forEach((c) => {
    const date = c.issueDate || 'N/A';
    tbody.innerHTML += `
      <tr>
        <td><strong style="color:var(--blue-br)">${c.certId}</strong></td>
        <td>${c.name}</td>
        <td>${c.event}</td>
        <td><span class="bs bs-active">${c.position}</span></td>
        <td>${date}</td>
        <td class="tbl-acts">
          <button class="e-btn" onclick="viewCertificate('${c.id}')" title="View & QR">👁️</button>
          <button class="e-btn" onclick="editCertificate('${c.id}')">Edit</button>
          <button class="d-btn" onclick="deleteCertificateAction('${c.id}')">Delete</button>
        </td>
      </tr>`;
  });
}

// Open Add Certificate Form
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

// Edit Certificate
function editCertificate(id) {
  const c = getCertificates().find(x => x.id === id);
  if(!c) return;
  document.getElementById('cfm-title').textContent = "Edit Certificate";
  document.getElementById('cf-eid').value = id;
  document.getElementById('cf-certid').value = c.certId || '';
  document.getElementById('cf-certid').disabled = true; // ID change করা যাবে না
  document.getElementById('cf-name').value = c.name || '';
  document.getElementById('cf-event').value = c.event || '';
  document.getElementById('cf-position').value = c.position || '';
  document.getElementById('cf-date').value = c.issueDate || '';
  openFM('cfm');
}

// Save Certificate
async function saveCertificate() {
  const certId = document.getElementById('cf-certid').value.trim();
  const name = document.getElementById('cf-name').value.trim();
  const event = document.getElementById('cf-event').value.trim();
  const position = document.getElementById('cf-position').value.trim();
  const issueDate = document.getElementById('cf-date').value;
  
  if(!certId) return toast("Certificate ID is required!", true);
  if(!name) return toast("Participant Name is required!", true);
  if(!event) return toast("Event Name is required!", true);
  if(!position) return toast("Position is required!", true);
  if(!issueDate) return toast("Issue Date is required!", true);
  
  const cert = { certId, name, event, position, issueDate };
  const eid = document.getElementById('cf-eid').value;
  
  const btn = document.querySelector('#cfm .fs-btn');
  btn.textContent = 'Saving...';
  btn.disabled = true;
  
  let result;
  if(eid === '') {
    result = await addCertificate(cert);
  } else {
    result = await updateCertificate(eid, cert);
  }
  
  btn.textContent = 'Save Certificate';
  btn.disabled = false;
  
  if(result.success) {
    renderCertificatesTable();
    renderDashboard();
    closeFM('cfm');
    toast("Certificate saved! ✅");
  } else {
    toast(result.error || "Save failed!", true);
  }
}

// Delete Certificate
async function deleteCertificateAction(id) {
  if(!confirm("Delete this certificate? This cannot be undone!")) return;
  const ok = await deleteCertificate(id);
  if(ok) {
    renderCertificatesTable();
    renderDashboard();
    toast("Certificate deleted.");
  } else {
    toast("Delete failed!", true);
  }
}

// View Certificate (with QR Code)
function viewCertificate(id) {
  const c = getCertificates().find(x => x.id === id);
  if(!c) return;
  
  const verifyUrl = `https://talentversebd.github.io/TVBD/verify.html?id=${encodeURIComponent(c.certId)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}`;
  
  const content = document.getElementById('cv-content');
  content.innerHTML = `
    <div style="text-align:center;padding:10px;">
      <div style="background:linear-gradient(135deg,rgba(37,99,235,.1),rgba(37,99,235,.02));border:1px solid var(--bdr2);border-radius:12px;padding:20px;margin-bottom:20px;">
        <div style="font-size:2.5rem;margin-bottom:8px;">✅</div>
        <h3 style="font-family:Montserrat;font-size:1.2rem;color:#4ade80;margin-bottom:4px;">Certificate Verified</h3>
        <p style="color:var(--muted);font-size:.85rem;">TalentVerse Bangladesh</p>
      </div>
      
      <div style="text-align:left;background:var(--card2);border-radius:10px;padding:16px;margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr);">
          <span style="color:var(--muted);font-size:.85rem;">🆔 Certificate ID</span>
          <strong style="color:var(--blue-br);font-family:monospace;">${c.certId}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr);">
          <span style="color:var(--muted);font-size:.85rem;">👤 Name</span>
          <strong>${c.name}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr);">
          <span style="color:var(--muted);font-size:.85rem;">🏆 Event</span>
          <strong style="text-align:right;max-width:60%;">${c.event}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--bdr);">
          <span style="color:var(--muted);font-size:.85rem;">🥇 Position</span>
          <strong style="color:#4ade80;">${c.position}</strong>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0;">
          <span style="color:var(--muted);font-size:.85rem;">📅 Issue Date</span>
          <strong>${formatDate(c.issueDate)}</strong>
        </div>
      </div>
      
      <h4 style="font-family:Montserrat;margin-bottom:12px;">📱 QR Code</h4>
      <div style="background:#fff;padding:16px;border-radius:12px;display:inline-block;margin-bottom:16px;">
        <img src="${qrUrl}" alt="QR Code" style="width:200px;height:200px;display:block;" id="cv-qr">
      </div>
      
      <p style="color:var(--muted);font-size:.8rem;margin-bottom:16px;line-height:1.6;">
        📌 Print this QR code on the certificate.<br>
        Scanning will show verification page.
      </p>
      
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">
        <button onclick="downloadQR('${c.certId}', '${qrUrl}')" class="fs-btn" style="padding:10px 20px;font-size:.85rem;">
          ⬇️ Download QR
        </button>
        <button onclick="copyVerifyLink('${verifyUrl}')" class="fs-btn" style="padding:10px 20px;font-size:.85rem;background:linear-gradient(135deg,#16a34a,#15803d);">
          🔗 Copy Link
        </button>
      </div>
      
      <div style="margin-top:16px;padding:12px;background:var(--card2);border-radius:8px;font-size:.75rem;color:var(--muted);word-break:break-all;font-family:monospace;">
        ${verifyUrl}
      </div>
    </div>
  `;
  
  openFM('cvm');
}

// Format date
function formatDate(dateStr) {
  if(!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Download QR Code
async function downloadQR(certId, qrUrl) {
  try {
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR_${certId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("QR Code downloaded! ✅");
  } catch(err) {
    console.error("Download error:", err);
    toast("Download failed!", true);
  }
}

// Copy verify link
function copyVerifyLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    toast("Link copied! ✅");
  }).catch(() => {
    // Fallback
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    toast("Link copied! ✅");
  });
}

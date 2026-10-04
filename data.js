/*===== DEFAULT HOME DATA =====*/
const DEFAULT_HOME = {
  badge: "Bangladesh's Premier Olympiad Hub",
  title: "Where [Talent] Meets Opportunity",
  sub: "Connecting ambitious students with national & international olympiads, competitions, and academic excellence programs across Bangladesh.",
  b1: "Explore Olympiads",
  b2: "Learn More",
  odesc: "Discover upcoming olympiads and competitions designed to elevate your potential.",
  s1n: "50+", s1l: "Olympiads Listed",
  s2n: "10K+", s2l: "Students Reached",
  s3n: "64", s3l: "Districts Covered",
  quote: '"Every child in Bangladesh deserves to know about the opportunity that awaits their talent."',
  fdesc: "TalentVerse Bangladesh is the country's most dedicated platform for olympiad information, resources, and community.",
  femail: "talentversebangladesh@gmail.com",
  fphone: "+880 1634-428536",
  faddr: "Dhaka, Bangladesh"
};

/*===== IN-MEMORY CACHE =====*/
let cache = {
  home: DEFAULT_HOME,
  olympiads: [],
  gallery: [],
  news: [],
  messages: [],
  registrations: [],
  quizzes: [],
  quizSubmissions: [],
  customForms: [],
  formResponses: {},
  loaded: false
};

/*===== WAIT FOR FIREBASE =====*/
function waitForFirebase() {
  return new Promise((resolve) => {
    const check = setInterval(() => {
      if(window.firebaseDB && window.firebaseFunctions) {
        clearInterval(check);
        resolve();
      }
    }, 100);
  });
}

/*===== LOAD ALL DATA FROM FIRESTORE =====*/
async function loadAllData() {
  await waitForFirebase();
  const { collection, getDocs, doc, getDoc, query, orderBy } = window.firebaseFunctions;
  const db = window.firebaseDB;

  try {
    // Load Home
    const homeDoc = await getDoc(doc(db, "home", "main"));
    if(homeDoc.exists()) {
      cache.home = { ...DEFAULT_HOME, ...homeDoc.data() };
    }

    // Load Olympiads
    const olympSnap = await getDocs(query(collection(db, "olympiads"), orderBy("createdAt", "desc")));
    cache.olympiads = olympSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Load Gallery
    const galSnap = await getDocs(query(collection(db, "gallery"), orderBy("createdAt", "desc")));
    cache.gallery = galSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Load News
    const newsSnap = await getDocs(query(collection(db, "news"), orderBy("createdAt", "desc")));
    cache.news = newsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Load Quizzes (needed on public pages too, so the "Take Quiz" button
    // can be shown on events linked to a published quiz)
    if(typeof loadQuizzes === 'function') {
      await loadQuizzes();
    }

    cache.loaded = true;
    console.log("✅ Data loaded from Firestore");

    if(typeof renderAll === 'function') renderAll();
    if(typeof renderAdminAll === 'function') renderAdminAll();
  } catch(err) {
    console.error("❌ Load error:", err);
    if(typeof toast === 'function') toast("Failed to load data", true);
  }
}

/*===== GET DATA =====*/
function getHome() { return cache.home; }
function getOlympiads() { return cache.olympiads; }
function getGallery() { return cache.gallery; }
function getNews() { return cache.news; }
function getMessages() { return cache.messages; }
function getRegistrations() { return cache.registrations; }

/*===== HOME UPDATE =====*/
async function updateHome(data) {
  await waitForFirebase();
  const { doc, setDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    cache.home = { ...cache.home, ...data };
    await setDoc(doc(db, "home", "main"), cache.home);
    return true;
  } catch(err) {
    console.error("Update home error:", err);
    return false;
  }
}

/*===== OLYMPIAD CRUD =====*/
async function addOlympiad(o) {
  await waitForFirebase();
  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    o.createdAt = Date.now();
    const ref = await addDoc(collection(db, "olympiads"), o);
    cache.olympiads.unshift({ id: ref.id, ...o });
    return true;
  } catch(err) {
    console.error("Add olympiad error:", err);
    return false;
  }
}

async function updateOlympiad(id, o) {
  await waitForFirebase();
  const { doc, updateDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await updateDoc(doc(db, "olympiads", id), o);
    const idx = cache.olympiads.findIndex(x => x.id === id);
    if(idx > -1) cache.olympiads[idx] = { id, ...o };
    return true;
  } catch(err) {
    console.error("Update olympiad error:", err);
    return false;
  }
}

async function deleteOlympiadData(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "olympiads", id));
    await deleteDoc(doc(db, "event_links", id)).catch(() => {});
    cache.olympiads = cache.olympiads.filter(x => x.id !== id);
    return true;
  } catch(err) {
    console.error("Delete olympiad error:", err);
    return false;
  }
}

/*===== GALLERY CRUD =====*/
async function addGallery(g) {
  await waitForFirebase();
  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    g.createdAt = Date.now();
    const ref = await addDoc(collection(db, "gallery"), g);
    cache.gallery.unshift({ id: ref.id, ...g });
    return true;
  } catch(err) {
    console.error("Add gallery error:", err);
    return false;
  }
}

async function updateGallery(id, g) {
  await waitForFirebase();
  const { doc, updateDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await updateDoc(doc(db, "gallery", id), g);
    const idx = cache.gallery.findIndex(x => x.id === id);
    if(idx > -1) cache.gallery[idx] = { id, ...g };
    return true;
  } catch(err) {
    console.error("Update gallery error:", err);
    return false;
  }
}

async function deleteGalleryData(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "gallery", id));
    cache.gallery = cache.gallery.filter(x => x.id !== id);
    return true;
  } catch(err) {
    console.error("Delete gallery error:", err);
    return false;
  }
}

/*===== NEWS CRUD =====*/
async function addNews(n) {
  await waitForFirebase();
  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    n.createdAt = Date.now();
    const ref = await addDoc(collection(db, "news"), n);
    cache.news.unshift({ id: ref.id, ...n });
    return true;
  } catch(err) {
    console.error("Add news error:", err);
    return false;
  }
}

async function updateNews(id, n) {
  await waitForFirebase();
  const { doc, updateDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await updateDoc(doc(db, "news", id), n);
    const idx = cache.news.findIndex(x => x.id === id);
    if(idx > -1) cache.news[idx] = { id, ...n };
    return true;
  } catch(err) {
    console.error("Update news error:", err);
    return false;
  }
}

async function deleteNewsData(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "news", id));
    cache.news = cache.news.filter(x => x.id !== id);
    return true;
  } catch(err) {
    console.error("Delete news error:", err);
    return false;
  }
}

/*===== MESSAGES (Contact Form) =====*/
async function addMessage(m) {
  await waitForFirebase();
  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    m.createdAt = Date.now();
    m.read = false;
    await addDoc(collection(db, "messages"), m);
    return true;
  } catch(err) {
    console.error("Add message error:", err);
    return false;
  }
}

async function loadMessages() {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")));
    cache.messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.messages;
  } catch(err) {
    console.error("Load messages error:", err);
    return [];
  }
}

async function deleteMessage(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "messages", id));
    cache.messages = cache.messages.filter(x => x.id !== id);
    return true;
  } catch(err) {
    console.error("Delete message error:", err);
    return false;
  }
}

/*===== REGISTRATIONS (event sign-ups — requires a logged-in, verified account) =====*/
async function addRegistration(r) {
  await waitForFirebase();
  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    r.createdAt = Date.now();
    await addDoc(collection(db, "registrations"), r);
    return true;
  } catch(err) {
    console.error("Add registration error:", err);
    return false;
  }
}

async function loadRegistrations() {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "registrations"), orderBy("createdAt", "desc")));
    cache.registrations = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.registrations;
  } catch(err) {
    console.error("Load registrations error:", err);
    return [];
  }
}

async function deleteRegistration(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "registrations", id));
    cache.registrations = cache.registrations.filter(x => x.id !== id);
    return true;
  } catch(err) {
    console.error("Delete registration error:", err);
    return false;
  }
}

// Participant Dashboard: fetch a participant's own event registrations by email
// ("My Events"). Sorted client-side (newest first) to avoid needing a composite index.
async function getRegistrationsByEmail(email) {
  await waitForFirebase();
  const { collection, getDocs, query, where } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "registrations"), where("email", "==", email)));
    const regs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    regs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return regs;
  } catch(err) {
    console.error("Get registrations by email error:", err);
    return [];
  }
}

/*===== IMGBB IMAGE UPLOAD =====*/
async function uploadToImgBB(file) {
  const key = window.IMGBB_KEY;
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if(data.success) {
      return { success: true, url: data.data.url };
    } else {
      return { success: false, error: "Upload failed" };
    }
  } catch(err) {
    console.error("ImgBB upload error:", err);
    return { success: false, error: err.message };
  }
}

/*===== REGISTRATION SETTINGS (Google Form Link) =====*/
async function getRegistrationSettings() {
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDoc(doc(db, "settings", "registration"));
    if(snap.exists()) {
      return snap.data();
    }
    return {
      title: "",
      description: "",
      formLink: "",
      deadline: "",
      active: false
    };
  } catch(err) {
    console.error("Get reg settings error:", err);
    return { title: "", description: "", formLink: "", deadline: "", active: false };
  }
}

async function updateRegistrationSettings(data) {
  await waitForFirebase();
  const { doc, setDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await setDoc(doc(db, "settings", "registration"), data);
    return true;
  } catch(err) {
    console.error("Update reg settings error:", err);
    return false;
  }
}

/*===== INIT ON LOAD =====*/
document.addEventListener('DOMContentLoaded', () => {
  loadAllData();
});
/*===== POPUP NOTICE SETTINGS =====*/
async function getPopupSettings() {
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDoc(doc(db, "settings", "popup"));
    if(snap.exists()) {
      return snap.data();
    }
    return {
      active: false,
      title: "Important Notice",
      message: "Campus Ambassador Registration - Only 1 Day Left!",
      buttonText: "Apply Now",
      buttonLink: "",
      deadline: "",
      showNoticeBar: true,
      noticeBarText: "Registration is Open Now!"
    };
  } catch(err) {
    console.error("Get popup settings error:", err);
    return { active: false, title: "", message: "", buttonText: "", buttonLink: "", deadline: "", showNoticeBar: false, noticeBarText: "" };
  }
}

async function updatePopupSettings(data) {
  await waitForFirebase();
  const { doc, setDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await setDoc(doc(db, "settings", "popup"), data);
    return true;
  } catch(err) {
    console.error("Update popup settings error:", err);
    return false;
  }
}
/*===== CERTIFICATE FUNCTIONS =====*/

// Get all certificates
async function loadCertificates() {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "certificates"), orderBy("createdAt", "desc")));
    cache.certificates = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.certificates;
  } catch(err) {
    console.error("Load certificates error:", err);
    return [];
  }
}

function getCertificates() {
  return cache.certificates || [];
}

// Participant Dashboard: fetch a participant's own certificates by email ("My Certificates").
// Only certificates that were issued with an email attached will show up this way —
// older ones (or ones added without an email) still work via verify.html + Certificate ID.
async function getCertificatesByEmail(email) {
  await waitForFirebase();
  const { collection, getDocs, getDoc, doc, query, where } = window.firebaseFunctions;
  const db = window.firebaseDB;
  const em = String(email || '').trim().toLowerCase();
  try {
    // owners are kept in a PRIVATE collection (certificate_owners); the certificates themselves are public
    const ownSnap = await getDocs(query(collection(db, "certificate_owners"), where("email", "==", em)));
    const found = await Promise.all(ownSnap.docs.map(async o => {
      const c = await getDoc(doc(db, "certificates", o.id));
      return c.exists() ? { id: c.id, ...c.data() } : null;
    }));
    let certs = found.filter(Boolean);

    // older certificates that still carry the email inside the public document (until migrated)
    try {
      const legacy = await getDocs(query(collection(db, "certificates"), where("email", "==", em)));
      legacy.docs.forEach(d => { if(!certs.some(c => c.id === d.id)) certs.push({ id: d.id, ...d.data() }); });
    } catch(e) { /* ignore */ }

    certs = certs.map(c => { const x = { ...c }; delete x.email; return x; });
    certs.sort((a, b) => String(b.issueDate || '').localeCompare(String(a.issueDate || '')));
    return certs;
  } catch(err) {
    console.error("Get certificates by email error:", err);
    return [];
  }
}

// Get single certificate by Certificate ID (not Firestore ID)
async function getCertificateById(certId) {
  await waitForFirebase();
  const { collection, getDocs, query, where } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    // First try from cache
    if(cache.certificates) {
      const found = cache.certificates.find(c => c.certId === certId);
      if(found) return found;
    }
    
    // Fetch from Firestore
    const snap = await getDocs(collection(db, "certificates"));
    let result = null;
    snap.forEach(doc => {
      const data = doc.data();
      if(data.certId === certId) {
        result = { id: doc.id, ...data };
      }
    });
    return result;
  } catch(err) {
    console.error("Get certificate error:", err);
    return null;
  }
}

// Add certificate
async function addCertificate(cert) {
  await waitForFirebase();
  const { collection, addDoc, getDocs, query, where } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    // Check if Certificate ID already exists
    const snap = await getDocs(collection(db, "certificates"));
    let exists = false;
    snap.forEach(doc => {
      if(doc.data().certId === cert.certId) exists = true;
    });
    
    if(exists) {
      return { success: false, error: "Certificate ID already exists!" };
    }
    
    // the participant's email must never sit in the public certificate document
    const email = String(cert.email || '').trim().toLowerCase();
    const pub = { ...cert }; delete pub.email;
    pub.createdAt = Date.now();
    pub.status = "Verified";
    const ref = await addDoc(collection(db, "certificates"), pub);
    if(email) {
      const { doc, setDoc } = window.firebaseFunctions;
      await setDoc(doc(db, "certificate_owners", ref.id), { email, certId: pub.certId, createdAt: Date.now() });
      cache.certOwners = cache.certOwners || {};
      cache.certOwners[ref.id] = email;
    }

    if(!cache.certificates) cache.certificates = [];
    cache.certificates.unshift({ id: ref.id, ...pub });
    
    return { success: true, id: ref.id };
  } catch(err) {
    console.error("Add certificate error:", err);
    return { success: false, error: err.message };
  }
}

/*===== PARTICIPANTS' GROUP LINK (private to registered participants) =====
   The link is NOT stored in the public olympiads document. It lives in event_links/{eventId}
   and is readable only by admins and by people who have a registration_index/{eventId}_{uid}
   record (created automatically when they register / when they open their dashboard). */
async function ensureRegistered(eventId, uid) {
  if(!eventId || !uid) return false;
  await waitForFirebase();
  const { doc, getDoc, setDoc } = window.firebaseFunctions;
  const ref = doc(window.firebaseDB, "registration_index", eventId + '_' + uid);
  try {
    const snap = await getDoc(ref);
    if(snap.exists()) return true;
    await setDoc(ref, { eventId, uid, at: Date.now() });
    return true;
  } catch(err) { return false; }
}

async function getEventLink(eventId) {
  if(!eventId) return '';
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  try {
    const snap = await getDoc(doc(window.firebaseDB, "event_links", eventId));
    return snap.exists() ? (snap.data().url || '') : '';
  } catch(err) { return ''; }
}

async function saveEventLink(eventId, url) {
  await waitForFirebase();
  const { doc, setDoc, deleteDoc } = window.firebaseFunctions;
  const ref = doc(window.firebaseDB, "event_links", eventId);
  try {
    if(url) await setDoc(ref, { url, updatedAt: Date.now() });
    else await deleteDoc(ref).catch(() => {});
    return true;
  } catch(err) { console.error("Save event link error:", err); return false; }
}

// A green, clickable "Join Group" block (dark = for use on the dark My Events cards)
function groupLinkHtml(url, dark) {
  const u = String(url || '').trim();
  if(!/^https?:\/\//i.test(u)) return '';
  const safe = u.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  return `<div style="margin-top:14px;text-align:center;">
    <div style="font-size:.82rem;color:${dark ? 'rgba(255,255,255,.85)' : 'var(--muted)'};margin-bottom:8px;">👥 অংশগ্রহণকারীদের গ্রুপে যোগ দিন</div>
    <a href="${safe}" target="_blank" rel="noopener noreferrer" style="display:block;background:#16a34a;color:#fff;font-weight:800;font-size:.95rem;padding:13px 26px;border-radius:999px;text-decoration:none;">Join Group</a>
    <div style="margin-top:8px;word-break:break-all;"><a href="${safe}" target="_blank" rel="noopener noreferrer" style="color:${dark ? '#86efac' : '#16a34a'};font-size:.8rem;text-decoration:underline;">${safe}</a></div>
  </div>`;
}

/*===== RESULTS, RANKING & LEADERBOARD =====
   publishQuizResults() ranks every GRADED submission of a quiz (highest score first, faster time
   breaks a tie; equal score + equal time share a rank) and
   - writes rank / position / resultPublished onto each person's own submission
     (so a participant sees their score + rank on their dashboard), and
   - writes a public quiz_results/{quizId} document with only the top N names (the leaderboard). */
function rkPosition(rank) {
  return rank === 1 ? 'Champion' : rank === 2 ? '1st Runner Up' : rank === 3 ? '2nd Runner Up' : '';
}

async function publishQuizResults(quizId, opts) {
  opts = opts || {};
  const topN = Math.max(1, Math.min(100, parseInt(opts.topN, 10) || 10));
  await waitForFirebase();
  const { collection, getDocs, query, where, writeBatch, doc, setDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const quiz = (await loadQuizzes()).find(q => q.id === quizId);
    if(!quiz) return { success: false, error: 'Quiz not found' };

    const snap = await getDocs(query(collection(db, "quiz_submissions"), where("quizId", "==", quizId)));
    const all = snap.docs.map(d => ({ ref: d.ref, ...d.data() }));
    const graded = all.filter(s => s.totalScore != null);
    const ungraded = all.length - graded.length;
    if(!graded.length) return { success: false, error: 'গ্রেড করা কোনো সাবমিশন নেই — আগে ⚡ MCQ অটো-গ্রেড ও লিখিত উত্তরের নম্বর দিন।' };

    // segment of each person (from their registration for the event(s) linked to this quiz)
    const segOf = {};
    if(opts.bySegment) {
      try {
        if(typeof loadAllData === 'function') await loadAllData();
        const titles = (typeof getOlympiads === 'function' ? getOlympiads() : [])
          .filter(o => o.quizId === quizId).map(o => String(o.title || '').trim().toLowerCase());
        (await loadRegistrations()).forEach(r => {
          if(titles.includes(String(r.olympiad || '').trim().toLowerCase())) segOf[String(r.email || '').trim().toLowerCase()] = r.segment || '';
        });
      } catch(e) { console.warn('Segments unavailable, ranking everyone together', e); }
    }

    const groups = {};
    graded.forEach(s => {
      const seg = opts.bySegment ? (segOf[String(s.email || '').trim().toLowerCase()] || '') : '';
      s._seg = seg; (groups[seg] = groups[seg] || []).push(s);
    });
    const publicGroups = [];
    Object.keys(groups).sort().forEach(seg => {
      const g = groups[seg];
      g.sort((a, b) => (b.totalScore - a.totalScore) || ((a.timeTakenSeconds ?? 1e12) - (b.timeTakenSeconds ?? 1e12)));
      let rank = 0, prev = null;
      g.forEach((s, i) => {
        const key = s.totalScore + '|' + (s.timeTakenSeconds ?? '');
        if(key !== prev) { rank = i + 1; prev = key; }
        s._rank = rank; s._of = g.length;
      });
      publicGroups.push({
        segment: seg, participants: g.length,
        entries: g.filter(s => s._rank <= topN).map(s => ({
          rank: s._rank, name: s.name || '', score: s.totalScore, possible: s.totalPossible || 0,
          percent: s.totalPossible ? Math.round(s.totalScore / s.totalPossible * 100) : 0
        }))
      });
    });

    const now = Date.now();
    for(let i = 0; i < graded.length; i += 400) {
      const batch = writeBatch(db);
      graded.slice(i, i + 400).forEach(s => {
        batch.update(s.ref, {
          resultPublished: true, rank: s._rank, rankOf: s._of, segment: s._seg || '',
          position: rkPosition(s._rank), publishedAt: now,
          percent: s.totalPossible ? Math.round(s.totalScore / s.totalPossible * 100) : 0
        });
      });
      await batch.commit();
    }

    await setDoc(doc(db, "quiz_results", quizId), {
      quizId, title: quiz.title || '', publishedAt: now, topN,
      participants: graded.length, ungraded, groups: publicGroups
    });
    if(typeof loadQuizSubmissions === 'function') await loadQuizSubmissions();
    return { success: true, ranked: graded.length, ungraded };
  } catch(err) {
    console.error("Publish results error:", err);
    return { success: false, error: err.message };
  }
}

async function unpublishQuizResults(quizId) {
  await waitForFirebase();
  const { collection, getDocs, query, where, writeBatch, doc, deleteDoc, deleteField } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "quiz_submissions"), where("quizId", "==", quizId)));
    const docs = snap.docs.filter(d => d.data().resultPublished);
    for(let i = 0; i < docs.length; i += 400) {
      const batch = writeBatch(db);
      docs.slice(i, i + 400).forEach(d => batch.update(d.ref, {
        resultPublished: false, rank: deleteField(), rankOf: deleteField(), segment: deleteField(),
        position: deleteField(), publishedAt: deleteField(), percent: deleteField()
      }));
      await batch.commit();
    }
    await deleteDoc(doc(db, "quiz_results", quizId)).catch(() => {});
    if(typeof loadQuizSubmissions === 'function') await loadQuizSubmissions();
    return { success: true, cleared: docs.length };
  } catch(err) {
    console.error("Unpublish results error:", err);
    return { success: false, error: err.message };
  }
}

async function getQuizResultsDoc(quizId) {
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  try {
    const snap = await getDoc(doc(window.firebaseDB, "quiz_results", quizId));
    return snap.exists() ? snap.data() : null;
  } catch(err) { return null; }
}

async function loadPublishedResults() {
  await waitForFirebase();
  const { collection, getDocs } = window.firebaseFunctions;
  try {
    const snap = await getDocs(collection(window.firebaseDB, "quiz_results"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
  } catch(err) {
    console.error("Load published results error:", err);
    return null;
  }
}

// The leaderboard table (used by the Results page and by the dashboard). hl = { rank, name } to highlight "me".
function resultsBoardHtml(res, hl) {
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  if(!res || !(res.groups || []).length) return '<p style="color:var(--muted);font-size:.88rem;">—</p>';
  const medal = r => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : '';
  const th = 'padding:8px 6px;font-size:.72rem;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);border-bottom:1px solid var(--bdr);';
  return res.groups.map(g => `
    <div style="margin-bottom:18px;">
      ${g.segment ? `<div style="font-weight:800;font-size:.95rem;margin:6px 0;color:var(--txt);">${esc(g.segment)}</div>` : ''}
      <table style="width:100%;border-collapse:collapse;">
        <thead><tr>
          <th style="${th}text-align:left;width:70px;">Rank</th>
          <th style="${th}text-align:left;">Name</th>
          <th style="${th}text-align:right;">Score</th>
        </tr></thead>
        <tbody>${(g.entries || []).map(e => {
          const me = hl && hl.rank === e.rank && String(hl.name || '').trim() === String(e.name || '').trim();
          return `<tr style="${me ? 'background:rgba(37,99,235,.18);' : ''}">
            <td style="padding:10px 6px;border-bottom:1px solid var(--bdr);font-weight:800;">${medal(e.rank)} ${e.rank}</td>
            <td style="padding:10px 6px;border-bottom:1px solid var(--bdr);color:var(--txt);">${esc(e.name)}</td>
            <td style="padding:10px 6px;border-bottom:1px solid var(--bdr);text-align:right;font-weight:700;color:var(--blue-br);">${esc(e.score)}/${esc(e.possible)}</td>
          </tr>`;
        }).join('')}</tbody>
      </table>
    </div>`).join('');
}

/*===== CERTIFICATE OWNERS (private emails) =====*/
async function loadCertificateOwners() {
  await waitForFirebase();
  const { collection, getDocs } = window.firebaseFunctions;
  try {
    const snap = await getDocs(collection(window.firebaseDB, "certificate_owners"));
    const map = {};
    snap.docs.forEach(d => { map[d.id] = d.data().email || ''; });
    cache.certOwners = map;
  } catch(err) {
    console.error("Load certificate owners error:", err);
    cache.certOwners = cache.certOwners || {};
  }
  return cache.certOwners;
}
function getCertificateOwnerEmail(id) { return (cache.certOwners || {})[id] || ''; }

// One-time clean-up: move emails out of public certificate documents into certificate_owners
async function migrateCertificateEmails() {
  await waitForFirebase();
  const { collection, getDocs, doc, writeBatch, deleteField } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(collection(db, "certificates"));
    const todo = snap.docs.filter(d => Object.prototype.hasOwnProperty.call(d.data(), 'email'));
    for(let i = 0; i < todo.length; i += 200) {
      const batch = writeBatch(db);
      todo.slice(i, i + 200).forEach(d => {
        const data = d.data();
        const email = String(data.email || '').trim().toLowerCase();
        if(email) batch.set(doc(db, "certificate_owners", d.id), { email, certId: data.certId || '', createdAt: Date.now() });
        batch.update(d.ref, { email: deleteField() });
      });
      await batch.commit();
    }
    await loadCertificates();
    return todo.length;
  } catch(err) {
    console.error("Migrate certificate emails error:", err);
    return -1;
  }
}

/*===== CERTIFICATE TEMPLATES =====
   settings/certTemplate           = default design (used by every event without its own)
   settings/certTpl_<eventId>      = design made for one specific event */
function certTplDocId(eventId) { return eventId ? 'certTpl_' + eventId : 'certTemplate'; }

async function loadCertTemplate(force, eventId) {
  const key = certTplDocId(eventId);
  cache.certTemplates = cache.certTemplates || {};
  if(!force && key in cache.certTemplates) return cache.certTemplates[key];
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  try {
    const snap = await getDoc(doc(window.firebaseDB, "settings", key));
    cache.certTemplates[key] = snap.exists() ? snap.data() : null;
  } catch(err) {
    console.error("Load cert template error:", err);
    if(!(key in cache.certTemplates)) cache.certTemplates[key] = null;
  }
  return cache.certTemplates[key];
}
async function saveCertTemplate(cfg, eventId) {
  await waitForFirebase();
  const { doc, setDoc } = window.firebaseFunctions;
  try {
    const data = { ...cfg, updatedAt: Date.now() };
    await setDoc(doc(window.firebaseDB, "settings", certTplDocId(eventId)), data);
    cache.certTemplates = cache.certTemplates || {};
    cache.certTemplates[certTplDocId(eventId)] = data;
    return true;
  } catch(err) { console.error("Save cert template error:", err); return false; }
}
async function removeCertTemplate(eventId) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  try {
    await deleteDoc(doc(window.firebaseDB, "settings", certTplDocId(eventId)));
    cache.certTemplates = cache.certTemplates || {};
    cache.certTemplates[certTplDocId(eventId)] = null;
    return true;
  } catch(err) { console.error("Remove cert template error:", err); return false; }
}

/*===== ADMIN ACTIVITY LOG (read by the main admin only) =====*/
async function loadAdminLogs(max) {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy, limit } = window.firebaseFunctions;
  try {
    const snap = await getDocs(query(collection(window.firebaseDB, "admin_logs"), orderBy("at", "desc"), limit(max || 300)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(err) {
    console.error("Load admin logs error:", err);
    return [];
  }
}
async function deleteOldAdminLogs(beforeTs) {
  await waitForFirebase();
  const { collection, getDocs, query, where, writeBatch } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "admin_logs"), where("at", "<", beforeTs)));
    const docs = snap.docs;
    for(let i = 0; i < docs.length; i += 400) {
      const batch = writeBatch(db);
      docs.slice(i, i + 400).forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
    return docs.length;
  } catch(err) {
    console.error("Delete old admin logs error:", err);
    return -1;
  }
}

// Add many certificates at once (one read of existing IDs, then batched writes)
async function addCertificatesBulk(list) {
  await waitForFirebase();
  const { collection, getDocs, doc, writeBatch } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(collection(db, "certificates"));
    const taken = new Set();
    snap.forEach(d => taken.add(String(d.data().certId || '').toUpperCase()));
    const clash = list.find(c => taken.has(String(c.certId).toUpperCase()));
    if(clash) return { success: false, error: `Certificate ID ${clash.certId} already exists!` };

    const added = [];
    cache.certOwners = cache.certOwners || {};
    for(let i = 0; i < list.length; i += 200) {          // 2 writes per certificate -> 400 per batch
      const batch = writeBatch(db);
      list.slice(i, i + 200).forEach(c => {
        const email = String(c.email || '').trim().toLowerCase();
        const pub = { ...c }; delete pub.email;            // email is stored privately, never in the public document
        const ref = doc(collection(db, "certificates"));
        const data = { ...pub, createdAt: Date.now(), status: "Verified" };
        batch.set(ref, data);
        if(email) {
          batch.set(doc(db, "certificate_owners", ref.id), { email, certId: pub.certId, createdAt: Date.now() });
          cache.certOwners[ref.id] = email;
        }
        added.push({ id: ref.id, ...data });
      });
      await batch.commit();
    }
    cache.certificates = [...added.reverse(), ...(cache.certificates || [])];
    return { success: true, count: added.length };
  } catch(err) {
    console.error("Bulk add certificates error:", err);
    return { success: false, error: err.message };
  }
}

// Update certificate
async function updateCertificate(id, cert) {
  await waitForFirebase();
  const { doc, updateDoc, setDoc, deleteDoc, deleteField } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const email = String(cert.email || '').trim().toLowerCase();
    const pub = { ...cert }; delete pub.email;
    pub.updatedAt = Date.now();
    // email: deleteField() also scrubs any old public copy of the email
    await updateDoc(doc(db, "certificates", id), { ...pub, email: deleteField() });

    cache.certOwners = cache.certOwners || {};
    if(email) {
      await setDoc(doc(db, "certificate_owners", id), { email, certId: pub.certId || '', createdAt: Date.now() });
      cache.certOwners[id] = email;
    } else {
      await deleteDoc(doc(db, "certificate_owners", id)).catch(() => {});
      delete cache.certOwners[id];
    }
    
    if(cache.certificates) {
      const idx = cache.certificates.findIndex(x => x.id === id);
      if(idx > -1) cache.certificates[idx] = { id, ...pub };
    }
    
    return { success: true };
  } catch(err) {
    console.error("Update certificate error:", err);
    return { success: false, error: err.message };
  }
}

// Delete certificate
async function deleteCertificate(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "certificates", id));
    await deleteDoc(doc(db, "certificate_owners", id)).catch(() => {});
    if(cache.certOwners) delete cache.certOwners[id];
    if(cache.certificates) {
      cache.certificates = cache.certificates.filter(x => x.id !== id);
    }
    return true;
  } catch(err) {
    console.error("Delete certificate error:", err);
    return false;
  }
}
/*===== TEAM FUNCTIONS =====*/

// Load all team members
async function loadTeam() {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "team"), orderBy("order", "asc")));
    cache.team = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.team;
  } catch(err) {
    console.error("Load team error:", err);
    // Fallback: load without orderBy if error
    try {
      const snap = await getDocs(collection(db, "team"));
      cache.team = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort manually by order
      cache.team.sort((a, b) => (a.order || 999) - (b.order || 999));
      return cache.team;
    } catch(e) {
      console.error("Fallback load error:", e);
      return [];
    }
  }
}

function getTeam() {
  return cache.team || [];
}

// Add team member
async function addTeamMember(member) {
  await waitForFirebase();
  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    member.createdAt = Date.now();
    const ref = await addDoc(collection(db, "team"), member);
    if(!cache.team) cache.team = [];
    cache.team.push({ id: ref.id, ...member });
    // Sort by order
    cache.team.sort((a, b) => (a.order || 999) - (b.order || 999));
    return true;
  } catch(err) {
    console.error("Add team error:", err);
    return false;
  }
}

// Update team member
async function updateTeamMember(id, member) {
  await waitForFirebase();
  const { doc, updateDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    member.updatedAt = Date.now();
    await updateDoc(doc(db, "team", id), member);
    if(cache.team) {
      const idx = cache.team.findIndex(x => x.id === id);
      if(idx > -1) cache.team[idx] = { id, ...member };
      cache.team.sort((a, b) => (a.order || 999) - (b.order || 999));
    }
    return true;
  } catch(err) {
    console.error("Update team error:", err);
    return false;
  }
}

// Delete team member
async function deleteTeamMember(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "team", id));
    if(cache.team) {
      cache.team = cache.team.filter(x => x.id !== id);
    }
    return true;
  } catch(err) {
    console.error("Delete team error:", err);
    return false;
  }
}

/*===== NETWORK PAGES (Our Network section on homepage) =====*/

// Load all network pages
async function loadNetworkPages() {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "networkPages"), orderBy("order", "asc")));
    cache.networkPages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.networkPages;
  } catch(err) {
    console.error("Load network pages error:", err);
    try {
      const snap = await getDocs(collection(db, "networkPages"));
      cache.networkPages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      cache.networkPages.sort((a, b) => (a.order || 999) - (b.order || 999));
      return cache.networkPages;
    } catch(e) {
      console.error("Fallback load error:", e);
      return [];
    }
  }
}

function getNetworkPages() {
  return cache.networkPages || [];
}

// Add network page
async function addNetworkPage(page) {
  await waitForFirebase();
  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    page.createdAt = Date.now();
    const ref = await addDoc(collection(db, "networkPages"), page);
    if(!cache.networkPages) cache.networkPages = [];
    cache.networkPages.push({ id: ref.id, ...page });
    cache.networkPages.sort((a, b) => (a.order || 999) - (b.order || 999));
    return true;
  } catch(err) {
    console.error("Add network page error:", err);
    return false;
  }
}

// Update network page
async function updateNetworkPage(id, page) {
  await waitForFirebase();
  const { doc, updateDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    page.updatedAt = Date.now();
    await updateDoc(doc(db, "networkPages", id), page);
    if(cache.networkPages) {
      const idx = cache.networkPages.findIndex(x => x.id === id);
      if(idx > -1) cache.networkPages[idx] = { id, ...page };
      cache.networkPages.sort((a, b) => (a.order || 999) - (b.order || 999));
    }
    return true;
  } catch(err) {
    console.error("Update network page error:", err);
    return false;
  }
}

// Delete network page
async function deleteNetworkPage(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "networkPages", id));
    if(cache.networkPages) {
      cache.networkPages = cache.networkPages.filter(x => x.id !== id);
    }
    return true;
  } catch(err) {
    console.error("Delete network page error:", err);
    return false;
  }
}

// Load all quizzes
async function loadQuizzes() {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "quizzes"), orderBy("createdAt", "desc")));
    cache.quizzes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.quizzes;
  } catch(err) {
    console.error("Load quizzes error:", err);
    cache.quizzes = cache.quizzes || [];
    return cache.quizzes;
  }
}
function getQuizzes() { return cache.quizzes || []; }

// Participant Dashboard: fetch a participant's own quiz results by email.
// Sorted client-side (newest first) to avoid needing a composite index.
async function getQuizSubmissionsByEmail(email) {
  await waitForFirebase();
  const { collection, getDocs, query, where } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "quiz_submissions"), where("email", "==", email)));
    const results = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    results.sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));
    return results;
  } catch (err) {
    console.error("Get quiz submissions by email error:", err);
    return [];
  }
}
function getPublishedQuizzes() { return (cache.quizzes || []).filter(q => q.status === 'published'); }

// Deterministic submission ID: one document per (quiz, email) pair.
function qzMakeSubId(quizId, email) {
  const clean = (email || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '') || 'noemail';
  return `${quizId}__${clean}`;
}

// Is a quiz currently open based on its optional start/end schedule?
function getQuizAvailability(quiz) {
  const now = Date.now();
  if (quiz.startAt && now < quiz.startAt) {
    return { open: false, reason: 'not_started', at: quiz.startAt };
  }
  if (quiz.endAt && now > quiz.endAt) {
    return { open: false, reason: 'ended', at: quiz.endAt };
  }
  return { open: true, reason: 'ok' };
}

// Local (device-level) guard — instant, no network needed.
function hasLocalQuizAttempt(quizId) {
  try { return !!localStorage.getItem('tvbd_quiz_done_' + quizId); } catch (e) { return false; }
}
function markLocalQuizAttempt(quizId) {
  try { localStorage.setItem('tvbd_quiz_done_' + quizId, String(Date.now())); } catch (e) {}
}

// Best-effort server-side guard (email-level, works across devices).
async function hasAlreadyAttemptedQuiz(quizId, email) {
  if (hasLocalQuizAttempt(quizId)) return true;
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const id = qzMakeSubId(quizId, email);
    const d = await getDoc(doc(db, "quiz_submissions", id));
    return d.exists();
  } catch (err) {
    return false;
  }
}

async function getQuizById(id) {
  if(cache.quizzes) {
    const found = cache.quizzes.find(q => q.id === id);
    if(found) return found;
  }
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const d = await getDoc(doc(db, "quizzes", id));
    if(d.exists()) return { id: d.id, ...d.data() };
    return null;
  } catch(err) {
    console.error("Get quiz error:", err);
    return null;
  }
}

/*===== SECURE QUIZZES =====
   A "secure" quiz keeps its questions in the public quizzes document WITHOUT the correct
   answers. The answers live in quiz_keys/{quizId} which only admins can read. Students'
   answers are graded afterwards by an admin (autoGradeQuizzes). */
function qzSplitKeys(quiz) {
  const keys = {};
  const questions = (quiz.questions || []).map(q => {
    if(q.type === 'mcq') {
      keys[q.id] = Number(q.correctIndex);
      const { correctIndex, ...rest } = q;
      return rest;
    }
    return q;
  });
  return { pub: { ...quiz, questions, secure: true }, keys };
}

async function loadQuizKey(id) {
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  try {
    const snap = await getDoc(doc(window.firebaseDB, "quiz_keys", id));
    return snap.exists() ? (snap.data().answers || {}) : null;
  } catch(err) {
    console.error("Load quiz key error:", err);
    return null;
  }
}

async function addQuiz(quiz) {
  await waitForFirebase();
  const { collection, addDoc, doc, setDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    quiz.createdAt = Date.now();
    let pub = quiz, keys = null;
    if(quiz.secure) { const sp = qzSplitKeys(quiz); pub = sp.pub; keys = sp.keys; }
    const ref = await addDoc(collection(db, "quizzes"), pub);
    if(keys) await setDoc(doc(db, "quiz_keys", ref.id), { answers: keys, updatedAt: Date.now() });
    if(!cache.quizzes) cache.quizzes = [];
    cache.quizzes.unshift({ id: ref.id, ...pub });
    return { success: true, id: ref.id };
  } catch(err) {
    console.error("Add quiz error:", err);
    return { success: false, error: err.message };
  }
}

async function updateQuiz(id, quiz) {
  await waitForFirebase();
  const { doc, updateDoc, setDoc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    quiz.updatedAt = Date.now();
    let pub = quiz;
    if(quiz.questions && quiz.secure) {
      const sp = qzSplitKeys(quiz); pub = sp.pub;
      await updateDoc(doc(db, "quizzes", id), pub);
      await setDoc(doc(db, "quiz_keys", id), { answers: sp.keys, updatedAt: Date.now() });
    } else {
      await updateDoc(doc(db, "quizzes", id), quiz);
      if(quiz.questions && quiz.secure === false) await deleteDoc(doc(db, "quiz_keys", id)).catch(() => {});
    }
    if(cache.quizzes) {
      const idx = cache.quizzes.findIndex(x => x.id === id);
      if(idx > -1) cache.quizzes[idx] = { id, ...cache.quizzes[idx], ...pub };
    }
    return { success: true };
  } catch(err) {
    console.error("Update quiz error:", err);
    return { success: false, error: err.message };
  }
}

// One-time: move the answers of every existing quiz out of the public document
async function secureAllQuizzes() {
  await waitForFirebase();
  const { collection, getDocs, doc, writeBatch } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(collection(db, "quizzes"));
    const todo = snap.docs.filter(d => {
      const q = d.data();
      return !q.secure && (q.questions || []).some(x => x.type === 'mcq' && x.correctIndex !== undefined);
    });
    for(let i = 0; i < todo.length; i += 200) {
      const batch = writeBatch(db);
      todo.slice(i, i + 200).forEach(d => {
        const sp = qzSplitKeys(d.data());
        batch.update(d.ref, { questions: sp.pub.questions, secure: true });
        batch.set(doc(db, "quiz_keys", d.id), { answers: sp.keys, updatedAt: Date.now() });
      });
      await batch.commit();
    }
    await loadQuizzes();
    return todo.length;
  } catch(err) {
    console.error("Secure all quizzes error:", err);
    return -1;
  }
}

// Admin: grade the MCQ part of every secure quiz's ungraded submissions
async function autoGradeQuizzes() {
  await waitForFirebase();
  const { collection, getDocs, query, where, writeBatch } = window.firebaseFunctions;
  const db = window.firebaseDB;
  let graded = 0, missingKeys = 0;
  try {
    const quizzes = (await loadQuizzes()).filter(q => q.secure);
    for(const quiz of quizzes) {
      const snap = await getDocs(query(collection(db, "quiz_submissions"), where("quizId", "==", quiz.id)));
      const pending = snap.docs.filter(d => d.data().mcqScore == null);
      if(!pending.length) continue;
      const keys = await loadQuizKey(quiz.id);
      if(!keys) { missingKeys++; continue; }
      const qs = quiz.questions || [];
      const mcqTotal = qs.filter(q => q.type === 'mcq').reduce((a, q) => a + (Number(q.points) || 1), 0);
      const shortTotal = qs.filter(q => q.type === 'short').reduce((a, q) => a + (Number(q.points) || 1), 0);
      const hasShort = shortTotal > 0;
      for(let i = 0; i < pending.length; i += 400) {
        const batch = writeBatch(db);
        pending.slice(i, i + 400).forEach(d => {
          const sub = d.data();
          let mcqScore = 0;
          qs.forEach(q => {
            if(q.type !== 'mcq') return;
            const given = (sub.answers || {})[q.id];
            if(given !== undefined && Number(given) === Number(keys[q.id])) mcqScore += Number(q.points) || 1;
          });
          const shortScore = sub.shortScore != null ? Number(sub.shortScore) : null;
          const totalScore = hasShort ? (shortScore != null ? mcqScore + shortScore : null) : mcqScore;
          batch.update(d.ref, {
            mcqScore, mcqTotal, shortTotal, totalPossible: mcqTotal + shortTotal,
            totalScore, status: totalScore != null ? 'reviewed' : 'pending_review', gradedAt: Date.now()
          });
          graded++;
        });
        await batch.commit();
      }
    }
    if(typeof loadQuizSubmissions === 'function') await loadQuizSubmissions();
    return { graded, missingKeys };
  } catch(err) {
    console.error("Auto grade error:", err);
    return { graded, missingKeys, error: err.message };
  }
}

async function deleteQuiz(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "quizzes", id));
    if(cache.quizzes) cache.quizzes = cache.quizzes.filter(x => x.id !== id);
    return true;
  } catch(err) {
    console.error("Delete quiz error:", err);
    return false;
  }
}

/*----- QUIZ SUBMISSIONS -----*/
async function loadQuizSubmissions() {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "quiz_submissions"), orderBy("submittedAt", "desc")));
    cache.quizSubmissions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.quizSubmissions;
  } catch(err) {
    console.error("Load quiz submissions error:", err);
    cache.quizSubmissions = cache.quizSubmissions || [];
    return cache.quizSubmissions;
  }
}
function getQuizSubmissions() { return cache.quizSubmissions || []; }

// Auto-scores MCQ questions, saves submission. status = 'reviewed' if the quiz
// has no short-answer questions (fully auto-graded), else 'pending_review'.
async function addQuizSubmission(sub, quiz) {
  await waitForFirebase();
  const { doc, getDoc, setDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const id = qzMakeSubId(quiz.id, sub.email);

    const existing = await getDoc(doc(db, "quiz_submissions", id)).catch(() => null);
    if (existing && existing.exists()) {
      markLocalQuizAttempt(quiz.id);
      return { success: false, error: "You have already submitted this exam.", alreadySubmitted: true };
    }

    if(quiz.secure) {
      // the answer key is private: only record what was answered, an admin grades it later
      const qs = quiz.questions || [];
      sub.mcqScore = null;
      sub.mcqTotal = qs.filter(q => q.type === 'mcq').reduce((x, q) => x + (Number(q.points) || 1), 0);
      sub.shortScore = null;
      sub.shortTotal = qs.filter(q => q.type === 'short').reduce((x, q) => x + (Number(q.points) || 1), 0);
      sub.totalScore = null;
      sub.totalPossible = sub.mcqTotal + sub.shortTotal;
      sub.status = 'pending_grading';
      sub.secure = true;
    } else {
      let mcqScore = 0, mcqTotal = 0, hasShort = false;
      (quiz.questions || []).forEach(q => {
        if(q.type === 'mcq') {
          mcqTotal += Number(q.points) || 1;
          const given = sub.answers[q.id];
          if(given !== undefined && Number(given) === Number(q.correctIndex)) {
            mcqScore += Number(q.points) || 1;
          }
        } else {
          hasShort = true;
        }
      });

      sub.mcqScore = mcqScore;
      sub.mcqTotal = mcqTotal;
      sub.shortScore = null;
      sub.shortTotal = (quiz.questions || []).filter(q => q.type === 'short').reduce((a,q) => a + (Number(q.points)||1), 0);
      sub.totalScore = hasShort ? null : mcqScore;
      sub.totalPossible = mcqTotal + sub.shortTotal;
      sub.status = hasShort ? 'pending_review' : 'reviewed';
    }
    sub.submittedAt = Date.now();
    sub.startedAt = sub.startedAt || null;
    sub.timeTakenSeconds = sub.startedAt ? Math.max(0, Math.round((sub.submittedAt - sub.startedAt) / 1000)) : null;

    await setDoc(doc(db, "quiz_submissions", id), sub);
    if(!cache.quizSubmissions) cache.quizSubmissions = [];
    cache.quizSubmissions.unshift({ id, ...sub });
    markLocalQuizAttempt(quiz.id);
    return { success: true, id, result: sub };
  } catch(err) {
    if(err && err.code === 'permission-denied') {
      // A second submit for the same quiz+email is refused by the security rules.
      markLocalQuizAttempt(quiz.id);
      return { success: false, error: "You have already submitted this exam.", alreadySubmitted: true };
    }
    console.error("Add quiz submission error:", err);
    return { success: false, error: err.message };
  }
}

// Admin scores the short-answer part; combines with the auto MCQ score.
async function gradeQuizSubmission(id, shortScore) {
  await waitForFirebase();
  const { doc, updateDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const sub = (cache.quizSubmissions || []).find(x => x.id === id);
    if(!sub) return { success: false, error: "Submission not found" };
    const totalScore = (sub.mcqScore || 0) + Number(shortScore);
    const update = { shortScore: Number(shortScore), totalScore, status: 'reviewed', reviewedAt: Date.now() };
    await updateDoc(doc(db, "quiz_submissions", id), update);
    Object.assign(sub, update);
    return { success: true };
  } catch(err) {
    console.error("Grade quiz submission error:", err);
    return { success: false, error: err.message };
  }
}

async function deleteQuizSubmission(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "quiz_submissions", id));
    if(cache.quizSubmissions) cache.quizSubmissions = cache.quizSubmissions.filter(x => x.id !== id);
    return true;
  } catch(err) {
    console.error("Delete quiz submission error:", err);
    return false;
  }
}

/*===== ELECTION / VOTING SYSTEM =====*/
// NOTE ON PRIVACY: "who voted" (election_voters) and "who a vote was cast
// for" (election_votes) are ALWAYS written as two separate, unlinked
// records. election_votes documents never contain any voter name/email/
// phone, and election_voters documents never contain any candidate
// choice. This is what makes the ballot secret even from EC admins.

/*----- Candidates -----*/
async function loadElectionCandidates() {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "election_candidates"), orderBy("createdAt", "desc")));
    cache.electionCandidates = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.electionCandidates;
  } catch(err) {
    console.error("Load candidates error:", err);
    cache.electionCandidates = cache.electionCandidates || [];
    return cache.electionCandidates;
  }
}
function getElectionCandidates() { return cache.electionCandidates || []; }

async function addElectionCandidate(c) {
  await waitForFirebase();
  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    c.createdAt = Date.now();
    const ref = await addDoc(collection(db, "election_candidates"), c);
    if(!cache.electionCandidates) cache.electionCandidates = [];
    cache.electionCandidates.unshift({ id: ref.id, ...c });
    return true;
  } catch(err) {
    console.error("Add candidate error:", err);
    return false;
  }
}

async function updateElectionCandidate(id, c) {
  await waitForFirebase();
  const { doc, updateDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await updateDoc(doc(db, "election_candidates", id), c);
    if(cache.electionCandidates) {
      const idx = cache.electionCandidates.findIndex(x => x.id === id);
      if(idx > -1) cache.electionCandidates[idx] = { id, ...c };
    }
    return true;
  } catch(err) {
    console.error("Update candidate error:", err);
    return false;
  }
}

async function deleteElectionCandidate(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "election_candidates", id));
    if(cache.electionCandidates) cache.electionCandidates = cache.electionCandidates.filter(x => x.id !== id);
    return true;
  } catch(err) {
    console.error("Delete candidate error:", err);
    return false;
  }
}

/*----- Settings -----*/
async function getElectionSettings() {
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDoc(doc(db, "settings", "election"));
    if(snap.exists()) return snap.data();
    return { active:false, title:"Committee Election", description:"", startAt:null, endAt:null, electionId:null };
  } catch(err) {
    console.error("Get election settings error:", err);
    return { active:false, title:"Committee Election", description:"", startAt:null, endAt:null, electionId:null };
  }
}

async function updateElectionSettings(data) {
  await waitForFirebase();
  const { doc, setDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await setDoc(doc(db, "settings", "election"), data);
    return true;
  } catch(err) {
    console.error("Update election settings error:", err);
    return false;
  }
}

// Is voting currently open, based on the active flag + optional schedule?
function getElectionAvailability(settings) {
  const now = Date.now();
  if(!settings || !settings.active) return { open:false, reason:'inactive' };
  if(settings.startAt && now < settings.startAt) return { open:false, reason:'not_started', at:settings.startAt };
  if(settings.endAt && now > settings.endAt) return { open:false, reason:'ended', at:settings.endAt };
  return { open:true, reason:'ok' };
}

/*----- Voter de-duplication (attendance only, never tied to a choice) -----*/
function evMakeVoterId(electionId, email) {
  const clean = (email || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '') || 'noemail';
  return `${electionId || 'default'}__${clean}`;
}
function hasLocalVoteAttempt(electionId) {
  try { return !!localStorage.getItem('tvbd_election_voted_' + (electionId || 'default')); } catch(e) { return false; }
}
function markLocalVoteAttempt(electionId) {
  try { localStorage.setItem('tvbd_election_voted_' + (electionId || 'default'), String(Date.now())); } catch(e) {}
}
async function hasAlreadyVoted(electionId, email) {
  if(hasLocalVoteAttempt(electionId)) return true;
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const id = evMakeVoterId(electionId, email);
    const d = await getDoc(doc(db, "election_voters", id));
    return d.exists();
  } catch(err) {
    return false;
  }
}

// Casts a secret ballot.
// selections: [{ position, candidateId }] — candidateId is null/empty for
// a deliberate abstain on that position.
// Writes the anonymous vote documents FIRST (carrying no voter info at
// all), then a separate attendance record (carrying no candidate choice)
// so the two can never be joined back together.
async function submitVote(electionId, voter, selections) {
  await waitForFirebase();
  const { doc, getDoc, collection, writeBatch } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const voterId = evMakeVoterId(electionId, voter.email);
    const existing = await getDoc(doc(db, "election_voters", voterId)).catch(() => null);
    if(existing && existing.exists()) {
      markLocalVoteAttempt(electionId);
      return { success:false, alreadyVoted:true, error:"You have already voted." };
    }

    // One atomic batch: the attendance record and every anonymous ballot are
    // saved together, or not at all. If this person already voted, the rules
    // reject the attendance record and the whole batch fails, so no extra
    // votes are ever counted.
    const batch = writeBatch(db);
    batch.set(doc(db, "election_voters", voterId), {
      electionId: electionId || 'default',
      name: voter.name, email: voter.email, phone: voter.phone, votedAt: Date.now()
    });
    for(const sel of selections) {
      batch.set(doc(collection(db, "election_votes")), {
        electionId: electionId || 'default',
        position: sel.position,
        candidateId: sel.candidateId || null,
        abstain: !sel.candidateId,
        castAt: Date.now()
      });
    }
    try {
      await batch.commit();
    } catch(err) {
      if(err && err.code === 'permission-denied') {
        markLocalVoteAttempt(electionId);
        return { success:false, alreadyVoted:true, error:"You have already voted." };
      }
      throw err;
    }

    markLocalVoteAttempt(electionId);
    return { success:true };
  } catch(err) {
    console.error("Submit vote error:", err);
    return { success:false, error: err.message };
  }
}

/*----- EC-only: results & turnout -----*/
async function loadElectionVotes() {
  await waitForFirebase();
  const { collection, getDocs } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(collection(db, "election_votes"));
    cache.electionVotes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.electionVotes;
  } catch(err) {
    console.error("Load election votes error:", err);
    cache.electionVotes = cache.electionVotes || [];
    return cache.electionVotes;
  }
}
function getElectionVotes() { return cache.electionVotes || []; }

async function loadElectionVoters() {
  await waitForFirebase();
  const { collection, getDocs } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(collection(db, "election_voters"));
    cache.electionVoters = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.electionVoters;
  } catch(err) {
    console.error("Load election voters error:", err);
    cache.electionVoters = cache.electionVoters || [];
    return cache.electionVoters;
  }
}
function getElectionVoters() { return cache.electionVoters || []; }

/*===== CUSTOM FORMS (Google-Forms-style builder) =====*/
// Separate from the quiz system — no scoring, no correct answers, just
// arbitrary fields that collect free-form responses. Used by the standalone
// form-admin.html panel and filled in by the public via form.html.

async function loadCustomForms() {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "custom_forms"), orderBy("createdAt", "desc")));
    cache.customForms = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.customForms;
  } catch(err) {
    console.error("Load custom forms error:", err);
    cache.customForms = cache.customForms || [];
    return cache.customForms;
  }
}
function getCustomForms() { return cache.customForms || []; }
function getPublishedCustomForms() { return (cache.customForms || []).filter(f => f.status === 'published'); }

async function getCustomFormById(id) {
  if(cache.customForms) {
    const found = cache.customForms.find(f => f.id === id);
    if(found) return found;
  }
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const d = await getDoc(doc(db, "custom_forms", id));
    if(d.exists()) return { id: d.id, ...d.data() };
    return null;
  } catch(err) {
    console.error("Get custom form error:", err);
    return null;
  }
}

async function addCustomForm(form) {
  await waitForFirebase();
  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    form.createdAt = Date.now();
    const ref = await addDoc(collection(db, "custom_forms"), form);
    if(!cache.customForms) cache.customForms = [];
    cache.customForms.unshift({ id: ref.id, ...form });
    return { success: true, id: ref.id };
  } catch(err) {
    console.error("Add custom form error:", err);
    return { success: false, error: err.message };
  }
}

async function updateCustomForm(id, form) {
  await waitForFirebase();
  const { doc, updateDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    form.updatedAt = Date.now();
    await updateDoc(doc(db, "custom_forms", id), form);
    if(cache.customForms) {
      const idx = cache.customForms.findIndex(x => x.id === id);
      if(idx > -1) cache.customForms[idx] = { id, ...cache.customForms[idx], ...form };
    }
    return { success: true };
  } catch(err) {
    console.error("Update custom form error:", err);
    return { success: false, error: err.message };
  }
}

async function deleteCustomForm(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "custom_forms", id));
    if(cache.customForms) cache.customForms = cache.customForms.filter(x => x.id !== id);
    return true;
  } catch(err) {
    console.error("Delete custom form error:", err);
    return false;
  }
}

/*----- FORM RESPONSES -----*/
async function loadFormResponses(formId) {
  await waitForFirebase();
  const { collection, getDocs, query, where } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "form_responses"), where("formId", "==", formId)));
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    list.sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));
    if(!cache.formResponses) cache.formResponses = {};
    cache.formResponses[formId] = list;
    return list;
  } catch(err) {
    console.error("Load form responses error:", err);
    return (cache.formResponses && cache.formResponses[formId]) || [];
  }
}
function getFormResponses(formId) { return (cache.formResponses && cache.formResponses[formId]) || []; }

async function addFormResponse(resp) {
  await waitForFirebase();
  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    resp.submittedAt = Date.now();
    const ref = await addDoc(collection(db, "form_responses"), resp);
    return { success: true, id: ref.id };
  } catch(err) {
    console.error("Add form response error:", err);
    return { success: false, error: err.message };
  }
}

async function deleteFormResponse(formId, id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await deleteDoc(doc(db, "form_responses", id));
    if(cache.formResponses && cache.formResponses[formId]) {
      cache.formResponses[formId] = cache.formResponses[formId].filter(x => x.id !== id);
    }
    return true;
  } catch(err) {
    console.error("Delete form response error:", err);
    return false;
  }
}

// Works out whether a custom form is currently open to the public, based on
// its status plus the optional startAt / endAt schedule (epoch ms).
// Returns one of: 'draft' | 'scheduled' | 'open' | 'closed'
function getFormAvailability(form, now) {
  now = now || Date.now();
  if(!form || form.status !== 'published') return { state: 'draft' };
  if(form.startAt && now < form.startAt) return { state: 'scheduled', startAt: form.startAt, endAt: form.endAt || null };
  if(form.endAt && now > form.endAt) return { state: 'closed', startAt: form.startAt || null, endAt: form.endAt };
  return { state: 'open', startAt: form.startAt || null, endAt: form.endAt || null };
}

/*===== FOUNDER'S MESSAGE SETTINGS =====*/
async function getFounderSettings() {
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  const defaults = { enabled: false, name: '', title: '', bio: '', photo: '', facebook: '', linkedin: '' };
  try {
    const snap = await getDoc(doc(db, "settings", "founder"));
    if(snap.exists()) return { ...defaults, ...snap.data() };
    return defaults;
  } catch(err) {
    console.error("Get founder settings error:", err);
    return defaults;
  }
}

async function updateFounderSettings(data) {
  await waitForFirebase();
  const { doc, setDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await setDoc(doc(db, "settings", "founder"), data);
    return true;
  } catch(err) {
    console.error("Update founder settings error:", err);
    return false;
  }
}

/*===== REGISTERED USERS (mirror of account.html sign-ups, for the admin panel) =====*/
// The real source of truth is Firebase Authentication → Users (client-side code
// can't list all Auth users — that needs the Admin SDK). This Firestore mirror
// just lets the admin panel show a simple sign-up list without extra tooling.
async function saveRegisteredUser(uid, data) {
  await waitForFirebase();
  const { doc, setDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    await setDoc(doc(db, "registered_users", uid), data, { merge: true });
    return true;
  } catch(err) {
    console.error("Save registered user error:", err);
    return false;
  }
}

async function loadRegisteredUsers() {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "registered_users"), orderBy("createdAt", "desc")));
    cache.registeredUsers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.registeredUsers;
  } catch(err) {
    console.error("Load registered users error:", err);
    cache.registeredUsers = cache.registeredUsers || [];
    return cache.registeredUsers;
  }
}
function getRegisteredUsers() { return cache.registeredUsers || []; }

// A signed-in participant's own event registrations (used to gate quizzes).
async function getMyRegistrations(email) {
  await waitForFirebase();
  const { collection, getDocs, query, where } = window.firebaseFunctions;
  try {
    const snap = await getDocs(query(collection(window.firebaseDB, "registrations"), where("email", "==", email)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(err) {
    console.error("Get my registrations error:", err);
    return [];
  }
}

/*===== MEMBER ID (unique code per account) + MEMBER ACCESS =====
   Every account gets a short unique Member ID like TV-7K3M9Q. The code is
   "claimed" in member_codes/{code} (create-only, so it can never be reused or
   changed). Admin can look a person up by that code and grant access to chosen
   pages. Permissions live in member_access/{uid}, which only the main admin
   can write (a user can never edit their own access). */
async function claimMemberCode(uid) {
  await waitForFirebase();
  const { doc, setDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for(let attempt = 0; attempt < 10; attempt++) {
    const arr = new Uint32Array(6);
    crypto.getRandomValues(arr);
    let part = '';
    arr.forEach(n => { part += alphabet[n % alphabet.length]; });
    const code = 'TV-' + part;
    try {
      await setDoc(doc(db, "member_codes", code), { uid, createdAt: Date.now() });
      return code;
    } catch(err) {
      if(err && err.code === 'permission-denied') continue;   // code already taken, try another
      console.error("Claim member code error:", err);
      return null;
    }
  }
  return null;
}

async function ensureMemberCode(uid, profile) {
  if(profile && profile.memberCode) return profile.memberCode;
  const code = await claimMemberCode(uid);
  if(code) await saveRegisteredUser(uid, { memberCode: code });
  return code;
}

// A signed-in person reads their own access (used by the dashboard + admin login)
async function getMyAccess(uid) {
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  try {
    const snap = await getDoc(doc(window.firebaseDB, "member_access", uid));
    return snap.exists() ? snap.data() : null;
  } catch(err) { return null; }
}

// Admin only
async function loadAllMemberAccess() {
  await waitForFirebase();
  const { collection, getDocs } = window.firebaseFunctions;
  try {
    const snap = await getDocs(collection(window.firebaseDB, "member_access"));
    const map = {};
    snap.docs.forEach(d => { map[d.id] = d.data(); });
    cache.memberAccess = map;
  } catch(err) {
    console.error("Load member access error:", err);
    cache.memberAccess = cache.memberAccess || {};
  }
  return cache.memberAccess;
}
function getMemberAccessMap() { return cache.memberAccess || {}; }

async function saveMemberAccess(uid, data) {
  await waitForFirebase();
  const { doc, setDoc } = window.firebaseFunctions;
  try {
    await setDoc(doc(window.firebaseDB, "member_access", uid), data);
    cache.memberAccess = cache.memberAccess || {};
    cache.memberAccess[uid] = data;
    return true;
  } catch(err) { console.error("Save member access error:", err); return false; }
}

async function removeMemberAccess(uid) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  try {
    await deleteDoc(doc(window.firebaseDB, "member_access", uid));
    if(cache.memberAccess) delete cache.memberAccess[uid];
    return true;
  } catch(err) { console.error("Remove member access error:", err); return false; }
}

async function getUidByMemberCode(code) {
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  try {
    const snap = await getDoc(doc(window.firebaseDB, "member_codes", code));
    return snap.exists() ? snap.data().uid : null;
  } catch(err) { console.error("Lookup member code error:", err); return null; }
}

// Single-user fetch for the participant's own Profile page (dashboard.html) —
// doesn't rely on the admin list being loaded/cached.
async function getRegisteredUserById(uid) {
  await waitForFirebase();
  const { doc, getDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDoc(doc(db, "registered_users", uid));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("Get registered user error:", err);
    return null;
  }
}

/*===== DASHBOARD ANNOUNCEMENTS (bell icon) =====*/

async function addAnnouncement(title, message) {
  await waitForFirebase();
  const { collection, addDoc } = window.firebaseFunctions;
  try {
    await addDoc(collection(window.firebaseDB, "announcements"), { title, message, createdAt: Date.now() });
    return true;
  } catch(err) {
    console.error("Add announcement error:", err);
    return false;
  }
}

async function loadAnnouncements() {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy, limit } = window.firebaseFunctions;
  try {
    const snap = await getDocs(query(collection(window.firebaseDB, "announcements"), orderBy("createdAt", "desc"), limit(20)));
    cache.announcements = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch(err) {
    console.error("Load announcements error:", err);
    cache.announcements = cache.announcements || [];
  }
  return cache.announcements;
}

async function deleteAnnouncement(id) {
  await waitForFirebase();
  const { doc, deleteDoc } = window.firebaseFunctions;
  try { await deleteDoc(doc(window.firebaseDB, "announcements", id)); return true; }
  catch(err) { console.error("Delete announcement error:", err); return false; }
}

function getAnnouncements() { return cache.announcements || []; }

/*===== EMAIL NOTIFICATION CAMPAIGNS =====*/

async function addNotificationRecord(rec) {
  await waitForFirebase();
  const { collection, addDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    rec.sentAt = Date.now();
    await addDoc(collection(db, "notification_campaigns"), rec);
    return true;
  } catch(err) {
    console.error("Add notification record error:", err);
    return false;
  }
}

async function loadNotificationHistory() {
  await waitForFirebase();
  const { collection, getDocs, query, orderBy } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    const snap = await getDocs(query(collection(db, "notification_campaigns"), orderBy("sentAt", "desc")));
    cache.notificationHistory = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return cache.notificationHistory;
  } catch(err) {
    console.error("Load notification history error:", err);
    cache.notificationHistory = cache.notificationHistory || [];
    return cache.notificationHistory;
  }
}
function getNotificationHistory() { return cache.notificationHistory || []; }

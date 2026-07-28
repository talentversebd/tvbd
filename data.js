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

/*===== REGISTRATIONS (Old form data - kept for backward compatibility) =====*/
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
    
    cert.createdAt = Date.now();
    cert.status = "Verified";
    const ref = await addDoc(collection(db, "certificates"), cert);
    
    if(!cache.certificates) cache.certificates = [];
    cache.certificates.unshift({ id: ref.id, ...cert });
    
    return { success: true, id: ref.id };
  } catch(err) {
    console.error("Add certificate error:", err);
    return { success: false, error: err.message };
  }
}

// Update certificate
async function updateCertificate(id, cert) {
  await waitForFirebase();
  const { doc, updateDoc } = window.firebaseFunctions;
  const db = window.firebaseDB;
  try {
    cert.updatedAt = Date.now();
    await updateDoc(doc(db, "certificates", id), cert);
    
    if(cache.certificates) {
      const idx = cache.certificates.findIndex(x => x.id === id);
      if(idx > -1) cache.certificates[idx] = { id, ...cert };
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
    if(cache.certificates) {
      cache.certificates = cache.certificates.filter(x => x.id !== id);
    }
    return true;
  } catch(err) {
    console.error("Delete certificate error:", err);
    return false;
  }
}

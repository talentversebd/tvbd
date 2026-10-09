import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, query, orderBy, where, onSnapshot, writeBatch, limit, deleteField, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1VAUyNGYE7XpgLRN6-xeAI5QMjN-Q_Lk",
  authDomain: "talentverse-bd.firebaseapp.com",
  projectId: "talentverse-bd",
  storageBucket: "talentverse-bd.firebasestorage.app",
  messagingSenderId: "926824145286",
  appId: "1:926824145286:web:1d3a8558aeefe42c4f4c07"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Set these up FIRST — every page's data (team, quiz, news, etc.) depends only
// on Firestore, so it must never be blocked by anything Auth-related below.
window.firebaseDB = db;
window.firebaseFunctions = {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, query, orderBy, where, onSnapshot, writeBatch, limit, deleteField, increment
};

// Participant account system (separate from the admin panel's own hardcoded
// login — this is real Firebase Auth, used only by account.html/dashboard.html).
// Wrapped in try/catch so that if Auth ever fails to initialize, it can't take
// down Firestore (and therefore the whole rest of the site) with it.
try {
  const auth = getAuth(app);
  window.firebaseAuth = auth;
  window.firebaseAuthFunctions = {
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
    onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail
  };
} catch(err) {
  console.error("Firebase Auth init failed (Firestore still works):", err);
}

window.IMGBB_KEY = "b374ae6a3edcf12a90a5b7be9ec39f50";

window.EMAILJS_CONFIG = {
  serviceId: "service_5d6f3df",
  templateId: "template_7dgcsgw"   // "Contact Us" template — admin-notification emails (contact form, registration alerts), always sends to the fixed admin inbox set inside this template
};

// Google Apps Script web app — sends bulk "Email Notifications" (new event /
// results / exam reminder announcements) straight from the admin's own Gmail,
// instead of EmailJS. Access is checked inside Code.gs through the admin's Firebase login (no shared key).
window.NOTIFY_MAILER = {
  // Only the web-app address. There is NO secret key here any more: the Apps Script (Code.gs)
  // checks the admin's Firebase login token and only sends mail for the allowed admin account.
  scriptUrl: "https://script.google.com/macros/s/AKfycbyzhCAQBmj4287xiykwDBjyTO1a1gd04zlY5t6mSL8p9rvUNzMJdroQXdiYzmyVTM-j1Q/exec"
};

console.log("🔥 Firebase Initialized (Firestore + Auth)!");

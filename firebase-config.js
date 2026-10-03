import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, query, orderBy, where, onSnapshot, writeBatch, limit, deleteField } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, query, orderBy, where, onSnapshot, writeBatch, limit, deleteField
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
  templateId: "template_gylaytb",
  publicKey: "oUx7nluCmNJyGq1L30cFJ"
};

console.log("🔥 Firebase Initialized (Firestore + Auth)!");

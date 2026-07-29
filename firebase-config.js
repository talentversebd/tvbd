import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

window.firebaseDB = db;
window.firebaseFunctions = {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, query, orderBy, onSnapshot
};

window.IMGBB_KEY = "b374ae6a3edcf12a90a5b7be9ec39f50";

window.EMAILJS_CONFIG = {
  serviceId: "service_5d6f3df",
  templateId: "template_gylaytb",
  publicKey: "oUx7nluCmNJyGq1L30cFJ"
};

console.log("🔥 Firebase Initialized (No Auth)!");

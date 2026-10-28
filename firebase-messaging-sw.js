/* TalentVerse push notifications (Firebase Cloud Messaging) — separate from sw.js so the offline cache is untouched. */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: "AIzaSyA1VAUyNGYE7XpgLRN6-xeAI5QMjN-Q_Lk",
  authDomain: "talentverse-bd.firebaseapp.com",
  projectId: "talentverse-bd",
  storageBucket: "talentverse-bd.firebasestorage.app",
  messagingSenderId: "926824145286",
  appId: "1:926824145286:web:1d3a8558aeefe42c4f4c07"
});
const messaging = firebase.messaging();
// Messages sent from the Firebase console carry a "notification" block and are shown automatically.
// Data-only messages (title/body/link inside data) are shown here.
messaging.onBackgroundMessage(function (p) {
  if (p.notification) return;
  const d = p.data || {};
  self.registration.showNotification(d.title || 'TalentVerse Bangladesh', {
    body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', data: { link: d.link || './' }
  });
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  const d = e.notification.data || {};
  const link = (d.FCM_MSG && d.FCM_MSG.notification && d.FCM_MSG.notification.click_action) || d.link || (d.FCM_MSG && d.FCM_MSG.data && d.FCM_MSG.data.link) || './';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (const c of list) { if ('focus' in c) { c.navigate(link).catch(function(){}); return c.focus(); } }
    return clients.openWindow(link);
  }));
});

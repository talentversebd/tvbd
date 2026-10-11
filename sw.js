// TalentVerse PWA service worker (v1)
const CACHE='tvbd-shell-v2';
const SHELL=['./','index.html','style.css','logo.jpg','icon-192.png','offline.html'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin)return; // Firebase, ImgBB, EmailJS etc. go straight to network
  if(/firebase-config\.js$/.test(u.pathname))return;
  // network-first: always fresh when online, cached copy when offline
  e.respondWith(fetch(new Request(r,{cache:'no-cache'})).then(res=>{
    if(res&&res.ok&&res.type==='basic'){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('offline.html'):undefined))));
});

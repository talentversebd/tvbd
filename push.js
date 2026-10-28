/* Push notifications: members opt in from their dashboard; tokens saved to usr_push/{uid}. */
(function(){
 try{
  var V='10.7.1',CDN='https://www.gstatic.com/firebasejs/'+V+'/';
  var supported='Notification' in window&&'serviceWorker' in navigator&&'PushManager' in window;
  var user=null,vapid=null,busy=false;
  function db(){return window.firebaseDB}
  function F(){return window.firebaseFunctions}
  async function getVapid(){
   if(vapid!==null)return vapid;
   try{var s=await F().getDoc(F().doc(db(),'settings','push'));vapid=(s.exists()&&s.data().vapidKey)||''}catch(e){vapid=''}
   return vapid;
  }
  async function messagingObj(){
   var app=(await import(CDN+'firebase-app.js')).getApp();
   var m=await import(CDN+'firebase-messaging.js');
   return {m:m,msg:m.getMessaging(app)};
  }
  async function swReg(){
   return navigator.serviceWorker.register('firebase-messaging-sw.js',{scope:'firebase-cloud-messaging-push-scope'});
  }
  async function enable(){
   if(busy)return {ok:false,why:'busy'};busy=true;
   try{
    if(!supported)return {ok:false,why:'unsupported'};
    var key=await getVapid();if(!key)return {ok:false,why:'nokey'};
    if(!user)return {ok:false,why:'login'};
    var perm=await Notification.requestPermission();
    if(perm!=='granted')return {ok:false,why:perm};
    var o=await messagingObj(),reg=await swReg();
    var token=await o.m.getToken(o.msg,{vapidKey:key,serviceWorkerRegistration:reg});
    if(!token)return {ok:false,why:'notoken'};
    await F().setDoc(F().doc(db(),'usr_push',user.uid),{uid:user.uid,token:token,at:Date.now(),ua:(navigator.userAgent||'').slice(0,140)});
    try{o.m.onMessage(o.msg,function(p){var n=p.notification||p.data||{};reg.showNotification(n.title||'TalentVerse Bangladesh',{body:n.body||'',icon:'icon-192.png'})})}catch(e){}
    localStorage.setItem('tvbd_push','1');
    return {ok:true};
   }catch(e){console.error('push enable',e);return {ok:false,why:'error'}}
   finally{busy=false}
  }
  async function disable(){
   try{
    var o=await messagingObj();
    try{await o.m.deleteToken(o.msg)}catch(e){}
    if(user)await F().deleteDoc(F().doc(db(),'usr_push',user.uid));
    localStorage.removeItem('tvbd_push');
    return true;
   }catch(e){return false}
  }
  window.tvbdPush={supported:supported,enable:enable,disable:disable,getVapid:getVapid,
   state:function(){return !supported?'unsupported':Notification.permission==='denied'?'denied':(Notification.permission==='granted'&&localStorage.getItem('tvbd_push')==='1')?'on':'off'}};
  /* dashboard card */
  var T={en:{h:'🔔 Notifications',on:'You will get alerts about new events and challenges.',off:'Get an alert on your phone when a new event or challenge is posted.',btnOn:'Turn off',btnOff:'Turn on',denied:'Notifications are blocked in your browser settings. Allow them for this site to turn this on.',unsup:'This browser does not support notifications. (On iPhone, add the site to Home Screen first.)',nokey:'Notifications are not set up yet.',fail:'Could not turn on. Please try again.'},
   bn:{h:'🔔 নোটিফিকেশন',on:'নতুন ইভেন্ট ও চ্যালেঞ্জের খবর আপনি ফোনে পাবেন।',off:'নতুন ইভেন্ট বা চ্যালেঞ্জ এলে ফোনে খবর পেতে চালু করুন।',btnOn:'বন্ধ করুন',btnOff:'চালু করুন',denied:'আপনার ব্রাউজারে এই সাইটের নোটিফিকেশন বন্ধ করা আছে। সেটিং থেকে অনুমতি দিন।',unsup:'এই ব্রাউজারে নোটিফিকেশন চলে না। (আইফোনে আগে সাইটটি Home Screen-এ যোগ করুন।)',nokey:'নোটিফিকেশন এখনো চালু করা হয়নি।',fail:'চালু করা গেল না। আবার চেষ্টা করুন।'}};
  function lang(){try{return(typeof getLang==='function'?getLang():localStorage.getItem('tvbd_lang'))==='bn'?'bn':'en'}catch(e){return'en'}}
  async function card(){
   var box=document.getElementById('db-push');if(!box)return;
   var t=T[lang()],st=window.tvbdPush.state(),key=await getVapid(),msg='',btn='';
   if(!key)msg=t.nokey;
   else if(st==='unsupported')msg=t.unsup;
   else if(st==='denied')msg=t.denied;
   else if(st==='on'){msg=t.on;btn='<button class="btn-out" id="db-push-btn" style="padding:8px 16px;font-size:.82rem;">'+t.btnOn+'</button>'}
   else{msg=t.off;btn='<button class="btn-pri" id="db-push-btn" style="padding:8px 18px;font-size:.82rem;">'+t.btnOff+'</button>'}
   box.innerHTML='<div style="background:var(--card);border:1px solid var(--bdr);border-radius:14px;padding:14px 16px;margin:14px 0;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;"><div style="min-width:200px;flex:1;"><div style="font-weight:800;margin-bottom:3px;">'+t.h+'</div><div style="font-size:.84rem;color:var(--muted);line-height:1.6;">'+msg+'</div></div>'+btn+'</div>';
   var b=document.getElementById('db-push-btn');
   if(b)b.onclick=async function(){
    b.disabled=true;
    if(st==='on'){await disable()}
    else{var r=await enable();if(!r.ok&&r.why!=='default'){var m=box.querySelector('div div:nth-child(2)');if(m)m.textContent=r.why==='denied'?t.denied:r.why==='nokey'?t.nokey:t.fail}}
    card();
   };
  }
  function start(){
   var A=window.firebaseAuthFunctions,au=window.firebaseAuth;
   if(!A||!au||!db()){setTimeout(start,400);return}
   A.onAuthStateChanged(au,async function(u){
    user=u||null;
    card();
    // keep a granted subscription fresh (tokens can rotate)
    if(user&&supported&&Notification.permission==='granted'&&localStorage.getItem('tvbd_push')==='1'){
     var key=await getVapid();
     if(key){try{var o=await messagingObj(),reg=await swReg();var tk=await o.m.getToken(o.msg,{vapidKey:key,serviceWorkerRegistration:reg});
      if(tk)await F().setDoc(F().doc(db(),'usr_push',user.uid),{uid:user.uid,token:tk,at:Date.now(),ua:(navigator.userAgent||'').slice(0,140)})}catch(e){}}
    }
   });
   var w=window.applyLanguage;if(typeof w==='function'&&!w.__push){var n=function(){w.apply(this,arguments);card()};n.__push=1;window.applyLanguage=n}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
 }catch(e){}
})();

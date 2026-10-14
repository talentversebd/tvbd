/* Mobile bottom navigation (phones only) */
(function(){
 try{
  var f=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(/^(admin|form-admin|election-admin|quiz|404|offline|google)/.test(f))return;
  if(!window.matchMedia('(max-width:768px)').matches&&!window.matchMedia('(display-mode:standalone)').matches)return;
  if(!document.getElementById('bnav-css')){var st=document.createElement('style');st.id='bnav-css';st.textContent='#bnav{display:none} @media(max-width:768px){ body.has-bnav #bnav{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:960;background:rgba(12,12,20,.92);backdrop-filter:blur(16px) saturate(1.4);-webkit-backdrop-filter:blur(16px) saturate(1.4);border-top:1px solid var(--bdr);padding:6px 6px calc(6px + env(safe-area-inset-bottom,0px));justify-content:space-around} #bnav a{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px;color:var(--muted);text-decoration:none;font-size:.66rem;font-weight:600;border-radius:12px;transition:color .2s,background .2s;-webkit-tap-highlight-color:transparent} #bnav a.on{color:var(--blue-br);background:rgba(59,130,246,.12)} #bnav a:active{transform:scale(.94)} body.has-bnav{padding-bottom:calc(68px + env(safe-area-inset-bottom,0px))} body.has-bnav .scroll-top-btn{bottom:calc(84px + env(safe-area-inset-bottom,0px))} body.has-bnav .lang-toggle-btn.lang-toggle-float{bottom:calc(80px + env(safe-area-inset-bottom,0px))!important} body.has-bnav .toast{bottom:calc(84px + env(safe-area-inset-bottom,0px))} }';(document.head||document.documentElement).appendChild(st);}
  var I={
   home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
   ev:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
   fo:'<path d="M4 5h16v11H9l-5 4z"/>',
   rs:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>',
   ac:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'};
  var items=[
   ['index.html','home','Home','হোম',['index.html','']],
   ['events.html','ev','Events','ইভেন্ট',['events.html','register.html','register-1.html','leaderboard.html']],
   ['forum.html','fo','Forum','ফোরাম',['forum.html','forum-post.html']],
   ['resources.html','rs','Resources','রিসোর্স',['resources.html','blog.html','blog-article.html']],
   ['account.html','ac','Account','অ্যাকাউন্ট',['account.html','dashboard.html']]];
  var nav=document.createElement('nav');nav.id='bnav';nav.setAttribute('aria-label','Main');
  function lang(){try{return localStorage.getItem('tvbd_lang')==='bn'?3:2}catch(e){return 2}}
  function draw(){
   var li=lang();
   nav.innerHTML=items.map(function(it){
    return '<a href="'+it[0]+'"'+(it[4].indexOf(f)>=0?' class="on" aria-current="page"':'')+'><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+I[it[1]]+'</svg><span>'+it[li]+'</span></a>';
   }).join('');
  }
  draw();
  function mount(){document.body.appendChild(nav);document.body.classList.add('has-bnav')}
  if(document.body)mount();else document.addEventListener('DOMContentLoaded',mount);
  document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('.lang-toggle-btn'))setTimeout(draw,150)});
 }catch(e){}
})();

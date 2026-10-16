/* Scrolling notice bar (bell + marquee). Works with the existing #notice-bar markup on every page:
   the old code still sets #nb-text and toggles .show — this file only restyles it and makes it scroll.
   Several notices: separate them with " | " in Admin → Popup Notice → Notice Bar Text. */
(function(){
 try{
  var bar,text,track,built=false,clone;
  var css=document.createElement('style');
  css.textContent=
  '.notice-bar{height:38px;padding:0 12px 0 0 !important;gap:0 !important;justify-content:flex-start !important;text-align:left !important;overflow:hidden;'+
  'background:linear-gradient(90deg,#070d1c,#0d1a38) !important;border-bottom:1px solid rgba(59,130,246,.35);box-shadow:0 2px 14px rgba(37,99,235,.25) !important;font-weight:600;font-size:.84rem}'+
  '.notice-bar .nb-dot{display:none !important}'+
  '.notice-bar .nb-bell{flex:0 0 auto;display:flex;align-items:center;justify-content:center;width:42px;height:100%;color:#fbbf24;font-size:1rem;background:rgba(251,191,36,.08);border-right:1px solid rgba(255,255,255,.12);margin-right:12px}'+
  '.notice-bar .nb-bell span{display:inline-block;animation:nbRing 2.6s ease-in-out infinite;transform-origin:50% 0}'+
  '@keyframes nbRing{0%,60%,100%{transform:rotate(0)}66%{transform:rotate(14deg)}72%{transform:rotate(-12deg)}78%{transform:rotate(8deg)}84%{transform:rotate(-5deg)}}'+
  '.notice-bar .nb-view{flex:1 1 auto;min-width:0;overflow:hidden;white-space:nowrap;position:relative;'+
  '-webkit-mask-image:linear-gradient(90deg,transparent,#000 22px,#000 calc(100% - 22px),transparent);mask-image:linear-gradient(90deg,transparent,#000 22px,#000 calc(100% - 22px),transparent)}'+
  '.notice-bar .nb-track{display:inline-flex;white-space:nowrap;will-change:transform;animation:nbScroll var(--nb-dur,22s) linear infinite}'+
  '.notice-bar:hover .nb-track,.notice-bar:active .nb-track{animation-play-state:paused}'+
  '.notice-bar .nb-track>span{padding-right:70px;color:#fff;line-height:38px}'+
  '@keyframes nbScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}'+
  '.notice-bar .nb-count{flex:0 0 auto;margin-left:10px;background:rgba(251,191,36,.16) !important;color:#fcd34d;border:1px solid rgba(251,191,36,.3)}'+
  '@media(max-width:600px){.notice-bar{height:34px;font-size:.78rem}.notice-bar .nb-bell{width:36px;margin-right:8px}.notice-bar .nb-track>span{line-height:34px}}'+
  '@media(prefers-reduced-motion:reduce){.notice-bar .nb-track{animation:none}.notice-bar .nb-view{overflow:auto}.notice-bar .nb-bell span{animation:none}}';
  document.head.appendChild(css);

  function sync(){
   if(!text||!clone)return;
   var t=(text.textContent||'').replace(/\s*\|\s*/g,'   •   ');
   if(text.getAttribute('data-nb')!==t){text.setAttribute('data-nb',t);}
   clone.textContent=text.textContent.replace(/\s*\|\s*/g,'   •   ');
   // display version of the original too (without breaking code that sets textContent)
   var len=Math.max(t.length,20);
   bar.style.setProperty('--nb-dur',Math.max(14,Math.round(len*0.28))+'s');
  }
  function build(){
   if(built)return;
   bar=document.getElementById('notice-bar');text=document.getElementById('nb-text');
   if(!bar||!text)return;
   var count=document.getElementById('nb-count');
   var bell=document.createElement('div');bell.className='nb-bell';bell.setAttribute('aria-hidden','true');bell.innerHTML='<span>🔔</span>';
   var view=document.createElement('div');view.className='nb-view';
   track=document.createElement('div');track.className='nb-track';
   clone=document.createElement('span');clone.setAttribute('aria-hidden','true');
   track.appendChild(text);track.appendChild(clone);view.appendChild(track);
   bar.insertBefore(bell,bar.firstChild);bar.insertBefore(view,count||null);
   built=true;
   // keep the " | " → bullet look on the real text as well
   new MutationObserver(function(){
     var raw=text.textContent;
     if(raw.indexOf('|')>-1){text.textContent=raw.replace(/\s*\|\s*/g,'   •   ');return;}
     sync();
   }).observe(text,{childList:true,characterData:true,subtree:true});
   var raw=text.textContent; if(raw.indexOf('|')>-1) text.textContent=raw.replace(/\s*\|\s*/g,'   •   ');
   sync();
  }
  function init(){build();if(!built){var n=0,t=setInterval(function(){build();if(built||++n>40)clearInterval(t);},250);}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 }catch(e){}
})();

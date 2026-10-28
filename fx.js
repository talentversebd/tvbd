(function(){
 try{
  var d=document,rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* scroll progress + header */
  var bar=d.createElement('div');bar.id='fx-progress';
  function mount(){d.body.appendChild(bar)}
  if(d.body)mount();else d.addEventListener('DOMContentLoaded',mount);
  var tick=false;
  function onScroll(){
   if(tick)return;tick=true;
   requestAnimationFrame(function(){
    tick=false;
    var h=d.documentElement,max=h.scrollHeight-h.clientHeight;
    bar.style.transform='scaleX('+(max>0?Math.min(1,(window.scrollY||h.scrollTop)/max):0)+')';
   });
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  if(rm||!('IntersectionObserver' in window))return;
  var SEL='.sec-hd,.explore-card,.o-card,.stat-card,.team-card,.news-card,.reg-card,.vt-card,.verify-card,.pf-card,.res-card,.post-card,.f-col,.founder-card,.h-stat,.vl-card,.af,.form-card,.c-info-item,.nm-card,.inv-card,.ch-card,.qz-card,.qz-card-lg,.fp-card,.fo-new-card,.rh-card,.ch-row';
  d.documentElement.classList.add('fx-ready');
  var io=new IntersectionObserver(function(es){
   es.forEach(function(e){
    if(!e.isIntersecting)return;
    var el=e.target;io.unobserve(el);
    el.classList.add('fx-in');
    setTimeout(function(){el.classList.remove('fx-rv','fx-in');el.style.removeProperty('--fx-i')},1400);
   });
  },{threshold:.08,rootMargin:'0px 0px -30px 0px'});
  function tag(root){
   var list=(root.querySelectorAll?root.querySelectorAll(SEL):[]);
   var groups=new Map();
   list.forEach(function(el){
    if(el.dataset.fx)return;
    el.dataset.fx='1';
    var r=el.getBoundingClientRect();
    if(r.top<window.innerHeight*0.6&&r.bottom>0&&window.scrollY<50&&el.closest('#hero'))return;
    var p=el.parentNode,i=groups.get(p)||0;groups.set(p,i+1);
    el.style.setProperty('--fx-i',Math.min(i,6));
    el.classList.add('fx-rv');io.observe(el);
   });
  }
  function run(){
   tag(d);
   new MutationObserver(function(ms){
    ms.forEach(function(m){m.addedNodes.forEach(function(n){
     if(n.nodeType!==1)return;
     if(n.matches&&n.matches(SEL)&&!n.dataset.fx){n.dataset.fx='1';n.classList.add('fx-rv');io.observe(n)}
     tag(n);
    })});
   }).observe(d.body,{childList:true,subtree:true});
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',run);else run();
  /* failsafe */
  setTimeout(function(){d.querySelectorAll('.fx-rv:not(.fx-in)').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<window.innerHeight)el.classList.add('fx-in')})},4000);
 }catch(e){}
})();

(function(){
 try{
  var d=document;
  /* tap ripple on buttons */
  d.addEventListener('pointerdown',function(e){
   var b=e.target.closest&&e.target.closest('.btn-pri,.btn-out,.save-btn,.add-btn');
   if(!b)return;
   var r=b.getBoundingClientRect(),s=Math.max(r.width,r.height)*2,el=d.createElement('span');
   el.className='fx-ripple';el.style.width=el.style.height=s+'px';
   el.style.left=(e.clientX-r.left-s/2)+'px';el.style.top=(e.clientY-r.top-s/2)+'px';
   b.appendChild(el);setTimeout(function(){el.remove()},650);
  },{passive:true});
  /* 3D tilt now lives in the v64 block below */
 }catch(e){}
})();

(function(){
 try{
  var d=document,rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(rm)return;
  /* count-up for big numbers when they scroll into view */
  function countUp(el){
   var t=(el.textContent||'').trim(),m=/^(\D*)(\d[\d,]*)(\D*)$/.exec(t);
   if(!m)return;
   var n=parseInt(m[2].replace(/,/g,''),10);if(!n||n>1e7)return;
   var comma=m[2].indexOf(',')>-1,start=null,dur=1100;
   function f(ts){
    if(el.textContent.trim()!==t&&start!==null&&el.dataset.fxc!=='1'){return}
    if(start===null)start=ts;
    var p=Math.min(1,(ts-start)/dur),e=1-Math.pow(1-p,3),v=Math.round(n*e);
    el.dataset.fxc='1';
    el.textContent=m[1]+(comma?v.toLocaleString('en-US'):v)+m[3];
    if(p<1)requestAnimationFrame(f);else{el.textContent=t;el.dataset.fxc=''}
   }
   requestAnimationFrame(f);
  }
  if('IntersectionObserver' in window){
   var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){cio.unobserve(e.target);countUp(e.target)}})},{threshold:.6});
   var go=function(){d.querySelectorAll('.h-stat .num,.stat-card .num,.stat-num').forEach(function(el){if(!el.dataset.fxn){el.dataset.fxn='1';cio.observe(el)}})};
   /* start only after the opening loader/intro has gone */
   var whenReady=function(fn){
    var L=d.getElementById('tvbd-loader');
    var gone=function(){return !L||L.classList.contains('tvbd-hide')||!L.isConnected||getComputedStyle(L).visibility==='hidden'||getComputedStyle(L).display==='none'};
    if(gone()){fn();return}
    var done=false,fin=function(){if(done)return;done=true;setTimeout(fn,250)};
    new MutationObserver(function(){if(gone())fin()}).observe(L,{attributes:true,attributeFilter:['class','style']});
    setTimeout(function(){if(gone())fin()},6000);
   };
   var boot=function(){whenReady(function(){go();setTimeout(go,1200)})};
   if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',boot);else boot();
  }
  /* gentle parallax on the hero light */
  var hb=null,ticking=false;
  window.addEventListener('scroll',function(){
   if(ticking)return;ticking=true;
   requestAnimationFrame(function(){
    ticking=false;hb=hb||d.querySelector('.hero-bg');
    if(hb){var y=window.scrollY||0;if(y<900)hb.style.setProperty('--fx-py',(y*.18).toFixed(1))}
   });
  },{passive:true});
 }catch(e){}
})();

/* footer: keep "Fahad" a green clickable link even after the language script rewrites the line */
(function(){
 try{
  var d=document,URL='https://fahad-abdur-rahman.github.io/ghost-leader/';
  function fix(){
   var p=d.querySelector('[data-i18n="f_bottom"]');
   if(!p||p.querySelector('.dev-link'))return;
   var w=d.createTreeWalker(p,NodeFilter.SHOW_TEXT,null),n;
   while((n=w.nextNode())){
    var i=n.nodeValue.indexOf('Fahad');
    if(i<0)continue;
    var after=n.splitText(i),rest=after.splitText(5);
    var a=d.createElement('a');a.className='dev-link';a.href=URL;a.target='_blank';a.rel='noopener';a.textContent='Fahad';
    after.parentNode.replaceChild(a,after);
    break;
   }
  }
  function start(){
   fix();
   var p=d.querySelector('[data-i18n="f_bottom"]');
   if(p)new MutationObserver(fix).observe(p,{childList:true,characterData:true,subtree:true});
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',start);else start();
  setTimeout(fix,1500);
 }catch(e){}
})();

/* v64 — 3D: tilt on touch/hover + floating glass cubes */
(function(){
 try{
  var d=document,rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(rm)return;
  var SEL='.o-card,.explore-card,.team-card,.news-card,.res-card,.stat-card,.post-card,.af,.c-info-item,.ch-card,.qz-card,.qz-card-lg,.rh-card,.nm-card,.inv-card,.reg-card,.verify-card,.founder-card,.about-vis,.room,.fp-card';
  var cur=null,down=false;
  function tilt(el,e){
   var r=el.getBoundingClientRect();if(!r.width)return;
   var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   var max=Math.min(10,Math.max(4,520/Math.max(r.width,160)*3));
   el.classList.remove('fx-untilt');el.classList.add('fx-tilting');
   el.style.transform='perspective(800px) rotateX('+(-y*max).toFixed(2)+'deg) rotateY('+(x*max*1.15).toFixed(2)+'deg) translateZ(0) scale(1.015)';
  }
  function reset(el){
   if(!el)return;
   el.classList.remove('fx-tilting');el.classList.add('fx-untilt');el.style.transform='';
   setTimeout(function(){el.classList.remove('fx-untilt')},520);
  }
  d.addEventListener('pointerdown',function(e){
   var el=e.target.closest&&e.target.closest(SEL);if(!el)return;
   down=true;cur=el;tilt(el,e);
  },{passive:true});
  d.addEventListener('pointermove',function(e){
   if(e.pointerType==='mouse'){
    var el=e.target.closest&&e.target.closest(SEL);
    if(cur&&cur!==el){reset(cur);cur=null}
    if(el){cur=el;tilt(el,e)}
   }else if(down&&cur){tilt(cur,e)}
  },{passive:true});
  function end(){down=false;if(cur&&!(window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches)){reset(cur);cur=null}}
  d.addEventListener('pointerup',end,{passive:true});
  d.addEventListener('pointercancel',end,{passive:true});
  d.addEventListener('pointerout',function(e){
   if(e.pointerType==='mouse'&&cur&&!cur.contains(e.relatedTarget)){reset(cur);cur=null}
  },{passive:true});
  window.addEventListener('scroll',function(){if(down&&cur){reset(cur);cur=null;down=false}},{passive:true});
  /* glass cubes behind hero and page headers */
  function cubes(host,list){
   if(!host||host.querySelector('.fx-scene'))return;
   var sc=d.createElement('div');sc.className='fx-scene';
   list.forEach(function(c){
    var cu=d.createElement('div');cu.className='fx-cube';
    cu.style.cssText='--s:'+c[0]+'px;--t:'+c[1]+'s;left:'+c[2]+';top:'+c[3]+';animation-delay:'+(c[4]||0)+'s';
    cu.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i>';sc.appendChild(cu);
   });
   host.insertBefore(sc,host.firstChild);
  }
  function build(){
   cubes(d.getElementById('hero'),[[64,26,'8%','16%'],[40,20,'82%','28%',-4],[28,17,'70%','74%',-9],[34,23,'14%','78%',-6]]);
   d.querySelectorAll('.page-header').forEach(function(h){cubes(h,[[46,24,'6%','24%'],[30,19,'88%','48%',-5]])});
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',build);else build();
 }catch(e){}
})();

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
  var SEL='.sec-hd,.explore-card,.o-card,.stat-card,.team-card,.news-card,.reg-card,.vt-card,.verify-card,.pf-card,.res-card,.post-card,.f-col,.founder-card,.h-stat,.vl-card,.af,.form-card';
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
  /* gentle 3D tilt on cards (mouse devices only) */
  if(!window.matchMedia||!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  d.addEventListener('mousemove',function(e){
   var c=e.target.closest&&e.target.closest('.o-card,.team-card,.explore-card');
   if(!c)return;
   var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   c.classList.add('fx-tilt');c.style.transform='perspective(800px) rotateX('+(-y*5).toFixed(2)+'deg) rotateY('+(x*6).toFixed(2)+'deg) translateY(-3px)';
  },{passive:true});
  d.addEventListener('mouseout',function(e){
   var c=e.target.closest&&e.target.closest('.fx-tilt');
   if(c&&!c.contains(e.relatedTarget))c.style.transform='';
  },{passive:true});
 }catch(e){}
})();

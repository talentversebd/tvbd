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

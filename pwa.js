if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){
  window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){});});
}

/* Loads the shared polish scripts on every page that includes pwa.js (so older HTML files pick them up too). */
(function(){
  try{
    var f=(location.pathname.split('/').pop()||'index.html').toLowerCase();
    var admin=/^(admin|form-admin|election-admin|404|offline|google)/.test(f);
    function add(src){
      var base=src.replace('.js','');
      if(document.querySelector('script[src^="'+src+'"]'))return;
      var s=document.createElement('script');s.src=src+'?v=1';s.async=false;document.body.appendChild(s);
    }
    if(!admin){add('fx.js');}
    add('bnav.js');
    if(!admin){add('notice.js');}
    if(!admin){add('share.js');}
    if(!admin){add('seo.js');}
    if(!admin){add('push.js');}
  }catch(e){}
})();

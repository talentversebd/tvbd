/* Share buttons + invite-link capture (loaded by pwa.js on every page) */
(function(){
 try{
  var bn=function(){try{return localStorage.getItem('tvbd_lang')==='bn'}catch(e){return false}};
  var T=function(en,bnx){return bn()?bnx:en};
  /* remember ?ref=TV-XXXXXX from an invite link */
  try{var q=new URLSearchParams(location.search).get('ref');if(q&&/^TV-[A-Z0-9]{6}$/i.test(q))localStorage.setItem('tvbd_ref',q.toUpperCase());}catch(e){}

  function toast(m){try{if(typeof window.toast==='function')return window.toast(m)}catch(e){} }
  function copy(u,done){
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(done,function(){prompt('Copy:',u)});}
    else{var t=document.createElement('textarea');t.value=u;document.body.appendChild(t);t.select();try{document.execCommand('copy');done()}catch(e){prompt('Copy:',u)}t.remove();}
  }
  window.tvShare=function(o){
    o=o||{};var url=o.url||location.href,title=o.title||document.title,text=o.text||title;
    if(navigator.share){navigator.share({title:title,text:text,url:url}).catch(function(){});return;}
    var enc=encodeURIComponent,full=enc(text+' '+url);
    var ov=document.createElement('div');ov.className='tv-sheet-ov';
    ov.innerHTML='<div class="tv-sheet" role="dialog"><h4></h4><p></p><div class="tv-sh-grid">'+
     '<a target="_blank" rel="noopener" href="https://wa.me/?text='+full+'"><i>💬</i>WhatsApp</a>'+
     '<a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u='+enc(url)+'"><i>📘</i>Facebook</a>'+
     '<a target="_blank" rel="noopener" href="https://t.me/share/url?url='+enc(url)+'&text='+enc(text)+'"><i>✈️</i>Telegram</a>'+
     '<button type="button" data-c="1"><i>🔗</i>'+T('Copy link','লিংক কপি')+'</button></div></div>';
    ov.querySelector('h4').textContent=T('Share','শেয়ার করুন');ov.querySelector('p').textContent=title;
    function close(){ov.classList.remove('on');setTimeout(function(){ov.remove()},220)}
    ov.addEventListener('click',function(e){if(e.target===ov)return close();var b=e.target.closest('button[data-c]');if(b)copy(url,function(){toast('Link copied! ✅');close()});if(e.target.closest('a'))setTimeout(close,300)});
    document.body.appendChild(ov);requestAnimationFrame(function(){ov.classList.add('on')});
  };
  var ICON='<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/></svg>';
  function pageUrl(file){return new URL(file,location.href).href}
  function addToCards(root){
    var cards=(root.querySelectorAll?root.querySelectorAll('.o-card:not([data-sh]),.n-card:not([data-sh])'):[]);
    cards.forEach(function(c){
      c.setAttribute('data-sh','1');
      var t=c.querySelector('.o-card-title,.n-title');if(!t)return;
      var isNews=c.classList.contains('n-card');
      var b=document.createElement('button');b.type='button';b.className='tv-share-btn';b.setAttribute('aria-label','Share');b.innerHTML=ICON;
      if(isNews){c.style.position='relative';}
      b.addEventListener('click',function(e){
        e.stopPropagation();e.preventDefault();
        var title=(t.textContent||'').trim();
        window.tvShare({title:title,text:(isNews?'📰 ':'🏆 ')+title+' — TalentVerse Bangladesh',url:pageUrl(isNews?'news.html':'events.html')});
      },true);
      c.appendChild(b);
    });
  }
  function addToForum(){
    var t=document.getElementById('fp-title');
    if(!t||!t.textContent.trim()||document.getElementById('tv-fp-share'))return;
    var b=document.createElement('button');b.type='button';b.id='tv-fp-share';b.className='tv-share-inline';b.innerHTML=ICON+'<span>'+T('Share','শেয়ার')+'</span>';
    b.onclick=function(){window.tvShare({title:t.textContent.trim(),text:'💬 '+t.textContent.trim()+' — TalentVerse Forum',url:location.href})};
    t.parentNode.insertBefore(b,t.nextSibling);
  }
  function run(){
    addToCards(document);addToForum();
    new MutationObserver(function(ms){
      ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1){if(n.matches&&n.matches('.o-card,.n-card'))addToCards(n.parentNode||document);else addToCards(n);}})});
      addToForum();
    }).observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
 }catch(e){}
})();

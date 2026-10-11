(function(){
  var loader = document.getElementById('tvbd-loader');
  if(!loader) return;
  var fill = document.getElementById('tvbd-loader-fill');
  var pct  = document.getElementById('tvbd-loader-pct');

  // mark ring as drawn once its draw animation ends, to fade in the rotating brand sweep
  var ringFg = loader.querySelector('.tvbd-ring-fg');
  if(ringFg){
    ringFg.addEventListener('animationend', function(){
      loader.classList.add('tvbd-ring-drawn');
    }, {once:true});
  }

  // repeat page in same session -> quick mode (no full intro)
  var quick = false;
  try{ if(sessionStorage.getItem('tvbd_seen')) quick = true; else sessionStorage.setItem('tvbd_seen','1'); }catch(e){}
  if(quick) loader.classList.add('tvbd-quick');

  var progress = 0;
  var pageReady = false;
  var minShown = false;

  function setProgress(p){
    progress = p;
    if(fill) fill.style.width = p + '%';
    if(pct) pct.textContent = 'Loading... ' + Math.round(p) + '%';
  }

  // Ease toward 92% over ~1.3s while real assets load; never claims 100% until actually ready
  var start = Date.now();
  var target = 92;
  var duration = quick ? 800 : 2800;
  var tick = setInterval(function(){
    var elapsed = Date.now() - start;
    var t = Math.min(elapsed / duration, 1);
    var eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    setProgress(eased * target);
    if(t >= 1){
      clearInterval(tick);
      minShown = true;
      finishIfReady();
    }
  }, 40);

  function finishIfReady(){
    if(minShown && pageReady){
      setProgress(100);
      setTimeout(function(){
        loader.classList.add('tvbd-hide');
        setTimeout(function(){ loader.remove(); }, 450);
      }, quick ? 0 : 120);
    }
  }

  function onPageReady(){
    pageReady = true;
    finishIfReady();
  }

  // ready as soon as the page structure is ready (don't wait for every image/font)
  if(document.readyState !== 'loading'){
    onPageReady();
  } else {
    document.addEventListener('DOMContentLoaded', onPageReady);
    setTimeout(onPageReady, 4000); // safety net
  }
})();

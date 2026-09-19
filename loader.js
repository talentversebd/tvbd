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

  var progress = 0;
  var pageReady = false;
  var minShown = false;

  function setProgress(p){
    progress = p;
    if(fill) fill.style.width = p + '%';
    if(pct) pct.textContent = 'Loading... ' + Math.round(p) + '%';
  }

  // Ease toward 92% over ~2.2s while real assets load; never claims 100% until actually ready
  var start = Date.now();
  var target = 92;
  var duration = 2200;
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
        setTimeout(function(){ loader.remove(); }, 650);
      }, 200);
    }
  }

  function onPageReady(){
    pageReady = true;
    finishIfReady();
  }

  if(document.readyState === 'complete'){
    onPageReady();
  } else {
    window.addEventListener('load', onPageReady);
    // safety net: never block the site for more than 5s even if something never fires 'load'
    setTimeout(onPageReady, 5000);
  }
})();

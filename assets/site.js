(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scroll progress bar
  var bar = document.getElementById('progress');
  function onScroll(){
    var h = document.documentElement;
    var p = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = p + '%';
  }
  document.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  if (!('IntersectionObserver' in window)) return;

  // section reveals — content visible by default, armed only if off-screen
  if (!reduce){
    var els = document.querySelectorAll('.fx');
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target);} });
    },{threshold:.12});
    els.forEach(function(el){
      var r = el.getBoundingClientRect();
      if (!(r.top < window.innerHeight && r.bottom > 0)) el.classList.add('armed');
      io.observe(el);
    });
  }

  // animated counters
  var counters = document.querySelectorAll('.count');
  if (reduce){
    counters.forEach(function(c){ c.textContent = Number(c.dataset.to).toLocaleString(); });
    return;
  }
  var cio = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return;
      cio.unobserve(e.target);
      var to = Number(e.target.dataset.to), t0 = null, dur = 1400;
      function step(t){
        if(!t0) t0 = t;
        var k = Math.min((t - t0)/dur, 1);
        k = 1 - Math.pow(1 - k, 4); // ease-out-quart
        e.target.textContent = Math.round(to * k).toLocaleString();
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  },{threshold:.4});
  counters.forEach(function(c){ cio.observe(c); });
})();

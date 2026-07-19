(function(){
  var canvas = document.getElementById('embers');
  if(!canvas) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var w, h, dpr;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.parentElement.clientWidth;
    h = canvas.parentElement.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  function spawn(){
    particles.push({
      x: w/2 + (Math.random()-0.5) * w * 0.55,
      y: h * 0.62 + Math.random()*h*0.25,
      r: 1 + Math.random()*2.2,
      vy: -(0.25 + Math.random()*0.55),
      vx: (Math.random()-0.5) * 0.35,
      life: 0,
      maxLife: 220 + Math.random()*220,
      hue: Math.random() > 0.5 ? '255,90,31' : '255,180,84'
    });
  }

  var maxParticles = w < 700 ? 40 : 80;

  function tick(){
    ctx.clearRect(0,0,w,h);
    if(particles.length < maxParticles && Math.random() < 0.6) spawn();

    for(var i = particles.length - 1; i >= 0; i--){
      var p = particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vx += (Math.random()-0.5) * 0.02;

      var t = p.life / p.maxLife;
      var alpha = t < 0.15 ? t/0.15 : (1 - (t-0.15)/0.85);
      alpha = Math.max(alpha, 0) * 0.85;

      ctx.beginPath();
      var grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);
      grad.addColorStop(0, 'rgba('+p.hue+','+alpha+')');
      grad.addColorStop(1, 'rgba('+p.hue+',0)');
      ctx.fillStyle = grad;
      ctx.arc(p.x,p.y,p.r*4,0,Math.PI*2);
      ctx.fill();

      if(p.life >= p.maxLife || p.y < h*0.05) particles.splice(i,1);
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if(reduce || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('in-view'); });
    return;
  }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function(el){ io.observe(el); });
})();

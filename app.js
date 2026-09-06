/* =====================================================================
   Santanu Mondal — Portfolio  |  shared app.js
   Handles theme toggle, nav scroll, mobile menu, year, reveal-on-scroll.
   Page-specific scripts (typing, publication filters) live in each page.
   ===================================================================== */

/* ---- Theme (light default, remembers choice) ---- */
(function(){
  var root=document.documentElement;
  var saved=null; try{saved=localStorage.getItem('theme')}catch(e){}
  setTheme(saved||'light');
  function setTheme(t){
    root.setAttribute('data-theme',t);
    var sun=document.getElementById('sunIcon'), moon=document.getElementById('moonIcon');
    if(sun&&moon){sun.style.display=t==='dark'?'none':'block';moon.style.display=t==='dark'?'block':'none';}
    try{localStorage.setItem('theme',t)}catch(e){}
  }
  document.addEventListener('click',function(e){
    if(e.target.closest && e.target.closest('#themeBtn')){
      setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark');
    }
  });
})();

/* ---- Nav: shrink on scroll + mobile menu ---- */
(function(){
  var nav=document.getElementById('nav');
  if(nav){window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>30)});}
  var mb=document.getElementById('menuBtn'), nl=document.getElementById('navLinks');
  if(mb&&nl){
    mb.addEventListener('click',function(){nl.classList.toggle('open')});
    nl.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nl.classList.remove('open')})});
  }
})();

/* ---- Footer year ---- */
(function(){var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();})();

/* ---- Reveal on scroll ---- */
(function(){
  var els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){els.forEach(function(el){el.classList.add('in')});return;}
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:0.12});
  els.forEach(function(el){io.observe(el)});
})();

/* ---- Interactive spider-web cursor effect (particle network) ---- */
(function(){
  var c=document.getElementById('webfx'); if(!c) return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var ctx=c.getContext('2d'), w=0,h=0,dpr=1,parts=[],mouse={x:-9999,y:-9999};
  function accentRgb(){
    var v=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#22d3ee';
    v=v.replace('#',''); if(v.length===3){v=v.split('').map(function(x){return x+x}).join('');}
    var n=parseInt(v,16); return [(n>>16)&255,(n>>8)&255,n&255];
  }
  var rgb=accentRgb();
  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    w=window.innerWidth; h=window.innerHeight;
    c.style.width=w+'px'; c.style.height=h+'px';
    c.width=Math.round(w*dpr); c.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    var target=Math.min(120, Math.max(30, Math.floor(w*h/13000)));
    parts=[];
    for(var i=0;i<target;i++){parts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*0.45,vy:(Math.random()-.5)*0.45});}
  }
  var frame=0;
  function loop(){
    frame++;
    if(frame%30===0) rgb=accentRgb(); // pick up theme changes
    ctx.clearRect(0,0,w,h);
    var D=135, DM=210, r0=rgb[0],r1=rgb[1],r2=rgb[2];
    for(var i=0;i<parts.length;i++){
      var p=parts[i];
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w) p.vx*=-1;
      if(p.y<0||p.y>h) p.vy*=-1;
      var dxm=p.x-mouse.x, dym=p.y-mouse.y, dm=Math.sqrt(dxm*dxm+dym*dym);
      if(dm<DM){
        ctx.strokeStyle='rgba('+r0+','+r1+','+r2+','+(0.55*(1-dm/DM))+')';
        ctx.lineWidth=1.1; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(mouse.x,mouse.y); ctx.stroke();
      }
      for(var j=i+1;j<parts.length;j++){
        var q=parts[j], dx=p.x-q.x, dy=p.y-q.y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<D){
          ctx.strokeStyle='rgba('+r0+','+r1+','+r2+','+(0.20*(1-d/D))+')';
          ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.stroke();
        }
      }
      ctx.fillStyle='rgba('+r0+','+r1+','+r2+',0.65)';
      ctx.beginPath(); ctx.arc(p.x,p.y,1.6,0,6.2832); ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  window.addEventListener('mousemove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;},{passive:true});
  window.addEventListener('mouseout',function(){mouse.x=-9999;mouse.y=-9999;});
  window.addEventListener('resize',resize);
  resize(); requestAnimationFrame(loop);
})();

/* ---- Strict full-page nav: Arrow / Page / Space move one section at a time ---- */
(function(){
  if(!document.body.classList.contains('snap')) return;
  var panels=Array.prototype.slice.call(document.querySelectorAll('.hero, .section'));
  if(!panels.length) return;
  var animating=false;
  function currentIndex(){
    var mid=window.scrollY+window.innerHeight/2, idx=0, best=Infinity;
    panels.forEach(function(p,i){var c=p.offsetTop+p.offsetHeight/2,d=Math.abs(c-mid); if(d<best){best=d;idx=i;}});
    return idx;
  }
  function go(i){
    i=Math.max(0,Math.min(panels.length-1,i));
    animating=true;
    panels[i].scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(function(){animating=false;},700);
  }
  window.addEventListener('keydown',function(e){
    if(e.defaultPrevented) return;
    var t=(e.target.tagName||'').toLowerCase();
    if(t==='input'||t==='textarea'||e.target.isContentEditable) return;
    if(window.matchMedia('(max-width:900px)').matches) return; // free scroll on small screens
    var k=e.key;
    if(k==='ArrowDown'||k==='PageDown'||(k===' '&&!e.shiftKey)){e.preventDefault(); if(!animating) go(currentIndex()+1);}
    else if(k==='ArrowUp'||k==='PageUp'||(k===' '&&e.shiftKey)){e.preventDefault(); if(!animating) go(currentIndex()-1);}
    else if(k==='Home'){e.preventDefault(); go(0);}
    else if(k==='End'){e.preventDefault(); go(panels.length-1);}
  });
})();

/* ---- Section dots: highlight the section you're currently in ---- */
(function(){
  var dots=document.querySelectorAll('.dots a');
  if(!dots.length || !('IntersectionObserver' in window)) return;
  var targets=[];
  dots.forEach(function(a){
    var t=document.querySelector(a.getAttribute('href'));
    if(t){t.__dot=a;targets.push(t);}
  });
  function activate(a){dots.forEach(function(d){d.classList.toggle('active',d===a);});}
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting && e.target.__dot) activate(e.target.__dot); });
  },{rootMargin:'-45% 0px -45% 0px',threshold:0});
  targets.forEach(function(t){io.observe(t);});
})();

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

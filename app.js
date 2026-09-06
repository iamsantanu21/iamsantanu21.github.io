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

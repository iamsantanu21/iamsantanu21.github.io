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

/* ---- Photo carousel: arrow buttons + gentle auto-advance (native smooth scroll) ---- */
(function(){
  var car=document.getElementById('galleryCarousel'); if(!car) return;
  var vp=car.querySelector('.car-viewport'), track=car.querySelector('.car-track');
  var prev=car.querySelector('.prev'), next=car.querySelector('.next');
  var slides=Array.prototype.slice.call(track.children);
  if(!slides.length) return;
  var reduce=window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function step(){ // scroll by roughly one slide (+ gap)
    var gap=parseFloat(getComputedStyle(track).columnGap||getComputedStyle(track).gap||'16')||16;
    return Math.round(slides[0].getBoundingClientRect().width + gap);
  }
  function atEnd(){ return vp.scrollLeft + vp.clientWidth >= vp.scrollWidth - 4; }
  function atStart(){ return vp.scrollLeft <= 4; }
  function goNext(){ if(atEnd()) vp.scrollTo({left:0,behavior:'smooth'}); else vp.scrollBy({left:step(),behavior:'smooth'}); }
  function goPrev(){ if(atStart()) vp.scrollTo({left:vp.scrollWidth,behavior:'smooth'}); else vp.scrollBy({left:-step(),behavior:'smooth'}); }
  if(next) next.addEventListener('click',function(){goNext();bump();});
  if(prev) prev.addEventListener('click',function(){goPrev();bump();});
  // auto-advance, pause on hover / interaction / when lightbox open
  var timer=null, paused=false;
  function start(){ if(reduce||timer) return; timer=setInterval(function(){ if(!paused) goNext(); },4000); }
  function stop(){ if(timer){clearInterval(timer);timer=null;} }
  function bump(){ paused=true; clearTimeout(bump._t); bump._t=setTimeout(function(){paused=false;},6000); }
  car.addEventListener('mouseenter',function(){paused=true;});
  car.addEventListener('mouseleave',function(){paused=false;});
  vp.addEventListener('touchstart',function(){paused=true;},{passive:true});
  document.addEventListener('lightbox:toggle',function(e){paused=!!(e.detail&&e.detail.open);});
  start();
})();

/* ---- Gallery justified layout: rows fill the full width, no blank gaps, order kept ---- */
(function(){
  var grid=document.querySelector('.gallery-grid'); if(!grid) return;
  var GAP=12;
  var tiles=Array.prototype.slice.call(grid.querySelectorAll('.gtile'));
  function ar(t){ var i=t.querySelector('img'); return (i&&i.naturalWidth&&i.naturalHeight)? i.naturalWidth/i.naturalHeight : 1.5; }
  function targetH(W){ return W>=900?240 : W>=560?205 : 175; }
  function flush(row,W,th,stretch){
    var arSum=row.reduce(function(s,t){return s+ar(t);},0);
    var gaps=(row.length-1)*GAP;
    var rh=Math.round(stretch ? (W-gaps)/arSum : Math.min(th,(W-gaps)/arSum));
    var rd=document.createElement('div'); rd.className='grow-row'; rd.style.height=rh+'px';
    row.forEach(function(t){
      if(stretch){ t.style.flex=ar(t).toFixed(4)+' 1 0'; t.style.width='auto'; }   // grow to fill the line
      else { t.style.flex='0 0 auto'; t.style.width=Math.round(rh*ar(t))+'px'; }     // last row: natural width
      t.style.height='100%';
      rd.appendChild(t);
    });
    grid.appendChild(rd);
  }
  function justify(){
    var W=grid.clientWidth; if(W<=0) return;
    var th=targetH(W);
    grid.innerHTML='';                        // rebuild rows
    var row=[], sum=0;
    tiles.forEach(function(t){
      row.push(t); sum+=ar(t);
      if(sum*th + (row.length-1)*GAP >= W){ flush(row,W,th,true); row=[]; sum=0; }
    });
    if(row.length) flush(row,W,th,false);
  }
  var pending=tiles.length;
  tiles.forEach(function(t){
    var img=t.querySelector('img');
    if(img && img.complete){ if(--pending<=0) justify(); }
    else if(img) img.addEventListener('load', justify);
    else pending--;
  });
  justify();
  window.addEventListener('load',justify);
  var rt; window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(justify,150);});
})();

/* ---- Lightbox: click a photo to enlarge, ← / → to browse, Esc to close ---- */
(function(){
  // unique photos = the real items (exclude marquee clones)
  var items=Array.prototype.slice.call(document.querySelectorAll('.glightbox-item:not([data-clone])'));
  if(!items.length) return;
  var cur=0;
  // build overlay once
  var lb=document.createElement('div'); lb.className='lightbox'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true');
  lb.innerHTML=''
    +'<button class="lb-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'
    +'<button class="lb-btn lb-prev" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg></button>'
    +'<button class="lb-btn lb-next" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></button>'
    +'<figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption><div class="lb-count"></div></figure>';
  document.body.appendChild(lb);
  var img=lb.querySelector('.lb-img'), cap=lb.querySelector('.lb-cap'), count=lb.querySelector('.lb-count');
  function render(){
    var it=items[cur];
    img.src=it.getAttribute('href'); img.alt=it.getAttribute('data-cap')||'';
    cap.textContent=it.getAttribute('data-cap')||'';
    count.textContent=(cur+1)+' / '+items.length;
  }
  function fire(open){document.dispatchEvent(new CustomEvent('lightbox:toggle',{detail:{open:open}}));}
  function open(i){cur=i;render();lb.classList.add('open');document.body.style.overflow='hidden';fire(true);}
  function close(){lb.classList.remove('open');document.body.style.overflow='';fire(false);}
  function go(n){cur=(n+items.length)%items.length;render();}
  // clicking any photo (including a cloned marquee card) opens the matching unique photo
  document.addEventListener('click',function(e){
    var it=e.target.closest && e.target.closest('.glightbox-item');
    if(!it) return;
    e.preventDefault();
    var href=it.getAttribute('href'), idx=0;
    for(var k=0;k<items.length;k++){ if(items[k].getAttribute('href')===href){idx=k;break;} }
    open(idx);
  });
  lb.querySelector('.lb-close').addEventListener('click',close);
  lb.querySelector('.lb-prev').addEventListener('click',function(e){e.stopPropagation();go(cur-1);});
  lb.querySelector('.lb-next').addEventListener('click',function(e){e.stopPropagation();go(cur+1);});
  lb.addEventListener('click',function(e){if(e.target===lb)close();});
  window.addEventListener('keydown',function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape'){e.preventDefault();close();}
    else if(e.key==='ArrowLeft'){e.preventDefault();e.stopImmediatePropagation();go(cur-1);}
    else if(e.key==='ArrowRight'){e.preventDefault();e.stopImmediatePropagation();go(cur+1);}
  });
})();

/* Movimiento fino: proyectos con scroll cinemático, títulos que se revelan,
   botones magnéticos, luz que sigue al cursor y barra de progreso.
   Todo se desactiva con "reducir movimiento". */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer:fine)').matches;
  var gsap = window.gsap;

  /* ---------- barra de progreso de lectura ---------- */
  var bar = document.createElement('div'); bar.className = 'progress'; document.body.appendChild(bar);
  addEventListener('scroll', function () {
    var h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
  }, { passive: true });

  /* ---------- proyectos: escenario fijo + pantallas que cambian con el scroll (escritorio) ---------- */
  var work = document.getElementById('work');
  var cases = work ? [].slice.call(work.querySelectorAll('.case')) : [];
  if (cases.length && matchMedia('(min-width:1101px)').matches && !reduce) {
    work.classList.add('work--cine');
    var grid = document.createElement('div'); grid.className = 'cine';
    var stage = document.createElement('div'); stage.className = 'cine__stage';
    var list = document.createElement('div'); list.className = 'cine__list';
    var meta = document.createElement('div'); meta.className = 'cine__meta mono';
    meta.innerHTML = '<span class="cine__n">01</span><span class="cine__bar"><i></i></span><span>0' + cases.length + '</span>';
    cases[0].parentNode.insertBefore(grid, cases[0]);
    grid.appendChild(stage); grid.appendChild(list);
    cases.forEach(function (c, i) {
      var layer = document.createElement('div'); layer.className = 'cine__layer' + (i === 0 ? ' on' : '');
      layer.appendChild(c.querySelector('.case__media').cloneNode(true)); stage.appendChild(layer);
      list.appendChild(c); c.dataset.i = i;
    });
    stage.appendChild(meta);
    if (window.fitCrops) requestAnimationFrame(window.fitCrops);
    var layers = [].slice.call(stage.querySelectorAll('.cine__layer')), nEl = meta.querySelector('.cine__n'), fill = meta.querySelector('.cine__bar i');
    var active = 0;
    function setActive(i) {
      if (i === active) return; var dir = i > active ? 1 : -1; active = i;
      layers.forEach(function (l, j) { l.classList.toggle('on', j === i); l.classList.toggle('up', j < i); l.style.setProperty('--dir', dir); });
      cases.forEach(function (c, j) { c.classList.toggle('on', j === i); });
      nEl.textContent = '0' + (i + 1);
    }
    cases[0].classList.add('on');
    function onScroll() {
      var mid = innerHeight * .5, best = 0, bestD = 1e9;
      cases.forEach(function (c, i) { var r = c.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid); if (d < bestD) { bestD = d; best = i; } });
      setActive(best);
      var r0 = list.getBoundingClientRect(), p = Math.min(1, Math.max(0, (mid - r0.top) / r0.height));
      fill.style.transform = 'scaleX(' + p + ')';
      // parallax dentro de la escena activa: el teléfono de atrás se desliza
      var rc = cases[active].getBoundingClientRect(), lp = Math.min(1, Math.max(-1, (mid - (rc.top + rc.height / 2)) / rc.height));
      var back = layers[active].querySelector('.frame--back'), front = layers[active].querySelector('.frame:not(.frame--back)');
      if (back) back.style.transform = 'translateY(' + (28 - lp * 60) + 'px) rotate(' + (3 + lp * 2) + 'deg)';
      if (front) front.style.transform = 'translateY(' + (lp * 24) + 'px) rotate(' + (-3 + lp * 1.5) + 'deg)';
    }
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  if (reduce) return;

  /* ---------- títulos: las palabras suben desde una máscara ---------- */
  function splitWords(el) {
    if (el.dataset.split) return; el.dataset.split = 1;
    var walk = function (node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return; if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var o = document.createElement('span'); o.className = 'w'; var inner = document.createElement('span'); inner.textContent = w; o.appendChild(inner); frag.appendChild(o);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains('w')) walk(n);
      });
    };
    walk(el);
  }
  if (gsap && window.ScrollTrigger) {
    document.querySelectorAll('.h2').forEach(function (h) {
      splitWords(h);
      gsap.from(h.querySelectorAll('.w > span'), { yPercent: 110, duration: .9, ease: 'power4.out', stagger: .045, scrollTrigger: { trigger: h, start: 'top 85%' } });
    });
    // nombre de la portada letra por letra
    var name = document.querySelector('.hero__name');
    if (name && !name.dataset.split) {
      name.dataset.split = 1;
      name.innerHTML = name.textContent.split('').map(function (ch) { return ch === ' ' ? ' ' : '<span class="ch"><span>' + ch + '</span></span>'; }).join('');
      gsap.from(name.querySelectorAll('.ch > span'), { yPercent: 105, duration: 1, ease: 'power4.out', stagger: .035, delay: .15 });
    }
    // al cambiar de idioma el texto se reemplaza: queda visible sin animación
  }

  if (!fine) return;

  /* ---------- botones magnéticos ---------- */
  document.querySelectorAll('.btn, .path, .nav .btn--sm').forEach(function (b) {
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect(), x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      b.style.transform = 'translate(' + x * .18 + 'px,' + y * .28 + 'px)';
    });
    b.addEventListener('pointerleave', function () { b.style.transform = ''; });
  });

  /* ---------- luz que sigue al cursor en tarjetas ---------- */
  document.querySelectorAll('.service, .cvcard, .path, .case__media, .faq__item, .form, .facts').forEach(function (el) {
    el.classList.add('spot');
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
})();

/* Animaciones de página (GSAP), nav, capturas, formulario. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) document.documentElement.classList.add('reduce');
  // ?shot → altura fija de portada para capturas de página completa (solo revisión)
  if (/[?&]shot\b/.test(location.search)) { document.documentElement.classList.add('shot');
    var sy = +(new URLSearchParams(location.search).get('y') || 0); if (sy) addEventListener('load', function () { scrollTo(0, sy); }); }
  document.getElementById('year').textContent = new Date().getFullYear();

  // nav
  var nav = document.getElementById('nav');
  addEventListener('scroll', function () { nav.classList.toggle('scrolled', scrollY > 40); }, { passive: true });
  // menú móvil
  var menuBtn = document.getElementById('menuBtn');
  menuBtn.addEventListener('click', function () { var o = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o); });
  nav.querySelectorAll('.nav__links a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); }); });

  // reveals + timeline
  if (window.gsap && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.reveal').forEach(function (el) {
      gsap.to(el, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    gsap.from('.hero__text > *', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', stagger: .08, delay: .1 });
    gsap.from('.float', { opacity: 0, scale: .9, duration: 1, ease: 'power3.out', stagger: .15, delay: .6 });
    gsap.to('#tlFill', { height: '100%', ease: 'none', scrollTrigger: { trigger: '#timeline', start: 'top 70%', end: 'bottom 70%', scrub: true } });
  } else {
    document.querySelectorAll('.reveal').forEach(function (e) { e.style.opacity = 1; e.style.transform = 'none'; });
    var f = document.getElementById('tlFill'); if (f) f.style.height = '100%';
  }

  // floating cards parallax (hero)
  var scene = document.getElementById('heroScene');
  if (scene && !reduce) {
    var floats = scene.querySelectorAll('.float'), tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
    (function loop() {
      cx += (tx - cx) * .06; cy += (ty - cy) * .06; var t = performance.now() / 1000;
      floats.forEach(function (f, i) { var d = +f.dataset.depth || 1;
        f.style.transform = 'translate3d(' + (cx * 30 * d) + 'px,' + (cy * 24 * d + Math.sin(t * 1.2 + i * 2) * 6) + 'px,0)'; });
      requestAnimationFrame(loop);
    })();
  }

  // capturas: recorta [x,y,w,h] de la imagen original y la ajusta al marco (cover)
  function fitCrop(img) {
    var c = img.dataset.crop.split(",").map(Number), f = img.parentElement, W = f.clientWidth, H = f.clientHeight;
    if (!W || !img.naturalWidth) return;
    var s = Math.max(W / c[2], H / c[3]);
    img.style.width = img.naturalWidth * s + "px";
    img.style.left = (-c[0] * s - (c[2] * s - W) / 2) + "px";
    img.style.top = (-c[1] * s - Math.max(0, c[3] * s - H) / 2) + "px";
  }
  var crops = document.querySelectorAll("img[data-crop]");
  crops.forEach(function (img) { if (img.complete) fitCrop(img); img.addEventListener("load", function () { fitCrop(img); }); });
  addEventListener("resize", function () { crops.forEach(fitCrop); });
  window.fitCrops = function () { document.querySelectorAll("img[data-crop]").forEach(function (img) {
    if (img.complete) fitCrop(img); else img.addEventListener("load", function () { fitCrop(img); }, { once: true }); }); };

  // testimonios: la sección solo aparece si js/testimonials.js tiene datos reales
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function renderTestimonials() {
    var sec = document.getElementById('testimonials'), grid = document.getElementById('testisGrid'), list = window.TESTIMONIALS || [];
    if (!sec || !grid) return;
    sec.hidden = !list.length; if (!list.length) return;
    var en = document.documentElement.lang === 'en';
    grid.innerHTML = list.map(function (t) {
      var initials = esc((t.name || '').split(' ').map(function (w) { return w[0]; }).slice(0, 2).join(''));
      var avatar = t.photo ? '<img src="' + esc(t.photo) + '" alt="" width="48" height="48" loading="lazy">' : '<span>' + initials + '</span>';
      var who = '<b>' + esc(t.name) + '</b><small>' + esc(en ? (t.role_en || t.role_es) : t.role_es) + (t.company ? ' · ' + esc(t.company) : '') + '</small>';
      if (t.link) who = '<a href="' + esc(t.link) + '" target="_blank" rel="noopener">' + who + '</a>';
      return '<figure class="card testi"><svg class="testi__q" viewBox="0 0 32 24" width="32" height="24" aria-hidden="true"><path fill="currentColor" d="M0 24V14C0 6 4 1.3 12 0l1.4 3.2C9 4.6 7 7.4 6.8 11H12v13H0zm19 0V14c0-8 4-12.7 12-14l1 3.2c-4.4 1.4-6.4 4.2-6.6 7.8H31v13H19z"/></svg>' +
        '<blockquote>' + esc(en ? (t.en || t.es) : (t.es || t.en)) + '</blockquote>' +
        '<figcaption><span class="testi__av">' + avatar + '</span><span class="testi__who">' + who + '</span></figcaption></figure>';
    }).join('');
  }
  window.renderTestimonials = renderTestimonials;
  renderTestimonials(); addEventListener('langchange', renderTestimonials);

  // formulario: envío directo al correo con FormSubmit (sin cuenta); si falla, se abre el correo
  var form = document.getElementById('contactForm'), status = document.getElementById('formStatus');
  var wantCall = document.getElementById('wantCall'), callFields = document.getElementById('callFields');
  wantCall.addEventListener('change', function () { callFields.hidden = !wantCall.checked; });
  function say(cls, es, en) { status.className = 'form__status ' + cls; status.textContent = document.documentElement.lang === 'en' ? en : es; }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    if (d.get('_honey')) return; // bot
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var data = {}; d.forEach(function (v, k) { if (v && k !== '_honey') data[k] = v; });
    if (!wantCall.checked) { delete data.fecha_llamada; delete data.telefono; }
    data._subject = (wantCall.checked ? '📞 Pide llamada · ' : '✉️ Portafolio · ') + (data.tipo || '') + ' · ' + data.nombre;
    data._template = 'table'; data._captcha = 'false'; data._replyto = data.email;
    var btn = form.querySelector('button[type=submit]'); btn.disabled = true;
    say('', 'Enviando…', 'Sending…');
    fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (String(j.success) === 'true') { say('ok', '✓ ¡Mensaje enviado! Te respondo pronto.', '✓ Message sent! I’ll get back to you soon.'); form.reset(); callFields.hidden = true; }
        else throw new Error(j.message || 'error');
      })
      .catch(function () {
        // plan B: el mensaje ya escrito, para enviarlo con un clic por WhatsApp o correo
        var en = document.documentElement.lang === 'en';
        var txt = (en ? 'Hi Yoseidy, I’m ' : 'Hola Yoseidy, soy ') + (data.nombre || '') + ' (' + (data.email || '') + ').\n' +
          (data.tipo ? data.tipo + '\n' : '') + (data.mensaje || '') +
          (data.fecha_llamada ? '\n' + (en ? 'Call: ' : 'Llamada: ') + data.fecha_llamada.replace('T', ' ') + (data.telefono ? ' · ' + data.telefono : '') : '');
        status.className = 'form__status err';
        status.innerHTML = (en ? 'Couldn’t send it from here. Send it with one click:' : 'No se pudo enviar desde aquí. Envíalo con un clic:') +
          '<span class="form__alt"><a class="btn btn--sm form__wa" target="_blank" rel="noopener" href="https://wa.me/573126586157?text=' + encodeURIComponent(txt) + '">WhatsApp</a>' +
          '<a class="btn btn--sm btn--glass" href="mailto:yoseidy93@gmail.com?subject=' + encodeURIComponent(data._subject) + '&body=' + encodeURIComponent(txt) + '">' + (en ? 'Email' : 'Correo') + '</a></span>';
      })
      .finally(function () { btn.disabled = false; });
  });
})();

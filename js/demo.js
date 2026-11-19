/* Demo interactiva de la portada: una mini app de tienda hecha en HTML, CSS y JS.
   Flujo: catálogo → producto → carrito → pago con QR → confirmación "en tiempo real" (simulada).
   Es una demostración propia: no usa marcas ni datos de clientes. */
(function () {
  var root = document.getElementById('demo'); if (!root) return;
  var screen = root.querySelector('.demo__screen');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var T = {
    es: { store: 'Tienda demo', all: 'Todo', news: 'Novedades', add: 'Agregar al carrito', added: 'Agregado ✓', cart: 'Tu carrito', empty: 'Tu carrito está vacío.', back: 'Volver', total: 'Total', pay: 'Pagar con QR', scan: 'Escanea con tu móvil para pagar', wait: 'Esperando el pago…', ok: '¡Pago confirmado!', okSub: 'La tablet de la tienda lo recibió al instante.', again: 'Seguir comprando', color: 'Color', items: 'productos', hint: 'Toca la app · demo hecha por mí en HTML, CSS y JS' },
    en: { store: 'Demo store', all: 'All', news: 'New in', add: 'Add to cart', added: 'Added ✓', cart: 'Your cart', empty: 'Your cart is empty.', back: 'Back', total: 'Total', pay: 'Pay with QR', scan: 'Scan with your phone to pay', wait: 'Waiting for payment…', ok: 'Payment confirmed!', okSub: 'The store’s tablet got it instantly.', again: 'Keep shopping', color: 'Color', items: 'items', hint: 'Tap the app · a demo I built in HTML, CSS and JS' }
  };
  var ICON = {
    mug: '<path d="M6 8h10v7a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V8z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M9 4c0 1 1 1 1 2M12 4c0 1 1 1 1 2"/>',
    bag: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    cap: '<path d="M4 15a8 8 0 0 1 16 0H4z"/><path d="M12 7V5M4 15h12l4 2"/>',
    book: '<path d="M6 4h11a1 1 0 0 1 1 1v15H7a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1z"/><path d="M5 18a2 2 0 0 1 2-2h11M9 8h6"/>'
  };
  var P = [
    { id: 0, es: 'Taza cerámica', en: 'Ceramic mug', price: 18, icon: 'mug', colors: ['#E9D5FF', '#FBCFE8', '#BAE6FD'] },
    { id: 1, es: 'Bolso de lona', en: 'Canvas tote', price: 32, icon: 'bag', colors: ['#FDE68A', '#D9F99D', '#E9D5FF'] },
    { id: 2, es: 'Gorra clásica', en: 'Classic cap', price: 24, icon: 'cap', colors: ['#BAE6FD', '#FECACA', '#E5E7EB'] },
    { id: 3, es: 'Libreta A5', en: 'A5 notebook', price: 12, icon: 'book', colors: ['#FBCFE8', '#FDE68A', '#C7D2FE'] }
  ];
  var state = { view: 'list', cur: 0, color: 0, cart: [] };
  var lang = function () { return document.documentElement.lang === 'en' ? 'en' : 'es'; };
  var t = function (k) { return T[lang()][k]; };
  var money = function (n) { return '$' + n.toFixed(2); };
  var svg = function (name, size) { return '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICON[name] + '</svg>'; };
  var count = function () { return state.cart.reduce(function (a, c) { return a + c.q; }, 0); };
  var total = function () { return state.cart.reduce(function (a, c) { return a + c.q * P[c.id].price; }, 0); };

  function qr() { // patrón tipo QR (decorativo), con los tres cuadros de posición
    var n = 25, s = '', seed = 7;
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var finder = function (x, y) { return '<rect x="' + x + '" y="' + y + '" width="7" height="7" fill="none" stroke="#0B0A11" stroke-width="1" transform="translate(.5 .5)"/><rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="3" height="3" fill="#0B0A11"/>'; };
    for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) {
      var inF = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if (!inF && rnd() > .52) s += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
    }
    return '<svg viewBox="-1 -1 27 27" class="d-qr" aria-hidden="true"><rect x="-1" y="-1" width="27" height="27" fill="#fff"/><g fill="#0B0A11">' + s + '</g>' + finder(0, 0) + finder(n - 7, 0) + finder(0, n - 7) + '</svg>';
  }

  function top(title, back) {
    return '<header class="d-top">' + (back ? '<button class="d-back" data-go="' + back + '" aria-label="' + t('back') + '">‹</button>' : '<span class="d-logo">T</span>') +
      '<b>' + title + '</b><button class="d-cartbtn" data-go="cart" aria-label="' + t('cart') + '">' + svg('bag', 18) + '<span class="d-badge' + (count() ? '' : ' d-hide') + '">' + count() + '</span></button></header>';
  }
  var views = {
    list: function () {
      return top(t('store')) + '<div class="d-body"><div class="d-chips"><span class="on">' + t('all') + '</span><span>' + t('news') + '</span></div>' +
        '<div class="d-grid">' + P.map(function (p) {
          return '<button class="d-card" data-open="' + p.id + '"><span class="d-tile" style="--c:' + p.colors[0] + '">' + svg(p.icon, 34) + '</span><span class="d-name">' + p[lang()] + '</span><span class="d-price">' + money(p.price) + '</span></button>';
        }).join('') + '</div></div>';
    },
    detail: function () {
      var p = P[state.cur];
      return top(p[lang()], 'list') + '<div class="d-body"><div class="d-hero" style="--c:' + p.colors[state.color] + '">' + svg(p.icon, 70) + '</div>' +
        '<div class="d-row"><b class="d-big">' + p[lang()] + '</b><b class="d-big">' + money(p.price) + '</b></div>' +
        '<p class="d-label">' + t('color') + '</p><div class="d-colors">' + p.colors.map(function (c, i) { return '<button class="d-dot' + (i === state.color ? ' on' : '') + '" data-color="' + i + '" style="--c:' + c + '" aria-label="' + t('color') + ' ' + (i + 1) + '"></button>'; }).join('') + '</div>' +
        '<button class="d-btn" data-add>' + t('add') + '</button></div>';
    },
    cart: function () {
      var lines = state.cart.length ? state.cart.map(function (c) { var p = P[c.id];
        return '<div class="d-line"><span class="d-mini" style="--c:' + p.colors[c.color] + '">' + svg(p.icon, 20) + '</span><span class="d-lname">' + p[lang()] + '<small>× ' + c.q + '</small></span><b>' + money(p.price * c.q) + '</b></div>'; }).join('') : '<p class="d-empty">' + t('empty') + '</p>';
      return top(t('cart'), 'list') + '<div class="d-body">' + lines + (state.cart.length ? '<div class="d-total"><span>' + t('total') + '</span><b>' + money(total()) + '</b></div><button class="d-btn" data-go="pay">' + t('pay') + '</button>' : '') + '</div>';
    },
    pay: function () {
      return top(t('pay'), 'cart') + '<div class="d-body d-center">' + qr() + '<p class="d-scan">' + t('scan') + '</p><p class="d-total2">' + money(total()) + '</p><p class="d-wait"><i class="d-spin"></i>' + t('wait') + '</p></div>';
    },
    ok: function () {
      return top(t('store')) + '<div class="d-body d-center"><span class="d-check"><svg viewBox="0 0 52 52" width="64" height="64"><circle cx="26" cy="26" r="24" fill="none" stroke="#34D399" stroke-width="3"/><path d="M15 27l7 7 15-15" fill="none" stroke="#34D399" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><b class="d-big">' + t('ok') + '</b><p class="d-scan">' + t('okSub') + '</p><button class="d-btn d-btn--ghost" data-reset>' + t('again') + '</button></div>';
    }
  };
  var payTimer;
  function go(view) {
    clearTimeout(payTimer); state.view = view;
    screen.innerHTML = '<div class="d-view">' + views[view]() + '</div>';
    if (view === 'pay') payTimer = setTimeout(function () { go('ok'); }, reduce ? 600 : 2600);
    var hint = root.querySelector('.demo__hint'); if (hint) hint.textContent = t('hint');
  }
  screen.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.open != null) { state.cur = +b.dataset.open; state.color = 0; go('detail'); }
    else if (b.dataset.go) go(b.dataset.go);
    else if (b.dataset.color != null) { state.color = +b.dataset.color; go('detail'); }
    else if (b.hasAttribute('data-add')) {
      var line = state.cart.filter(function (c) { return c.id === state.cur && c.color === state.color; })[0];
      if (line) line.q++; else state.cart.push({ id: state.cur, color: state.color, q: 1 });
      var badge = screen.querySelector('.d-badge'); badge.textContent = count(); badge.classList.remove('d-hide'); badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
      b.textContent = t('added'); b.classList.add('done'); setTimeout(function () { if (state.view === 'detail') go('list'); }, 700);
    }
    else if (b.hasAttribute('data-reset')) { state.cart = []; go('list'); }
  });
  addEventListener('langchange', function () { go(state.view === 'pay' ? 'cart' : state.view); });
  go('list');

  // inclinación 3D suave según el cursor (se aquieta cuando el cursor está encima, para poder tocar)
  var phone = root.querySelector('.demo__phone');
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    var tx = 0, ty = 0, cx = 0, cy = 0, over = false;
    addEventListener('pointermove', function (e) { tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5; }, { passive: true });
    phone.addEventListener('pointerenter', function () { over = true; });
    phone.addEventListener('pointerleave', function () { over = false; });
    (function loop() {
      var k = over ? .25 : 1; cx += (tx * k - cx) * .07; cy += (ty * k - cy) * .07;
      phone.style.transform = 'rotateY(' + (-14 + cx * 22) + 'deg) rotateX(' + (6 - cy * 14) + 'deg)';
      requestAnimationFrame(loop);
    })();
  }
})();

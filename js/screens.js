/* Pantallas de las apps dibujadas en <canvas> (texturas para los dispositivos 3D).
   Son ilustrativas: cuando haya capturas reales, se reemplazan por imágenes. */
const C = { bg: '#0B0A11', card: 'rgba(255,255,255,.06)', text: '#F5F3FA', t2: '#A39DB5', t3: '#6E6880', v: '#8B5CF6', p: '#EC4899', c: '#22D3EE', g: '#34D399', light: '#FBF8FD' };
const F = (w, s) => `${w} ${s}px Geist, Inter, system-ui, sans-serif`;
const M = s => `400 ${s}px "Geist Mono", ui-monospace, monospace`;

export function canvasFor(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function rr(x, X, Y, W, H, R) { x.beginPath(); x.roundRect(X, Y, W, H, R); }
function grad(x, x0, y0, x1, y1, a = C.v, b = C.p) { const g = x.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; }
function frame(x, w, h, r, bg = C.bg) { x.clearRect(0, 0, w, h); rr(x, 0, 0, w, h, r); x.fillStyle = bg; x.fill(); x.save(); rr(x, 0, 0, w, h, r); x.clip(); }
function island(x, w) { x.fillStyle = '#000'; rr(x, w / 2 - 70, 22, 140, 40, 20); x.fill(); }
function txt(x, s, X, Y, font, color) { x.font = font; x.fillStyle = color; x.fillText(s, X, Y); }

/* teléfono · panel de ventas (portada) */
export function sales(cv) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height; frame(x, w, h, 70); island(x, w);
  txt(x, 'Ventas de hoy', 40, 140, M(26), C.t3); txt(x, '$4.218.000', 40, 210, F(600, 62), C.text);
  txt(x, '▲ 18% vs ayer', 40, 256, F(500, 24), C.g);
  const hs = [.32, .5, .42, .64, .56, .78, .7, .94];
  hs.forEach((v, i) => { const bh = 190 * v, bx = 40 + i * 58, by = 480 - bh; rr(x, bx, by, 40, bh, 10); x.fillStyle = grad(x, 0, by, 0, 480, C.p, C.v); x.globalAlpha = .55 + i * .055; x.fill(); x.globalAlpha = 1; });
  [['Kiosko · Tienda Centro', 'QR · PayPal', C.g], ['App · Pedido #2041', 'MercadoPago', C.v], ['Kiosko · Tienda Norte', 'Datáfono', C.p]].forEach(([t, s, c], i) => {
    const y = 530 + i * 120; rr(x, 30, y, w - 60, 100, 26); x.fillStyle = C.card; x.fill();
    x.beginPath(); x.arc(70, y + 50, 9, 0, 7); x.fillStyle = c; x.fill(); txt(x, t, 98, y + 44, F(500, 26), C.text); txt(x, s, 98, y + 76, M(20), C.t3);
  });
  rr(x, 30, h - 150, w - 60, 90, 24); x.fillStyle = grad(x, 30, 0, w - 30, 0); x.fill(); x.textAlign = 'center'; txt(x, 'Nueva venta', w / 2, h - 94, F(600, 28), C.text); x.textAlign = 'left';
  x.restore(); return cv;
}

/* tablet · kiosko SCREEN */
export function kiosk(cv) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height; frame(x, w, h, 40, C.light);
  x.fillStyle = grad(x, 0, 0, w, 0); x.fillRect(0, 0, w, 96); txt(x, 'Tu Tienda', 40, 62, F(600, 36), '#fff'); x.textAlign = 'right'; txt(x, 'Modo kiosko · COP', w - 40, 60, F(500, 24), 'rgba(255,255,255,.85)'); x.textAlign = 'left';
  const prods = [['Vestido', '$129.000', '#F9A8D4'], ['Bolso', '$89.000', '#C4B5FD'], ['Gafas', '$59.000', '#A5F3FC'], ['Blusa', '$69.000', '#FBCFE8'], ['Tenis', '$199.000', '#DDD6FE'], ['Reloj', '$249.000', '#FDE68A']];
  prods.forEach(([n, p, c], i) => { const cx = 40 + (i % 3) * 230, cy = 130 + Math.floor(i / 3) * 290; rr(x, cx, cy, 210, 270, 22); x.fillStyle = '#fff'; x.fill();
    rr(x, cx + 14, cy + 14, 182, 160, 16); x.fillStyle = c; x.fill(); txt(x, n, cx + 18, cy + 214, F(600, 26), '#1F1524'); txt(x, p, cx + 18, cy + 248, F(400, 22), '#6B5F6E'); });
  const px = 750; rr(x, px, 130, w - px - 40, h - 170, 26); x.fillStyle = '#17111F'; x.fill();
  x.textAlign = 'center'; const mid = px + (w - px - 40) / 2; txt(x, 'Escanea y paga', mid, 190, F(600, 28), '#fff');
  rr(x, mid - 120, 220, 240, 240, 16); x.fillStyle = '#fff'; x.fill();
  for (let r = 0; r < 11; r++) for (let q = 0; q < 11; q++) { const corner = (r < 3 && q < 3) || (r < 3 && q > 7) || (r > 7 && q < 3); if (corner || ((r * 7 + q * 13 + r * q) % 3 === 0)) { x.fillStyle = '#17111F'; x.fillRect(mid - 104 + q * 19, 236 + r * 19, 17, 17); } }
  txt(x, 'Total $218.000', mid, 510, F(600, 28), '#F9A8D4');
  rr(x, mid - 130, 540, 260, 60, 30); x.fillStyle = grad(x, mid - 130, 0, mid + 130, 0); x.fill(); txt(x, 'MercadoPago · PayPal', mid, 580, F(600, 21), '#fff'); x.textAlign = 'left';
  x.restore(); return cv;
}

/* teléfono · pago confirmado */
export function paid(cv) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height; frame(x, w, h, 70, C.light); island(x, w); x.textAlign = 'center';
  x.beginPath(); x.arc(w / 2, 360, 90, 0, 7); x.fillStyle = '#EEEAFD'; x.fill();
  x.strokeStyle = '#5B4BC4'; x.lineWidth = 14; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(w / 2 - 40, 362); x.lineTo(w / 2 - 8, 394); x.lineTo(w / 2 + 44, 330); x.stroke();
  txt(x, 'Pago confirmado', w / 2, 540, F(600, 44), '#1F1524'); txt(x, '$218.000 · PayPal', w / 2, 590, F(400, 28), '#6B5F6E');
  rr(x, w / 2 - 200, 650, 400, 60, 30); x.fillStyle = '#FBE6EE'; x.fill(); txt(x, 'Tablet actualizada · Socket.IO', w / 2, 690, F(500, 22), '#AE3766');
  rr(x, 40, h - 160, w - 80, 90, 24); x.fillStyle = '#1F1524'; x.fill(); txt(x, 'Ver recibo', w / 2, h - 103, F(600, 28), '#fff'); x.textAlign = 'left';
  x.restore(); return cv;
}

/* teléfono · STEII reservas */
export function booking(cv) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height; frame(x, w, h, 70); island(x, w);
  txt(x, 'Torre Kiin · Apto 1204', 40, 140, M(22), C.t3); txt(x, 'Reservar amenidad', 40, 196, F(600, 40), C.text);
  txt(x, 'Noviembre', 40, 270, F(500, 26), C.t2);
  for (let i = 0; i < 35; i++) { const cx = 40 + (i % 7) * 66, cy = 300 + Math.floor(i / 7) * 66; rr(x, cx, cy, 54, 54, 14);
    x.fillStyle = i === 17 ? grad(x, cx, cy, cx + 54, cy + 54) : (i % 6 === 0 ? 'rgba(255,255,255,.03)' : C.card); x.fill();
    x.textAlign = 'center'; txt(x, String(i + 1 > 30 ? i - 29 : i + 1), cx + 27, cy + 36, F(500, 20), i === 17 ? '#fff' : C.t2); x.textAlign = 'left'; }
  [['Piscina', '10:00 — 11:00', C.c], ['Coworking', '15:30 — 17:00', C.v], ['BBQ terraza', '19:00 — 22:00', C.p]].forEach(([t, s, c], i) => { const y = 660 + i * 112; rr(x, 30, y, w - 60, 94, 24); x.fillStyle = C.card; x.fill();
    rr(x, 50, y + 22, 8, 50, 4); x.fillStyle = c; x.fill(); txt(x, t, 80, y + 44, F(600, 26), C.text); txt(x, s, 80, y + 76, M(20), C.t3); });
  x.restore(); return cv;
}

/* teléfono · STEII amenidades + mapa */
export function amenities(cv) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height; frame(x, w, h, 70, C.light); island(x, w);
  txt(x, 'Hola, Ana', 40, 150, F(600, 40), '#1F1524'); txt(x, 'Servicios del edificio', 40, 196, F(400, 24), '#6B5F6E');
  [['Gimnasio', '#C4B5FD'], ['Piscina', '#A5F3FC'], ['Lavandería', '#FBCFE8'], ['Coworking', '#FDE68A']].forEach(([t, c], i) => { const cx = 40 + (i % 2) * 245, cy = 240 + Math.floor(i / 2) * 210; rr(x, cx, cy, 225, 190, 26); x.fillStyle = c; x.fill(); txt(x, t, cx + 22, cy + 160, F(600, 26), '#1F1524'); });
  rr(x, 40, 690, w - 80, 300, 26); x.fillStyle = '#E9E4F5'; x.fill();
  x.strokeStyle = '#fff'; x.lineWidth = 16; [[60, 760, w - 60, 840], [200, 700, 260, 980], [60, 920, w - 60, 880]].forEach(([a, b, c, d]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); });
  x.beginPath(); x.arc(330, 830, 22, 0, 7); x.fillStyle = C.p; x.fill(); x.beginPath(); x.arc(330, 830, 9, 0, 7); x.fillStyle = '#fff'; x.fill();
  rr(x, 40, h - 150, w - 80, 90, 24); x.fillStyle = grad(x, 40, 0, w - 40, 0); x.fill(); x.textAlign = 'center'; txt(x, 'Pagar con tarjeta', w / 2, h - 93, F(600, 28), '#fff'); x.textAlign = 'left';
  x.restore(); return cv;
}

/* teléfono · tienda (catálogo + push) */
export function store(cv) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height; frame(x, w, h, 70, C.light); island(x, w);
  rr(x, 24, 90, w - 48, 120, 28); x.fillStyle = '#1F1524'; x.fill(); rr(x, 46, 116, 66, 66, 16); x.fillStyle = grad(x, 46, 116, 112, 182); x.fill();
  txt(x, '¡Tu pedido va en camino!', 130, 146, F(600, 24), '#fff'); txt(x, 'Notificación push · FCM', 130, 180, M(18), '#A39DB5');
  txt(x, 'Nueva colección', 40, 290, F(600, 40), '#1F1524');
  [['#F9A8D4', 'Vestido lino', '$129.000'], ['#C4B5FD', 'Bolso tote', '$89.000'], ['#A5F3FC', 'Sandalias', '$99.000'], ['#FDE68A', 'Gafas sol', '$59.000']].forEach(([c, n, p], i) => { const cx = 40 + (i % 2) * 245, cy = 330 + Math.floor(i / 2) * 330; rr(x, cx, cy, 225, 310, 24); x.fillStyle = '#fff'; x.fill();
    rr(x, cx + 12, cy + 12, 201, 200, 18); x.fillStyle = c; x.fill(); txt(x, n, cx + 18, cy + 252, F(600, 24), '#1F1524'); txt(x, p, cx + 18, cy + 286, F(400, 22), '#6B5F6E'); });
  rr(x, 40, h - 150, w - 80, 90, 24); x.fillStyle = '#1F1524'; x.fill(); x.textAlign = 'center'; txt(x, 'Carrito · 2 productos', w / 2, h - 93, F(600, 26), '#fff'); x.textAlign = 'left';
  x.restore(); return cv;
}

/* portátil · Ofrece tu Talento */
export function jobs(cv) {
  const x = cv.getContext('2d'), w = cv.width, h = cv.height; frame(x, w, h, 18, '#FBFAFD');
  x.fillStyle = '#1F1524'; x.fillRect(0, 0, w, 80); txt(x, 'Ofrece tu Talento', 40, 52, F(600, 30), '#fff');
  ['Empleos', 'Empresas', 'Mi perfil'].forEach((t, i) => txt(x, t, w - 460 + i * 150, 50, F(500, 22), '#A39DB5'));
  rr(x, 40, 110, 280, h - 150, 18); x.fillStyle = '#F1EEF7'; x.fill(); txt(x, 'Filtros', 64, 160, F(600, 24), '#1F1524');
  ['Ventas', 'Caja', 'Bodega', 'Atención'].forEach((t, i) => { rr(x, 64, 190 + i * 60, 30, 30, 8); x.fillStyle = i < 2 ? grad(x, 64, 0, 94, 0) : '#fff'; x.fill(); txt(x, t, 110, 214 + i * 60, F(400, 22), '#1F1524'); });
  [['Asesor/a de ventas', 'Tienda Multiplaza · Ciudad de Panamá'], ['Cajero/a', 'Albrook Mall · Tiempo completo'], ['Jefe/a de bodega', 'Centro de distribución · Colón']].forEach(([t, s], i) => { const y = 110 + i * 150; rr(x, 350, y, w - 390, 130, 18); x.fillStyle = '#fff'; x.fill();
    rr(x, 374, y + 24, 82, 82, 16); x.fillStyle = ['#F9A8D4', '#C4B5FD', '#A5F3FC'][i]; x.fill(); txt(x, t, 480, y + 58, F(600, 28), '#1F1524'); txt(x, s, 480, y + 96, F(400, 21), '#6B5F6E');
    rr(x, w - 220, y + 40, 150, 52, 26); x.fillStyle = grad(x, w - 220, 0, w - 70, 0); x.fill(); x.textAlign = 'center'; txt(x, 'Postular', w - 145, y + 74, F(600, 21), '#fff'); x.textAlign = 'left'; });
  x.restore(); return cv;
}

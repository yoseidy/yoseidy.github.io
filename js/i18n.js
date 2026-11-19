/* Idioma ES/EN. El español sale del HTML; aquí solo va el inglés.
   El idioma elegido se recuerda en localStorage (si está disponible). */
(function () {
  var EN = {
    'nav.about': 'About', 'nav.services': 'Services', 'nav.apps': 'Apps', 'nav.ai': 'AI', 'nav.exp': 'Experience', 'nav.work': 'Projects', 'nav.cta': "Let's talk →",
    'hero.chip': 'Available for projects · Remote',
    'hero.lead': 'I turn ideas into real apps: I design, build and <b>publish them on the App Store and Google Play</b>, together with the web panel and API behind them. 9 years shipping products used by real customers today.',
    'hero.b1': 'What can I do for you? →', 'hero.b2': 'See projects',
    'hero.m1': 'years in production', 'hero.m2': 'published apps', 'hero.m3': 'stores: App Store · Google Play',
    'hero.f1': 'Published and in use', 'hero.f2': '6 apps in stores', 'hero.f3': 'for real brands', 'strip': 'STACK IN PRODUCTION',
    'ab.k': '01 · ABOUT', 'ab.t1': 'The whole product,', 'ab.t2': 'one person.',
    'ab.p': 'I’m Yoseidy, a Computer Engineer. I started in frontend 9 years ago and grew into owning complete products: today, at 2becommerce, I design the Flutter app, the Vue panel and the Node API, and I make sure they reach the <b>App Store and Google Play</b> and stay up to date.',
    'ab.p2': 'I’ve worked in Venezuela, Panama and Colombia for fashion stores, residential buildings and wholesalers. I like to understand the business before writing code, explain things without jargon, and deliver something people actually use.',
    'ab.val1t': 'From idea to store', 'ab.val1': 'One person for design, app, panel, API and publishing.',
    'ab.val2t': 'Built to last', 'ab.val2': 'Clean architecture, tidy code and maintenance after launch.',
    'ab.val3t': 'Clear communication', 'ab.val3': 'Frequent updates, explained decisions and realistic dates.',
    'sv.k': '02 · SERVICES', 'sv.t1': 'What can I', 'sv.t2': 'do for you?', 'sv.lead': 'I work with companies, agencies and founders, remotely or freelance. I can take the whole project or join your team.',
    'sv.1t': 'Custom mobile app', 'sv.1': 'Your iPhone and Android app with Flutter: one codebase, polished design, login, payments, notifications and whatever your business needs.', 'sv.1f': 'ideal for: launching your product',
    'sv.2t': 'App Store & Google Play publishing', 'sv.2': 'I handle the whole process: developer accounts, store listings, screenshots, policies, Apple and Google reviews, and updates, supporting you through every review.', 'sv.2f': 'ideal for: finished apps that can’t get out',
    'sv.3t': 'Your Shopify store as an app', 'sv.3': 'I turn your Shopify store into a native app connected to your products, orders and payments, with push notifications to sell more.', 'sv.3f': 'ideal for: e-commerce brands',
    'sv.4t': 'Web panel & API', 'sv.4': 'The admin panel (Vue or Angular) and the API (Node.js) to manage users, orders, bookings, content and payments.', 'sv.4f': 'ideal for: running your business',
    'sv.5t': 'Kiosks & in-store apps', 'sv.5': 'Tablets in kiosk mode so your customers can shop and pay in store with QR or card terminal, managed remotely.', 'sv.5f': 'ideal for: retail and points of sale',
    'sv.6t': 'Maintenance & improvements', 'sv.6': 'I rescue and update existing apps: new Flutter versions, bugs, performance and new features, using AI to move faster.', 'sv.6f': 'ideal for: apps you already have',
    'sv.cta': 'Tell me about your project →', 'sv.ctas': 'No-commitment quote',
    'ai.f1t': 'Understand and plan', 'ai.f1': 'I define with the client what we build and how, before touching code.',
    'ai.f2t': 'The agent proposes', 'ai.f2': 'I use Claude Code to speed up implementation and documentation.',
    'ai.f3t': 'I review and fix', 'ai.f3': 'I read every change, check that it works in the app and fix what doesn’t meet the bar. Nothing goes in without my approval.',
    'ai.f4t': 'Deliver and publish', 'ai.f4': 'Faster, without sacrificing quality: on time in the stores and with tidy code.',
    'ab.f1': 'location', 'ab.f2': 'work mode', 'ab.v2': 'Remote · Freelance', 'ab.f3': 'education', 'ab.v3': 'B.S. Computer Eng. · UCLA ’21', 'ab.f4': 'languages', 'ab.v4': 'Spanish native · basic technical English',
    'st.k': '04 · WHAT I BUILD', 'st.t1': 'Everything your', 'st.t2': 'digital product needs', 'st.sub': 'The app your customers use, the panel you run your business from, and the system that connects it all. I build the whole thing, so it works today and can grow tomorrow.',
    'st.mk': 'Mobile app', 'st.m': 'One app for iPhone and Android, built once', 'st.mp': 'Your customers download it from the stores and it feels fast, smooth and made for them.',
    'st.m1': 'Login, profiles, payments, maps and notifications', 'st.m2': 'A clean structure to add features without breaking what already works', 'st.m3': 'Signed builds and publishing on the App Store and Google Play',
    'st.wk': 'Web panel', 'st.w': 'A clear panel to run your business', 'st.wp': 'Your team manages everything from the browser, without needing a developer for day-to-day work.', 'st.basic': '(basic)',
    'st.w1': 'Users, orders, bookings, content and payments in one place', 'st.w2': 'Permissions based on each team member’s role', 'st.w3': 'Information that updates instantly, without reloading', 'st.w4': 'Change branding, prices or payment methods without touching code',
    'st.ak': 'Backend', 'st.a': 'The engine that connects it all', 'st.ap': 'Secure, well organized and ready to serve many users, or several brands at once.',
    'st.a1': 'Protected data with role-based access', 'st.a2': 'One platform for several clients or stores', 'st.a3': 'Databases designed to grow',
    'st.ik': 'Integrations', 'st.i': 'Connected to what you already use', 'st.ip': 'Your app talks to your store, your payments and your tools.',
    'st.i1': 'Shopify store in sync: products, orders and customers', 'st.i2': 'Online and in-store payments, with QR or card terminal', 'st.i3': 'Push notifications and maps',
    'ai.k': '05 · APPLIED AI', 'ai.t1': 'Built with agents,', 'ai.t2': 'reviewed by a human.',
    'ai.lead': 'I code with AI agents every day. The difference isn’t using them — it’s knowing how to review what they deliver: nothing reaches production until I’ve read it, tested it and fixed it.',
    'ai.c1t': 'Coding agents', 'ai.c1': 'Claude Code to plan, implement and refactor across Flutter, Vue and Node.',
    'ai.c2t': 'Auditing', 'ai.c2': 'I review and fix AI-generated code before merging it.',
    'ai.c3t': 'Automation', 'ai.c3': 'Custom agent skills, MCP and browser automation.',
    'ex.k': '06 · EXPERIENCE', 'ex.t1': '9 years', 'ex.t2': 'in production', 'ex.d1': 'dec 2022 — now', 'ex.d2': 'jan 2019 — dec 2022',
    'ex.p1': 'I design, build and ship Flutter apps (retail, kiosk and bookings). I build all three layers of each product: Node.js API, Vue 3 panel and Flutter app with Clean Architecture. Payments, Shopify Admin API, real time with Socket.IO and push with FCM.',
    'ex.co2': 'Grupo Ari · Panama City', 'ex.p2': 'Angular and Laravel web platforms for retail stores, hybrid apps with Ionic and a Django backend. I led “Ofrece tu Talento”.',
    'ex.r3': 'Freelance Web Developer', 'ex.co3': 'Self-employed · Panama', 'ex.p3': 'Web projects, frontend work and technical support for independent clients.', 'ex.r4': 'B.S. in Computer Engineering',
    'wk.k': '07 · PROJECTS', 'wk.t1': 'Work', 'wk.t2': 'in production', 'wk.hint': 'Scroll through each project · drag to rotate the devices',
    'w0.k': 'In-store kiosk · 2becommerce', 'w0.p': 'Flutter app for touch tablets + web panel + API. Multi-tenant: each store sets its brand, currency, taxes and payments from the panel, with no rebuild. Customers pay by scanning a QR and the tablet confirms instantly.',
    'w1.k': 'Building rentals & services', 'w1.p': 'iOS/Android app for residents: amenity booking with calendar, card payments, Google Maps and multi-language. One codebase reused across several properties.',
    'w2.t': 'Store apps', 'w2.k': 'Snatched Body · Fajas Salomé · 2becommerce', 'w2.p': 'Shopping apps for fashion brands connected to their Shopify store: category catalog, product pages with sizes, cart, integrated payments and push notifications. Published on the App Store and Google Play.',
    'w4.k': 'Wholesale multi-store · 2becommerce', 'w4.p': 'Multi-store wholesale buying app that brings several Colombian brands of shapewear, fajas and jeans into one catalog, with volume pricing and orders for businesses. Published on the App Store and Google Play.', 'w4.t1': 'Multi-store', 'w4.t2': 'Volume pricing',
    'w3.k': 'Job platform · Grupo Ari', 'w3.p': 'Job-board web portal with candidate profiles and job postings. I led its development.',
    'wk.note': '// every screen is a real screenshot of the published apps',
    'wr.t1': 'I write', 'wr.t2': 'about code', 'wr.meta': 'medium · nov 27 2025 · flutter (in Spanish)', 'wr.sum': 'Display name, package name and bundle ID: the safe way to change them without breaking the project.', 'wr.go': 'Read article ↗', 'wr.next': 'coming soon', 'wr.nt': 'Flutter, architecture and building with AI agents', 'wr.more': 'See all on Medium ↗',
    'cv.k': '09 · RESUME', 'cv.t1': 'Download my', 'cv.lead': 'Three versions by role. They download in the language you’re viewing the page in.',
    'cv.fs': 'Mobile, frontend and backend: the full profile.', 'cv.mb': 'iOS/Android apps, architecture and publishing.', 'cv.fe': 'Vue 3, Angular, dashboards and real time.', 'cv.dl': 'Download ↓',
    'ct.k': '11 · CONTACT', 'ct.t1': 'Shall we build', 'ct.t2': 'something?', 'ct.name': 'Name', 'ct.msg': 'Message', 'ct.send': 'Send message →',
    'ct.type': 'How can I help?', 'ct.o1': 'A new app', 'ct.o2': 'Publish my app on the App Store / Google Play', 'ct.o3': 'Web panel or API', 'ct.o4': 'Improve or maintain an existing app', 'ct.o5': 'Job offer', 'ct.o6': 'Something else',
    'ct.msgph': 'Tell me about your idea, timeline and anything you have in mind…', 'ct.call': 'I’d prefer a call or video call', 'ct.when': 'Day and time that works for you', 'ct.phone': 'WhatsApp or phone (optional)', 'ct.tz': 'Colombia time (UTC−5). I’ll confirm by email or WhatsApp.',
    'pr.k': '03 · HOW WE WORK', 'pr.t1': 'From idea to store,', 'pr.t2': 'step by step.', 'pr.lead': 'A clear process so you always know where your project stands and what comes next.',
    'pr.1t': 'We talk', 'pr.1': 'A free call to understand your business, your idea and what you need to achieve.',
    'pr.2t': 'Proposal', 'pr.2': 'I send you in writing what we’ll do, how long it takes and what it costs. No fine print.',
    'pr.3t': 'Design', 'pr.3': 'You see the main screens before any code is written, and we adjust them together.',
    'pr.4t': 'Development', 'pr.4': 'Frequent progress you can try on your own phone.',
    'pr.5t': 'Publishing', 'pr.5': 'I upload your app to the App Store and Google Play and support you through the reviews.',
    'pr.6t': 'Support', 'pr.6': 'I stay with you after launch: improvements, updates and new features.',
    'fq.k': '10 · FAQ', 'fq.t1': 'What people', 'fq.t2': 'usually ask me',
    'fq.1q': 'How long does it take to build an app?', 'fq.1a': 'It depends on what you need. After our first call I give you a concrete written estimate, split into stages, so you know what you get and when.',
    'fq.2q': 'Do you handle publishing on the App Store and Google Play?', 'fq.2a': 'Yes. I guide you to create the developer accounts under your company’s name, prepare the listing, screenshots and policies, and handle Apple and Google reviews until the app is live.',
    'fq.3q': 'Do I own the app and the code?', 'fq.3a': 'Yes. Store accounts, code and access are in your name from the start.',
    'fq.4q': 'What happens after launch?', 'fq.4a': 'I can keep working with you on maintenance: fixing bugs, updating to new iOS and Android versions and adding new features when you need them.',
    'fq.5q': 'I already have an app — can you improve it?', 'fq.5a': 'Of course. I review the code, tell you honestly what state it’s in and propose how to improve or update it.',
    'fq.6q': 'Do you work alone or with my team?', 'fq.6a': 'Both: I can take the whole project or join your team as a Flutter or frontend developer.',
    'wa.t': 'Let’s talk?', 'ts.k': 'TESTIMONIALS', 'ts.t1': 'What people say', 'ts.t2': 'about working with me',
    'ft': 'made with Flutter at heart, Three.js on screen and a well-audited AI agent.',
    /* v3 (18 nov 2026): textos nuevos o cambiados */
    'nav.free': 'Freelance', 'hero.chip': 'Available · Remote and freelance',
    'hero.lead': 'I design, build and <b>publish apps on the App Store and Google Play</b>, together with the web panel and API behind them. 9 years building products used by real customers today.',
    'hero.p1s': 'Hiring for your team?', 'hero.p1b': 'See projects and experience →',
    'hero.p2s': 'Have a project?', 'hero.p2b': 'See freelance services →',
    'hero.m3': 'countries: VE · PA · CO',
    'wk.k': 'PROJECTS', 'wk.t1': 'Work in production.', 'wk.t2': 'What needed solving, and how I solved it.',
    'cs.need': 'The challenge', 'cs.did': 'What I did', 'cs.res': 'How it works', 'cs.res2': 'Outcome',
    'c0.k': 'In-store kiosk', 'c0.s': 'A system for selling in physical stores from a tablet: the kiosk app, the web panel and the API that connects them.',
    'c0.d1': 'Each store needed its own brand, currency, taxes and payment methods, without maintaining a separate app per client.',
    'c0.d2': 'I designed a multi-tenant architecture: onboarding a store is configuration in the panel, not new development. I built the Flutter app, the Vue 3 panel and the Node.js API.',
    'c0.d3': 'Customers pay by scanning a QR code with their phone and the tablet confirms it instantly. Tablets are managed remotely in kiosk mode.',
    'c1.k': 'Building rentals & services', 'c1.s': 'iPhone and Android app that lets residents book amenities and pay from their phone.',
    'c1.d1': 'One app had to serve several buildings, each with its own services, schedules and language.',
    'c1.d2': 'The full cycle: design, development, store release and maintenance. Calendar bookings with time slots, card payments, Google Maps and multi-language.',
    'c1.d3': 'A single codebase reused across several properties, with its own admin panel and booking engine.',
    'c2.t': 'Shopify store apps', 'c2.s': 'Shopping apps for fashion brands, connected to their Shopify store.',
    'c2.d1': 'Sell from their own app without duplicating the catalog, orders or customers already in Shopify.',
    'c2.d2': 'I integrated the Shopify Admin API (REST and GraphQL) for category catalog, sizes, cart and orders, with payments and push notifications.',
    'c2.d3': 'Published on the App Store and Google Play and in sync with each brand’s online store.',
    'c3.k': 'Wholesale multi-store', 'c3.s': 'A wholesale app that brings several Colombian brands of shapewear, fajas and jeans into one catalog.',
    'c3.d1': 'Businesses buy in volume and from several brands at once, at prices different from retail.',
    'c3.d2': 'Multi-store Flutter app with volume pricing and orders for businesses.', 'c3.d3': 'Published on the App Store and Google Play.',
    'c3.t1': 'Multi-store', 'c3.t2': 'Volume pricing',
    'ex.k': 'EXPERIENCE', 'ex.t1': '9 years building product.', 'ex.t2': 'From frontend to the whole product.',
    'ex.p2': 'Angular and Laravel web platforms for retail stores, hybrid apps with Ionic and a Django backend. I led “Ofrece tu Talento”, a job portal.',
    'ab.k': 'ABOUT', 'ab.med': 'I write about Flutter ↗', 'ai.k': 'APPLIED AI',
    'fr.k': 'FREELANCE', 'fr.t1': 'Have a project?', 'fr.t2': 'I take it from idea to the stores.', 'fr.proc': 'How we work', 'fr.faq': 'Frequently asked questions',
    'cv.k': 'RESUME', 'cv.t1': 'Download my resume.', 'cv.t2': 'Three versions by role.', 'cv.lead': 'They download in the language you’re viewing the page in.',
    'ct.k': 'CONTACT', 'ct.t2': 'together?'
  };
  var ES = {}, ESPH = {}, nodes = document.querySelectorAll('[data-i18n]'), phs = document.querySelectorAll('[data-i18n-ph]');
  nodes.forEach(function (n) { ES[n.dataset.i18n] = n.innerHTML; });
  phs.forEach(function (n) { ESPH[n.dataset.i18nPh] = n.getAttribute('placeholder'); });
  var WA = { es: 'Hola Yoseidy, vi tu portafolio y me gustaría hablar sobre un proyecto.', en: 'Hi Yoseidy, I saw your portfolio and would like to talk about a project.' };

  function apply(lang) {
    var dict = lang === 'en' ? EN : ES;
    nodes.forEach(function (n) { var v = dict[n.dataset.i18n]; if (v != null) n.innerHTML = v; });
    phs.forEach(function (n) { var v = lang === 'en' ? EN[n.dataset.i18nPh] : ESPH[n.dataset.i18nPh]; if (v) n.setAttribute('placeholder', v); });
    var wa = document.getElementById('waBtn'); if (wa) wa.href = 'https://wa.me/573126586157?text=' + encodeURIComponent(WA[lang] || WA.es);
    document.documentElement.lang = lang;
    document.querySelectorAll('#langBtn [data-l]').forEach(function (s) { s.classList.toggle('on', s.dataset.l === lang); });
    document.querySelectorAll('[data-cv]').forEach(function (a) { a.href = 'cv/CV_Yoseidy_Perez_' + a.dataset.cv + '_' + lang.toUpperCase() + '.pdf'; });
    document.querySelectorAll('.cvlang').forEach(function (s) { s.textContent = lang.toUpperCase(); });
    try { localStorage.setItem('lang', lang); } catch (e) {}
    window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }
  var saved = null; try { saved = localStorage.getItem('lang'); } catch (e) {}
  var initial = saved || ((navigator.language || 'es').slice(0, 2) === 'es' ? 'es' : 'en');
  window.currentLang = function () { return document.documentElement.lang; };
  document.getElementById('langBtn').addEventListener('click', function () { apply(document.documentElement.lang === 'es' ? 'en' : 'es'); });
  apply(initial);
})();

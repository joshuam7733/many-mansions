/* Generates every HTML page from assets/data.js.  Run:  node build.js
   Set SITE_URL to your real domain before deploying (used in canonical tags + sitemap). */
const fs = require('fs');
const path = require('path');
const SS = require('./assets/data.js');

const SITE_URL = process.env.SITE_URL || 'https://themanymansions.com';
// PREVIEW=1 writes a self-contained copy to ./preview (used for the shareable preview link).
const PREVIEW = !!process.env.PREVIEW;
const OUT = PREVIEW ? path.join(__dirname, 'preview') : __dirname;
const { AXES, FAMILIES, TYPES, FIGURES, MISSIONS } = SS;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const famVar = f => `var(--fam-${f})`;

const LOGO = `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="16" cy="16" r="5.5" fill="currentColor" fill-opacity=".18"/>${Array.from({ length: 12 }, (_, i) => { const t = (i * Math.PI) / 6; return `<line x1="${(16 + Math.cos(t) * 8.5).toFixed(2)}" y1="${(16 + Math.sin(t) * 8.5).toFixed(2)}" x2="${(16 + Math.cos(t) * 14).toFixed(2)}" y2="${(16 + Math.sin(t) * 14).toFixed(2)}" stroke-linecap="round"/>`; }).join('')}</svg>`;
const FAVICON = `data:image/svg+xml,${encodeURIComponent(LOGO.replace('currentColor', '#B5852F').replace(/currentColor/g, '#B5852F').replace('aria-hidden="true"', 'xmlns="http://www.w3.org/2000/svg"'))}`;

function page({ title, desc, canonical, base = '', body, scripts = [], header = 'full', jsonld = '' }) {
  const nav = header === 'full' ? `
      <nav class="nav" aria-label="Main">
        <a href="${base}index.html#how">How it works</a>
        <a href="${base}index.html#pillars">The 12 Pillars</a>
        <a href="${base}types/index.html">All 16 types</a>
        <a href="${base}index.html#faq">FAQ</a>
      </nav>` : '';
  const action = header === 'quiz'
    ? `<button class="btn btn-ghost btn-sm" data-act="restart">Restart</button>`
    : `<a class="btn btn-primary btn-sm" href="${base}quiz.html"><span class="hide-sm">Take the test</span><span class="show-sm">Start</span> <span aria-hidden="true">→</span></a>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE_URL}${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE_URL}${canonical}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1E2A4A">
<link rel="icon" href="${FAVICON}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${base}assets/style.css">
<!-- Google AdSense: paste your <script async src="https://pagead2.googlesyndication.com/..."> tag here once approved -->
${jsonld}
</head>
<body>
<a class="sr-only" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${base}index.html">${LOGO}Many Mansions</a>${nav}
    <div class="header-actions">
      <button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode"></button>
      ${action}
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
${header === 'quiz' ? '' : footer(base)}
<script src="${base}assets/data.js"></script>
<script src="${base}assets/app.js"></script>
${scripts.map(s => `<script src="${base}assets/${s}"></script>`).join('\n')}
</body>
</html>
`;
}

function footer(base) {
  return `<footer class="site-footer">
  <div class="wrap">
    <a class="brand" href="${base}index.html">${LOGO}Many Mansions</a>
    <nav aria-label="Footer">
      <a href="${base}quiz.html">Take the test</a>
      <a href="${base}types/index.html">All 16 types</a>
      <a href="${base}index.html#pillars">The 12 Pillars</a>
      <a href="${base}index.html#faq">FAQ</a>
    </nav>
    <p>Many Mansions is an independent, just-for-fun personality test. It is not affiliated with, endorsed by, or speaking for The Church of Jesus Christ of Latter-day Saints. Nothing here measures worthiness or righteousness.</p>
    <p>© ${new Date().getFullYear()} Many Mansions</p>
  </div>
</footer>`;
}

function sliders(v) {
  let html = '', last = null;
  AXES.forEach((a, i) => {
    if (a.fam !== last) { last = a.fam; html += `<div class="fam-label" style="--c:${famVar(a.fam)}"><span class="dot"></span>${FAMILIES[a.fam].name}</div>`; }
    const x = v[i], d = x - 50;
    const lab = Math.abs(d) < 6 ? 'Balanced' : d > 0 ? `${x}% ${a.right}` : `${100 - x}% ${a.left}`;
    html += `<div class="slider" style="--c:${famVar(a.fam)}">
      <div class="top"><strong>${esc(a.name)}</strong><span class="${Math.abs(d) < 6 ? 'bal' : ''}">${esc(lab)}</span></div>
      <div class="track" role="img" aria-label="${esc(a.left)} ${100 - x}%, ${esc(a.right)} ${x}%"><span class="mid"></span><span class="fill" style="left:${Math.min(x, 50)}%;width:${Math.abs(d)}%"></span><span class="knob" style="left:${x}%"></span></div>
      <div class="ends"><span class="${d <= -6 ? 'on' : ''}">${esc(a.left)}</span><span class="${d >= 6 ? 'on' : ''}">${esc(a.right)}</span></div>
    </div>`;
  });
  return html;
}

const FAQ = [
  ['Why is it called Many Mansions?', 'It comes from John 14:2: "In my Father\'s house are many mansions." Latter-day Saints know the verse well (it is echoed in Doctrine and Covenants 98:18), and it captures the idea behind this test: the Church is full of very different people, and there is room for every one of them. Your type describes how you live your faith, never whether you belong.'],
  ['Are the 16 types connected to the degrees of glory?', 'No. Joseph Smith taught that the many mansions include the kingdoms of glory, and that is exactly why no type here is higher or lower than another. All 16 types are in the same Father\'s house. We use the verse for its first promise to the disciples: there is a place prepared for each of us.'],
  ['Are Mormons and Latter-day Saints the same people?', 'Yes. "Mormon" is a long-standing nickname for members of The Church of Jesus Christ of Latter-day Saints, taken from the Book of Mormon. Since 2018 the Church has asked people to use its full name, and many members prefer "Latter-day Saints." This test is for anyone who identifies with either name.'],
  ['Is this an official Church quiz?', 'No. Many Mansions is an independent, just-for-fun project. It is not affiliated with or endorsed by The Church of Jesus Christ of Latter-day Saints, and it does not represent Church doctrine.'],
  ['Does this measure how righteous or faithful I am?', 'Not at all. Every pillar has two good sides. It describes how you live and express your faith: your culture, habits and style. It never ranks worthiness.'],
  ['Can I take it if I am not a member?', 'Yes. Friends of the Church, investigators, former members and the simply curious are all welcome. Answer the way that fits your experience.'],
  ['What happens to my answers?', 'Your answers stay in your own browser. Your shareable result link contains only your 12 pillar scores, nothing that identifies you.'],
  ['How are the matches calculated?', 'Each type, scripture figure and mission has a profile across the same 12 pillars. We compare your scores with each profile and show the closest matches as a percentage.']
];

// ---------------- index ----------------
const ex = TYPES[0];
const indexBody = `
<section class="hero">
  <div class="wrap">
    <div>
      <div class="eyebrow">The Mormon personality test</div>
      <h1>What kind of <em>Latter-day Saint</em> are you, really?</h1>
      <p class="hero-verse">“In my Father’s house are many mansions.” <span>John 14:2</span></p>
      <p class="hero-sub">There's more than one way to be a Saint, and room for every one of them. Answer a few honest statements to find your type across 12 pillars of faith, culture and community, plus your scripture companion and dream mission, delivered as your very own call letter.</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="quiz.html">Open my call <span aria-hidden="true">→</span></a>
        <a class="btn btn-ghost" href="#pillars">See the 12 Pillars</a>
      </div>
      <ul class="hero-ticks"><li>Free</li><li>No sign-up</li><li>4 to 8 minutes</li><li>16 types</li></ul>
    </div>
    <div class="hero-visual" aria-hidden="true">
      <div class="halo"></div>
      <div class="mini-letter">
        <div class="letter-head"><span>Many Mansions</span>${LOGO}<span>Call to Serve</span></div>
        <div class="letter-body">
          <p class="salute">Dear Saint,</p>
          <p class="called">You are hereby called to serve as</p>
          <div class="type">${esc(TYPES[3].name)}</div>
          <span class="pct">91% match · ${esc(TYPES[3].tag)}</span>
          <div class="letter-rows">
            <div><span>Assigned to labor in the</span><span>Philippines Manila Mission</span></div>
            <div><span>Scripture companion</span><span>Peter</span></div>
            <div><span>Suggested calling</span><span>${esc(TYPES[3].calling)}</span></div>
          </div>
          <p class="letter-sign">“${esc(TYPES[3].quote)}”</p>
        </div>
      </div>
      <div class="mini-letter"><div class="letter-head"><span>Many Mansions</span><span>Call to Serve</span></div><div class="letter-body"><p class="salute">Dear Saint,</p><div class="type">${esc(ex.name)}</div></div></div>
    </div>
  </div>
</section>

<section class="section" id="how" style="padding-top:40px">
  <div class="wrap">
    <div class="section-head"><div class="eyebrow">How it works</div><h2>Three steps to your call</h2><p>It works like a personality test built for Latter-day Saint life, from the chapel to the dirty soda drive-thru.</p></div>
    <div class="steps">
      <div class="card step"><div class="n">01</div><h3>Answer honestly</h3><p>React to 24 or 48 statements on a five-point scale. Swap any statement you can't relate to.</p></div>
      <div class="card step"><div class="n">02</div><h3>Open your call</h3><p>Break the seal on your call letter to reveal your type, your mission match and your scripture companion.</p></div>
      <div class="card step"><div class="n">03</div><h3>Share with your ward</h3><p>Save a Story-ready image of your call letter and see what everyone else gets.</p></div>
    </div>
  </div>
</section>

<section class="section" id="pillars">
  <div class="wrap">
    <div class="section-head"><div class="eyebrow">The 12 Pillars</div><h2>The four wings of the house</h2><p>Every pillar has two good sides. Your mix across all twelve is what makes your type.</p></div>
    <div class="fam-grid">
      ${Object.entries(FAMILIES).map(([k, f]) => `<div class="card fam" style="--c:${famVar(k)}"><h3><span class="dot"></span>${f.name}</h3><ul>${AXES.filter(a => a.fam === k).map(a => `<li><strong>${esc(a.name)}</strong><span class="poles"><b>${esc(a.left)}</b> ↔ <b>${esc(a.right)}</b> · ${esc(a.note)}</span></li>`).join('')}</ul></div>`).join('')}
    </div>
  </div>
</section>

<section class="section" id="start">
  <div class="wrap">
    <div class="section-head"><div class="eyebrow">Choose your version</div><h2>Quick read or the full picture?</h2></div>
    <div class="versions">
      <div class="card version"><div class="meta"><span class="chip">24 statements</span><span class="chip">~4 min</span></div><h3>Quick version</h3><p>Two statements per pillar. Perfect for a fast type and a share-worthy call letter.</p><a class="btn btn-ghost" href="quiz.html?v=quick">Start quick version →</a></div>
      <div class="card version featured"><div class="meta"><span class="chip">48 statements</span><span class="chip">~8 min</span><span class="chip" style="color:var(--gold)">Most accurate</span></div><h3>Full version</h3><p>Four statements per pillar for a sharper profile and more reliable matches.</p><a class="btn btn-primary" href="quiz.html?v=full">Start full version →</a></div>
    </div>
  </div>
</section>

<section class="section" id="types">
  <div class="wrap">
    <div class="section-head"><div class="eyebrow">16 types</div><h2>Which one are you?</h2><p>From the Seminary Scholar to the Dirty Soda Diplomat. Tap any type to learn more.</p></div>
    <div class="types-grid">
      ${TYPES.map(t => `<a class="card type-tile" href="types/${t.slug}.html"><div class="tag">${esc(t.tag)}</div><h3>${esc(t.name)}</h3><p>“${esc(t.quote)}”</p></a>`).join('')}
    </div>
  </div>
</section>

<section class="section" id="faq">
  <div class="wrap">
    <div class="section-head"><div class="eyebrow">FAQ</div><h2>Good questions</h2></div>
    <div class="faq">${FAQ.map(([q, a]) => `<details class="card"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  </div>
</section>`;

const faqLD = `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
})}</script>`;

const pages = {};
pages['index.html'] = page({
  title: PREVIEW ? 'Many Mansions' : 'Mormon Personality Test: What Kind of Latter-day Saint Are You? | Many Mansions',
  desc: 'Free Mormon personality test across 12 pillars of faith, culture and community. Discover your Latter-day Saint type, scripture companion and mission match.',
  canonical: '/', body: indexBody, jsonld: faqLD
});

pages['quiz.html'] = page({
  title: 'Take the Test | Many Mansions',
  desc: 'Answer 24 or 48 statements to discover your Latter-day Saint type across 12 pillars.',
  canonical: '/quiz', header: 'quiz',
  body: `<div class="quiz-main"><div class="wrap"><div class="quiz-shell" id="quiz" aria-live="polite"></div></div></div>`,
  scripts: ['quiz.js']
});

pages['results.html'] = page({
  title: 'Your Call Letter | Many Mansions',
  desc: 'Your Many Mansions results: your Latter-day Saint type, 12-pillar profile, scripture companion and mission match.',
  canonical: '/results',
  body: `<div class="res-main"><div class="wrap" id="results"></div></div>`,
  scripts: ['results.js', 'share.js']
});

// ---------------- type pages ----------------
pages['types/index.html'] = page({
  title: 'All 16 Latter-day Saint Personality Types | Many Mansions',
  desc: 'Explore all 16 Many Mansions types, from the Seminary Scholar to the Dirty Soda Diplomat, with full 12-pillar profiles.',
  canonical: '/types', base: '../',
  body: `<div class="type-page"><div class="wrap">
    <p class="crumbs"><a href="../index.html">Home</a> / All types</p>
    <div class="section-head" style="margin-top:20px"><div class="eyebrow">16 types</div><h2>Every kind of Saint</h2><p>Each type is a profile across the same 12 pillars. Take the test to see which one you match.</p></div>
    <div class="types-grid">${TYPES.map(t => `<a class="card type-tile" href="${t.slug}.html"><div class="tag">${esc(t.tag)}</div><h3>${esc(t.name)}</h3><p>“${esc(t.quote)}”</p></a>`).join('')}</div>
    <div class="cta-band"><h2>Find out which one you are</h2><p>Free, no sign-up, about five minutes.</p><a class="btn" href="../quiz.html">Take the test →</a></div>
  </div></div>`
});

TYPES.forEach(t => {
  const figs = SS.rankDir(t.v, FIGURES).slice(0, 3);
  const miss = SS.rankDir(t.v, MISSIONS).slice(0, 3);
  const sim = SS.rank(t.v, TYPES.filter(x => x.slug !== t.slug)).slice(0, 3);
  const li = (arr, link) => `<ul class="match-list">${arr.map(x => `<li><b>${link ? `<a href="${x.slug}.html">${esc(x.name)}</a>` : esc(x.name)}</b><span class="p">${x.pct}%</span><small>${esc(x.line || x.quote)}</small></li>`).join('')}</ul>`;
  pages[`types/${t.slug}.html`] = page({
    title: `${t.name}: Latter-day Saint Personality Type | Many Mansions`,
    desc: `${t.name} (${t.tag}): ${t.blurb.slice(0, 120)}…`,
    canonical: `/types/${t.slug}`, base: '../',
    body: `<div class="type-page"><div class="wrap">
      <p class="crumbs"><a href="../index.html">Home</a> / <a href="index.html">Types</a> / ${esc(t.name)}</p>
      <div class="card type-hero" style="margin-top:20px">
        <div>
          <span class="chip">${esc(t.tag)}</span>
          <h1 style="font-size:clamp(34px,6vw,54px);margin-top:12px">${esc(t.name)}</h1>
          <p class="quote">“${esc(t.quote)}”</p>
          <p class="blurb">${esc(t.blurb)}</p>
        </div>
      </div>
      <div class="tri" style="margin-top:12px">
        <div class="card"><h4>Strengths</h4><ul>${t.strengths.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="card"><h4>Watch out for</h4><p>${esc(t.watch)}</p></div>
        <div class="card"><h4>Calling they'd crush</h4><p><b>${esc(t.calling)}</b></p></div>
      </div>
      <div class="ad-slot" data-ad="type-1"></div>
      <section class="res-section"><div class="eyebrow">The 12 Pillars</div><h2>The ${esc(t.name.replace(/^The /, ''))} profile</h2><div class="card sliders">${sliders(t.v)}</div></section>
      <section class="res-section"><div class="eyebrow">Matches</div><h2>Their neighbors in the house</h2>
        <div class="match-cols">
          <div class="card match-col"><h3>Similar types</h3>${li(sim, true)}</div>
          <div class="card match-col"><h3>Scripture companions</h3>${li(figs)}</div>
          <div class="card match-col"><h3>Mission matches</h3>${li(miss)}</div>
        </div>
      </section>
      <div class="cta-band"><h2>Are you ${esc(t.name.replace(/^The /, 'a '))}?</h2><p>Take the free 12-pillar test and open your call letter.</p><a class="btn" href="../quiz.html">Take the test →</a></div>
    </div></div>`
  });
});

// ---------------- write ----------------
fs.mkdirSync(path.join(OUT, 'types'), { recursive: true });
for (const [file, html] of Object.entries(pages)) fs.writeFileSync(path.join(OUT, file), html);

const urls = ['/', '/quiz', '/types', ...TYPES.map(t => `/types/${t.slug}`)];
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /results\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'vercel.json'), JSON.stringify({ cleanUrls: true, trailingSlash: false }, null, 2) + '\n');
console.log(`Built ${Object.keys(pages).length} pages for ${SITE_URL}`);

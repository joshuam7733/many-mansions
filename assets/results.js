/* Many Mansions — results page */
(function () {
  const { AXES, FAMILIES, TYPES, FIGURES, MISSIONS, PROFILE } = window.SS;
  const root = document.getElementById('results');
  const params = new URLSearchParams(location.search);

  // ---- parse ----
  let s = (params.get('s') || '').split('.').map(Number);
  if (s.length !== 12 || s.some(n => !Number.isFinite(n))) {
    const last = store.get('ss-last');
    if (last && last.s) { s = last.s; }
    else {
      root.innerHTML = `<div class="envelope-stage"><div><h1>No results yet</h1><p class="sub">Take the test to receive your call letter.</p><div class="letter-actions"><a class="btn btn-primary" href="quiz.html">Take the test →</a></div></div></div>`;
      return;
    }
  }
  s = s.map(n => Math.max(0, Math.min(100, Math.round(n))));
  const p = (params.get('p') || 'x-x-x').split('-').map(x => (x === 'x' ? null : +x));
  const profile = PROFILE.map((pr, i) => (p[i] != null && pr.opts[p[i]] ? pr.opts[p[i]] : null));

  const types = SS.rank(s, TYPES);
  const figures = SS.rankDir(s, FIGURES);
  const missions = SS.rankDir(s, MISSIONS);
  const top = types[0];
  window.SS_RESULT = { s, profile, top, figure: figures[0], mission: missions[0] };

  // ---- helpers ----
  const famC = a => FAMILIES[a.fam].color;
  const lean = (a, v) => {
    const d = v - 50;
    if (Math.abs(d) < 6) return { label: 'Balanced', pct: 50, pole: null, side: 0 };
    return d > 0 ? { label: a.right, pct: v, pole: a.right, side: 1 } : { label: a.left, pct: 100 - v, pole: a.left, side: -1 };
  };
  const strength = v => Math.abs(v - 50) / 50;

  function ring(pct) {
    const r = 46, c = 2 * Math.PI * r;
    return `<div class="ring" role="img" aria-label="${pct}% match"><svg viewBox="0 0 104 104"><circle cx="52" cy="52" r="${r}" fill="none" stroke="var(--line)" stroke-width="7"/><circle cx="52" cy="52" r="${r}" fill="none" stroke="var(--gold)" stroke-width="7" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"/></svg><div class="lbl"><b>${pct}%</b><small>Match</small></div></div>`;
  }

  const SEAL = '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="16" cy="16" r="5.5"/>' +
    Array.from({ length: 12 }, (_, i) => { const t = (i * Math.PI) / 6; return `<line x1="${16 + Math.cos(t) * 8.5}" y1="${16 + Math.sin(t) * 8.5}" x2="${16 + Math.cos(t) * 13}" y2="${16 + Math.sin(t) * 13}" stroke-linecap="round"/>`; }).join('') + '</svg>';

  function letterHTML() {
    const isFriend = profile[0] === 'Friend of the Church' || profile[0] === 'Former member';
    const rm = profile[1] === 'Returned missionary' || profile[1] === 'Serving right now';
    const badges = profile.filter(Boolean);
    return `
      <article class="letter-full" aria-label="Your call letter">
        <div class="letter-head"><span>Many Mansions</span>${SEAL}<span>Call to Serve</span></div>
        <div class="letter-body">
          <p class="salute">Dear ${isFriend ? 'Friend' : 'Saint'},</p>
          <p class="called">After prayerful consideration of your answers across all 12 pillars, you are hereby called to serve as</p>
          <h1 class="type">${esc(top.name)}</h1>
          <span class="pct">${top.pct}% match · ${esc(top.tag)}</span>
          <div class="letter-rows">
            <div><span>${rm ? 'Your mission spirit' : 'Assigned to labor in the'}</span><span>${esc(missions[0].name)}</span></div>
            <div><span>Scripture companion</span><span>${esc(figures[0].name)}</span></div>
            <div><span>Suggested calling</span><span>${esc(top.calling)}</span></div>
            <div><span>Report date</span><span>Sunday, 9:00 a.m. (bring snacks)</span></div>
          </div>
          <p class="letter-sign">“${esc(top.quote)}”</p>
          ${badges.length ? `<div class="badges">${badges.map(b => `<span>${esc(b)}</span>`).join('')}</div>` : ''}
        </div>
      </article>
      <div class="letter-actions">
        <button class="btn btn-primary" data-share="image">Save my call letter</button>
        <button class="btn btn-ghost" data-share="link">Copy result link</button>
        <a class="btn btn-ghost" href="#profile">See full profile ↓</a>
      </div>`;
  }

  // ---- Sunstone: 12 rays, length = strength of lean ----
  const SHORT = {
    'By the Book': 'By the Book', 'Big Picture': 'Big Picture', 'Study & Reason': 'Study', 'Feeling & Prayer': 'Feeling',
    'Sacred Ritual': 'Ritual', 'Daily Service': 'Service', 'Zion Core': 'Zion Core', 'Mission Field': 'Mission Field',
    'Pioneer Stock': 'Pioneer', 'Fresh Start': 'Fresh Start', 'Caffeine-Free': 'Caffeine-Free', 'Dirty Soda': 'Dirty Soda',
    'Activity Committee': 'Activities', 'Back Row': 'Back Row', 'Every-Member Missionary': 'Missionary', 'Quiet Faith': 'Quiet Faith',
    'Big Family': 'Big Family', 'Small & Simple': 'Small & Simple', 'Conservative': 'Conservative', 'Progressive': 'Progressive',
    'History Buff': 'History', 'Present Focus': 'Present', 'Conference Classic': 'Conference', 'LDS Internet': 'Online'
  };
  function sunstone() {
    // On phones: shorter rays and bigger labels so text stays readable at ~340px wide.
    const small = window.innerWidth < 560;
    const cx = 220, cy = 220, r0 = small ? 40 : 46, rMax = small ? 112 : 150, rLab = small ? 138 : 186;
    const f1 = small ? 21 : 15, f2 = small ? 18 : 13, vb = small ? '-78 40 596 360' : '-90 0 620 440';
    let rays = '', labels = '', guides = '';
    [0.5, 1].forEach(f => { guides += `<circle cx="${cx}" cy="${cy}" r="${r0 + (rMax - r0) * f}" fill="none" stroke="var(--line)" stroke-dasharray="3 5"/>`; });
    AXES.forEach((a, i) => {
      const t = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const st = Math.max(0.08, strength(s[i]));
      const len = r0 + (rMax - r0) * st;
      const w = 0.2; // half-angle of the ray base, radians
      const pt = (rr, ang) => `${(cx + Math.cos(ang) * rr).toFixed(1)},${(cy + Math.sin(ang) * rr).toFixed(1)}`;
      rays += `<polygon points="${pt(r0 - 2, t - w)} ${pt(len, t)} ${pt(r0 - 2, t + w)}" fill="${famC(a)}" opacity="${0.45 + st * 0.55}"><title>${esc(a.name)}: ${esc(lean(a, s[i]).label)}</title></polygon>`;
      const L = lean(a, s[i]);
      const lx = cx + Math.cos(t) * rLab, ly = cy + Math.sin(t) * rLab;
      const anchor = Math.abs(Math.cos(t)) < 0.3 ? 'middle' : Math.cos(t) > 0 ? 'start' : 'end';
      labels += `<text x="${lx.toFixed(1)}" y="${(ly - 2).toFixed(1)}" text-anchor="${anchor}" font-size="${f1}" font-weight="600" fill="var(--ink)">${esc(L.pole ? SHORT[L.pole] : a.name)}</text>
                 <text x="${lx.toFixed(1)}" y="${(ly + f2 + 2).toFixed(1)}" text-anchor="${anchor}" font-size="${f2}" fill="var(--muted)">${L.pole ? L.pct + '%' : 'Balanced'}</text>`;
    });
    return `<svg class="sunstone" viewBox="${vb}" role="img" aria-label="Sunstone chart of your 12 pillars">
      ${guides}${rays}
      <circle cx="${cx}" cy="${cy}" r="${r0 - 6}" fill="var(--gold)"/>
      <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="var(--on-primary)" style="font-family:var(--font-display)">${top.pct}%</text>
      ${labels}
    </svg>`;
  }

  function slidersHTML() {
    let html = '';
    let lastFam = null;
    AXES.forEach((a, i) => {
      if (a.fam !== lastFam) { lastFam = a.fam; html += `<div class="fam-label" style="--c:${famC(a)}"><span class="dot"></span>${FAMILIES[a.fam].name}</div>`; }
      const v = s[i], L = lean(a, v);
      const fillL = Math.min(v, 50), fillW = Math.abs(v - 50);
      html += `<div class="slider" style="--c:${famC(a)}">
        <div class="top"><strong>${esc(a.name)}</strong><span class="${L.pole ? '' : 'bal'}">${L.pole ? `${L.pct}% ${esc(L.pole)}` : 'Balanced'}</span></div>
        <div class="track" role="img" aria-label="${esc(a.left)} ${100 - v}%, ${esc(a.right)} ${v}%"><span class="mid"></span><span class="fill" style="left:${fillL}%;width:${fillW}%"></span><span class="knob" style="left:${v}%"></span></div>
        <div class="ends"><span class="${L.side < 0 ? 'on' : ''}">${esc(a.left)}</span><span class="${L.side > 0 ? 'on' : ''}">${esc(a.right)}</span></div>
      </div>`;
    });
    return html;
  }

  function apartHTML() {
    const idx = AXES.map((_, i) => i);
    const strongest = idx.slice().sort((a, b) => Math.abs(s[b] - 50) - Math.abs(s[a] - 50))[0];
    const balanced = idx.slice().sort((a, b) => Math.abs(s[a] - 50) - Math.abs(s[b] - 50))[0];
    const sa = AXES[strongest], sl = lean(sa, s[strongest]);
    const asFar = TYPES.filter(t => Math.sign(t.v[strongest] - 50) === sl.side && Math.abs(t.v[strongest] - 50) >= Math.abs(s[strongest] - 50)).length;
    const ba = AXES[balanced];

    // rarest combination of two of your leanings among the 16 types
    const leaning = idx.filter(i => Math.abs(s[i] - 50) >= 12);
    let best = null;
    for (let x = 0; x < leaning.length; x++) for (let y = x + 1; y < leaning.length; y++) {
      const i = leaning[x], j = leaning[y];
      const si = Math.sign(s[i] - 50), sj = Math.sign(s[j] - 50);
      const n = TYPES.filter(t => Math.sign(t.v[i] - 50) === si && Math.abs(t.v[i] - 50) >= 8 && Math.sign(t.v[j] - 50) === sj && Math.abs(t.v[j] - 50) >= 8).length;
      const w = Math.abs(s[i] - 50) + Math.abs(s[j] - 50);
      if (!best || n < best.n || (n === best.n && w > best.w)) best = { i, j, n, w };
    }
    const combo = best
      ? `<div class="big">${esc(lean(AXES[best.i], s[best.i]).pole)} + ${esc(lean(AXES[best.j], s[best.j]).pole)}</div><p>${best.n === 0 ? 'None of the 16 types' : `Only ${best.n} of the 16 types`} combine${best.n === 1 ? 's' : ''} these two leanings. That tension is part of what makes you you.</p>`
      : `<div class="big">Remarkably balanced</div><p>You don't lean hard on enough pillars to have a rare combination. You can see every side.</p>`;

    return `
      <div class="card"><h4>Your defining trait</h4><div class="big">${sl.pct}% ${esc(sl.pole || 'Balanced')}</div><p>${esc(sa.name)} is your strongest lean. ${asFar <= 1 ? 'Almost none' : `Only ${asFar}`} of the 16 types lean${asFar === 1 ? 's' : ''} this far.</p></div>
      <div class="card"><h4>Your middle ground</h4><div class="big">${esc(ba.name)}</div><p>You sit closest to center between <b>${esc(ba.left)}</b> and <b>${esc(ba.right)}</b>. You can relate to members on both sides.</p></div>
      <div class="card"><h4>Your rare combination</h4>${combo}</div>`;
  }

  function list(items, linkFn) {
    return `<ul class="match-list">${items.map(x => `<li><b>${linkFn ? `<a href="${linkFn(x)}">${esc(x.name)}</a>` : esc(x.name)}</b><span class="p">${x.pct}%</span><small>${esc(x.line || x.quote || '')}</small></li>`).join('')}</ul>`;
  }

  function fullHTML() {
    return `
      <section class="res-section" id="profile">
        <div class="eyebrow">Your type</div>
        <h2>The full profile</h2>
        <div class="card type-hero">
          <div>
            <span class="chip">${esc(top.tag)}</span>
            <h3>${esc(top.name)}</h3>
            <p class="quote">“${esc(top.quote)}”</p>
            <p class="blurb">${esc(top.blurb)}</p>
          </div>
          ${ring(top.pct)}
        </div>
        <div class="tri" style="margin-top:12px">
          <div class="card"><h4>Strengths</h4><ul>${top.strengths.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
          <div class="card"><h4>Watch out for</h4><p>${esc(top.watch)}</p></div>
          <div class="card"><h4>Calling you'd crush</h4><p><b>${esc(top.calling)}</b></p><p class="muted" style="margin-top:6px"><a href="types/${top.slug}.html">Read more about ${esc(top.name)} →</a></p></div>
        </div>
      </section>

      <div class="ad-slot" data-ad="results-1"></div>

      <section class="res-section">
        <div class="eyebrow">The 12 Pillars</div>
        <h2>How your house stands</h2>
        <div class="axes-layout">
          <div class="card sunstone-card">
            <h3>Your Sunstone</h3>
            <p>Each ray is one pillar. Longer rays mean you lean harder that way.</p>
            ${sunstone()}
            <div class="legend">${Object.values(FAMILIES).map(f => `<span style="--c:${f.color}">${f.name}</span>`).join('')}</div>
          </div>
          <div class="card sliders">${slidersHTML()}</div>
        </div>
      </section>

      <section class="res-section">
        <div class="eyebrow">Your room in the house</div>
        <h2>Compared with all 16 types</h2>
        <div class="apart">${apartHTML()}</div>
      </section>

      <section class="res-section">
        <div class="eyebrow">Your matches</div>
        <h2>Your neighbors in the house</h2>
        <div class="match-cols">
          <div class="card match-col"><h3>Closest types</h3><p>Your runner-up personalities.</p>${list(types.slice(1, 5), x => `types/${x.slug}.html`)}</div>
          <div class="card match-col"><h3>Scripture companions</h3><p>The figures who'd be your companion.</p>${list(figures.slice(0, 4))}</div>
          <div class="card match-col"><h3>Mission matches</h3><p>Where your spirit would thrive.</p>${list(missions.slice(0, 4))}</div>
        </div>
      </section>

      <div class="ad-slot" data-ad="results-2"></div>

      <section class="res-section">
        <div class="card share-bar">
          <div><h3>Share your call</h3><p class="muted" style="font-size:14px">Post it to your Story and see what your ward gets.</p></div>
          <div class="btns">
            <button class="btn btn-primary btn-sm" data-share="image">Save image</button>
            <button class="btn btn-ghost btn-sm" data-share="native">Share</button>
            <button class="btn btn-ghost btn-sm" data-share="link">Copy link</button>
            <a class="btn btn-ghost btn-sm" href="quiz.html?edit=1">Edit answers</a>
            <a class="btn btn-ghost btn-sm" href="quiz.html">Retake</a>
          </div>
        </div>
      </section>`;
  }

  // ---- mount ----
  document.title = `${top.name} (${top.pct}%) · Many Mansions`;
  root.innerHTML = `
    <div class="envelope-stage" id="stage">
      <div>
        <div class="eyebrow" style="justify-content:center">Sealed and delivered</div>
        <h1>Your call has arrived</h1>
        <p class="sub">Tap the envelope to open it.</p>
        <button class="envelope" id="env" aria-label="Open your call letter">
          <span class="env-back"></span><span class="env-letter"></span><span class="env-front"></span><span class="env-flap"></span>
          <span class="env-seal">${SEAL}</span>
        </button>
        <button class="btn btn-ghost btn-sm" id="skip">Skip to my results</button>
      </div>
    </div>
    <div id="after" hidden></div>`;

  const after = document.getElementById('after');
  function reveal(animate) {
    const stage = document.getElementById('stage');
    after.innerHTML = `<div style="padding:34px 0 0">${letterHTML()}</div>${fullHTML()}`;
    after.hidden = false;
    stage.remove();
    if (!animate) after.querySelector('.letter-full').style.animation = 'none';
    wireShare();
    window.scrollTo({ top: 0 });
  }
  const env = document.getElementById('env');
  env.addEventListener('click', () => {
    if (env.classList.contains('open')) return;
    env.classList.add('open');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => reveal(true), reduce ? 50 : 1250);
  });
  document.getElementById('skip').addEventListener('click', () => reveal(false));
  document.addEventListener('themechange', () => { if (!after.hidden) { const y = scrollY; reveal(false); scrollTo(0, y); } });

  function wireShare() {
    after.querySelectorAll('[data-share]').forEach(b => b.onclick = () => window.SSShare[b.dataset.share]());
  }
})();

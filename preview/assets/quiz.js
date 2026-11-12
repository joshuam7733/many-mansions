/* Many Mansions — quiz engine */
(function () {
  const { AXES, QUESTIONS, PROFILE, FAMILIES } = window.SS;
  const app = document.getElementById('quiz');
  const KEY = 'ss-progress';
  const VERSIONS = {
    quick: { name: 'Quick', per: 2, mins: 4 },
    full: { name: 'Full', per: 4, mins: 8 }
  };
  const OPTS = [
    { v: 2, label: 'Strongly agree', cls: 'sa', mk: '✓✓' },
    { v: 1, label: 'Agree', cls: 'a', mk: '✓' },
    { v: 0, label: 'Neutral or it depends', cls: 'n', mk: '–' },
    { v: -1, label: 'Disagree', cls: 'd', mk: '✕' },
    { v: -2, label: 'Strongly disagree', cls: 'sd', mk: '✕✕' }
  ];
  const byId = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
  const axisOf = Object.fromEntries(AXES.map(a => [a.key, a]));
  let S = null;
  let explainOpen = false;

  function buildOrder(version) {
    const per = VERSIONS[version].per;
    const order = [];
    for (let slot = 0; slot < per; slot++) {
      // rotate axis order each round so the same axis never repeats back-to-back
      const rot = AXES.map((a, i) => AXES[(i * 5 + slot * 3) % 12]);
      rot.forEach(a => order.push(a.key + slot));
    }
    return order;
  }

  function fresh(version) {
    return { version, order: buildOrder(version), answers: {}, idx: 0, auto: true, profile: {}, phase: 'q', pIdx: 0 };
  }
  const save = () => store.set(KEY, S);

  function famColor(axisKey) { return FAMILIES[axisOf[axisKey].fam].color; }

  // ---------- intro ----------
  function renderIntro() {
    const saved = store.get(KEY);
    const canResume = saved && saved.order && Object.keys(saved.answers || {}).length > 0;
    app.innerHTML = `
      <div class="intro q-anim">
        <div class="eyebrow" style="justify-content:center">Choose your version</div>
        <h1>How deep do you want to go?</h1>
        <p>Answer honestly. There are no right or wrong answers, and nothing here measures how faithful you are, only how you live your faith.</p>
        ${canResume ? `<div class="card resume"><div><b>Pick up where you left off?</b><div class="muted" style="font-size:14px">${Object.keys(saved.answers).length} of ${saved.order.length} answered · ${VERSIONS[saved.version].name} version</div></div><div style="display:flex;gap:8px"><button class="btn btn-ghost btn-sm" data-act="discard">Start over</button><button class="btn btn-primary btn-sm" data-act="resume">Resume</button></div></div>` : ''}
        <div class="versions">
          ${Object.entries(VERSIONS).map(([k, v]) => `
            <div class="card version ${k === 'full' ? 'featured' : ''}">
              <div class="meta"><span class="chip">${v.per * 12} statements</span><span class="chip">~${v.mins} min</span>${k === 'full' ? '<span class="chip" style="color:var(--gold)">Most accurate</span>' : ''}</div>
              <h3>${v.name} version</h3>
              <p>${k === 'quick' ? 'Two statements per pillar. Great for a fast read on your type and a share-worthy call letter.' : 'Four statements per pillar for a sharper profile and more reliable matches.'}</p>
              <button class="btn ${k === 'full' ? 'btn-primary' : 'btn-ghost'}" data-start="${k}">Start ${v.name.toLowerCase()} version <span aria-hidden="true">→</span></button>
            </div>`).join('')}
        </div>
      </div>`;
    app.querySelectorAll('[data-start]').forEach(b => b.onclick = () => { S = fresh(b.dataset.start); save(); render(); });
    const r = app.querySelector('[data-act="resume"]');
    if (r) r.onclick = () => { S = saved; render(); };
    const d = app.querySelector('[data-act="discard"]');
    if (d) d.onclick = () => { store.del(KEY); renderIntro(); };
  }

  // ---------- progress ----------
  function segmentsHTML() {
    return `<div class="segments" aria-hidden="true">${AXES.map(a => {
      const ids = S.order.filter(id => byId[id].axis === a.key);
      const done = ids.filter(id => S.answers[id] !== undefined).length;
      return `<i style="--c:${FAMILIES[a.fam].color};--p:${(done / ids.length) * 100}%"></i>`;
    }).join('')}</div>`;
  }

  // ---------- statement ----------
  function renderQ() {
    const id = S.order[S.idx];
    const q = byId[id];
    const ax = axisOf[q.axis];
    const total = S.order.length;
    const answered = Object.keys(S.answers).filter(k => S.order.includes(k)).length;
    const val = S.answers[id];
    const spare = spareFor(q.axis);
    app.innerHTML = `
      <div class="progress-top"><span>Statement <b>${S.idx + 1} of ${total}</b></span><span>${Math.round((answered / total) * 100)}% complete</span></div>
      ${segmentsHTML()}
      <div class="card q-card q-anim" style="--c:${famColor(q.axis)}">
        <div class="q-ghost" aria-hidden="true">${String(S.idx + 1).padStart(2, '0')}</div>
        <div class="q-chips">
          <span class="chip" style="--c:${famColor(q.axis)}"><span class="dot"></span>${esc(ax.name)}</span>
          <button class="chip q-explain-btn" aria-expanded="${explainOpen}" aria-controls="q-note">What's this?</button>
        </div>
        ${explainOpen ? `<div class="q-note" id="q-note"><b>${esc(ax.left)} ↔ ${esc(ax.right)}.</b> ${esc(ax.note)}</div>` : ''}
        <h2 class="q-text" id="q-text">${esc(q.text)}</h2>
        <div class="opts" role="radiogroup" aria-labelledby="q-text">
          ${OPTS.map((o, i) => `<button class="opt ${o.cls}" role="radio" aria-checked="${val === o.v}" data-v="${o.v}"><span class="mk" aria-hidden="true">${o.mk}</span>${o.label}<span class="kbd" aria-hidden="true">${i + 1}</span></button>`).join('')}
        </div>
      </div>
      <div class="q-controls">
        <button class="btn btn-ghost btn-sm" data-act="back" ${S.idx === 0 ? 'disabled' : ''}>← Back</button>
        <div class="mid"><button class="switch" role="switch" aria-checked="${S.auto}" aria-label="Advance on answer" data-act="auto"></button><span>Auto-advance</span></div>
        <div class="right">
          <button class="btn btn-ghost btn-sm" data-act="swap" ${spare ? '' : 'disabled'} title="Swap for a different statement under the same pillar">⇄ Swap</button>
          <button class="btn btn-primary btn-sm" data-act="next" ${val === undefined ? 'disabled' : ''}>${S.idx === total - 1 ? 'Finish' : 'Next'} →</button>
        </div>
      </div>`;

    app.querySelectorAll('.opt').forEach(b => b.onclick = () => answer(+b.dataset.v));
    app.querySelector('[data-act="back"]').onclick = back;
    app.querySelector('[data-act="next"]').onclick = next;
    app.querySelector('[data-act="swap"]').onclick = swap;
    app.querySelector('[data-act="auto"]').onclick = () => { S.auto = !S.auto; save(); renderQ(); };
    app.querySelector('.q-explain-btn').onclick = () => { explainOpen = !explainOpen; renderQ(); };
  }

  function spareFor(axisKey) {
    return QUESTIONS.find(q => q.axis === axisKey && !S.order.includes(q.id));
  }
  function swap() {
    const cur = S.order[S.idx];
    const alt = spareFor(byId[cur].axis);
    if (!alt) return;
    delete S.answers[cur];
    S.order[S.idx] = alt.id;
    save(); renderQ();
    toast('Swapped for another statement under this pillar');
  }

  let advanceTimer;
  function answer(v) {
    S.answers[S.order[S.idx]] = v;
    save();
    app.querySelectorAll('.opt').forEach(b => b.setAttribute('aria-checked', +b.dataset.v === v));
    app.querySelector('[data-act="next"]').disabled = false;
    clearTimeout(advanceTimer);
    if (S.auto) advanceTimer = setTimeout(next, 260);
  }
  function next() {
    if (S.answers[S.order[S.idx]] === undefined) return;
    if (S.idx < S.order.length - 1) { S.idx++; save(); renderQ(); }
    else { S.phase = 'profile'; S.pIdx = 0; save(); renderProfile(); }
    window.scrollTo({ top: 0 });
  }
  function back() { if (S.idx > 0) { S.idx--; save(); renderQ(); } }

  // ---------- profile (personalizes the call letter, never changes scores) ----------
  function renderProfile() {
    const p = PROFILE[S.pIdx];
    const cur = S.profile[p.key];
    app.innerHTML = `
      <div class="progress-top"><span>Personalizing your call letter</span><span><b>${S.pIdx + 1} of ${PROFILE.length}</b></span></div>
      <div class="segments" style="grid-template-columns:repeat(${PROFILE.length},1fr)" aria-hidden="true">${PROFILE.map((_, i) => `<i style="--c:var(--gold);--p:${i < S.pIdx ? 100 : i === S.pIdx ? 50 : 0}%"></i>`).join('')}</div>
      <div class="card q-card q-anim" style="--c:var(--gold)">
        <div class="q-ghost" aria-hidden="true">${String(S.pIdx + 1).padStart(2, '0')}</div>
        <div class="q-chips"><span class="chip" style="--c:var(--gold)"><span class="dot"></span>${esc(p.title)}</span></div>
        <h2 class="q-text" id="p-text">${esc(p.q)}</h2>
        <p class="muted" style="margin:-10px 0 18px;font-size:14px;position:relative">Optional. This only labels your call letter; it doesn't change your scores.</p>
        <div class="opts" role="radiogroup" aria-labelledby="p-text">
          ${p.opts.map((o, i) => `<button class="opt pick" role="radio" aria-checked="${cur === i}" data-i="${i}"><span class="mk" aria-hidden="true">${String.fromCharCode(65 + i)}</span>${esc(o)}</button>`).join('')}
        </div>
      </div>
      <div class="q-controls">
        <button class="btn btn-ghost btn-sm" data-act="back">← Back</button>
        <button class="btn btn-ghost btn-sm" data-act="skip">Skip →</button>
      </div>`;
    app.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      S.profile[p.key] = +b.dataset.i; save();
      app.querySelectorAll('.opt').forEach(x => x.setAttribute('aria-checked', x === b));
      setTimeout(pNext, 240);
    });
    app.querySelector('[data-act="skip"]').onclick = () => { delete S.profile[p.key]; pNext(); };
    app.querySelector('[data-act="back"]').onclick = () => {
      if (S.pIdx > 0) { S.pIdx--; save(); renderProfile(); }
      else { S.phase = 'q'; save(); renderQ(); }
    };
  }
  function pNext() {
    if (S.pIdx < PROFILE.length - 1) { S.pIdx++; save(); renderProfile(); }
    else finish();
  }

  // ---------- scoring ----------
  function scores() {
    return AXES.map(a => {
      const ids = S.order.filter(id => byId[id].axis === a.key && S.answers[id] !== undefined);
      if (!ids.length) return 50;
      const sum = ids.reduce((t, id) => t + S.answers[id] * byId[id].d, 0);
      return Math.round(50 + (sum / (ids.length * 2)) * 50);
    });
  }
  function finish() {
    const s = scores();
    const p = PROFILE.map(pr => (S.profile[pr.key] === undefined ? 'x' : S.profile[pr.key])).join('-');
    store.set('ss-last', { s, p, version: S.version, at: Date.now() });
    store.set('ss-edit', S); // lets "Edit answers" reopen the quiz
    store.del(KEY);
    location.href = `results.html?s=${s.join('.')}&p=${p}&v=${S.version[0]}`;
  }

  function render() {
    if (!S) return renderIntro();
    if (S.phase === 'profile') return renderProfile();
    return renderQ();
  }

  // keyboard: 1–5 answer, arrows navigate
  document.addEventListener('keydown', e => {
    if (!S || e.metaKey || e.ctrlKey || e.altKey) return;
    const t = e.target instanceof Element ? e.target : document.body;
    if (t.closest('input, textarea')) return;
    if (S.phase === 'q') {
      if (e.key >= '1' && e.key <= '5') { answer(OPTS[+e.key - 1].v); }
      else if (e.key === 'ArrowLeft') back();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') { if (!t.closest('button')) next(); }
    }
  });

  document.querySelector('[data-act="restart"]')?.addEventListener('click', () => { store.del(KEY); S = null; renderIntro(); });

  // boot
  const params = new URLSearchParams(location.search);
  const v = params.get('v');
  if (params.get('edit') === '1' && store.get('ss-edit')) {
    S = store.get('ss-edit'); S.phase = 'q'; S.idx = 0; save(); render();
  } else if (v && VERSIONS[v]) {
    const saved = store.get(KEY);
    S = saved && saved.version === v && Object.keys(saved.answers || {}).length ? saved : fresh(v);
    save(); render();
  } else {
    renderIntro();
  }
})();

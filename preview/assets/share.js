/* Many Mansions — share image (1080×1920 Story) + link sharing */
(function () {
  const W = 1080, H = 1920;
  const SERIF = 'Fraunces, Georgia, serif';
  const SANS = '"Instrument Sans", system-ui, sans-serif';
  const FAM = { faith: '#5468B0', culture: '#C0763A', community: '#3F8A6E', worldview: '#8B5A9E' };

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function wrap(ctx, text, maxW) {
    const words = text.split(' '); const lines = []; let line = '';
    words.forEach(w => { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; });
    if (line) lines.push(line);
    return lines;
  }
  function spaced(ctx, text, x, y, spacing) {
    // manual letter-spacing for older canvases
    let cx = x;
    for (const ch of text) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + spacing; }
    return cx - x;
  }
  function spacedWidth(ctx, text, spacing) { let w = 0; for (const ch of text) w += ctx.measureText(ch).width + spacing; return w - spacing; }

  async function draw() {
    const R = window.SS_RESULT; const { AXES } = window.SS;
    try {
      await Promise.all([
        document.fonts.load(`600 90px ${SERIF}`), document.fonts.load(`italic 500 40px ${SERIF}`),
        document.fonts.load(`600 30px ${SANS}`), document.fonts.load(`400 30px ${SANS}`)
      ]);
    } catch (e) {}
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');

    // background + rays
    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#1B2546'); bg.addColorStop(1, '#0B0F1F');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(W / 2, 140); ctx.globalAlpha = 0.07; ctx.fillStyle = '#E6C47A';
    for (let i = 0; i < 24; i++) { ctx.rotate(Math.PI / 12); ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(0, 1500); ctx.lineTo(30, 0); ctx.fill(); }
    ctx.restore();

    // brand
    ctx.fillStyle = '#E6C47A'; ctx.font = `600 30px ${SANS}`; ctx.textBaseline = 'alphabetic';
    const brand = 'MANY MANSIONS'; const bw = spacedWidth(ctx, brand, 8);
    spaced(ctx, brand, (W - bw) / 2, 150, 8);
    ctx.fillStyle = 'rgba(255,255,255,.65)'; ctx.font = `400 30px ${SANS}`; ctx.textAlign = 'center';
    ctx.fillText('The Latter-day Saint personality test', W / 2, 200); ctx.textAlign = 'left';

    // paper: measure the variable-height parts first so the paper fits its content
    const px = 80, py = 260, pw = W - 160;
    const ix = px + 70, iw = pw - 140; let y = py + 90;
    let nameSize = 104, nameLines;
    do { ctx.font = `600 ${nameSize}px ${SERIF}`; nameLines = wrap(ctx, R.top.name, iw); if (nameLines.length <= 2) break; nameSize -= 8; } while (nameSize > 64);
    const nameLH = Math.round(nameSize * 1.04);
    ctx.font = `italic 500 36px ${SERIF}`; const quoteLines = wrap(ctx, `“${R.top.quote}”`, iw).slice(0, 3);
    const BAR_ROW = 66;
    const ph = 90 + 30 + 80 + 40 + nameLines.length * nameLH + 50 + 54 + 40 + 3 * 84 + 60 + 6 * BAR_ROW + 10 + quoteLines.length * 46 + 70;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
    rr(ctx, px, py, pw, ph, 18); ctx.fillStyle = '#FFFDF7'; ctx.fill(); ctx.restore();

    ctx.fillStyle = '#8A7A55'; ctx.font = `600 24px ${SANS}`;
    spaced(ctx, 'CALL TO SERVE', ix, y, 6);
    const pctTxt = `${R.top.pct}% MATCH`; const pw2 = spacedWidth(ctx, pctTxt, 4);
    spaced(ctx, pctTxt, ix + iw - pw2, y, 4);
    y += 30; ctx.fillStyle = '#E8DFC8'; ctx.fillRect(ix, y, iw, 2);

    y += 80; ctx.fillStyle = '#6A5D40'; ctx.font = `italic 500 40px ${SERIF}`;
    ctx.fillText('Dear Saint, you are called to serve as', ix, y);

    y += 40; ctx.fillStyle = '#2A2418'; ctx.font = `600 ${nameSize}px ${SERIF}`;
    nameLines.forEach(l => { y += nameLH; ctx.fillText(l, ix, y); });

    y += 50; ctx.font = `600 28px ${SANS}`;
    const tag = R.top.tag.toUpperCase(); const tw = spacedWidth(ctx, tag, 3) + 48;
    rr(ctx, ix, y, tw, 54, 27); ctx.fillStyle = '#F0E4C6'; ctx.fill();
    ctx.fillStyle = '#7A5A17'; spaced(ctx, tag, ix + 24, y + 37, 3);
    y += 54;

    // rows
    const rows = [['Mission', R.mission.name], ['Companion', R.figure.name], ['Calling', R.top.calling]];
    y += 40;
    rows.forEach(([k, v]) => {
      y += 26; ctx.strokeStyle = '#E3D8BD'; ctx.setLineDash([8, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ix, y); ctx.lineTo(ix + iw, y); ctx.stroke(); ctx.setLineDash([]);
      y += 58; ctx.font = `400 32px ${SANS}`; ctx.fillStyle = '#8A7A55'; ctx.fillText(k, ix, y);
      ctx.font = `600 32px ${SANS}`; ctx.fillStyle = '#2A2418'; ctx.textAlign = 'right';
      let val = v; while (ctx.measureText(val).width > iw - 220 && val.length > 4) val = val.slice(0, -2);
      if (val !== v) val = val.trim() + '…';
      ctx.fillText(val, ix + iw, y); ctx.textAlign = 'left';
    });

    // 12 mini bars, 2 columns
    y += 60;
    const colW = (iw - 50) / 2;
    AXES.forEach((a, i) => {
      const col = i < 6 ? 0 : 1, row = i % 6;
      const bx = ix + col * (colW + 50), by = y + row * BAR_ROW;
      const v = R.s[i]; const d = v - 50;
      const label = Math.abs(d) < 6 ? `${a.name} · Balanced` : d > 0 ? `${a.right} ${v}%` : `${a.left} ${100 - v}%`;
      ctx.font = `600 24px ${SANS}`; ctx.fillStyle = '#2A2418';
      let lb = label; while (ctx.measureText(lb).width > colW && lb.length > 4) lb = lb.slice(0, -1);
      ctx.fillText(lb, bx, by + 24);
      rr(ctx, bx, by + 38, colW, 12, 6); ctx.fillStyle = '#EFE6D0'; ctx.fill();
      const fl = Math.min(v, 50) / 100 * colW, fw = Math.max(6, Math.abs(d) / 100 * colW);
      rr(ctx, bx + fl, by + 38, fw, 12, 6); ctx.fillStyle = FAM[a.fam]; ctx.fill();
      ctx.fillStyle = '#D7CBAE'; ctx.fillRect(bx + colW / 2 - 1, by + 34, 2, 20);
    });
    y += 6 * BAR_ROW + 10;

    // quote
    ctx.fillStyle = '#6A5D40'; ctx.font = `italic 500 36px ${SERIF}`;
    quoteLines.forEach(l => { y += 46; ctx.fillText(l, ix, y); });

    // footer, placed under the paper
    const fy = Math.min(H - 110, py + ph + 110);
    ctx.textAlign = 'center'; ctx.fillStyle = '#FFFFFF'; ctx.font = `600 ${44}px ${SERIF}`;
    ctx.fillText('What kind of Saint are you?', W / 2, fy);
    ctx.fillStyle = '#E6C47A'; ctx.font = `600 32px ${SANS}`;
    ctx.fillText(location.host || 'themanymansions.com', W / 2, fy + 58);
    return c;
  }

  const toBlob = c => new Promise(res => c.toBlob(res, 'image/png'));
  const fileName = () => `many-mansions-${window.SS_RESULT.top.slug}.png`;
  const shareURL = () => location.href.split('#')[0];
  const shareText = () => `I'm ${window.SS_RESULT.top.name} (${window.SS_RESULT.top.pct}% match). What kind of Saint are you?`;

  async function image() {
    toast('Preparing your call letter…');
    const blob = await toBlob(await draw());
    const file = new File([blob], fileName(), { type: 'image/png' });
    const touch = matchMedia('(pointer: coarse)').matches;
    if (touch && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], text: shareText(), url: shareURL() }); return; } catch (e) { if (e.name === 'AbortError') return; }
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fileName();
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('Image saved');
  }
  async function link() {
    try { await navigator.clipboard.writeText(shareURL()); toast('Link copied'); }
    catch (e) { prompt('Copy your result link:', shareURL()); }
  }
  async function native() {
    if (navigator.share) { try { await navigator.share({ title: 'Many Mansions', text: shareText(), url: shareURL() }); } catch (e) {} }
    else link();
  }
  window.SSShare = { image, link, native, draw };
})();

async (page) => {
  const results = { errors: [], viewports: {}, tabs: {}, contrast: {}, reducedMotion: {}, screenshots: [] };
  page.on('console', (m) => { if (m.type() === 'error') results.errors.push(m.text()); });
  page.on('pageerror', (e) => results.errors.push(String(e)));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:8139/', { waitUntil: 'load' });
  await page.waitForTimeout(800);

  // ---- tab interaction (desktop) ----
  const sel = () => page.evaluate(() => {
    const tabs = [...document.querySelectorAll('[role="tab"]')];
    return tabs.map((t) => ({ id: t.id, sel: t.getAttribute('aria-selected'), ti: t.tabIndex }));
  });
  results.tabs.initial = await sel();
  await page.click('#hero-tab-comp');
  results.tabs.afterClickComp = await sel();
  results.tabs.compPanelVisible = await page.evaluate(() => !document.getElementById('hero-panel-comp').hidden && document.getElementById('hero-panel-exp').hidden);
  await page.focus('#hero-tab-comp');
  await page.keyboard.press('ArrowRight');
  results.tabs.afterArrowRight = await sel();
  await page.keyboard.press('Home');
  results.tabs.afterHome = await sel();
  await page.keyboard.press('End');
  results.tabs.afterEnd = await sel();

  // ---- per-viewport: overflow + tab-panel height stability ----
  for (const w of [375, 390, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(350);
    const r = await page.evaluate(() => {
      const out = { overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth };
      const wrap = document.querySelector('.hero-tabpanels');
      out.minHeight = wrap ? wrap.style.minHeight : null;
      out.heights = {};
      const tabs = [...document.querySelectorAll('[role="tab"]')];
      for (const t of tabs) {
        const p = document.getElementById(t.getAttribute('aria-controls'));
        const wasHidden = p.hidden;
        p.hidden = false;
        out.heights[t.id] = p.offsetHeight;
        p.hidden = wasHidden;
      }
      out.panelBox = document.querySelector('.hero-panel').offsetHeight;
      return out;
    });
    r.heightJump = Math.max(...Object.values(r.heights)) - Math.min(...Object.values(r.heights));
    results.viewports[w] = r;
  }

  // ---- contrast in dark theme ----
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.waitForTimeout(300);
  const lum = (rgb) => {
    const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  results.contrast.dark = await page.evaluate(() => {
    const parse = (s) => (s.match(/\d+/g) || []).slice(0, 3).map(Number);
    const bgOf = (el) => { let n = el; while (n) { const bg = getComputedStyle(n).backgroundColor; if (bg && !bg.includes('rgba(0, 0, 0, 0)')) return parse(bg); n = n.parentElement; } return [255, 255, 255]; };
    const ratio = (a, b) => { const f = (c) => { const [r, g, bl] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * bl; }; const l1 = f(a), l2 = f(b); return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)); };
    const targets = {
      kicker: '.hero-panel-kicker',
      badgePro: '.hero-badge--pro',
      heroRail: '.hero-rail span:first-child',
      heroLinkArrow: '.hero-links a span',
      expRole: '.exp-role',
      matrixEv: '.matrix-evidence',
      capEv: '.capability-evidence',
      caseTop: '.case-topline span:first-child',
      kicker2: '.demo-dialog__kicker',
      tabSelected: ".hero-tab[aria-selected='true']",
      panelNote: '.hero-panel-note',
    };
    const out = {};
    for (const [k, sel2] of Object.entries(targets)) {
      const el = document.querySelector(sel2);
      if (!el) { out[k] = 'MISSING'; continue; }
      const cs = getComputedStyle(el);
      out[k] = { ratio: +ratio(parse(cs.color), bgOf(el)).toFixed(2), size: cs.fontSize };
    }
    return out;
  });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.waitForTimeout(300);
  results.contrast.light = await page.evaluate(() => {
    const parse = (s) => (s.match(/\d+/g) || []).slice(0, 3).map(Number);
    const bgOf = (el) => { let n = el; while (n) { const bg = getComputedStyle(n).backgroundColor; if (bg && !bg.includes('rgba(0, 0, 0, 0)')) return parse(bg); n = n.parentElement; } return [255, 255, 255]; };
    const ratio = (a, b) => { const f = (c) => { const [r, g, bl] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * bl; }; const l1 = f(a), l2 = f(b); return ((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)); };
    const targets = { kicker: '.hero-panel-kicker', badgePro: '.hero-badge--pro', heroRail: '.hero-rail span:first-child', tabSelected: ".hero-tab[aria-selected='true']" };
    const out = {};
    for (const [k, sel2] of Object.entries(targets)) {
      const el = document.querySelector(sel2);
      if (!el) { out[k] = 'MISSING'; continue; }
      const cs = getComputedStyle(el);
      out[k] = { ratio: +ratio(parse(cs.color), bgOf(el)).toFixed(2), size: cs.fontSize };
    }
    return out;
  });

  // ---- reduced motion ----
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(200);
  results.reducedMotion = await page.evaluate(() => {
    const p = document.querySelector('.hero-tabpanel');
    return { animationDuration: getComputedStyle(p).animationDuration, transitionDuration: getComputedStyle(document.querySelector('.hero-chip') || p).transitionDuration };
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });

  // ---- screenshots ----
  const dir = 'C:\\Users\\Lucas\\Documents\\OMNIROUTE\\Curr-culo-\\depois\\';
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.waitForTimeout(400);
  await page.screenshot({ path: dir + 'hero-abas-1440-claro.png' });
  results.screenshots.push('hero-abas-1440-claro.png');
  await page.click('#hero-tab-comp');
  await page.waitForTimeout(450);
  await page.screenshot({ path: dir + 'hero-abas-1440-claro-competencias.png' });
  results.screenshots.push('hero-abas-1440-claro-competencias.png');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.waitForTimeout(400);
  await page.screenshot({ path: dir + 'hero-abas-1440-escuro.png' });
  results.screenshots.push('hero-abas-1440-escuro.png');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.waitForTimeout(500);
  await page.screenshot({ path: dir + 'hero-abas-390-claro.png' });
  results.screenshots.push('hero-abas-390-claro.png');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.waitForTimeout(400);
  await page.screenshot({ path: dir + 'hero-abas-390-escuro.png' });
  results.screenshots.push('hero-abas-390-escuro.png');

  // final state: light, 1440
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.setViewportSize({ width: 1440, height: 900 });
  return results;
}

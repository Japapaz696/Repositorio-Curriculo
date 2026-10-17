// Validação visual e funcional dos 4 sites (portfolio + 3 projetos).
// Requer servidor local em http://127.0.0.1:8139/ e Chromium do Playwright.
const { chromium } = require('playwright-core');
const fs = require('node:fs');
const path = require('node:path');

const EXE = path.join(process.env.LOCALAPPDATA, 'ms-playwright', 'chromium-1243', 'chrome-win64', 'chrome.exe');
const BASE = 'http://127.0.0.1:8139';
const OUT = path.join(__dirname, '..', '.visual-audit');
fs.mkdirSync(OUT, { recursive: true });

const WIDTHS = [375, 390, 430, 768, 1024, 1440];
const results = [];

function record(site, name, passed, detail = '') {
  results.push({ site, name, passed, detail });
  const mark = passed ? 'PASS' : 'FAIL';
  console.log(`[${mark}] ${site} — ${name}${detail ? ' :: ' + detail : ''}`);
}

async function measureOverflow(page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
}

async function checkOverflow(page, site, width) {
  const m = await measureOverflow(page);
  record(site, `Sem overflow horizontal @${width}`, m.scrollWidth <= m.innerWidth + 1, `scrollWidth=${m.scrollWidth} innerWidth=${m.innerWidth}`);
}

async function newPage(browser, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, reducedMotion: 'reduce', ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push('console: ' + msg.text()); });
  page.on('response', (res) => { if (res.status() >= 400) errors.push(`http ${res.status()}: ${res.url()}`); });
  return { ctx, page, errors };
}

// ---------------- PORTFOLIO ----------------
async function testPortfolio(browser) {
  const site = 'portfolio';
  const { ctx, page, errors } = await newPage(browser);

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await checkOverflow(page, site, width);
  }

  // Tema claro + escuro sem quebra
  for (const scheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    record(site, `Tema ${scheme} renderiza`, !!bg, bg);
  }
  await page.emulateMedia({ colorScheme: 'light' });

  // TecFood (nome oficial) e nada de TechFood
  const html = await page.content();
  record(site, 'Nome TecFood correto (0 ocorrências de TechFood)', !/TechFood/.test(html), '');

  // Ordem da navegação: Experiência antes de Projetos
  const navOrder = await page.evaluate(() => [...document.querySelectorAll('.nav-links a')].map(a => a.getAttribute('href')));
  const expIdx = navOrder.indexOf('#experience');
  const workIdx = navOrder.indexOf('#work');
  record(site, 'Navegação: Experiência antes de Projetos', expIdx > -1 && workIdx > -1 && expIdx < workIdx, JSON.stringify(navOrder));

  // Paleta: abre, busca, fecha com Escape e devolve foco sem erro
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.locator('#palette-toggle').click();
  await page.waitForTimeout(120); // requestAnimationFrame + transição
  const focusedOpen = await page.evaluate(() => document.activeElement?.id);
  record(site, 'Paleta abre e foca o input', focusedOpen === 'palette-input', 'activeElement=' + focusedOpen);
  await page.locator('#palette-input').fill('experiencia');
  const hasEntry = await page.locator('#palette-list button', { hasText: 'Experiência' }).count();
  record(site, 'Paleta lista Experiência', hasEntry > 0, '');
  await page.keyboard.press('Escape');
  const closed = await page.locator('#command-palette').isHidden();
  const focusedClose = await page.evaluate(() => document.activeElement?.id);
  record(site, 'Escape fecha paleta e devolve foco', closed && focusedClose === 'palette-toggle', 'activeElement=' + focusedClose);

  // Ctrl+K abre a paleta
  await page.keyboard.press('Control+k');
  const openedByKb = await page.locator('#command-palette').isVisible();
  record(site, 'Ctrl+K abre a paleta', openedByKb, '');
  await page.keyboard.press('Escape');

  // Label do atalho em plataforma não-Mac
  const kbdText = await page.locator('#palette-toggle kbd').textContent();
  record(site, 'Atalho mostra Ctrl K (não-Mac)', /Ctrl/.test(kbdText || ''), 'kbd=' + kbdText);

  // Menu mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.locator('#menu-toggle').click();
  const menuOpen = await page.locator('#nav-links').evaluate(el => el.classList.contains('open'));
  const expanded = await page.locator('#menu-toggle').getAttribute('aria-expanded');
  record(site, 'Menu mobile abre com aria-expanded', menuOpen && expanded === 'true', 'expanded=' + expanded);
  await page.locator('#nav-links a[href="#experience"]').click();
  const menuClosed = await page.locator('#nav-links').evaluate(el => !el.classList.contains('open'));
  record(site, 'Menu fecha ao escolher link', menuClosed, '');

  // Contraste do texto secundário
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const contrast = await page.evaluate(() => {
    const el = document.querySelector('.section-index');
    if (!el) return null;
    const muted = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim();
    return muted;
  });
  record(site, '--text-muted mais escuro (contraste)', contrast && contrast.toLowerCase() !== '#8c8b84', 'valor=' + contrast);

  // Demo dialog abre
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  const demoBtn = page.locator('.demo-trigger').first();
  await demoBtn.scrollIntoViewIfNeeded();
  await demoBtn.click();
  await page.waitForTimeout(400);
  const dialogOpen = await page.locator('#demo-dialog').evaluate(el => el.open);
  record(site, 'Dialog de demo abre', dialogOpen, '');
  await page.locator('#demo-close').click();

  record(site, 'Sem erros JS/console (portfolio)', errors.length === 0, errors.slice(0, 3).join(' | '));
  await page.screenshot({ path: path.join(OUT, `portfolio-final-1440.png`), fullPage: false });
  await ctx.close();
}

// ---------------- PAPITOS ----------------
async function testPapitos(browser) {
  const site = 'papitos';
  const url = BASE + '/projetos/papitos/index.html';
  const { ctx, page, errors } = await newPage(browser);

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await checkOverflow(page, site, width);
  }

  // Menu mobile abre/fecha
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.locator('#menu-toggle').click();
  const navOpen = await page.locator('.nav').evaluate(el => el.classList.contains('active'));
  const expanded = await page.locator('#menu-toggle').getAttribute('aria-expanded');
  record(site, 'Menu mobile abre (aria-expanded)', navOpen && expanded === 'true', 'expanded=' + expanded);
  await page.locator('.nav a[href="#cardapio"]').click();
  const navClosed = await page.locator('.nav').evaluate(el => !el.classList.contains('active'));
  record(site, 'Menu fecha ao navegar', navClosed, '');

  // Carrinho: adiciona item, abre modal, Escape fecha e devolve foco
  await page.locator('.btn-add').first().click();
  const count = await page.locator('#cart-count').textContent();
  record(site, 'Adicionar ao carrinho atualiza contador', count === '1', 'count=' + count);
  await page.locator('.btn-cart').click();
  const modalOpen = await page.locator('#cart-modal').evaluate(el => el.classList.contains('active'));
  record(site, 'Modal do carrinho abre', modalOpen, '');
  const focused = await page.evaluate(() => document.activeElement?.id);
  record(site, 'Foco vai para botão fechar', focused === 'close-cart', 'activeElement=' + focused);
  await page.keyboard.press('Escape');
  const modalClosed = await page.locator('#cart-modal').evaluate(el => !el.classList.contains('active'));
  const focusedBack = await page.evaluate(() => document.activeElement?.className || '');
  record(site, 'Escape fecha carrinho e devolve foco', modalClosed && /btn-cart/.test(focusedBack), 'activeElement=' + focusedBack);

  // Quantidade
  await page.locator('.btn-cart').click();
  await page.locator('.qty-btn').last().click();
  const qty = await page.locator('.qty-val').textContent();
  record(site, 'Aumentar quantidade funciona', qty === '2', 'qty=' + qty);
  await page.keyboard.press('Escape');

  // localStorage protegido: grava lixo e recarrega sem erro
  await page.evaluate(() => localStorage.setItem('papitos-cart', '{corrompido'));
  const errsBefore = errors.length;
  await page.reload({ waitUntil: 'domcontentloaded' });
  const countAfterLoot = await page.locator('#cart-count').textContent();
  record(site, 'localStorage corrompido não quebra', countAfterLoot === '0' && errors.length === errsBefore, 'count=' + countAfterLoot);

  // Checkout abre e fecha
  await page.evaluate(() => localStorage.removeItem('papitos-cart'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('.btn-add').first().click();
  await page.locator('.btn-cart').click();
  await page.locator('#finalizar').click();
  await page.waitForTimeout(300);
  const checkoutOpen = await page.locator('#checkout-modal').evaluate(el => el.classList.contains('active'));
  record(site, 'Checkout abre a partir do carrinho', checkoutOpen, '');
  await page.keyboard.press('Escape');
  const checkoutClosed = await page.locator('#checkout-modal').evaluate(el => !el.classList.contains('active'));
  record(site, 'Escape fecha checkout', checkoutClosed, '');

  record(site, 'Sem erros JS/console (papitos)', errors.length === 0, errors.slice(0, 3).join(' | '));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: path.join(OUT, 'papitos-final-390.png') });
  await ctx.close();
}

// ---------------- BEAUTY STORE ----------------
async function testBeauty(browser) {
  const site = 'beauty-store';
  const url = BASE + '/projetos/beauty-store/index.html';
  const { ctx, page, errors } = await newPage(browser);

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await checkOverflow(page, site, width);
  }

  // Filtro Ofertas: só produtos com preço antigo
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.locator('.cat-link[data-cat="ofertas"]').click();
  const offerStats = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.produto-card')];
    return {
      total: cards.length,
      allHaveOld: cards.length > 0 && cards.every(c => !!c.querySelector('.produto-preco-antigo')),
    };
  });
  record(site, 'Filtro Ofertas filtra de verdade', offerStats.total > 0 && offerStats.allHaveOld, JSON.stringify(offerStats));
  await page.locator('.cat-link[data-cat="todos"]').click();
  const allStats = await page.evaluate(() => document.querySelectorAll('.produto-card').length);
  record(site, 'Filtro Todos restaura catálogo', allStats > offerStats.total, 'total=' + allStats);

  // Carrinho abre/fecha com Escape e devolve foco
  await page.locator('.btn-add-cart').first().click();
  await page.locator('#cart-btn').click();
  const drawerOpen = await page.locator('#cart-drawer').evaluate(el => el.classList.contains('active'));
  const focused = await page.evaluate(() => document.activeElement?.id || document.activeElement?.className || '');
  record(site, 'Drawer do carrinho abre', drawerOpen && /close-cart|cart-header/.test(focused), 'focused=' + focused);
  await page.keyboard.press('Escape');
  const drawerClosed = await page.locator('#cart-drawer').evaluate(el => !el.classList.contains('active'));
  const focusedBack = await page.evaluate(() => document.activeElement?.id || '');
  record(site, 'Escape fecha carrinho e devolve foco', drawerClosed && focusedBack === 'cart-btn', 'focused=' + focusedBack);

  // Detalhe do produto: abre pelo card, fecha com Escape
  await page.locator('.produto-nome').first().click();
  const detailOpen = await page.locator('#detail-modal').evaluate(el => el.classList.contains('active'));
  record(site, 'Detalhe do produto abre', detailOpen, '');
  await page.keyboard.press('Escape');
  const detailClosed = await page.locator('#detail-modal').evaluate(el => !el.classList.contains('active'));
  record(site, 'Escape fecha detalhe', detailClosed, '');

  // Newsletter com handler
  await page.locator('#newsletter-email').fill('teste@exemplo.com');
  await page.locator('#newsletter-form button').click();
  await page.waitForTimeout(200);
  const url2 = page.url();
  record(site, 'Newsletter não recarrega a página', url2 === url, url2);

  // localStorage protegido
  const errsBefore = errors.length;
  await page.evaluate(() => { localStorage.setItem('beauty-cart', 'não é json'); localStorage.setItem('beauty-fav', '{"x":1}'); });
  await page.reload({ waitUntil: 'domcontentloaded' });
  const count = await page.locator('#cart-count').textContent();
  record(site, 'localStorage corrompido não quebra', count === '0' && errors.length === errsBefore, 'count=' + count);
  await page.evaluate(() => { localStorage.removeItem('beauty-cart'); localStorage.removeItem('beauty-fav'); });

  record(site, 'Sem erros JS/console (beauty-store)', errors.length === 0, errors.slice(0, 3).join(' | '));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: path.join(OUT, 'beauty-store-final-390.png') });
  await ctx.close();
}

// ---------------- SEU MANOEL ----------------
async function testSeuManoel(browser) {
  const site = 'seu-manoel';
  const url = BASE + '/projetos/seu-manoel/index.html';
  const { ctx, page, errors } = await newPage(browser);

  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await checkOverflow(page, site, width);
  }

  // Fluxo completo de agendamento
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.removeItem('seu-manoel:bookings:v2'));

  // 1. Serviço (radio coberto pelo label — padrão do markup; force:true dispara change igual)
  await page.locator('input[name="service"]').first().check({ force: true });
  await page.locator('#continue-button').click();
  // 2. Profissional
  await page.locator('input[name="professional"]').first().check({ force: true });
  await page.locator('#continue-button').click();
  // 3. Data (futura, próximo mês para garantir disponibilidade)
  const futureDate = await page.evaluate(() => {
    const d = new Date(); d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });
  await page.locator('input[name="date"]').fill(futureDate);
  await page.locator('input[name="date"]').dispatchEvent('change');
  await page.locator('#continue-button').click();
  // 4. Horário
  const availableRadio = page.locator('input[name="time"]:not([disabled])').first();
  await availableRadio.check({ force: true });
  const chosenStart = await availableRadio.getAttribute('value');
  await page.locator('#continue-button').click();
  // 5. Dados
  await page.locator('input[name="name"]').fill('Teste Validação');
  await page.locator('input[name="phone"]').fill('(11) 99999-9999');
  await page.locator('#continue-button').click();
  // 6. Revisão → confirma
  const onReview = await page.locator('#phase-review').isVisible().catch(() => false);
  record(site, 'Fluxo alcança revisão', onReview, '');
  await page.locator('#continue-button').click();
  await page.waitForTimeout(300);
  const confirmed = await page.locator('#phase-confirmation').isVisible().catch(() => false);
  record(site, 'Confirmação exibida', confirmed, '');

  // Slot ocupado some da lista da nova reserva (mesmo profissional/data)
  await page.locator('[data-action="new-booking"]').click();
  await page.locator('input[name="service"]').first().check({ force: true });
  await page.locator('#continue-button').click();
  await page.locator('input[name="professional"]').first().check({ force: true });
  await page.locator('#continue-button').click();
  await page.locator('input[name="date"]').fill(futureDate);
  await page.locator('input[name="date"]').dispatchEvent('change');
  await page.locator('#continue-button').click();
  const slotBlocked = await page.evaluate((start) => {
    const input = document.querySelector(`input[name="time"][value="${start}"]`);
    return input ? input.disabled : null;
  }, chosenStart);
  record(site, 'Horário reservado fica indisponível', slotBlocked === true, 'slot=' + chosenStart + ' disabled=' + slotBlocked);

  record(site, 'Sem erros JS/console (seu-manoel)', errors.length === 0, errors.slice(0, 3).join(' | '));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.screenshot({ path: path.join(OUT, 'seu-manoel-final-390.png') });
  await ctx.close();
}

(async () => {
  const browser = await chromium.launch({ executablePath: EXE, headless: true });
  try {
    await testPortfolio(browser);
    await testPapitos(browser);
    await testBeauty(browser);
    await testSeuManoel(browser);
  } finally {
    await browser.close();
  }

  const failed = results.filter(r => !r.passed);
  fs.writeFileSync(path.join(OUT, 'validacao-final.json'), JSON.stringify({ generatedAt: new Date().toISOString(), total: results.length, passed: results.length - failed.length, failed: failed.length, results }, null, 2));
  console.log(`\n==== RESULTADO: ${results.length - failed.length}/${results.length} passaram ====`);
  if (failed.length) {
    console.log('Falhas:');
    failed.forEach(f => console.log(` - [${f.site}] ${f.name} :: ${f.detail}`));
    process.exitCode = 1;
  }
})();

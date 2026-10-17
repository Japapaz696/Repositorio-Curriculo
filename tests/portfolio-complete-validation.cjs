const { chromium } = require('playwright');

const base = 'http://127.0.0.1:8018/';
const output = '.visual-audit/portfolio-complete-validation.json';
const issues = [];

function record(name, passed, detail = '') {
  issues.push({ name, passed, detail });
}

async function testPortfolio(browser) {
  const context = await browser.newContext({ viewport: { width: 430, height: 932 }, reducedMotion: 'reduce', colorScheme: 'light' });
  const page = await context.newPage();
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text());
  });

  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);

  await page.locator('#palette-toggle').click();
  await page.locator('#palette-input').fill('experiencia');
  const paletteEntry = page.locator('#palette-list button', { hasText: 'Experiência' });
  record('Paleta inclui Experiência', await paletteEntry.count() === 1);
  await paletteEntry.click();
  await page.waitForTimeout(250);
  record('Paleta navega até Experiência', await page.evaluate(() => {
    const section = document.querySelector('#experience');
    const header = document.querySelector('.site-header');
    if (!section || !header) return false;
    const top = section.getBoundingClientRect().top;
    return top >= header.getBoundingClientRect().height - 2 && top < window.innerHeight;
  }));

  for (const demoId of ['seu-manoel', 'beauty-store', 'papitos']) {
    const trigger = page.locator(`[data-demo-id="${demoId}"]`);
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    await page.locator('#demo-dialog').waitFor({ state: 'visible' });
    await page.locator('#demo-frame-host iframe').waitFor({ state: 'attached' });
    await page.waitForTimeout(650);
    const state = await page.evaluate(() => ({
      open: document.querySelector('#demo-dialog').open,
      src: document.querySelector('#demo-frame-host iframe')?.getAttribute('src'),
      active: document.activeElement?.id,
      fullLink: document.querySelector('#demo-full-link')?.getAttribute('href')
    }));
    record(`${demoId}: diálogo abre`, state.open === true, JSON.stringify(state));
    record(`${demoId}: iframe correto`, state.src === `projetos/${demoId}/index.html`, state.src || 'sem src');
    record(`${demoId}: foco inicial no fechar`, state.active === 'demo-close', state.active || 'sem foco');
    record(`${demoId}: link completo correto`, state.fullLink === `projetos/${demoId}/index.html`, state.fullLink || 'sem href');

    await page.locator('#demo-full-link').focus();
    await page.keyboard.press('Shift+Tab');
    const trappedFocus = await page.evaluate(() => document.activeElement?.tagName);
    record(`${demoId}: Shift+Tab mantém o foco no diálogo`, trappedFocus === 'IFRAME', trappedFocus || 'sem foco');

    await page.locator('#demo-close').focus();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    const afterClose = await page.evaluate(() => ({
      open: document.querySelector('#demo-dialog').open,
      activeDemoId: document.activeElement?.dataset?.demoId
    }));
    record(`${demoId}: Escape fecha e restaura foco`, !afterClose.open && afterClose.activeDemoId === demoId, JSON.stringify(afterClose));
  }

  record('Portfólio sem erros de navegador', browserErrors.length === 0, browserErrors.join('\n'));
  await context.close();
}

async function testBeautyStore(browser) {
  const context = await browser.newContext({ viewport: { width: 430, height: 932 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
  await page.goto(new URL('projetos/beauty-store/index.html', base).href, { waitUntil: 'domcontentloaded' });
  await page.locator('.btn-add-cart').first().click();
  await page.locator('#cart-btn').click();
  record('Beauty Store: carrinho abre', await page.locator('#cart-drawer.active').count() === 1);
  record('Beauty Store: item adicionado', await page.locator('#cart-count').textContent() === '1');
  await page.locator('#close-cart').click();
  await page.locator('#favoritos-btn').click();
  record('Beauty Store: favoritos abre', await page.locator('#fav-drawer.active').count() === 1);
  await page.locator('#close-fav').click();
  record('Beauty Store sem erros de navegador', browserErrors.length === 0, browserErrors.join('\n'));
  await context.close();
}

async function testPapitos(browser) {
  const context = await browser.newContext({ viewport: { width: 430, height: 932 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
  await page.goto(new URL('projetos/papitos/index.html', base).href, { waitUntil: 'domcontentloaded' });
  await page.locator('.btn-add').first().click();
  await page.locator('.btn-cart').click();
  record('Papitos: carrinho abre', await page.locator('#cart-modal.active').count() === 1);
  record('Papitos: item adicionado', Number(await page.locator('#cart-count').textContent()) >= 1);
  record('Papitos: link do carrinho não deixa âncora quebrada', await page.evaluate(() => location.hash !== '#pedido'), await page.evaluate(() => location.hash));
  await page.locator('#close-cart').click();
  record('Papitos sem erros de navegador', browserErrors.length === 0, browserErrors.join('\n'));
  await context.close();
}

async function testSeuManoel(browser) {
  const context = await browser.newContext({ viewport: { width: 430, height: 932 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') browserErrors.push(message.text()); });
  await page.goto(new URL('projetos/seu-manoel/index.html', base).href, { waitUntil: 'domcontentloaded' });
  await page.locator('#service-options button, #service-options input').first().click();
  await page.locator('#continue-button').click();
  record('Seu Manoel: avança após serviço', await page.locator('#phase-professional:not([hidden])').count() === 1);
  await page.locator('#mobile-summary-trigger').click();
  record('Seu Manoel: resumo abre', await page.locator('#summary-dialog[open]').count() === 1);
  await page.keyboard.press('Escape');
  record('Seu Manoel: Escape fecha resumo', await page.locator('#summary-dialog[open]').count() === 0);
  record('Seu Manoel sem erros de navegador', browserErrors.length === 0, browserErrors.join('\n'));
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  await testPortfolio(browser);
  await testBeautyStore(browser);
  await testPapitos(browser);
  await testSeuManoel(browser);
  await browser.close();

  const fs = require('node:fs/promises');
  await fs.writeFile(output, JSON.stringify(issues, null, 2));
  console.log(JSON.stringify(issues, null, 2));
  if (issues.some((result) => !result.passed)) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exit(2);
});

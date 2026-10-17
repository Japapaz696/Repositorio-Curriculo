const { chromium } = require('playwright');

const base = 'http://127.0.0.1:8018/';
const sizes = [375, 390, 430, 768, 1024, 1440];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const report = [];

  for (const width of sizes) {
    const height = width < 768 ? 844 : 900;
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: 'reduce',
      colorScheme: 'light'
    });
    const page = await context.newPage();
    const errors = [];
    const badResponses = [];

    page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`);
    });
    page.on('response', (response) => {
      if (response.status() >= 400 && response.url().startsWith(base)) {
        badResponses.push(`HTTP ${response.status()} ${response.url()}`);
      }
    });

    const response = await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);

    const result = {
      width,
      http: response.status(),
      errors,
      badResponses,
      metrics: await page.evaluate(() => ({
        h1: document.querySelectorAll('h1').length,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
        experience: Boolean(document.querySelector('#experience')),
        navVisible: getComputedStyle(document.querySelector('#nav-links')).display !== 'none'
      }))
    };

    if (width < 768) {
      await page.locator('#menu-toggle').click();
      result.menu = await page.evaluate(() => ({
        expanded: document.querySelector('#menu-toggle').getAttribute('aria-expanded'),
        menuVisible: getComputedStyle(document.querySelector('#nav-links')).visibility !== 'hidden',
        menuClassOpen: document.querySelector('#nav-links').classList.contains('open'),
        experienceLink: Boolean(document.querySelector('#nav-links a[href="#experience"]'))
      }));
      await page.locator('#menu-toggle').click();
    }

    if (width === 390) {
      const before = await page.evaluate(() => document.documentElement.dataset.theme);
      await page.locator('#theme-toggle').click();
      result.theme = {
        before,
        ...(await page.evaluate(() => ({
          after: document.documentElement.dataset.theme,
          pressed: document.querySelector('#theme-toggle').getAttribute('aria-pressed')
        })))
      };
    }

    if (width === 430) {
      await page.locator('[data-demo-id="seu-manoel"]').click();
      await page.locator('#demo-dialog').waitFor({ state: 'visible' });
      await page.locator('#demo-frame-host iframe').waitFor({ state: 'attached' });
      await page.waitForTimeout(800);
      result.demo = await page.evaluate(() => ({
        open: document.querySelector('#demo-dialog').open,
        src: document.querySelector('#demo-frame-host iframe')?.getAttribute('src'),
        statusHidden: document.querySelector('#demo-loading').hidden
      }));
      await page.keyboard.press('Escape');
      result.demo.closed = await page.evaluate(() => !document.querySelector('#demo-dialog').open);
    }

    await page.screenshot({
      path: `.visual-audit/portfolio-interactive-${width}.png`,
      fullPage: true
    });
    report.push(result);
    await context.close();
  }

  console.log(JSON.stringify(report, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

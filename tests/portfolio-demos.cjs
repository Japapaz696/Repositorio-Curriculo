const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PORT = 8091;
const demos = [
  { id: 'seu-manoel', selector: '[data-demo-id="seu-manoel"]', marker: '#booking-title' },
  { id: 'papitos', selector: '[data-demo-id="papitos"]', marker: '#cardapio' },
  { id: 'beauty-store', selector: '[data-demo-id="beauty-store"]', marker: '#produtos' },
];

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function serve() {
  return http.createServer((request, response) => {
    const requestPath = decodeURIComponent(request.url.split('?')[0]);
    const relative = requestPath === '/' ? '/index.html' : requestPath;
    const filePath = path.resolve(ROOT, `.${relative}`);
    if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(response);
  });
}

(async () => {
  const server = serve();
  await new Promise((resolve) => server.listen(PORT, resolve));
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(`PAGEERROR ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`CONSOLE ${message.text()}`);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`HTTP ${response.status()} ${response.url()}`);
  });

  await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'domcontentloaded' });
  if (await page.locator('#demo-dialog iframe').count()) throw new Error('Demo iframe exists before interaction');

  for (const demo of demos) {
    const trigger = page.locator(demo.selector);
    await trigger.scrollIntoViewIfNeeded();
    await trigger.focus();
    await trigger.press('Enter');
    await page.locator('#demo-dialog').waitFor({ state: 'visible' });
    await page.locator('#demo-dialog iframe').waitFor({ state: 'attached' });
    await page.locator('#demo-dialog iframe').waitFor({ state: 'visible' });
    await page.frameLocator('#demo-dialog iframe').locator(demo.marker).waitFor({ state: 'visible', timeout: 30000 });

    const openState = await page.evaluate(() => ({
      bodyLocked: getComputedStyle(document.body).overflow === 'hidden',
      iframeCount: document.querySelectorAll('#demo-dialog iframe').length,
      pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      focusInside: document.querySelector('#demo-dialog')?.contains(document.activeElement),
    }));
    if (!openState.bodyLocked || openState.iframeCount !== 1 || openState.pageOverflow || !openState.focusInside) {
      throw new Error(`${demo.id} invalid open state: ${JSON.stringify(openState)}`);
    }

    await page.locator('#demo-dialog').press('Tab');
    await page.locator('#demo-dialog').press('Shift+Tab');
    await page.keyboard.press('Escape');
    await page.locator('#demo-dialog').waitFor({ state: 'hidden' });
    const returned = await page.evaluate(() => document.activeElement?.matches('[data-demo-trigger]'));
    if (!returned) throw new Error(`${demo.id} did not restore focus`);
  }

  await page.locator('[data-demo-id="seu-manoel"]').focus();
  await page.keyboard.press('Enter');
  await page.locator('#demo-dialog iframe').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await page.locator('#demo-dialog').waitFor({ state: 'hidden' });

  await context.close();
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('portfolio demos: 3/3 opened, loaded, interacted, closed, and restored focus');
})().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});

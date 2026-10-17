const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');

const base = 'http://127.0.0.1:8018/';
const output = path.resolve('.visual-audit/http');
const pages = [
  { name: 'portfolio', path: 'index.html' },
  { name: 'seu-manoel', path: 'projetos/seu-manoel/index.html' },
  { name: 'papitos', path: 'projetos/papitos/index.html' },
  { name: 'beauty-store', path: 'projetos/beauty-store/index.html' }
];
const viewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 }
];

function unique(values) {
  return [...new Set(values)];
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = [];

  for (const pageConfig of pages) {
    for (const viewport of viewports) {
      const context = await browser.newContext({ viewport, reducedMotion: 'reduce', colorScheme: 'light' });
      const page = await context.newPage();
      const issues = [];
      const localOrigin = new URL(base).origin;

      page.on('pageerror', (error) => issues.push({ severity: 'error', type: 'JavaScript', detail: error.message }));
      page.on('console', (message) => {
        if (message.type() === 'error') issues.push({ severity: 'warning', type: 'Console', detail: message.text() });
      });
      page.on('response', (response) => {
        if (response.status() >= 400) {
          issues.push({
            severity: response.url().startsWith(localOrigin) ? 'error' : 'warning',
            type: `HTTP ${response.status()}`,
            detail: response.url()
          });
        }
      });
      page.on('requestfailed', (request) => {
        issues.push({ severity: 'warning', type: 'Request failed', detail: `${request.url()}: ${request.failure()?.errorText || '?'}` });
      });

      const url = new URL(pageConfig.path, base).href;
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.evaluate(() => document.fonts?.ready).catch(() => {});
      await page.evaluate(async () => {
        const limit = Math.min(document.documentElement.scrollHeight, 30000);
        for (let y = 0; y < limit; y += 650) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 25));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(300);

      const measurements = await page.evaluate(() => {
        const documentRoot = document.documentElement;
        const images = [...document.querySelectorAll('img')];
        const badImages = images.filter((image) => !image.complete || !image.naturalWidth).map((image) => image.currentSrc || image.getAttribute('src'));
        const missingAlt = images.filter((image) => !image.hasAttribute('alt')).map((image) => image.getAttribute('src'));
        const brokenAnchors = [...document.querySelectorAll('a[href^="#"]')]
          .map((anchor) => anchor.getAttribute('href'))
          .filter((href) => href && href.length > 1 && !document.getElementById(decodeURIComponent(href.slice(1))));
        return {
          h1Count: document.querySelectorAll('h1').length,
          contentWidth: documentRoot.scrollWidth,
          viewportWidth: window.innerWidth,
          badImages,
          missingAlt,
          brokenAnchors
        };
      });

      if (response?.status() >= 400) issues.push({ severity: 'error', type: 'Page', detail: `HTTP ${response.status()} ${url}` });
      if (measurements.contentWidth > viewport.width + 2) issues.push({ severity: 'error', type: 'Horizontal overflow', detail: `${measurements.contentWidth}px content in ${viewport.width}px viewport` });
      if (measurements.h1Count !== 1) issues.push({ severity: 'warning', type: 'Heading hierarchy', detail: `Expected one h1; found ${measurements.h1Count}` });
      for (const source of unique(measurements.badImages)) issues.push({ severity: 'error', type: 'Broken image', detail: source || '(no source)' });
      for (const source of unique(measurements.missingAlt)) issues.push({ severity: 'warning', type: 'Missing alt', detail: source || '(no source)' });
      for (const href of unique(measurements.brokenAnchors)) issues.push({ severity: 'warning', type: 'Missing anchor target', detail: href });

      const file = `${pageConfig.name}-${viewport.width}.png`;
      await page.screenshot({ path: path.join(output, file), fullPage: true, animations: 'disabled' });
      report.push({ page: pageConfig.name, viewport: `${viewport.width}x${viewport.height}`, screenshot: file, measurements, issues });
      await context.close();
    }
  }

  await browser.close();
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify({ generatedAt: new Date().toISOString(), base, report }, null, 2));
  const total = report.flatMap((entry) => entry.issues);
  const errors = total.filter((issue) => issue.severity === 'error').length;
  console.log(JSON.stringify({ entries: report.length, errors, warnings: total.length - errors, output }, null, 2));
  if (errors) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exit(2);
});

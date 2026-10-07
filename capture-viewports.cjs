const { chromium } = require('playwright');

const viewports = [
  { width: 375, height: 667 },   // iPhone SE/8
  { width: 390, height: 844 },   // iPhone 12/13 Pro
  { width: 430, height: 932 },   // iPhone 14 Plus
  { width: 768, height: 1024 },  // iPad
  { width: 1024, height: 768 }   // Small laptop/tablet landscape
];

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const viewport of viewports) {
    const { width, height } = viewport;
    console.log(`\n=== Capturing viewport ${width}x${height} ===`);

    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    const consoleErrors = [];
    const failedRequests = [];
    const consoleWarnings = [];

    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        consoleErrors.push(text);
      } else if (type === 'warning') {
        consoleWarnings.push(text);
      }
    });

    page.on('requestfailed', (req) => {
      failedRequests.push({
        url: req.url(),
        failure: req.failure()?.errorText,
      });
    });

    page.on('response', (resp) => {
      if (resp.status() >= 400) {
        failedRequests.push({
          url: resp.url(),
          status: resp.status(),
          statusText: resp.statusText(),
        });
      }
    });

    let navError = null;
    try {
      await page.goto('http://localhost:8080/index.html', {
        waitUntil: 'networkidle',
        timeout: 30000,
      });
    } catch (e) {
      navError = e.message;
    }

    // Wait a bit for any lazy-loaded content / animations
    await page.waitForTimeout(2000);

    const fullPage = await page.evaluate(() => document.documentElement.scrollHeight);
    const bodyScroll = await page.evaluate(() => document.body.scrollHeight);

    // Check for overflow
    const overflowInfo = await page.evaluate(() => {
      const results = [];
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const overflowX = el.scrollWidth > el.clientWidth + 2;
        const overflowY = el.scrollHeight > el.clientHeight + 2;
        if (overflowX || overflowY) {
          results.push({
            tag: el.tagName,
            id: el.id,
            class: el.className?.toString().slice(0, 80),
            text: (el.textContent || '').slice(0, 60),
            scrollW: el.scrollWidth,
            clientW: el.clientWidth,
            scrollH: el.scrollHeight,
            clientH: el.clientHeight,
            overflowX,
            overflowY,
            overflow: style.overflow,
          });
        }
      }
      return results;
    });

    const screenshotPath = `C:\\Users\\Lucas\\Documents\\OMNIROUTE\\Curr-culo-\\screenshot-${width}px.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });

    console.log('=== NAVIGATION ===');
    console.log('Nav error:', navError || 'none');
    console.log('URL:', page.url());
    console.log('Page scroll height:', fullPage, 'Body scroll height:', bodyScroll);
    console.log('Viewport:', width, 'x', height);

    console.log('\n=== CONSOLE ERRORS (' + consoleErrors.length + ') ===');
    consoleErrors.forEach((e, i) => console.log((i + 1) + '. ' + e));

    console.log('\n=== CONSOLE WARNINGS (' + consoleWarnings.length + ') ===');
    consoleWarnings.forEach((e, i) => console.log((i + 1) + '. ' + e));

    console.log('\n=== FAILED/ERROR REQUESTS (' + failedRequests.length + ') ===');
    failedRequests.forEach((r, i) => {
      console.log((i + 1) + '. ' + r.url + (r.status ? ' [' + r.status + ' ' + r.statusText + ']' : '') + (r.failure ? ' - ' + r.failure : ''));
    });

    console.log('\n=== OVERFLOW ELEMENTS (' + overflowInfo.length + ') ===');
    overflowInfo.slice(0, 30).forEach((o, i) => {
      console.log((i + 1) + '. <' + o.tag.toLowerCase() + (o.id ? ' id="' + o.id + '"' : '') + (o.class ? ' class="' + o.class + '"' : '') + '> ' +
        'scrollH=' + o.scrollH + ' clientH=' + o.clientH + ' scrollW=' + o.scrollW + ' clientW=' + o.clientW +
        ' overflow=' + o.overflow + ' text="' + o.text + '"');
    });

    console.log('\n=== SCREENSHOT ===');
    console.log('Saved to:', screenshotPath);

    await context.close();
  }

  await browser.close();
  console.log('\n=== ALL VIEWPORTS CAPTURED ===');
})();
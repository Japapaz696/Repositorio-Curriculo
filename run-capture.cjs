const { chromium } = require('playwright');

const viewports = [
  { name: '375px (mobile SE)', width: 375, height: 667 },
  { name: '390px (iPhone 13 Pro)', width: 390, height: 844 },
  { name: '430px (iPhone 14 Plus)', width: 430, height: 932 },
  { name: '768px (iPad)', width: 768, height: 1024 },
  { name: '1024px (small laptop)', width: 1024, height: 768 }
];

const sectionsToCheck = [
  { id: 'hero', selector: 'section', name: 'Hero' },
  { id: 'projects', selector: 'section', name: 'Projects' },
  { id: 'creative-lab', selector: '#ai-creative-lab, section', name: 'Creative Lab' },
  { id: 'contact', selector: '#contact, section', name: 'Contact' }
];

(async () => {
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    const { width, height, name } = vp;
    console.log(`\n========================================`);
    console.log(`=== VIEWPORT: ${name} (${width}x${height}) ===`);
    console.log(`========================================`);

    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    const consoleErrors = [];
    const failedRequests = [];
    const consoleWarnings = [];

    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') consoleErrors.push(text);
      else if (type === 'warning') consoleWarnings.push(text);
    });

    page.on('requestfailed', req => {
      failedRequests.push({ url: req.url(), failure: req.failure()?.errorText || 'unknown' });
    });

    page.on('response', resp => {
      if (resp.status() >= 400) {
        failedRequests.push({ url: resp.url(), status: resp.status(), statusText: resp.statusText() });
      }
    });

    let navError = null;
    try {
      await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle', timeout: 30000 });
    } catch (e) {
      navError = e.message;
    }

    await page.waitForTimeout(1500);

    console.log(`NAVIGATION: ${navError || 'OK'}`);
    console.log(`URL: ${page.url()}`);

    // Verify key sections render
    const bodyText = await page.evaluate(() => document.body.innerText || '');
    const sectionChecks = await page.evaluate((names) => {
      const results = {};
      for (const sec of names) {
        const el = document.querySelector(sec.selector);
        results[sec.id] = !!el;
      }
      return results;
    }, sectionsToCheck);

    console.log('SECTION RENDER CHECK:');
    for (const [key, present] of Object.entries(sectionChecks)) {
      const secName = sectionsToCheck.find(s => s.id === key)?.name || key;
      console.log(`  ${secName}: ${present ? 'PRESENT' : 'MISSING'}`);
    }

    // Image / video load checks
    const mediaStatus = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const videos = Array.from(document.querySelectorAll('video'));
      const results = { brokenImages: 0, brokenVideos: 0, imageCount: imgs.length, videoCount: videos.length };
      for (const img of imgs) {
        if (!img.complete || img.naturalWidth === 0) results.brokenImages++;
      }
      for (const vid of videos) {
        if (vid.error) results.brokenVideos++;
      }
      return results;
    });

    console.log('MEDIA STATUS:');
    console.log(`  Images: ${mediaStatus.imageCount} loaded, ${mediaStatus.brokenImages} broken`);
    console.log(`  Videos: ${mediaStatus.videoCount} loaded, ${mediaStatus.brokenVideos} broken`);

    // Overflow / visual check
    const overflowInfo = await page.evaluate(() => {
      const results = [];
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const rect = el.getBoundingClientRect();
        const overflowX = el.scrollWidth > el.clientWidth + 2;
        const overflowY = el.scrollHeight > el.clientHeight + 2;
        if (overflowX || overflowY) {
          results.push({
            tag: el.tagName,
            id: el.id || '',
            classStr: (el.className || '').toString().slice(0, 80),
            overflowX, overflowY,
            text: (el.textContent || '').slice(0, 50)
          });
        }
      }
      return results;
    });

    if (overflowInfo.length > 0) {
      console.log(`OVERFLOW ELEMENTS (${overflowInfo.length}):`);
      overflowInfo.slice(0, 15).forEach(o => {
        console.log(`  <${o.tag.toLowerCase()}${o.id ? ' id="'+o.id+'"' : ''}${o.classStr ? ' class="'+o.classStr+'"' : ''}> overflowX=${o.overflowX} overflowY=${o.overflowY} text="${o.text}"`);
      });
    } else {
      console.log('OVERFLOW ELEMENTS: None detected');
    }

    // Console errors
    console.log(`CONSOLE ERRORS (${consoleErrors.length}):`);
    if (consoleErrors.length === 0) console.log('  None');
    else consoleErrors.forEach((e, i) => console.log(`  ${i+1}. ${e.substring(0, 300)}`));

    // Console warnings
    console.log(`CONSOLE WARNINGS (${consoleWarnings.length}):`);
    if (consoleWarnings.length === 0) console.log('  None');
    else consoleWarnings.forEach((w, i) => console.log(`  ${i+1}. ${w.substring(0, 300)}`));

    // Failed requests
    console.log(`FAILED REQUESTS (${failedRequests.length}):`);
    if (failedRequests.length === 0) console.log('  None');
    else failedRequests.forEach((r, i) => {
      const detail = r.status ? `[${r.status} ${r.statusText}]` : r.failure ? ` - ${r.failure}` : '';
      console.log(`  ${i+1}. ${r.url}${detail}`);
    });

    // Screenshot
    const screenshotPath = `C:\\Users\\Lucas\\Documents\\OMNIROUTE\\Curr-culo-\\screenshot-${width}px.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`SCREENSHOT SAVED: ${screenshotPath}`);

    await context.close();
  }

  await browser.close();
  console.log(`\n========================================`);
  console.log(`=== ALL VIEWPORTS COMPLETE ===`);
  console.log(`========================================`);
})();

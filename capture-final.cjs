const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

const server = http.createServer((req, res) => {
  let filePath = path.join(ROOT, decodeURIComponent(req.url === '/' ? '/index.html' : req.url));
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.mp4': 'video/mp4' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, async () => {
  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: '375px', width: 375, height: 667 },
    { name: '390px', width: 390, height: 844 },
    { name: '430px', width: 430, height: 932 },
    { name: '768px', width: 768, height: 1024 },
    { name: '1024px', width: 1024, height: 768 },
    { name: '1440px', width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('requestfailed', (r) => errors.push('REQFAIL ' + r.url() + ' ' + (r.failure()?.errorText || '')));
    page.on('response', (r) => { if (r.status() >= 400) errors.push('HTTP ' + r.status() + ' ' + r.url()); });

    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const overflow = await page.evaluate(() => {
      const results = [];
      document.querySelectorAll('*').forEach((el) => {
        if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2) {
          results.push({ tag: el.tagName, id: el.id, cls: (el.className || '').toString().slice(0, 60), overflowX: el.scrollWidth > el.clientWidth + 2, overflowY: el.scrollHeight > el.clientHeight + 2, text: (el.textContent || '').slice(0, 40) });
        }
      });
      return results;
    });

    const brokenMedia = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const videos = Array.from(document.querySelectorAll('video'));
      return { brokenImages: imgs.filter((i) => !i.complete || i.naturalWidth === 0).length, totalImages: imgs.length, brokenVideos: videos.filter((v) => v.error).length, totalVideos: videos.length };
    });

    const out = `C:\\Users\\Lucas\\Documents\\OMNIROUTE\\Curr-culo-\\final-${vp.name}.png`;
    await page.screenshot({ path: out, fullPage: true });

    console.log(`\n=== ${vp.width}x${vp.height} ===`);
    console.log('Overflow:', overflow.length ? overflow.slice(0, 8).map((o) => `<${o.tag.toLowerCase()}${o.id ? ' id="' + o.id + '"' : ''} class="${o.cls}"> overflowX=${o.overflowX} overflowY=${o.overflowY} text="${o.text}"`).join(' | ') : 'none');
    console.log('Media:', brokenMedia);
    console.log('Console errors:', errors.length ? errors.slice(0, 10).join(' | ') : 'none');
    console.log('Screenshot:', out);

    await context.close();
  }

  await browser.close();
  server.close();
  console.log('\n=== CAPTURE COMPLETE ===');
});
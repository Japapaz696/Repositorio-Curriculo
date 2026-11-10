const { chromium } = require('playwright');
const { spawn } = require('child_process');
const http = require('http');

async function main() {
  const PORT = '8185';
  const server = spawn('node', ['tools/serve.cjs'], { env: { ...process.env, PORT } });
  
  // Wait for server to start
  await new Promise(resolve => {
    const check = () => {
      http.get(`http://127.0.0.1:${PORT}/index.html`, res => {
        if (res.statusCode === 200) resolve();
        else setTimeout(check, 100);
      }).on('error', () => setTimeout(check, 100));
    };
    check();
  });

  const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' });

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'laptop', width: 1024, height: 768 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
    { name: 'mobile-small', width: 375, height: 812 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const errors = [];
    page.on('pageerror', e => errors.push(`[JS Error] ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`[Console Error] ${m.text()}`); });

    await page.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'networkidle' });

    // Scroll to bottom and back to trigger lazy loaded images
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(r => setTimeout(r, 300));
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 200));
    });
    await page.waitForLoadState('networkidle');

    const metrics = await page.evaluate(async (vpWidth) => {
      const issues = [];
      const docW = document.documentElement.scrollWidth;
      if (docW > vpWidth + 1) {
        issues.push(`Horizontal overflow: ${docW}px in ${vpWidth}px`);
      }

      // Check visible images
      const visibleImgs = [...document.querySelectorAll('img')].filter(img => !img.closest('[hidden]'));
      await Promise.all(visibleImgs.map(img => img.decode().catch(() => {})));
      const brokenImgs = visibleImgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.getAttribute('src'));
      if (brokenImgs.length) {
        issues.push(`Broken visible images: ${brokenImgs.join(', ')}`);
      }

      // Check tablist children ARIA compliance
      document.querySelectorAll('[role="tablist"]').forEach(tl => {
        for (const child of tl.children) {
          const role = child.getAttribute('role');
          if (role !== 'tab' && role !== 'presentation' && role !== 'none') {
            issues.push(`Invalid child in role=tablist: <${child.tagName.toLowerCase()} class="${child.className}">`);
          }
        }
      });

      return { docW, issues, visibleImagesCount: visibleImgs.length };
    }, vp.width);

    console.log(`Viewport ${vp.name.padEnd(12)} (${String(vp.width).padEnd(4)}px): ${metrics.issues.length ? 'ISSUES: ' + metrics.issues.join(' | ') : 'PASS (0 issues)'}`);
    if (errors.length) console.log('  Page errors:', errors);

    await page.close();
  }

  // Check dark mode
  const darkPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await darkPage.goto(`http://127.0.0.1:${PORT}/index.html`, { waitUntil: 'networkidle' });
  await darkPage.click('#theme-toggle');
  await darkPage.waitForTimeout(150);

  const darkCheck = await darkPage.evaluate(() => {
    const cta = document.querySelector('.hero-cta--primary');
    const cs = window.getComputedStyle(cta);
    return {
      theme: document.documentElement.dataset.theme,
      ctaBg: cs.backgroundColor,
      ctaColor: cs.color
    };
  });
  console.log('Dark Mode Check:', darkCheck);

  await darkPage.close();
  await browser.close();
  server.kill();
}

main().catch(console.error);

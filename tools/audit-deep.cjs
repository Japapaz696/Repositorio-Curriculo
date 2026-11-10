const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function test() {
  const ROOT = path.resolve(__dirname, '..');
  const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    let p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]).replace(/^\//, '') || 'index.html');
    if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
    if (!fs.existsSync(p)) { res.writeHead(404); return res.end('Not found'); }
    const ext = path.extname(p).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });

  await new Promise(r => server.listen(8190, '127.0.0.1', r));
  const browser = await chromium.launch({ executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://127.0.0.1:8190/index.html', { waitUntil: 'domcontentloaded' });
  await page.click('#theme-toggle'); // Switch to dark mode
  await page.waitForTimeout(300);

  const darkData = await page.evaluate(() => {
    const samples = [];
    const sample = (sel, name) => {
      const el = document.querySelector(sel);
      if (el) {
        const cs = window.getComputedStyle(el);
        samples.push({ name, color: cs.color, bg: cs.backgroundColor, border: cs.borderColor });
      }
    };
    sample('body', 'Body Dark');
    sample('.site-header', 'Header Dark');
    sample('.hero-cta--primary', 'Hero CTA Primary Dark');
    sample('.hero-cta--secondary', 'Hero CTA Secondary Dark');
    sample('.hero-tab[aria-selected="true"]', 'Hero Tab Active Dark');
    sample('.hero-tab[aria-selected="false"]', 'Hero Tab Inactive Dark');
    sample('.project-card', 'Project Card Dark');
    sample('.exp-card', 'Experience Card Dark');
    sample('.matrix-column', 'Matrix Column Dark');
    sample('.cert-tab[aria-selected="true"]', 'Cert Tab Active Dark');
    sample('.cert-tab[aria-selected="false"]', 'Cert Tab Inactive Dark');
    sample('.stack-card', 'Stack Card Dark');
    sample('.contact-section', 'Contact Section Dark');

    return { samples };
  });

  console.log('=== DARK MODE STYLES ===');
  console.log(JSON.stringify(darkData.samples, null, 2));

  await browser.close();
  server.close();
}

test().catch(console.error);

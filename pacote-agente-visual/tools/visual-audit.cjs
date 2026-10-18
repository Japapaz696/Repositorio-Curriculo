#!/usr/bin/env node
'use strict';
/**
 * Auditoria visual portátil do portfólio — sem alterar os arquivos do site.
 * Uso: node tools/visual-audit.cjs
 * Uso: node tools/visual-audit.cjs --base-url=https://japapaz696.github.io/Repositorio-Curriculo/
 * Uso: node tools/visual-audit.cjs --output=.visual-audit/custom
 * Requer: npm install && npx playwright install chromium
 */
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Playwright indisponível. Execute na raiz do portfólio: npm install && npx playwright install chromium');
  process.exit(2);
}

const ROOT = path.resolve(__dirname, '..');
const getArg = (name) => process.argv.find((a) => a.startsWith(`${name}=`))?.slice(name.length + 1);
const OUTPUT = path.resolve(ROOT, getArg('--output') || '.visual-audit');
const EXTERNAL_BASE = getArg('--base-url');
const PAGES = [
  { name: 'portfolio', path: 'index.html' },
  { name: 'seu-manoel', path: 'projetos/seu-manoel/index.html' },
  { name: 'papitos', path: 'projetos/papitos/index.html' },
  { name: 'beauty-store', path: 'projetos/beauty-store/index.html' }
];
const VIEWPORTS = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 }
];
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.woff2': 'font/woff2'
};

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      let filepath;
      try {
        const u = new URL(req.url, 'http://localhost');
        const relative = decodeURIComponent(u.pathname).replace(/^\/+/, '');
        filepath = path.resolve(ROOT, relative || 'index.html');
        // Não permitir que URLs escapem da pasta do projeto.
        if (filepath !== ROOT && !filepath.startsWith(ROOT + path.sep)) {
          res.writeHead(403); res.end('Forbidden'); return;
        }
        let info = await fsp.stat(filepath);
        if (info.isDirectory()) {
          filepath = path.join(filepath, 'index.html');
          info = await fsp.stat(filepath);
        }
        if (!info.isFile()) throw new Error('Not a file');
        const size = info.size;
        const type = MIME[path.extname(filepath).toLowerCase()] || 'application/octet-stream';
        const range = req.headers.range;
        if (range && /^bytes=\d*-\d*$/.test(range)) {
          const [rawStart, rawEnd] = range.slice(6).split('-');
          const start = rawStart ? Number(rawStart) : Math.max(0, size - Number(rawEnd || 0));
          const end = rawStart ? (rawEnd ? Number(rawEnd) : size - 1) : size - 1;
          if (start >= size || start > end) {
            res.writeHead(416, { 'Content-Range': `bytes */${size}` }); res.end(); return;
          }
          res.writeHead(206, {
            'Content-Type': type, 'Accept-Ranges': 'bytes',
            'Content-Range': `bytes ${start}-${Math.min(end, size - 1)}/${size}`,
            'Content-Length': Math.min(end, size - 1) - start + 1
          });
          fs.createReadStream(filepath, { start, end: Math.min(end, size - 1) }).pipe(res);
          return;
        }
        res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' });
        fs.createReadStream(filepath).pipe(res);
      } catch {
        res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found');
      }
    });
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({
      server, base: `http://127.0.0.1:${server.address().port}/`
    }));
  });
}

async function scanPage(browser, base, project, viewport) {
  const context = await browser.newContext({
    viewport, deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'light'
  });
  const page = await context.newPage();
  const entry = { page: project.name, viewport: `${viewport.width}x${viewport.height}`, issues: [], screenshot: null };
  const add = (severity, type, detail) => entry.issues.push({ severity, type, detail });
  const localOrigin = new URL(base).origin;
  page.on('pageerror', e => add('erro', 'JavaScript', e.message));
  page.on('console', m => { if (m.type() === 'error') add('aviso', 'Console', m.text().slice(0, 250)); });
  page.on('response', r => {
    if (r.status() >= 400) add(r.url().startsWith(localOrigin) ? 'erro' : 'aviso', `HTTP ${r.status()}`, r.url().slice(0, 220));
  });
  page.on('requestfailed', r => add('aviso', 'Requisição falhou', `${r.url().slice(0, 180)}: ${r.failure()?.errorText || '?'}`));

  try {
    const url = new URL(project.path, base).href;
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (response && response.status() >= 400) add('erro', 'Página', `HTTP ${response.status()} ${url}`);
    await page.evaluate(() => document.fonts?.ready).catch(() => {});
    // Revela lazy-loading da página sem usar networkidle (que pode bloquear em fontes externas).
    await page.evaluate(async () => {
      const limit = Math.min(document.documentElement.scrollHeight, 30000);
      for (let y = 0; y < limit; y += 650) {
        window.scrollTo(0, y);
        await new Promise(resolve => setTimeout(resolve, 25));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(250);
    const measurements = await page.evaluate(() => {
      const doc = document.documentElement;
      const images = [...document.querySelectorAll('img')];
      const badImages = images.filter(i => !i.complete || !i.naturalWidth).map(i => i.getAttribute('src'));
      const missingAlt = images.filter(i => !i.hasAttribute('alt')).map(i => i.getAttribute('src'));
      const brokenAnchors = [...document.querySelectorAll('a[href^="#"]')]
        .map(a => a.getAttribute('href')).filter(href => href && href.length > 1 && !document.getElementById(decodeURIComponent(href.slice(1))));
      const missingButtonNames = [...document.querySelectorAll('button')]
        .filter(b => !b.hasAttribute('aria-hidden') && !b.getAttribute('aria-label')?.trim() && !(b.textContent || '').trim() && !b.getAttribute('title')?.trim())
        .map(b => b.id || b.className || '<button>');
      return {
        title: document.title,
        h1Count: document.querySelectorAll('h1').length,
        contentWidth: doc.scrollWidth,
        viewportWidth: window.innerWidth,
        badImages, missingAlt, brokenAnchors, missingButtonNames,
        imageCount: images.length
      };
    });
    entry.measurements = measurements;
    if (measurements.contentWidth > viewport.width + 2) {
      add('erro', 'Overflow horizontal', `${measurements.contentWidth}px de conteúdo em viewport ${viewport.width}px`);
    }
    if (measurements.h1Count !== 1) add('aviso', 'Hierarquia', `Esperado 1 H1; encontrados ${measurements.h1Count}`);
    for (const src of measurements.badImages) add('erro', 'Imagem não carregada', src || '(sem src)');
    for (const src of measurements.missingAlt) add('aviso', 'Alt ausente', src || '(sem src)');
    for (const href of [...new Set(measurements.brokenAnchors)]) add('aviso', 'Âncora sem destino', href);
    for (const button of measurements.missingButtonNames) add('aviso', 'Botão sem nome acessível', String(button));
    const relative = `${project.name}-${viewport.width}.png`;
    entry.screenshot = relative;
    await page.screenshot({ path: path.join(OUTPUT, relative), fullPage: true, animations: 'disabled', timeout: 25000 });
  } catch (e) {
    add('erro', 'Falha na auditoria', String(e.message || e).slice(0, 500));
  } finally {
    await context.close();
  }
  return entry;
}

(async () => {
  await fsp.mkdir(OUTPUT, { recursive: true });
  let server;
  let browser;
  try {
    const local = EXTERNAL_BASE ? null : await startServer();
    server = local?.server;
    const base = EXTERNAL_BASE ? new URL(EXTERNAL_BASE.endsWith('/') ? EXTERNAL_BASE : `${EXTERNAL_BASE}/`).href : local.base;
    console.log(`Auditando: ${base}`);
    const executablePath = getArg('--chromium') || process.env.CHROMIUM_PATH;
    browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
    const entries = [];
    for (const project of PAGES) {
      for (const viewport of VIEWPORTS) {
        const entry = await scanPage(browser, base, project, viewport);
        entries.push(entry);
        const errors = entry.issues.filter(i => i.severity === 'erro').length;
        console.log(`${project.name.padEnd(13)} ${entry.viewport.padEnd(10)} | ${errors} erros, ${entry.issues.length - errors} avisos`);
      }
    }
    const report = { generatedAt: new Date().toISOString(), base, note: 'Auditoria automatizada básica; não substitui testes de UX, contraste e navegação por teclado.', entries };
    await fsp.writeFile(path.join(OUTPUT, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
    const lines = ['# Auditoria visual', '', `Origem: ${base}`, '', 'A inspeção visual das PNGs e os testes de interação ainda são necessários.', ''];
    for (const entry of entries) {
      lines.push(`## ${entry.page} — ${entry.viewport}`, `Captura: ${entry.screenshot || 'não gerada'}`);
      if (!entry.issues.length) lines.push('Sem erros detectados pela verificação automática.');
      for (const issue of entry.issues) lines.push(`- [${issue.severity}] ${issue.type}: ${issue.detail}`);
      lines.push('');
    }
    await fsp.writeFile(path.join(OUTPUT, 'report.md'), lines.join('\n'), 'utf8');
    const totalErrors = entries.flatMap(e => e.issues).filter(i => i.severity === 'erro').length;
    console.log(`\nArquivos: ${OUTPUT}\nErros encontrados: ${totalErrors}`);
    if (totalErrors) process.exitCode = 1;
  } catch (e) {
    console.error('Erro fatal:', e.message || e);
    process.exitCode = 2;
  } finally {
    if (browser) await browser.close();
    if (server) await new Promise(resolve => server.close(resolve));
  }
})();

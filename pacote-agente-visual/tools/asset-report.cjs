#!/usr/bin/env node
'use strict';
/** Gera relatório de mídia grande e mídia repetida; não modifica nenhum arquivo. */
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, '.visual-audit');
const SKIP = new Set(['.git', 'node_modules', '.visual-audit', '.claude', 'dist', 'coverage']);
const MEDIA = new Set(['.jpeg', '.jpg', '.png', '.gif', '.webp', '.avif', '.svg', '.mp4', '.webm', '.mov']);

async function walk(dir, found = []) {
  for (const d of await fsp.readdir(dir, { withFileTypes: true })) {
    if (d.isSymbolicLink()) continue;
    const p = path.join(dir, d.name);
    if (d.isDirectory()) {
      if (!SKIP.has(d.name)) await walk(p, found);
    } else if (d.isFile() && MEDIA.has(path.extname(d.name).toLowerCase())) {
      const { size } = await fsp.stat(p);
      found.push({ path: path.relative(ROOT, p).replace(/\\/g, '/'), size, absolute: p });
    }
  }
  return found;
}

async function checksum(p) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(p);
    stream.on('error', reject);
    stream.on('data', b => hash.update(b));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

(async () => {
  try {
    const files = await walk(ROOT);
    const sizeGroups = new Map();
    for (const f of files) {
      const g = sizeGroups.get(f.size) || [];
      g.push(f);
      sizeGroups.set(f.size, g);
    }
    const duplicateGroups = [];
    for (const group of sizeGroups.values()) {
      if (group.length < 2) continue;
      const hashes = new Map();
      for (const f of group) {
        const sha = await checksum(f.absolute);
        const same = hashes.get(sha) || [];
        same.push(f.path);
        hashes.set(sha, same);
      }
      for (const same of hashes.values()) if (same.length > 1) duplicateGroups.push(same);
    }
    const large = files.filter(f => {
      const video = /\.(mp4|webm|mov)$/i.test(f.path);
      return f.size > (video ? 8 : 1) * 1024 * 1024;
    }).sort((a, b) => b.size - a.size);
    const mib = n => (n / 1048576).toFixed(2) + ' MiB';
    const lines = [
      '# Relatório de mídias — somente leitura', '',
      `Arquivos encontrados: ${files.length}`, `Tamanho total: ${mib(files.reduce((a,b) => a+b.size, 0))}`, '',
      '## Arquivos acima dos limiares (imagem > 1 MiB; vídeo > 8 MiB)', ''
    ];
    if (!large.length) lines.push('Nenhum arquivo acima do limite.');
    for (const f of large) lines.push(`- ${f.path}: ${mib(f.size)}`);
    lines.push('', '## Duplicações exatas (mesmo SHA-256)', '');
    if (!duplicateGroups.length) lines.push('Não detectadas.');
    for (const g of duplicateGroups) lines.push(`- ${g.join(' | ')}`);
    lines.push('', '**Atenção:** duplicatas podem ser usadas intencionalmente; não excluir automaticamente.');
    await fsp.mkdir(OUTPUT, { recursive: true });
    await fsp.writeFile(path.join(OUTPUT, 'asset-report.md'), lines.join('\n'), 'utf8');
    console.log(`Mídias: ${files.length}; grandes: ${large.length}; grupos duplicados: ${duplicateGroups.length}`);
    console.log(`Relatório: ${path.join(OUTPUT, 'asset-report.md')}`);
  } catch (e) {
    console.error('Erro ao inspecionar mídias:', e.message || e);
    process.exitCode = 1;
  }
})();

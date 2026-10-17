// Corrige a ordem da navegação: Experiência antes de Projetos (igual à ordem da página).
const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(file, 'utf8');

const patterns = [
  [
    '<li><a href="#work">Projetos</a></li>\n          <li><a href="#experience">Experiência</a></li>',
    '<li><a href="#experience">Experiência</a></li>\n          <li><a href="#work">Projetos</a></li>',
  ],
  [
    '<li><a href="#work">Projetos</a></li>\r\n          <li><a href="#experience">Experiência</a></li>',
    '<li><a href="#experience">Experiência</a></li>\r\n          <li><a href="#work">Projetos</a></li>',
  ],
];

let changed = false;
for (const [oldText, newText] of patterns) {
  if (html.includes(oldText)) {
    fs.writeFileSync(file, html.replace(oldText, newText), 'utf8');
    changed = true;
    console.log('ok');
    break;
  }
}
if (!changed) console.log('no');

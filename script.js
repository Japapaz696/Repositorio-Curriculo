/* ========================================
   Script interativo — OMNIROUTE (remodelado)
   Apenas interações reais, sem invenções.
======================================== */

/* Ano */
document.getElementById('year').textContent = new Date().getFullYear();

/* Tema */
const STORAGE_KEY = 'portfolio-theme';
const themeToggle = document.getElementById('theme-toggle');
function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
function applyTheme(t) {
  const root = document.documentElement;
  if (t === 'light') {
    root.style.setProperty('--bg','#f5f5fa');
    root.style.setProperty('--surface','#ffffff');
    root.style.setProperty('--surface-2','#f0f0f8');
    root.style.setProperty('--text','#1a1a25');
    root.style.setProperty('--text-secondary','#555570');
    root.style.setProperty('--text-muted','#888899');
    root.style.setProperty('--accent','#0aa8a8');
    root.style.setProperty('--border','#e0e0ec');
    themeToggle.textContent = '☀️';
  } else {
    root.style.setProperty('--bg','#0a0a0f');
    root.style.setProperty('--surface','#111118');
    root.style.setProperty('--surface-2','#161626');
    root.style.setProperty('--text','#f0f0f8');
    root.style.setProperty('--text-secondary','#a0a0b0');
    root.style.setProperty('--text-muted','#6a6a78');
    root.style.setProperty('--accent','#5eead4');
    root.style.setProperty('--border','#23232e');
    themeToggle.textContent = '🌙';
  }
}
let currentTheme = loadTheme();
applyTheme(currentTheme);
themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEY, currentTheme);
  applyTheme(currentTheme);
});

/* Menu mobile */
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.classList.toggle('open', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

/* Scroll ativo na navbar */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-30% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* Back to top */
const btt = document.getElementById('back-to-top');
window.addEventListener('scroll', () => btt.classList.toggle('show', window.scrollY > 500), { passive: true });
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Scroll suave para âncoras */
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', function(e) {
  const id = this.getAttribute('href');
  if (id === '#') return;
  const t = document.querySelector(id);
  if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}));

/* O QUE EU FAÇO — interativo */
const services = [
  { title: 'Desenvolvimento Web', desc: 'Sites responsivos, landing pages, sistemas e interfaces.', tech: 'HTML / CSS / JavaScript / React / Node.js', demo: 'dashboard' },
  { title: 'Interfaces', desc: 'Experiência do usuário, design de interação e prototipação visual.', tech: 'Figma / CSS / Prototipagem', demo: 'interface' },
  { title: 'Suporte & SQL', desc: 'Suporte técnico, consulta a dados e acompanhamento de sistemas.', tech: 'SQL / Suporte / Sistemas', demo: 'sql' },
  { title: 'IA Generativa', desc: 'Uso de IA para prototipagem, automação e criação de conteúdo.', tech: 'IA / Automação / Scripts', demo: 'ai' },
  { title: 'Automação / Fluxos', desc: 'Fluxos automáticos, integração de APIs e ferramentas.', tech: 'Automação / APIs / Scripts', demo: 'flow' },
  { title: 'Conteúdo Visual', desc: 'Vídeos, animações, elementos gráficos e experimentos digitais.', tech: 'Edição / Animação / Design', demo: 'visual' }
];
function renderServiceDemo(i) {
  const container = document.getElementById('service-demo');
  const s = services[i];
  if (!container) return;
  const demoHtml = (function() {
    const d = s.demo || 'dash';
    if (d === 'sql') return '<div class="demo-grid"><div class="demo-card"><h4>Query SQL</h4><p>SELECT * FROM pedidos WHERE status = "aberto";</p><div class="demo-state">Estado: consultado (demo)</div></div></div>';
    if (d === 'interface') return '<div class="demo-grid"><div class="demo-card"><h4>Interface</h4><p>Botão, campo, card — todos com contraste e foco.</p><div class="demo-state">Estado: renderizado</div></div></div>';
    if (d === 'ai') return '<div class="demo-grid"><div class="demo-card"><h4>IA Generativa</h4><p>Prompt → protótipo visual. Sem código escrito.</p><div class="demo-state">Estado: gerado</div></div></div>';
    if (d === 'flow') return '<div class="demo-grid"><div class="demo-card"><h4>Fluxo</h4><p>Trigger → ação → validação. Sem intervenção.</p><div class="demo-state">Estado: ativo</div></div></div>';
    if (d === 'visual') return '<div class="demo-grid"><div class="demo-card"><h4>Visual</h4><p>Vídeo, movimento, cor. Sem framework.</p><div class="demo-state">Estado: exibido</div></div></div>';
    return '<div class="demo-grid"><div class="demo-card"><h4>Dashboard</h4><p>Dados, filtros, total. Em tempo real.</p><div class="demo-state">Estado: ativo</div></div></div>';
  })();
  container.innerHTML = demoHtml;
}

/* function selectService(i) { */
  document.querySelectorAll('.service-btn').forEach((btn, idx) => btn.classList.toggle('active', idx === i) && btn.setAttribute('aria-pressed', idx === i ? 'true' : 'false'));
  const panel = document.getElementById('service-panel');
  panel.querySelector('#service-heading').textContent = services[i].title;
  panel.querySelector('#service-desc').textContent = services[i].desc;
  panel.querySelector('#service-tech').textContent = services[i].tech;
}

/* Hero — movimento sutil via mouse */
const hero = document.querySelector('.hero-inner');
if (hero && window.matchMedia('(pointer: fine)').matches) {
  hero.setAttribute('data-moving', '0');
  let ticking = false;
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 6;
    if (!ticking) {
      hero.style.setProperty('--mx', `${x}px`);
      hero.style.setProperty('--my', `${y}px`);
      hero.setAttribute('data-moving', '1');
      ticking = true;
      requestAnimationFrame(() => { ticking = false; });
    }
  }, { passive: true });
  hero.addEventListener('mouseleave', () => { hero.setAttribute('data-moving', '0'); hero.style.transform = 'translate(0,0)'; });
}
/* Reveal inicial do Hero ao carregar */
window.addEventListener('DOMContentLoaded', () => {
  const t = document.querySelector('.hero-title .line');
  if (t) t.style.opacity = '0';
  setTimeout(() => {
    if (t) t.style.transition = 'opacity .8s ease';
    if (t) t.style.opacity = '1';
  }, 200);
});

/* Experimentos — controle de vídeo por viewport (3 vídeos) */
const expVideos = document.querySelectorAll('.exp-editorial video');
const vidObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const v = entry.target;
    if (entry.isIntersecting) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  });
}, { threshold: 0.35 });
expVideos.forEach(v => { v.muted = true; v.playsInline = true; v.preload = 'metadata'; vidObserver.observe(v); });

/* Exp 01: leve escala durante scroll */
const exp01 = document.querySelector('.exp-01');
if (exp01 && window.matchMedia('(pointer: fine)').matches) {
  const io01 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const v = entry.target.querySelector('video');
      const rect = entry.target.getBoundingClientRect();
      const visible = Math.min(1, rect.bottom / window.innerHeight);
      const scale = 0.96 + visible * 0.04;
      if (v) v.style.transform = `scale(${scale})`;
    });
  }, { threshold: 0 });
  io01.observe(exp01);
}

/* prefers-reduced-motion */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.exp-editorial video').forEach(v => { v.pause(); });
}

/* Tecnologias — interação */
function showTech(btn, desc) {
  document.getElementById('tech-desc').textContent = desc;
  document.querySelectorAll('.tech-tag').forEach(b => b.style.opacity = b === btn ? '1' : '.5');
}

/* Copiar email */
document.getElementById('email-link').addEventListener('click', copyEmail);

function copyEmail(e) {
  e.preventDefault();
  const val = 'lucaspaz696@gmail.com';
  navigator.clipboard.writeText(val).then(() => {
    document.getElementById('email-feedback').textContent = 'Copiado';
    setTimeout(() => document.getElementById('email-feedback').textContent = 'Copiar', 2000);
  }).catch(() => document.getElementById('email-feedback').textContent = 'Não copiado');
}

document.querySelectorAll('.service-btn').forEach((btn, idx) => btn.addEventListener('click', () => selectService(idx)));
selectService(0);


/* Command Palette / Palette */
const palette = document.getElementById('command-palette');
const paletteInput = document.getElementById('palette-input');
const paletteList = document.getElementById('palette-list');
const paletteToggle = document.getElementById('palette-toggle');
const paletteToggleBtn = document.querySelector('[data-open-palette]');
const paletteBack = document.querySelector('[data-close-palette]');

const paletteItems = [
  { label: 'Projetos', href: '#projetos' },
  { label: 'O que eu faço', href: '#o-que-faco' },
  { label: 'Experiência', href: '#sobre' },
  { label: 'Tecnologias', href: '#sobre' },
  { label: 'IA', href: '#o-que-faco' },
  { label: 'Experimentos', href: '#experimentos' },
  { label: 'Contato', href: '#contato' },
  { label: 'Tema', action: () => { themeToggle.click(); } }
];

function openPalette() {
  if (!palette) return;
  palette.hidden = false;
  setTimeout(() => paletteInput.focus(), 50);
  document.body.style.overflow = 'hidden';
}
function closePalette() {
  if (!palette) return;
  palette.hidden = true;
  document.body.style.overflow = '';
}
function buildPaletteList(query) {
  if (!paletteList) return;
  const q = (query || '').toLowerCase().trim();
  const items = paletteItems.filter(i => !q || i.label.toLowerCase().includes(q));
  paletteList.innerHTML = items.map(i => `<li role="option"><button type="button" data-href="${i.href || ''}" data-action="${i.action ? 'action' : ''}">${i.label}</button></li>`).join('');
  paletteList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const href = btn.getAttribute('data-href');
      const isAction = btn.getAttribute('data-action') === 'action';
      closePalette();
      if (isAction) { paletteItems.find(p=>p.label===btn.textContent.trim())?.action?.(); }
      else if (href) { document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

if (paletteToggle) paletteToggle.addEventListener('click', openPalette);
if (paletteToggleBtn) paletteToggleBtn.addEventListener('click', openPalette);
if (paletteBack) paletteBack.addEventListener('click', closePalette);
if (paletteInput) paletteInput.addEventListener('input', () => buildPaletteList(paletteInput.value));
document.addEventListener('keydown', (e) => {
  if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); palette ? (palette.hidden ? openPalette() : closePalette()) : null; }
  if (e.key === 'Escape') closePalette();
});
buildPaletteList('');

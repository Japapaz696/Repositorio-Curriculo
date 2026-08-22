/* ========================================
   Portfólio — script.js
   Funcionalidades:
   - Ano automático no rodapé
   - Botão de alternar tema (claro/escuro)
   - Menu mobile (hambúrguer)
   - Scroll reveal das seções
   - Link ativo na navbar
   - Botão voltar ao topo
   ======================================== */

// Ano automático no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// ========================================
// Alternador de tema
// ========================================
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const STORAGE_KEY = 'portfolio-theme';

// Carrega tema salvo ou usa o do sistema
function loadTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        return saved;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme) {
    if (theme === 'light') {
        root.style.setProperty('--bg-primary', '#f5f5fa');
        root.style.setProperty('--bg-secondary', '#ffffff');
        root.style.setProperty('--bg-card', '#ffffff');
        root.style.setProperty('--bg-card-hover', '#f0f0f8');
        root.style.setProperty('--border', '#e0e0ec');
        root.style.setProperty('--text-primary', '#1a1a25');
        root.style.setProperty('--text-secondary', '#555570');
        root.style.setProperty('--text-muted', '#888899');
        root.style.setProperty('--navbar-bg', 'rgba(255, 255, 255, 0.85)');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#f5f5fa');
        themeToggle.textContent = '☀️';
    } else {
        root.style.setProperty('--bg-primary', '#0a0a0f');
        root.style.setProperty('--bg-secondary', '#12121a');
        root.style.setProperty('--bg-card', '#1a1a25');
        root.style.setProperty('--bg-card-hover', '#22222f');
        root.style.setProperty('--border', '#2a2a38');
        root.style.setProperty('--text-primary', '#e8e8f0');
        root.style.setProperty('--text-secondary', '#a0a0b5');
        root.style.setProperty('--text-muted', '#6b6b80');
        root.style.setProperty('--navbar-bg', 'rgba(10, 10, 15, 0.85)');
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#0a0a0f');
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

// ========================================
// Menu mobile (hambúrguer)
// ========================================
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
});

// Fecha o menu ao clicar em um link (útil no mobile)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

// Fecha o menu ao clicar fora dele
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

// ========================================
// Scroll reveal — animação de entrada das seções
// ========================================
// Obs.: .office-card fica de fora porque usa transform próprio (giro 3D no hover)
const revealTargets = document.querySelectorAll(
    '.project-card, .skill-category, .contact-card, .sobre-card, .curso-card, .timeline-item'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealTargets.forEach(el => observer.observe(el));

// ========================================
// Link ativo na navbar conforme a seção visível
// ========================================
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => sectionObserver.observe(section));

// ========================================
// Botão voltar ao topo
// ========================================
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
}, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========================================
// Scroll suave para âncoras (fallback para navegadores antigos)
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

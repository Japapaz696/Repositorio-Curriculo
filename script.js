const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const backToTop = document.getElementById('back-to-top');
const palette = document.getElementById('command-palette');
const paletteToggle = document.getElementById('palette-toggle');
const paletteInput = document.getElementById('palette-input');
const paletteList = document.getElementById('palette-list');
const paletteCloseButtons = document.querySelectorAll('[data-close-palette]');
const year = document.getElementById('year');

const THEME_KEY = 'portfolio-theme';
let paletteOpener = null;

if (year) year.textContent = new Date().getFullYear();

function getSavedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function setTheme(theme) {
  root.dataset.theme = theme;
  const dark = theme === 'dark';
  themeToggle?.setAttribute('aria-pressed', String(dark));
  themeToggle?.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0a0a0f' : '#fafaf8');

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // O tema continua funcionando mesmo quando o armazenamento está indisponível.
  }
}

setTheme(getSavedTheme() || 'light');
themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

function closeMenu() {
  navLinks?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menu');
}

menuToggle?.addEventListener('click', () => {
  const open = navLinks?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('click', (event) => {
  if (!navLinks?.classList.contains('open')) return;
  if (!navLinks.contains(event.target) && !menuToggle?.contains(event.target)) closeMenu();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    const target = targetId ? document.querySelector(targetId) : null;
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  });
});

const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const navigableSections = [...document.querySelectorAll('main section[id]')];
const activeSectionObserver = new IntersectionObserver((entries) => {
  const visibleEntry = entries.find((entry) => entry.isIntersecting);
  if (!visibleEntry) return;

  navAnchors.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${visibleEntry.target.id}`);
  });
}, { rootMargin: '-35% 0px -55% 0px' });

navigableSections.forEach((section) => activeSectionObserver.observe(section));

window.addEventListener('scroll', () => {
  backToTop?.classList.toggle('show', window.scrollY > 560);
}, { passive: true });

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: .12 });

document.querySelectorAll('.section-reveal').forEach((section) => {
  if (reducedMotion.matches) section.classList.add('is-visible');
  else revealObserver.observe(section);
});

const heroPreview = document.querySelector('[data-parallax]');
if (heroPreview && window.matchMedia('(pointer: fine)').matches && !reducedMotion.matches) {
  let frameRequested = false;
  let xOffset = 0;
  let yOffset = 0;

  heroPreview.addEventListener('pointermove', (event) => {
    const bounds = heroPreview.getBoundingClientRect();
    xOffset = ((event.clientX - bounds.left) / bounds.width - .5) * 8;
    yOffset = ((event.clientY - bounds.top) / bounds.height - .5) * 6;

    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(() => {
      heroPreview.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      frameRequested = false;
    });
  });

  heroPreview.addEventListener('pointerleave', () => {
    heroPreview.style.transform = '';
  });
}

const labVideos = [...document.querySelectorAll('[data-lab-video]')];
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const video = entry.target;
    if (!entry.isIntersecting || reducedMotion.matches || video.dataset.userPaused === 'true') {
      video.pause();
      return;
    }
    video.play().catch(() => {});
  });
}, { threshold: .45 });

labVideos.forEach((video) => {
  video.muted = true;
  video.playsInline = true;
  if (!reducedMotion.matches) videoObserver.observe(video);
});

document.querySelectorAll('[data-video-toggle]').forEach((button) => {
  const video = button.closest('.lab-item')?.querySelector('[data-lab-video]');
  if (!video) return;

  const setButtonLabel = (playing) => {
    button.textContent = playing ? 'Pausar' : 'Reproduzir';
    button.setAttribute('aria-label', `${playing ? 'Pausar' : 'Reproduzir'} ${video.getAttribute('aria-describedby') ? 'vídeo do laboratório' : 'vídeo'}`);
  };

  button.addEventListener('click', () => {
    if (video.paused) {
      video.dataset.userPaused = 'false';
      video.play().then(() => setButtonLabel(true)).catch(() => {});
    } else {
      video.dataset.userPaused = 'true';
      video.pause();
      setButtonLabel(false);
    }
  });

  video.addEventListener('play', () => setButtonLabel(true));
  video.addEventListener('pause', () => setButtonLabel(false));
});

reducedMotion.addEventListener?.('change', (event) => {
  if (!event.matches) return;
  labVideos.forEach((video) => video.pause());
  document.querySelectorAll('.section-reveal').forEach((section) => section.classList.add('is-visible'));
});

const emailLink = document.getElementById('email-link');
const emailFeedback = document.getElementById('email-feedback');
emailLink?.addEventListener('click', async (event) => {
  if (!navigator.clipboard?.writeText) return;

  event.preventDefault();
  try {
    await navigator.clipboard.writeText('lucaspaz696@gmail.com');
    emailFeedback.textContent = 'Copiado';
    window.setTimeout(() => { emailFeedback.textContent = 'Copiar'; }, 2000);
  } catch {
    emailFeedback.textContent = 'Abrir e-mail';
    window.setTimeout(() => { emailFeedback.textContent = 'Copiar'; }, 2000);
  }
});

const paletteItems = [
  { label: 'Profile', command: '/about', href: '#profile' },
  { label: 'Selected work', command: '/projects', href: '#work' },
  { label: 'Lucas / Lab', command: '/lab', href: '#lab' },
  { label: 'Capabilities', command: '/capabilities', href: '#capabilities' },
  { label: 'Journey', command: '/journey', href: '#journey' },
  { label: 'Stack', command: '/stack', href: '#stack' },
  { label: 'Contato', command: '/contact', href: '#contact' },
  { label: 'Alternar tema', command: 'theme', action: () => themeToggle?.click() }
];

function closePalette({ restoreFocus = true } = {}) {
  if (!palette || palette.hidden) return;
  palette.hidden = true;
  document.body.classList.remove('palette-open');
  if (restoreFocus) paletteOpener?.focus();
}

function renderPalette(query = '') {
  if (!paletteList) return;
  const normalizedQuery = query.toLowerCase().trim();
  const items = paletteItems.filter((item) => `${item.label} ${item.command}`.toLowerCase().includes(normalizedQuery));

  paletteList.replaceChildren();
  if (!items.length) {
    const empty = document.createElement('li');
    empty.className = 'palette-empty';
    empty.textContent = 'Nenhum comando encontrado.';
    paletteList.append(empty);
    return;
  }

  items.forEach((item) => {
    const itemElement = document.createElement('li');
    const button = document.createElement('button');
    const label = document.createElement('span');
    const command = document.createElement('span');

    label.className = 'item-label';
    label.textContent = item.label;
    command.className = 'item-command';
    command.textContent = item.command;
    button.type = 'button';
    button.append(label, command);
    button.addEventListener('click', () => {
      closePalette({ restoreFocus: false });
      if (item.action) item.action();
      if (item.href) document.querySelector(item.href)?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    });

    itemElement.append(button);
    paletteList.append(itemElement);
  });
}

function openPalette(event) {
  if (!palette || !paletteInput) return;
  closeMenu();
  paletteOpener = event?.currentTarget || document.activeElement;
  palette.hidden = false;
  document.body.classList.add('palette-open');
  paletteInput.value = '';
  renderPalette();
  requestAnimationFrame(() => paletteInput.focus());
}

paletteToggle?.addEventListener('click', openPalette);
paletteCloseButtons.forEach((button) => button.addEventListener('click', () => closePalette()));
paletteInput?.addEventListener('input', () => renderPalette(paletteInput.value));

palette?.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const focusable = [...palette.querySelectorAll('button:not([disabled]), input:not([disabled])')];
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) return;

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (palette?.hidden) openPalette(event);
    else closePalette();
  }
  if (event.key === 'Escape') {
    closePalette();
    closeMenu();
  }
});

renderPalette();

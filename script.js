const root = document.documentElement;
root.classList.add('js');
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
const demoDialog = document.getElementById('demo-dialog');
const demoDialogTitle = document.getElementById('demo-dialog-title');
const demoDialogDescription = document.getElementById('demo-dialog-description');
const demoFullLink = document.getElementById('demo-full-link');
const demoClose = document.getElementById('demo-close');
const demoLoading = document.getElementById('demo-loading');
const demoFrameHost = document.getElementById('demo-frame-host');

const THEME_KEY = 'portfolio-theme';
let paletteOpener = null;

if (year) year.textContent = new Date().getFullYear();

// Mostra o atalho correto da paleta: ⌘K apenas no Mac, Ctrl K nos demais sistemas.
const isAppleDevice = /Mac|iPhone|iPad|iPod/.test(navigator.userAgentData?.platform || navigator.platform || navigator.userAgent);
if (!isAppleDevice) {
  document.querySelectorAll('[data-shortcut-label]').forEach((label) => { label.textContent = 'Ctrl K'; });
  root.style.setProperty('--shortcut-hint', '"Ctrl K"');
}

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

document.querySelectorAll('[data-reveal]').forEach((section) => {
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
    xOffset = ((event.clientX - bounds.left) / bounds.width - .5) * 6;
    yOffset = ((event.clientY - bounds.top) / bounds.height - .5) * 4;

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

// Vitrine do hero: rotação automática com pausa acessível e respeito a reduced-motion.
const heroShowcase = document.querySelector('.hero-showcase');
if (heroShowcase) {
  const slides = [...heroShowcase.querySelectorAll('[data-showcase-slide]')];
  const dots = [...heroShowcase.querySelectorAll('[data-showcase-dot]')];
  const toggle = heroShowcase.querySelector('[data-showcase-toggle]');
  const status = heroShowcase.querySelector('[data-showcase-status]');
  const ROTATE_INTERVAL = 6000;
  let activeIndex = 0;
  let rotateTimer = null;
  let userPaused = false;
  let hoverPaused = false;
  let focusPaused = false;

  const canRotate = () => !reducedMotion.matches && !userPaused && !hoverPaused && !focusPaused && !document.hidden;

  function stopRotation() {
    if (rotateTimer) {
      window.clearInterval(rotateTimer);
      rotateTimer = null;
    }
  }

  function startRotation() {
    stopRotation();
    if (!canRotate()) return;
    rotateTimer = window.setInterval(() => showSlide(activeIndex + 1), ROTATE_INTERVAL);
  }

  function showSlide(nextIndex, { announce = true } = {}) {
    activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const active = i === activeIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.querySelectorAll('a, button').forEach((control) => { control.tabIndex = active ? 0 : -1; });
    });

    dots.forEach((dot, i) => {
      const active = i === activeIndex;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });

    if (announce && status) {
      const name = slides[activeIndex]?.querySelector('.showcase-name')?.textContent?.trim() || '';
      status.textContent = `${name} — projeto ${activeIndex + 1} de ${slides.length}`;
    }
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.showcaseDot));
      startRotation();
    });
  });

  toggle?.addEventListener('click', () => {
    userPaused = !userPaused;
    toggle.textContent = userPaused ? 'Retomar' : 'Pausar';
    toggle.setAttribute('aria-label', userPaused ? 'Retomar reprodução automática da vitrine' : 'Pausar reprodução automática da vitrine');
    if (canRotate()) startRotation();
    else stopRotation();
  });

  heroShowcase.addEventListener('pointerenter', () => { hoverPaused = true; stopRotation(); });
  heroShowcase.addEventListener('pointerleave', () => { hoverPaused = false; startRotation(); });
  heroShowcase.addEventListener('focusin', () => { focusPaused = true; stopRotation(); });
  heroShowcase.addEventListener('focusout', (event) => {
    if (heroShowcase.contains(event.relatedTarget)) return;
    focusPaused = false;
    startRotation();
  });

  document.addEventListener('visibilitychange', () => { if (document.hidden) stopRotation(); else startRotation(); });
  reducedMotion.addEventListener?.('change', () => { if (reducedMotion.matches) stopRotation(); else startRotation(); });

  if ('IntersectionObserver' in window) {
    const showcaseObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startRotation();
      else stopRotation();
    }, { threshold: 0.35 });
    showcaseObserver.observe(heroShowcase);
  }

  showSlide(0, { announce: false });
  startRotation();
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
  document.querySelectorAll('[data-reveal]').forEach((section) => section.classList.add('is-visible'));
});

const demoConfig = {
  'seu-manoel': {
    title: 'Seu Manoel',
    description: 'Teste o fluxo local de agendamento, com etapas, disponibilidade e histórico no navegador.',
    url: 'projetos/seu-manoel/index.html'
  },
  'beauty-store': {
    title: 'Beauty Store',
    description: 'Explore busca, filtros, favoritos, carrinho e checkout demonstrativo dentro da página.',
    url: 'projetos/beauty-store/index.html'
  },
  papitos: {
    title: 'Papitos',
    description: 'Monte um pedido, filtre o cardápio e experimente o carrinho persistente da demonstração.',
    url: 'projetos/papitos/index.html'
  }
};

let demoOpener = null;
let activeDemoId = null;
let demoFrame = null;

function getDemoFocusable() {
  if (!demoDialog) return [];
  return [...demoDialog.querySelectorAll('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
}

function ensureDemoFrame(config) {
  if (demoFrame) return demoFrame;

  demoFrame = document.createElement('iframe');
  demoFrame.title = `${config.title} - demonstração interativa`;
  demoFrame.loading = 'eager';
  demoFrame.referrerPolicy = 'no-referrer';
  demoFrame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals');
  demoFrameHost?.append(demoFrame);
  return demoFrame;
}

function closeDemo({ restoreFocus = true } = {}) {
  if (!demoDialog || !demoDialog.open) return;
  if (demoDialog.matches(':modal')) demoDialog.close();
  else demoDialog.hidden = true;
  document.body.classList.remove('demo-open');
  activeDemoId = null;
  if (restoreFocus) demoOpener?.focus();
}

function openDemo(event) {
  const trigger = event.currentTarget;
  const config = demoConfig[trigger.dataset.demoId];
  if (!config || !demoDialog || !demoFrameHost) return;

  demoOpener = trigger;
  activeDemoId = trigger.dataset.demoId;
  demoDialogTitle.textContent = config.title;
  demoDialogDescription.textContent = config.description;
  demoFullLink.href = config.url;
  demoLoading.hidden = false;
  demoLoading.textContent = 'Carregando interface local...';
  document.body.classList.add('demo-open');

  const frame = ensureDemoFrame(config);
  frame.title = `${config.title} - demonstração interativa`;
  frame.onload = () => {
    if (demoLoading && frame.dataset.loadedFor === activeDemoId) demoLoading.hidden = true;
  };
  if (frame.dataset.loadedFor !== activeDemoId) {
    frame.dataset.loadedFor = activeDemoId;
    frame.src = config.url;
  } else {
    demoLoading.hidden = true;
  }

  if (typeof demoDialog.showModal === 'function') demoDialog.showModal();
  else {
    demoDialog.hidden = false;
    demoDialog.setAttribute('open', '');
  }
  requestAnimationFrame(() => demoClose?.focus());
}

document.querySelectorAll('[data-demo-trigger]').forEach((trigger) => trigger.addEventListener('click', openDemo));
demoClose?.addEventListener('click', () => closeDemo());
demoDialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeDemo();
});
demoDialog?.addEventListener('click', (event) => {
  if (event.target === demoDialog) closeDemo();
});
demoDialog?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeDemo();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = getDemoFocusable();
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
  { label: 'Projetos', command: '/projetos', href: '#work' },
  { label: 'Experiência', command: '/experiencia', href: '#experience' },
  { label: 'O que faço', command: '/capacidades', href: '#capabilities' },
  { label: 'Sobre', command: '/sobre', href: '#profile' },
  { label: 'Lab', command: '/lab', href: '#lab' },
  { label: 'Trajetória', command: '/trajetoria', href: '#journey' },
  { label: 'Ferramentas', command: '/ferramentas', href: '#stack' },
  { label: 'Contato', command: '/contato', href: '#contact' },
  { label: 'Alternar tema', command: 'tema', action: () => themeToggle?.click() }
];

function closePalette({ restoreFocus = true } = {}) {
  if (!palette || palette.hidden) return;
  palette.hidden = true;
  document.body.classList.remove('palette-open');
  if (restoreFocus && paletteOpener instanceof HTMLElement) paletteOpener.focus();
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
  const opener = event?.currentTarget;
  paletteOpener = (opener instanceof HTMLElement && opener !== document.body) ? opener : (document.activeElement instanceof HTMLElement ? document.activeElement : null);
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
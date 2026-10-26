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
  themeToggle?.setAttribute('aria-label', dark ? 'Ativar tema claro ◐' : 'Ativar tema escuro ◐');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0a0a0f' : '#fafaf8');

  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // O tema continua funcionando mesmo quando o armazenamento está indisponível.
  }
}

setTheme(getSavedTheme() || 'light');
themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

const mobileNavQuery = window.matchMedia('(max-width: 767px)');

function syncNavState() {
  if (!navLinks) return;
  const mobile = mobileNavQuery.matches;
  const open = navLinks.classList.contains('open');
  // Com o menu mobile fechado, os links ficam fora da tela: remove do fluxo de
  // foco e da tecnologia assistiva até que o menu seja reaberto.
  if (mobile && !open) navLinks.setAttribute('inert', '');
  else navLinks.removeAttribute('inert');
}

function closeMenu() {
  navLinks?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Abrir menu');
  syncNavState();
}

menuToggle?.addEventListener('click', () => {
  const open = navLinks?.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  syncNavState();
});

mobileNavQuery.addEventListener?.('change', syncNavState);
syncNavState();

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

/* Hero panel: abas de resumo com teclado, sem dependências (enhancement) */
const heroTabsRoot = document.querySelector('[data-hero-tabs]');
if (heroTabsRoot) {
  const heroTabs = Array.from(heroTabsRoot.querySelectorAll('[role="tab"]'));
  const heroPanels = heroTabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  const heroTabpanels = heroTabsRoot.querySelector('.hero-tabpanels');
  let heroResizeTimer = 0;

  const heroStabilize = () => {
    const selected = heroTabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    let max = 0;
    heroPanels.forEach((panel, index) => {
      panel.hidden = false;
      max = Math.max(max, panel.offsetHeight);
      panel.hidden = index !== selected;
    });
    if (heroTabpanels) heroTabpanels.style.minHeight = max ? `${max}px` : '';
  };

  const heroSelectTab = (index, moveFocus) => {
    heroTabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      heroPanels[i].hidden = !active;
    });
    if (moveFocus) heroTabs[index].focus();
  };

  heroTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => heroSelectTab(index, false));
    tab.addEventListener('keydown', (event) => {
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % heroTabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + heroTabs.length) % heroTabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = heroTabs.length - 1;
      if (next !== null) { event.preventDefault(); heroSelectTab(next, true); }
    });
  });

  heroStabilize();
  window.addEventListener('resize', () => {
    window.clearTimeout(heroResizeTimer);
    heroResizeTimer = window.setTimeout(heroStabilize, 150);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(heroStabilize);
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
    // Se a cópia falhar, abre o cliente de e-mail em vez de deixar o
    // link inerte: o texto "Abrir e-mail" não seria suficiente sozinho.
    emailFeedback.textContent = 'Abrindo e-mail…';
    window.location.href = emailLink.href;
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

function getPaletteButtons() {
  return [...palette.querySelectorAll('.palette-list button')];
}

function focusPaletteButton(index) {
  const buttons = getPaletteButtons();
  if (!buttons.length) return;
  const safeIndex = Math.max(0, Math.min(buttons.length - 1, index));
  buttons[safeIndex].focus();
}

palette?.addEventListener('keydown', (event) => {
  const buttons = getPaletteButtons();
  const activeIndex = buttons.indexOf(document.activeElement);

  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
    if (document.activeElement === paletteInput) {
      event.preventDefault();
      focusPaletteButton(0);
      return;
    }
    if (activeIndex >= 0) {
      event.preventDefault();
      focusPaletteButton(activeIndex + 1);
      return;
    }
  }

  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
    if (activeIndex > 0) {
      event.preventDefault();
      focusPaletteButton(activeIndex - 1);
      return;
    }
    if (activeIndex === 0) {
      event.preventDefault();
      paletteInput?.focus();
      return;
    }
  }

  if (event.key === 'Home' && activeIndex >= 0) {
    event.preventDefault();
    focusPaletteButton(0);
    return;
  }

  if (event.key === 'End' && activeIndex >= 0) {
    event.preventDefault();
    focusPaletteButton(buttons.length - 1);
    return;
  }

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
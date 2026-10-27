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

/* Tech stack: filtros por pilar (enhancement progressivo) */
const stackTabsRoot = document.querySelector('[data-stack-tabs]');
if (stackTabsRoot) {
  const stackTabs = Array.from(stackTabsRoot.querySelectorAll('[role="tab"]'));
  const stackCards = Array.from(stackTabsRoot.querySelectorAll('.stack-card'));
  const stackSelect = (index, moveFocus) => {
    stackTabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    const panel = stackTabsRoot.querySelector('[role="tabpanel"]');
    if (panel) panel.setAttribute('aria-labelledby', stackTabs[index].id);
    const filter = stackTabs[index].dataset.stackFilter;
    stackCards.forEach((card) => {
      card.hidden = !(filter === 'all' || card.dataset.stackCategory === filter);
    });
    if (moveFocus) stackTabs[index].focus();
  };
  stackTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => stackSelect(index, false));
    tab.addEventListener('keydown', (event) => {
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % stackTabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + stackTabs.length) % stackTabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = stackTabs.length - 1;
      if (next !== null) { event.preventDefault(); stackSelect(next, true); }
    });
  });
  stackSelect(0, false);
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
  const loadingTimer = window.setTimeout(() => {
    if (activeDemoId === trigger.dataset.demoId && demoLoading) {
      demoLoading.hidden = false;
      demoLoading.textContent = 'A demonstração está demorando para carregar. Tente abrir o projeto completo.';
    }
  }, 8000);

  frame.onload = () => {
    window.clearTimeout(loadingTimer);
    if (demoLoading && frame.dataset.loadedFor === activeDemoId) demoLoading.hidden = true;
  };
  frame.onerror = () => {
    window.clearTimeout(loadingTimer);
    if (demoLoading) {
      demoLoading.hidden = false;
      demoLoading.textContent = 'Não foi possível carregar a demonstração. Use “Abrir projeto completo”.';
    }
  };
  if (frame.dataset.loadedFor !== activeDemoId) {
    frame.dataset.loadedFor = activeDemoId;
    demoLoading.hidden = false;
    demoLoading.textContent = 'Carregando interface local...';
    frame.src = config.url;
  } else {
    window.clearTimeout(loadingTimer);
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

/* Estudos de caso técnicos (modal acessível) */
const caseStudies = {
  supportflow: {
    title: 'SupportFlow',
    description: 'Arquitetura, banco de dados, segurança e desafios de um sistema de chamados em produção.',
    tabs: [
      { id: 'architecture', label: 'Arquitetura', html: '<h3>Arquitetura</h3><p>Monorepo com front-end React/Vite, API Express/TypeScript e PostgreSQL. A API usa JWT em memória, RBAC para quatro perfis e SLA calculado e persistido na mesma transação do chamado.</p><ul><li>Comentários públicos e internos.</li><li>Histórico imutável de eventos.</li><li>Notificações e diagnóstico por chamado.</li></ul>' },
      { id: 'database', label: 'Banco de Dados', html: '<h3>Banco de Dados</h3><p>PostgreSQL 16 com migrations versionadas. Tabelas para usuários, chamados, comentários, eventos e políticas de SLA, com chaves estrangeiras e transações.</p><ul><li>110 testes de integração contra banco real.</li><li>Integridade referencial.</li><li>Persistência transacional do SLA.</li></ul>' },
      { id: 'security', label: 'Segurança', html: '<h3>Segurança</h3><p>Token JWT apenas em memória, sem localStorage e sem cookie. Controle de acesso por perfil com middleware dedicado e validação de entrada.</p><ul><li>21 testes de middleware de segurança.</li><li>Sem segredos no repositório.</li><li>RBAC por perfil.</li></ul>' },
      { id: 'code', label: 'Código', html: '<h3>Trecho relevante</h3><pre class="case-code"><code>// SLA persistido na mesma transação do chamado\nawait db.transaction(async (trx) => {\n  const ticket = await createTicket(input, trx);\n  await persistSla(ticket, policy, trx);\n});</code></pre>' }
    ]
  },
  'sql-lab': {
    title: 'SQL Lab',
    description: 'Laboratório de SQL para diagnóstico e suporte a ERP sobre um banco relacional real.',
    tabs: [
      { id: 'architecture', label: 'Arquitetura', html: '<h3>Arquitetura</h3><p>10 cenários de consulta executados sobre tabelas de vendas, pedidos, produtos, pagamentos, estoque e chamados. Consultas read-only com resultados esperados.</p><ul><li>Separação entre cenários e validação.</li><li>Execução real sobre PostgreSQL.</li><li>108 testes automatizados.</li></ul>' },
      { id: 'database', label: 'Banco de Dados', html: '<h3>Banco de Dados</h3><p>Schema relacional com vendas, pedidos, produtos, pagamentos, estoque e chamados. Ênfase em joins, agregações e diagnóstico operacional.</p><ul><li>Relacionamentos entre entidades.</li><li>Consultas de diagnóstico.</li><li>Validação de resultados esperados.</li></ul>' },
      { id: 'security', label: 'Segurança', html: '<h3>Segurança</h3><p>Consultas read-only, sem operações destrutivas. Ambiente isolado para experimentação e aprendizado.</p><ul><li>Sem escrita em produção.</li><li>Cenários controlados.</li></ul>' },
      { id: 'code', label: 'Código', html: '<h3>Trecho relevante</h3><pre class="case-code"><code>-- Diagnóstico de pedidos sem pagamento\nSELECT p.id, p.total, pg.status\nFROM pedidos p\nLEFT JOIN pagamentos pg ON pg.pedido_id = p.id\nWHERE pg.id IS NULL;</code></pre>' }
    ]
  },
  'beauty-store': {
    title: 'Beauty Store',
    description: 'Catálogo interativo com estado centralizado e hardening contra XSS.',
    tabs: [
      { id: 'architecture', label: 'Arquitetura', html: '<h3>Arquitetura</h3><p>SPA em JavaScript puro com estado centralizado para produtos, filtros, favoritos e carrinho. Renderização por funções dedicadas.</p><ul><li>Busca, ordenação e filtros.</li><li>Detalhe de produto e checkout simulado.</li><li>Sanitização antes de innerHTML.</li></ul>' },
      { id: 'database', label: 'Banco de Dados', html: '<h3>Banco de Dados</h3><p>Sem backend. Persistência local via localStorage para carrinho e favoritos, com validação da estrutura dos itens.</p><ul><li>Validação de itens armazenados.</li><li>Dados locais não sensíveis.</li></ul>' },
      { id: 'security', label: 'Segurança', html: '<h3>Segurança</h3><p>escapeHtml aplicado a todos os dados vindos do localStorage e do catálogo antes da interpolação em innerHTML. Demos carregadas com sandbox.</p><ul><li>Testes de sanitização.</li><li>Sem parâmetros de URL consumidos.</li></ul>' },
      { id: 'code', label: 'Código', html: '<h3>Trecho relevante</h3><pre class="case-code"><code>function escapeHtml(value) {\n  return String(value)\n    .replace(/&/g, \'&amp;\')\n    .replace(/</g, \'&lt;\')\n    .replace(/>/g, \'&gt;\');\n}</code></pre>' }
    ]
  },
  'seu-manoel': {
    title: 'Seu Manoel',
    description: 'Agendamento em etapas com regras isoladas e testáveis.',
    tabs: [
      { id: 'architecture', label: 'Arquitetura', html: '<h3>Arquitetura</h3><p>Wizard de 6 etapas com validação progressiva. Regras de disponibilidade isoladas em módulo separado e testável.</p><ul><li>Escolha de serviço, profissional, data e horário.</li><li>Confirmação e histórico.</li><li>Cancelamento libera horários.</li></ul>' },
      { id: 'database', label: 'Banco de Dados', html: '<h3>Banco de Dados</h3><p>Persistência local via localStorage para agendamentos. Estrutura validada antes do uso.</p><ul><li>Reservas ativas bloqueiam slots.</li><li>Cancelamentos liberam horários.</li></ul>' },
      { id: 'security', label: 'Segurança', html: '<h3>Segurança</h3><p>Renderização com createElement e textContent, sem innerHTML com dados dinâmicos. Sem parâmetros de URL consumidos.</p><ul><li>Validação de entrada.</li><li>Demonstração local.</li></ul>' },
      { id: 'code', label: 'Código', html: '<h3>Trecho relevante</h3><pre class="case-code"><code>export function getAvailableSlots(input) {\n  // respeita janela, duração e reservas\n  return slots.filter((slot) => !isReserved(slot));\n}</code></pre>' }
    ]
  }
};

const caseDialog = document.getElementById('case-dialog');
const caseTitle = document.getElementById('case-dialog-title');
const caseDescription = document.getElementById('case-dialog-description');
const caseTabpanelsHost = document.getElementById('case-tabpanels');
let caseLastFocus = null;
let caseTabs = [];
let casePanels = [];

function renderCaseTabs(tabs) {
  if (!caseDialog || !caseTabpanelsHost) return;
  const tablist = caseDialog.querySelector('.case-tabs');
  if (!tablist) return;
  tablist.replaceChildren();
  caseTabpanelsHost.replaceChildren();
  tabs.forEach((tab, index) => {
    const button = document.createElement('button');
    button.className = 'case-tab';
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.id = `case-tab-${tab.id}`;
    button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    button.tabIndex = index === 0 ? 0 : -1;
    button.setAttribute('aria-controls', `case-panel-${tab.id}`);
    button.dataset.caseTab = tab.id;
    button.textContent = tab.label;
    tablist.append(button);

    const panel = document.createElement('section');
    panel.className = 'case-tabpanel';
    panel.id = `case-panel-${tab.id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    panel.hidden = index !== 0;
    panel.innerHTML = tab.html;
    caseTabpanelsHost.append(panel);
  });
  caseTabs = [...caseDialog.querySelectorAll('[role="tab"]')];
  casePanels = [...caseDialog.querySelectorAll('[role="tabpanel"]')];
  caseTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectCaseTab(index, false));
    tab.addEventListener('keydown', (event) => {
      let next = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % caseTabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + caseTabs.length) % caseTabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = caseTabs.length - 1;
      if (next !== null) { event.preventDefault(); selectCaseTab(next, true); }
    });
  });
}

function selectCaseTab(index, moveFocus) {
  caseTabs.forEach((tab, i) => {
    const active = i === index;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  casePanels.forEach((panel, i) => { panel.hidden = i !== index; });
  if (moveFocus && caseTabs[index]) caseTabs[index].focus();
}

function openCaseStudy(id) {
  const data = caseStudies[id];
  if (!data || !caseDialog) return;
  caseLastFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (caseTitle) caseTitle.textContent = data.title;
  if (caseDescription) caseDescription.textContent = data.description;
  renderCaseTabs(data.tabs);
  selectCaseTab(0, false);
  document.body.classList.add('demo-open');
  caseDialog.showModal();
  const firstTab = caseDialog.querySelector('[role="tab"]');
  if (firstTab) firstTab.focus();
}

function closeCaseStudy() {
  if (!caseDialog) return;
  caseDialog.close();
}

if (caseDialog) {
  const closeButton = document.getElementById('case-close');
  closeButton?.addEventListener('click', closeCaseStudy);
  caseDialog.addEventListener('click', (event) => {
    if (event.target === caseDialog) closeCaseStudy();
  });
  caseDialog.addEventListener('close', () => {
    document.body.classList.remove('demo-open');
    if (caseLastFocus) caseLastFocus.focus();
  });
  caseDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeCaseStudy();
  });
}

document.querySelectorAll('[data-case-study]').forEach((trigger) => {
  trigger.addEventListener('click', () => openCaseStudy(trigger.dataset.caseStudy));
});

/* Live status, terminal e formulário de contato seguro */
const statusList = document.getElementById('system-status-list');
const statusRefresh = document.getElementById('status-refresh');
const systemServices = ['github', 'supportflow', 'beauty-store', 'site-veronica'];
const serviceUrls = {
  github: 'https://api.github.com/repos/Japapaz696/Repositorio-Curriculo',
  supportflow: 'https://api.github.com/repos/Japapaz696/SupportFlow',
  'beauty-store': 'projetos/beauty-store/index.html',
  'site-veronica': 'https://api.github.com/repos/Japapaz696/Site-veronica'
};

function setServiceStatus(service, state, text) {
  if (!statusList) return;
  const item = statusList.querySelector(`[data-status-service="${service}"]`);
  if (!item) return;
  const value = item.querySelector('.system-status-value');
  item.classList.remove('is-online', 'is-offline', 'is-checking');
  item.classList.add(state);
  if (value) value.textContent = text;
}

async function checkService(service) {
  setServiceStatus(service, 'is-checking', 'Verificando…');
  const start = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(serviceUrls[service], { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeoutId);
    const latency = Math.round(performance.now() - start);
    if (response.ok) {
      setServiceStatus(service, 'is-online', `${response.status} · ${latency}ms`);
    } else {
      setServiceStatus(service, 'is-offline', `HTTP ${response.status}`);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    setServiceStatus(service, 'is-offline', error.name === 'AbortError' ? 'Timeout' : 'Indisponível');
  }
}

async function refreshSystemStatus() {
  await Promise.all(systemServices.map((service) => checkService(service)));
}

statusRefresh?.addEventListener('click', refreshSystemStatus);
if (statusList) refreshSystemStatus();

const terminalForm = document.getElementById('terminal-form');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

function printTerminal(text, className = '') {
  if (!terminalOutput) return;
  const line = document.createElement('p');
  line.className = `terminal-line${className ? ` ${className}` : ''}`;
  line.textContent = text;
  terminalOutput.append(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function runTerminalCommand(raw) {
  const command = raw.trim();
  if (!command) return;
  printTerminal(`$ ${command}`, 'terminal-line--command');
  const [name] = command.toLowerCase().split(/\s+/);
  switch (name) {
    case 'help':
      printTerminal('Comandos: help, skills, projects, status, contact, clear');
      break;
    case 'skills':
      printTerminal('Backend: Node.js, Express, REST APIs; Frontend: JavaScript, HTML, CSS, React; Dados: PostgreSQL, SQL; IA: OpenAI API, n8n, Prompt Engineering; Ferramentas: Git, GitHub, Linux');
      break;
    case 'projects':
      printTerminal('SupportFlow, Site-veronica, Seu Manoel, Beauty Store, Papitos, SQL Lab, barbearia');
      break;
    case 'status':
      printTerminal('Atualizando status dos serviços…');
      refreshSystemStatus();
      break;
    case 'contact':
      printTerminal('E-mail: lucaspaz696@gmail.com | GitHub: Japapaz696 | LinkedIn: lucas-santana-da-paz');
      break;
    case 'clear':
      if (terminalOutput) terminalOutput.replaceChildren();
      break;
    default:
      printTerminal(`Comando não encontrado: ${name}. Use help.`, 'terminal-line--error');
  }
}

if (terminalOutput) {
  printTerminal('Terminal de engenharia pronto. Digite help para começar.');
}
terminalForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!terminalInput) return;
  runTerminalCommand(terminalInput.value);
  terminalInput.value = '';
  terminalInput.focus();
});

const contactForm = document.getElementById('contact-form');
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactMessage = document.getElementById('contact-message');
const contactNameError = document.getElementById('contact-name-error');
const contactEmailError = document.getElementById('contact-email-error');
const contactMessageError = document.getElementById('contact-message-error');
const contactStatus = document.getElementById('contact-form-status');

function sanitizeContactValue(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateContactField(field) {
  if (!field) return true;
  const value = sanitizeContactValue(field.value);
  let message = '';
  if (field === contactName) {
    if (value.length < 2) message = 'Informe um nome com pelo menos 2 caracteres.';
  } else if (field === contactEmail) {
    if (!isValidEmail(value)) message = 'Informe um e-mail válido.';
  } else if (field === contactMessage) {
    if (value.length < 10) message = 'A mensagem deve ter pelo menos 10 caracteres.';
  }
  const errorElement = field === contactName ? contactNameError : field === contactEmail ? contactEmailError : contactMessageError;
  if (errorElement) errorElement.textContent = message;
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  return !message;
}

function validateContactForm() {
  return [contactName, contactEmail, contactMessage].map(validateContactField).every(Boolean);
}

[contactName, contactEmail, contactMessage].forEach((field) => {
  field?.addEventListener('input', () => validateContactField(field));
  field?.addEventListener('blur', () => validateContactField(field));
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateContactForm()) {
    if (contactStatus) contactStatus.textContent = 'Corrija os campos destacados antes de enviar.';
    return;
  }
  const name = sanitizeContactValue(contactName.value);
  const email = sanitizeContactValue(contactEmail.value);
  const message = sanitizeContactValue(contactMessage.value);
  const subject = encodeURIComponent(`Contato do portfólio: ${name}`);
  const body = encodeURIComponent(`Nome: ${name}\nE-mail: ${email}\n\n${message}`);
  if (contactStatus) contactStatus.textContent = 'Abrindo seu cliente de e-mail com a mensagem preparada.';
  window.location.href = `mailto:lucaspaz696@gmail.com?subject=${subject}&body=${body}`;
});
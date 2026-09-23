/* ========================================
   Portfólio — script.js
   Funcionalidades:
   - Navegação mobile
   - Scroll spy (seção ativa na navbar)
   - Scroll reveal (IntersectionObserver)
   - Reprodução inteligente de vídeos (Creative Lab)
   - Botão voltar ao topo
   - Menu mobile toggle
   ======================================== */

// ========================================
// Utilitários
// ========================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Debounce simples
const debounce = (fn, delay) => {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
};

// ========================================
// Navbar & Mobile Menu
// ========================================
function initNavbar() {
    const navbar = $('.navbar');
    const menuToggle = $('#menu-toggle');
    const nav = $('.nav');
    const navLinks = $('#nav-links');
    const links = $$('.nav-link', navLinks);

    const closeMenu = () => {
        if (!menuToggle || !navLinks) return;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
        navLinks.classList.remove('open');
        nav?.classList.remove('open');
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Fechar menu de navegação');
        navLinks.classList.add('open');
        nav?.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    // Toggle menu mobile
    menuToggle?.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        if (expanded) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Fechar menu ao clicar em link
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && !nav?.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 820) closeMenu();
    }, 100));

    // Scroll spy - atualizar link ativo
    const sections = $$('section[id]');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                const link = $(`.nav-link[href="#${id}"]`);
                if (entry.isIntersecting) {
                    links.forEach(l => l.classList.remove('active'));
                    link?.classList.add('active');
                }
            });
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach(sec => observer.observe(sec));

    // Navbar background on scroll
    const handleScroll = debounce(() => {
        if (window.scrollY > 20) {
            navbar.style.backgroundColor = 'rgba(10, 10, 15, 0.95)';
            navbar.style.borderBottomColor = 'var(--border)';
        } else {
            navbar.style.backgroundColor = 'var(--navbar-bg)';
            navbar.style.borderBottomColor = 'var(--border)';
        }
    }, 50);

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ========================================
// Back to Top
// ========================================
function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;

    const toggle = debounce(() => {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }, 100);

    window.addEventListener('scroll', toggle, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
}

// ========================================
// Scroll Reveal (IntersectionObserver)
// ========================================
function initScrollReveal() {
    if (prefersReducedMotion()) {
        $$('.reveal, .work-item, .lab-item, .timeline-item, .cap-category, .contact-item')
            .forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Unobserve após revelar para performance
                    observer.unobserve(entry.target);
                }
            });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    $$('.reveal, .work-item, .lab-item, .timeline-item, .cap-category, .contact-item')
        .forEach(el => observer.observe(el));
}

// ========================================
// Creative Lab - Video Playback
// ========================================
function initCreativeLabVideos() {
    const labItems = $$('.lab-item');

    labItems.forEach(item => {
        const video = $('.lab-video', item);
        const playBtn = $('.lab-play', item);
        const wrapper = $('.lab-video-wrapper', item);

        if (!video || !playBtn || !wrapper) return;

        let userPaused = false;

        const setPlayLabel = (playing) => {
            const name = item.dataset.video === 'void' ? 'VOID CLASH' : item.dataset.video.toUpperCase();
            playBtn.setAttribute('aria-label', playing ? `Pausar ${name}` : `Reproduzir ${name}`);
        };

        const showPoster = () => {
            if (video.readyState >= 1) {
                video.classList.add('loaded');
            }
        };

        video.addEventListener('loadeddata', showPoster);
        video.addEventListener('loadedmetadata', showPoster);
        video.addEventListener('canplay', showPoster);
        if (video.readyState >= 1) showPoster();

        video.addEventListener('error', () => {
            wrapper.classList.remove('playing');
            video.classList.remove('loaded');
        });

        const togglePlay = () => {
            if (video.paused) {
                userPaused = false;
                video.play().catch(() => {
                    wrapper.classList.remove('playing');
                });
            } else {
                userPaused = true;
                video.pause();
            }
        };

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
        });

        wrapper.addEventListener('click', () => {
            togglePlay();
        });

        video.addEventListener('play', () => {
            wrapper.classList.add('playing');
            setPlayLabel(true);
        });

        video.addEventListener('pause', () => {
            wrapper.classList.remove('playing');
            setPlayLabel(false);
        });

        if (!prefersReducedMotion()) {
            const videoObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            if (!userPaused) {
                                video.play().catch(() => {});
                            }
                        } else if (!video.paused) {
                            video.pause();
                            userPaused = false;
                        }
                    });
                },
                { rootMargin: '0px', threshold: 0.5 }
            );

            videoObserver.observe(wrapper);
        }
    });
}

// ========================================
// Smooth Scroll para links internos
// ========================================
function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            const target = $(href);
            if (target) {
                e.preventDefault();
                const navbarHeight = 72;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
                });

                // Atualizar URL sem recarregar
                history.pushState(null, '', href);
            }
        });
    });
}

// ========================================
// Performance: Lazy load images
// ========================================
function initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) {
        // Navegador suporta lazy loading nativo
        $$('img[loading="lazy"]').forEach(img => {
            // Forçar carregamento se já estiver na viewport
            if (img.getBoundingClientRect().top < window.innerHeight) {
                img.loading = 'eager';
            }
        });
        return;
    }

    // Fallback para navegadores antigos
    const imgObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.removeAttribute('loading');
                    imgObserver.unobserve(img);
                }
            });
        },
        { rootMargin: '100px' }
    );

    $$('img[loading="lazy"]').forEach(img => imgObserver.observe(img));
}

// ========================================
// Inicialização
// ========================================
function init() {
    // Esperar DOM pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }

    initNavbar();
    initBackToTop();
    initScrollReveal();
    initCreativeLabVideos();
    initSmoothScroll();
    initLazyImages();

    // Log de inicialização
    console.log('%cPortfólio inicializado', 'color: #d4a53a; font-size: 1rem; font-weight: 600;');
    console.log('%cVídeos Creative Lab:', 'color: #a8a8b8;');
    console.log('  • NEXA: assets/ai-creative-lab/projeto-01/video/NEXA.mp4');
    console.log('  • PULSE: assets/ai-creative-lab/projeto-01/video/PULSE.mp4');
    console.log('  • VOID CLASH: assets/ai-creative-lab/projeto-01/video/VOID CLASH.mp4');
}

// Iniciar
init();
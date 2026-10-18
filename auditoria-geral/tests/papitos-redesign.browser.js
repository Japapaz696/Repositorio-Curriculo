// Matriz funcional do Papitos — redesign "chapa editorial".
// Snippet Playwright: recebe `page`. Executar via MCP browser_run_code_unsafe({filename}).
(async (page) => {
    const context = await page.context().browser().newContext({ viewport: { width: 1440, height: 900 } });
    const p = await context.newPage();
    p.setDefaultTimeout(6000);
    const results = [];
    const widths = [375, 390, 430, 768, 1024, 1440, 1920];
    const check = (name, ok, evidence) => results.push({ name, result: ok ? 'PASS' : 'FAIL', evidence });

    try {
        for (const width of widths) {
            await p.setViewportSize({ width, height: width < 768 ? 844 : 900 });
            await p.goto('http://127.0.0.1:8139/projetos/papitos/');
            await p.waitForLoadState('networkidle');
            await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });

            const base = await p.evaluate(async () => {
                const wait = ms => new Promise(r => setTimeout(r, ms));
                scrollTo(0, document.body.scrollHeight); await wait(600);
                scrollTo(0, 0); await wait(200);
                const txt = document.body.innerText;
                return {
                    overflow: document.documentElement.scrollWidth > innerWidth,
                    broken: [...document.images].filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0).length,
                    h1: document.querySelector('.hero-text h1')?.textContent.trim(),
                    heroLoaded: document.querySelector('.hero-figure img').naturalWidth > 0,
                    cards: document.querySelectorAll('#menu-grid .menu-card').length,
                    combos: document.querySelectorAll('#combos-grid .combo-card').length,
                    oldPrice: document.querySelectorAll('.combo-old-price').length,
                    promo: /Promoção|promoção de quarta|Desde 2015|entrega mais rápida|avalia/i.test(txt),
                    reviews: !!document.getElementById('depoimentos'),
                    combo1: document.querySelector('#combos-grid .combo-card .combo-title')?.textContent,
                    captions: document.querySelectorAll('.combo-caption').length,
                    feature: !!document.querySelector('.hero-feature-btn[data-id="1"]'),
                    nested: document.querySelectorAll('button button, button a, a button').length
                };
            });
            check(`${width}px estrutura/imagens/conteúdo`, !base.overflow && base.broken === 0 && base.h1 === 'Burger no seu estilo.'
                && base.heroLoaded && base.cards === 13 && base.combos === 3 && base.oldPrice === 0 && !base.promo
                && !base.reviews && base.combo1 === 'Combo Bacon' && base.captions === 3 && base.feature && base.nested === 0, base);

            // Destaque do Hero abre personalização real
            await p.locator('.hero-feature-btn').click();
            const modalTitle = await p.locator('#product-modal-title').textContent();
            const openOk = await p.locator('#product-modal').evaluate(d => d.open) && modalTitle.includes('Clássico');
            await p.keyboard.press('Escape');
            const closedOk = await p.locator('#product-modal').evaluate(d => !d.open);
            check(`${width}px destaque do hero → modal`, openOk && closedOk, { modalTitle, openOk, closedOk });

            // Busca por nome e por ingrediente (navegando semântica real)
            await p.locator('#menu-search').fill('bacon');
            await p.waitForTimeout(250);
            const bacon = await p.locator('#menu-grid .menu-card .menu-name').allTextContents();
            await p.locator('#menu-search').fill('cheddar');
            await p.waitForTimeout(250);
            const cheddar = await p.locator('#menu-grid .menu-card .menu-name').allTextContents();
            await p.locator('#menu-search').fill('');
            await p.waitForTimeout(250);

            // Categoria
            await p.locator('#category-list [data-cat="hamburgueres"]').click();
            await p.waitForTimeout(250);
            const cats = await p.evaluate(() => [...document.querySelectorAll('#menu-grid .menu-card')].map(c => c.dataset.category));
            const catCount = cats.length;
            await p.locator('#category-list [data-cat="todos"]').click();
            await p.waitForTimeout(250);

            const searchCatOk = bacon.includes('Bacon Lover') && bacon.includes('Combo Família') && bacon.length === 2
                && cheddar.length === 1 && cheddar[0] === 'Clássico Papitos'
                && catCount === 5 && cats.every(c => c === 'hamburgueres');
            check(`${width}px busca e categoria`, searchCatOk, { bacon, cheddar, catCount });

            // Personalização → quantidade → carrinho → persistência → adição rápida
            await p.locator('#menu-search').fill('Clássico');
            await p.waitForTimeout(250);
            await p.locator('[data-action="details"]').first().click();
            await p.locator('#pm-qty-inc').click();
            await p.locator('#pm-qty-inc').click();
            const total = await p.locator('#pm-total').textContent();
            await p.locator('#pm-add-btn').click();
            await p.waitForTimeout(200);
            const count3 = await p.locator('#cart-count').textContent();

            await p.locator('.btn-cart').click();
            const cartOpen = await p.locator('#cart-modal').evaluate(d => d.open);
            const cartText = await p.locator('#cart-body').innerText();
            await p.keyboard.press('Escape');
            await p.waitForTimeout(350);
            const cartClosed = await p.locator('#cart-modal').evaluate(d => !d.open);

            await p.reload(); await p.waitForLoadState('networkidle');
            const persisted = await p.locator('#cart-count').textContent();
            await p.locator('#menu-search').fill('');
            await p.waitForTimeout(250);
            await p.locator('.menu-card [data-action="quick"]').first().click();
            const count4 = await p.locator('#cart-count').textContent();

            const flowOk = total.replace('\u00a0', ' ') === 'R$ 86,70' && count3 === '3' && cartOpen
                && /Clássico Papitos/.test(cartText) && /3/.test(cartText) && cartClosed && persisted === '3' && count4 === '4';
            check(`${width}px personalização/carrinho/persistência`, flowOk, { total, count3, cartOpen, cartClosed, persisted, count4 });
            if (!flowOk) results[results.length - 1].cartText = cartText.slice(0, 160);

            await p.evaluate(() => localStorage.removeItem('papitos-cart'));
        }

        // Reduced-motion (1 viewport, comportamento global)
        await p.setViewportSize({ width: 1440, height: 900 });
        await p.emulateMedia({ reducedMotion: 'reduce' });
        await p.goto('http://127.0.0.1:8139/projetos/papitos/');
        const rm = await p.evaluate(() => ({
            heroAnim: getComputedStyle(document.querySelector('.hero-text h1')).animationName,
            figureAnim: getComputedStyle(document.querySelector('.hero-figure')).animationName,
            scroll: getComputedStyle(document.documentElement).scrollBehavior,
            hoverTransform: getComputedStyle(document.querySelector('.hero-feature')).transitionDuration
        }));
        check('reduced-motion desliga entrada do hero', rm.heroAnim === 'none' && rm.figureAnim === 'none' && rm.scroll === 'auto', rm);
        await p.emulateMedia({ reducedMotion: 'no-preference' });

        // Teclado: skip link + foco visível + navegação por tabs até conteúdo
        await p.goto('http://127.0.0.1:8139/projetos/papitos/');
        await p.keyboard.press('Tab');
        await p.waitForTimeout(350);
        const skip = await p.evaluate(() => {
            const el = document.activeElement;
            const cs = getComputedStyle(el);
            return { text: el.textContent.trim().slice(0, 30), top: el.getBoundingClientRect().top, outline: cs.outlineStyle + ' ' + cs.outlineWidth };
        });
        check('teclado: skip link alcançável com foco visível', skip.text.startsWith('Pular para o conteúdo') && skip.top >= 0 && skip.outline !== 'none 0px', skip);
    } finally {
        await context.close();
    }
    return { ua: await page.evaluate(() => navigator.userAgent), pass: results.filter(r => r.result === 'PASS').length, fail: results.filter(r => r.result === 'FAIL').length, results };
})

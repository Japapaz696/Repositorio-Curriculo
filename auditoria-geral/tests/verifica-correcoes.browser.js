// Revalidação das 6 correções da auditoria global após o redesign do Papitos.
// Snippet Playwright: recebe `page`. MCP browser_run_code_unsafe({filename}).
(async (page) => {
    const context = await page.context().browser().newContext({ viewport: { width: 1440, height: 900 } });
    const p = await context.newPage();
    p.setDefaultTimeout(10000);
    const results = [];
    const check = (name, ok, evidence) => results.push({ name, result: ok ? 'PASS' : 'FAIL', evidence });
    const base = 'http://127.0.0.1:8139/projetos/Beauty%20Store/'; // redireciona para beauty-store real
    const beauty = 'http://127.0.0.1:8139/projetos/beauty-store/';
    const manoel = 'http://127.0.0.1:8139/projetos/seu-manoel/';
    const portfolio = 'http://127.0.0.1:8139/';
    const goTo = async url => { await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 12000 }); await p.waitForTimeout(600); };
    const jsErrors = [];
    p.on('pageerror', e => jsErrors.push(String(e)));

    try {
        // 1) Beauty — busca disponível no mobile (era display:none)
        await p.setViewportSize({ width: 390, height: 844 });
        await goTo(beauty);
        await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
        const searchRect = await p.locator('#search-input').boundingBox();
        await p.locator('#search-input').fill('sérum');
        await p.waitForTimeout(350);
        const found = await p.locator('#produtos-grid .produto-card').count();
        check('1. Beauty busca no mobile', !!searchRect && searchRect.width > 50 && found >= 1, { searchRect, found });
        await p.locator('#search-input').fill('');

        // 2) Beauty — favorito clicável com hover (stacking context do zoom)
        await p.setViewportSize({ width: 1440, height: 900 });
        await goTo(beauty);
        const card = p.locator('#produtos-grid .produto-card').first();
        await card.scrollIntoViewIfNeeded();
        await card.hover();
        const hit = await p.evaluate(() => {
            const fav = document.querySelector('.produto-card .fav-icon');
            const r = fav.getBoundingClientRect();
            const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
            return { isFav: fav.contains(el) || el === fav, hit: el.className.toString().slice(0, 40) };
        });
        const favBefore = await p.locator('.produto-card .fav-icon.active').count();
        await p.locator('.produto-card .fav-icon').first().click();
        const favAfter = await p.locator('.produto-card .fav-icon.active').count();
        const detailClosed = await p.evaluate(() => {
            const vis = sel => { const el = document.querySelector(sel); if (!el) return false; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0' && r.width > 0; };
            return !vis('#modal-overlay') && !vis('#detail-modal');
        });
        check('2. Beauty favorito clicável sob hover', hit.isFav && favAfter === 1 && detailClosed, { hit, favBefore, favAfter, detailClosed });

        // 3) Beauty — prefers-reduced-motion respeitado (era ignorado)
        await p.emulateMedia({ reducedMotion: 'reduce' });
        await goTo(beauty);
        const rm = await p.evaluate(() => {
            const sels = ['.search-bar', '.icon-btn', '.cat-link', '.btn-add-cart', '.fav-icon', '.produto-card'];
            return {
                mm: matchMedia('(prefers-reduced-motion: reduce)').matches,
                durations: sels.map(s => { const el = document.querySelector(s); return el ? s + '=' + getComputedStyle(el).transitionDuration : s + '=ausente'; }),
                scroll: getComputedStyle(document.documentElement).scrollBehavior
            };
        });
        const allZero = rm.mm && rm.durations.every(d => d.includes('=0s')) && rm.scroll === 'auto';
        check('3. Beauty reduced-motion', allZero, rm);
        await p.emulateMedia({ reducedMotion: 'no-preference' });

        // 6a) Beauty — contraste dos tokens corrigidos (marca e badge)
        await goTo(beauty);
        const contrast = await p.evaluate(() => {
            function rgb(v) { return v.match(/[\d.]+/g).slice(0, 3).map(Number); }
            function lum(a) { return a.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0); }
            function ratio(fg, bg) { const a = lum(fg), b = lum(bg); return +(((Math.max(a, b) + .05) / (Math.min(a, b) + .05))).toFixed(2); }
            const out = {};
            const marca = document.querySelector('.produto-marca');
            if (marca) out.marca = { color: getComputedStyle(marca).color, bg: getComputedStyle(document.body).backgroundColor };
            const badge = document.querySelector('.badge');
            if (badge) out.badge = { color: getComputedStyle(badge).color, bg: getComputedStyle(badge).backgroundColor };
            const precoAntigo = document.querySelector('.produto-preco-antigo');
            if (precoAntigo) out.precoAntigo = { color: getComputedStyle(precoAntigo).color, bg: getComputedStyle(document.body).backgroundColor };
            for (const k of Object.keys(out)) {
                const o = out[k];
                if (o.color && o.bg) o.ratio = ratio(rgb(o.color), rgb(o.bg));
            }
            return out;
        });
        const ratiosOk = Object.values(contrast).every(o => !o.ratio || o.ratio >= 4.5) && Object.values(contrast).some(o => o.ratio);
        check('6a. Beauty contraste tokens', ratiosOk, contrast);

        // 4) Beauty — resumo de itens/total na confirmação do checkout
        await p.locator('.btn-add-cart').first().click();
        await p.locator('#cart-btn').click();
        await p.waitForTimeout(350);
        const drawerText = await p.locator('#cart-drawer').innerText();
        await p.locator('#finalizar').click();
        await p.waitForTimeout(400);
        const inputs = p.locator('#checkout-form input');
        const n = await inputs.count();
        const vals = ['Lucas Teste', '000.000.000-00', 'teste@exemplo.com', '(11) 99999-9999', '01000-000', 'Rua A', '10', '', 'São Paulo'];
        for (let i = 0; i < Math.min(vals.length, n); i++) await inputs.nth(i).fill(vals[i]);
        await p.locator('#checkout-form select').first().selectOption({ index: 1 });
        const formValid = await p.evaluate(() => document.getElementById('checkout-form').checkValidity());
        await p.locator('#checkout-form button[type="submit"]').click();
        await p.locator('#beauty-confirm-title').waitFor({ state: 'visible', timeout: 5000 });
        const confirm = await p.locator('#checkout-confirm, .confirm-modal, [role="dialog"]').first().innerText().catch(() => '');
        const confirmAll = await p.evaluate(() => document.body.innerText);
        const cartAfter = await p.evaluate(() => JSON.parse(localStorage.getItem('beauty-cart') || '[]').length);
        const precisa = /Total/i.test(confirmAll) && /R\$/.test(confirmAll) && /Subtotal|Produto|itens/i.test(confirmAll);
        check('4. Beauty confirmação com resumo', formValid && precisa && cartAfter === 0, { formValid, trecho: confirmAll.slice(confirmAll.indexOf('Pedido Confirmado') , confirmAll.indexOf('Pedido Confirmado') + 260), cartAfter, drawerTemItem: /R\$/.test(drawerText) });

        // 6b) Portfólio — rótulos corrigidos (kicker sem rótulo duplicado, 6 etapas)
        await p.setViewportSize({ width: 1440, height: 900 });
        await goTo(portfolio);
        const port = await p.evaluate(() => {
            const vis = el => { if (!el) return null; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0; };
            return {
                kicker: document.querySelector('#hero-panel-exp .hero-panel-kicker, #hero-panel-exp p')?.textContent.trim().slice(0, 60),
                headsVisible: [...document.querySelectorAll('.hero-panel-heading')].filter(vis).length,
                etapas: /6 etapas/.test(document.body.innerText),
                seteEtapas: /7 etapas/.test(document.body.innerText)
            };
        });
        check('6b. Portfólio rótulos/etapas', port.kicker === 'Estágio · Suporte Técnico' && port.headsVisible === 0 && port.etapas && !port.seteEtapas, port);

        // 5) Seu Manoel — botão Voltar visível e clicável no mobile (era escondido/encoberto)
        await p.setViewportSize({ width: 390, height: 844 });
        await goTo(manoel);
        await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
        const phases = async () => p.evaluate(() => ['service', 'professional', 'date', 'time', 'details', 'review', 'confirmation'].find(n => !document.getElementById('phase-' + n)?.hidden));
        const next = async () => { await p.locator('#mobile-continue-button:visible, #continue-button:visible').first().click(); await p.waitForTimeout(250); };
        const seq = [await phases()];
        await p.locator('#service-options .selection-option').first().click();
        await next(); seq.push(await phases());
        await p.locator('#professional-options .selection-option').first().click();
        await next(); seq.push(await phases());
        await p.locator('#appointment-date').fill(new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10));
        await p.waitForTimeout(250);
        const backState = await p.evaluate(() => {
            const back = document.querySelector('#back-button');
            if (!back) return { exists: false };
            const r = back.getBoundingClientRect();
            const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            const hit = document.elementFromPoint(cx, cy);
            return { exists: true, hidden: back.hasAttribute('hidden'), visible: r.width > 0 && r.height > 0, centerY: cy, inViewport: cy > 0 && cy < innerHeight, hitIsBack: hit === back || back.contains(hit), hit: (hit.className || hit.id || hit.tagName).toString().slice(0, 50) };
        });
        let backWorks = false;
        if (backState.exists && !backState.hidden && backState.visible && backState.inViewport && backState.hitIsBack) {
            const before = await phases();
            await p.locator('#back-button').click();
            await p.waitForTimeout(300);
            const after = await phases();
            backWorks = after !== before;
            backState.before = before; backState.after = after;
        }
        check('5. Seu Manoel Voltar no mobile', !!seq.includes('date') && backState.exists && !backState.hidden && backState.hitIsBack && backState.inViewport && backWorks, { seq, backState });
    } finally {
        await context.close();
    }
    return { pass: results.filter(r => r.result === 'PASS').length, fail: results.filter(r => r.result === 'FAIL').length, jsErrors, results };
})

async (page) => {
    const context = await page.context().browser().newContext({ viewport: { width: 1440, height: 900 }, hasTouch: true });
    const p = await context.newPage();
    p.setDefaultTimeout(5000);
    const results = [], errors = [], requests = [];
    p.on('pageerror', e => errors.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    p.on('requestfailed', r => requests.push(r.url()));
    p.on('response', r => { if (r.status() >= 400) requests.push(`${r.status()} ${r.url()}`); });
    const assert = (v, message) => { if (!v) throw Error(message); };
    const dir = 'C:/Users/Lucas/Documents/OMNIROUTE/Curr-culo-/projetos/papitos/evidencias/bloco-3';
    const stored = () => p.evaluate(() => JSON.parse(localStorage.getItem('papitos-cart') || '[]'));
    const settled = () => p.locator('#cart-modal').evaluate(async el => { await Promise.all(el.getAnimations().map(a => a.finished.catch(() => {}))); });
    const open = async () => { await p.locator('.btn-cart').click(); await settled(); };
    const closed = () => p.waitForFunction(() => !document.querySelector('#cart-modal').open && !document.querySelector('#cart-modal').classList.contains('active'));
    const reset = async (data = [{ id: 1, qty: 2 }]) => {
        await p.goto('http://127.0.0.1:8139/projetos/papitos/');
        await p.evaluate(data => localStorage.setItem('papitos-cart', JSON.stringify(data)), data);
        await p.reload(); await p.waitForLoadState('networkidle');
    };
    const run = async (name, fn) => { try { results.push({ name, result: 'PASS', evidence: await fn() }); } catch (e) { results.push({ name, result: 'FAIL', evidence: e.message.split('Call log:')[0] }); } };
    try {
        await run('Drawer encostado à direita e modalidade real', async () => {
            await reset(); await open();
            const geometry = await p.locator('#cart-modal').evaluate(d => { const r = d.getBoundingClientRect(); return { right: r.right, width: r.width, top: r.top, height: r.height, viewportWidth: innerWidth, viewportHeight: innerHeight, modal: d.matches(':modal') }; });
            assert(Math.abs(geometry.right - geometry.viewportWidth) <= 1 && geometry.width <= 420 && Math.abs(geometry.height - geometry.viewportHeight) <= 1 && geometry.top === 0, JSON.stringify(geometry));
            assert(geometry.modal, 'Carrinho não está no top layer modal');
            await p.locator('#menu-search').evaluate(el => el.focus());
            assert(await p.locator('#cart-modal').evaluate(d => d.contains(document.activeElement)), 'Foco escapou para o fundo');
            return geometry;
        });
        await run('Cabeçalho e total alcançáveis com 10 linhas e notas completas', async () => {
            await reset(Array.from({ length: 10 }, (_, i) => ({ id: 'legacy-custom', baseId: '1', qty: 1, notes: `Linha ${i}: ` + 'x'.repeat(1980) })));
            await open();
            const layout = await p.evaluate(() => {
                const body = document.querySelector('#cart-body'), modal = document.querySelector('#cart-modal');
                const total = document.querySelector('#finalizar').getBoundingClientRect(), close = document.querySelector('#close-cart').getBoundingClientRect();
                return { bodyScrolls: body.scrollHeight > body.clientHeight, modalOverflow: modal.scrollWidth > modal.clientWidth + 1, closeVisible: close.top >= 0 && close.bottom <= innerHeight, totalVisible: total.top >= 0 && total.bottom <= innerHeight, bodyHeight: body.clientHeight };
            });
            assert(layout.bodyScrolls && !layout.modalOverflow && layout.closeVisible && layout.totalVisible && layout.bodyHeight > 0, JSON.stringify(layout));
            assert((await stored()).length === 10 && (await p.locator('.cart-notes').first().textContent()).length === 2002, 'Observação completa perdida');
            await p.locator('#cart-body').evaluate(el => { el.scrollTop = el.scrollHeight; });
            await p.locator('[data-action="edit"]').last().focus();
            assert(await p.locator('[data-action="edit"]').last().evaluate(el => { const r = el.getBoundingClientRect(), b = document.querySelector('#cart-body').getBoundingClientRect(); return r.top >= b.top && r.bottom <= b.bottom; }), 'Foco encoberto pelo resumo');
            return layout;
        });
        await run('Cinco ciclos, botão, Escape e backdrop devolvem foco e scroll', async () => {
            await reset(); await p.evaluate(() => { window.scrollTo({ top: 360, behavior: 'instant' }); });
            const startY = await p.evaluate(() => scrollY);
            for (let i = 0; i < 5; i++) {
                await open(); assert(await p.evaluate(() => document.body.style.overflow === 'hidden'), 'Scroll do fundo liberado');
                await p.locator('#close-cart').focus(); await p.keyboard.press('Shift+Tab');
                assert(await p.locator('#finalizar').evaluate(el => el === document.activeElement), 'Shift+Tab saiu');
                await p.keyboard.press('Tab'); assert(await p.locator('#close-cart').evaluate(el => el === document.activeElement), 'Tab saiu');
                if (i % 3 === 0) await p.locator('#close-cart').click();
                else if (i % 3 === 1) await p.keyboard.press('Escape');
                else await p.mouse.click(20, 300);
                await closed();
                assert(await p.locator('.btn-cart').evaluate(el => el === document.activeElement), 'Foco não voltou');
                assert(await p.evaluate(y => document.body.style.overflow === '' && Math.abs(scrollY - y) < 2, startY), 'Scroll/posição não restaurados');
            }
            // Close durante a entrada: a animação não pode bloquear reabertura.
            await p.locator('.btn-cart').click(); await p.keyboard.press('Escape'); await closed(); await open();
            await p.locator('#close-cart').click(); await closed();
            return '5 ciclos + fechamento durante entrada; foco, posição e overflow restaurados.';
        });
        await run('Editar/cancelar/salvar e passagem única ao checkout existente', async () => {
            await reset([{ id: 'legacy', baseId: '1', qty: 2, notes: 'Nota completa com aspas " <> e acentos', remove: ['Tomate'], addons: [{ id: 'bacon' }] }]);
            await open(); await p.locator('.cart-edit').click();
            assert(await p.locator('#product-modal').evaluate(d => d.matches(':modal')), 'Produto não é modal');
            assert(await p.locator('#cart-modal').evaluate(d => !d.open), 'Duas camadas modais abertas');
            await p.locator('#pm-notes').fill('descartar'); await p.keyboard.press('Escape');
            await p.waitForFunction(() => document.querySelector('#cart-modal').open);
            assert(await p.locator('.cart-edit').evaluate(el => el === document.activeElement), 'Foco não voltou ao editar');
            assert((await stored())[0].notes.includes('Nota completa'), 'Cancelar perdeu nota');
            await p.locator('.cart-edit').click(); await p.locator('#pm-qty-inc').click(); await p.locator('#pm-add-btn').click();
            await p.waitForFunction(() => document.querySelector('#cart-modal').open); await settled();
            assert((await stored())[0].qty === 3 && (await stored()).length === 1, 'Salvar duplicou/perdeu linha');
            await p.locator('#finalizar').click();
            await p.waitForFunction(() => document.querySelector('#checkout-modal').classList.contains('active'));
            assert(await p.locator('#cart-modal').evaluate(d => !d.open), 'Drawer sobre checkout');
            assert(await p.locator('#close-checkout').evaluate(el => el === document.activeElement), 'Foco não transferido');
            assert(await p.evaluate(() => document.body.style.overflow === 'hidden'), 'Checkout liberou fundo');
            await p.keyboard.press('Escape');
            assert(await p.evaluate(() => document.body.style.overflow === ''), 'Checkout deixou scroll bloqueado');
            return 'Cancelar preserva; salvar qty=3; apenas um modal por vez; checkout abre/fecha sem enviar pedido.';
        });
        await run('Remover última linha mantém saída acessível', async () => {
            await reset([{ id: 1, qty: 1 }]); await open(); await p.locator('[data-action="remove"]').click();
            assert(await p.locator('.empty-cart').isVisible(), 'Estado vazio ausente');
            assert(await p.locator('#close-cart').evaluate(el => el === document.activeElement), 'Foco perdido no vazio');
            assert(!await p.locator('#finalizar').isVisible(), 'Finalizar visível no vazio');
            await p.keyboard.press('Tab'); assert(await p.locator('#close-cart').evaluate(el => el === document.activeElement), 'Vazio não contém foco');
            await p.keyboard.press('Escape'); await closed(); return 'Vazio, foco e fechamento corretos.';
        });
        await run('7 viewports, resize, landscape e screenshots', async () => {
            await reset([{ id: 'custom', baseId: '1', qty: 2, notes: 'Sem tomate e com bacon extra. Embalar separado, por favor.', remove: ['Tomate'], addons: ['bacon'] }, { id: 2, qty: 1 }]);
            const matrix = [];
            for (const width of [375, 390, 430, 768, 1024, 1440, 1920]) {
                await p.setViewportSize({ width, height: width < 768 ? 844 : 900 }); await open();
                const geometry = await p.locator('#cart-modal').evaluate(d => { const r = d.getBoundingClientRect(); return { width: r.width, right: r.right, height: r.height, fits: r.top >= 0 && r.bottom <= innerHeight + 1 && r.left >= 0 && r.right <= innerWidth + 1, overflow: d.scrollWidth > d.clientWidth + 1 || document.documentElement.scrollWidth > innerWidth, broken: [...d.querySelectorAll('img')].some(i => i.complete && !i.naturalWidth) }; });
                assert(geometry.fits && !geometry.overflow && !geometry.broken && Math.abs(geometry.right - width) <= 1, `${width}: ${JSON.stringify(geometry)}`);
                assert(width > 480 ? geometry.width <= 420 : Math.abs(geometry.width - width) <= 1, 'Largura indevida');
                if ([390, 1440].includes(width)) { await p.locator('#cart-body').evaluate(el => { el.scrollTop = 0; }); await p.screenshot({ path: `${dir}/carrinho-${width}.png` }); }
                matrix.push({ viewport: width, ...geometry }); await p.keyboard.press('Escape'); await closed();
            }
            await p.setViewportSize({ width: 1440, height: 900 }); await open(); await p.setViewportSize({ width: 390, height: 844 });
            assert(await p.locator('#cart-modal').evaluate(d => d.clientWidth === innerWidth), 'Resize não adaptou drawer');
            await p.setViewportSize({ width: 844, height: 390 });
            await p.locator('#finalizar').focus();
            assert(await p.locator('#finalizar').evaluate(el => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }), 'Finalizar inacessível em landscape');
            await p.locator('#close-cart').focus(); assert(await p.locator('#close-cart').evaluate(el => el.getBoundingClientRect().bottom <= innerHeight), 'Fechar inacessível');
            await p.keyboard.press('Escape'); await closed(); return matrix;
        });
        await run('Alturas extremas mantêm editar e finalizar alcançáveis', async () => {
            const matrix = [];
            for (const width of [390, 844]) for (const height of [180, 260]) {
                await p.setViewportSize({ width, height }); await reset([{ id: 1, qty: 1 }]); await open();
                const bodyHeight = await p.locator('#cart-body').evaluate(el => el.clientHeight);
                assert(bodyHeight > 0, `${width}×${height}: lista colapsou para ${bodyHeight}px`);
                await p.locator('.cart-edit').click({ timeout: 1500 });
                assert(await p.locator('#product-modal').evaluate(el => el.open), 'Editar não abriu produto');
                await p.keyboard.press('Escape');
                await p.waitForFunction(() => document.querySelector('#cart-modal').open); await settled();
                if (width === 844 && height === 180) {
                    await p.locator('.cart-edit').scrollIntoViewIfNeeded();
                    await p.screenshot({ path: `${dir}/carrinho-844x180-editar.png` });
                }
                await p.locator('#finalizar').focus();
                assert(await p.locator('#finalizar').evaluate(el => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }), 'Finalizar encoberto');
                await p.locator('#close-cart').focus();
                assert(await p.locator('#close-cart').evaluate(el => { const r = el.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }), 'Fechar encoberto');
                await p.locator('#close-cart').click(); await closed();
                assert(await p.evaluate(() => document.body.style.overflow === ''), 'Scroll ficou bloqueado');
                matrix.push({ width, height, bodyHeight, edit: 'PASS', finalizar: 'PASS', fechar: 'PASS' });
            }
            return matrix;
        });
        await run('Reduced-motion e storage bloqueado', async () => {
            await p.setViewportSize({ width: 390, height: 844 }); await p.emulateMedia({ reducedMotion: 'reduce' }); await reset([]);
            await p.evaluate(() => { Storage.prototype.setItem = () => { throw Error('teste indisponível'); }; });
            await p.locator('.menu-card [data-action="quick"]').first().click(); await open();
            assert(await p.locator('.cart-item').count() === 1, 'Carrinho não funciona em memória');
            assert(await p.locator('#cart-modal').evaluate(el => getComputedStyle(el).animationName === 'none' && getComputedStyle(el).transitionDuration === '0s'), 'Movimento não removido');
            await p.keyboard.press('Escape'); await closed(); assert(await p.evaluate(() => document.body.style.overflow === ''), 'Scroll não liberado');
            return 'Sem animação; carrinho em memória continua utilizável.';
        });
        await run('Toque emulado abre, edita e fecha o drawer no mobile', async () => {
            await reset([{ id: 1, qty: 1 }]);
            await p.locator('.btn-cart').tap();
            assert(await p.locator('#cart-modal').evaluate(d => d.matches(':modal')), 'Toque não abriu');
            await p.locator('[data-action="increase"]').tap();
            assert((await stored())[0].qty === 2, 'Toque não incrementou');
            await p.locator('.cart-edit').tap();
            await p.locator('#product-modal-close').tap();
            await p.waitForFunction(() => document.querySelector('#cart-modal').open);
            await p.locator('#close-cart').tap(); await closed();
            assert(await p.evaluate(() => document.body.style.overflow === ''), 'Toque não liberou scroll');
            return '390×844 com hasTouch: abrir, incrementar, editar/cancelar e fechar por tap.';
        });
        await run('Console e rede', async () => { assert(!errors.length && !requests.length, JSON.stringify({ errors, requests })); return { errors, requests }; });
        return { ua: await p.evaluate(() => navigator.userAgent), results, pass: results.filter(r => r.result === 'PASS').length, fail: results.filter(r => r.result === 'FAIL').length };
    } finally { await context.close(); }
}

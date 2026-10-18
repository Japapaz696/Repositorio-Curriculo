async (page) => {
    const context = await page.context().browser().newContext({ viewport: { width: 1440, height: 900 } });
    const p = await context.newPage();
    const results = [];
    const errors = [], failedRequests = [], badResponses = [];
    p.on('pageerror', e => errors.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    p.on('requestfailed', r => failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
    p.on('response', r => { if (r.status() >= 400) badResponses.push({ url: r.url(), status: r.status() }); });
    const assert = (value, message) => { if (!value) throw new Error(message); };
    async function test(id, name, run) {
        try { const evidence = await run(); results.push({ id, name, result: 'PASS', evidence }); }
        catch (e) { results.push({ id, name, result: 'FAIL', evidence: e.message.split('Call log:')[0] }); }
    }
    const text = selector => p.locator(selector).textContent();
    const amount = async selector => Number((await text(selector)).replace(/[^\d,]/g, '').replace(',', '.'));
    const count = () => p.locator('.menu-card').count();
    const details = () => p.locator('[data-action="details"]').first();
    const close = () => p.locator('#product-modal-close').click();
    const settled = selector => p.locator(selector).evaluate(async el => { await Promise.all(el.getAnimations().map(a => a.finished.catch(() => {}))); });
    const choose = async cat => p.locator(`[data-cat="${cat}"]`).click();
    const search = async q => { await p.locator('#menu-search').fill(q); await p.waitForFunction(q => document.querySelector('#menu-search').value === q, q); await p.waitForTimeout(200); };
    const rows = () => p.evaluate(() => JSON.parse(localStorage.getItem('papitos-cart') || '[]'));
    const noteA = 'Sem cortar esta observação: ' + 'x'.repeat(55) + " A '\" <svg onload=alert(1)>";
    const noteB = 'Sem cortar esta observação: ' + 'x'.repeat(55) + " B '\" <svg onload=alert(1)>";
    const dir = 'C:/Users/Lucas/Documents/OMNIROUTE/Curr-culo-/projetos/papitos/evidencias/bloco-2';
    await p.goto('http://127.0.0.1:8139/projetos/papitos/');
    await p.waitForLoadState('networkidle');
    const ua = await p.evaluate(() => navigator.userAgent);
    await test(1, 'Pesquisa por nome, descrição e ingrediente cadastrado', async () => {
        await search('CLASSICO PAPITOS'); assert(await count() === 1, 'Nome sem acento não encontrado');
        await search('picles'); assert(await count() === 2, 'Picles deve retornar Clássico e Frango apenas');
        await search('coleslaw'); assert(await count() === 1 && (await text('.menu-name')).includes('Frango'), 'Descrição/ingrediente incorreto');
        await search('bebidas'); assert(await count() === 3, 'Pesquisa por categoria falhou');
        return 'Clássico=1; picles=2; coleslaw=1; bebidas=3.';
    });
    await test(2, 'Categoria combinada e limpeza de pesquisa', async () => {
        await choose('bebidas'); await search('picles'); assert(await count() === 0, 'Filtro combinado deve esvaziar');
        assert((await text('#menu-result')).includes('Nenhum'), 'Estado vazio ausente');
        await search(''); assert(await count() === 3, 'Limpar deve manter Bebidas');
        await choose('todos'); assert(await count() === 13, 'Todos não restaurou 13 produtos');
        return '0 → 3 → 13; categoria preservada ao limpar.';
    });
    await test(3, 'Detalhes por mouse, Enter e Space, sem interativos aninhados', async () => {
        assert(await p.locator('button button, button a, a button').count() === 0, 'Interativo aninhado');
        await details().click(); assert(await p.locator('#product-modal').evaluate(d => d.open), 'Clique não abriu'); await close();
        for (const key of ['Enter', 'Space']) { await details().focus(); await p.keyboard.press(key); assert(await p.locator('#product-modal').evaluate(d => d.open), key + ' não abriu'); await p.keyboard.press('Escape'); }
        return 'Mouse/Enter/Space abriram; Escape fechou; sem botões aninhados.';
    });
    await test(4, 'Remoção de ingredientes', async () => {
        await details().click(); await p.locator('#pm-remove input[value="Tomate"]').check();
        assert(await amount('#pm-total') === 28.9, 'Remover alterou preço');
        assert(await p.locator('#pm-remove input:checked').count() === 1, 'Remoção não marcada');
        return 'Tomate marcado para remoção; preço base R$28,90 preservado.';
    });
    await test(5, 'Adicional e preço dinâmico', async () => {
        await p.locator('#pm-addons input[value="bacon"]').check();
        assert(await amount('#pm-total') === 33.8, '28,90 + 4,90 deve ser 33,80');
        return 'Bacon +R$4,90 → R$33,80/unidade.';
    });
    await test(6, 'Quantidade e limite inferior', async () => {
        assert(await p.locator('#pm-qty-dec').isDisabled(), 'Diminuir em 1 deve estar desabilitado');
        await p.locator('#pm-qty-inc').click(); assert(await text('#pm-qty-val') === '2', 'Quantidade não chegou a 2');
        assert(await amount('#pm-total') === 67.6, 'Total com 2 unidades incorreto');
        return '1 mínimo; duas unidades R$67,60.';
    });
    await test(7, 'Totais em centavos e persistência da configuração', async () => {
        await p.locator('#pm-notes').fill(noteA); await p.locator('#pm-add-btn').click();
        const stored = await rows(); assert(stored[0].preco === 33.8 && stored[0].qty === 2, 'Preço/quantidade persistidos incorretos');
        await p.locator('.btn-cart').click(); assert(await amount('#cart-total') === 75.6, 'Total + entrega de 8 deve ser 75,60');
        await p.locator('input[name="entrega"][value="retirada"]').check(); assert(await amount('#cart-total') === 67.6, 'Retirada deve zerar entrega');
        await p.locator('#close-cart').click(); return 'R$67,60 subtotal; R$75,60 delivery; retirada R$67,60.';
    });
    await test(8, 'Observações completas e seguras no DOM', async () => {
        const stored = await rows(); assert(stored[0].notes === noteA, 'Notas foram truncadas');
        await p.locator('.btn-cart').click(); assert((await text('.cart-notes')) === 'Observações: ' + noteA, 'Texto não preservado');
        assert(await p.locator('.cart-notes svg').count() === 0, 'Notas viraram markup'); await p.locator('#close-cart').click();
        return `${noteA.length} caracteres preservados, incluindo aspas e <svg>, sem HTML executável.`;
    });
    await test(9, 'Configurações distintas e adição rápida independente', async () => {
        await details().click(); await p.locator('#pm-remove input[value="Tomate"]').check(); await p.locator('#pm-addons input[value="bacon"]').check();
        await p.locator('#pm-notes').fill(noteB); await p.locator('#pm-add-btn').click();
        await p.locator('.menu-card [data-action="quick"]').first().click(); await p.locator('.menu-card [data-action="quick"]').first().click();
        const stored = await rows(); assert(stored.length === 3, '3 configurações devem gerar 3 linhas');
        assert(stored[0].id !== stored[1].id && stored[2].qty === 2, 'Notas colidiram ou quick-add não agrupou');
        return 'Notas só diferem depois do 80º caractere: duas linhas distintas; sem personalização: terceira linha qty=2.';
    });
    await test(10, 'Reload, IDs numéricos/string e legado personalizado', async () => {
        const before = await rows(); await p.reload(); await p.waitForLoadState('networkidle');
        assert(JSON.stringify(await rows()) === JSON.stringify(before), 'Reload alterou persistência');
        // A restauração é também usada pelo loadCart; exercitar legado na mesma origem.
        const legacy = [{ id: 1, qty: 2 }, { id: 'combo-1', qty: 1 }, { id: 'custom-old', baseId: '1', _custom: true, remove: ['Tomate'], addons: [{ id: 'bacon' }], notes: noteA, qty: 1 }];
        await p.evaluate(data => localStorage.setItem('papitos-cart', JSON.stringify(data)), legacy); await p.reload();
        await p.locator('.btn-cart').click(); assert(await p.locator('.cart-item').count() === 3, 'Legado não restaurou 3 linhas');
        assert((await text('.cart-notes')) === 'Observações: ' + noteA, 'Notas legadas perdidas'); await p.locator('#close-cart').click();
        await p.evaluate(data => localStorage.setItem('papitos-cart', JSON.stringify(data)), before); await p.reload();
        return '3 linhas mantidas no reload e 3 formatos legados renderizados.';
    });
    await test(11, 'Incremento, decremento e remoção por ID especial', async () => {
        await p.locator('.btn-cart').click();
        await p.locator('.cart-item [data-action="increase"]').first().click(); assert((await rows())[0].qty === 3, 'Incremento errado');
        await p.locator('.cart-item [data-action="decrease"]').first().click(); assert((await rows())[0].qty === 2, 'Decremento errado');
        await p.locator('.cart-item [data-action="remove"]').last().click(); assert((await rows()).length === 2, 'Remoção errada');
        assert(await p.locator('#cart-modal').evaluate(d => d.contains(document.activeElement)), 'Foco perdido ao recriar linha');
        return '2→3→2; removeu apenas linha simples; foco mantido no carrinho.';
    });
    await test(12, 'Editar, cancelar, salvar, Escape e retorno do foco', async () => {
        await p.locator('.cart-edit').first().click();
        assert(await p.locator('#pm-notes').inputValue() === noteA, 'Edição não repôs notas');
        await p.locator('#pm-notes').fill('não salvar'); await p.keyboard.press('Escape');
        await p.waitForFunction(() => document.querySelector('#cart-modal').classList.contains('active'));
        assert((await rows())[0].notes === noteA, 'Cancelar alterou carrinho');
        assert(await p.locator('.cart-edit').first().evaluate(b => b === document.activeElement), 'Retorno de foco incorreto');
        await p.locator('.cart-edit').first().click(); await p.locator('#pm-qty-inc').click(); await p.locator('#pm-add-btn').click();
        assert((await rows()).some(r => r.notes === noteA && r.qty === 3), 'Salvar edição falhou');
        assert((await rows()).length === 2, 'Editar duplicou linha');
        await p.waitForFunction(() => document.querySelector('#cart-modal').classList.contains('active'));
        await p.keyboard.press('Escape'); assert(await p.locator('.btn-cart').evaluate(b => b === document.activeElement), 'Carrinho não devolveu foco');
        await details().click(); await close(); assert(await details().evaluate(b => b === document.activeElement), 'Fechar botão não devolveu foco');
        return 'Cancelar preserva; salvar substitui linha; Escape/botão restauram foco.';
    });
    const matrix = [];
    await test(13, 'Responsividade e capturas de modal/carrinho', async () => {
        for (const width of [375, 390, 430, 768, 1024, 1440, 1920]) {
            await p.setViewportSize({ width, height: width < 768 ? 844 : 900 });
            await p.evaluate(() => window.scrollTo(0, 0));
            const base = await p.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, broken: [...document.images].filter(i => i.complete && !i.naturalWidth).length }));
            await details().click();
            const modal = await p.locator('#product-modal').evaluate(d => { const r = d.getBoundingClientRect(); return { overflow: d.scrollWidth > d.clientWidth + 1, fits: r.left >= 0 && r.right <= innerWidth + 1 && r.top >= 0 && r.bottom <= innerHeight + 1 }; });
            if ([390, 1440].includes(width)) { await settled('#product-modal'); await p.screenshot({ path: `${dir}/modal-${width}.png` }); }
            await close(); await p.locator('.btn-cart').click();
            const cart = await p.locator('#cart-modal').evaluate(d => ({ overflow: d.scrollWidth > d.clientWidth + 1 }));
            if ([390, 1440].includes(width)) { await settled('#cart-modal'); await p.locator('#cart-body').evaluate(el => { el.scrollTop = 0; }); await p.screenshot({ path: `${dir}/carrinho-${width}.png` }); }
            await p.keyboard.press('Escape'); matrix.push({ width, base, modal, cart });
            assert(!base.overflow && !base.broken && !modal.overflow && modal.fits && !cart.overflow, 'Overflow/imagem em ' + width);
        }
        return matrix;
    });
    await test(14, 'Reduced-motion, fundo inerte e ciclo de foco', async () => {
        await p.emulateMedia({ reducedMotion: 'reduce' }); await details().click();
        const motion = await p.locator('#product-modal').evaluate(d => getComputedStyle(d).animationName);
        assert(motion === 'none', 'Animação não foi removida');
        await p.locator('#product-modal-close').focus(); await p.keyboard.press('Shift+Tab');
        assert(await p.locator('#pm-add-btn').evaluate(b => b === document.activeElement), 'Ciclo reverso de foco saiu do modal');
        await p.keyboard.press('Tab'); assert(await p.locator('#product-modal-close').evaluate(b => b === document.activeElement), 'Ciclo adiante saiu do modal');
        assert(await p.evaluate(() => document.body.style.overflow === 'hidden'), 'Scroll do fundo não bloqueado');
        await p.keyboard.press('Escape');
        await p.waitForFunction(() => !document.querySelector('#product-modal').open && document.body.style.overflow === '');
        assert(await p.evaluate(() => document.body.style.overflow === ''), 'Scroll não restaurado');
        return 'animation:none; Tab/Shift+Tab contidos; scroll bloqueado e restaurado.';
    });
    await test(15, 'Console, requisições, imagens e overflow', async () => {
        assert(errors.length === 0 && failedRequests.length === 0 && badResponses.length === 0, JSON.stringify({ errors, failedRequests, badResponses }));
        assert(matrix.length === 7 && matrix.every(r => !r.base.overflow), 'Matriz incompleta');
        return { errors, failedRequests, badResponses, matrixWidths: matrix.map(r => r.width) };
    });
    await context.close();
    return { ua, results, pass: results.filter(r => r.result === 'PASS').length, fail: results.filter(r => r.result === 'FAIL').length, errors, failedRequests, badResponses };
}

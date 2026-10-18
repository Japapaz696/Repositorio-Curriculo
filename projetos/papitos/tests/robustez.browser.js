async (page) => {
    const context = await page.context().browser().newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const p = await context.newPage(); const errors = [];
    p.on('pageerror', e => errors.push(e.message));
    const assert = (x, message) => { if (!x) throw new Error(message); };
    try {
        await p.goto('http://127.0.0.1:8139/projetos/papitos/');
        await p.evaluate(() => localStorage.setItem('papitos-cart', '{corrompido'));
        await p.reload(); assert(await p.locator('#cart-count').textContent() === '0', 'JSON corrompido quebrou carrinho');
        await p.locator('[data-action="details"]').first().tap();
        await p.locator('#pm-notes').fill('x'.repeat(1999) + 'A'); await p.locator('#pm-add-btn').tap();
        await p.locator('[data-action="details"]').first().tap();
        await p.locator('#pm-notes').fill('x'.repeat(1999) + 'B'); await p.locator('#pm-add-btn').tap();
        const stored = await p.evaluate(() => JSON.parse(localStorage.getItem('papitos-cart')));
        assert(stored.length === 2 && stored[0].notes.length === 2000 && stored[0].id !== stored[1].id, 'Notas de 2000 caracteres colidiram');
        await p.locator('[data-action="details"]').first().tap();
        await p.locator('#pm-qty-inc').tap();
        const contrast = await p.evaluate(() => {
            function rgb(value) { return value.match(/[\d.]+/g).slice(0, 3).map(Number); }
            function lum(values) { return values.map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((s, v, i) => s + v * [.2126, .7152, .0722][i], 0); }
            return ['.product-eyebrow', '#pm-desc', '#pm-ingredients', '.pm-option strong', '.product-content small', '#pm-total', '#pm-add-btn'].map(selector => {
                const el = document.querySelector(selector); let parent = el;
                while (parent && getComputedStyle(parent).backgroundColor === 'rgba(0, 0, 0, 0)') parent = parent.parentElement;
                const fg = lum(rgb(getComputedStyle(el).color)); const bg = lum(rgb(getComputedStyle(parent).backgroundColor));
                return { selector, ratio: +((Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05)).toFixed(2) };
            });
        });
        assert(contrast.every(c => c.ratio >= 4.5), 'Contraste de amostra insuficiente');
        await p.locator('#product-modal-close').tap();
        await p.route('**/imagem-falha-teste', r => r.fulfill({ status: 200, contentType: 'image/png', body: 'não é uma imagem' }));
        await p.locator('.menu-img img').first().evaluate(img => { img.src = 'imagem-falha-teste'; });
        await p.waitForFunction(() => { const i = document.querySelector('.menu-img img'); return i.dataset.fallback === 'true' && i.complete && i.naturalWidth === 640; });
        const xml = await p.evaluate(async () => { const response = await fetch('assets/imagem-indisponivel.svg'); const doc = new DOMParser().parseFromString(await response.text(), 'image/svg+xml'); return { status: response.status, errors: doc.querySelectorAll('parsererror').length }; });
        assert(xml.status === 200 && xml.errors === 0, 'SVG inválido');
        await p.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('Armazenamento bloqueado'); }; Storage.prototype.setItem = () => { throw new Error('Armazenamento bloqueado'); }; });
        await p.reload(); await p.locator('.menu-card [data-action="quick"]').first().tap();
        assert(await p.locator('#cart-count').textContent() === '1', 'Carrinho não funciona sem storage');
        assert(errors.length === 0, 'Exceções JavaScript: ' + errors.join('; '));
        return { result: 'PASS', touch: true, corruptedJSON: 'PASS', fullNotes2000: 'PASS', fallback: { width: 640, ...xml }, blockedStorage: 'PASS', contrast, errors };
    } finally { await context.close(); }
}

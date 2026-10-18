/* Lógica pura compartilhada pelo navegador e pelos testes Node (sem dependências). */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.PapitosCart = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    function configurationId(baseId, remove = [], addons = [], notes = '') {
        // Tupla JSON é inequívoca mesmo com aspas, delimitadores e Unicode nas notas.
        // Sem hash ou truncamento: toda a configuração participa da identidade.
        return JSON.stringify([String(baseId), [...new Set(remove)].sort(), [...new Set(addons)].sort(), notes]);
    }
    function makeItem(product, config = {}, qty = 1) {
        if (!Number.isSafeInteger(qty) || qty < 1 || qty > 999) throw new Error('Quantidade inválida');
        const remove = [...new Set(config.remove || [])];
        const addonIds = [...new Set((config.addons || []).map(a => typeof a === 'string' ? a : a?.id))];
        const notes = config.notes ?? '';
        if (typeof notes !== 'string' || notes.length > 2000) throw new Error('Observações inválidas');
        if (!remove.every(r => (product.ingredientes || []).includes(r))) throw new Error('Ingrediente inválido');
        const addons = addonIds.map(id => (product.adicionais || []).find(a => a.id === id));
        if (addons.some(a => !a)) throw new Error('Adicional inválido');
        const cents = Math.round(product.preco * 100) + addons.reduce((s, a) => s + Math.round(a.preco * 100), 0);
        return { id: configurationId(product.id, remove, addonIds, notes), baseId: String(product.id), nome: product.nome, img: product.img || '', preco: cents / 100, qty, remove: remove.sort(), addons: addons.map(a => ({ ...a })).sort((a, b) => a.id.localeCompare(b.id)), notes };
    }
    function restore(input, catalog) {
        if (!Array.isArray(input)) return [];
        const result = [];
        for (const raw of input) {
            if (!raw || typeof raw !== 'object') continue;
            const product = catalog.find(p => String(p.id) === String(raw.baseId ?? raw.id));
            if (!product) continue;
            try {
                const item = makeItem(product, { remove: raw.remove ?? [], addons: raw.addons ?? [], notes: raw.notes ?? '' }, raw.qty);
                const same = result.find(r => r.id === item.id);
                if (same && same.qty + item.qty <= 999) same.qty += item.qty;
                else if (!same) result.push(item);
            } catch { /* Uma linha inválida não descarta as demais linhas válidas. */ }
        }
        return result;
    }
    return { configurationId, makeItem, restore, lineCents: item => Math.round(item.preco * 100) * item.qty };
});

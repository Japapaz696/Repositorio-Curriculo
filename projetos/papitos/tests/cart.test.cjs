const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const corePath = path.join(__dirname, '../cart-core.js');
const exists = fs.existsSync(corePath);
test('módulo de identidade e validação disponível', () => assert.ok(exists, 'cart-core.js ainda não implementado'));
if (exists) {
    const core = require(corePath);
    const catalog = [{ id: 1, nome: 'Burger', preco: 28.9, img: 'burger.jpg', ingredientes: ['Tomate'], adicionais: [{ id: 'bacon', nome: 'Bacon', preco: 4.9 }] }, { id: 'combo-1', nome: 'Combo', preco: 39.9 }];
    test('observações completas e caracteres especiais distinguem configurações', () => {
        const prefix = 'a'.repeat(50);
        assert.notEqual(core.configurationId('1', [], [], prefix + 'A'), core.configurationId(1, [], [], prefix + 'B'));
        assert.notEqual(core.configurationId(1, ['a|b'], [], "'\"<&"), core.configurationId(1, ['a', 'b'], [], "'\"<&"));
        assert.equal(core.configurationId(1, ['b', 'a'], ['x'], ''), core.configurationId('1', ['a', 'b'], ['x'], ''));
    });
    test('migra IDs numéricos e strings sem confiar em preços persistidos', () => {
        const rows = core.restore([{ id: 1, qty: 2, preco: 0.01 }, { id: 'combo-1', qty: 1 }], catalog);
        assert.equal(rows.length, 2); assert.equal(rows[0].baseId, '1'); assert.equal(rows[0].preco, 28.9);
    });
    test('recalcula adicionais em centavos e preserva remoções e observações', () => {
        const row = core.makeItem(catalog[0], { addons: ['bacon'], remove: ['Tomate'], notes: "'\"<img onerror=alert(1)>" }, 2);
        assert.equal(row.preco, 33.8); assert.equal(core.lineCents(row), 6760);
        assert.deepEqual(core.restore(JSON.parse(JSON.stringify([row])), catalog), [row]);
    });
    test('migra formato personalizado anterior com baseId e objetos addons', () => {
        const old = { id: "pm:1:Tomate:bacon:nota'", baseId: '1', _custom: true, remove: ['Tomate'], addons: [{ id: 'bacon', preco: -1 }], notes: "nota'", qty: 2 };
        const row = core.restore([old], catalog)[0];
        assert.equal(row.notes, "nota'"); assert.equal(row.preco, 33.8); assert.equal(row.qty, 2);
    });
    test('rejeita dados inválidos sem executar ou renderizar campos armazenados', () => {
        assert.deepEqual(core.restore({}, catalog), []);
        assert.deepEqual(core.restore([null, {}, { id: 1, qty: -1 }, { id: 1, qty: 1.5 }, { id: 1, qty: Infinity }, { id: 'unknown', qty: 1 }], catalog), []);
        assert.deepEqual(core.restore([{ id: 1, qty: 1, addons: ['inexistente'] }], catalog), []);
    });
    test('notas diferentes não se fundem após restauração', () => {
        const rows = ['A', 'B'].map(s => core.makeItem(catalog[0], { notes: 'x'.repeat(50) + s }, 1));
        assert.equal(core.restore(rows, catalog).length, 2);
    });
}

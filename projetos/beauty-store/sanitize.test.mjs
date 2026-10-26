import { test } from 'node:test';
import assert from 'node:assert/strict';
import pkg from './sanitize.js';
const { escapeHtml } = pkg;

test('escapeHtml escapa tags de script', () => {
    assert.equal(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('escapeHtml escapa aspas e apóstrofos', () => {
    assert.equal(escapeHtml(`"'><`), '&quot;&#39;&gt;&lt;');
});

test('escapeHtml escapa ampersand', () => {
    assert.equal(escapeHtml('a&b'), 'a&amp;b');
});

test('escapeHtml converte não-string em string', () => {
    assert.equal(escapeHtml(42), '42');
    assert.equal(escapeHtml(null), 'null');
});

test('escapeHtml não altera texto seguro', () => {
    assert.equal(escapeHtml('Batom Matte'), 'Batom Matte');
});
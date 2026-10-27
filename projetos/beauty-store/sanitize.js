/* Utilitário puro de sanitização de HTML (sem dependências de DOM).
   Compartilhado pelo navegador (script.js) e pelos testes Node. */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    else root.BeautySanitize = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    return { escapeHtml };
});
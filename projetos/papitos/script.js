/* ========================================
   PAPITOS — Script
   Hamburgueria: cardápio, carrinho e checkout
   ======================================== */

// ===== Dados do cardápio =====
const produtos = [
    { id: 1, nome: "Clássico Papitos", categoria: "hamburgueres", preco: 28.90, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop", desc: "Blend artesanal 180g, queijo cheddar, alface, tomate, picles e molho da casa." },
    { id: 2, nome: "Bacon Lover", categoria: "hamburgueres", preco: 34.90, img: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop", desc: "Blend 180g, dupla de bacon crispy, queijo prato, cebola caramelizada e barbecue." },
    { id: 3, nome: "Smash Triplo", categoria: "hamburgueres", preco: 42.90, img: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=600&auto=format&fit=crop", desc: "Três blends smash de 90g, queijo derretido, cebola roxa e molho especial." },
    { id: 4, nome: "Frango Crispy", categoria: "hamburgueres", preco: 26.90, img: "https://images.unsplash.com/photo-1615297928064-24977384d0da?q=80&w=600&auto=format&fit=crop", desc: "Filé de frango empanado, coleslaw, picles e maionese de ervas." },
    { id: 5, nome: "Veggie do Chef", categoria: "hamburgueres", preco: 29.90, img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?q=80&w=600&auto=format&fit=crop", desc: "Hambúrguer de grão-de-bico, queijo branco, rúcula e tomate seco." },
    { id: 6, nome: "Combo Família", categoria: "combos", preco: 89.90, img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=600&auto=format&fit=crop", desc: "2 clássicos + 1 bacon + batata grande + 4 refris 350ml." },
    { id: 7, nome: "Combo Dupla", categoria: "combos", preco: 59.90, img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop", desc: "2 burgers à sua escolha + batata grande + 2 refris." },
    { id: 8, nome: "Combo Kids", categoria: "combos", preco: 24.90, img: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=600&auto=format&fit=crop", desc: "Mini burger + batata pequena + suco natural + brinde surpresa." },
    { id: 9, nome: "Coca-Cola 350ml", categoria: "bebidas", preco: 7.00, img: "https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=600&auto=format&fit=crop", desc: "Lata gelada 350ml." },
    { id: 10, nome: "Suco Natural", categoria: "bebidas", preco: 9.00, img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=600&auto=format&fit=crop", desc: "Laranja, abacaxi ou maracujá — 500ml." },
    { id: 11, nome: "Milkshake Ovomaltine", categoria: "bebidas", preco: 16.90, img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600&auto=format&fit=crop", desc: "Cremoso 400ml com pedaços crocantes." },
    { id: 12, nome: "Brownie com Sorvete", categoria: "sobremesas", preco: 14.90, img: "https://images.unsplash.com/photo-1607478900766-efe13248b125?q=80&w=600&auto=format&fit=crop", desc: "Brownie quentinho com bola de sorvete e calda de chocolate." },
    { id: 13, nome: "Petit Gateau", categoria: "sobremesas", preco: 18.90, img: "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=600&auto=format&fit=crop", desc: "Bolinho de chocolate com recheio cremoso e sorvete de creme." },
];

// Combos demonstrativos. Preço único, sem descontos ou promoções.
const combos = [
    { id: "combo-1", nome: "Combo Bacon", img: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop", desc: "Bacon Lover acompanhado de batata rústica e refrigerante.", itens: ["Bacon Lover", "Batata rústica grande", "Coca-Cola 350ml"], preco: 39.90 },
    { id: "combo-2", nome: "Combo Papitos Premium", img: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=600&auto=format&fit=crop", desc: "Smash Triplo com onion rings e milkshake.", itens: ["Smash Triplo", "Onion rings", "Milkshake Ovomaltine"], preco: 65.90 },
    { id: "combo-3", nome: "Combo Família", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=600&auto=format&fit=crop", desc: "Quatro lanches, batata grande e quatro refrigerantes.", itens: ["2x Clássico", "1x Bacon Lover", "Batata grande", "4x Coca 350ml"], preco: 89.90 },
];

// Somente ingredientes já descritos no catálogo. Bebidas e combos sem ficha
// individual não recebem ingredientes inferidos. Adicionais são demonstrativos.
const burgerIngredients = [
    ['Blend artesanal 180g', 'Queijo cheddar', 'Alface', 'Tomate', 'Picles', 'Molho da casa'],
    ['Blend 180g', 'Bacon crispy', 'Queijo prato', 'Cebola caramelizada', 'Barbecue'],
    ['Três blends smash de 90g', 'Queijo derretido', 'Cebola roxa', 'Molho especial'],
    ['Filé de frango empanado', 'Coleslaw', 'Picles', 'Maionese de ervas'],
    ['Hambúrguer de grão-de-bico', 'Queijo branco', 'Rúcula', 'Tomate seco']
];
produtos.slice(0, 5).forEach((p, index) => {
    p.ingredientes = burgerIngredients[index];
    p.adicionais = [
        { id: 'cheddar-extra', nome: 'Cheddar extra', preco: 3.9 },
        { id: 'onion-rings', nome: 'Onion rings', preco: 6.9 },
        ...(String(p.id) === '5' ? [] : [{ id: 'bacon', nome: 'Bacon crocante', preco: 4.9 }])
    ];
});
const catalog = [...produtos, ...combos];
const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const core = window.PapitosCart;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}
function image(src, name) {
    const img = node('img'); img.src = src; img.alt = name; img.loading = 'lazy'; img.decoding = 'async';
    img.width = 600; img.height = 375;
    return img;
}
document.addEventListener('error', event => {
    const img = event.target;
    if (img instanceof HTMLImageElement && !img.dataset.fallback) {
        img.dataset.fallback = 'true'; img.src = 'assets/imagem-indisponivel.svg';
    }
}, true);
function action(label, type, id, className = 'btn-add') {
    const button = node('button', className, label); button.type = 'button';
    button.dataset.action = type; button.dataset.id = String(id);
    return button;
}
// ===== Estado =====
function loadCart() {
    try {
        const raw = localStorage.getItem('papitos-cart');
        const parsed = raw ? JSON.parse(raw) : [];
        return core.restore(parsed, catalog);
    } catch {
        // Dados corrompidos ou armazenamento indisponível: começa com carrinho vazio.
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem('papitos-cart', JSON.stringify(cart));
    } catch {
        // O carrinho continua funcionando na sessão mesmo sem persistência.
    }
    updateCartCount();
}

let cart = loadCart();
let currentCategory = 'todos';
let searchQuery = '';
const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// ===== Render Cardápio =====
function renderMenu() {
    const grid = document.getElementById('menu-grid');
    const q = normalize(searchQuery.trim());
    const filtered = produtos.filter(p => (currentCategory === 'todos' || p.categoria === currentCategory)
        && normalize([p.nome, p.desc, p.categoria, ...(p.ingredientes || [])].join(' ')).includes(q));
    grid.replaceChildren(...filtered.map(p => {
        const card = node('article', 'menu-card'); card.dataset.category = p.categoria;
        const media = action('', 'details', p.id, 'menu-img product-details');
        media.setAttribute('aria-label', `Ver detalhes de ${p.nome}`);
        media.setAttribute('aria-haspopup', 'dialog'); media.append(image(p.img, ''), node('span', 'details-label', 'Ver detalhes e personalizar'));
        const body = node('div', 'menu-body');
        const footer = node('div', 'menu-footer');
        const quick = action('+ Adicionar', 'quick', p.id); quick.setAttribute('aria-label', `Adicionar ${p.nome} ao carrinho`);
        footer.append(node('span', 'menu-price', money(p.preco)), quick);
        body.append(node('h3', 'menu-name', p.nome), node('p', 'menu-desc', p.desc), footer); card.append(media, body); return card;
    }));
    document.getElementById('menu-result').textContent = filtered.length ? `${filtered.length} ${filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}.` : 'Nenhum produto encontrado. Tente outro termo ou categoria.';
}

// ===== Render Combos =====
function renderCombos() {
    const grid = document.getElementById('combos-grid');
    grid.replaceChildren(...combos.map(c => {
        const card = node('article', 'combo-card'); const media = node('div', 'combo-img'); media.append(image(c.img, c.nome));
        const body = node('div', 'combo-body'); const list = node('ul', 'combo-items');
        c.itens.forEach(i => list.append(node('li', '', i)));
        const row = node('div', 'combo-price-row');
        row.append(node('span', 'combo-price', money(c.preco)), action('+ Adicionar', 'quick', c.id));
        const caption = node('span', 'combo-caption', 'Imagem ilustrativa de um dos itens');
        body.append(node('h3', 'combo-title', c.nome), node('p', 'combo-desc', c.desc), list, row); card.append(media, caption, body); return card;
    }));
}

// ===== Carrinho =====
function addToCart(id) {
    const produto = catalog.find(p => String(p.id) === String(id));
    if (!produto) return;
    const item = core.makeItem(produto);
    mergeItem(item);
    saveCart();
    showToast(`✓ ${produto.nome} adicionado!`);
}

function addComboToCart(combo) {
    addToCart(combo.id);
}
function mergeItem(item) {
    const same = cart.find(row => row.id === item.id);
    if (same) same.qty = Math.min(999, same.qty + item.qty);
    else cart.push(item);
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').textContent = total;
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === String(id));
    if (!item) return;
    item.qty = Math.min(999, item.qty + delta);
    if (item.qty <= 0) cart = cart.filter(i => i.id !== String(id));
    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== String(id));
    saveCart();
    renderCart();
}

function renderCart() {
    const body = document.getElementById('cart-body');
    const footer = document.getElementById('cart-footer');

    if (cart.length === 0) {
        body.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
        footer.style.display = 'none';
        updateTotal();
        return;
    }

    footer.style.display = 'block';
    body.replaceChildren(...cart.map(item => {
        const row = node('div', 'cart-item');
        const media = node('div', 'cart-item-img'); media.append(image(item.img, ''));
        const info = node('div', 'cart-item-info');
        info.append(node('span', 'cart-item-name', item.nome), node('span', 'cart-item-price', `${money(item.preco)} / unidade`));
        if (item.remove.length) info.append(node('p', 'cart-custom', `Sem: ${item.remove.join(', ')}`));
        if (item.addons.length) info.append(node('p', 'cart-custom', `Adicionais: ${item.addons.map(a => a.nome).join(', ')}`));
        if (item.notes) info.append(node('p', 'cart-custom cart-notes', `Observações: ${item.notes}`));
        const quantity = node('div', 'cart-item-qty');
        const minus = action('−', 'decrease', item.id, 'qty-btn'); minus.setAttribute('aria-label', `Diminuir quantidade de ${item.nome}`);
        const plus = action('+', 'increase', item.id, 'qty-btn'); plus.setAttribute('aria-label', `Aumentar quantidade de ${item.nome}`);
        quantity.append(minus, node('span', 'qty-val', item.qty), plus);
        const edit = action('Editar personalização', 'edit', item.id, 'cart-edit');
        info.append(quantity, edit);
        const remove = action('✕', 'remove', item.id, 'cart-item-remove'); remove.setAttribute('aria-label', `Remover ${item.nome}`);
        row.append(media, info, remove); return row;
    }));
    updateTotal();
}

function updateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + core.lineCents(item), 0) / 100;
    const entrega = document.querySelector('input[name="entrega"]:checked')?.value === 'delivery' ? 8 : 0;
    const total = subtotal + entrega;
    document.getElementById('cart-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

document.querySelectorAll('input[name="entrega"]').forEach(input => {
    input.addEventListener('change', updateTotal);
});

// ===== Carrinho lateral e transferência entre modais =====
const cartModal = document.getElementById('cart-modal');
const checkoutModal = document.getElementById('checkout-modal');
const cartTrigger = document.querySelector('.btn-cart');
let modalReturnFocus = null;
let pagePreviousOverflow = null;
let drawerScrollTop = 0;

// Um único bloqueio durante drawer → produto/checkout → retorno/fechamento.
function lockPageScroll() {
    if (pagePreviousOverflow === null) pagePreviousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
}
function unlockPageScroll() {
    if (pagePreviousOverflow === null) return;
    document.body.style.overflow = pagePreviousOverflow;
    pagePreviousOverflow = null;
}
function openCartDrawer({ restoreFocus = true } = {}) {
    if (cartModal.open) return;
    if (restoreFocus) { modalReturnFocus = cartTrigger; drawerScrollTop = 0; }
    renderCart(); closeMenu(); lockPageScroll();
    cartModal.classList.add('active');
    cartModal.showModal();
    document.getElementById('cart-body').scrollTop = drawerScrollTop;
    document.getElementById('close-cart').focus({ preventScroll: true });
}
function closeCartDrawer(reason = 'dismiss') {
    if (!cartModal.open) return;
    drawerScrollTop = document.getElementById('cart-body').scrollTop;
    cartModal.classList.remove('active');
    cartModal.close();
    if (reason === 'dismiss') {
        unlockPageScroll();
        (modalReturnFocus?.isConnected ? modalReturnFocus : cartTrigger).focus({ preventScroll: true });
        modalReturnFocus = null;
    }
}

function getFocusable(container) {
    return [...container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter(el => el.offsetParent !== null || el === document.activeElement);
}

function openModal(modal, focusTarget) {
    lockPageScroll();
    modal.classList.add('active');
    // Força recálculo de estilos: sem isso, o focus() ainda enxerga visibility:hidden
    // (a leitura de getComputedStyle dispara o reflow síncrono).
    void getComputedStyle(modal).visibility;
    (focusTarget || getFocusable(modal)[0] || modal).focus();
}

function closeModal(modal) {
    modal.classList.remove('active');
    unlockPageScroll();
    if (modalReturnFocus && typeof modalReturnFocus.focus === 'function') modalReturnFocus.focus({ preventScroll: true });
    modalReturnFocus = null;
}

function trapTab(event, container) {
    if (event.key !== 'Tab') return;
    const focusable = getFocusable(container);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

cartTrigger.addEventListener('click', () => openCartDrawer());
document.getElementById('close-cart').addEventListener('click', () => closeCartDrawer());
cartModal.addEventListener('cancel', event => { event.preventDefault(); closeCartDrawer(); });
cartModal.addEventListener('keydown', event => trapTab(event, cartModal));
let drawerPointerOutside = false;
function outsideDrawer(event) {
    const r = cartModal.getBoundingClientRect();
    return event.target === cartModal && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom);
}
cartModal.addEventListener('pointerdown', event => { drawerPointerOutside = outsideDrawer(event); });
cartModal.addEventListener('click', event => {
    if (drawerPointerOutside && outsideDrawer(event)) closeCartDrawer();
    drawerPointerOutside = false;
});

// ===== Checkout =====
document.getElementById('finalizar').addEventListener('click', () => {
    if (cart.length === 0) return;
    closeCartDrawer('checkout');
    modalReturnFocus = cartTrigger;
    openModal(checkoutModal, document.getElementById('close-checkout'));
});
document.getElementById('close-checkout').addEventListener('click', () => closeModal(checkoutModal));

document.getElementById('checkout-form').addEventListener('submit', e => {
    e.preventDefault();
    checkoutModal.classList.remove('active');
    unlockPageScroll();
    cart = [];
    saveCart();
    renderCart();
    showToast('🎉 Pedido simulado confirmado.');
    setTimeout(() => {
        const overlayEl = document.createElement('div');
        overlayEl.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:500;display:flex;align-items:center;justify-content:center;padding:1.5rem;';
        overlayEl.innerHTML = `<div role="dialog" aria-modal="true" aria-labelledby="confirm-title" style="background:#141414;border:1px solid #2a2a2a;border-radius:16px;padding:2.5rem;max-width:420px;text-align:center;"><div aria-hidden="true" style="font-size:4rem;margin-bottom:1rem;">🎉</div><h2 id="confirm-title" style="font-family:'Bebas Neue',sans-serif;font-size:1.75rem;letter-spacing:1px;margin-bottom:0.75rem;color:#f59e0b;">Pedido Confirmado!</h2><p style="color:#a0a0a0;margin-bottom:1.5rem;">Demonstração concluída: nenhum pedido real foi enviado. Em um site real, o pedido iria para a cozinha agora.</p><button type="button" class="btn btn-primary">Voltar ao cardápio</button></div>`;
        document.body.appendChild(overlayEl);
        const closeBtn = overlayEl.querySelector('button');
        closeBtn.focus();
        const dismiss = () => {
            overlayEl.remove();
            cartTrigger.focus();
            document.removeEventListener('keydown', onKey);
        };
        const onKey = (event) => {
            if (event.key === 'Escape') dismiss();
            if (event.key === 'Tab') trapTab(event, overlayEl);
        };
        closeBtn.addEventListener('click', dismiss);
        overlayEl.addEventListener('click', (event) => { if (event.target === overlayEl) dismiss(); });
        document.addEventListener('keydown', onKey);
    }, 400);
});

// ===== Pesquisa e categorias: um listener delegado, sem anúncio do grid inteiro =====
document.getElementById('category-list').addEventListener('click', event => {
    const button = event.target.closest('[data-cat]');
    if (!button) return;
    currentCategory = button.dataset.cat;
    document.querySelectorAll('.cat-btn').forEach(b => {
        const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active));
    });
    renderMenu();
    document.getElementById('cardapio').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
});
let searchTimer;
const searchInput = document.getElementById('menu-search');
searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value; clearTimeout(searchTimer); searchTimer = setTimeout(renderMenu, 150);
});
searchInput.addEventListener('search', () => { searchQuery = searchInput.value; clearTimeout(searchTimer); renderMenu(); });

// ===== ProductModal: dialog nativo isola fundo, retém foco e trata Escape =====
const productDialog = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');
let productState = null;
let productReturnFocus = null;
let productFromCart = false;
function selection(kind, values) {
    return values.map((value, index) => {
        const label = node('label', 'pm-option'); const input = node('input');
        input.type = 'checkbox'; input.name = kind;
        input.value = kind === 'remove' ? value : value.id;
        input.id = `pm-${kind}-${index}`;
        input.checked = kind === 'remove' ? productState.remove.includes(value) : productState.addons.includes(value.id);
        label.append(input, node('span', '', kind === 'remove' ? value : value.nome));
        if (kind === 'addons') label.append(node('strong', '', `+ ${money(value.preco)}`));
        return label;
    });
}
function openProductModal(product, item = null, trigger = document.activeElement) {
    if (!product || productDialog.open) return;
    productReturnFocus = trigger;
    productFromCart = Boolean(item);
    if (productFromCart) closeCartDrawer('edit');
    productState = { product, editing: item?.id ?? null, qty: item?.qty ?? 1, remove: [...(item?.remove || [])], addons: (item?.addons || []).map(a => a.id), notes: item?.notes ?? '' };
    document.getElementById('pm-img').src = product.img;
    document.getElementById('pm-img').alt = product.nome;
    delete document.getElementById('pm-img').dataset.fallback;
    document.getElementById('product-modal-title').textContent = product.nome;
    document.getElementById('pm-desc').textContent = product.desc;
    document.getElementById('pm-price-base').textContent = money(product.preco);
    const ingredients = product.ingredientes || [];
    document.getElementById('pm-ingredients-section').hidden = !ingredients.length;
    document.getElementById('pm-ingredients').textContent = ingredients.join(' · ');
    document.getElementById('pm-remove-section').hidden = !ingredients.length;
    document.getElementById('pm-remove').replaceChildren(...selection('remove', ingredients));
    document.getElementById('pm-addons-section').hidden = !product.adicionais?.length;
    document.getElementById('pm-addons').replaceChildren(...selection('addons', product.adicionais || []));
    document.getElementById('pm-notes').value = productState.notes;
    document.getElementById('pm-add-btn').textContent = item ? 'Salvar alterações' : 'Adicionar ao carrinho';
    updateProductTotal();
    lockPageScroll();
    productDialog.showModal(); productDialog.scrollTop = 0;
    document.getElementById('product-modal-close').focus();
}
function updateProductTotal() {
    const item = core.makeItem(productState.product, productState, productState.qty);
    document.getElementById('pm-qty-val').textContent = productState.qty;
    document.getElementById('pm-total').textContent = money(core.lineCents(item) / 100);
    document.getElementById('pm-qty-dec').disabled = productState.qty <= 1;
    document.getElementById('pm-qty-inc').disabled = productState.qty >= 99;
}
productForm.addEventListener('change', event => {
    if (!['remove', 'addons'].includes(event.target.name)) return;
    productState[event.target.name] = [...productForm.querySelectorAll(`input[name="${event.target.name}"]:checked`)].map(input => input.value);
    updateProductTotal();
});
document.getElementById('pm-notes').addEventListener('input', event => { productState.notes = event.target.value; });
document.getElementById('pm-qty-inc').addEventListener('click', () => { productState.qty = Math.min(99, productState.qty + 1); updateProductTotal(); });
document.getElementById('pm-qty-dec').addEventListener('click', () => { productState.qty = Math.max(1, productState.qty - 1); updateProductTotal(); });
document.getElementById('product-modal-close').addEventListener('click', () => productDialog.close());
productDialog.addEventListener('click', event => { if (event.target === productDialog) { const r = productDialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) productDialog.close(); } });
productDialog.addEventListener('close', () => {
    if (productFromCart) {
        openCartDrawer({ restoreFocus: false });
        // A edição pode recriar a linha ou mudar sua chave; restaure o foco a um controle vivo.
        const edit = [...document.querySelectorAll('[data-action="edit"]')].find(b => b.dataset.id === productState?.editing);
        (edit || document.getElementById('close-cart')).focus();
    } else {
        unlockPageScroll();
        if (productReturnFocus?.isConnected) productReturnFocus.focus({ preventScroll: true });
        else searchInput.focus();
    }
    productState = null;
});
productDialog.addEventListener('keydown', event => { if (event.key === 'Tab') trapTab(event, productDialog); });
productForm.addEventListener('submit', event => {
    event.preventDefault();
    const item = core.makeItem(productState.product, productState, productState.qty);
    if (productState.editing) cart = cart.filter(row => row.id !== productState.editing);
    mergeItem(item); saveCart();
    showToast(productState.editing ? 'Personalização atualizada.' : 'Produto personalizado adicionado.');
    productDialog.close();
});

// IDs são apenas dados de propriedades DOM, nunca código, HTML ou seletores CSS.
document.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action: type, id } = button.dataset;
    if (type === 'quick') return addToCart(id);
    if (type === 'details') return openProductModal(catalog.find(p => String(p.id) === id), null, button);
    const item = cart.find(row => row.id === id);
    if (!item) return;
    if (type === 'edit') return openProductModal(catalog.find(p => String(p.id) === item.baseId), item, button);
    const rowIndex = cart.indexOf(item);
    if (type === 'remove') removeFromCart(id);
    if (type === 'increase' || type === 'decrease') changeQty(id, type === 'increase' ? 1 : -1);
    const rows = document.querySelectorAll('.cart-item');
    const row = rows[Math.min(rowIndex, rows.length - 1)];
    (row?.querySelector(`[data-action="${type}"]`) || row?.querySelector('button') || document.getElementById('close-cart')).focus();
});

// ===== Toast =====
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ===== Mobile Menu =====
const menuToggleEl = document.getElementById('menu-toggle');
const navEl = document.querySelector('.nav');

function closeMenu() {
    if (!navEl || !menuToggleEl) return;
    navEl.classList.remove('active');
    menuToggleEl.setAttribute('aria-expanded', 'false');
    menuToggleEl.setAttribute('aria-label', 'Abrir menu');
}

menuToggleEl.addEventListener('click', () => {
    const open = navEl.classList.toggle('active');
    menuToggleEl.setAttribute('aria-expanded', String(open));
    menuToggleEl.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});

// Fecha o menu ao escolher um link (senão ele permaneceria sobre a página).
navEl.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// ===== Teclado: Escape fecha overlays e Tab fica preso no modal aberto =====
document.addEventListener('keydown', (event) => {
    if (productDialog.open || cartModal.open) return; // Dialogs nativos têm seus próprios handlers.
    const activeModal = document.querySelector('.checkout-modal.active .checkout-content');

    if (event.key === 'Escape') {
        if (checkoutModal.classList.contains('active')) {
            closeModal(checkoutModal);
            return;
        }
        if (navEl.classList.contains('active')) {
            closeMenu();
            menuToggleEl.focus();
        }
        return;
    }

    if (activeModal) trapTab(event, activeModal);
});

// ===== Init =====
document.getElementById('year').textContent = new Date().getFullYear();
renderMenu();
renderCombos();
updateCartCount();
document.querySelectorAll('.cat-btn').forEach(b => b.setAttribute('aria-pressed', String(b.classList.contains('active'))));

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

const combos = [
    { id: "combo-1", nome: "Combo Quarta do Bacon", img: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop", desc: "Promoção especial de quarta-feira!", itens: ["Bacon Lover", "Batata rústica grande", "Coca-Cola 350ml"], preco: 39.90, antigo: 49.90 },
    { id: "combo-2", nome: "Combo Papitos Premium", img: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?q=80&w=600&auto=format&fit=crop", desc: "Para quem quer o melhor.", itens: ["Smash Triplo", "Onion rings", "Milkshake Ovomaltine"], preco: 65.90, antigo: 79.90 },
    { id: "combo-3", nome: "Combo Família", img: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=600&auto=format&fit=crop", desc: "A noite toda garantida.", itens: ["2x Clássico", "1x Bacon Lover", "Batata grande", "4x Coca 350ml"], preco: 89.90, antigo: 109.90 },
];

// ===== Estado =====
let cart = JSON.parse(localStorage.getItem('papitos-cart')) || [];
let currentCategory = 'todos';

// ===== Render Cardápio =====
function renderMenu() {
    const grid = document.getElementById('menu-grid');
    const filtered = currentCategory === 'todos'
        ? produtos
        : produtos.filter(p => p.categoria === currentCategory);

    grid.innerHTML = filtered.map(p => `
        <div class="menu-card" data-category="${p.categoria}">
            <div class="menu-img"><img src="${p.img}" alt="${p.nome}" loading="lazy"></div>
            <div class="menu-body">
                <div class="menu-title-row">
                    <h3 class="menu-name">${p.nome}</h3>
                    <span class="menu-price">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
                </div>
                <p class="menu-desc">${p.desc}</p>
                <div class="menu-footer">
                    <span class="menu-category">${p.categoria}</span>
                    <button class="btn-add" onclick="addToCart(${p.id})">+ Adicionar</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Render Combos =====
function renderCombos() {
    const grid = document.getElementById('combos-grid');
    grid.innerHTML = combos.map(c => `
        <div class="combo-card">
            <div class="combo-img"><img src="${c.img}" alt="${c.nome}" loading="lazy"></div>
            <div class="combo-body">
                <h3 class="combo-title">${c.nome}</h3>
                <p class="combo-desc">${c.desc}</p>
                <ul class="combo-items">${c.itens.map(i => `<li>✓ ${i}</li>`).join('')}</ul>
                <div class="combo-price-row">
                    <div>
                        <span class="combo-price">R$ ${c.preco.toFixed(2).replace('.', ',')}</span>
                        <span class="combo-old-price">R$ ${c.antigo.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button class="btn-add" onclick='addComboToCart(${JSON.stringify(c)})'>+ Adicionar</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== Carrinho =====
function saveCart() {
    localStorage.setItem('papitos-cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(id) {
    const produto = produtos.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id: produto.id, nome: produto.nome, preco: produto.preco, img: produto.img, qty: 1 });
    }
    saveCart();
    showToast(`✓ ${produto.nome} adicionado!`);
}

function addComboToCart(combo) {
    const id = combo.id;
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id: combo.id, nome: combo.nome, preco: combo.preco, img: combo.img, qty: 1 });
    }
    saveCart();
    showToast(`✓ ${combo.nome} adicionado!`);
}

function updateCartCount() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').textContent = total;
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
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
    body.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img"><img src="${item.img}" alt="${item.nome}"></div>
            <div class="cart-item-info">
                <span class="cart-item-name">${item.nome}</span>
                <span class="cart-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty(${typeof item.id === 'number' ? item.id : `'${item.id}'`}, -1)">−</button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${typeof item.id === 'number' ? item.id : `'${item.id}'`}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${typeof item.id === 'number' ? item.id : `'${item.id}'`})" title="Remover">🗑</button>
        </div>
    `).join('');
    updateTotal();
}

function updateTotal() {
    const subtotal = cart.reduce((sum, item) => sum + item.preco * item.qty, 0);
    const entrega = document.querySelector('input[name="entrega"]:checked')?.value === 'delivery' ? 8 : 0;
    const total = subtotal + entrega;
    document.getElementById('cart-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

document.querySelectorAll('input[name="entrega"]').forEach(input => {
    input.addEventListener('change', updateTotal);
});

// ===== Modal Carrinho =====
const overlay = document.getElementById('modal-overlay');
const cartModal = document.getElementById('cart-modal');
document.querySelector('.btn-cart').addEventListener('click', () => {
    renderCart();
    overlay.classList.add('active');
    cartModal.classList.add('active');
});
document.getElementById('close-cart').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
function closeCart() {
    overlay.classList.remove('active');
    cartModal.classList.remove('active');
}

// ===== Checkout =====
const checkoutModal = document.getElementById('checkout-modal');
document.getElementById('finalizar').addEventListener('click', () => {
    if (cart.length === 0) return;
    closeCart();
    setTimeout(() => checkoutModal.classList.add('active'), 200);
});
document.getElementById('close-checkout').addEventListener('click', () => checkoutModal.classList.remove('active'));

document.getElementById('checkout-form').addEventListener('submit', e => {
    e.preventDefault();
    checkoutModal.classList.remove('active');
    cart = [];
    saveCart();
    renderCart();
    showToast('🎉 Pedido confirmado! Em preparo.');
    setTimeout(() => {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:500;display:flex;align-items:center;justify-content:center;padding:1.5rem;';
        modal.innerHTML = `<div style="background:#141414;border:1px solid #2a2a2a;border-radius:16px;padding:2.5rem;max-width:420px;text-align:center;"><div style="font-size:4rem;margin-bottom:1rem;">🎉</div><h2 style="font-family:'Bebas Neue',sans-serif;font-size:1.75rem;letter-spacing:1px;margin-bottom:0.75rem;color:#f59e0b;">Pedido Confirmado!</h2><p style="color:#a0a0a0;margin-bottom:1.5rem;">Seu pedido foi recebido e já está sendo preparado. Tempo estimado: 25-35 minutos.</p><button onclick="this.closest('div').parentElement.remove()" class="btn btn-primary">Voltar ao cardápio</button></div>`;
        document.body.appendChild(modal);
    }, 400);
});

// ===== Filtro de categorias =====
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.cat;
        renderMenu();
        document.getElementById('cardapio').scrollIntoView({ behavior: 'smooth' });
    });
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
document.getElementById('menu-toggle').addEventListener('click', () => {
    document.querySelector('.nav').classList.toggle('active');
});

// ===== Init =====
document.getElementById('year').textContent = new Date().getFullYear();
renderMenu();
renderCombos();
updateCartCount();

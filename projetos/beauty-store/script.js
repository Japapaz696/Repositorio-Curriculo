/* ========================================
   BEAUTY STORE — Script
   E-commerce: catálogo, busca, filtros, favoritos, carrinho, frete, cupom, checkout
   ======================================== */

// ===== Catálogo de produtos =====
const produtos = [
    { id: 1, nome: "Batom Matte Longa Duração", marca: "Luxe", categoria: "maquiagem", preco: 49.90, antigo: 69.90, img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop", avaliacao: 4.8, reviews: 234, badge: "NOVO", desc: "Batom matte de alta pigmentação que dura até 16h. Textura aveludada, não resseca os lábios e tem acabamento profissional. Disponível em 12 cores." },
    { id: 2, nome: "Base Líquida HD", marca: "Luxe", categoria: "maquiagem", preco: 89.90, antigo: null, img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop", avaliacao: 4.7, reviews: 567, badge: null, desc: "Base com cobertura modulável e acabamento natural. Ideal para todos os tipos de pele. SPF 30." },
    { id: 3, nome: "Paleta de Sombras Nude", marca: "Velvet", categoria: "maquiagem", preco: 129.90, antigo: 159.90, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop", avaliacao: 4.9, reviews: 432, badge: "BEST", desc: "12 tons neutros com textura ultrafina. Altamente pigmentada e de longa duração." },
    { id: 4, nome: "Máscara de Cílios Volumax", marca: "Luxe", categoria: "maquiagem", preco: 59.90, antigo: null, img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop", avaliacao: 4.6, reviews: 891, badge: null, desc: "Volume extremo sem borrar. Efeito Boneca em até 5 demãos." },
    { id: 5, nome: "Sérum Vitamina C 20%", marca: "Glow", categoria: "skincare", preco: 119.90, antigo: 149.90, img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop", avaliacao: 4.9, reviews: 1024, badge: "TOP", desc: "Sérum antioxidante que ilumina e uniformiza o tom da pele. Uso diário, 30ml." },
    { id: 6, nome: "Hidratante Facial 60h", marca: "Pure", categoria: "skincare", preco: 79.90, antigo: null, img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=600&auto=format&fit=crop", avaliacao: 4.7, reviews: 658, badge: null, desc: "Hidratação profunda com ácido hialurônico. Para todos os tipos de pele. 50ml." },
    { id: 7, nome: "Protetor Solar Facial FPS 70", marca: "Glow", categoria: "skincare", preco: 89.90, antigo: 99.90, img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop", avaliacao: 4.8, reviews: 432, badge: null, desc: "Proteção avançada com toque seco. Não obstrui os poros. 60ml." },
    { id: 8, nome: "Perfume Floral 50ml", marca: "Velvet", categoria: "perfumaria", preco: 199.90, antigo: 249.90, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop", avaliacao: 4.9, reviews: 312, badge: "BEST", desc: "Fragrância feminina sofisticada com notas de jasmim, rosa e âmbar." },
    { id: 9, nome: "Body Splash Vanilla", marca: "Pure", categoria: "perfumaria", preco: 49.90, antigo: null, img: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?q=80&w=600&auto=format&fit=crop", avaliacao: 4.5, reviews: 198, badge: null, desc: "Body splash com notas adocicadas de baunilha. Frescor para o dia a dia. 200ml." },
    { id: 10, nome: "Shampoo Reparador 300ml", marca: "Glow", categoria: "cabelos", preco: 39.90, antigo: null, img: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=600&auto=format&fit=crop", avaliacao: 4.6, reviews: 287, badge: null, desc: "Shampoo sem sulfato que repara fios danificados. Para cabelos secos e quimicamente tratados." },
    { id: 11, nome: "Máscara Capilar Nutrição", marca: "Pure", categoria: "cabelos", preco: 49.90, antigo: 59.90, img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=600&auto=format&fit=crop", avaliacao: 4.8, reviews: 521, badge: null, desc: "Tratamento intensivo com óleos vegetais. Recupera brilho e maciez em 3 minutos." },
    { id: 12, nome: "Óleo Capilar Antiqueda", marca: "Glow", categoria: "cabelos", preco: 69.90, antigo: null, img: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?q=80&w=600&auto=format&fit=crop", avaliacao: 4.7, reviews: 234, badge: "NOVO", desc: "Fortalecimento e crescimento saudável dos fios. Fórmula com biotina. 100ml." },
    { id: 13, nome: "Loção Corporal Hidratante", marca: "Pure", categoria: "corpo", preco: 59.90, antigo: null, img: "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?q=80&w=600&auto=format&fit=crop", avaliacao: 4.6, reviews: 412, badge: null, desc: "Hidratação 24h com manteiga de karité. Textura leve e cheirinho delicioso. 400ml." },
    { id: 14, nome: "Esfoliante Corporal Café", marca: "Pure", categoria: "corpo", preco: 44.90, antigo: 54.90, img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=600&auto=format&fit=crop", avaliacao: 4.8, reviews: 678, badge: null, desc: "Esfoliante natural com grãos de café. Remove células mortas e estimula a pele. 200g." },
    { id: 15, nome: "Kit Maquiagem Completo", marca: "Luxe", categoria: "maquiagem", preco: 299.90, antigo: 399.90, img: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=600&auto=format&fit=crop", avaliacao: 4.9, reviews: 1543, badge: "OFERTA", desc: "Kit com 8 produtos essenciais: base, pó, blush, paleta, máscara, batom, delineador e primer." },
    { id: 16, nome: "Água Micelar 200ml", marca: "Pure", categoria: "skincare", preco: 29.90, antigo: null, img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&auto=format&fit=crop", avaliacao: 4.7, reviews: 876, badge: null, desc: "Remove maquiagem e impurezas sem enxaguar. Para todos os tipos de pele." },
];

// ===== Estado =====
let cart = JSON.parse(localStorage.getItem('beauty-cart')) || [];
let favoritos = JSON.parse(localStorage.getItem('beauty-fav')) || [];
let cupomAplicado = null;
let freteEscolhido = null;

const CUPONS = {
    'BEAUTY10': { tipo: 'percentual', valor: 10, label: '10% OFF' },
    'PRIMEIRACOMPRA': { tipo: 'fixo', valor: 25, label: 'R$ 25 OFF' },
    'FRETE': { tipo: 'frete', valor: 0, label: 'Frete grátis' },
};

const FRETES = [
    { tipo: 'PAC', prazo: '8-12 dias úteis', valor: 25.90 },
    { tipo: 'SEDEX', prazo: '3-5 dias úteis', valor: 49.90 },
];

// ===== Render Produtos =====
function renderProdutos() {
    const grid = document.getElementById('produtos-grid');
    const filtered = aplicarFiltros(produtos);
    const sorted = aplicarOrdenacao(filtered);

    if (sorted.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:3rem;color:#999;">Nenhum produto encontrado com esses filtros.</p>';
        return;
    }

    grid.innerHTML = sorted.map(p => `
        <div class="produto-card" data-id="${p.id}">
            <div class="produto-img" onclick="openDetail(${p.id})">
                ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
                ${p.antigo ? `<span class="badge desconto">${Math.round(((p.antigo - p.preco) / p.antigo) * 100)}% OFF</span>` : ''}
                <button class="fav-icon ${favoritos.includes(p.id) ? 'active' : ''}" onclick="event.stopPropagation();toggleFav(${p.id})">${favoritos.includes(p.id) ? '💖' : '🤍'}</button>
                <img src="${p.img}" alt="${p.nome}" loading="lazy">
            </div>
            <div class="produto-info">
                <span class="produto-marca">${p.marca}</span>
                <h3 class="produto-nome" onclick="openDetail(${p.id})" style="cursor:pointer">${p.nome}</h3>
                <div class="produto-avaliacao">⭐ ${p.avaliacao} (${p.reviews})</div>
                <div class="produto-precos">
                    <span class="produto-preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
                    ${p.antigo ? `<span class="produto-preco-antigo">R$ ${p.antigo.toFixed(2).replace('.', ',')}</span>` : ''}
                </div>
                <p class="produto-parcela">em até 6x de R$ ${(p.preco / 6).toFixed(2).replace('.', ',')} sem juros</p>
                <button class="btn-add-cart" onclick="addToCart(${p.id})">Adicionar ao carrinho</button>
            </div>
        </div>
    `).join('');
}

// ===== Filtros =====
function aplicarFiltros(lista) {
    const cats = Array.from(document.querySelectorAll('.filtro-cat:checked')).map(c => c.value);
    const marcas = Array.from(document.querySelectorAll('.filtro-marca:checked')).map(c => c.value);
    const preco = document.querySelector('input[name="preco"]:checked')?.value;
    const busca = document.getElementById('search-input').value.toLowerCase().trim();

    let filtered = lista;

    if (cats.length > 0) filtered = filtered.filter(p => cats.includes(p.categoria));
    if (marcas.length > 0) filtered = filtered.filter(p => marcas.includes(p.marca));
    if (preco) {
        if (preco === '0-50') filtered = filtered.filter(p => p.preco <= 50);
        else if (preco === '50-100') filtered = filtered.filter(p => p.preco > 50 && p.preco <= 100);
        else if (preco === '100-200') filtered = filtered.filter(p => p.preco > 100 && p.preco <= 200);
        else if (preco === '200+') filtered = filtered.filter(p => p.preco > 200);
    }
    if (busca) filtered = filtered.filter(p =>
        p.nome.toLowerCase().includes(busca) ||
        p.marca.toLowerCase().includes(busca) ||
        p.categoria.toLowerCase().includes(busca) ||
        p.desc.toLowerCase().includes(busca)
    );

    return filtered;
}

function aplicarOrdenacao(lista) {
    const ordem = document.getElementById('filtro-ordem').value;
    const sorted = [...lista];
    if (ordem === 'menor') sorted.sort((a, b) => a.preco - b.preco);
    else if (ordem === 'maior') sorted.sort((a, b) => b.preco - a.preco);
    else if (ordem === 'novo') sorted.sort((a, b) => (b.badge === 'NOVO') - (a.badge === 'NOVO'));
    return sorted;
}

// ===== Detalhe do produto =====
function openDetail(id) {
    const p = produtos.find(x => x.id === id);
    const modal = document.getElementById('detail-modal');
    modal.innerHTML = `
        <button class="detail-close" onclick="closeDetail()">✕</button>
        <div class="detail-img"><img src="${p.img}" alt="${p.nome}"></div>
        <div class="detail-body">
            <span class="detail-marca">${p.marca}</span>
            <h2 class="detail-nome">${p.nome}</h2>
            <div class="detail-avaliacao">⭐ ${p.avaliacao} <span>(${p.reviews} avaliações)</span></div>
            <div class="detail-preco">
                <span class="detail-preco-atual">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
                ${p.antigo ? `<span class="detail-preco-antigo">R$ ${p.antigo.toFixed(2).replace('.', ',')}</span>` : ''}
            </div>
            <p class="produto-parcela">ou 6x de R$ ${(p.preco / 6).toFixed(2).replace('.', ',')} sem juros</p>
            <p class="detail-desc">${p.desc}</p>
            <div class="detail-actions">
                <button class="btn btn-primary" onclick="addToCart(${p.id});closeDetail();">Adicionar ao carrinho</button>
                <button class="btn btn-ghost" onclick="toggleFav(${p.id})">${favoritos.includes(p.id) ? '💖 Favoritado' : '🤍 Favoritar'}</button>
            </div>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
    modal.classList.add('active');
}

function closeDetail() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.getElementById('detail-modal').classList.remove('active');
}

// ===== Favoritos =====
function toggleFav(id) {
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(f => f !== id);
        showToast('Removido dos favoritos');
    } else {
        favoritos.push(id);
        showToast('💖 Adicionado aos favoritos');
    }
    localStorage.setItem('beauty-fav', JSON.stringify(favoritos));
    updateFavCount();
    renderProdutos();
    renderFavoritos();
}

function updateFavCount() { document.getElementById('fav-count').textContent = favoritos.length; }

function renderFavoritos() {
    const body = document.getElementById('fav-body');
    if (favoritos.length === 0) { body.innerHTML = '<p class="empty-cart">Você ainda não favoritou nenhum produto.</p>'; return; }
    const items = favoritos.map(id => produtos.find(p => p.id === id)).filter(Boolean);
    body.innerHTML = `<div style="display:flex;flex-direction:column;gap:0.75rem;">${items.map(p => `
        <div class="cart-item">
            <div class="cart-item-img"><img src="${p.img}" alt="${p.nome}"></div>
            <div class="cart-item-info">
                <span class="cart-item-name">${p.nome}</span>
                <span class="cart-item-price">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
            </div>
            <button class="cart-item-remove" onclick="toggleFav(${p.id})" title="Remover">🗑</button>
        </div>
    `).join('')}</div>`;
}

// ===== Carrinho =====
function saveCart() {
    localStorage.setItem('beauty-cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(id) {
    const p = produtos.find(x => x.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty++;
    else cart.push({ id: p.id, nome: p.nome, preco: p.preco, img: p.img, qty: 1 });
    saveCart();
    showToast(`✓ ${p.nome} adicionado!`);
    renderCart();
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
    const subtotal = cart.reduce((s, i) => s + i.preco * i.qty, 0);
    const frete = freteEscolhido ? freteEscolhido.valor : 0;

    if (cart.length === 0) {
        body.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
        footer.style.display = 'none';
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
                    <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑</button>
        </div>
    `).join('');

    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('frete').textContent = freteEscolhido ? `R$ ${frete.toFixed(2).replace('.', ',')} (${freteEscolhido.tipo})` : 'Calcular abaixo';

    let desconto = 0;
    if (cupomAplicado) {
        if (cupomAplicado.tipo === 'percentual') desconto = subtotal * cupomAplicado.valor / 100;
        else if (cupomAplicado.tipo === 'fixo') desconto = cupomAplicado.valor;
        document.getElementById('linha-desconto').style.display = 'flex';
        document.getElementById('desconto').textContent = `-R$ ${desconto.toFixed(2).replace('.', ',')}`;
    } else {
        document.getElementById('linha-desconto').style.display = 'none';
    }

    let freteFinal = cupomAplicado?.tipo === 'frete' ? 0 : frete;
    const total = subtotal - desconto + freteFinal;
    document.getElementById('cart-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// ===== Drawers =====
document.getElementById('cart-btn').addEventListener('click', () => {
    renderCart();
    document.getElementById('cart-drawer').classList.add('active');
    document.getElementById('modal-overlay').classList.add('active');
});
document.getElementById('favoritos-btn').addEventListener('click', () => {
    renderFavoritos();
    document.getElementById('fav-drawer').classList.add('active');
    document.getElementById('modal-overlay').classList.add('active');
});
document.getElementById('close-cart').addEventListener('click', closeAllDrawers);
document.getElementById('close-fav').addEventListener('click', closeAllDrawers);
document.getElementById('modal-overlay').addEventListener('click', closeAllDrawers);
function closeAllDrawers() {
    document.getElementById('cart-drawer').classList.remove('active');
    document.getElementById('fav-drawer').classList.remove('active');
    document.getElementById('modal-overlay').classList.remove('active');
}

// ===== Frete =====
document.getElementById('calc-frete').addEventListener('click', () => {
    const cep = document.getElementById('cep-input').value.replace(/\D/g, '');
    if (cep.length !== 8) { showToast('CEP inválido'); return; }
    const subtotal = cart.reduce((s, i) => s + i.preco * i.qty, 0);
    const opcoes = FRETES.map(f => {
        const valor = subtotal >= 199 ? 0 : f.valor;
        return { ...f, valor };
    });
    document.getElementById('frete-opcoes').innerHTML = opcoes.map((f, i) => `
        <label class="frete-op ${freteEscolhido?.tipo === f.tipo ? 'selected' : ''}">
            <input type="radio" name="frete" value="${i}" ${freteEscolhido?.tipo === f.tipo ? 'checked' : ''}>
            <span>${f.tipo} — ${f.prazo}</span>
            <strong>${f.valor === 0 ? 'GRÁTIS' : `R$ ${f.valor.toFixed(2).replace('.', ',')}`}</strong>
        </label>
    `).join('');
    if (!freteEscolhido) {
        document.querySelector('input[name="frete"]').checked = true;
        freteEscolhido = opcoes[0];
    }
    document.querySelectorAll('input[name="frete"]').forEach((radio, i) => {
        radio.addEventListener('change', () => {
            freteEscolhido = opcoes[i];
            renderCart();
        });
    });
    if (subtotal >= 199) showToast('🎉 Você ganhou frete grátis!');
    renderCart();
});

// ===== Cupom =====
document.getElementById('aplicar-cupom').addEventListener('click', () => {
    const codigo = document.getElementById('cupom-input').value.trim().toUpperCase();
    if (CUPONS[codigo]) {
        cupomAplicado = CUPONS[codigo];
        showToast(`✓ Cupom aplicado: ${cupomAplicado.label}`);
        renderCart();
    } else {
        showToast('Cupom inválido');
        cupomAplicado = null;
        renderCart();
    }
});

// ===== Checkout =====
const checkoutModal = document.getElementById('checkout-modal');
document.getElementById('finalizar').addEventListener('click', () => {
    if (cart.length === 0) return;
    closeAllDrawers();
    setTimeout(() => checkoutModal.classList.add('active'), 200);
});
document.getElementById('close-checkout').addEventListener('click', () => checkoutModal.classList.remove('active'));

document.getElementById('checkout-form').addEventListener('submit', e => {
    e.preventDefault();
    checkoutModal.classList.remove('active');
    cart = [];
    cupomAplicado = null;
    freteEscolhido = null;
    saveCart();
    renderCart();
    showToast('🎉 Pedido confirmado!');
    setTimeout(() => {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);backdrop-filter:blur(6px);z-index:500;display:flex;align-items:center;justify-content:center;padding:1.5rem;';
        modal.innerHTML = `<div style="background:#fff;border-radius:20px;padding:2.5rem;max-width:420px;text-align:center;">
            <div style="font-size:4rem;margin-bottom:1rem;">🎉</div>
            <h2 style="font-family:'Playfair Display',serif;font-size:1.75rem;margin-bottom:0.75rem;background:linear-gradient(135deg,#ec4899,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Pedido Confirmado!</h2>
            <p style="color:#666;margin-bottom:1.5rem;">Recebemos seu pedido! Você receberá um e-mail com o código de rastreio em breve.</p>
            <button onclick="this.closest('div').parentElement.remove()" class="btn btn-primary">Voltar à loja</button>
        </div>`;
        document.body.appendChild(modal);
    }, 400);
});

// ===== Eventos de Filtros =====
document.querySelectorAll('.filtro-cat, .filtro-marca, input[name="preco"]').forEach(el => {
    el.addEventListener('change', renderProdutos);
});
document.getElementById('filtro-ordem').addEventListener('change', renderProdutos);
document.getElementById('limpar-filtros').addEventListener('click', () => {
    document.querySelectorAll('.filtro-cat, .filtro-marca').forEach(el => el.checked = false);
    document.querySelectorAll('input[name="preco"]').forEach(el => el.checked = false);
    renderProdutos();
});

document.getElementById('search-form').addEventListener('submit', e => { e.preventDefault(); renderProdutos(); });
document.getElementById('search-input').addEventListener('input', renderProdutos);

document.querySelectorAll('.cat-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.cat-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        const cat = link.dataset.cat;
        if (cat === 'todos') {
            document.querySelectorAll('.filtro-cat').forEach(c => c.checked = false);
        } else if (cat === 'ofertas') {
            document.querySelectorAll('.filtro-cat').forEach(c => c.checked = false);
        } else {
            document.querySelectorAll('.filtro-cat').forEach(c => c.checked = (c.value === cat));
        }
        renderProdutos();
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

// ===== Init =====
document.getElementById('year').textContent = new Date().getFullYear();
renderProdutos();
updateCartCount();
updateFavCount();

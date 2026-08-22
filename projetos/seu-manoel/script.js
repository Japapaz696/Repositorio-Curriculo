/* ========================================
   SEU MANOEL — Script
   Barbearia: agendamento em passos, LocalStorage
   ======================================== */

// ===== Dados =====
const servicos = [
    { id: 'corte', nome: 'Corte Clássico', desc: 'Corte tradicional com tesoura e máquina', preco: 45, duracao: 30 },
    { id: 'barba', nome: 'Barba Completa', desc: 'Aparar, alinhar, toalha quente e óleo', preco: 35, duracao: 25 },
    { id: 'combo', nome: 'Corte + Barba', desc: 'Corte clássico + barba completa', preco: 70, duracao: 50 },
    { id: 'sobrancelha', nome: 'Design Sobrancelha', desc: 'Modelagem com pinça e tesoura', preco: 20, duracao: 15 },
    { id: 'hidratacao', nome: 'Hidratação Facial', desc: 'Limpeza, esfoliação e máscara hidratante', preco: 50, duracao: 40 },
    { id: 'pigmentacao', nome: 'Pigmentação Barba', desc: 'Correção de falhas e escurecimento', preco: 80, duracao: 45 },
];

const profissionais = [
    { id: 'manoel', nome: 'Manoel Silva', role: 'Fundador & Master Barber', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop', desc: '25 anos de experiência, especialista em cortes clássicos e barbas tradicionais.' },
    { id: 'lucas', nome: 'Lucas Ferreira', role: 'Senior Barber', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', desc: 'Especialista em cortes modernos, fades e barba com toalha quente.' },
    { id: 'rafael', nome: 'Rafael Costa', role: 'Estilista', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop', desc: 'Apaixonado por cortes autorais e visagismo. Atualiza o visual com a sua cara.' },
];

// ===== Estado =====
let agendamentos = JSON.parse(localStorage.getItem('seumanoel-agendamentos')) || [];
let selecionado = { servico: null, profissional: null, data: null, hora: null, cliente: {} };
let currentStep = 1;

// ===== Render =====
function renderServicos() {
    const grid = document.getElementById('servicos-grid');
    grid.innerHTML = servicos.map(s => `
        <div class="servico-card" data-id="${s.id}" onclick="selectServico('${s.id}')">
            <div class="servico-icon">✂️</div>
            <h3 class="servico-nome">${s.nome}</h3>
            <p class="servico-desc">${s.desc}</p>
            <div class="servico-preco">R$ ${s.preco},00 <span class="servico-duracao">• ${s.duracao} min</span></div>
        </div>
    `).join('');
}

function renderProfissionais() {
    const grid = document.getElementById('prof-grid');
    grid.innerHTML = profissionais.map(p => `
        <div class="prof-card" data-id="${p.id}" onclick="selectProfissional('${p.id}')">
            <div class="prof-avatar"><img src="${p.avatar}" alt="${p.nome}" loading="lazy"></div>
            <h3>${p.nome}</h3>
            <span class="prof-role">${p.role}</span>
            <p>${p.desc}</p>
        </div>
    `).join('');
}

function renderStepServicos() {
    const grid = document.getElementById('step-servicos');
    grid.innerHTML = servicos.map(s => `
        <div class="servico-card ${selecionado.servico === s.id ? 'selected' : ''}" data-id="${s.id}" onclick="selectServico('${s.id}')">
            <h3 class="servico-nome">${s.nome}</h3>
            <p class="servico-desc">${s.desc}</p>
            <div class="servico-preco">R$ ${s.preco},00 <span class="servico-duracao">• ${s.duracao} min</span></div>
        </div>
    `).join('');
}

function renderStepProfissionais() {
    const grid = document.getElementById('step-profs');
    grid.innerHTML = profissionais.map(p => `
        <div class="prof-card ${selecionado.profissional === p.id ? 'selected' : ''}" data-id="${p.id}" onclick="selectProfissional('${p.id}')">
            <div class="prof-avatar"><img src="${p.avatar}" alt="${p.nome}"></div>
            <h4>${p.nome}</h4>
            <span class="prof-role">${p.role}</span>
        </div>
    `).join('');
}

// ===== Seleções =====
function selectServico(id) {
    selecionado.servico = id;
    renderStepServicos();
    updateAvancar();
}

function selectProfissional(id) {
    selecionado.profissional = id;
    renderStepProfissionais();
    updateAvancar();
}

function updateAvancar() {
    const btn = document.getElementById('btn-avancar');
    if (currentStep === 1) btn.disabled = !selecionado.servico;
    else if (currentStep === 2) btn.disabled = !selecionado.profissional;
    else if (currentStep === 3) btn.disabled = !selecionado.data || !selecionado.hora;
    else if (currentStep === 4) btn.disabled = !selecionado.cliente.nome || !selecionado.cliente.telefone;
}

// ===== Navegação Passos =====
function avancar() {
    if (currentStep === 1 && !selecionado.servico) return;
    if (currentStep === 2 && !selecionado.profissional) return;
    if (currentStep === 3 && (!selecionado.data || !selecionado.hora)) return;
    if (currentStep === 4 && (!selecionado.cliente.nome || !selecionado.cliente.telefone)) return;

    document.getElementById(`step-${currentStep}`).style.display = 'none';
    currentStep++;
    document.getElementById(`step-${currentStep}`).style.display = 'block';
    updateNav();

    if (currentStep === 3) gerarHorarios();
    if (currentStep === 5) renderResumo();
}

function voltar() {
    if (currentStep <= 1) return;
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    currentStep--;
    document.getElementById(`step-${currentStep}`).style.display = 'block';
    updateNav();
}

function updateNav() {
    const voltarBtn = document.getElementById('btn-voltar');
    const avancarBtn = document.getElementById('btn-avancar');
    voltarBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    avancarBtn.textContent = currentStep === 4 ? 'Revisar →' : 'Avançar →';
    updateAvancar();
}

function resetAgendamento() {
    selecionado = { servico: null, profissional: null, data: null, hora: null, cliente: {} };
    currentStep = 1;
    document.querySelectorAll('.step').forEach((s, i) => s.style.display = i === 0 ? 'block' : 'none');
    document.getElementById('resumo').style.display = 'none';
    updateNav();
    renderStepServicos();
    renderStepProfissionais();
    document.getElementById('data').value = '';
    document.getElementById('time-grid').innerHTML = '';
    document.getElementById('form-cliente').reset();
}

// ===== Horários =====
function gerarHorarios() {
    const dataInput = document.getElementById('data');
    const minDate = new Date().toISOString().split('T')[0];
    dataInput.min = minDate;
    if (!dataInput.value) dataInput.value = minDate;

    atualizarGridHorarios();
    dataInput.addEventListener('change', atualizarGridHorarios);
}

function atualizarGridHorarios() {
    const dataStr = document.getElementById('data').value;
    if (!dataStr) return;
    const grid = document.getElementById('time-grid');
    const horarios = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30',
                      '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'];

    const ocupados = agendamentos
        .filter(a => a.data === dataStr)
        .map(a => a.hora);

    grid.innerHTML = horarios.map(h => {
        const indisponivel = ocupados.includes(h);
        return `<button class="time-btn ${selecionado.hora === h ? 'selected' : ''} ${indisponivel ? '' : ''}"
            ${indisponivel ? 'disabled' : `onclick="selectHora('${h}')"}`}
            >${h}</button>`;
    }).join('');
}

function selectHora(hora) {
    selecionado.hora = hora;
    selecionado.data = document.getElementById('data').value;
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
    event.target.classList.add('selected');
    updateAvancar();
}

// ===== Dados do cliente =====
document.getElementById('form-cliente').addEventListener('input', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        selecionado.cliente[e.target.name] = e.target.value;
    }
    updateAvancar();
});

// ===== Resumo =====
function renderResumo() {
    const serv = servicos.find(s => s.id === selecionado.servico);
    const prof = profissionais.find(p => p.id === selecionado.profissional);
    const content = document.getElementById('resumo-content');
    content.innerHTML = `
        <div class="resumo-row"><span>Serviço:</span><strong>${serv.nome}</strong></div>
        <div class="resumo-row"><span>Profissional:</span><strong>${prof.nome}</strong></div>
        <div class="resumo-row"><span>Data:</span><strong>${formatarData(selecionado.data)}</strong></div>
        <div class="resumo-row"><span>Horário:</span><strong>${selecionado.hora}</strong></div>
        <div class="resumo-row"><span>Cliente:</span><strong>${selecionado.cliente.nome}</strong></div>
        <div class="resumo-row"><span>Telefone:</span><strong>${selecionado.cliente.telefone}</strong></div>
        <div class="resumo-row"><span>Valor:</span><strong>R$ ${serv.preco},00</strong></div>
    `;
    document.getElementById('resumo').style.display = 'block';
}

// ===== Confirmar =====
function confirmarAgendamento() {
    const serv = servicos.find(s => s.id === selecionado.servico);
    const prof = profissionais.find(p => p.id === selecionado.profissional);
    const agendamento = {
        id: Date.now(),
        servico: serv.nome,
        profissional: prof.nome,
        data: selecionado.data,
        hora: selecionado.hora,
        cliente: { ...selecionado.cliente },
        status: 'confirmado',
        criadoEm: new Date().toISOString()
    };
    agendamentos.push(agendamento);
    localStorage.setItem('seumanoel-agendamentos', JSON.stringify(agendamentos));
    showToast('✂️ Agendamento confirmado!');
    renderMeusAgendamentos();
    resetAgendamento();
}

// ===== Meus Agendamentos =====
function renderMeusAgendamentos() {
    const lista = document.getElementById('lista-agendamentos');
    if (agendamentos.length === 0) {
        lista.innerHTML = '<p class="empty-state">Você ainda não tem agendamentos. Faça seu primeiro logo acima! ☝️</p>';
        return;
    }
    const ordenados = [...agendamentos].sort((a, b) => new Date(a.data + ' ' + a.hora) - new Date(b.data + ' ' + b.hora));
    lista.innerHTML = ordenados.map(a => `
        <div class="agendamento-card">
            <span class="agendamento-status">${a.status}</span>
            <div class="agendamento-info">
                <h4>${a.servico} com ${a.profissional}</h4>
                <p>${formatarData(a.data)} às ${a.hora} • ${a.cliente.nome} • ${a.cliente.telefone}</p>
            </div>
            <button class="btn-cancelar" onclick="cancelarAgendamento(${a.id})">Cancelar</button>
        </div>
    `).join('');
}

function cancelarAgendamento(id) {
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;
    agendamentos = agendamentos.filter(a => a.id !== id);
    localStorage.setItem('seumanoel-agendamentos', JSON.stringify(agendamentos));
    showToast('Agendamento cancelado');
    renderMeusAgendamentos();
}

function formatarData(iso) {
    const [ano, mes, dia] = iso.split('-');
    const data = new Date(ano, mes - 1, dia);
    return data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ===== Toast =====
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== Init =====
document.getElementById('year').textContent = new Date().getFullYear();
renderServicos();
renderProfissionais();
renderStepServicos();
renderStepProfissionais();
renderMeusAgendamentos();
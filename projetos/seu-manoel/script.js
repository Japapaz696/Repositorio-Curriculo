import {
    BOOKING_VERSION,
    canAdvance,
    formatSlot,
    formatTime,
    getAvailableSlots,
    getWeekday,
    normalizeBookings,
    parseLocalDate,
    toLocalDateInputValue,
} from './booking-rules.mjs';

const STORAGE_KEY = 'seu-manoel:bookings:v2';
const PHASES = ['service', 'professional', 'date', 'time', 'details', 'review', 'confirmation'];
const STEP_LABELS = {
    service: 'Serviço',
    professional: 'Profissional',
    date: 'Data',
    time: 'Horário',
    details: 'Dados',
    review: 'Revisão',
};

const catalog = {
    slotIntervalMinutes: 30,
    services: [
        { id: 'corte-30', label: 'Corte', durationMinutes: 30, price: 45 },
        { id: 'barba-30', label: 'Barba', durationMinutes: 30, price: 35 },
        { id: 'corte-barba-60', label: 'Corte e barba', durationMinutes: 60, price: 75 },
        { id: 'cuidado-45', label: 'Cuidado facial', durationMinutes: 45, price: 50 },
    ],
    professionals: [
        {
            id: 'alex',
            label: 'Alex',
            specialty: 'Atendimentos de corte e acabamento',
            availability: {
                0: [],
                1: [{ startMinute: 540, endMinute: 720 }, { startMinute: 840, endMinute: 1200 }],
                2: [{ startMinute: 540, endMinute: 720 }, { startMinute: 840, endMinute: 1200 }],
                3: [{ startMinute: 540, endMinute: 720 }, { startMinute: 840, endMinute: 1200 }],
                4: [{ startMinute: 540, endMinute: 720 }, { startMinute: 840, endMinute: 1200 }],
                5: [{ startMinute: 540, endMinute: 720 }, { startMinute: 840, endMinute: 1140 }],
                6: [{ startMinute: 540, endMinute: 780 }],
            },
        },
        {
            id: 'bia',
            label: 'Bia',
            specialty: 'Atendimentos de barba e cuidado',
            availability: {
                0: [],
                1: [{ startMinute: 600, endMinute: 780 }, { startMinute: 840, endMinute: 1140 }],
                2: [{ startMinute: 600, endMinute: 780 }, { startMinute: 840, endMinute: 1140 }],
                3: [{ startMinute: 600, endMinute: 780 }, { startMinute: 840, endMinute: 1140 }],
                4: [{ startMinute: 600, endMinute: 780 }, { startMinute: 840, endMinute: 1140 }],
                5: [{ startMinute: 600, endMinute: 780 }, { startMinute: 840, endMinute: 1080 }],
                6: [],
            },
        },
        {
            id: 'caio',
            label: 'Caio',
            specialty: 'Atendimentos de corte e cuidado',
            availability: {
                0: [],
                1: [{ startMinute: 540, endMinute: 690 }, { startMinute: 780, endMinute: 1140 }],
                2: [{ startMinute: 540, endMinute: 690 }, { startMinute: 780, endMinute: 1140 }],
                3: [{ startMinute: 540, endMinute: 690 }, { startMinute: 780, endMinute: 1140 }],
                4: [{ startMinute: 540, endMinute: 690 }, { startMinute: 780, endMinute: 1140 }],
                5: [{ startMinute: 540, endMinute: 690 }, { startMinute: 780, endMinute: 1080 }],
                6: [{ startMinute: 540, endMinute: 720 }],
            },
        },
    ],
};

const state = {
    phase: 'service',
    draft: createEmptyDraft(),
    bookings: [],
    persistenceAvailable: true,
    pendingCancellationId: null,
};

const storedBookings = loadBookings();
state.bookings = storedBookings.bookings;
state.persistenceAvailable = storedBookings.available;

const elements = {
    form: document.getElementById('booking-form'),
    stepper: document.getElementById('booking-stepper'),
    phases: [...document.querySelectorAll('[data-phase]')],
    serviceOptions: document.getElementById('service-options'),
    professionalOptions: document.getElementById('professional-options'),
    date: document.getElementById('appointment-date'),
    timeOptions: document.getElementById('time-options'),
    timeStatus: document.getElementById('time-status'),
    back: document.getElementById('back-button'),
    continue: document.getElementById('continue-button'),
    mobileContinue: document.getElementById('mobile-continue-button'),
    mobileSummaryTrigger: document.getElementById('mobile-summary-trigger'),
    desktopSummary: document.getElementById('desktop-summary'),
    mobileSummary: document.getElementById('mobile-summary'),
    reviewSummary: document.getElementById('review-summary'),
    confirmation: document.getElementById('confirmation-content'),
    bookingList: document.getElementById('booking-list'),
    clearHistory: document.getElementById('clear-history-button'),
    summaryDialog: document.getElementById('summary-dialog'),
    cancelDialog: document.getElementById('cancel-dialog'),
    clearDialog: document.getElementById('clear-dialog'),
    confirmCancel: document.getElementById('confirm-cancel-button'),
    confirmClear: document.getElementById('confirm-clear-button'),
    liveRegion: document.getElementById('live-region'),
};

function createEmptyDraft() {
    return {
        serviceId: null,
        professionalId: null,
        date: null,
        startMinute: null,
        customer: { name: '', phone: '', email: '', notes: '' },
    };
}

function getService() {
    return catalog.services.find((service) => service.id === state.draft.serviceId) || null;
}

function getProfessional() {
    return catalog.professionals.find((professional) => professional.id === state.draft.professionalId) || null;
}

function getWindowsForSelectedDate() {
    const professional = getProfessional();
    const weekday = getWeekday(state.draft.date);
    if (!professional || weekday === null) return [];
    return professional.availability[weekday] || [];
}

function getSlots() {
    const service = getService();
    const professional = getProfessional();
    if (!service || !professional || !state.draft.date) return [];

    return getAvailableSlots({
        date: state.draft.date,
        durationMinutes: service.durationMinutes,
        windows: getWindowsForSelectedDate(),
        bookings: state.bookings,
        professionalId: professional.id,
        intervalMinutes: catalog.slotIntervalMinutes,
    });
}

function getSelectedSlot() {
    return getSlots().find((slot) => slot.startMinute === state.draft.startMinute) || null;
}

function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

function formatDate(dateString, options = { weekday: 'long', day: 'numeric', month: 'long' }) {
    const date = parseLocalDate(dateString);
    return date ? new Intl.DateTimeFormat('pt-BR', options).format(date) : 'A definir';
}

function announce(message) {
    elements.liveRegion.textContent = '';
    window.setTimeout(() => {
        elements.liveRegion.textContent = message;
    }, 40);
}

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function loadBookings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return { bookings: raw ? normalizeBookings(JSON.parse(raw)) : [], available: true };
    } catch {
        return { bookings: [], available: false };
    }
}

function persistBookings() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookings));
        state.persistenceAvailable = true;
        return true;
    } catch {
        state.persistenceAvailable = false;
        return false;
    }
}

function phaseIndex(phase = state.phase) {
    return PHASES.indexOf(phase);
}

function getBookingPhases() {
    return PHASES.filter((phase) => phase !== 'confirmation');
}

function updateStepper() {
    const currentIndex = getBookingPhases().indexOf(state.phase);
    elements.stepper.replaceChildren();

    getBookingPhases().forEach((phase, index) => {
        const item = createElement('li', 'stepper__item');
        const stateName = index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming';
        item.dataset.state = stateName;
        if (stateName === 'current') item.setAttribute('aria-current', 'step');

        const marker = createElement('span', 'stepper__marker', index < currentIndex ? '✓' : String(index + 1));
        marker.setAttribute('aria-hidden', 'true');
        item.append(marker, createElement('span', 'stepper__label', STEP_LABELS[phase]));
        elements.stepper.append(item);
    });
}

function renderServices() {
    elements.serviceOptions.replaceChildren(...catalog.services.map((service) => {
        const label = createElement('label', 'selection-option');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'service';
        input.value = service.id;
        input.checked = service.id === state.draft.serviceId;

        const content = createElement('span', 'selection-option__content');
        const title = createElement('span', 'selection-option__title', service.label);
        const details = createElement('span', 'selection-option__details');
        details.append(createElement('span', 'mono', `${service.durationMinutes} min`), createElement('span', 'mono', formatPrice(service.price)));
        content.append(title, details);
        label.append(input, content);
        return label;
    }));
}

function nextAvailabilityForProfessional(professional) {
    const service = getService();
    if (!service) return 'Escolha um serviço primeiro';

    for (let offset = 0; offset < 14; offset += 1) {
        const candidate = new Date();
        candidate.setHours(0, 0, 0, 0);
        candidate.setDate(candidate.getDate() + offset);
        const date = toLocalDateInputValue(candidate);
        const weekday = candidate.getDay();
        const slots = getAvailableSlots({
            date,
            durationMinutes: service.durationMinutes,
            windows: professional.availability[weekday] || [],
            bookings: state.bookings,
            professionalId: professional.id,
            intervalMinutes: catalog.slotIntervalMinutes,
        });
        const nextSlot = slots.find((slot) => slot.available);
        if (nextSlot) return `Próximo: ${formatDate(date, { day: 'numeric', month: 'short' })}, ${formatTime(nextSlot.startMinute)}`;
    }

    return 'Sem horário nos próximos 14 dias';
}

function renderProfessionals() {
    elements.professionalOptions.replaceChildren(...catalog.professionals.map((professional) => {
        const label = createElement('label', 'selection-option selection-option--professional');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'professional';
        input.value = professional.id;
        input.checked = professional.id === state.draft.professionalId;

        const content = createElement('span', 'selection-option__content');
        content.append(
            createElement('span', 'selection-option__title', professional.label),
            createElement('span', 'selection-option__description', professional.specialty),
            createElement('span', 'selection-option__availability', nextAvailabilityForProfessional(professional)),
        );
        label.append(input, content);
        return label;
    }));
}

function renderTimes() {
    const service = getService();
    const professional = getProfessional();
    elements.timeOptions.replaceChildren();

    if (!service || !professional || !state.draft.date) {
        elements.timeStatus.textContent = 'Escolha serviço, profissional e data antes de consultar horários.';
        return;
    }

    const slots = getSlots();
    const availableCount = slots.filter((slot) => slot.available).length;
    elements.timeStatus.textContent = availableCount
        ? `${availableCount} ${availableCount === 1 ? 'horário disponível' : 'horários disponíveis'} para ${formatDate(state.draft.date)}.`
        : 'Não há horários disponíveis nesta data para esta demonstração.';

    elements.timeOptions.append(...slots.map((slot) => {
        const label = createElement('label', 'time-option');
        label.dataset.available = String(slot.available);
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'time';
        input.value = String(slot.startMinute);
        input.checked = slot.startMinute === state.draft.startMinute;
        input.disabled = !slot.available;
        input.setAttribute('aria-label', `${formatSlot(slot.startMinute, slot.endMinute)}${slot.available ? '' : ', indisponível'}`);

        const slotLabel = createElement('span', 'mono', formatSlot(slot.startMinute, slot.endMinute));
        label.append(input, slotLabel);
        return label;
    }));
}

function createSummary({ includeActions = false } = {}) {
    const summary = createElement('dl', 'summary-list');
    const service = getService();
    const professional = getProfessional();
    const slot = getSelectedSlot();
    const rows = [
        ['Serviço', service ? service.label : 'Não escolhido', 'service'],
        ['Profissional', professional ? professional.label : 'Não escolhido', 'professional'],
        ['Data', state.draft.date ? formatDate(state.draft.date) : 'Não escolhida', 'date'],
        ['Horário', slot ? formatSlot(slot.startMinute, slot.endMinute) : 'Não escolhido', 'time'],
        ['Duração', service ? `${service.durationMinutes} min` : 'A definir', null],
        ['Preço', service ? formatPrice(service.price) : 'A definir', null],
    ];

    rows.forEach(([term, description, phase]) => {
        const row = createElement('div', 'summary-list__row');
        const dt = createElement('dt', null, term);
        const dd = createElement('dd');
        const value = createElement('span', phase === 'time' || phase === 'duration' || phase === 'price' ? 'mono' : null, description);
        dd.append(value);

        if (includeActions && phase && phaseIndex(phase) < phaseIndex('review')) {
            const edit = createElement('button', 'summary-edit', 'Editar');
            edit.type = 'button';
            edit.dataset.action = 'edit-phase';
            edit.dataset.phase = phase;
            edit.setAttribute('aria-label', `Editar ${term.toLowerCase()}`);
            dd.append(edit);
        }

        row.append(dt, dd);
        summary.append(row);
    });

    if (!state.persistenceAvailable) {
        summary.append(createElement('p', 'summary-warning', 'O armazenamento local não está disponível. O registro ficará apenas nesta sessão.'));
    }

    return summary;
}

function renderSummaries() {
    elements.desktopSummary.replaceChildren(createSummary());
    elements.mobileSummary.replaceChildren(createSummary());
    elements.reviewSummary.replaceChildren(createSummary({ includeActions: true }));
}

function renderConfirmation() {
    elements.confirmation.replaceChildren();
    const service = getService();
    const professional = getProfessional();
    const slot = getSelectedSlot();

    elements.confirmation.append(
        createElement('p', 'confirmation__eyebrow', 'Registro concluído'),
        createElement('h2', null, 'Seu pedido foi salvo neste navegador.'),
        createElement('p', null, 'Você pode consultar ou cancelar este registro no histórico local.'),
    );

    const details = createElement('dl', 'confirmation__details');
    [
        ['Serviço', service?.label || ''],
        ['Profissional', professional?.label || ''],
        ['Data', formatDate(state.draft.date)],
        ['Horário', slot ? formatSlot(slot.startMinute, slot.endMinute) : ''],
        ['Preço', service ? formatPrice(service.price) : ''],
    ].forEach(([term, value]) => {
        const row = createElement('div');
        row.append(createElement('dt', null, term), createElement('dd', null, value));
        details.append(row);
    });

    const actions = createElement('div', 'confirmation__actions');
    const history = createElement('a', 'button button--secondary', 'Ver registros locais');
    history.href = '#local-bookings';
    const newBooking = createElement('button', 'button button--primary', 'Fazer novo agendamento');
    newBooking.type = 'button';
    newBooking.dataset.action = 'new-booking';
    actions.append(history, newBooking);
    elements.confirmation.append(details, actions);
}

function renderBookingList() {
    elements.bookingList.replaceChildren();
    const sortedBookings = [...state.bookings].sort((a, b) => {
        const first = `${a.date}-${String(a.startMinute).padStart(4, '0')}`;
        const second = `${b.date}-${String(b.startMinute).padStart(4, '0')}`;
        return first.localeCompare(second);
    });

    elements.clearHistory.hidden = sortedBookings.length === 0;

    if (!sortedBookings.length) {
        const empty = createElement('div', 'empty-state');
        empty.append(createElement('h3', null, 'Nenhum registro local ainda.'), createElement('p', null, 'Conclua um agendamento demonstrativo para vê-lo aqui.'));
        elements.bookingList.append(empty);
        return;
    }

    elements.bookingList.append(...sortedBookings.map((booking) => {
        const article = createElement('article', 'booking-record');
        article.dataset.status = booking.status;
        const header = createElement('div', 'booking-record__header');
        header.append(
            createElement('p', 'booking-record__status', booking.status === 'active' ? 'Ativo' : 'Cancelado'),
            createElement('h3', null, booking.serviceLabel),
            createElement('p', null, `Com ${booking.professionalLabel}`),
        );

        const details = createElement('dl', 'booking-record__details');
        [
            ['Data', formatDate(booking.date)],
            ['Horário', formatSlot(booking.startMinute, booking.endMinute)],
            ['Cliente', booking.customer.name],
            ['Telefone', booking.customer.phone],
            ['Valor', booking.price ? formatPrice(booking.price) : 'A definir'],
        ].forEach(([term, value]) => {
            const row = createElement('div');
            row.append(createElement('dt', null, term), createElement('dd', null, value));
            details.append(row);
        });

        article.append(header, details);
        if (booking.status === 'active') {
            const cancel = createElement('button', 'button button--secondary booking-record__cancel', 'Cancelar registro');
            cancel.type = 'button';
            cancel.dataset.action = 'request-cancel';
            cancel.dataset.bookingId = booking.id;
            article.append(cancel);
        }
        return article;
    }));
}

function updatePhases({ focus = false } = {}) {
    elements.phases.forEach((phase) => {
        phase.hidden = phase.dataset.phase !== state.phase;
    });

    if (focus) {
        const currentTitle = document.querySelector(`#phase-${state.phase} h2`);
        if (currentTitle) window.setTimeout(() => currentTitle.focus({ preventScroll: true }), 0);
    }
}

function updateActions() {
    const isConfirmation = state.phase === 'confirmation';
    const isReview = state.phase === 'review';
    const phaseIsAdvancable = canAdvance(state.phase, state.draft);
    const label = isReview ? 'Confirmar registro local' : 'Continuar';

    elements.back.hidden = state.phase === 'service' || isConfirmation;
    elements.continue.hidden = isConfirmation;
    elements.continue.disabled = !phaseIsAdvancable;
    elements.continue.textContent = label;

    elements.mobileContinue.hidden = isConfirmation;
    elements.mobileContinue.disabled = !phaseIsAdvancable;
    elements.mobileContinue.textContent = label;
    elements.mobileSummaryTrigger.hidden = isConfirmation;
}

function render({ focus = false } = {}) {
    if (state.draft.date) elements.date.value = state.draft.date;
    else elements.date.value = '';
    elements.date.min = toLocalDateInputValue();

    renderServices();
    renderProfessionals();
    renderTimes();
    renderSummaries();
    renderBookingList();
    if (state.phase === 'confirmation') renderConfirmation();
    updateStepper();
    updatePhases({ focus });
    updateActions();
}

function changePhase(nextPhase, options = {}) {
    if (!PHASES.includes(nextPhase)) return;
    state.phase = nextPhase;
    render({ focus: options.focus ?? true });

    const label = nextPhase === 'confirmation' ? 'Registro concluído.' : `Etapa atual: ${STEP_LABELS[nextPhase] || 'confirmação'}.`;
    announce(label);
}

function invalidateTime() {
    state.draft.startMinute = null;
}

function handleFormChange(event) {
    const { target } = event;
    if (!(target instanceof HTMLInputElement)) return;

    if (target.name === 'service') {
        if (state.draft.serviceId !== target.value) {
            state.draft.serviceId = target.value;
            invalidateTime();
        }
    }

    if (target.name === 'professional') {
        if (state.draft.professionalId !== target.value) {
            state.draft.professionalId = target.value;
            invalidateTime();
        }
    }

    if (target.name === 'appointmentDate') {
        if (state.draft.date !== target.value) {
            state.draft.date = target.value;
            invalidateTime();
        }
    }

    if (target.name === 'time') {
        state.draft.startMinute = Number(target.value);
    }

    render();
}

function handleFormInput(event) {
    const { target } = event;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
    if (!Object.hasOwn(state.draft.customer, target.name)) return;

    state.draft.customer[target.name] = target.value;
    target.setCustomValidity('');
    updateActions();
}

function validateCurrentPhase() {
    if (state.phase === 'details') {
        const fields = [...document.querySelectorAll('#phase-details input[required]')];
        const invalidField = fields.find((field) => !field.checkValidity());
        if (invalidField) {
            invalidField.reportValidity();
            invalidField.focus();
            announce('Preencha nome completo e telefone para continuar.');
            return false;
        }
    }

    if (state.phase === 'time' && !getSelectedSlot()) {
        announce('Escolha um horário disponível para continuar.');
        return false;
    }

    return canAdvance(state.phase, state.draft);
}

function moveForward() {
    if (!validateCurrentPhase()) {
        updateActions();
        return;
    }

    if (state.phase === 'review') {
        confirmBooking();
        return;
    }

    const next = PHASES[phaseIndex() + 1];
    changePhase(next);
}

function moveBackward() {
    const prior = PHASES[phaseIndex() - 1];
    if (prior) changePhase(prior);
}

function editPhase(phase) {
    if (!STEP_LABELS[phase]) return;
    changePhase(phase);
    if (elements.summaryDialog.open) elements.summaryDialog.close();
}

function createBooking() {
    const service = getService();
    const professional = getProfessional();
    const selectedSlot = getSelectedSlot();
    if (!service || !professional || !selectedSlot) return null;

    return {
        version: BOOKING_VERSION,
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        status: 'active',
        serviceId: service.id,
        serviceLabel: service.label,
        durationMinutes: service.durationMinutes,
        price: service.price,
        professionalId: professional.id,
        professionalLabel: professional.label,
        date: state.draft.date,
        startMinute: selectedSlot.startMinute,
        endMinute: selectedSlot.endMinute,
        customer: { ...state.draft.customer },
        createdAt: new Date().toISOString(),
    };
}

function confirmBooking() {
    const slotStillAvailable = getSlots().find((slot) => (
        slot.startMinute === state.draft.startMinute && slot.available
    ));

    if (!slotStillAvailable || !canAdvance('review', state.draft)) {
        announce('Este horário não está mais disponível. Escolha outro horário.');
        changePhase('time');
        return;
    }

    const booking = createBooking();
    if (!booking) return;

    elements.continue.disabled = true;
    elements.mobileContinue.disabled = true;
    state.bookings.push(booking);
    const saved = persistBookings();
    state.phase = 'confirmation';
    render({ focus: true });
    announce(saved ? 'Registro salvo neste navegador.' : 'Registro concluído apenas para esta sessão.');
}

function startNewBooking() {
    state.draft = createEmptyDraft();
    state.phase = 'service';
    render({ focus: true });
    announce('Novo agendamento iniciado.');
}

function requestCancellation(bookingId) {
    state.pendingCancellationId = bookingId;
    elements.cancelDialog.showModal();
}

function confirmCancellation() {
    const booking = state.bookings.find((item) => item.id === state.pendingCancellationId);
    if (!booking) return;

    booking.status = 'cancelled';
    booking.cancelledAt = new Date().toISOString();
    persistBookings();
    state.pendingCancellationId = null;
    elements.cancelDialog.close();
    render();
    announce('Registro cancelado. O horário foi liberado nesta demonstração local.');
}

function clearHistory() {
    state.bookings = [];
    persistBookings();
    elements.clearDialog.close();
    render();
    announce('Histórico local removido.');
}

function handleClick(event) {
    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) return;

    const { action } = actionElement.dataset;
    if (action === 'close-summary') elements.summaryDialog.close();
    if (action === 'edit-phase') editPhase(actionElement.dataset.phase);
    if (action === 'new-booking') startNewBooking();
    if (action === 'request-cancel') requestCancellation(actionElement.dataset.bookingId);
}

function bindEvents() {
    elements.form.addEventListener('change', handleFormChange);
    elements.form.addEventListener('input', handleFormInput);
    document.addEventListener('click', handleClick);
    elements.continue.addEventListener('click', moveForward);
    elements.mobileContinue.addEventListener('click', moveForward);
    elements.back.addEventListener('click', moveBackward);
    elements.mobileSummaryTrigger.addEventListener('click', () => elements.summaryDialog.showModal());
    elements.confirmCancel.addEventListener('click', confirmCancellation);
    elements.clearHistory.addEventListener('click', () => elements.clearDialog.showModal());
    elements.confirmClear.addEventListener('click', clearHistory);

    window.addEventListener('storage', (event) => {
        if (event.key !== STORAGE_KEY) return;
        const stored = loadBookings();
        state.bookings = stored.bookings;
        state.persistenceAvailable = stored.available;
        if (state.phase === 'time' && state.draft.startMinute !== null && !getSelectedSlot()) {
            invalidateTime();
            announce('A disponibilidade mudou em outra aba. Escolha outro horário.');
        }
        render();
    });
}

bindEvents();
render();

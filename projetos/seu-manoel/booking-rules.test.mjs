// Testes das regras de agendamento da demo Seu Manoel.
// Executa com: node --test projetos/seu-manoel/booking-rules.test.mjs
//
// Cobre a logica pura: leitura de hora, validacao de data local, deteccao de
// sobreposicao de intervalos e calculo de horarios disponiveis.

import test from 'node:test';
import assert from 'node:assert/strict';

import {
    BOOKING_VERSION,
    toMinutes,
    formatTime,
    formatSlot,
    parseLocalDate,
    toLocalDateInputValue,
    getWeekday,
    intervalsOverlap,
    isBookingActive,
    isBookingRecord,
    normalizeBookings,
    getAvailableSlots,
    canAdvance,
} from './booking-rules.mjs';

test('toMinutes converte hora no formato HH:MM', () => {
    assert.equal(toMinutes('09:30'), 9 * 60 + 30);
    assert.equal(toMinutes('00:00'), 0);
    assert.equal(toMinutes('23:59'), 23 * 60 + 59);
});

test('toMinutes aceita numero inteiro e rejeita o resto', () => {
    assert.equal(toMinutes(540), 540);
    assert.equal(toMinutes('9:30'), null, 'hora sem zero a esquerda e invalida');
    assert.equal(toMinutes('24:00'), null);
    assert.equal(toMinutes('12:60'), null);
    assert.equal(toMinutes('12'), null);
    assert.equal(toMinutes(null), null);
    assert.equal(toMinutes(undefined), null);
    assert.equal(toMinutes({}), null);
});

test('formatTime devolve vazio fora da faixa do dia', () => {
    assert.equal(formatTime(0), '00:00');
    assert.equal(formatTime(9 * 60 + 5), '09:05');
    assert.equal(formatTime(1439), '23:59');
    assert.equal(formatTime(1440), '');
    assert.equal(formatTime(-1), '');
    assert.equal(formatTime(1.5), '');
});

test('formatSlot monta o intervalo', () => {
    assert.equal(formatSlot(540, 600), '09:00 - 10:00');
});

test('parseLocalDate aceita data valida', () => {
    const data = parseLocalDate('2026-03-15');
    assert.ok(data instanceof Date);
    assert.equal(data.getFullYear(), 2026);
    assert.equal(data.getMonth(), 2);
    assert.equal(data.getDate(), 15);
});

test('parseLocalDate rejeita data inexistente e formato errado', () => {
    assert.equal(parseLocalDate('2026-02-30'), null, '30 de fevereiro nao existe');
    assert.equal(parseLocalDate('2026-13-01'), null);
    assert.equal(parseLocalDate('2026-00-10'), null);
    assert.equal(parseLocalDate('15/03/2026'), null);
    assert.equal(parseLocalDate(''), null);
    assert.equal(parseLocalDate(null), null);
});

test('toLocalDateInputValue formata no padrao do input de data', () => {
    assert.equal(toLocalDateInputValue(new Date(2026, 2, 5)), '2026-03-05');
    assert.equal(toLocalDateInputValue(new Date(2026, 11, 31)), '2026-12-31');
});

test('getWeekday devolve o dia da semana', () => {
    assert.equal(getWeekday('2026-03-15'), 0, '15/03/2026 e domingo');
    assert.equal(getWeekday('2026-03-16'), 1);
    assert.equal(getWeekday('data invalida'), null);
});

test('intervalsOverlap detecta sobreposicao nos dois sentidos', () => {
    assert.equal(intervalsOverlap(540, 600, 570, 630), true, 'parcialmente sobrepostos');
    assert.equal(intervalsOverlap(570, 630, 540, 600), true);
    assert.equal(intervalsOverlap(540, 600, 600, 660), false, 'encostam sem sobrepor');
    assert.equal(intervalsOverlap(540, 600, 610, 670), false, 'separados');
    assert.equal(intervalsOverlap(540, 600, 480, 540), false, 'encostam pela esquerda');
});

test('isBookingActive considerapenas o status active', () => {
    assert.equal(isBookingActive({ status: 'active' }), true);
    assert.equal(isBookingActive({ status: 'cancelled' }), false);
    assert.equal(isBookingActive({}), false);
    assert.equal(isBookingActive(null), false);
});

test('isBookingRecord exige a estrutura completa do agendamento', () => {
    const valido = {
        version: BOOKING_VERSION,
        id: 'b1',
        serviceId: 's1',
        serviceLabel: 'Corte',
        professionalId: 'p1',
        professionalLabel: 'Ana',
        date: '2026-03-15',
        startMinute: 540,
        endMinute: 600,
        durationMinutes: 60,
        status: 'active',
        customer: { name: 'Cliente', phone: '31999999999' },
    };
    assert.equal(isBookingRecord(valido), true);

    assert.equal(isBookingRecord({ ...valido, version: 99 }), false, 'versao desconhecida');
    assert.equal(isBookingRecord({ ...valido, endMinute: 540 }), false, 'fim deve ser maior que o inicio');
    assert.equal(isBookingRecord({ ...valido, durationMinutes: 0 }), false);
    assert.equal(isBookingRecord({ ...valido, status: 'outro' }), false);
    assert.equal(isBookingRecord({ ...valido, customer: { name: 'Cliente' } }), false, 'telefone obrigatorio');
    assert.equal(isBookingRecord({ ...valido, date: '15/03/2026' }), false);
    assert.equal(isBookingRecord(null), false);
    assert.equal(isBookingRecord('nao e objeto'), false);
});

test('normalizeBookings descarta o que nao tem a estrutura valida', () => {
    const valido = {
        version: BOOKING_VERSION,
        id: 'b1',
        serviceId: 's1',
        serviceLabel: 'Corte',
        professionalId: 'p1',
        professionalLabel: 'Ana',
        date: '2026-03-15',
        startMinute: 540,
        endMinute: 600,
        durationMinutes: 60,
        status: 'active',
        customer: { name: 'Cliente', phone: '31999999999' },
    };
    const resultado = normalizeBookings([valido, { id: 'invalido' }, null, 'texto']);
    assert.equal(resultado.length, 1);
    assert.equal(resultado[0].id, 'b1');
    assert.deepEqual(normalizeBookings(null), []);
});

test('getAvailableSlots respeita janela, duracao e intervalo', () => {
    const slots = getAvailableSlots({
        date: '2026-03-15',
        durationMinutes: 60,
        windows: [{ startMinute: 540, endMinute: 720 }],
        bookings: [],
        professionalId: 'p1',
        intervalMinutes: 30,
        now: new Date(2026, 2, 1),
    });
    // De 09:00 a 12:00, com passo de 30 min e duracao de 1 hora:
    // 09:00, 09:30, 10:00, 10:30 e 11:00 cabem; 11:30 nao, pois acabaria 12:30.
    assert.equal(slots.length, 5);
    assert.deepEqual(slots.map((s) => s.startMinute), [540, 570, 600, 630, 660]);
    assert.equal(slots[0].available, true);
});

test('getAvailableSlots bloqueia o horario ja reservado', () => {
    const base = {
        version: BOOKING_VERSION,
        id: 'b1',
        serviceId: 's1',
        serviceLabel: 'Corte',
        professionalId: 'p1',
        professionalLabel: 'Ana',
        date: '2026-03-15',
        startMinute: 570,
        endMinute: 630,
        durationMinutes: 60,
        status: 'active',
        customer: { name: 'Cliente', phone: '31999999999' },
    };
    const slots = getAvailableSlots({
        date: '2026-03-15',
        durationMinutes: 60,
        windows: [{ startMinute: 540, endMinute: 720 }],
        bookings: [base],
        professionalId: 'p1',
        intervalMinutes: 30,
        now: new Date(2026, 2, 1),
    });
    const indisponiveis = slots.filter((s) => !s.available).map((s) => s.startMinute);
    assert.deepEqual(indisponiveis, [540, 570, 600], '09:00, 09:30 e 10:00 conflitam com a reserva das 09:30');
});

test('getAvailableSlots ignora reserva de outro profissional e reserva cancelada', () => {
    const base = {
        version: BOOKING_VERSION,
        id: 'b1',
        serviceId: 's1',
        serviceLabel: 'Corte',
        professionalId: 'p1',
        professionalLabel: 'Ana',
        date: '2026-03-15',
        startMinute: 570,
        endMinute: 630,
        durationMinutes: 60,
        status: 'active',
        customer: { name: 'Cliente', phone: '31999999999' },
    };
    const outro = getAvailableSlots({
        date: '2026-03-15',
        durationMinutes: 60,
        windows: [{ startMinute: 540, endMinute: 720 }],
        bookings: [{ ...base, professionalId: 'p2' }],
        professionalId: 'p1',
        intervalMinutes: 30,
        now: new Date(2026, 2, 1),
    });
    assert.equal(outro.every((s) => s.available), true, 'reserva de outro profissional nao bloqueia');

    const cancelado = getAvailableSlots({
        date: '2026-03-15',
        durationMinutes: 60,
        windows: [{ startMinute: 540, endMinute: 720 }],
        bookings: [{ ...base, status: 'cancelled' }],
        professionalId: 'p1',
        intervalMinutes: 30,
        now: new Date(2026, 2, 1),
    });
    assert.equal(cancelado.every((s) => s.available), true, 'reserva cancelada nao bloqueia');
});

test('getAvailableSlots nao oferece horario anterior ao agora no dia de hoje', () => {
    const slots = getAvailableSlots({
        date: '2026-03-15',
        durationMinutes: 60,
        windows: [{ startMinute: 540, endMinute: 720 }],
        bookings: [],
        professionalId: 'p1',
        intervalMinutes: 30,
        now: new Date(2026, 2, 15, 10, 30),
    });
    const passados = slots.filter((s) => !s.available).map((s) => s.startMinute);
    assert.deepEqual(passados, [540, 570, 600, 630], 'ate 10:30 ja passou');
});

test('getAvailableSlots ignora o passado em dias diferentes', () => {
    const slots = getAvailableSlots({
        date: '2026-03-16',
        durationMinutes: 60,
        windows: [{ startMinute: 540, endMinute: 720 }],
        bookings: [],
        professionalId: 'p1',
        intervalMinutes: 30,
        now: new Date(2026, 2, 15, 23, 0),
    });
    assert.equal(slots.every((s) => s.available), true, 'amanha ainda nao passou');
});

test('getAvailableSlots devolve lista vazia com entrada invalida', () => {
    const base = { date: '2026-03-15', durationMinutes: 60, windows: [{ startMinute: 540, endMinute: 720 }], bookings: [], professionalId: 'p1' };
    assert.deepEqual(getAvailableSlots({ ...base, date: 'invalida' }), []);
    assert.deepEqual(getAvailableSlots({ ...base, durationMinutes: 0 }), []);
    assert.deepEqual(getAvailableSlots({ ...base, windows: [] }), []);
    assert.deepEqual(getAvailableSlots({ ...base, durationMinutes: '60' }), []);
});

test('canAdvance percorre as etapas do formulario', () => {
    const completo = {
        serviceId: 's1',
        professionalId: 'p1',
        date: '2026-03-15',
        startMinute: 540,
        customer: { name: 'Cliente', phone: '31999999999' },
    };
    assert.equal(canAdvance('service', completo), true);
    assert.equal(canAdvance('professional', completo), true);
    assert.equal(canAdvance('date', completo), true);
    assert.equal(canAdvance('time', completo), true);
    assert.equal(canAdvance('details', completo), true);
    assert.equal(canAdvance('review', completo), true);
});

test('canAdvance bloqueia quando o campo da etapa falta', () => {
    const vazio = {};
    assert.equal(canAdvance('service', vazio), false);
    assert.equal(canAdvance('professional', vazio), false);
    assert.equal(canAdvance('date', vazio), false);
    assert.equal(canAdvance('time', vazio), false);
    assert.equal(canAdvance('details', vazio), false);
    assert.equal(canAdvance('review', vazio), false);
    assert.equal(canAdvance('etapa-inexistente', vazio), false);
});

test('canAdvance exige data valida e nome com conteudo', () => {
    const base = {
        serviceId: 's1',
        professionalId: 'p1',
        date: '2026-03-15',
        startMinute: 540,
        customer: { name: 'Cliente', phone: '31999999999' },
    };
    assert.equal(canAdvance('date', { ...base, date: '2026-02-30' }), false);
    assert.equal(canAdvance('details', { ...base, customer: { name: '   ', phone: '31999999999' } }), false);
    assert.equal(canAdvance('time', { ...base, startMinute: 0 }), true, 'meia-noite e um horario valido');
    assert.equal(canAdvance('time', { ...base, startMinute: 540.5 }), false, 'minuto fracionario e invalido');
    assert.equal(canAdvance('time', { ...base, startMinute: '540' }), false, 'texto no lugar de numero e invalido');
});

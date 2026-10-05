import test from 'node:test';
import assert from 'node:assert/strict';
import {
    BOOKING_VERSION,
    canAdvance,
    formatSlot,
    getAvailableSlots,
    intervalsOverlap,
    normalizeBookings,
    parseLocalDate,
    toLocalDateInputValue,
    toMinutes,
} from '../booking-rules.mjs';

const weekdayWindows = [{ startMinute: 540, endMinute: 720 }, { startMinute: 840, endMinute: 1080 }];
const date = '2030-01-07';

function booking({
    id = 'booking-1',
    professionalId = 'alex',
    startMinute = 540,
    endMinute = 570,
    status = 'active',
} = {}) {
    return {
        version: BOOKING_VERSION,
        id,
        status,
        serviceId: 'corte-30',
        serviceLabel: 'Corte',
        durationMinutes: endMinute - startMinute,
        price: 45,
        professionalId,
        professionalLabel: professionalId,
        date,
        startMinute,
        endMinute,
        customer: { name: 'Teste', phone: '11999999999', email: '', notes: '' },
        createdAt: '2030-01-01T00:00:00.000Z',
    };
}

function slots(overrides = {}) {
    return getAvailableSlots({
        date,
        durationMinutes: 30,
        windows: weekdayWindows,
        bookings: [],
        professionalId: 'alex',
        intervalMinutes: 30,
        now: new Date(2030, 0, 1, 9, 0),
        ...overrides,
    });
}

test('converte horários e mantém datas locais válidas', () => {
    assert.equal(toMinutes('09:30'), 570);
    assert.equal(toMinutes('24:00'), null);
    assert.equal(parseLocalDate('2030-02-29'), null);
    assert.equal(toLocalDateInputValue(new Date(2030, 0, 7)), '2030-01-07');
    assert.equal(formatSlot(540, 570), '09:00 - 09:30');
});

test('detecta interseção e permite horários adjacentes', () => {
    assert.equal(intervalsOverlap(540, 600, 570, 630), true);
    assert.equal(intervalsOverlap(540, 600, 600, 630), false);
});

test('não oferece horários que cruzam pausas ou o término de uma janela', () => {
    const available = slots({ durationMinutes: 60 });
    assert.deepEqual(
        available.map((slot) => [slot.startMinute, slot.endMinute]),
        [[540, 600], [570, 630], [600, 660], [630, 690], [660, 720], [840, 900], [870, 930], [900, 960], [930, 990], [960, 1020], [990, 1050], [1020, 1080]],
    );
    assert.equal(available.some((slot) => slot.startMinute === 690), false);
    assert.equal(available.some((slot) => slot.startMinute === 1050), false);
});

test('bloqueia qualquer intervalo que sobreponha uma reserva ativa do mesmo profissional', () => {
    const available = slots({
        durationMinutes: 60,
        bookings: [booking({ startMinute: 570, endMinute: 630 })],
    });

    assert.equal(available.find((slot) => slot.startMinute === 540).available, false);
    assert.equal(available.find((slot) => slot.startMinute === 570).available, false);
    assert.equal(available.find((slot) => slot.startMinute === 600).available, false);
    assert.equal(available.find((slot) => slot.startMinute === 630).available, true);
});

test('permite o mesmo intervalo para outro profissional e libera registros cancelados', () => {
    const otherProfessional = slots({
        bookings: [booking({ professionalId: 'bia', startMinute: 540, endMinute: 570 })],
    });
    const cancelled = slots({
        bookings: [booking({ status: 'cancelled', startMinute: 540, endMinute: 570 })],
    });

    assert.equal(otherProfessional.find((slot) => slot.startMinute === 540).available, true);
    assert.equal(cancelled.find((slot) => slot.startMinute === 540).available, true);
});

test('não apresenta horários passados na data atual', () => {
    const sameDay = '2030-01-07';
    const available = getAvailableSlots({
        date: sameDay,
        durationMinutes: 30,
        windows: [{ startMinute: 540, endMinute: 660 }],
        bookings: [],
        professionalId: 'alex',
        intervalMinutes: 30,
        now: new Date(2030, 0, 7, 9, 31),
    });

    assert.equal(available.find((slot) => slot.startMinute === 540).available, false);
    assert.equal(available.find((slot) => slot.startMinute === 570).available, false);
    assert.equal(available.find((slot) => slot.startMinute === 600).available, true);
});

test('ignora dados persistidos inválidos', () => {
    const valid = booking();
    const invalid = { id: 'sem-schema' };
    assert.deepEqual(normalizeBookings([valid, invalid]), [valid]);
    assert.deepEqual(normalizeBookings({}), []);
});

test('cada fase exige apenas seus dados e revisão exige o pedido completo', () => {
    const draft = {
        serviceId: 'corte-30',
        professionalId: 'alex',
        date,
        startMinute: 540,
        customer: { name: 'Teste', phone: '11999999999', email: '', notes: '' },
    };

    assert.equal(canAdvance('service', draft), true);
    assert.equal(canAdvance('professional', draft), true);
    assert.equal(canAdvance('date', draft), true);
    assert.equal(canAdvance('time', draft), true);
    assert.equal(canAdvance('details', draft), true);
    assert.equal(canAdvance('review', draft), true);
    assert.equal(canAdvance('review', { ...draft, customer: { ...draft.customer, phone: '' } }), false);
});

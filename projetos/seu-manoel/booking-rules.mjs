export const BOOKING_VERSION = 2;

export function toMinutes(value) {
    if (typeof value === 'number' && Number.isInteger(value)) return value;
    if (typeof value !== 'string' || !/^\d{2}:\d{2}$/.test(value)) return null;

    const [hour, minute] = value.split(':').map(Number);
    if (hour > 23 || minute > 59) return null;
    return (hour * 60) + minute;
}

export function formatTime(minutes) {
    if (!Number.isInteger(minutes) || minutes < 0 || minutes >= 1440) return '';
    const hour = Math.floor(minutes / 60).toString().padStart(2, '0');
    const minute = (minutes % 60).toString().padStart(2, '0');
    return `${hour}:${minute}`;
}

export function formatSlot(startMinute, endMinute) {
    return `${formatTime(startMinute)} - ${formatTime(endMinute)}`;
}

export function parseLocalDate(dateString) {
    if (typeof dateString !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    return date;
}

export function toLocalDateInputValue(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function getWeekday(dateString) {
    const date = parseLocalDate(dateString);
    return date ? date.getDay() : null;
}

export function intervalsOverlap(startA, endA, startB, endB) {
    return startA < endB && startB < endA;
}

export function isBookingActive(booking) {
    return booking?.status === 'active';
}

export function isBookingRecord(value) {
    return Boolean(
        value
        && value.version === BOOKING_VERSION
        && typeof value.id === 'string'
        && typeof value.serviceId === 'string'
        && typeof value.serviceLabel === 'string'
        && typeof value.professionalId === 'string'
        && typeof value.professionalLabel === 'string'
        && typeof value.date === 'string'
        && Number.isInteger(value.startMinute)
        && Number.isInteger(value.endMinute)
        && value.endMinute > value.startMinute
        && Number.isInteger(value.durationMinutes)
        && value.durationMinutes > 0
        && ['active', 'cancelled'].includes(value.status)
        && value.customer
        && typeof value.customer.name === 'string'
        && typeof value.customer.phone === 'string'
    );
}

export function normalizeBookings(value) {
    if (!Array.isArray(value)) return [];
    return value.filter(isBookingRecord);
}

function isPastSlot(dateString, startMinute, now) {
    const selectedDate = parseLocalDate(dateString);
    if (!selectedDate || !now) return false;

    const selectedDay = toLocalDateInputValue(selectedDate);
    const today = toLocalDateInputValue(now);
    if (selectedDay !== today) return false;

    return startMinute <= ((now.getHours() * 60) + now.getMinutes());
}

export function getAvailableSlots({
    date,
    durationMinutes,
    windows,
    bookings,
    professionalId,
    intervalMinutes = 30,
    now = new Date(),
}) {
    if (!parseLocalDate(date) || !Number.isInteger(durationMinutes) || durationMinutes <= 0) return [];
    if (!Array.isArray(windows) || !Number.isInteger(intervalMinutes) || intervalMinutes <= 0) return [];

    const relevantBookings = normalizeBookings(bookings).filter((booking) => (
        isBookingActive(booking)
        && booking.date === date
        && booking.professionalId === professionalId
    ));

    return windows.flatMap((window) => {
        if (!Number.isInteger(window?.startMinute) || !Number.isInteger(window?.endMinute)) return [];

        const slots = [];
        for (let startMinute = window.startMinute; startMinute + durationMinutes <= window.endMinute; startMinute += intervalMinutes) {
            const endMinute = startMinute + durationMinutes;
            const hasConflict = relevantBookings.some((booking) => (
                intervalsOverlap(startMinute, endMinute, booking.startMinute, booking.endMinute)
            ));

            slots.push({
                startMinute,
                endMinute,
                available: !hasConflict && !isPastSlot(date, startMinute, now),
            });
        }
        return slots;
    });
}

export function canAdvance(phase, draft) {
    const customer = draft?.customer || {};

    switch (phase) {
    case 'service':
        return Boolean(draft?.serviceId);
    case 'professional':
        return Boolean(draft?.professionalId);
    case 'date':
        return Boolean(parseLocalDate(draft?.date));
    case 'time':
        return Number.isInteger(draft?.startMinute);
    case 'details':
        return Boolean(customer.name?.trim() && customer.phone?.trim());
    case 'review':
        return Boolean(
            draft?.serviceId
            && draft?.professionalId
            && parseLocalDate(draft?.date)
            && Number.isInteger(draft?.startMinute)
            && customer.name?.trim()
            && customer.phone?.trim()
        );
    default:
        return false;
    }
}

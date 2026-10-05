export const ticketStatuses = [
    'open',
    'in_progress',
    'waiting_requester',
    'resolved',
    'closed',
    'cancelled',
];
export const ticketPriorities = ['critical', 'high', 'medium', 'low'];
export const commentVisibilities = ['public', 'internal'];
export const ticketEventTypes = [
    'created',
    'assigned',
    'status_changed',
    'priority_changed',
    'commented',
    'resolved',
    'closed',
    'reopened',
    'sla_breached',
];
export const notificationTypes = [
    'ticket_assigned',
    'ticket_reassigned',
    'ticket_status_changed',
    'ticket_priority_changed',
    'ticket_comment_public',
    'ticket_comment_internal',
    'ticket_resolved',
    'ticket_reopened',
    'ticket_closed',
    'ticket_sla_breached',
];
export const slaClockStatuses = ['pending', 'at_risk', 'met', 'breached'];
export const slaPolicyPriorities = ticketPriorities;
export const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];

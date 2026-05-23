// mock/enquiries.js
// Realistic mock data structured as API responses would look.
// Field names match the backend schema exactly.

export const enquiries = [
  {
    id: "enq_001",
    customer_name: "Sarah M.",
    channel: "whatsapp",
    status: "escalated",
    sop_matched: "complaint",
    escalation_reason: "Customer is unhappy with the quote and requested a manager.",
    suggested_response: "We're sorry to hear you've had a less-than-perfect experience. A senior team member will reach out shortly.",
    created_at: "2025-05-20T09:14:00Z",
    updated_at: "2025-05-20T09:16:00Z",
    messages: [
      { id: "msg_001a", sender: "customer", content: "Hi, I'm very unhappy with the quote you sent. It's way too expensive and I want to speak to a manager.", created_at: "2025-05-20T09:14:00Z" },
      { id: "msg_001b", sender: "system",   content: "We're sorry to hear you've had a less-than-perfect experience. A senior team member will reach out shortly.", created_at: "2025-05-20T09:14:10Z" },
    ],
    events: [
      { id: "ev_001a", event_type: "enquiry_created",      detail: "Channel: whatsapp",                        created_at: "2025-05-20T09:14:00Z" },
      { id: "ev_001b", event_type: "processing_started",   detail: null,                                       created_at: "2025-05-20T09:14:02Z" },
      { id: "ev_001c", event_type: "sop_matched",          detail: "Matched SOP: complaint",                   created_at: "2025-05-20T09:14:05Z" },
      { id: "ev_001d", event_type: "escalation_triggered", detail: "Customer requested to speak with manager.", created_at: "2025-05-20T09:16:00Z" },
    ],
    followups: [],
  },
  {
    id: "enq_002",
    customer_name: "Ravi K.",
    channel: "email",
    status: "sop_matched",
    sop_matched: "pricing",
    escalation_reason: null,
    suggested_response: "Thanks for your interest! Our pricing depends on your specific requirements. A member of our team will send you a detailed quote within 24 hours.",
    created_at: "2025-05-20T10:05:00Z",
    updated_at: "2025-05-20T10:05:30Z",
    messages: [
      { id: "msg_002a", sender: "customer", content: "Hello, could you send me your pricing and packages? What is the cost for the premium plan?", created_at: "2025-05-20T10:05:00Z" },
      { id: "msg_002b", sender: "system",   content: "Thanks for your interest! Our pricing depends on your specific requirements. A member of our team will send you a detailed quote within 24 hours.", created_at: "2025-05-20T10:05:30Z" },
    ],
    events: [
      { id: "ev_002a", event_type: "enquiry_created",    detail: "Channel: email",           created_at: "2025-05-20T10:05:00Z" },
      { id: "ev_002b", event_type: "processing_started", detail: null,                       created_at: "2025-05-20T10:05:05Z" },
      { id: "ev_002c", event_type: "sop_matched",        detail: "Matched SOP: pricing",     created_at: "2025-05-20T10:05:30Z" },
    ],
    followups: [
      { id: "fu_002a", enquiry_id: "enq_002", delay_minutes: 60, message_template: "Hi {customer_name}, just following up on your pricing enquiry!", scheduled_at: "2025-05-20T11:05:00Z", created_at: "2025-05-20T10:10:00Z" },
    ],
  },
  {
    id: "enq_003",
    customer_name: "Priya S.",
    channel: "call",
    status: "sop_matched",
    sop_matched: "booking",
    escalation_reason: null,
    suggested_response: "Thank you for reaching out! We'd be happy to help you book an appointment. Please share your preferred date and time.",
    created_at: "2025-05-20T11:22:00Z",
    updated_at: "2025-05-20T11:22:45Z",
    messages: [
      { id: "msg_003a", sender: "customer", content: "I'd like to book an appointment for next Monday morning, if possible.", created_at: "2025-05-20T11:22:00Z" },
      { id: "msg_003b", sender: "system",   content: "Thank you for reaching out! We'd be happy to help you book an appointment. Please share your preferred date and time.", created_at: "2025-05-20T11:22:45Z" },
    ],
    events: [
      { id: "ev_003a", event_type: "enquiry_created",    detail: "Channel: call",        created_at: "2025-05-20T11:22:00Z" },
      { id: "ev_003b", event_type: "processing_started", detail: null,                   created_at: "2025-05-20T11:22:05Z" },
      { id: "ev_003c", event_type: "sop_matched",        detail: "Matched SOP: booking", created_at: "2025-05-20T11:22:45Z" },
      { id: "ev_003d", event_type: "followup_scheduled", detail: "Scheduled in 30 minute(s).", created_at: "2025-05-20T11:23:00Z" },
    ],
    followups: [
      { id: "fu_003a", enquiry_id: "enq_003", delay_minutes: 30, message_template: "Hi {customer_name}, confirming your appointment request!", scheduled_at: "2025-05-20T11:52:00Z", created_at: "2025-05-20T11:23:00Z" },
    ],
  },
  {
    id: "enq_004",
    customer_name: "Arjun T.",
    channel: "whatsapp",
    status: "escalated",
    sop_matched: "unmatched",
    escalation_reason: "No SOP matched for inbound message. Flagged for human review.",
    suggested_response: null,
    created_at: "2025-05-20T12:30:00Z",
    updated_at: "2025-05-20T12:30:30Z",
    messages: [
      { id: "msg_004a", sender: "customer", content: "My transaction ID is 8847XZ and I need immediate assistance regarding the regulatory matter we discussed yesterday.", created_at: "2025-05-20T12:30:00Z" },
      { id: "msg_004b", sender: "system",   content: "This enquiry could not be matched to any standard operating procedure. It has been escalated to a human agent for review.", created_at: "2025-05-20T12:30:30Z" },
    ],
    events: [
      { id: "ev_004a", event_type: "enquiry_created",      detail: "Channel: whatsapp",                        created_at: "2025-05-20T12:30:00Z" },
      { id: "ev_004b", event_type: "processing_started",   detail: null,                                       created_at: "2025-05-20T12:30:05Z" },
      { id: "ev_004c", event_type: "escalation_triggered", detail: "Auto-escalated: no SOP keyword match found.", created_at: "2025-05-20T12:30:30Z" },
    ],
    followups: [],
  },
  {
    id: "enq_005",
    customer_name: "Meena R.",
    channel: "email",
    status: "pending",
    sop_matched: null,
    escalation_reason: null,
    suggested_response: null,
    created_at: "2025-05-20T13:45:00Z",
    updated_at: "2025-05-20T13:45:00Z",
    messages: [
      { id: "msg_005a", sender: "customer", content: "Hello, I need some information and support regarding your after-hours services on weekends.", created_at: "2025-05-20T13:45:00Z" },
    ],
    events: [
      { id: "ev_005a", event_type: "enquiry_created", detail: "Channel: email", created_at: "2025-05-20T13:45:00Z" },
    ],
    followups: [],
  },
];

export const getEscalations = () =>
  enquiries.filter(e => e.status === "escalated");

export const getFollowUps = () =>
  enquiries.flatMap(e =>
    e.followups.map(fu => ({ ...fu, customer_name: e.customer_name, channel: e.channel, enquiry_status: e.status }))
  );

export const dashboardStats = {
  total_leads_today: enquiries.length,
  missed_enquiries: enquiries.filter(e => e.status === "pending").length,
  open_escalations: enquiries.filter(e => e.status === "escalated").length,
  followups_due: getFollowUps().length,
};
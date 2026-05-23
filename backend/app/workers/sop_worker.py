"""
SOP (Standard Operating Procedure) matching engine.

Uses keyword-based matching against 5 defined SOPs.
No AI required — intentionally lightweight and explainable.
"""

from app.models.enquiry import SOPCategory

# ──────────────────────────────────────────────────────────────────────────────
# SOP definitions: each entry has keywords and a canned suggested response.
# ──────────────────────────────────────────────────────────────────────────────

SOPS: list[dict] = [
    {
        "category": SOPCategory.booking,
        "keywords": ["book", "appointment", "schedule", "reserve", "slot", "available", "availability", "visit"],
        "response": (
            "Thank you for reaching out! We'd be happy to help you book an appointment. "
            "Please share your preferred date and time, and we'll confirm availability shortly."
        ),
    },
    {
        "category": SOPCategory.pricing,
        "keywords": ["price", "pricing", "cost", "quote", "how much", "fee", "charge", "rate", "plan", "package"],
        "response": (
            "Thanks for your interest! Our pricing depends on your specific requirements. "
            "A member of our team will send you a detailed quote within 24 hours."
        ),
    },
    {
        "category": SOPCategory.complaint,
        "keywords": ["complaint", "unhappy", "dissatisfied", "problem", "issue", "wrong", "bad", "terrible", "refund", "angry", "upset"],
        "response": (
            "We're sorry to hear you've had a less-than-perfect experience. "
            "Your concern has been flagged and a senior team member will reach out to resolve this promptly."
        ),
    },
    {
        "category": SOPCategory.after_hours,
        "keywords": ["after hours", "after-hours", "closed", "weekend", "holiday", "out of office", "night", "midnight", "sunday", "saturday"],
        "response": (
            "Thank you for contacting us! We are currently outside our business hours. "
            "We'll get back to you first thing during our next working day."
        ),
    },
    {
        "category": SOPCategory.general,
        "keywords": ["help", "support", "info", "information", "inquiry", "enquiry", "question", "contact", "know more", "details"],
        "response": (
            "Thanks for getting in touch! One of our team members will review your message "
            "and respond with the information you need shortly."
        ),
    },
]


def match_sop(message: str) -> tuple[SOPCategory, str] | tuple[None, None]:
    """
    Match inbound message to an SOP by keyword presence.

    Returns (SOPCategory, suggested_response) on match,
    or (None, None) if no SOP matched → triggers escalation.
    """
    lower = message.lower()

    best_category: SOPCategory | None = None
    best_response: str | None = None
    best_score: int = 0

    for sop in SOPS:
        score = sum(1 for kw in sop["keywords"] if kw in lower)
        if score > best_score:
            best_score = score
            best_category = sop["category"]
            best_response = sop["response"]

    if best_score == 0:
        return None, None

    return best_category, best_response
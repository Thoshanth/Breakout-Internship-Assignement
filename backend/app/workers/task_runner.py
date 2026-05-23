"""
Background task: processes a newly created enquiry.

Steps:
  1. Update status → processing
  2. Run SOP matching
  3a. On match  → update record with SOP + suggested_response, status → sop_matched
  3b. No match  → escalate automatically, log the event
  4. Persist a Message row with the suggested response (or escalation note)
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.enquiry import Enquiry, EnquiryEvent, Message, EnquiryStatus, SOPCategory
from app.workers.sop_worker import match_sop
from app.db.database import AsyncSessionLocal
from app.core.logging import get_logger

logger = get_logger(__name__)


async def process_enquiry(enquiry_id: str) -> None:
    """Entry-point called by FastAPI BackgroundTasks."""
    async with AsyncSessionLocal() as db:
        try:
            await _process(db, enquiry_id)
        except Exception as exc:
            logger.error(
                "Background task failed",
                extra={"enquiry_id": enquiry_id, "error": str(exc)},
            )
            await db.rollback()
            raise


async def _process(db: AsyncSession, enquiry_id: str) -> None:
    result = await db.execute(select(Enquiry).where(Enquiry.id == enquiry_id))
    enquiry = result.scalar_one_or_none()

    if not enquiry:
        logger.warning("Enquiry not found in background task", extra={"enquiry_id": enquiry_id})
        return

    # ── 1. Mark as processing ─────────────────────────────────────────────────
    enquiry.status = EnquiryStatus.processing
    db.add(EnquiryEvent(enquiry_id=enquiry_id, event_type="processing_started"))
    await db.commit()
    logger.info("Enquiry processing started", extra={"enquiry_id": enquiry_id})

    # ── 2. SOP matching ───────────────────────────────────────────────────────
    sop_category, suggested_response = match_sop(enquiry.message)

    if sop_category:
        # ── 3a. Match found ───────────────────────────────────────────────────
        enquiry.status = EnquiryStatus.sop_matched
        enquiry.sop_matched = sop_category
        enquiry.suggested_response = suggested_response

        db.add(EnquiryEvent(
            enquiry_id=enquiry_id,
            event_type="sop_matched",
            detail=f"Matched SOP: {sop_category.value}",
        ))
        db.add(Message(
            enquiry_id=enquiry_id,
            sender="system",
            content=suggested_response,
        ))
        await db.commit()

        logger.info(
            "SOP matched",
            extra={"enquiry_id": enquiry_id, "sop": sop_category.value},
        )

    else:
        # ── 3b. No match → auto-escalate ──────────────────────────────────────
        enquiry.status = EnquiryStatus.escalated
        enquiry.sop_matched = SOPCategory.unmatched
        enquiry.escalation_reason = "No SOP matched for inbound message. Flagged for human review."

        db.add(EnquiryEvent(
            enquiry_id=enquiry_id,
            event_type="escalation_triggered",
            detail="Auto-escalated: no SOP keyword match found.",
        ))
        db.add(Message(
            enquiry_id=enquiry_id,
            sender="system",
            content=(
                "This enquiry could not be matched to any standard operating procedure. "
                "It has been escalated to a human agent for review."
            ),
        ))
        await db.commit()

        logger.warning(
            "Escalation triggered — no SOP match",
            extra={"enquiry_id": enquiry_id},
        )
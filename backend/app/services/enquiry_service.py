from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.enquiry import (
    Enquiry, EnquiryEvent, FollowUp, Message,
    EnquiryStatus, EnquiryChannel,
)
from app.schemas.enquiry import EnquiryCreate, FollowUpCreate, EscalateCreate
from app.core.logging import get_logger

logger = get_logger(__name__)


async def create_enquiry(db: AsyncSession, payload: EnquiryCreate) -> Enquiry:
    enquiry = Enquiry(
        channel=payload.channel,
        customer_name=payload.customer_name,
        message=payload.message,
        status=EnquiryStatus.pending,
    )
    db.add(enquiry)
    await db.flush()  # get ID before commit

    # Seed the conversation with the customer's opening message
    db.add(Message(
        enquiry_id=enquiry.id,
        sender="customer",
        content=payload.message,
    ))
    db.add(EnquiryEvent(
        enquiry_id=enquiry.id,
        event_type="enquiry_created",
        detail=f"Channel: {payload.channel.value}",
    ))

    await db.commit()
    await db.refresh(enquiry)

    logger.info(
        "Enquiry created",
        extra={"enquiry_id": enquiry.id, "channel": payload.channel.value},
    )
    return enquiry


async def get_enquiry_with_history(db: AsyncSession, enquiry_id: str) -> Enquiry | None:
    result = await db.execute(
        select(Enquiry)
        .where(Enquiry.id == enquiry_id)
        .options(
            selectinload(Enquiry.events),
            selectinload(Enquiry.messages),
            selectinload(Enquiry.followups),
        )
    )
    return result.scalar_one_or_none()


async def create_followup(
    db: AsyncSession,
    enquiry_id: str,
    payload: FollowUpCreate,
) -> FollowUp:
    scheduled_at = datetime.now(timezone.utc) + timedelta(minutes=payload.delay_minutes)
    followup = FollowUp(
        enquiry_id=enquiry_id,
        delay_minutes=payload.delay_minutes,
        message_template=payload.message_template,
        scheduled_at=scheduled_at,
    )
    db.add(followup)
    db.add(EnquiryEvent(
        enquiry_id=enquiry_id,
        event_type="followup_scheduled",
        detail=f"Scheduled in {payload.delay_minutes} minute(s).",
    ))
    await db.commit()
    await db.refresh(followup)

    logger.info(
        "Follow-up scheduled",
        extra={"enquiry_id": enquiry_id, "delay_minutes": payload.delay_minutes},
    )
    return followup


async def escalate_enquiry(
    db: AsyncSession,
    enquiry: Enquiry,
    payload: EscalateCreate,
) -> Enquiry:
    enquiry.status = EnquiryStatus.escalated
    enquiry.escalation_reason = payload.reason

    db.add(EnquiryEvent(
        enquiry_id=enquiry.id,
        event_type="escalation_triggered",
        detail=payload.reason,
    ))
    await db.commit()
    await db.refresh(enquiry)

    logger.info(
        "Enquiry escalated",
        extra={"enquiry_id": enquiry.id, "reason": payload.reason},
    )
    return enquiry
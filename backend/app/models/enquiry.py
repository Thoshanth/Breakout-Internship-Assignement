import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Text, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base
import enum


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def gen_uuid() -> str:
    return str(uuid.uuid4())


class EnquiryChannel(str, enum.Enum):
    whatsapp = "whatsapp"
    email = "email"
    call = "call"


class EnquiryStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    sop_matched = "sop_matched"
    escalated = "escalated"
    resolved = "resolved"


class SOPCategory(str, enum.Enum):
    booking = "booking"
    pricing = "pricing"
    complaint = "complaint"
    after_hours = "after_hours"
    general = "general"
    unmatched = "unmatched"


class Enquiry(Base):
    __tablename__ = "enquiries"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    customer_name: Mapped[str] = mapped_column(String(255), nullable=False)
    channel: Mapped[str] = mapped_column(SAEnum(EnquiryChannel), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(
        SAEnum(EnquiryStatus), default=EnquiryStatus.pending, nullable=False
    )
    sop_matched: Mapped[str | None] = mapped_column(SAEnum(SOPCategory), nullable=True)
    suggested_response: Mapped[str | None] = mapped_column(Text, nullable=True)
    escalation_reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow
    )

    events: Mapped[list["EnquiryEvent"]] = relationship(
        back_populates="enquiry", order_by="EnquiryEvent.created_at"
    )
    followups: Mapped[list["FollowUp"]] = relationship(
        back_populates="enquiry", order_by="FollowUp.scheduled_at"
    )
    messages: Mapped[list["Message"]] = relationship(
        back_populates="enquiry", order_by="Message.created_at"
    )


class EnquiryEvent(Base):
    """Status timeline entry — one row per status transition."""
    __tablename__ = "enquiry_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    enquiry_id: Mapped[str] = mapped_column(ForeignKey("enquiries.id"), nullable=False)
    event_type: Mapped[str] = mapped_column(String(64), nullable=False)
    detail: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    enquiry: Mapped["Enquiry"] = relationship(back_populates="events")


class FollowUp(Base):
    __tablename__ = "followups"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    enquiry_id: Mapped[str] = mapped_column(ForeignKey("enquiries.id"), nullable=False)
    delay_minutes: Mapped[int] = mapped_column(nullable=False)
    message_template: Mapped[str | None] = mapped_column(Text, nullable=True)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    enquiry: Mapped["Enquiry"] = relationship(back_populates="followups")


class Message(Base):
    """Conversation thread messages."""
    __tablename__ = "messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    enquiry_id: Mapped[str] = mapped_column(ForeignKey("enquiries.id"), nullable=False)
    sender: Mapped[str] = mapped_column(String(64), nullable=False)   # "customer" | "system" | "agent"
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    enquiry: Mapped["Enquiry"] = relationship(back_populates="messages")
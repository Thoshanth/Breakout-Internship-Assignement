from __future__ import annotations
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from app.models.enquiry import EnquiryChannel, EnquiryStatus, SOPCategory


# ──────────────────────────────────────────────
# Enquiry
# ──────────────────────────────────────────────

class EnquiryCreate(BaseModel):
    channel: EnquiryChannel = Field(..., examples=["whatsapp"])
    customer_name: str = Field(..., min_length=1, max_length=255, examples=["Sarah M."])
    message: str = Field(..., min_length=1, examples=["Hi, I'd like to book an appointment."])

    model_config = {"json_schema_extra": {
        "example": {
            "channel": "whatsapp",
            "customer_name": "Sarah M.",
            "message": "Hi, I'd like to book an appointment for next Monday.",
        }
    }}


class EnquiryCreatedResponse(BaseModel):
    job_id: str = Field(..., description="Enquiry / job ID to poll for status")
    status: EnquiryStatus
    message: str

    model_config = {"json_schema_extra": {
        "example": {
            "job_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "status": "pending",
            "message": "Enquiry received. Processing in background.",
        }
    }}


# ──────────────────────────────────────────────
# Follow-up
# ──────────────────────────────────────────────

class FollowUpCreate(BaseModel):
    delay_minutes: int = Field(..., gt=0, examples=[30])
    message_template: Optional[str] = Field(
        None, examples=["Hi {customer_name}, just following up on your enquiry!"]
    )

    model_config = {"json_schema_extra": {
        "example": {
            "delay_minutes": 30,
            "message_template": "Hi {customer_name}, just checking in — can we help further?",
        }
    }}


class FollowUpResponse(BaseModel):
    id: str
    enquiry_id: str
    delay_minutes: int
    message_template: Optional[str]
    scheduled_at: datetime
    created_at: datetime

    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────
# Escalation
# ──────────────────────────────────────────────

class EscalateCreate(BaseModel):
    reason: str = Field(..., min_length=1, examples=["Customer requested to speak with a manager."])

    model_config = {"json_schema_extra": {
        "example": {"reason": "Customer is unhappy with the quote and requested a manager."}
    }}


# ──────────────────────────────────────────────
# History / timeline
# ──────────────────────────────────────────────

class EventOut(BaseModel):
    id: str
    event_type: str
    detail: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class MessageOut(BaseModel):
    id: str
    sender: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class EnquiryHistoryResponse(BaseModel):
    id: str
    customer_name: str
    channel: EnquiryChannel
    status: EnquiryStatus
    sop_matched: Optional[SOPCategory]
    suggested_response: Optional[str]
    escalation_reason: Optional[str]
    created_at: datetime
    updated_at: datetime
    messages: list[MessageOut]
    events: list[EventOut]
    followups: list[FollowUpResponse]

    model_config = {"from_attributes": True}


# ──────────────────────────────────────────────
# Health
# ──────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str
    database: str
    version: str
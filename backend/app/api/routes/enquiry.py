from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.db.database import get_db
from app.schemas.enquiry import (
    EnquiryCreate,
    EnquiryCreatedResponse,
    EnquiryHistoryResponse,
    FollowUpCreate,
    FollowUpResponse,
    EscalateCreate,
    HealthResponse,
)
from app.services.enquiry_service import (
    create_enquiry,
    get_enquiry_with_history,
    create_followup,
    escalate_enquiry,
)
from app.workers.task_runner import process_enquiry
from app.core.config import settings
from app.models.enquiry import EnquiryStatus

router = APIRouter()


# ── POST /enquiry ─────────────────────────────────────────────────────────────

@router.post(
    "/enquiry",
    response_model=EnquiryCreatedResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Create a new inbound customer enquiry",
    description=(
        "Accepts a customer enquiry from WhatsApp, email, or phone. "
        "Returns a job ID immediately and processes the enquiry asynchronously in the background."
    ),
)
async def create_enquiry_endpoint(
    payload: EnquiryCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    enquiry = await create_enquiry(db, payload)
    background_tasks.add_task(process_enquiry, enquiry.id)
    return EnquiryCreatedResponse(
        job_id=enquiry.id,
        status=enquiry.status,
        message="Enquiry received. Processing in background.",
    )


# ── POST /enquiry/{id}/followup ───────────────────────────────────────────────

@router.post(
    "/enquiry/{enquiry_id}/followup",
    response_model=FollowUpResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Schedule a follow-up for an open enquiry",
    description="Schedule a follow-up message after a configurable delay (in minutes).",
)
async def schedule_followup(
    enquiry_id: str,
    payload: FollowUpCreate,
    db: AsyncSession = Depends(get_db),
):
    enquiry = await get_enquiry_with_history(db, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found.")
    if enquiry.status == EnquiryStatus.resolved:
        raise HTTPException(status_code=400, detail="Cannot schedule follow-up on a resolved enquiry.")

    return await create_followup(db, enquiry_id, payload)


# ── POST /enquiry/{id}/escalate ───────────────────────────────────────────────

@router.post(
    "/enquiry/{enquiry_id}/escalate",
    response_model=EnquiryHistoryResponse,
    summary="Escalate an enquiry to a human agent",
    description="Mark an enquiry as escalated. Provide a reason. Updates status in the database.",
)
async def escalate_enquiry_endpoint(
    enquiry_id: str,
    payload: EscalateCreate,
    db: AsyncSession = Depends(get_db),
):
    enquiry = await get_enquiry_with_history(db, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found.")
    if enquiry.status == EnquiryStatus.resolved:
        raise HTTPException(status_code=400, detail="Cannot escalate a resolved enquiry.")

    updated = await escalate_enquiry(db, enquiry, payload)
    # reload relations
    return await get_enquiry_with_history(db, updated.id)


# ── GET /enquiry/{id}/history ─────────────────────────────────────────────────

@router.get(
    "/enquiry/{enquiry_id}/history",
    response_model=EnquiryHistoryResponse,
    summary="Get conversation history and status timeline",
    description="Returns the full message thread, status event log, and any scheduled follow-ups.",
)
async def get_history(
    enquiry_id: str,
    db: AsyncSession = Depends(get_db),
):
    enquiry = await get_enquiry_with_history(db, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found.")
    return enquiry


# ── GET /health ───────────────────────────────────────────────────────────────

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Returns API status and database connectivity.",
)
async def health_check(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as exc:
        db_status = f"error: {exc}"

    return HealthResponse(
        status="ok",
        database=db_status,
        version=settings.APP_VERSION,
    )
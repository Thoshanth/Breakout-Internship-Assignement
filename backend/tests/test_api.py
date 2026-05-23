"""
Integration tests for Closira's enquiry API.

Run with:  pytest tests/ -v
"""

import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.db.database import init_db, engine, Base


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_db():
    """Create tables in a fresh test DB."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield


@pytest_asyncio.fixture()
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


# ── Helper ────────────────────────────────────────────────────────────────────

async def make_enquiry(client, message="I'd like to book an appointment"):
    resp = await client.post("/enquiry", json={
        "channel": "whatsapp",
        "customer_name": "Test User",
        "message": message,
    })
    assert resp.status_code == 202
    return resp.json()


# ── Tests ─────────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_health(client):
    resp = await client.get("/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["database"] == "ok"


@pytest.mark.asyncio
async def test_create_enquiry_returns_job_id(client):
    body = await make_enquiry(client)
    assert "job_id" in body
    assert body["status"] == "pending"


@pytest.mark.asyncio
async def test_create_enquiry_all_channels(client):
    for channel in ("whatsapp", "email", "call"):
        resp = await client.post("/enquiry", json={
            "channel": channel,
            "customer_name": "Chan User",
            "message": "Just testing channel.",
        })
        assert resp.status_code == 202


@pytest.mark.asyncio
async def test_create_enquiry_invalid_channel(client):
    resp = await client.post("/enquiry", json={
        "channel": "telegram",
        "customer_name": "Bad Actor",
        "message": "test",
    })
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_create_enquiry_missing_fields(client):
    resp = await client.post("/enquiry", json={"channel": "email"})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_history_returns_messages(client):
    body = await make_enquiry(client, "I want to book a slot please")
    eid = body["job_id"]
    await asyncio.sleep(0.3)  # let background task run
    resp = await client.get(f"/enquiry/{eid}/history")
    assert resp.status_code == 200
    data = resp.json()
    assert data["id"] == eid
    assert len(data["messages"]) >= 1  # at least customer message


@pytest.mark.asyncio
async def test_history_not_found(client):
    resp = await client.get("/enquiry/nonexistent-id/history")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_followup_scheduled(client):
    body = await make_enquiry(client)
    eid = body["job_id"]
    resp = await client.post(f"/enquiry/{eid}/followup", json={
        "delay_minutes": 15,
        "message_template": "Hi {customer_name}, following up!",
    })
    assert resp.status_code == 201
    fu = resp.json()
    assert fu["enquiry_id"] == eid
    assert fu["delay_minutes"] == 15


@pytest.mark.asyncio
async def test_followup_not_found(client):
    resp = await client.post("/enquiry/bad-id/followup", json={"delay_minutes": 10})
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_escalate(client):
    body = await make_enquiry(client)
    eid = body["job_id"]
    resp = await client.post(f"/enquiry/{eid}/escalate", json={
        "reason": "Customer requested a manager."
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "escalated"
    assert data["escalation_reason"] == "Customer requested a manager."


@pytest.mark.asyncio
async def test_escalate_not_found(client):
    resp = await client.post("/enquiry/bad-id/escalate", json={"reason": "test"})
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_sop_auto_escalation_on_no_match(client):
    """Messages with zero keywords should be auto-escalated by background task."""
    body = await make_enquiry(client, "xyzzy quux blort fnord")
    eid = body["job_id"]
    await asyncio.sleep(0.4)
    resp = await client.get(f"/enquiry/{eid}/history")
    data = resp.json()
    assert data["status"] == "escalated"
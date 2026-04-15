from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import json, uuid
from datetime import datetime
from pathlib import Path

router = APIRouter()

SIGNALS_FILE = Path(__file__).parent.parent / "data" / "saved_signals.json"


class SignalIn(BaseModel):
    type: str
    name: str
    data: str
    raw: Optional[dict] = {}
    tags: Optional[list[str]] = []


def load_signals():
    if SIGNALS_FILE.exists():
        return json.loads(SIGNALS_FILE.read_text())
    return []


def save_signals(signals):
    SIGNALS_FILE.parent.mkdir(exist_ok=True)
    SIGNALS_FILE.write_text(json.dumps(signals, indent=2))


@router.post("")
def create_signal(signal: SignalIn):
    signals = load_signals()
    entry = {**signal.dict(), "id": str(uuid.uuid4()), "createdAt": datetime.utcnow().isoformat()}
    signals.insert(0, entry)
    save_signals(signals)
    return entry


@router.get("")
def list_signals():
    return load_signals()


@router.delete("/{signal_id}")
def delete_signal(signal_id: str):
    signals = [s for s in load_signals() if s["id"] != signal_id]
    save_signals(signals)
    return {"deleted": signal_id}

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from models.schemas import SignalIn
from services import signal_db

router = APIRouter()


@router.get("/")
def list_signals(type: Optional[str] = Query(default=None)):
    # TODO: user scoping via auth
    try:
        return {"signals": signal_db.list_signals(user_id=None, type_=type)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
def create_signal(payload: SignalIn):
    try:
        created = signal_db.create_signal(user_id=None, payload=payload.model_dump())
        return {"signal": created}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


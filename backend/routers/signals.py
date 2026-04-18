from __future__ import annotations

import json
import uuid
from datetime import datetime
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

SIGNALS_FILE = Path(__file__).parent.parent / "data" / "saved_signals.json"


class SignalIn(BaseModel):
    type: str
    name: str
    data: str
    raw: dict | None = None
    tags: list[str] | None = None


def load_signals() -> list[dict]:
    if SIGNALS_FILE.exists():
        return json.loads(SIGNALS_FILE.read_text())
    return []


def save_signals(signals: list[dict]) -> None:
    SIGNALS_FILE.parent.mkdir(exist_ok=True)
    SIGNALS_FILE.write_text(json.dumps(signals, indent=2))


@router.post("")
def create_signal(signal: SignalIn):
    signals = load_signals()
    entry = {**signal.model_dump(), "id": str(uuid.uuid4()), "createdAt": datetime.utcnow().isoformat()}
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

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

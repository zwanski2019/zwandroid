from __future__ import annotations

from typing import Any, Optional

from fastapi import APIRouter, HTTPException, Query

from models.schemas import SignalIn

router = APIRouter()


@router.get("/")
def list_signals(type: Optional[str] = Query(default=None)):
    # Local file-based signals list for development
    # In production, this would use Supabase (see services/signal_db.py)
    from pathlib import Path
    import json
    
    signals_file = Path(__file__).parent.parent / "data" / "saved_signals.json"
    if signals_file.exists():
        signals = json.loads(signals_file.read_text())
        if type:
            signals = [s for s in signals if s.get("type") == type]
        return {"signals": signals}
    return {"signals": []}


@router.post("/")
def create_signal(payload: SignalIn):

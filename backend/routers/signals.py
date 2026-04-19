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
    # Local file-based signal storage for development
    # In production, this would use Supabase (see services/signal_db.py)
    from pathlib import Path
    import json
    import uuid
    from datetime import datetime
    
    signals_file = Path(__file__).parent.parent / "data" / "saved_signals.json"
    signals_file.parent.mkdir(parents=True, exist_ok=True)
    
    if signals_file.exists():
        signals = json.loads(signals_file.read_text())
    else:
        signals = []
    
    entry = {
        **payload.model_dump(),
        "id": str(uuid.uuid4()),
        "created_at": datetime.utcnow().isoformat()
    }
    signals.insert(0, entry)
    signals_file.write_text(json.dumps(signals, indent=2))
    return {"signal": entry}


@router.delete("/{signal_id}")
def delete_signal(signal_id: str):
    from pathlib import Path
    import json
    
    signals_file = Path(__file__).parent.parent / "data" / "saved_signals.json"
    if signals_file.exists():
        signals = json.loads(signals_file.read_text())
        signals = [s for s in signals if s.get("id") != signal_id]
        signals_file.write_text(json.dumps(signals, indent=2))
    return {"deleted": signal_id}


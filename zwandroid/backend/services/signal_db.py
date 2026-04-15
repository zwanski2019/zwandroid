from __future__ import annotations

import os
from typing import Any, Optional

from supabase import create_client


def _client():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_KEY are required")
    return create_client(url, key)


def create_signal(user_id: Optional[str], payload: dict[str, Any]):
    sb = _client()
    row = dict(payload)
    if user_id:
        row["user_id"] = user_id
    res = sb.table("signals").insert(row).execute()
    return res.data[0] if res.data else None


def list_signals(user_id: Optional[str], type_: Optional[str] = None):
    sb = _client()
    q = sb.table("signals").select("*").order("created_at", desc=True)
    if user_id:
        q = q.eq("user_id", user_id)
    if type_:
        q = q.eq("type", type_)
    res = q.execute()
    return res.data or []


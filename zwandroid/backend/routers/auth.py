from __future__ import annotations

from fastapi import APIRouter

router = APIRouter()


@router.get("/whoami")
def whoami():
    return {"user": None, "note": "Auth wiring TBD (use Supabase Auth on frontend)."}


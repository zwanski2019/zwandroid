from __future__ import annotations

from fastapi import APIRouter

router = APIRouter()


@router.get("/parse")
def parse_hint():
    return {"note": "NFC is handled on-device via Web NFC; backend used for storage/import/export."}


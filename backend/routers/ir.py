from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Query

from services.flipper_parser import parse_flipper_ir

router = APIRouter()

IR_DATA_DIR = Path(__file__).parent.parent / "data" / "ir"
_cache: list[dict] = []


def load_ir_database() -> list[dict]:
    global _cache
    if _cache:
        return _cache

    signals: list[dict] = []
    for ir_file in IR_DATA_DIR.rglob("*.ir"):
        try:
            text = ir_file.read_text(encoding="utf-8", errors="ignore")
            brand = ir_file.parent.name
            device = ir_file.stem
            current: dict = {}
            for line0 in text.splitlines():
                line = line0.strip()
                if line.startswith("#") or not line:
                    if current.get("name"):
                        signals.append(
                            {**current, "brand": brand, "device": device, "file": str(ir_file.name)}
                        )
                        current = {}
                    continue
                if ": " in line:
                    k, v = line.split(": ", 1)
                    current[k.strip().lower()] = v.strip()
            if current.get("name"):
                signals.append({**current, "brand": brand, "device": device})
        except Exception:
            continue

    _cache = signals
    return signals


@router.get("/search")
def search_ir(q: str = Query(""), brand: str = Query("")):
    db = load_ir_database()
    ql = (q or "").lower()
    bl = (brand or "").lower()
    results = [
        s
        for s in db
        if (
            ql in s.get("name", "").lower()
            or ql in s.get("brand", "").lower()
            or ql in s.get("device", "").lower()
        )
        and (not bl or s.get("brand", "").lower() == bl)
    ]
    return results[:100]


@router.get("/brands")
def get_brands():
    db = load_ir_database()
    return sorted(set(s.get("brand", "") for s in db if s.get("brand")))


@router.get("/brand/{brand}")
def get_by_brand(brand: str):
    db = load_ir_database()
    return [s for s in db if s.get("brand", "").lower() == brand.lower()][:200]


@router.get("/stats")
def get_stats():
    db = load_ir_database()
    brands = set(s.get("brand") for s in db)
    return {"total": len(db), "brands": len(brands)}


@router.post("/parse")
def parse_ir(body: dict):
    text = body.get("text", "")
    return {"signals": parse_flipper_ir(text)}

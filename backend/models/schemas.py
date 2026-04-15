from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


SignalType = Literal["nfc", "ir", "rf", "ble"]


class SignalIn(BaseModel):
    type: SignalType
    name: str
    data: str
    raw: dict[str, Any] | None = None
    tags: list[str] | None = None
    is_public: bool = False


class SignalOut(SignalIn):
    id: str
    user_id: Optional[str] = None
    created_at: str = Field(..., description="ISO timestamp")


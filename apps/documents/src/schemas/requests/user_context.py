# ---------- CREATE ----------
from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class PersonalContextCreate(BaseModel):
    user_id: UUID
    content: str


class PersonalContextUpdate(BaseModel):
    content: Optional[str] = None

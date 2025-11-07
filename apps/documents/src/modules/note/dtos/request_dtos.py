from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class NoteCreate(BaseModel):
    user_id: Optional[UUID] = None
    parent_id: Optional[UUID] = None
    title: str
    icon: Optional[str] = None
    favorite: bool = False


class NoteUpdate(BaseModel):
    parent_id: Optional[UUID] = None
    title: Optional[str] = None
    icon: Optional[str] = None
    favorite: Optional[bool] = None
    deleted_at: Optional[datetime] = None

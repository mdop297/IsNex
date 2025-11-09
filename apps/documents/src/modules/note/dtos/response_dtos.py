from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class NoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    parent_id: Optional[UUID] = None
    user_id: UUID
    title: str
    icon: Optional[str]
    favorite: bool
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None

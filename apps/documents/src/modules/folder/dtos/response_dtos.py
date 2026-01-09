from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class FolderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    parent_id: Optional[UUID] = None
    name: str
    path: str
    updated_at: datetime

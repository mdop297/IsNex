from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class WorkspaceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    name: str
    icon: str
    description: str
    active_conv: Optional[UUID]
    active_doc: Optional[UUID]
    active_note: Optional[UUID]
    created_at: datetime
    updated_at: datetime

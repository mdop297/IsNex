from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ConversationResponse(BaseModel):
    id: UUID
    user_id: UUID
    workspace_id: Optional[UUID] = None
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PaginatedConversationResponse(BaseModel):
    items: list[ConversationResponse]
    total: int
    skip: int
    limit: int

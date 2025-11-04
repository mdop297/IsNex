from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from src.models.prompt import PromptType


class PromptResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    workspace_id: Optional[UUID] = None
    name: str
    content: str
    type: PromptType
    created_at: datetime
    updated_at: datetime

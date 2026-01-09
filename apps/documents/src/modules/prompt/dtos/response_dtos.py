from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from src.modules.prompt.model import PromptType


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


class PersonalContextResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    content: str
    created_at: datetime

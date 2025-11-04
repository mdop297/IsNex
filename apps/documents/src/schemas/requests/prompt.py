from typing import Optional
from uuid import UUID
from pydantic import BaseModel
from src.models.prompt import PromptType


class PromptCreate(BaseModel):
    user_id: UUID
    workspace_id: Optional[UUID] = None
    name: str
    content: str
    type: PromptType = PromptType.USER


class PromptUpdate(BaseModel):
    name: Optional[str] = None
    content: Optional[str] = None
    type: Optional[PromptType] = None
    workspace_id: Optional[UUID] = None

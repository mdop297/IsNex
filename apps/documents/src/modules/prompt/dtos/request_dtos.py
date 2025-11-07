from typing import Optional
from uuid import UUID
from pydantic import BaseModel
from src.modules.prompt.model import PromptType


class PromptCreate(BaseModel):
    user_id: Optional[UUID] = None
    workspace_id: Optional[UUID] = None
    name: str
    content: str
    type: PromptType = PromptType.USER


class PromptUpdate(BaseModel):
    name: Optional[str] = None
    content: Optional[str] = None
    type: Optional[PromptType] = None
    workspace_id: Optional[UUID] = None


class PersonalContextCreate(BaseModel):
    # user_id: UUID
    content: str


class PersonalContextUpdate(BaseModel):
    content: Optional[str] = None

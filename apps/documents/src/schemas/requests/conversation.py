from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class ConversationCreate(BaseModel):
    user_id: UUID = Field(..., description="User who creates the conversation")
    workspace_id: Optional[UUID] = Field(
        default=None, description="Associated workspace ID"
    )
    title: Optional[str] = Field(default=None, description="Title of the conversation")


class ConversationUpdate(BaseModel):
    id: UUID = Field(..., description="ID of the conversation to update")
    title: Optional[str] = Field(default=None, description="Title of the conversation")

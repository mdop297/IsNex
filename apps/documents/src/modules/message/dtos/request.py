from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field

from src.modules.message.model import ReactionType, SenderType


class MessageCreate(BaseModel):
    user_id: Optional[UUID] = Field(None, exclude=True)

    conv_id: UUID = Field(..., description="ID of the conversation")
    sender: Optional[SenderType] = Field(
        default=None, description="Sender type: user or system"
    )
    model_name: Optional[str] = Field(
        default=None, description="Model name if system generated"
    )
    content: Optional[str] = Field(default=None, description="Message content")


class MessageUpdate(BaseModel):
    id: UUID = Field(..., description="ID of the message to update")
    model_name: Optional[str] = None
    reaction: Optional[ReactionType] = None

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from src.modules.message.model import ReactionType, SenderType


class MessageResponse(BaseModel):
    id: UUID
    user_id: UUID
    conv_id: UUID
    sender: SenderType
    model_name: Optional[str] = None
    content: str
    reaction: Optional[ReactionType] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

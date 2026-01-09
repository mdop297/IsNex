from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from uuid import UUID
from sqlalchemy.dialects import postgresql
from sqlmodel import Column, Field, Relationship
from src.core.database.base import BaseTable

if TYPE_CHECKING:
    from src.modules.conversation.model import Conversation


class SenderType(str, Enum):
    USER = "user"
    SYSTEM = "system"


class ReactionType(str, Enum):
    LIKE = "like"
    DISLIKE = "dislike"


class Message(BaseTable, table=True):
    user_id: UUID
    conv_id: UUID = Field(foreign_key="conversation.id")
    sender: SenderType
    model_name: Optional[str]
    content: str
    reaction: Optional[ReactionType]
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )

    re_conversation: "Conversation" = Relationship(
        back_populates="re_messages", sa_relationship_kwargs={"lazy": "selectin"}
    )

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from uuid import UUID
from sqlalchemy.dialects import postgresql
from sqlmodel import Column, Field, Relationship
from src.core.database.base import BaseTable

if TYPE_CHECKING:
    from src.models.workspace import Workspace
    from src.models.message import Message


class Conversation(BaseTable, table=True):
    # id: UUID (inherited from BaseTable)
    user_id: UUID
    workspace_id: Optional[UUID] = Field(foreign_key="workspace.id", default=None)
    title: str = Field(sa_column=Column(postgresql.TEXT))
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )

    re_opened_in: Optional["Workspace"] = Relationship(
        back_populates="re_active_conv",
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[Workspace.active_conv]",
        },
    )

    re_workspace: Optional["Workspace"] = Relationship(
        back_populates="re_conversations",
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[Conversation.workspace_id]",
        },
    )

    re_messages: list["Message"] = Relationship(
        back_populates="re_conversation", sa_relationship_kwargs={"lazy": "selectin"}
    )

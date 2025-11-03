from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from uuid import UUID
from sqlalchemy.dialects import postgresql
from sqlmodel import Column, Field, Relationship
from src.core.database.base import BaseTable


if TYPE_CHECKING:
    from src.models.workspace import Workspace


SYSTEM_PROMPT = "You are a helpful assistant."


class PromptType(str, Enum):
    USER = "user"
    WORKSPACE = "workspace"


class Prompt(BaseTable, table=True):
    user_id: UUID
    workspace_id: Optional[UUID] = Field(foreign_key="workspace.id")
    name: str
    content: str = Field(sa_column=Column(postgresql.TEXT))
    type: PromptType
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )
    re_workspace: Optional["Workspace"] = Relationship(
        back_populates="re_prompt", sa_relationship_kwargs={"lazy": "selectin"}
    )


class PersonalContext(BaseTable, table=True):
    user_id: UUID
    content: str = Field(sa_column=Column(postgresql.TEXT))
    created_at: datetime = Field(default_factory=datetime.now)

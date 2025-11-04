from datetime import datetime
from typing import TYPE_CHECKING, Optional

from uuid import UUID
from sqlalchemy import ForeignKey
from sqlalchemy.dialects import postgresql

from sqlmodel import Column, Field, Relationship
from src.core.database.base import BaseTable

if TYPE_CHECKING:
    from src.models.conversation import Conversation
    from src.models.document import Document
    from src.models.note import Note
    from src.models.prompt import Prompt


class DocumentWorkspaceLink(BaseTable, table=True):
    document_id: UUID = Field(foreign_key="document.id", primary_key=True)
    workspace_id: UUID = Field(foreign_key="workspace.id", primary_key=True)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )


class Workspace(BaseTable, table=True):
    user_id: UUID
    name: str
    icon: Optional[str]
    description: Optional[str] = Field(sa_column=Column(postgresql.TEXT))

    # Sử dụng use_alter=True cho circular foreign keys
    active_conv: Optional[UUID] = Field(
        default=None,
        sa_column=Column(
            postgresql.UUID,
            ForeignKey(
                "conversation.id", use_alter=True, name="fk_workspace_active_conv"
            ),
            nullable=True,
        ),
    )
    active_doc: Optional[UUID] = Field(
        default=None,
        sa_column=Column(
            postgresql.UUID,
            ForeignKey("document.id", use_alter=True, name="fk_workspace_active_doc"),
            nullable=True,
        ),
    )
    active_note: Optional[UUID] = Field(
        default=None,
        sa_column=Column(
            postgresql.UUID,
            ForeignKey("note.id", use_alter=True, name="fk_workspace_active_note"),
            nullable=True,
        ),
    )

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )

    re_documents: list["Document"] = Relationship(
        back_populates="re_workspace",
        link_model=DocumentWorkspaceLink,
        sa_relationship_kwargs={"lazy": "immediate"},
    )

    re_active_doc: Optional["Document"] = Relationship(
        back_populates="re_opened_in",
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[Workspace.active_doc]",
            "post_update": True,
        },
    )

    re_active_conv: Optional["Conversation"] = Relationship(
        back_populates="re_opened_in",
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[Workspace.active_conv]",
            "post_update": True,
        },
    )

    re_active_note: Optional["Note"] = Relationship(
        back_populates="re_opened_in",
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[Workspace.active_note]",
            "post_update": True,
        },
    )

    re_conversations: list["Conversation"] = Relationship(
        back_populates="re_workspace",
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "[Conversation.workspace_id]",
        },
    )

    re_prompt: list["Prompt"] = Relationship(
        back_populates="re_workspace", sa_relationship_kwargs={"lazy": "selectin"}
    )

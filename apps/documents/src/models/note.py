from datetime import datetime
from typing import TYPE_CHECKING, Optional

from uuid import UUID
from sqlalchemy.dialects import postgresql

from sqlmodel import Column, Field, Relationship
from src.core.database.base import BaseTable

if TYPE_CHECKING:
    from src.models.noteblock import NoteBlock
    from src.models.source import Source
    from src.models.workspace import Workspace


class Note(BaseTable, table=True):
    parent_id: UUID = Field(foreign_key="note.id", default=None)
    user_id: UUID = Field(nullable=False)
    title: str
    icon: str
    favorite: bool = False
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )
    deleted_at: Optional[datetime] = Field(
        sa_column=Column(postgresql.TIMESTAMP, default=None)
    )

    re_parent: Optional["Note"] = Relationship(
        back_populates="re_children",
        sa_relationship_kwargs={"remote_side": "[Note.id]"},
    )

    re_children: list["Note"] = Relationship(
        back_populates="re_parent",
        sa_relationship_kwargs={
            "lazy": "selectin",
            "cascade": "all, delete-orphan",
        },
    )

    re_blocks: list["NoteBlock"] = Relationship(
        back_populates="re_note", sa_relationship_kwargs={"lazy": "selectin"}
    )

    re_opened_in: Optional["Workspace"] = Relationship(
        back_populates="re_active_note", sa_relationship_kwargs={"lazy": "selectin"}
    )

    re_source: Optional["Source"] = Relationship(
        back_populates="re_note", sa_relationship_kwargs={"lazy": "selectin"}
    )

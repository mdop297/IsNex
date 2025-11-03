from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from uuid import UUID
from sqlalchemy.dialects import postgresql
from sqlmodel import Column, Field, Relationship
from src.core.database.base import BaseTable

if TYPE_CHECKING:
    from src.models.note import Note
    from src.models.source import Source


class NoteBlockType(str, Enum):
    TEXT = "text"
    IMAGE = "image"


class NoteBlockSourceLink(BaseTable, table=True):
    note_block_id: UUID = Field(
        foreign_key="noteblock.id", nullable=False, primary_key=True
    )
    note_id: UUID = Field(foreign_key="note.id", nullable=False, primary_key=True)


class NoteBlock(BaseTable, table=True):
    note_id: UUID = Field(foreign_key="note.id", nullable=False)
    parent_id: UUID = Field(foreign_key="noteblock.id", default=None)
    type: NoteBlockType
    props: dict = Field(default_factory=dict, sa_column=Column(postgresql.JSONB))
    content: dict = Field(default_factory=dict, sa_column=Column(postgresql.JSONB))
    order: int
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )

    re_note: "Note" = Relationship(
        back_populates="re_blocks", sa_relationship_kwargs={"lazy": "selectin"}
    )
    re_parent: Optional["NoteBlock"] = Relationship(
        back_populates="re_children", sa_relationship_kwargs={"lazy": "selectin"}
    )
    children: list["NoteBlock"] = Relationship(
        back_populates="re_parent", sa_relationship_kwargs={"lazy": "selectin"}
    )

    re_source: Optional["Source"] = Relationship(
        back_populates="re_noteblock", sa_relationship_kwargs={"lazy": "selectin"}
    )

    re_sources: list["Source"] = Relationship(
        back_populates="re_noteblocks",
        link_model=NoteBlockSourceLink,
        sa_relationship_kwargs={"lazy": "immediate"},
    )

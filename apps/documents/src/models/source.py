from datetime import datetime
from enum import Enum
from typing import TYPE_CHECKING, Optional

from uuid import UUID
from sqlmodel import Column, Field, Relationship
from sqlalchemy.dialects import postgresql
from src.core.database.base import BaseTable
from src.models.noteblock import NoteBlock, NoteBlockSourceLink

if TYPE_CHECKING:
    from src.models.highlight import Highlight
    from src.models.note import Note


class TypeOfSource(str, Enum):
    HIGHLIGHT = "highlight"
    NOTEBLOCK = "noteblock"
    NOTE = "note"
    URL = "url"


class Source(BaseTable, table=True):
    type: TypeOfSource = Field(nullable=False)
    highlight_id: Optional[UUID] = Field(foreign_key="highlight.id", default=None)
    note_id: Optional[UUID] = Field(foreign_key="note.id", default=None)
    # source can also be a block of note
    noteblock_id: Optional[UUID] = Field(foreign_key="noteblock.id", default=None)
    url: Optional[str]
    preview_content: Optional[str] = Field(sa_column=Column(postgresql.TEXT))
    created_at: datetime = Field(default_factory=datetime.now)

    re_noteblock: Optional["NoteBlock"] = Relationship(
        back_populates="re_source", sa_relationship_kwargs={"lazy": "selectin"}
    )

    re_noteblocks: list["NoteBlock"] = Relationship(
        back_populates="re_sources",
        link_model=NoteBlockSourceLink,
        sa_relationship_kwargs={"lazy": "immediate"},
    )

    re_highlight: Optional["Highlight"] = Relationship(
        back_populates="re_source", sa_relationship_kwargs={"lazy": "selectin"}
    )

    re_note: Optional["Note"] = Relationship(
        back_populates="re_source", sa_relationship_kwargs={"lazy": "selectin"}
    )

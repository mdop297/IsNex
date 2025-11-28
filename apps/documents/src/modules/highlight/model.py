from datetime import datetime
from typing import TYPE_CHECKING, Optional
from pydantic import BaseModel
from sqlalchemy.dialects import postgresql
from enum import Enum
from sqlmodel import Column, Field, Relationship
from uuid import UUID

from src.core.database.base import BaseTable

from src.modules.source.model import Source

if TYPE_CHECKING:
    from src.modules.document.model import Document

""" 
TODO: follow this link to have more details about how to design highlights, especially for position: 
https://danielarnould.github.io/react-pdf-highlighter-extended/docs/interfaces/Highlight.html
"""


class HighlightType(str, Enum):
    TEXT = "TEXT"
    AREA = "AREA"


class Position(BaseModel):
    height: float
    pageNumber: float
    width: float
    x1: float
    x2: float
    y1: float
    y2: float


class Highlight(BaseTable, table=True):
    user_id: UUID  # soft FK
    document_id: UUID = Field(
        foreign_key="document.id",
    )
    page_number: int
    color: str
    highlight_type: HighlightType
    comment: Optional[str] = Field(sa_column=Column(postgresql.TEXT))
    text: Optional[str] = Field(sa_column=Column(postgresql.TEXT))  # only used if TEXT
    # TODO: add support for image, add object storage bucket for images per user
    image_url: Optional[str]  # only used if AREA

    position: Position = Field(sa_column=Column(postgresql.JSONB))
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )

    re_source: Optional["Source"] = Relationship(
        back_populates="re_highlight", sa_relationship_kwargs={"lazy": "selectin"}
    )

    re_document: "Document" = Relationship(
        back_populates="re_highlights", sa_relationship_kwargs={"lazy": "selectin"}
    )

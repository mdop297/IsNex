from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy.dialects import postgresql
from enum import Enum
from sqlmodel import Column, Field, Relationship
from uuid import UUID

from src.core.database.base import BaseTable

if TYPE_CHECKING:
    from src.models.source import Source
    from src.models.document import Document


class HighlightType(str, Enum):
    TEXT = "TEXT"
    AREA = "AREA"


class Highlight(BaseTable, table=True):
    user_id: UUID  # soft FK
    document_id: UUID = Field(
        foreign_key="document.id",
    )
    document: "Document" = Relationship(
        back_populates="highlights", sa_relationship_kwargs={"lazy": "selectin"}
    )
    page_number: int
    color: str
    highlight_type: HighlightType
    preview_content: Optional[str] = Field(sa_column=Column(postgresql.TEXT))
    text: Optional[str] = Field(sa_column=Column(postgresql.TEXT))  # only used if TEXT
    # TODO: add support for image, add object storage bucket for images per user
    image_url: Optional[str]  # only used if AREA

    position: Optional[dict[str, float]] = Field(
        default_factory=dict, sa_column=Column(postgresql.JSONB)
    )
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )

    re_source: Optional["Source"] = Relationship(
        back_populates="re_highlight", sa_relationship_kwargs={"lazy": "selectin"}
    )

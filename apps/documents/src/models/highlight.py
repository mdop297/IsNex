from typing import TYPE_CHECKING, Optional
from sqlalchemy.dialects import postgresql
from enum import Enum
from sqlmodel import Column, Field, Relationship, SQLModel
from uuid import UUID, uuid4
from datetime import datetime

if TYPE_CHECKING:
    from src.models.document import Document


class HighlightType(str, Enum):
    TEXT = "TEXT"
    AREA = "AREA"


class Highlight(SQLModel, table=True):
    id: UUID = Field(sa_column=Column(postgresql.UUID, default=uuid4, primary_key=True))
    user_id: UUID
    document_id: UUID = Field(
        foreign_key="document.id",
    )
    document: "Document" = Relationship(
        back_populates="highlights", sa_relationship_kwargs={"lazy": "selectin"}
    )
    page_number: int
    color: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )
    highlight_type: HighlightType
    text: Optional[str] = None  # only used if TEXT
    image_url: Optional[str] = None  # only used if AREA
    bbox: Optional[dict[str, float]] = Field(
        default_factory=dict, sa_column=Column(postgresql.JSONB)
    )

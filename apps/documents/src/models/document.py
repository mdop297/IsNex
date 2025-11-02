from typing import Any, Optional, TYPE_CHECKING
from sqlalchemy.dialects import postgresql
from enum import Enum
from sqlmodel import Column, Field, Relationship
from uuid import UUID
from datetime import datetime

from src.core.database.base import BaseTable

if TYPE_CHECKING:
    from src.models.folder import Folder
    from src.models.highlight import Highlight


class Source(str, Enum):
    PDF = "pdf"
    WORD = "docx"
    EXCEL = "xlsx"
    POWERPOINT = "pptx"
    IMAGE = "image"


class Status(str, Enum):
    UPLOADED = "UPLOADED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class Document(BaseTable, table=True):
    user_id: UUID  # soft FK
    # workspace_id: Optional[UUID]
    folder_id: Optional[UUID] = Field(foreign_key="folder.id", default=None)
    # workspace_id: Optional[UUID] = Field(foreign_key="workspace.id")
    name: str
    status: Status = Field(default=Status.UPLOADED)
    # summary: Optional[str]
    file_url: str
    num_pages: int
    type: Source = Field(default=Source.PDF)

    file_size: str = Field(sa_column=Column(postgresql.VARCHAR(16), nullable=False))

    deleted_at: Optional[datetime] = Field(
        sa_column=Column(postgresql.TIMESTAMP, default=None)
    )

    extra_metadata: Optional[dict[str, Any]] = Field(
        default_factory=dict, sa_column=Column(postgresql.JSONB)
    )

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )
    folder: Optional["Folder"] = Relationship(
        back_populates="documents", sa_relationship_kwargs={"lazy": "selectin"}
    )
    highlights: list["Highlight"] = Relationship(
        back_populates="document", sa_relationship_kwargs={"lazy": "selectin"}
    )

from __future__ import annotations
from typing import Any, Optional, TYPE_CHECKING
from sqlalchemy.dialects import postgresql
from enum import Enum
from sqlmodel import Column, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime

from src.core.database.base import BaseTable

if TYPE_CHECKING:
    from src.models.folder import Folder
    from src.models.highlight import Highlight


class Source(str, Enum):
    PDF = "PDF"
    WORD = "WORD"
    EXCEL = "EXCEL"
    POWERPOINT = "POWERPOINT"
    IMAGE = "IMAGE"


class Status(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class FileSizeUnit(str, Enum):
    B = "b"
    KB = "Kb"
    MB = "Mb"
    GB = "Gb"


class Document(BaseTable, table=True):
    id: UUID = Field(sa_column=Column(postgresql.UUID, default=uuid4, primary_key=True))
    user_id: UUID  # soft FK
    workspace_id: UUID
    folder_id: Optional[UUID] = Field(foreign_key="folder.id")
    folder: Optional["Folder"] = Relationship(
        back_populates="documents", sa_relationship_kwargs={"lazy": "selectin"}
    )

    name: str
    description: Optional[str]
    file_url: str
    source_type: Source  # only Pdf for now
    num_pages: int
    embedding_status: Status
    file_size: float = Field(
        sa_column=Column(postgresql.DOUBLE_PRECISION, nullable=False)
    )
    file_unit: FileSizeUnit = Field(
        sa_column=Column(postgresql.ENUM(FileSizeUnit, name="file_size_unit_enum")),
        default=FileSizeUnit.MB,
    )
    deleted_at: Optional[datetime] = Field(
        sa_column=Column(postgresql.TIMESTAMP, default=None)
    )

    extra_metadata: Optional[dict[str, Any]] = Field(
        default_factory=dict, sa_column=Column(postgresql.JSONB)
    )

    highlights: list["Highlight"] = Relationship(
        back_populates="document", sa_relationship_kwargs={"lazy": "selectin"}
    )
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )

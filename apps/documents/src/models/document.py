from typing import Any, Optional, TYPE_CHECKING
from sqlalchemy.dialects import postgresql
from enum import Enum
from sqlmodel import Column, Field, Relationship
from uuid import UUID
from datetime import datetime

from src.core.database.base import BaseTable
from src.models.workspace import DocumentWorkspaceLink

if TYPE_CHECKING:
    from src.models.workspace import Workspace
    from src.models.folder import Folder
    from src.models.highlight import Highlight


class FileType(str, Enum):
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
    folder_id: Optional[UUID] = Field(foreign_key="folder.id", default=None)
    name: str
    status: Status = Field(default=Status.UPLOADED)
    # summary: Optional[str]
    file_url: str = Field(unique=True)
    num_pages: int
    type: FileType = Field(default=FileType.PDF)

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
    re_folder: Optional["Folder"] = Relationship(
        back_populates="re_documents", sa_relationship_kwargs={"lazy": "selectin"}
    )
    re_highlights: list["Highlight"] = Relationship(
        back_populates="re_document", sa_relationship_kwargs={"lazy": "selectin"}
    )
    re_workspace: Optional["Workspace"] = Relationship(
        back_populates="re_documents",
        link_model=DocumentWorkspaceLink,
        sa_relationship_kwargs={"lazy": "immediate"},
    )

    re_opened_in: Optional["Workspace"] = Relationship(
        back_populates="re_active_doc", sa_relationship_kwargs={"lazy": "selectin"}
    )

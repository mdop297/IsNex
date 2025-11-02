from typing import TYPE_CHECKING, Optional
from sqlalchemy.dialects import postgresql
from sqlmodel import Column, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime

from src.core.database.base import BaseTable

if TYPE_CHECKING:
    from src.models.document import Document


class Folder(BaseTable, table=True):
    user_id: UUID  # soft FK
    workspace_id: UUID
    parent_id: Optional[UUID] = Field(default=None, foreign_key="folder.id")
    name: str
    path: str

    deleted_at: Optional[datetime] = Field(
        sa_column=Column(postgresql.TIMESTAMP, default=None)
    )

    # relationships
    parent: Optional["Folder"] = Relationship(
        back_populates="children",
        sa_relationship_kwargs=dict(
            remote_side="Folder.id"  # notice the uppercase "N" to refer to this table class
        ),
    )
    children: list["Folder"] = Relationship(
        back_populates="parent", sa_relationship_kwargs={"lazy": "selectin"}
    )
    documents: list["Document"] = Relationship(
        back_populates="folder", sa_relationship_kwargs={"lazy": "selectin"}
    )
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )

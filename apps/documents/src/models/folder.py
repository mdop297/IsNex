from __future__ import annotations
from typing import TYPE_CHECKING, Optional
from sqlalchemy.dialects import postgresql
from sqlmodel import Column, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime

from src.models.base import BaseTable

if TYPE_CHECKING:
    from src.models.document import Document


class Folder(BaseTable, table=True):
    id: UUID = Field(sa_column=Column(postgresql.UUID, default=uuid4, primary_key=True))
    workspace_id: UUID  # soft FK
    user_id: UUID  # soft FK
    parent_id: Optional[UUID] = Field(default=None, foreign_key="folder.id")
    name: str
    path: str
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )
    deleted_at: Optional[datetime] = Field(
        sa_column=Column(postgresql.TIMESTAMP, default=None)
    )

    # relationships
    parent: Optional["Folder"] = Relationship(
        back_populates="children", sa_relationship_kwargs={"lazy": "selectin"}
    )
    children: list["Folder"] = Relationship(
        back_populates="parent", sa_relationship_kwargs={"lazy": "selectin"}
    )
    documents: list["Document"] = Relationship(
        back_populates="folder", sa_relationship_kwargs={"lazy": "selectin"}
    )

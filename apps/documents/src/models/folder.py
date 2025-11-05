from typing import TYPE_CHECKING, Optional
from sqlalchemy.dialects import postgresql
from sqlmodel import Column, Field, Relationship, UniqueConstraint
from uuid import UUID
from datetime import datetime

from src.core.database.base import BaseTable

if TYPE_CHECKING:
    from src.models.document import Document


class Folder(BaseTable, table=True):
    user_id: UUID = Field(index=True)
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
    re_parent: Optional["Folder"] = Relationship(
        back_populates="re_children",
        sa_relationship_kwargs=dict(
            remote_side="Folder.id"  # notice the uppercase "N" to refer to this table class
        ),
    )
    re_children: list["Folder"] = Relationship(
        back_populates="re_parent", sa_relationship_kwargs={"lazy": "selectin"}
    )
    re_documents: list["Document"] = Relationship(
        back_populates="re_folder", sa_relationship_kwargs={"lazy": "selectin"}
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id", "parent_id", "name", name="unique_folder_per_parent"
        ),
    )

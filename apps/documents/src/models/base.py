from sqlalchemy.dialects import postgresql
from sqlmodel import Column, Field, SQLModel
from uuid import UUID, uuid4
from datetime import datetime


class BaseTable(SQLModel, table=False):
    id: UUID = Field(sa_column=Column(postgresql.UUID, default=uuid4, primary_key=True))
    user_id: UUID  # soft FK
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(
        default_factory=datetime.now,
        sa_column=Column(postgresql.TIMESTAMP, onupdate=datetime.now),
    )

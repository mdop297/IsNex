from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class FolderCreate(BaseModel):
    # user_id: UUID # get user_id from token, never from request body
    parent_id: Optional[UUID] = Field(default=None, description="parent folder id")
    name: str = Field(default="Untitled", description="name of the folder")
    path: str = Field(default="/", description="path of the folder")


class FolderUpdate(BaseModel):
    parent_id: Optional[UUID] = Field(default=None, description="parent folder id")
    name: Optional[str] = Field(default=None, description="name of the folder")

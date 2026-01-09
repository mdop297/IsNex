from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field
from pydantic.json_schema import SkipJsonSchema


class FolderCreate(BaseModel):
    user_id: SkipJsonSchema[Optional[UUID]] = Field(default=None)

    parent_id: Optional[UUID] = Field(default=None, description="parent folder id")
    name: str = Field(default="Untitled", description="name of the folder")
    path: str = Field(default="/", description="path of the folder")


class FolderUpdate(BaseModel):
    parent_id: Optional[UUID] = Field(default=None, description="parent folder id")
    name: Optional[str] = Field(default=None, description="name of the folder")

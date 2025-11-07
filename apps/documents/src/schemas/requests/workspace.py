from typing import Optional
from uuid import UUID
from pydantic import BaseModel


class WorkspaceCreate(BaseModel):
    user_id: Optional[UUID] = None
    name: str
    icon: Optional[str]
    description: Optional[str] = ""


class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    description: Optional[str] = None
    active_conv: Optional[UUID] = None
    active_doc: Optional[UUID] = None
    active_note: Optional[UUID] = None

from typing import Optional
from uuid import UUID
from pydantic import BaseModel
from src.models.source import TypeOfSource


class SourceCreate(BaseModel):
    type: TypeOfSource
    highlight_id: Optional[UUID] = None
    note_id: Optional[UUID] = None
    noteblock_id: Optional[UUID] = None
    url: Optional[str] = None
    preview_content: Optional[str] = None


class SourceUpdate(BaseModel):
    type: Optional[TypeOfSource] = None
    highlight_id: Optional[UUID] = None
    note_id: Optional[UUID] = None
    noteblock_id: Optional[UUID] = None
    url: Optional[str] = None
    preview_content: Optional[str] = None

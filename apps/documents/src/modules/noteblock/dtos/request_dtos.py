from typing import Optional, Dict
from uuid import UUID
from pydantic import BaseModel, Field
from src.modules.noteblock.model import NoteBlockType


class NoteBlockCreate(BaseModel):
    note_id: UUID
    parent_id: Optional[UUID] = None
    type: NoteBlockType
    props: Dict = Field(default_factory=dict)
    content: Dict = Field(default_factory=dict)
    order: int


class NoteBlockUpdate(BaseModel):
    parent_id: Optional[UUID] = None
    type: Optional[NoteBlockType] = None
    props: Optional[Dict] = None
    content: Optional[Dict] = None
    order: Optional[int] = None

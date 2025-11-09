from datetime import datetime
from typing import Dict, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

from src.modules.noteblock.model import NoteBlockType


class NoteBlockResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    note_id: UUID
    parent_id: Optional[UUID]
    type: NoteBlockType
    props: Dict
    content: Dict
    order: int
    updated_at: datetime

    # optional: include linked source ids if needed
    source_ids: Optional[list[UUID]] = None

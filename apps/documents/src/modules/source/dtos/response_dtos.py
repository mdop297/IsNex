from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict
from src.modules.source.model import TypeOfSource


class SourceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    type: TypeOfSource
    highlight_id: Optional[UUID]
    note_id: Optional[UUID]
    noteblock_id: Optional[UUID]
    url: Optional[str]
    preview_content: Optional[str]

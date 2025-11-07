from typing import Optional
from uuid import UUID
from pydantic import BaseModel

from src.modules.highlight.model import HighlightType, Position


class HighlightBase(BaseModel):
    user_id: Optional[UUID] = None
    document_id: UUID
    page_number: int
    color: str
    highlight_type: HighlightType
    comment: Optional[str] = None
    text: Optional[str] = None
    image: Optional[bytes]
    position: Position


class HighlightCreate(HighlightBase):
    pass


class HighlightUpdate(BaseModel):
    color: Optional[str] = None
    comment: Optional[str] = None

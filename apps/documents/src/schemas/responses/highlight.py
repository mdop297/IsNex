from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

from src.models.highlight import HighlightType, Position


class HighlightResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    document_id: UUID
    page_number: int
    color: str
    highlight_type: HighlightType
    comment: Optional[str] = None
    text: Optional[str] = None
    image: Optional[bytes]
    position: Position


class PaginatedHighlightResponse(BaseModel):
    items: list[HighlightResponse]
    total: int
    skip: int
    limit: int

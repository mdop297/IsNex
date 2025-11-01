from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel

from src.models.document import FileSizeUnit, Status


class DocumentResponse(BaseModel):
    id: UUID
    folder_id: Optional[UUID] = None
    name: str
    source_type: str
    num_pages: int
    embedding_status: Status
    file_size: float
    file_unit: FileSizeUnit
    created_at: datetime
    updated_at: datetime

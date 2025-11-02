from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel

from src.models.document import Source, Status


class DocumentResponse(BaseModel):
    id: UUID
    folder_id: Optional[UUID] = None
    name: str
    type: Source
    num_pages: int
    embedding_status: Status
    file_size: str
    created_at: datetime
    updated_at: datetime

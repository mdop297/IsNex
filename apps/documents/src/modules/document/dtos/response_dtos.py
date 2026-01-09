from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict

from src.modules.document.model import FileType, Status


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    folder_id: Optional[UUID] = None
    name: str
    type: FileType
    num_pages: int
    embedding_status: Status = Status.UPLOADED
    file_size: str
    created_at: datetime
    updated_at: datetime


class PresignedUrlResponse(BaseModel):
    url: str

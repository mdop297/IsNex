from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator

from src.modules.document.model import FileType


class DocumentCreate(BaseModel):
    user_id: Optional[UUID] = None
    workspace_id: Optional[UUID] = Field(default=None)
    folder_id: Optional[UUID] = Field(default=None)
    name: str = Field(default="Untitled")
    file_url: str
    type: FileType = Field(
        default=FileType.PDF,
        description="type of the file, only pdf for now",
        examples=[
            FileType.PDF,
            FileType.WORD,
            FileType.EXCEL,
            FileType.POWERPOINT,
            FileType.IMAGE,
        ],
    )
    num_pages: Optional[int] = Field(..., description="number of pages in the file")
    file_size: str = Field(..., description="size of the file in bytes")

    @field_validator("type")
    @classmethod
    def ensure_pdf_only(cls, v):
        if v != FileType.PDF:
            raise ValueError(
                "Please upload a PDF file. IsNex only support PDF for now."
            )
        return v


class DocumentUpdate(BaseModel):
    workspace_id: Optional[UUID] = Field(default=None)
    folder_id: Optional[UUID] = Field(default=None)
    name: Optional[str] = Field(default=None)

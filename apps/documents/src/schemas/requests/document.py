from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, field_validator

from src.models.document import Source


class DocumentCreate(BaseModel):
    user_id: UUID
    workspace_id: Optional[UUID] = Field(default=None)
    folder_id: Optional[UUID] = Field(default=None)
    name: str = Field(default="Untitled")
    # file_url: str
    source_type: Source = Field(
        default=Source.PDF,
        description="type of the file, only pdf for now",
        examples=[
            Source.PDF,
            Source.WORD,
            Source.EXCEL,
            Source.POWERPOINT,
            Source.IMAGE,
        ],
    )
    num_pages: Optional[int] = Field(..., description="number of pages in the file")
    file_size: float = Field(..., description="size of the file in bytes")
    file_unit: str = Field(..., description="unit of the file size")

    @field_validator("source_type")
    @classmethod
    def ensure_pdf_only(cls, v):
        if v != Source.PDF:
            raise ValueError(
                "Please upload a PDF file. IsNex only support PDF for now."
            )
        return v


class DocumentUpdate(BaseModel):
    workspace_id: Optional[UUID] = Field(default=None)
    folder_id: Optional[UUID] = Field(default=None)
    name: Optional[str] = Field(default=None)

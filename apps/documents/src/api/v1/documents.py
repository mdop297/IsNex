from typing import Any
from fastapi import APIRouter

from src.schemas.requests.document import DocumentCreate
from src.schemas.responses.document import DocumentResponse


# create route: upload document
router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/", response_model=DocumentResponse)
async def upload_document(document: DocumentCreate, service: Any):
    pass

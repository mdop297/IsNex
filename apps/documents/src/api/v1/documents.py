from typing import Any
from fastapi import APIRouter


# create route: upload document
router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/")
async def upload_document(input: Any):
    pass

from fastapi import APIRouter, Request

from src.schemas.requests.document import DocumentCreate
from src.schemas.responses.document import DocumentResponse


# create route: upload document
document_router = APIRouter(prefix="/documents", tags=["documents"])


@document_router.post("/", response_model=DocumentResponse)
async def upload_document(request: Request):
    print("\n\n\n REACHED HERE \n\n\n")
    return {
        "hello": "world",
        **request.user.dict(),
    }

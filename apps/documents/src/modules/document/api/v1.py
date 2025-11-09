from uuid import UUID
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from minio import S3Error

from src.api.depends.factory import DocumentServiceDep, Factory
from src.core.utils.logger import get_logger
from src.modules.document.dtos.request_dtos import DocumentCreate, DocumentUpdate
from src.modules.document.dtos.response_dtos import (
    DocumentResponse,
    PresignedUrlResponse,
)
from src.modules.document.service import DocumentService

logger = get_logger(__name__)


# create route: upload document
document_router = APIRouter(prefix="/documents", tags=["documents"])


# api/v1/documents/
@document_router.post("/", response_model=DocumentResponse)
async def upload_file(
    request: Request,
    data: DocumentCreate,
    file: UploadFile = File(...),
    document_service: DocumentService = Depends(Factory().get_document_service),
):
    try:
        document = await document_service.create(
            file=file, user_id=request.user.id, data=data
        )

        return document

    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO error: {str(e)}") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}") from e


# get document meta
@document_router.get("/{id}", response_model=DocumentResponse)
async def get_document_meta(
    request: Request, id: UUID, document_service: DocumentServiceDep
):
    result = await document_service.get_by_id(user_id=request.user.id, id=id)
    return result


# load documment
@document_router.get("/load/{id}", response_model=PresignedUrlResponse)
async def load_document(
    request: Request, id: UUID, document_service: DocumentServiceDep
):
    presigned_url = document_service.get_presigned_url(
        user_id=request.user.id, document_id=id
    )
    return presigned_url


# update document
@document_router.patch("/{id}", response_model=DocumentResponse)
async def update_document(
    request: Request,
    id: UUID,
    data: DocumentUpdate,
    document_service: DocumentServiceDep,
):
    result = await document_service.update(user_id=request.user.id, id=id, obj=data)
    return result


# delete document
@document_router.delete("/{id}", response_model=bool)
async def delete_document(
    request: Request, id: UUID, document_service: DocumentServiceDep
):
    result = await document_service.delete(user_id=request.user.id, id=id)
    return result


# download document


# @document_router.get("")
# async def root(request: Request):
#     logger.info("Current user info: %s", request.user.json())
#     return {
#         "message": "Hello World",
#         "user": request.user.dict(),  # convert Pydantic model -> dict
#     }


# @document_router.get("/download/{filename}")
# async def download_file(filename: str):
#     try:
#         try:
#             minio_client.stat_object(bucket_name, filename)
#         except S3Error:
#             raise HTTPException(status_code=404, detail="File not found") from None

#         response = minio_client.get_object(bucket_name, filename)

#         return StreamingResponse(
#             io.BytesIO(response.read()),
#             media_type="application/octet-stream",
#             headers={"Content-Disposition": f"attachment; filename={filename}"},
#         )
#     except HTTPException:
#         raise
#     except S3Error as e:
#         raise HTTPException(status_code=500, detail=f"MinIO error: {str(e)}") from e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Server error: {str(e)}") from e

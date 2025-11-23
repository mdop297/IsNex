from uuid import UUID
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile
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
    metadata: str = Form(...),
    file: UploadFile = File(...),
    document_service: DocumentService = Depends(Factory().get_document_service),
):
    try:
        logger.info("YOU MADE IT, your document is uploaded.")
        data = DocumentCreate.model_validate_json(metadata)
        logger.info("YOU MADE IT, your document is uploaded.")

        data.user_id = request.user.id
        logger.error(data)
        data.file_url = ""
        document = await document_service.create(
            file=file, user_id=request.user.id, data=data
        )

        return document

    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO error: {str(e)}") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}") from e

# get all documents by user_id
@document_router.get("/all", response_model=list[DocumentResponse])
async def get_all_documents_by_user(
    request: Request, document_service: DocumentServiceDep
):
    try: 
        result = await document_service.get_all(user_id=request.user.id)
        return result
    except Exception as e:
        logger.info(f"Failed to fetch documents for user {request.user.username}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch documents for user {request.user.username}: {str(e)}")

# get documents by folder_id
@document_router.get("/fs", response_model=list[DocumentResponse])
async def get_documents_by_folder_id(request: Request,document_service: DocumentServiceDep, folder_id: UUID|None= Query(None) ):
    try:
        
        if (folder_id is None):
            return await document_service.get_docs_at_root(user_id=request.user.id)
        else:
            return await document_service.get_by_folder_id(user_id=request.user.id, folder_id=folder_id)
    except Exception as e:
        logger.info(f"Failed to fetch documents by folder id: {folder_id}, usename {request.user.username}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch documents by folder id: {folder_id}, usename {request.user.username}: {str(e)}")
        
        
        
# load documment
@document_router.get("/load/{id}", response_model=str)
async def load_document(
    request: Request, id: UUID, document_service: DocumentServiceDep
):
    presigned_url = await document_service.get_presigned_url(
        user_id=request.user.id, document_id=id
    )
    return presigned_url

# get document meta
@document_router.get("/{id}", response_model=DocumentResponse)
async def get_document_meta(
    request: Request, id: UUID, document_service: DocumentServiceDep
):
    result = await document_service.get_by_id(user_id=request.user.id, id=id)
    return result



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
@document_router.get("/download/{id}", response_model=PresignedUrlResponse)
async def download_document(
    request: Request, id: UUID, document_service: DocumentServiceDep
):
    presigned_url = await document_service.get_presigned_url(
        user_id=request.user.id, document_id=id
    )
    return presigned_url

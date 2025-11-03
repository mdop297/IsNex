from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from minio import S3Error

from src.api.depends.factory import Factory
from src.core.utils.logger import get_logger
from src.services.document import DocumentService

logger = get_logger(__name__)


# create route: upload document
document_router = APIRouter(prefix="/documents", tags=["documents"])


# api/v1/documents/
@document_router.post("")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    document_service: DocumentService = Depends(Factory().get_document_service),
):
    try:
        document = await document_service.upload_document(
            file=file, user_id=request.user.id, allow_overwrite=False
        )

        return {"message": "File uploaded successfully", "object": document.file_url}

    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO error: {str(e)}") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}") from e


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

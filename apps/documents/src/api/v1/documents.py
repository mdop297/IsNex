import io
from typing import Annotated
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import StreamingResponse
from minio import Minio, S3Error

from src.api.depends.factory import Factory
from src.core.utils.logger import get_logger
from src.core.utils.utils import format_file_size
from src.models.document import Source
from src.schemas.requests.document import DocumentCreate
from src.services.document import DocumentService
from src.services.obj_storage import MinioService

logger = get_logger(__name__)

# create route: upload document
document_router = APIRouter(prefix="/documents", tags=["documents"])

# MinIO client
minio_client = Minio(
    "data-lake:9000", access_key="minioadmin", secret_key="minioadmin", secure=False
)

bucket_name = "my-bucket"
try:
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)
except S3Error as e:
    print(f"Error creating bucket: {e}")


# api/v1/documents/
@document_router.post("")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    document_service: DocumentService = Depends(Factory().get_document_service),
    minio_service: MinioService = Depends(Factory().get_storage_service),
):
    try:
        path, filename, file_size = await minio_service.upload_file(
            file, str(request.user.id)
        )

        source_type = Source.PDF
        file_size_str = format_file_size(file_size)
        entity = DocumentCreate(
            user_id=request.user.id,
            file_url=path,
            name=filename,
            type=source_type,
            num_pages=0,
            file_size=file_size_str,
        )

        await document_service.create(entity)

        return {"message": "File uploaded successfully", "object": path}

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

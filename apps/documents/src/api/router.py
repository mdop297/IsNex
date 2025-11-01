from fastapi import APIRouter, File, Request, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from minio import Minio
from minio.error import S3Error
import io
from src.core.config import settings
from src.core.utils.logger import setup_custom_logger

router = APIRouter(prefix="/api")
logger = setup_custom_logger("IsNexLogger")


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


@router.get("")
async def root(request: Request):
    logger.info("Current user info: %s", request.user.json())
    return {
        "message": "Hello World",
        "user": request.user.dict(),  # convert Pydantic model -> dict
    }


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        # Đọc file vào memory buffer
        file_data = await file.read()
        file_stream = io.BytesIO(file_data)

        # Upload lên MinIO
        minio_client.put_object(
            bucket_name,
            file.filename,
            file_stream,
            length=len(file_data),
            content_type=file.content_type or "application/octet-stream",
        )

        return {"message": "File uploaded successfully", "filename": file.filename}

    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO error: {str(e)}") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}") from e


@router.get("/download/{filename}")
async def download_file(filename: str):
    try:
        try:
            minio_client.stat_object(bucket_name, filename)
        except S3Error:
            raise HTTPException(status_code=404, detail="File not found") from None

        response = minio_client.get_object(bucket_name, filename)

        return StreamingResponse(
            io.BytesIO(response.read()),
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except HTTPException:
        raise
    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO error: {str(e)}") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}") from e


@router.get(path="/showenv")
def showenv():
    try:
        db_configs = {
            "db_host": settings.DATABASE_HOST,
            "db_port": settings.DATABASE_PORT,
            "db_user": settings.POSTGRES_USER,
            "db_password": settings.POSTGRES_PASSWORD,
            "db_name": settings.DATABASE_NAME,
            "db_url": settings.DATABASE_URL,
        }
        return db_configs
    except HTTPException:
        raise
    except S3Error as e:
        raise HTTPException(status_code=500, detail=f"MinIO error: {str(e)}") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}") from e

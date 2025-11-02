from fastapi import APIRouter, File, Request, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from minio import Minio
from minio.error import S3Error
import io
from src.core.config import settings
from src.core.utils.logger import setup_custom_logger

router = APIRouter(prefix="/api")


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

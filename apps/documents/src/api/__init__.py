from fastapi import APIRouter, HTTPException
from src.core.config import settings
from src.core.middleware.authentication import public
from src.core.utils.logger import get_logger
from .v1 import v1_router

logger = get_logger(__name__)


router = APIRouter()
router.include_router(v1_router, prefix="/api")

__all__ = ["router"]


@router.get(path="/showenv")
@public(is_public=True)
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}") from e

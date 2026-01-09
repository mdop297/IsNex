from fastapi import APIRouter, HTTPException
from src.core.config import settings
from src.core.middleware.authentication import public
from src.core.utils.logger import get_logger
from .v1 import v1_router

logger = get_logger(__name__)


router = APIRouter()
router.include_router(v1_router, prefix="/api")

__all__ = ["router"]

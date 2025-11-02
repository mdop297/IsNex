from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.middleware.authentication import (
    AuthMiddleware,
    AuthBackend,
    on_auth_error,
)
from src.core.config import settings
from src.api import router
from src.core.utils.logger import setup_custom_logger


my_logger = setup_custom_logger("IsNexLogger")


app = FastAPI(
    title="Core Service ",
    description="Core Service for IsNex project",
    docs_url=None if settings.ENVIRONMENT == "production" else "/docs",
    redoc_url=None if settings.ENVIRONMENT == "production" else "/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(AuthMiddleware, backend=AuthBackend(), on_error=on_auth_error)

app.include_router(router=router)

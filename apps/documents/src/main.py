from fastapi import FastAPI
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware

from src.core.middleware.authentication import (
    AuthenticationMiddleware,
    AuthBackend,
)
from src.core.config import settings
from src.api.router import router
from src.core.utils.logger import setup_custom_logger


my_logger = setup_custom_logger("IsNexLogger")


def create_middlewares() -> list[Middleware]:
    middlewares = [
        Middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        ),
        Middleware(AuthenticationMiddleware, backend=AuthBackend()),
    ]

    return middlewares


app = FastAPI(
    title="Core Service",
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
app.add_middleware(AuthenticationMiddleware, backend=AuthBackend())

app.include_router(router=router)

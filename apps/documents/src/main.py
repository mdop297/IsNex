from fastapi import FastAPI
from fastapi.middleware import Middleware
from fastapi.middleware.cors import CORSMiddleware

from src.core.middleware.authentication import (
    AuthenticationMiddleware,
    AuthBackend,
)
from src.core.config import settings


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
    middlewares=create_middlewares(),
)

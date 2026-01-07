from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute

from src.core.middleware.authentication import (
    AuthMiddleware,
    AuthBackend,
    on_auth_error,
)
from src.core.config import settings
from src.api import router
from src.core.middleware.logging import LoggingMiddleware

import mlflow

mlflow.set_experiment("Agent output schema")


def custom_generate_unique_id_function(route: APIRoute) -> str:
    return route.name


app = FastAPI(
    title="Core Service ",
    description="Core Service for IsNex project",
    docs_url=None if settings.ENVIRONMENT == "production" else "/docs",
    redoc_url=None if settings.ENVIRONMENT == "production" else "/redoc",
    generate_unique_id_function=custom_generate_unique_id_function,
)

app.add_middleware(AuthMiddleware, backend=AuthBackend(), on_error=on_auth_error)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggingMiddleware)


app.include_router(router=router)

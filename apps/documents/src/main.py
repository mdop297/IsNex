from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from scalar_fastapi import get_scalar_api_reference

from src.core.middleware.authentication import (
    AuthMiddleware,
    AuthBackend,
    on_auth_error,
)
from src.core.config import settings
from src.api import router
from src.core.middleware.logging import LoggingMiddleware
from src.core.utils.logger import setup_logger

setup_logger()


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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggingMiddleware)


app.include_router(router=router)


@app.get("/testapi", include_in_schema=False)
def get_scarlar_docs():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title="Scalar API Reference",
    )

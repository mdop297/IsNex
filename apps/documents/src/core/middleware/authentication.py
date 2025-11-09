from starlette.authentication import (
    AuthCredentials,
    AuthenticationBackend,
)

from jose import jwt, JWTError, ExpiredSignatureError  # type: ignore
from starlette.requests import HTTPConnection
from starlette.middleware.authentication import AuthenticationMiddleware
from starlette.authentication import AuthenticationError
from starlette.responses import JSONResponse
from src.core.security.schemas.current_user import CurrentUser
from src.core.security.schemas.jwt_payload import JwtPayload
from src.core.utils.logger import get_logger
from src.core.config import settings


def on_auth_error(conn: HTTPConnection, exc: Exception):
    return JSONResponse({"error rồi bro": str(exc)}, status_code=401)


PUBLIC_PREFIXES = [
    "/docs",
    "/redoc",
    "/openapi.json",
    "/testapi",
    "/api/public",
    "/api/health",
]

logger = get_logger(__name__)


class AuthBackend(AuthenticationBackend):
    async def authenticate(self, conn: HTTPConnection):
        if any(conn.url.path.startswith(p) for p in PUBLIC_PREFIXES):
            return None
        token = conn.cookies.get("access_token")

        logger.info("AUTHENTICATION BACKEND REACHED!!!!!")

        if not token:
            raise AuthenticationError("Missing authentication credentials")

        try:
            payload = jwt.decode(
                token,
                key=settings.JWT_ACCESS_SECRET,
                algorithms=[settings.JWT_ALGORITHM],
            )
            jwt_payload = JwtPayload(**payload)
            current_user = CurrentUser(
                id=jwt_payload.user_id,
                email=jwt_payload.email,
                username=jwt_payload.username,
                role=jwt_payload.role,
            )

        except ExpiredSignatureError:
            raise AuthenticationError("Token expired")

        except JWTError:
            raise AuthenticationError("Invalid token")

        return AuthCredentials(["authenticated"]), current_user


class AuthMiddleware(AuthenticationMiddleware):
    pass


def public(is_public: bool = True):
    def decorator(func):
        setattr(func, "is_public", is_public)
        return func

    return decorator

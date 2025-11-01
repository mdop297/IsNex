from fastapi import HTTPException
from starlette.authentication import (
    AuthCredentials,
    AuthenticationBackend,
)

from jose import jwt, JWTError, ExpiredSignatureError  # type: ignore
from starlette.requests import HTTPConnection
from starlette.middleware.authentication import AuthenticationMiddleware
from fastapi import Request
from starlette.responses import JSONResponse
from fastapi import status
from src.schemas.extras.current_user import CurrentUser
from src.core.config import settings
from src.schemas.extras.jwt_payload import JwtPayload


def on_auth_error(request: Request, exc: Exception):
    return JSONResponse({"error": str(exc)}, status_code=401)


class AuthBackend(AuthenticationBackend):
    async def authenticate(self, conn: HTTPConnection):
        if any(conn.url.path.startswith(p) for p in settings.PUBLIC_PREFIXES):
            return None

        token = conn.cookies.get("access_token")
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing authentication credentials",
            )

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
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
            )

        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )

        return AuthCredentials(["authenticated"]), current_user


class AuthMiddleware(AuthenticationMiddleware):
    pass

from uuid import UUID
from pydantic import BaseModel, EmailStr


class JwtPayload(BaseModel):
    user_id: UUID
    email: EmailStr
    username: str
    role: str

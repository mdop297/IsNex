from uuid import UUID
from pydantic import BaseModel, EmailStr, Field
from starlette.authentication import BaseUser


class CurrentUser(BaseModel, BaseUser):
    id: UUID = Field(description="User ID")
    email: EmailStr = Field(description="User email")
    username: str = Field(description="User username")
    role: str = Field(description="User role")

    @property
    def is_authenticated(self) -> bool:
        return self.id is not None

    @property
    def display_name(self) -> str:
        return self.username

    @property
    def identity(self) -> str:
        return str(self.id)

from uuid import UUID
from pydantic import BaseModel, ConfigDict


class FolderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    parent_id: UUID
    name: str
    path: str

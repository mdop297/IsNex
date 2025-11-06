from abc import ABC, abstractmethod
from typing import Generic, Sequence, Type, TypeVar
from uuid import UUID
from pydantic import BaseModel

from src.core.repository.base import BaseRepository


from src.core.database.base import BaseTable

ModelType = TypeVar("ModelType", bound=BaseTable)
ModelCreated = TypeVar("ModelCreated", bound=BaseModel)
ModelUpdated = TypeVar("ModelUpdated", bound=BaseModel)
ModelResponse = TypeVar("ModelResponse", bound=BaseModel)
RepositoryType = TypeVar("RepositoryType", bound=BaseRepository)


class BaseService(
    Generic[ModelType, ModelCreated, ModelUpdated, ModelResponse, RepositoryType], ABC
):
    def __init__(self, model: Type[ModelType], repository: RepositoryType):
        self.model_class = model
        self.repository: RepositoryType = repository

    @abstractmethod
    async def create(self, *args, **kwargs) -> ModelResponse:
        pass

    @abstractmethod
    async def update(self, *args, **kwargs) -> ModelResponse:
        pass

    @abstractmethod
    async def delete(self, *args, **kwargs) -> bool:
        pass

    @abstractmethod
    async def get_by_id(self, *args, **kwargs) -> ModelResponse:
        pass

    @abstractmethod
    async def get_all(self, *args, **kwargs) -> Sequence[ModelResponse]:
        pass

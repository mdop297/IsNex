from abc import ABC, abstractmethod
from typing import Generic, Sequence, Type, TypeVar
from pydantic import BaseModel

from src.core.repository.base import BaseRepository


from src.core.database.base import BaseTable

ModelType = TypeVar("ModelType", bound=BaseTable)
ModelCreated = TypeVar("ModelCreated", bound=BaseModel)
ModelUpdated = TypeVar("ModelUpdated", bound=BaseModel)
ModelResponse = TypeVar("ModelResponse", bound=BaseModel)
RepositoryType = TypeVar("RepositoryType", bound=BaseRepository)
PaginatedResponseType = TypeVar("PaginatedResponseType", bound=BaseModel)


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

    # async def _get_paginated_by_user(
    #     self,
    #     user_id: UUID,
    #     response_model: Type[ModelResponse],
    #     paginated_model: Type[PaginatedResponseType],
    #     skip: int = 0,
    #     limit: int = 25,
    # ) -> PaginatedResponseType:
    #     """Generic method to get paginated data filtered by user_id"""
    #     records = await self.repository.get_by(
    #         field="user_id", value=user_id, skip=skip, limit=limit
    #     )

    #     if not records:
    #         return paginated_model(items=[], total=0, skip=skip, limit=limit)

    #     total = await self.repository.count_by(field="user_id", value=user_id)

    #     return paginated_model(
    #         items=[response_model.model_validate(r) for r in records],
    #         total=total,
    #         skip=skip,
    #         limit=limit,
    #     )

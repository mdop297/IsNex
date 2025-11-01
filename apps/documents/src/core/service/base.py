from abc import ABC, abstractmethod
from typing import Generic, Type, TypeVar
from pydantic import BaseModel

from src.core.repository.base import BaseRepository


from src.core.database.base import BaseTable

ModelType = TypeVar("ModelType", bound=BaseTable)
ModelCreated = TypeVar("ModelCreated", bound=BaseModel)
ModelUpdated = TypeVar("ModelUpdated", bound=BaseModel)


class BaseService(Generic[ModelType, ModelCreated, ModelUpdated], ABC):
    def __init__(self, model: Type[ModelType], repository: BaseRepository):
        self.model_class = model
        self.repository = repository

    @abstractmethod
    def create(self, *args, **kwargs) -> ModelType:
        pass

    @abstractmethod
    def update(self, *args, **kwargs) -> ModelType:
        pass

    @abstractmethod
    def delete(self, *args, **kwargs) -> bool:
        pass

    @abstractmethod
    def get_by_id(self, *args, **kwargs) -> ModelType:
        pass

    @abstractmethod
    def get_all(self, *args, **kwargs) -> list[ModelType]:
        pass

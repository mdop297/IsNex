from abc import ABC
from typing import Generic, Sequence, Type, TypeVar
from uuid import UUID
from pydantic import BaseModel
from sqlmodel import func
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select

from src.core.database.base import BaseTable

ModelType = TypeVar("ModelType", bound=BaseTable)
ModelCreated = TypeVar("ModelCreated", bound=BaseModel)
ModelUpdated = TypeVar("ModelUpdated", bound=BaseModel)
# JoinedModel = TypeVar("JoinedModel", bound="SQLModel")


class BaseRepository(Generic[ModelType, ModelCreated, ModelUpdated], ABC):
    def __init__(self, model_class: Type[ModelType], db_session: AsyncSession):
        self.session = db_session
        self.model_class = model_class

    async def create(self, entity: ModelCreated) -> ModelType:
        """
        Creates a new model instance.

        :param entity: The model instance to be created.
        :return: The created model instance.
        """
        entity_data = entity.model_dump()
        instance = self.model_class(**entity_data)
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)
        return instance

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[ModelType]:
        """
        Returns a list of model instances.

        :param skip: The number of records to skip.
        :param limit: The number of record to return.
        :return: A list of model instances.
        """
        stmt = select(self.model_class).offset(skip).limit(limit)
        results = await self.session.exec(stmt)
        records = results.all()
        return records

    async def get_by_id(self, id: UUID) -> ModelType | None:
        """
        Returns the model instance matching the id.

        :param id: The id to match.
        :return: The model instance or None if no match is found.
        """
        stmt = select(self.model_class).where(self.model_class.id == id)
        results = await self.session.exec(stmt)
        return results.one_or_none()

    async def update(self, entity: ModelType, obj: ModelUpdated) -> ModelType:
        """
        Partially updates the entity with the provided data (PATCH semantics).

        Args:
            entity (ModelType): The entity retrieved from the database to be updated.
            obj (ModelUpdated): Partial data for update.

        Returns:
            ModelType: The updated entity.
        """
        update_data = obj.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(entity, key, value)

        if update_data:
            self.session.add(entity)
            await self.session.commit()
            await self.session.refresh(entity)

        return entity

    async def get_by(
        self,
        field: str,
        value: str | int | bool | float | UUID,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[ModelType] | None:
        """
        Returns the model instance matching the field and value.

        :param field: The field to match.
        :param value: The value to match.
        :return: The model instance.
        """
        stmt = (
            select(self.model_class)
            .where(getattr(self.model_class, field) == value)
            .offset(skip)
            .limit(limit)
        )
        results = await self.session.exec(stmt)
        return results.all()

    async def count(self) -> int:
        """
        Returns the count of the records.

        :return: The count of the records.
        """
        stmt = select(func.count()).select_from(self.model_class)
        result = await self.session.exec(stmt)
        return result.one()

    async def count_by(self, field: str, value: str | int | bool | float | UUID) -> int:
        """
        Returns the count of the records.

        :return: The count of the records.
        """
        stmt = select(func.count()).where(getattr(self.model_class, field) == value)
        result = await self.session.exec(stmt)
        return result.one()

    async def exists(self, field: str, value: str | int | bool | float | UUID) -> bool:
        """
        Checks if a record with the given field and value exists.

        :param field: The field to match.
        :param value: The value to match.
        :return: True if a record exists, False otherwise.
        """
        stmt = select(self.model_class).where(getattr(self.model_class, field) == value)
        result = await self.session.exec(stmt)
        return result.first() is not None

    async def delete(self, id: UUID) -> bool:
        """
        Deletes the entity with the given id.

        :param id: The id of the entity to be deleted.
        :return: True if the entity was deleted, False otherwise.
        """
        entity = await self.get_by_id(id)
        if entity:
            await self.session.delete(entity)
            await self.session.commit()
            return True
        return False

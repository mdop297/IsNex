from abc import ABC
from sqlmodel.ext.asyncio.session import AsyncSession


class BaseRepository(ABC):
    def __init__(self, table, session: AsyncSession):
        self.session = session
        self.table = table

    def create(self, record):


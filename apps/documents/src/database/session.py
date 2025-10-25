from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from src.core.config import db_settings
from sqlmodel import SQLModel

engine = create_async_engine(url=db_settings.DATABASE_URL, echo=True)


async def create_tables():
    async with engine.begin() as conn:
        from src.models import BaseTable, Folder, Document, Highlight  # noqa

        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session():
    async_session = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session

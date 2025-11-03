from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.config import settings
from sqlmodel import SQLModel

engine = create_async_engine(url=settings.DATABASE_URL, echo=True)


async def create_tables():
    async with engine.begin() as conn:
        from src.models import Folder, Document, Highlight  # noqa

        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session():
    async_session = async_sessionmaker(
        bind=engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session

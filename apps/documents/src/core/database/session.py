from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.config import settings

from src.core.utils.logger import get_logger

logger = get_logger(__name__)

engine = create_async_engine(url=settings.DATABASE_URL, echo=True)

async_session = async_sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)


# async def create_tables():
#     async with engine.begin() as conn:
#         from src.models import Folder, Document, Highlight  # noqa

#         await conn.run_sync(SQLModel.metadata.create_all)


async def get_session():
    async with async_session() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database error during request: {e}")
            await session.rollback()
            raise

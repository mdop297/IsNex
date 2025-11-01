from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_DIR = Path(__file__).resolve().parent.parent


_base_config: SettingsConfigDict = SettingsConfigDict(
    env_file=PROJECT_DIR / ".env",
    env_ignore_empty=True,
    extra="ignore",
)


class Settings(BaseSettings):
    APP_NAME: str = "FastShip"
    APP_DOMAIN: str = "localhost:8000"

    POSTGRES_PASSWORD: str
    POSTGRES_USER: str
    DATABASE_NAME: str
    DATABASE_HOST: str
    DATABASE_PORT: str

    JWT_ACCESS_SECRET: str
    JWT_ACCESS_EXPIRE: int
    JWT_REFRESH_SECRET: str
    JWT_REFRESH_EXPIRE: int
    JWT_ALGORITHM: str = "HS256"
    ENVIRONMENT: str = "development"

    PUBLIC_PREFIXES = ["/api/public", "/api/health"]

    model_config = _base_config

    @property
    def DATABASE_URL(self):
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"


settings = Settings()  # type: ignore

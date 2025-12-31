from enum import Enum
from pathlib import Path
from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from dotenv import load_dotenv


PROJECT_DIR = Path(__file__).resolve().parent.parent.parent
ROOT_DIR = PROJECT_DIR.parent.parent

_base_config: SettingsConfigDict = SettingsConfigDict(
    env_file=(PROJECT_DIR / ".env", PROJECT_DIR / ".env.local"),
    env_ignore_empty=True,
    extra="ignore",
)


# Define environment types
class Environment(str, Enum):
    """Application environment types.

    Defines the possible environments the application can run in:
    development, staging, production, and test.
    """

    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TEST = "test"


# Load appropriate .env file based on environment
def load_env_file():
    """Load environment-specific .env file."""
    env = get_environment()
    base_dir = PROJECT_DIR

    # Define env files in priority order
    env_files = [
        os.path.join(ROOT_DIR, "envs/.env.dev"),
        os.path.join(base_dir, f".env.{env.value}.local"),
        os.path.join(base_dir, f".env.{env.value}"),
        os.path.join(base_dir, ".env.local"),
        os.path.join(base_dir, ".env"),
    ]

    # Load the first env file that exists
    for env_file in env_files:
        if os.path.isfile(env_file):
            load_dotenv(dotenv_path=env_file)
            print(f"Loaded environment from {env_file}")
            return env_file

    # Fall back to default if no env file found
    return None


# Determine environment
def get_environment() -> Environment:
    """Get the current environment.

    Returns:
        Environment: The current environment (development, staging, production, or test)
    """
    match os.getenv("APP_ENV", "development").lower():
        case "production" | "prod":
            return Environment.PRODUCTION
        case "staging" | "stage":
            return Environment.STAGING
        case "test":
            return Environment.TEST
        case _:
            return Environment.DEVELOPMENT


def parse_list_from_env(env_key, default=None):
    """Parse a comma-separated list from an environment variable."""
    value = os.getenv(env_key)
    if not value:
        return default or []

    # Remove quotes if they exist
    value = value.strip("\"'")
    # Handle single value case
    if "," not in value:
        return [value]
    # Split comma-separated values
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings(BaseSettings):
    APP_NAME: str = "FastShip"
    API_GATEWAY_DOMAIN: str = "localhost:9000"  # localhost:8000
    DATA_LAKE_DOMAIN: str = "localhost:9000"  # data-lake:9000
    RATE_LIMIT_DEFAULT: list[str] = parse_list_from_env(
        "RATE_LIMIT_DEFAULT", ["200 per day", "50 per hour"]
    )

    DEBUG: bool = False

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

    ENVIRONMENT: Environment = Environment.DEVELOPMENT

    OPENAI_API_KEY: SecretStr
    MAX_TOKENS: int
    DEFAULT_LLM_MODEL: str

    # Logging Configuration
    LOG_DIR: Path = Path(os.getenv("LOG_DIR", "logs"))
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = os.getenv("LOG_FORMAT", "json")  # "json" or "console"

    model_config = _base_config

    @property
    def DATABASE_URL(self):
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"

    def __init__(self, **data):
        super().__init__(**data)
        self.apply_environment_settings()

    def apply_environment_settings(self):
        """Apply environment-specific settings based on the current environment."""
        env_settings = {
            Environment.DEVELOPMENT: {
                "DEBUG": True,
                "LOG_LEVEL": "DEBUG",
                "LOG_FORMAT": "console",
                "RATE_LIMIT_DEFAULT": ["1000 per day", "200 per hour"],
            },
            Environment.STAGING: {
                "DEBUG": False,
                "LOG_LEVEL": "INFO",
                "RATE_LIMIT_DEFAULT": ["500 per day", "100 per hour"],
            },
            Environment.PRODUCTION: {
                "DEBUG": False,
                "LOG_LEVEL": "WARNING",
                "RATE_LIMIT_DEFAULT": ["200 per day", "50 per hour"],
            },
            Environment.TEST: {
                "DEBUG": True,
                "LOG_LEVEL": "DEBUG",
                "LOG_FORMAT": "console",
                "RATE_LIMIT_DEFAULT": [
                    "1000 per day",
                    "1000 per hour",
                ],  # Relaxed for testing
            },
        }

        # Get settings for current environment
        current_env_settings = env_settings.get(self.ENVIRONMENT, {})

        # Apply settings if not explicitly set in environment variables
        for key, value in current_env_settings.items():
            env_var_name = key.upper()
            # Only override if environment variable wasn't explicitly set
            if env_var_name not in os.environ:
                setattr(self, key, value)


load_env_file()
settings = Settings()  # type: ignore

if __name__ == "__main__":
    from pprint import pprint

    pprint(settings.model_dump())

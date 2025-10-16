from pydantic_settings import BaseSettings, SettingsConfigDict

from notify import PROJECT_DIR

_base_config = SettingsConfigDict(
    env_file=PROJECT_DIR / ".env",
    env_file_encoding="utf-8",
    env_ignore_empty=True,
    extra="ignore",
)


class AppSettings(BaseSettings):
    APP_NAME: str = "IsNex"
    APP_DOMAIN: str = "localhost:3000"


class Settings(BaseSettings):
    model_config = _base_config


class EmailNotificationSettings(Settings):
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_FROM_NAME: str
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True

    model_config = _base_config


class SMSNotificationSettings(Settings):
    model_config = _base_config

    TWILIO_ACCOUNT_SID: str = "account_sid"
    TWILIO_AUTH_TOKEN: str = "auth_token"
    TWILIO_PHONE_NUMBER: str = "phone_number"


app_settings = AppSettings()
email_notification_settings = EmailNotificationSettings()  # type: ignore[call-arg]

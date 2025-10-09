import asyncio

from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType

from notify import PROJECT_DIR
from notify.core.config import email_notification_settings

fastmail = FastMail(
    ConnectionConfig(
        **email_notification_settings.model_dump(),
    )
)


async def send_email() -> None:
    print(email_notification_settings.model_dump())
    print(PROJECT_DIR)
    await fastmail.send_message(
        message=MessageSchema(
            recipients=["lenhatminh12321@gmail.com"],
            subject="Your email delivered with IsNex",
            body="Hello from IsNex, your email has been delivered successfully",
            subtype=MessageType.plain,
        )
    )
    print("Email sent")


asyncio.run(send_email())

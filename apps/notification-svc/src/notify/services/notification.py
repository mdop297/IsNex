from fastapi.responses import JSONResponse
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import EmailStr

from notify.core.config import email_notification_settings
from notify.services.base import BaseService
from notify.utils import TEMPLATE_DIR


class NotificationService(BaseService):
    def __init__(self):
        self.fastmail = FastMail(
            ConnectionConfig(
                **email_notification_settings.model_dump(), TEMPLATE_FOLDER=TEMPLATE_DIR
            )
        )

    async def send_email(
        self,
        recipients: list[str],
        subject: str,
        body: str,
    ) -> JSONResponse:
        # TODO: handle exceptions

        message = MessageSchema(
            recipients=recipients,
            subject=subject,
            body=body,
            subtype=MessageType.plain,
        )
        await self.fastmail.send_message(message)
        return JSONResponse(status_code=200, content={"message": "Email sent"})

    async def send_email_with_template(
        self,
        recipients: list[EmailStr],
        subject: str,
        context: dict,
        template_name: str,
    ) -> JSONResponse:
        # TODO: handle exceptions
        message = MessageSchema(
            recipients=recipients,
            subject=subject,
            template_body=context,
            subtype=MessageType.html,
        )

        await self.fastmail.send_message(message=message, template_name=template_name)

        return JSONResponse(status_code=200, content={"message": "Email sent"})

from typing import Sequence
from uuid import UUID

from src.core.service.base import BaseService
from src.core.utils.logger import get_logger
from src.modules.conversation.repository import ConversationRepository
from src.modules.message.model import Message
from src.modules.message.repository import MessageRepository
from src.modules.message.dtos.request import MessageCreate, MessageUpdate
from src.modules.message.dtos.response import MessageResponse

logger = get_logger(__name__)


class MessageService(
    BaseService[
        Message, MessageCreate, MessageUpdate, MessageResponse, MessageRepository
    ]
):
    def __init__(
        self,
        repository: MessageRepository,
        conversation_repository: ConversationRepository,
    ):
        super().__init__(Message, repository)
        self.conversation_repository = conversation_repository

    async def create(self, user_id: UUID, entity: MessageCreate) -> MessageResponse:
        # TODO: handle case message is not from current conversation
        await self.__validate_conversation_ownership(entity.conv_id, user_id)
        result = await self.repository.create(entity)
        return MessageResponse.model_validate(result)

    async def update(
        self, user_id: UUID, id: UUID, obj: MessageUpdate
    ) -> MessageResponse:
        message = await self.__check_message_by_userid(message_id=id, user_id=user_id)

        result = await self.repository.update(entity=message, obj=obj)
        return MessageResponse.model_validate(result)

    async def delete(self, user_id: UUID, id: UUID) -> bool:
        await self.__check_message_by_userid(message_id=id, user_id=user_id)
        result = await self.repository.delete(id)
        return result

    async def get_by_id(self, user_id: UUID, id: UUID) -> MessageResponse:
        message = await self.__check_message_by_userid(message_id=id, user_id=user_id)
        return MessageResponse.model_validate(message)

    async def get_messages_of_conv(
        self, user_id: UUID, conv_id: UUID
    ) -> Sequence[MessageResponse]:
        await self.__validate_conversation_ownership(conv_id, user_id)
        result = await self.repository.get_by(field="conv_id", value=conv_id)
        if not result:
            return []
        messages = [MessageResponse.model_validate(message) for message in result]
        return messages

    async def get_all(
        self, skip: int = 0, limit: int = 100
    ) -> Sequence[MessageResponse]:
        result = await self.repository.get_all(skip, limit)
        messages = [MessageResponse.model_validate(message) for message in result]
        return messages

    # get conversation and check if it belongs to user
    async def __validate_conversation_ownership(self, conv_id: UUID, user_id: UUID):
        conv = await self.conversation_repository.get_by_id(conv_id)
        if not conv:
            raise Exception("Conversation not found")
        if conv.user_id != user_id:
            raise Exception("Conversation does not belong to user")

    # get message and check if it belongs to conversation
    async def __get_message_conversation(
        self, message_id: UUID, conv_id: UUID
    ) -> Message:
        message = await self.repository.get_by_id(message_id)
        if not message:
            raise Exception("Message not found")
        if message.conv_id != conv_id:
            raise Exception("Message does not belong to conversation")
        return message

    async def __check_message_by_userid(
        self, message_id: UUID, user_id: UUID
    ) -> Message:
        message = await self.repository.get_by_id(message_id)
        if not message:
            raise Exception("Message not found")
        if message.user_id != user_id:
            raise Exception("Message does not belong to user")
        return message

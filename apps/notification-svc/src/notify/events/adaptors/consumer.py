from typing import Any

from confluent_kafka import Consumer

from notify.events.handlers.event_manager import EventManager
from notify.events.handlers.user_created import UserCreatedHandler
from notify.services.notification import NotificationService
from notify.utils.logger import get_custom_logger

logger = get_custom_logger(__name__)


class ConsumerService:
    def __init__(self, config: dict[str, Any], topics: list[str]):
        self.consumer_conf = config | {
            "bootstrap.servers": "broker:29092",
            "group.id": "notification-svc",
            "auto.offset.reset": "earliest",
            "enable.auto.commit": False,
        }
        self.topics = topics
        self.event_manager = EventManager()
        self.notifier = NotificationService()

    def _setup_consumer(self):
        self.consumer = Consumer(self.consumer_conf)
        self.event_manager.register_handlers([UserCreatedHandler(self.notifier)])

    async def start(self):
        self._setup_consumer()
        self.consumer.subscribe(self.topics)
        logger.info(f"✅ Kafka consumer started, listening to topics: {self.topics}")

        # Poll for new messages from Kafka and print them.
        try:
            while True:
                msg = self.consumer.poll(1.0)

                if msg is None:
                    continue

                if msg.error():
                    logger.error(f"❌ Consumer error: {msg.error()}")
                    continue

                value = msg.value()
                if value is None:
                    continue

                try:
                    # Deserialize raw Protobuf - có type checking!
                    await self.event_manager.process_event(msg)

                    self.consumer.commit(asynchronous=False)
                except Exception as parse_error:
                    logger.error(f"❌ Failed to parse Protobuf message: {parse_error}")
                    logger.error(
                        f"Raw message (first 100 bytes): {value[:100].decode('utf-8', errors='replace')}"
                    )
                    continue

        except KeyboardInterrupt:
            logger.info("🛑 Consumer interrupted by user")
        except Exception as e:
            logger.exception(f"❌ Kafka consumer stopped: {e}")
        finally:
            self.consumer.close()
            logger.info("👋 Kafka consumer closed")

from confluent_kafka import Consumer

from notify.event_handlers.protos.auth_pb2 import UserCreatedEvent
from notify.utils.logger import get_custom_logger

logger = get_custom_logger(__name__)


def kafka_consumer_worker():
    consumer_conf = {
        "bootstrap.servers": "broker:29092",
        "group.id": "notification-svc",
        "auto.offset.reset": "earliest",
    }
    consumer = Consumer(consumer_conf)

    topic = "user_created"
    consumer.subscribe([topic])

    logger.info(f"✅ Kafka consumer started, listening to topic: {topic}")

    try:
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                continue

            if msg.error():
                logger.error(f"❌ Consumer error: {msg.error()}")
                continue

            msg_value = msg.value()
            if msg_value is None:
                logger.warning("⚠️ Received empty message")
                continue

            try:
                # Deserialize raw Protobuf - có type checking!
                event = UserCreatedEvent()
                event.ParseFromString(msg_value)

                user_id: str = event.userId
                email: str = event.email
                timestamp: int = event.timestamp

                logger.info(
                    f"✅ Consumed message: "
                    f"ID={user_id}, "
                    f"Email={email}, "
                    f"Timestamp={timestamp}"
                )

                # Business logic với type safety
                handle_user_created(event)

            except Exception as parse_error:
                logger.error(f"❌ Failed to parse Protobuf message: {parse_error}")
                logger.error(f"Raw message (first 100 bytes): {msg_value[:100]}")
                continue

    except KeyboardInterrupt:
        logger.info("🛑 Consumer interrupted by user")
    except Exception as e:
        logger.exception(f"❌ Kafka consumer stopped: {e}")
    finally:
        consumer.close()
        logger.info("👋 Kafka consumer closed")


def handle_user_created(event: UserCreatedEvent) -> None:
    """
    Xử lý user created event - có full type checking!

    Args:
        event: UserCreatedEvent with type hints
    """
    # IDE sẽ autocomplete các fields
    # Mypy/Pyright sẽ type check

    if not event.email:
        logger.warning("Email is empty")
        return

    logger.info(f"Processing user: {event.email}")

    # Ví dụ: gửi email chào mừng
    # send_welcome_email(event.email)

    # Ví dụ: tạo notification
    # create_notification(event.userId, f"Welcome {event.email}!")


if __name__ == "__main__":
    kafka_consumer_worker()

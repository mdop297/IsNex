"""
Kafka Consumer Architecture - Microservices Best Practices
FastAPI + Confluent-Kafka + Repository Pattern

Key Concepts:
1. One Consumer per Service (with unique consumer group)
2. Multiple Event Types per Topic (topic = entity)
3. Partition by Key for Ordering Guarantee
4. Event Manager with Strategy Pattern
5. Graceful Shutdown & Error Handling
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List, Type
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
import asyncio
import logging
from confluent_kafka import Consumer, Producer, KafkaError, KafkaException
import json
from contextlib import asynccontextmanager
import hashlib

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - [%(funcName)s] - %(message)s",
)
logger = logging.getLogger(__name__)


# ============================================================================
# DOMAIN MODELS & ENUMS
# ============================================================================


class EventType(str, Enum):
    """Định nghĩa tất cả event types - Organized by Topic"""

    # User events (topic: 'user')
    USER_CREATED = "user.created"
    USER_UPDATED = "user.updated"
    USER_DELETED = "user.deleted"
    USER_VERIFIED = "user.verified"

    # Order events (topic: 'order')
    ORDER_CREATED = "order.created"
    ORDER_UPDATED = "order.updated"
    ORDER_CANCELLED = "order.cancelled"
    ORDER_COMPLETED = "order.completed"

    # Payment events (topic: 'payment')
    PAYMENT_INITIATED = "payment.initiated"
    PAYMENT_COMPLETED = "payment.completed"
    PAYMENT_FAILED = "payment.failed"


@dataclass
class KafkaMessage:
    """Wrapper cho Kafka message"""

    topic: str
    partition: int
    offset: int
    key: Optional[str]  # IMPORTANT: Key để đảm bảo ordering
    value: Dict[str, Any]
    timestamp: datetime
    headers: Optional[Dict[str, str]] = None


@dataclass
class Event:
    """Base Event model"""

    event_id: str
    event_type: EventType
    aggregate_id: str  # IMPORTANT: user_id, order_id, etc. - Dùng làm partition key
    timestamp: datetime
    data: Dict[str, Any]
    metadata: Optional[Dict[str, Any]] = None
    version: int = 1  # Event schema version

    @classmethod
    def from_kafka_message(cls, msg: KafkaMessage) -> "Event":
        """Parse Kafka message thành Event"""
        return cls(
            event_id=msg.value.get("event_id"),
            event_type=EventType(msg.value.get("event_type")),
            aggregate_id=msg.value.get("aggregate_id"),
            timestamp=datetime.fromisoformat(msg.value.get("timestamp")),
            data=msg.value.get("data", {}),
            metadata=msg.value.get("metadata", {}),
            version=msg.value.get("version", 1),
        )

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dict for producing"""
        return {
            "event_id": self.event_id,
            "event_type": self.event_type.value,
            "aggregate_id": self.aggregate_id,
            "timestamp": self.timestamp.isoformat(),
            "data": self.data,
            "metadata": self.metadata,
            "version": self.version,
        }


# ============================================================================
# ORDERING GUARANTEE EXAMPLE
# ============================================================================


class PartitionStrategy:
    """
    Strategy để đảm bảo ordering trong Kafka

    Rule: Events cho cùng aggregate_id phải vào cùng partition
    """

    @staticmethod
    def get_partition_key(event: Event) -> str:
        """
        Return partition key để đảm bảo ordering

        Example:
        - user.created (user_id=123) → key="123" → partition 1
        - user.updated (user_id=123) → key="123" → partition 1 (same!)
        - user.deleted (user_id=123) → key="123" → partition 1 (same!)

        → Guaranteed order: created → updated → deleted ✅
        """
        return event.aggregate_id

    @staticmethod
    def calculate_partition(key: str, num_partitions: int) -> int:
        """Calculate partition number from key (for reference)"""
        # Kafka uses murmur2 hash, this is simplified
        hash_val = int(hashlib.md5(key.encode()).hexdigest(), 16)
        return hash_val % num_partitions


# ============================================================================
# REPOSITORY PATTERN
# ============================================================================


class BaseRepository(ABC):
    """Base repository interface"""

    @abstractmethod
    async def create(self, entity: Any) -> Any:
        pass

    @abstractmethod
    async def update(self, entity_id: str, data: Dict) -> Any:
        pass

    @abstractmethod
    async def delete(self, entity_id: str) -> bool:
        pass

    @abstractmethod
    async def get_by_id(self, entity_id: str) -> Optional[Any]:
        pass


class UserRepository(BaseRepository):
    """User repository - User Service specific"""

    def __init__(self, db_session):
        self.db = db_session

    async def create(self, entity: Dict) -> Dict:
        logger.info(f"[UserRepo] Creating user: {entity.get('user_id')}")
        # Implement actual DB logic
        return entity

    async def update(self, entity_id: str, data: Dict) -> Dict:
        logger.info(f"[UserRepo] Updating user {entity_id}")
        # Implement actual DB logic
        return data

    async def delete(self, entity_id: str) -> bool:
        logger.info(f"[UserRepo] Deleting user: {entity_id}")
        # Implement actual DB logic
        return True

    async def get_by_id(self, entity_id: str) -> Optional[Dict]:
        # Implement actual DB logic
        return None


class OrderRepository(BaseRepository):
    """Order repository - Order Service specific"""

    def __init__(self, db_session):
        self.db = db_session

    async def create(self, entity: Dict) -> Dict:
        logger.info(f"[OrderRepo] Creating order: {entity.get('order_id')}")
        return entity

    async def update(self, entity_id: str, data: Dict) -> Dict:
        logger.info(f"[OrderRepo] Updating order {entity_id}")
        return data

    async def delete(self, entity_id: str) -> bool:
        logger.info(f"[OrderRepo] Cancelling order: {entity_id}")
        return True

    async def get_by_id(self, entity_id: str) -> Optional[Dict]:
        return None


# ============================================================================
# EVENT HANDLERS (Strategy Pattern)
# ============================================================================


class EventHandler(ABC):
    """Base Event Handler interface"""

    @abstractmethod
    async def handle(self, event: Event) -> bool:
        """
        Handle event
        Returns: True if success, False if failed
        """
        pass

    @abstractmethod
    def can_handle(self, event_type: EventType) -> bool:
        """Check if handler can handle this event type"""
        pass

    def get_handler_name(self) -> str:
        """Get handler name for logging"""
        return self.__class__.__name__


class UserCreatedHandler(EventHandler):
    """Handler cho event user.created"""

    def __init__(self, user_repository: UserRepository):
        self.user_repo = user_repository

    def can_handle(self, event_type: EventType) -> bool:
        return event_type == EventType.USER_CREATED

    async def handle(self, event: Event) -> bool:
        try:
            logger.info(
                f"[{self.get_handler_name()}] Processing event: {event.event_id}"
            )

            user_data = event.data
            user_id = event.aggregate_id

            # Check if user already exists (idempotency at handler level)
            existing = await self.user_repo.get_by_id(user_id)
            if existing:
                logger.warning(f"User {user_id} already exists, skipping creation")
                return True

            await self.user_repo.create(user_data)
            logger.info(
                f"[{self.get_handler_name()}] Successfully created user: {user_id}"
            )
            return True

        except Exception as e:
            logger.error(f"[{self.get_handler_name()}] Error: {e}", exc_info=True)
            return False


class UserUpdatedHandler(EventHandler):
    """Handler cho event user.updated"""

    def __init__(self, user_repository: UserRepository):
        self.user_repo = user_repository

    def can_handle(self, event_type: EventType) -> bool:
        return event_type == EventType.USER_UPDATED

    async def handle(self, event: Event) -> bool:
        try:
            logger.info(
                f"[{self.get_handler_name()}] Processing event: {event.event_id}"
            )

            user_id = event.aggregate_id
            updates = event.data.get("updates", {})

            await self.user_repo.update(user_id, updates)
            logger.info(
                f"[{self.get_handler_name()}] Successfully updated user: {user_id}"
            )
            return True

        except Exception as e:
            logger.error(f"[{self.get_handler_name()}] Error: {e}", exc_info=True)
            return False


class UserDeletedHandler(EventHandler):
    """Handler cho event user.deleted"""

    def __init__(self, user_repository: UserRepository):
        self.user_repo = user_repository

    def can_handle(self, event_type: EventType) -> bool:
        return event_type == EventType.USER_DELETED

    async def handle(self, event: Event) -> bool:
        try:
            logger.info(
                f"[{self.get_handler_name()}] Processing event: {event.event_id}"
            )

            user_id = event.aggregate_id
            await self.user_repo.delete(user_id)

            logger.info(
                f"[{self.get_handler_name()}] Successfully deleted user: {user_id}"
            )
            return True

        except Exception as e:
            logger.error(f"[{self.get_handler_name()}] Error: {e}", exc_info=True)
            return False


# Example: Order Service Handlers
class OrderCreatedHandler(EventHandler):
    """Handler for order.created - Used in Order Service"""

    def __init__(self, order_repository: OrderRepository):
        self.order_repo = order_repository

    def can_handle(self, event_type: EventType) -> bool:
        return event_type == EventType.ORDER_CREATED

    async def handle(self, event: Event) -> bool:
        try:
            logger.info(
                f"[{self.get_handler_name()}] Processing event: {event.event_id}"
            )

            order_data = event.data
            await self.order_repo.create(order_data)

            logger.info(f"[{self.get_handler_name()}] Successfully created order")
            return True

        except Exception as e:
            logger.error(f"[{self.get_handler_name()}] Error: {e}", exc_info=True)
            return False


# ============================================================================
# EVENT MANAGER
# ============================================================================


class EventManager:
    """
    Event Manager - Central orchestrator

    Responsibilities:
    - Registry handlers
    - Route events to appropriate handlers
    - Handle idempotency (at manager level)
    - Metrics & monitoring
    """

    def __init__(self, service_name: str):
        self.service_name = service_name
        self._handlers: Dict[EventType, EventHandler] = {}
        self._processed_events: set = set()  # In production: use Redis with TTL
        self.metrics = {"processed": 0, "failed": 0, "duplicate": 0, "no_handler": 0}

    def register_handler(self, handler: EventHandler) -> None:
        """Register a single event handler"""
        for event_type in EventType:
            if handler.can_handle(event_type):
                if event_type in self._handlers:
                    logger.warning(
                        f"[{self.service_name}] Overriding handler for {event_type}"
                    )
                self._handlers[event_type] = handler
                logger.info(
                    f"[{self.service_name}] Registered {handler.get_handler_name()} "
                    f"for {event_type.value}"
                )

    def register_handlers(self, handlers: List[EventHandler]) -> None:
        """Register multiple handlers"""
        for handler in handlers:
            self.register_handler(handler)

        logger.info(
            f"[{self.service_name}] Registered {len(self._handlers)} handlers for "
            f"{len(handlers)} event types"
        )

    async def process_event(self, event: Event) -> bool:
        """
        Process event với idempotency check
        Returns: True if processed successfully
        """
        # Global idempotency check (manager level)
        if self._is_processed(event.event_id):
            logger.info(
                f"[{self.service_name}] Event {event.event_id} already processed "
                f"(type: {event.event_type.value}), skipping"
            )
            self.metrics["duplicate"] += 1
            return True

        # Get handler
        handler = self._handlers.get(event.event_type)
        if not handler:
            logger.warning(
                f"[{self.service_name}] No handler found for event type: "
                f"{event.event_type.value}"
            )
            self.metrics["no_handler"] += 1
            # Not an error - this service might not care about this event type
            return True

        # Process event
        try:
            success = await handler.handle(event)

            if success:
                self._mark_processed(event.event_id)
                self.metrics["processed"] += 1
                logger.info(
                    f"[{self.service_name}] Successfully processed event: "
                    f"{event.event_id} (type: {event.event_type.value})"
                )
                return True
            else:
                self.metrics["failed"] += 1
                logger.error(
                    f"[{self.service_name}] Failed to process event: "
                    f"{event.event_id} (type: {event.event_type.value})"
                )
                return False

        except Exception as e:
            logger.error(
                f"[{self.service_name}] Exception processing event {event.event_id}: {e}",
                exc_info=True,
            )
            self.metrics["failed"] += 1
            return False

    def _is_processed(self, event_id: str) -> bool:
        """
        Check if event already processed (idempotency)

        In production: Use Redis with TTL
        Example:
            redis.set(f"event:{event_id}", "1", ex=86400)  # 24h TTL
        """
        return event_id in self._processed_events

    def _mark_processed(self, event_id: str) -> None:
        """
        Mark event as processed

        In production: Store in Redis with TTL
        """
        self._processed_events.add(event_id)

    def get_metrics(self) -> Dict[str, int]:
        """Get processing metrics"""
        return {"service": self.service_name, **self.metrics}

    def get_registered_handlers(self) -> List[str]:
        """Get list of registered event types"""
        return [et.value for et in self._handlers.keys()]


# ============================================================================
# KAFKA CONSUMER SERVICE
# ============================================================================


class KafkaConsumerConfig:
    """Kafka Consumer configuration"""

    def __init__(
        self,
        bootstrap_servers: str,
        group_id: str,  # IMPORTANT: Each microservice has unique group_id
        topics: List[str],  # Subscribe to multiple topics
        auto_offset_reset: str = "earliest",
        enable_auto_commit: bool = False,
        max_poll_interval_ms: int = 300000,
    ):
        self.bootstrap_servers = bootstrap_servers
        self.group_id = group_id
        self.topics = topics
        self.auto_offset_reset = auto_offset_reset
        self.enable_auto_commit = enable_auto_commit
        self.max_poll_interval_ms = max_poll_interval_ms

    def to_dict(self) -> Dict[str, Any]:
        """Convert to confluent-kafka config dict"""
        return {
            "bootstrap.servers": self.bootstrap_servers,
            "group.id": self.group_id,
            "auto.offset.reset": self.auto_offset_reset,
            "enable.auto.commit": self.enable_auto_commit,
            "max.poll.interval.ms": self.max_poll_interval_ms,
            "session.timeout.ms": 30000,
            "heartbeat.interval.ms": 10000,
            "max.poll.records": 500,  # Batch size
        }


class KafkaConsumerService:
    """
    Main Kafka Consumer Service for Microservices

    Key Features:
    - One consumer per service instance
    - Subscribe to multiple topics
    - Integrate with EventManager
    - Graceful shutdown
    - Retry logic with exponential backoff
    - Dead Letter Queue (DLQ) support
    """

    def __init__(
        self,
        config: KafkaConsumerConfig,
        event_manager: EventManager,
        max_retries: int = 3,
        dlq_producer: Optional[Producer] = None,
    ):
        self.config = config
        self.event_manager = event_manager
        self.max_retries = max_retries
        self.dlq_producer = dlq_producer
        self.consumer: Optional[Consumer] = None
        self.running = False

    def _create_consumer(self) -> Consumer:
        """Create Confluent Kafka Consumer"""
        consumer = Consumer(self.config.to_dict())
        consumer.subscribe(self.config.topics)
        logger.info(
            f"[{self.event_manager.service_name}] Consumer subscribed to topics: "
            f"{self.config.topics} with group_id: {self.config.group_id}"
        )
        return consumer

    async def _process_message_with_retry(self, msg: KafkaMessage) -> bool:
        """Process message with retry logic and exponential backoff"""
        event = Event.from_kafka_message(msg)

        for attempt in range(self.max_retries + 1):
            try:
                success = await self.event_manager.process_event(event)
                if success:
                    return True

                # Failed but no exception
                if attempt < self.max_retries:
                    wait_time = 2**attempt  # Exponential backoff: 1s, 2s, 4s
                    logger.warning(
                        f"[{self.event_manager.service_name}] Retry {attempt + 1}/{self.max_retries} "
                        f"for event {event.event_id} after {wait_time}s"
                    )
                    await asyncio.sleep(wait_time)

            except Exception as e:
                logger.error(
                    f"[{self.event_manager.service_name}] Attempt {attempt + 1} failed "
                    f"for event {event.event_id}: {e}"
                )
                if attempt < self.max_retries:
                    await asyncio.sleep(2**attempt)

        # All retries failed - send to DLQ
        logger.error(
            f"[{self.event_manager.service_name}] Failed to process event {event.event_id} "
            f"after {self.max_retries} retries"
        )
        await self._send_to_dlq(msg, event)
        return False

    async def _send_to_dlq(self, msg: KafkaMessage, event: Event):
        """
        Send failed message to Dead Letter Queue

        DLQ topic naming: {original_topic}.dlq
        Example: 'user' → 'user.dlq'
        """
        if not self.dlq_producer:
            logger.warning("DLQ producer not configured, skipping DLQ")
            return

        dlq_topic = f"{msg.topic}.dlq"

        try:
            dlq_message = {
                "original_topic": msg.topic,
                "original_partition": msg.partition,
                "original_offset": msg.offset,
                "failed_at": datetime.now().isoformat(),
                "service": self.event_manager.service_name,
                "event": event.to_dict(),
                "error_count": self.max_retries,
            }

            self.dlq_producer.produce(
                topic=dlq_topic,
                key=msg.key,
                value=json.dumps(dlq_message).encode("utf-8"),
            )
            self.dlq_producer.flush()

            logger.warning(
                f"[{self.event_manager.service_name}] Sent to DLQ: "
                f"topic={dlq_topic}, event_id={event.event_id}"
            )
        except Exception as e:
            logger.error(f"Failed to send to DLQ: {e}")

    async def start(self):
        """Start consuming messages"""
        self.consumer = self._create_consumer()
        self.running = True
        logger.info(f"[{self.event_manager.service_name}] Kafka Consumer started")

        # Log registered handlers
        logger.info(
            f"[{self.event_manager.service_name}] Registered handlers for: "
            f"{self.event_manager.get_registered_handlers()}"
        )

        try:
            while self.running:
                # Poll message (non-blocking trong async context)
                msg = await asyncio.get_event_loop().run_in_executor(
                    None, self.consumer.poll, 1.0
                )

                if msg is None:
                    continue

                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        logger.debug(
                            f"[{self.event_manager.service_name}] Reached end of partition: "
                            f"{msg.topic()}[{msg.partition()}]"
                        )
                    else:
                        logger.error(
                            f"[{self.event_manager.service_name}] Consumer error: {msg.error()}"
                        )
                    continue

                # Parse message
                try:
                    kafka_msg = KafkaMessage(
                        topic=msg.topic(),
                        partition=msg.partition(),
                        offset=msg.offset(),
                        key=msg.key().decode("utf-8") if msg.key() else None,
                        value=json.loads(msg.value().decode("utf-8")),
                        timestamp=datetime.fromtimestamp(msg.timestamp()[1] / 1000),
                    )
                except Exception as e:
                    logger.error(f"Failed to parse message: {e}")
                    continue

                logger.info(
                    f"[{self.event_manager.service_name}] Received message: "
                    f"topic={kafka_msg.topic}, partition={kafka_msg.partition}, "
                    f"offset={kafka_msg.offset}, key={kafka_msg.key}"
                )

                # Process message with retry
                success = await self._process_message_with_retry(kafka_msg)

                # IMPORTANT: Manual commit ONLY after successful processing
                if success:
                    try:
                        self.consumer.commit(asynchronous=False)
                        logger.debug(
                            f"[{self.event_manager.service_name}] Committed offset: "
                            f"{kafka_msg.offset}"
                        )
                    except Exception as e:
                        logger.error(f"Failed to commit offset: {e}")

                # Log metrics periodically
                if self.event_manager.metrics["processed"] % 100 == 0:
                    logger.info(
                        f"[{self.event_manager.service_name}] Metrics: "
                        f"{self.event_manager.get_metrics()}"
                    )

        except KeyboardInterrupt:
            logger.info(
                f"[{self.event_manager.service_name}] Received interrupt signal"
            )
        except Exception as e:
            logger.error(
                f"[{self.event_manager.service_name}] Consumer error: {e}",
                exc_info=True,
            )
        finally:
            await self.stop()

    async def stop(self):
        """Graceful shutdown"""
        logger.info(f"[{self.event_manager.service_name}] Stopping Kafka Consumer...")
        self.running = False

        if self.consumer:
            try:
                self.consumer.close()
                logger.info(f"[{self.event_manager.service_name}] Consumer closed")
            except Exception as e:
                logger.error(f"Error closing consumer: {e}")

        logger.info(
            f"[{self.event_manager.service_name}] Final metrics: "
            f"{self.event_manager.get_metrics()}"
        )


# ============================================================================
# FASTAPI INTEGRATION - MICROSERVICE EXAMPLE
# ============================================================================


class ConsumerLifecycle:
    """Manage consumer lifecycle in FastAPI"""

    def __init__(self):
        self.consumer_service: Optional[KafkaConsumerService] = None
        self.consumer_task: Optional[asyncio.Task] = None

    async def start(
        self,
        config: KafkaConsumerConfig,
        event_manager: EventManager,
        dlq_producer: Optional[Producer] = None,
    ):
        """Start consumer in background"""
        self.consumer_service = KafkaConsumerService(
            config, event_manager, dlq_producer=dlq_producer
        )
        self.consumer_task = asyncio.create_task(self.consumer_service.start())
        logger.info(f"[{event_manager.service_name}] Consumer lifecycle started")

    async def stop(self):
        """Stop consumer"""
        if self.consumer_service:
            await self.consumer_service.stop()

        if self.consumer_task:
            self.consumer_task.cancel()
            try:
                await self.consumer_task
            except asyncio.CancelledError:
                pass

        logger.info("Consumer lifecycle stopped")


# ============================================================================
# EXAMPLE: USER SERVICE
# ============================================================================

from fastapi import FastAPI

# Global instances for User Service
user_service_consumer = ConsumerLifecycle()


@asynccontextmanager
async def user_service_lifespan(app: FastAPI):
    """User Service Lifespan"""
    logger.info("🚀 User Service starting up...")

    # Initialize dependencies
    db_session = None  # Your DB session

    # Setup repositories
    user_repo = UserRepository(db_session)

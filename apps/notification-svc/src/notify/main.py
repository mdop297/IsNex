import asyncio
import threading
from contextlib import asynccontextmanager

from fastapi import FastAPI

from notify.events.adaptors.consumer import ConsumerService
from notify.utils.logger import get_custom_logger

logger = get_custom_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    consumer_conf = {
        "bootstrap.servers": "broker:29092",
        "group.id": "notification-svc",
        "auto.offset.reset": "earliest",
        "enable.auto.commit": False,
    }
    consumer = ConsumerService(consumer_conf, ["user_created"])

    def run_consumer():
        asyncio.run(consumer.start())

    thread = threading.Thread(target=run_consumer, daemon=True)
    thread.start()
    logger.info("Kafka consumer thread started")
    yield
    logger.info("App shutdown")


app = FastAPI(
    lifespan=lifespan,
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

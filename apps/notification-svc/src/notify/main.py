import threading
from contextlib import asynccontextmanager

from fastapi import FastAPI

from notify.infrastructure.kafka.consumer import kafka_consumer_worker
from notify.utils.logger import get_custom_logger

logger = get_custom_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    thread = threading.Thread(target=kafka_consumer_worker, daemon=True)
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

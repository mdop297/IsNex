# logger.py
import logging
from logging import Logger

from notify import LOG_DIR

# Tạo logger chính
logger = logging.getLogger("notify")
logger.setLevel(logging.DEBUG)

# Formatter cho file
file_formatter = logging.Formatter(
    fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

# Console handler đơn giản (stdout)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))

# File handler
file_handler = logging.FileHandler(LOG_DIR / "app.log", encoding="utf-8")
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(file_formatter)

# Chỉ thêm handler nếu chưa có
if not logger.handlers:
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)


def get_custom_logger(name: str = "") -> Logger:
    """Return a child logger with given name."""
    return logger.getChild(name) if name != "" else logger

# logger.py
import logging

from rich.console import Console
from rich.logging import RichHandler

from notify import LOG_DIR

logger = logging.getLogger("notify")
logger.setLevel(logging.DEBUG)

file_formatter = logging.Formatter(
    fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

console = Console(stderr=True)
rich_handler = RichHandler(
    console=console,
    show_path=False,
    rich_tracebacks=True,
    markup=True,
)
rich_handler.setLevel(logging.INFO)
rich_handler.setFormatter(logging.Formatter("%(message)s"))

file_handler = logging.FileHandler(LOG_DIR / "app.log", encoding="utf-8")
file_handler.setLevel(logging.WARNING)
file_handler.setFormatter(file_formatter)

if not logger.handlers:
    logger.addHandler(rich_handler)
    logger.addHandler(file_handler)


def get_logger(name: str = None):  # type: ignore
    """Return a child logger with given name."""
    return logger.getChild(name) if name else logger


# how to use this logger
# logger = get_logger(__name__)

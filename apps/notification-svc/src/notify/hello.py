from logging import Logger

from notify.utils.logger import get_custom_logger

logger: Logger = get_custom_logger(__name__)


def test_log() -> None:
    logger.debug("Debug info for developers 🧠")
    logger.info("[bold green]Service started successfully 🚀[/bold green]")
    logger.warning("[yellow]This might cause performance issues[/yellow]")
    logger.error("[bold red]Something went wrong![/bold red]")
    try:
        1 / 0
    except Exception:
        logger.exception("Unexpected error occurred")


if __name__ == "__main__":
    test_log()

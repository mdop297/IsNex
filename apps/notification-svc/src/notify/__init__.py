from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent.parent
LOG_DIR = PROJECT_DIR / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

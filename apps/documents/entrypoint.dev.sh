#!/bin/bash
set -e

# Chạy app FastAPI ở background
fastapi dev --host 0.0.0.0 src/main.py &

# Watch uv.lock
UV_LOCK=/app/uv.lock
LAST_HASH=""
while true; do
    NEW_HASH=$(sha256sum $UV_LOCK)
    if [[ "$NEW_HASH" != "$LAST_HASH" ]]; then
        echo "uv.lock changed, running uv sync..."
        uv sync --locked --quiet
        LAST_HASH=$NEW_HASH
    fi
    sleep 5
done
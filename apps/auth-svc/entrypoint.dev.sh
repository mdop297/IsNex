#!/bin/sh

SCHEMA_PATH="./prisma/schema.prisma"
HASH_FILE="./.schema_checksum"

generate_hash() {
  sha256sum "$SCHEMA_PATH" | awk '{print $1}'
}

CURRENT_HASH=$(generate_hash)
LAST_HASH=$(cat "$HASH_FILE" 2>/dev/null)

if [ "$CURRENT_HASH" != "$LAST_HASH" ]; then
  echo "schema.prisma changed. Running migrate & generate..."
  pnpx prisma migrate dev --skip-seed --schema=$SCHEMA_PATH
  pnpx prisma generate --schema=$SCHEMA_PATH
  echo "$CURRENT_HASH" > "$HASH_FILE"
else
  echo "schema.prisma unchanged. Skipping migrate & generate."
fi

echo "Stopping any existing process on port 3000..."
fuser -k 3000/tcp || true

echo "Starting the app..."
pnpm run start:dev
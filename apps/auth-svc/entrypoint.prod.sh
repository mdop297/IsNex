#!/bin/sh

SCHEMA_PATH="./prisma/schema.prisma"


echo "Running migrate & generate..."
pnpx prisma migrate deploy --schema=$SCHEMA_PATH


echo "Starting the app..."
pnpm run start:prod
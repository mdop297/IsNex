#!/bin/sh

SCHEMA_PATH="./prisma/schema.prisma"


echo "Running migrate & generate..."
npx prisma migrate deploy --schema=$SCHEMA_PATH


echo "Starting the app..."
npm run start:prod
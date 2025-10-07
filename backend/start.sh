#!/bin/sh
set -e

echo "Running prisma migrate deploy..."
# Aplica migraciones ya existentes a la DB real de producción
#pnpm prisma migrate deploy

echo "Starting app..."
node dist/main.js

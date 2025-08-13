#!/bin/bash
echo "Esperando a que la base de datos esté disponible..."

# Espera hasta que PostgreSQL esté disponible (reintenta 10 veces)
for i in {1..10}; do
  nc -z srv-captain--beloop-db 5432 && break
  echo "Base de datos no disponible aún... esperando..."
  sleep 3
done

# Ahora Prisma
pnpm prisma generate
#pnpm prisma db push --force-reset
#pnpm prisma migrate deploy
#pnpm ts-node src/users/crearAdmin.ts
# Iniciar la app NestJS
pnpm start:prod

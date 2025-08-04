# Etapa de build
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*
RUN apt-get install -y openssl
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY backend/ ./

# Generar Prisma Client con binarios específicos
RUN pnpm prisma generate

# Compilar el proyecto
RUN pnpm run build

# Etapa final
FROM node:20-slim

WORKDIR /app
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
RUN pnpm prisma generate
RUN pnpm prisma migrate deploy

EXPOSE 3001

CMD ["pnpm", "start:prod"]

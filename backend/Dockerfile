# ---- Etapa de build ----
FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependencias del sistema necesarias para dependencias nativas
RUN apt-get update && apt-get install -y \
  python3 \
  build-essential \
  libssl-dev \
  && rm -rf /var/lib/apt/lists/*

# Habilitar pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --unsafe-perm=true

COPY backend/ .

RUN pnpm install
RUN pnpm run generate

RUN pnpm run build

# Debug (opcional)
RUN echo "Contenido de /app tras build:" && ls -al /app
RUN echo "Contenido de dist:" && ls -al /app/dist || echo "dist no existe"

# ---- Etapa final ----
FROM node:20-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
RUN pnpm install
RUN pnpm run build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]


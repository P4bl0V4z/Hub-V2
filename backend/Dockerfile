# ---------- Etapa de build ----------
FROM node:20-slim AS builder

WORKDIR /app/backend

# Prisma Generate necesita schema y un DATABASE_URL válido (puede ser dummy)
ARG DATABASE_URL=postgresql://user:pass@localhost:5432/db?schema=public
ENV DATABASE_URL=$DATABASE_URL

# Herramientas necesarias para dependencias nativas y openssl
RUN apt-get update && apt-get install -y \
  python3 build-essential libssl-dev openssl \
  && rm -rf /var/lib/apt/lists/*

# PNPM
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Instala deps del backend
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copia el código del backend (incluye prisma/)
COPY backend/ ./

# Genera Prisma Client (usa /app/backend/prisma/schema.prisma)
RUN pnpm prisma generate
# Compila a /app/backend/dist
RUN pnpm tsc -p tsconfig.build.json

# ---------- Etapa final ----------
FROM node:20-slim

WORKDIR /app/backend

# libs nativas
RUN apt-get update && apt-get install -y openssl libssl-dev \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copia artefactos del builder (dist, node_modules, prisma, package.json, etc.)
COPY --from=builder /app/backend/ ./

# Puerto interno que expone tu app Nest
EXPOSE 3001

# Script de arranque
RUN chmod +x start.sh
CMD ["./start.sh"]

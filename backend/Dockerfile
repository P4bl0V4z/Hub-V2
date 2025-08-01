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

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias incluyendo scripts de build (prisma, bcrypt, etc.)
RUN pnpm install --frozen-lockfile --unsafe-perm=true

# Copiar el resto del código del backend
COPY . .

# Generar Prisma client y compilar NestJS
RUN pnpm run generate
RUN pnpm run build

# ---- Etapa final (producción) ----
FROM node:20-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copiar solo lo necesario para producción
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]

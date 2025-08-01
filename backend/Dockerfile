# ---- Etapa de build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Usar Corepack para controlar versiones consistentes de pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copiar archivos de dependencias
COPY backend/package.json backend/pnpm-lock.yaml ./

# Instalar dependencias incluyendo scripts de postinstall
RUN pnpm install --frozen-lockfile --unsafe-perm=true

# Copiar el resto del código del backend
COPY backend/ .

# Generar Prisma client y compilar NestJS
RUN pnpm run generate
RUN pnpm run build

# ---- Etapa final (producción) ----
FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copiar archivos necesarios
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]

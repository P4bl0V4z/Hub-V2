# ---- Etapa de build ----
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar sólo archivos de dependencias
COPY backend/package.json backend/pnpm-lock.yaml ./backend/

# Instalar dependencias dentro de backend
WORKDIR /app/backend
RUN pnpm install --frozen-lockfile

# Copiar el resto del código del backend
COPY backend/ .

# Generar cliente Prisma
RUN npx prisma generate

# Compilar el proyecto NestJS
RUN pnpm run build

# ---- Etapa final: producción ----
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar archivos necesarios desde el builder
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/backend/pnpm-lock.yaml ./
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]

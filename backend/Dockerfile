# ---- Etapa de build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copiar dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar todas las dependencias (dev y prod)
RUN pnpm install --frozen-lockfile

# Copiar el resto del código del backend
COPY . .

# Generar Prisma client usando el script del package.json
RUN pnpm run generate

# Compilar NestJS
RUN pnpm run build

# ---- Etapa final (producción) ----
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copiar archivos necesarios para producción
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]

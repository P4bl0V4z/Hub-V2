# ---- Etapa de build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias (con devDependencies)
RUN pnpm install --frozen-lockfile

# Copiar el resto del código del backend
COPY . .

# Generar Prisma client
RUN npx prisma generate

# Compilar NestJS
RUN pnpm run build

# ---- Etapa final ----
FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/main.js"]

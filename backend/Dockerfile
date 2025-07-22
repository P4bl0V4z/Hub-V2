# ---- Etapa de build ----
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar pnpm (ya que tu proyecto usa pnpm)
RUN npm install -g pnpm

# Copiar solo archivos necesarios para instalar dependencias
COPY backend/package.json backend/pnpm-lock.yaml ./

# Instalar dependencias (sin dev para producción si quieres optimizar)
RUN pnpm install --frozen-lockfile

# Copiar todo el backend
COPY backend/ .

# Compilar NestJS
RUN pnpm run build

# ---- Etapa final (más liviana) ----
FROM node:18-alpine

WORKDIR /app

# Instalar pnpm también en la imagen final
RUN npm install -g pnpm

# Copiar solo node_modules y build del builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 3001

CMD ["node", "dist/main.js"]

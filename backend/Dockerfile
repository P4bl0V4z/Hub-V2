# ---- Etapa de build ----
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY backend/package.json backend/pnpm-lock.yaml ./

# Instalar dependencias (incluye devDependencies)
RUN pnpm install --frozen-lockfile

# Copiar el resto del backend
COPY backend/ .

# Generar Prisma client
RUN npx prisma generate

# Compilar el proyecto (NestJS)
RUN pnpm run build

# ---- Etapa final: producción ----
FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar sólo lo necesario para producción
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma  # si usás migrations o schema

# Exponer el puerto de NestJS
EXPOSE 3001

# Usar el archivo de salida principal
CMD ["node", "dist/main.js"]

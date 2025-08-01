# ---- Etapa de build ----
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm
# Copiar dependencias
COPY backend/package*.json backend/pnpm-lock.yaml ./

# Instalar todas las dependencias (dev y prod)
RUN pnpm install --frozen-lockfile

# Copiar el resto del código del backend
COPY backend/ .
# Generar Prisma client usando el script del package.json
RUN npx prisma generate
RUN pnpm run build
# ---- Etapa final (producción) ----
FROM node:20-alpine

WORKDIR /app
RUN npm install -g pnpm

# Copiar archivos necesarios para producción
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
CMD rm -rf node_modules
RUN pnpm install --force
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]

# ---- Etapa de build ----
FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY frontend/ .
RUN pnpm run build

# ---- Etapa final con Nginx ----
FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración custom para React Router
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

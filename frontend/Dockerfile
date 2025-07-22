FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Copiar solo package.json
COPY frontend/package.json ./

# Instalar dependencias sin lockfile
RUN pnpm install --no-frozen-lockfile

# Copiar el resto del frontend
COPY frontend/ .

# Construir frontend
RUN pnpm run build

# Servir con nginx
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


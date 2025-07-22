# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la app NestJS
RUN npm run build

# Etapa 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Copiar solo lo necesario desde builder
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Instalar solo dependencias de producción
RUN npm install --omit=dev

# Exponer puerto (el mismo que usas en main.ts)
EXPOSE 3001

# Comando para iniciar NestJS
CMD ["node", "dist/main.js"]

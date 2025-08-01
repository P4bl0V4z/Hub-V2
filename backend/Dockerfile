# --- ETAPA DE BUILD ---
# Usa una imagen de Node.js ligera para la fase de construcción.
FROM node:20-alpine AS builder

# Instala pnpm globalmente. Es buena práctica hacerlo al principio si lo vas a usar repetidamente.
RUN npm install -g pnpm

# Establece el directorio de trabajo dentro del contenedor para la aplicación.
# Este será el directorio raíz de tu proyecto dentro del contenedor.
WORKDIR /app

# Copia los archivos de configuración de dependencias de tu carpeta 'backend' local
# al directorio de trabajo actual (/app) en el contenedor.
COPY backend/package.json backend/pnpm-lock.yaml ./

# Instala todas las dependencias (desarrollo y producción) necesarias para el build.
RUN pnpm install --frozen-lockfile

# Copia el resto del código de tu aplicación desde la carpeta 'backend' local
# al directorio de trabajo actual (/app) en el contenedor.
COPY backend/ .

# Genera el cliente de Prisma. Esto DEBE ocurrir después de copiar todo el código
# y de instalar las dependencias, ya que necesita el esquema y los módulos.
RUN npx prisma generate

# Ejecuta el script de build de tu aplicación NestJS.
# Esto generará la carpeta 'dist' con tu código compilado en /app/dist.
RUN pnpm run build

# --- ETAPA FINAL (PRODUCCIÓN) ---
# Usa una imagen de Node.js más pequeña para la ejecución en producción.
FROM node:20-alpine

# Instala pnpm globalmente también en la imagen final para poder instalar --prod.
RUN npm install -g pnpm

# Establece el directorio de trabajo.
WORKDIR /app

# Copia solo los archivos de manifiesto de dependencias desde la etapa 'builder'.
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Instala SOLO las dependencias de producción.
# El `--frozen-lockfile` garantiza versiones consistentes.
# El `--force` puede ser útil si experimentas problemas de caché, pero generalmente no es necesario.
# Si tus builds anteriores fueron problemáticos, puedes dejarlo, sino, quítalo para builds más rápidos.
RUN pnpm install --prod --frozen-lockfile # --force (puedes añadirlo si lo necesitas)

# Copia la carpeta 'dist' que fue generada en la etapa de build.
# Este es el código compilado de tu aplicación.
COPY --from=builder /app/dist ./dist

# Copia los archivos de Prisma necesarios para la ejecución.
# Esto incluye los binarios del cliente Prisma que están en node_modules/@prisma.
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# Si tu schema.prisma está fuera de la carpeta dist, también cópialo.
COPY --from=builder /app/prisma ./prisma

# Expone el puerto en el que escucha tu aplicación NestJS.
EXPOSE 3001

# Define el comando para iniciar tu aplicación en producción.
# Asegúrate de que 'dist/main.js' sea la ruta correcta a tu punto de entrada compilado.
CMD ["node", "dist/main.js"]

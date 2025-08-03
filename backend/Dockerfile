FROM node:20-slim AS builder

WORKDIR /app

# Instalar dependencias necesarias para la compilación de paquetes nativos (si los hubiera)
# Esto solo se hace en la etapa de build, no en la final.
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libssl-dev \
    # Si usas prisma, podrías necesitar paquetes como `libsqlite3-dev` para el provider SQLite,
    # o dependiendo de tu base de datos (PostgreSQL: `libpq-dev`, MySQL: `libmysqlclient-dev`).
    # Agrega aquí si es el caso, por ejemplo:
    # libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Habilitar Corepack y preparar pnpm. Esto solo se necesita aquí.
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copiar archivos de configuración de pnpm y el package.json
# Esto es esencial para que pnpm sepa qué instalar.
COPY package.json pnpm-lock.yaml ./

# Instalar las dependencias de producción.
# `--frozen-lockfile` asegura instalaciones deterministas.
# `--unsafe-perm=true` (opcional) si tienes problemas de permisos con algunas dependencias.
RUN pnpm install --frozen-lockfile --prod # `--prod` instala solo dependencias de producción

# Copiar el resto del código fuente del proyecto
# Asegúrate de que .dockerignore excluya node_modules, dist, etc. si no los necesitas copiar explícitamente.
COPY . .

# Ejecutar scripts de build y generate de tu aplicación NestJS.
# Asumo que `pnpm run build` compila tu TypeScript a JS en `dist/`.
# Asumo que `pnpm run generate` es para Prisma u otras generacione.
RUN pnpm run generate
RUN pnpm run build

# --- Etapa final ---
# Usamos la misma imagen slim para consistencia y tamaño.
FROM node:20-slim

WORKDIR /app

# Copiar solo lo esencial de la etapa de build a la etapa final
# - package.json y pnpm-lock.yaml son útiles para `pnpm start:prod`
# - La carpeta `dist` con tu código compilado
# - La carpeta `prisma` si la necesitas en runtime (ej. para migraciones o el esquema)
# - ¡Importante! Si usas pnpm PnP, necesitas copiar los archivos de PnP.
#   Estos son los que pnpm crea para Node.js pueda cargar los módulos.
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# Copia los archivos de configuración de pnpm para el runtime.
# Estos suelen estar en el root del proyecto si no se especifica lo contrario.
# Revisa tu proyecto para confirmar sus nombres y ubicación.
COPY --from=builder /app/.pnpmfile.cjs ./.pnpmfile.cjs
COPY --from=builder /app/.pnpm-workspace.yaml ./.pnpm-workspace.yaml
# También podrías necesitar el directorio '.pnpm' si tu setup de pnpm lo requiere para el runtime,
# o si no confías en que el `pnpm start` maneje el store completamente.
# COPY --from=builder /app/.pnpm ./.pnpm # Esto copiará el store de pnpm si es necesario.
# Si tu NestJS depende de cualquier recurso o configuración adicional en la raíz, cópialos aquí.

# Exponer el puerto que tu aplicación NestJS usa
EXPOSE 3001

# Comando para iniciar la aplicación.
# ¡Es crucial usar `pnpm start:prod` (o tu script de inicio) para que pnpm configure el runtime!
CMD ["pnpm", "start:prod"]

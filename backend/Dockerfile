# --- ETAPA DE BUILD ---
FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY backend/ .

RUN npx prisma generate

# --- MODIFICACIONES AQUÍ PARA DEBUGGING ---
# Añade `&& echo "Build completed successfully!"` para verificar la ejecución
# Añade `|| exit 1` para que el Docker build falle explícitamente si `nest build` no tiene éxito.
# Añade `ls -la` para ver el contenido del directorio después del build.
RUN pnpm run build || (echo "!!!!! NEST BUILD FAILED !!!!!" && exit 1)
RUN echo "--- Contents of /app after build ---"
RUN ls -la /app
RUN echo "--- Contents of /app/dist ---"
RUN ls -la /app/dist # This will likely fail if dist isn't there, but gives confirmation
# --- FIN DE MODIFICACIONES ---

# --- ETAPA FINAL (PRODUCCIÓN) ---
FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --prod --frozen-lockfile --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]

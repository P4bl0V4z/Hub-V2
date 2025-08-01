# ---- Etapa de build ----
FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --unsafe-perm=true

COPY backend/ .

RUN pnpm run generate
RUN pnpm run build

# ---- Etapa final (producción) ----
FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/tsconfig.json ./
RUN pnpm install
RUN pnpm run build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]

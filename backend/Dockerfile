# --- Etapa de build ---
FROM node:20-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y \
  python3 \
  build-essential \
  libssl-dev \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --unsafe-perm=true
RUN ls
COPY . .
RUN pnpm run generate
RUN pnpm run build

# --- Etapa final ---
FROM node:20-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/main.js"]

FROM node:20-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY backend/ .

EXPOSE 3001
CMD ["node", "dist/main.js"]

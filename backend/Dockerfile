# Etapa de build
FROM node:20-slim AS builder

WORKDIR /app

ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG DATABASE_URL
ARG REDIS_HOST
ARG JWT_SECRET
ARG MAIL_HOST
ARG MAIL_USER
ARG MAIL_PASS
ARG MAIL_PORT
ARG MAIL_SECURE
ARG MAIL_TLS_REJECT_UNAUTHORIZED
ARG MAIL_FROM_NAME
ARG FRONTEND_URL
ARG PORT
ARG MAIL_FROM


ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV REDIS_HOST=$REDIS_HOST
ENV JWT_SECRET=$JWT_SECRET
ENV MAIL_HOST=$MAIL_HOST
ENV MAIL_USER=$MAIL_USER
ENV MAIL_PASS=$MAIL_PASS
ENV MAIL_PORT=$MAIL_PORT
ENV MAIL_SECURE=$MAIL_SECURE
ENV MAIL_TLS_REJECT_UNAUTHORIZED=$MAIL_TLS_REJECT_UNAUTHORIZED
ENV MAIL_FROM_NAME=$MAIL_FROM_NAME
ENV FRONTEND_URL=$FRONTEND_URL
ENV PORT=$PORT
ENV MAIL_FROM=$MAIL_FROM



RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*
RUN apt-get install -y openssl
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY backend/ ./

# Generar Prisma Client con binarios específicos

RUN pnpm exec prisma db push --force-reset && echo "✅ Prisma DB push ok"
RUN pnpm exec prisma generate && echo "✅ Prisma Client generado"

# Compilar el proyecto
#RUN pnpm run build
RUN pnpm exec tsc -p tsconfig.build.json && echo "✅ tsc ok"
RUN pnpm exec nest build && echo "✅ nest ok"
RUN echo "📂 Contenido de /app tras build:" && find /app -type d -name "dist" -exec ls -lah {} \;

# Etapa final
FROM node:20-slim

WORKDIR /app
RUN apt-get update && apt-get install -y openssl libssl-dev && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Volver a declarar todos los ARG
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG DATABASE_URL
ARG REDIS_HOST
ARG JWT_SECRET
ARG MAIL_HOST
ARG MAIL_USER
ARG MAIL_PASS
ARG MAIL_PORT
ARG MAIL_SECURE
ARG MAIL_TLS_REJECT_UNAUTHORIZED
ARG MAIL_FROM_NAME
ARG FRONTEND_URL
ARG PORT
ARG MAIL_FROM

# Convertirlos en ENV para que estén disponibles en tiempo de ejecución
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV REDIS_HOST=$REDIS_HOST
ENV JWT_SECRET=$JWT_SECRET
ENV MAIL_HOST=$MAIL_HOST
ENV MAIL_USER=$MAIL_USER
ENV MAIL_PASS=$MAIL_PASS
ENV MAIL_PORT=$MAIL_PORT
ENV MAIL_SECURE=$MAIL_SECURE
ENV MAIL_TLS_REJECT_UNAUTHORIZED=$MAIL_TLS_REJECT_UNAUTHORIZED
ENV MAIL_FROM_NAME=$MAIL_FROM_NAME
ENV FRONTEND_URL=$FRONTEND_URL
ENV PORT=$PORT
ENV MAIL_FROM=$MAIL_FROM

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

COPY backend/start.sh .
RUN chmod +x start.sh

CMD ["./start.sh"]

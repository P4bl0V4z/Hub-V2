FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY frontend/package.json ./

RUN pnpm install --no-frozen-lockfile

COPY frontend/ .
ARG VITE_API_URL

ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm run build

FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


FROM node:18-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

# Solo package.json
COPY frontend/package.json ./

RUN pnpm install --frozen-lockfile

COPY frontend/ .

RUN pnpm run build

FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

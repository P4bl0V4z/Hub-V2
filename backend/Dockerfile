FROM node:20-slim

WORKDIR /app

# Instalar dependencias mínimas para poder trabajar dentro del contenedor
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libssl-dev \
    openssl \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Habilitar pnpm
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Copiamos el script de arranque vacío (o lo generás dentro del contenedor)
COPY backend/ .
RUN chmod +x start.sh

# Este script puede hacer echo "Contenedor listo" y nada más
CMD ["./start.sh"]

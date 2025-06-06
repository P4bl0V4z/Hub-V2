CREACION DE BASE DE DATOS POSTGRES

ESTRUCTURA
--------------------------------------------------------------
-- Tabla de usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT, -- puede ser NULL si usa Google/Microsoft
    provider TEXT NOT NULL DEFAULT 'local', -- 'local', 'google', 'microsoft'
    tipo_usuario TEXT NOT NULL DEFAULT 'cliente', -- 'cliente', 'interno'
    nombre TEXT, -- opcional
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de empresas (clientes)
CREATE TABLE empresas (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    ruc TEXT UNIQUE, -- según el país puedes ajustar esto
    creada_por INTEGER REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de módulos disponibles (REP, Huella, Pasaporte)
CREATE TABLE modulos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE -- 'REP', 'Huella', 'Pasaporte'
);

-- Relación empresa <-> módulos suscritos
CREATE TABLE empresas_modulos (
    id SERIAL PRIMARY KEY,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    modulo_id INTEGER NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
    fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_fin DATE
);

-- Tabla de roles (pueden aplicarse a clientes o internos)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE, -- 'cliente_admin', 'editor', 'soporte', etc.
    descripcion TEXT
);

-- Relación usuario <-> empresa, solo para clientes
CREATE TABLE usuarios_empresas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    empresa_id INTEGER NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    rol_id INTEGER REFERENCES roles(id),
    aprobado BOOLEAN DEFAULT FALSE
);

-- Relación usuario <-> roles, por contexto (empresa:X o global)
CREATE TABLE usuarios_roles (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    contexto TEXT NOT NULL, -- 'empresa:123', 'global'
    rol_id INTEGER NOT NULL REFERENCES roles(id),
    asignado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tabla de permisos/funcionalidades del sistema
CREATE TABLE permisos (
    id SERIAL PRIMARY KEY,
    clave TEXT NOT NULL UNIQUE, -- ej: 'crear_empresa', 'ver_rep', 'editar_huella'
    descripcion TEXT
);

-- Relación muchos-a-muchos entre roles y permisos
CREATE TABLE roles_permisos (
    id SERIAL PRIMARY KEY,
    rol_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id INTEGER NOT NULL REFERENCES permisos(id) ON DELETE CASCADE
);

-----------------------------------------------------------------------------------
PRECARGA DE DATOS

Ej.:

INSERT INTO roles (nombre, descripcion) VALUES
('cliente_admin', 'Administrador de la empresa cliente'),
('cliente_editor', 'Editor de datos de la empresa cliente'),
('cliente_lector', 'Solo lectura para empresa cliente'),
('soporte', 'Soporte técnico interno'),
('ventas', 'Rol de ventas interno'),
('sadmin', 'Superadministrador del sistema');


<<<<<<< Updated upstream
=======


# Puesta en marcha del proyecto Hub-V2 con Docker Compose

Este documento resume todos los pasos realizados para levantar correctamente un entorno con frontend (Vite + Nginx), backend (Node + TypeScript + Passport), PostgreSQL y Redis usando Docker.

---

## Estructura del proyecto
HUB-V2-lovable-joaquin/
├── backend/
│ └── .env
├── database/
├── frontend/
│ └── Dockerfile
├── redis/
├── docker-compose.yml
└── README.md

-----
## Estructura General

- Proyecto React + Vite (`frontend`) servido por Nginx
- Backend en Node.js + TypeScript (`backend`)
- PostgreSQL como base de datos
- Redis como almacén temporal
- Docker y Docker Compose para orquestar servicios
- Google OAuth 2.0 para autenticación externa


## Pasos Realizados

1. **Levantamiento inicial del entorno**
Corregí el `Dockerfile` del frontend para que copiara desde `/app/dist` en lugar de `/app/build` (porque Vite usa `dist`)
cree el archivo `docker-compose.yml` con mapeos de puertos:
  - Frontend: `localhost:3000`
  - Backend: `localhost:3001`
  - PostgreSQL: `localhost:5432`
  - Redis: `localhost:6379`
---

2. **Configuración del backend**

- Eliminé `"type": "module"` de `package.json` para evitar errores con `exports` en CommonJS
- Corregí `tsconfig.json` con `"module": "CommonJS"`
- Agregué `.env` en `backend/` con las siguientes variables:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DATABASE_URL=postgres://postgres:Hub.2025**@db:5432/beloophub2
SESSION_SECRET= 


>>>>>>> Stashed changes

-- CreateEnum
CREATE TYPE "public"."NivelAcceso" AS ENUM ('SIN_DEFINIR', 'SIN_ACCESO', 'VER', 'EDITAR');

-- CreateTable
CREATE TABLE "public"."ObjetoSistema" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ObjetoSistema_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RolAcceso" (
    "id" SERIAL NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "objeto_sistema_id" INTEGER NOT NULL,
    "nivel" "public"."NivelAcceso" NOT NULL DEFAULT 'SIN_DEFINIR',

    CONSTRAINT "RolAcceso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "nombre" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_en" TIMESTAMP(3) NOT NULL,
    "token_verificacion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "verificado_en" TIMESTAMP(3),
    "tipo_usuario" TEXT,
    "google_id" TEXT,
    "ms_id" TEXT,
    "avatar_url" TEXT,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Empresa" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "esEmpresaMaestra" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "soloEmpresaMaestra" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UsuarioEmpresa" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,

    CONSTRAINT "UsuarioEmpresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UsuarioRol" (
    "id" SERIAL NOT NULL,
    "usuario_empresa_id" INTEGER NOT NULL,
    "rol_id" INTEGER NOT NULL,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Test" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" SERIAL NOT NULL,
    "testId" INTEGER NOT NULL,
    "texto" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TestAttempt" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "label" TEXT,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "score" DOUBLE PRECISION,
    "progress" JSONB NOT NULL,

    CONSTRAINT "TestAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ObjetoSistema_key_key" ON "public"."ObjetoSistema"("key");

-- CreateIndex
CREATE INDEX "RolAcceso_objeto_sistema_id_idx" ON "public"."RolAcceso"("objeto_sistema_id");

-- CreateIndex
CREATE INDEX "RolAcceso_nivel_idx" ON "public"."RolAcceso"("nivel");

-- CreateIndex
CREATE UNIQUE INDEX "RolAcceso_rol_id_objeto_sistema_id_key" ON "public"."RolAcceso"("rol_id", "objeto_sistema_id");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_google_id_key" ON "public"."Usuario"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_ms_id_key" ON "public"."Usuario"("ms_id");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "public"."Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioEmpresa_usuario_id_empresa_id_key" ON "public"."UsuarioEmpresa"("usuario_id", "empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioRol_usuario_empresa_id_rol_id_key" ON "public"."UsuarioRol"("usuario_empresa_id", "rol_id");

-- CreateIndex
CREATE INDEX "TestAttempt_userId_testId_completed_idx" ON "public"."TestAttempt"("userId", "testId", "completed");

-- CreateIndex
CREATE INDEX "TestAttempt_testId_completedAt_idx" ON "public"."TestAttempt"("testId", "completedAt");

-- CreateIndex
CREATE INDEX "TestAttempt_userId_idx" ON "public"."TestAttempt"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TestAttempt_userId_testId_attemptNumber_key" ON "public"."TestAttempt"("userId", "testId", "attemptNumber");

-- AddForeignKey
ALTER TABLE "public"."RolAcceso" ADD CONSTRAINT "RolAcceso_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "public"."Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolAcceso" ADD CONSTRAINT "RolAcceso_objeto_sistema_id_fkey" FOREIGN KEY ("objeto_sistema_id") REFERENCES "public"."ObjetoSistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioEmpresa" ADD CONSTRAINT "UsuarioEmpresa_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioEmpresa" ADD CONSTRAINT "UsuarioEmpresa_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioRol" ADD CONSTRAINT "UsuarioRol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "public"."Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuario_empresa_id_fkey" FOREIGN KEY ("usuario_empresa_id") REFERENCES "public"."UsuarioEmpresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_testId_fkey" FOREIGN KEY ("testId") REFERENCES "public"."Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestAttempt" ADD CONSTRAINT "TestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestAttempt" ADD CONSTRAINT "TestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "public"."Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

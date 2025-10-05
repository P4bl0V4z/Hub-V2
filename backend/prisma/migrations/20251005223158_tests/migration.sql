/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.

*/
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
CREATE INDEX "TestAttempt_userId_testId_completed_idx" ON "public"."TestAttempt"("userId", "testId", "completed");

-- CreateIndex
CREATE INDEX "TestAttempt_testId_completedAt_idx" ON "public"."TestAttempt"("testId", "completedAt");

-- CreateIndex
CREATE INDEX "TestAttempt_userId_idx" ON "public"."TestAttempt"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TestAttempt_userId_testId_attemptNumber_key" ON "public"."TestAttempt"("userId", "testId", "attemptNumber");

-- CreateIndex
CREATE INDEX "Empresa_esEmpresaMaestra_idx" ON "public"."Empresa"("esEmpresaMaestra");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_nombre_key" ON "public"."Empresa"("nombre");

-- CreateIndex
CREATE INDEX "Usuario_email_idx" ON "public"."Usuario"("email");

-- CreateIndex
CREATE INDEX "UsuarioEmpresa_empresa_id_idx" ON "public"."UsuarioEmpresa"("empresa_id");

-- CreateIndex
CREATE INDEX "UsuarioEmpresa_usuario_id_idx" ON "public"."UsuarioEmpresa"("usuario_id");

-- CreateIndex
CREATE INDEX "UsuarioRol_rol_id_idx" ON "public"."UsuarioRol"("rol_id");

-- AddForeignKey
ALTER TABLE "public"."RolAcceso" ADD CONSTRAINT "RolAcceso_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "public"."Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolAcceso" ADD CONSTRAINT "RolAcceso_objeto_sistema_id_fkey" FOREIGN KEY ("objeto_sistema_id") REFERENCES "public"."ObjetoSistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_testId_fkey" FOREIGN KEY ("testId") REFERENCES "public"."Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestAttempt" ADD CONSTRAINT "TestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TestAttempt" ADD CONSTRAINT "TestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "public"."Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

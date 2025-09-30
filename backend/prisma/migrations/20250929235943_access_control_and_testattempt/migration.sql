/*
  Warnings:

  - You are about to drop the column `creadoEn` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `tipoUsuario` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `tokenVerificacion` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `verificadoEn` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `UsuariosEmpresas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `empresa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rol` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[google_id]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ms_id]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actualizado_en` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Made the column `nombre` on table `Usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."NivelAcceso" AS ENUM ('SIN_DEFINIR', 'SIN_ACCESO', 'VER', 'EDITAR');

-- DropForeignKey
ALTER TABLE "public"."UsuariosEmpresas" DROP CONSTRAINT "UsuariosEmpresas_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UsuariosEmpresas" DROP CONSTRAINT "UsuariosEmpresas_rolId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UsuariosEmpresas" DROP CONSTRAINT "UsuariosEmpresas_usuarioId_fkey";

-- AlterTable
ALTER TABLE "public"."Usuario" DROP COLUMN "creadoEn",
DROP COLUMN "provider",
DROP COLUMN "providerId",
DROP COLUMN "tipoUsuario",
DROP COLUMN "tokenVerificacion",
DROP COLUMN "verificadoEn",
ADD COLUMN     "actualizado_en" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "google_id" TEXT,
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "ms_id" TEXT,
ADD COLUMN     "tipo_usuario" TEXT,
ADD COLUMN     "token_verificacion" TEXT,
ADD COLUMN     "verificado_en" TIMESTAMP(3),
ALTER COLUMN "nombre" SET NOT NULL;

-- DropTable
DROP TABLE "public"."UsuariosEmpresas";

-- DropTable
DROP TABLE "public"."empresa";

-- DropTable
DROP TABLE "public"."rol";

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
CREATE TABLE "public"."TestAttempt" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "label" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
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
CREATE INDEX "Empresa_esEmpresaMaestra_idx" ON "public"."Empresa"("esEmpresaMaestra");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_nombre_key" ON "public"."Empresa"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "public"."Rol"("nombre");

-- CreateIndex
CREATE INDEX "UsuarioEmpresa_empresa_id_idx" ON "public"."UsuarioEmpresa"("empresa_id");

-- CreateIndex
CREATE INDEX "UsuarioEmpresa_usuario_id_idx" ON "public"."UsuarioEmpresa"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioEmpresa_usuario_id_empresa_id_key" ON "public"."UsuarioEmpresa"("usuario_id", "empresa_id");

-- CreateIndex
CREATE INDEX "UsuarioRol_rol_id_idx" ON "public"."UsuarioRol"("rol_id");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioRol_usuario_empresa_id_rol_id_key" ON "public"."UsuarioRol"("usuario_empresa_id", "rol_id");

-- CreateIndex
CREATE INDEX "TestAttempt_userId_testId_completed_idx" ON "public"."TestAttempt"("userId", "testId", "completed");

-- CreateIndex
CREATE INDEX "TestAttempt_testId_completedAt_idx" ON "public"."TestAttempt"("testId", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_google_id_key" ON "public"."Usuario"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_ms_id_key" ON "public"."Usuario"("ms_id");

-- CreateIndex
CREATE INDEX "Usuario_email_idx" ON "public"."Usuario"("email");

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
ALTER TABLE "public"."TestAttempt" ADD CONSTRAINT "TestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

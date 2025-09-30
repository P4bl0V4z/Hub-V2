-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

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

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "public"."Rol"("nombre" ASC);

-- CreateIndex
CREATE INDEX "TestAttempt_testId_completedAt_idx" ON "public"."TestAttempt"("testId" ASC, "completedAt" ASC);

-- CreateIndex
CREATE INDEX "TestAttempt_userId_testId_completed_idx" ON "public"."TestAttempt"("userId" ASC, "testId" ASC, "completed" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_google_id_key" ON "public"."Usuario"("google_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_ms_id_key" ON "public"."Usuario"("ms_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioEmpresa_usuario_id_empresa_id_key" ON "public"."UsuarioEmpresa"("usuario_id" ASC, "empresa_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioRol_usuario_empresa_id_rol_id_key" ON "public"."UsuarioRol"("usuario_empresa_id" ASC, "rol_id" ASC);

-- AddForeignKey
ALTER TABLE "public"."TestAttempt" ADD CONSTRAINT "TestAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioEmpresa" ADD CONSTRAINT "UsuarioEmpresa_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioEmpresa" ADD CONSTRAINT "UsuarioEmpresa_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioRol" ADD CONSTRAINT "UsuarioRol_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "public"."Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuario_empresa_id_fkey" FOREIGN KEY ("usuario_empresa_id") REFERENCES "public"."UsuarioEmpresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


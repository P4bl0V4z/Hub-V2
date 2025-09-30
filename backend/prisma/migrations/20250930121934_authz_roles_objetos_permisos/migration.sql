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

-- CreateIndex
CREATE UNIQUE INDEX "ObjetoSistema_key_key" ON "public"."ObjetoSistema"("key");

-- CreateIndex
CREATE INDEX "RolAcceso_objeto_sistema_id_idx" ON "public"."RolAcceso"("objeto_sistema_id");

-- CreateIndex
CREATE INDEX "RolAcceso_nivel_idx" ON "public"."RolAcceso"("nivel");

-- CreateIndex
CREATE UNIQUE INDEX "RolAcceso_rol_id_objeto_sistema_id_key" ON "public"."RolAcceso"("rol_id", "objeto_sistema_id");

-- AddForeignKey
ALTER TABLE "public"."RolAcceso" ADD CONSTRAINT "RolAcceso_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "public"."Rol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolAcceso" ADD CONSTRAINT "RolAcceso_objeto_sistema_id_fkey" FOREIGN KEY ("objeto_sistema_id") REFERENCES "public"."ObjetoSistema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

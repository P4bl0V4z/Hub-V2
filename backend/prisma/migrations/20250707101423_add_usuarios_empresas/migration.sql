-- CreateTable
CREATE TABLE "rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuariosEmpresas" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "rolId" INTEGER NOT NULL,

    CONSTRAINT "UsuariosEmpresas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UsuariosEmpresas" ADD CONSTRAINT "UsuariosEmpresas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuariosEmpresas" ADD CONSTRAINT "UsuariosEmpresas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuariosEmpresas" ADD CONSTRAINT "UsuariosEmpresas_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@beloop.io';
  const password = 'Bel00per.2025';
  const nombre = 'admin';
  const nombreEmpresaMaestra = 'BeLoop';

  let empresa = await prisma.empresa.findFirst({
    where: {
      nombre: nombreEmpresaMaestra,
      esEmpresaMaestra: true,
    },
  });

  if (!empresa) {
    empresa = await prisma.empresa.create({
      data: {
        nombre: nombreEmpresaMaestra,
        esEmpresaMaestra: true,
      },
    });
    console.log('Empresa maestra creada:', empresa.nombre);
  }

  let rolAdmin = await prisma.rol.findUnique({
    where: { nombre: 'admin' },
  });

  if (!rolAdmin) {
    rolAdmin = await prisma.rol.create({
      data: {
        nombre: 'admin',
        descripcion: 'Usuario administrador del sistema',
        soloEmpresaMaestra: true,
      },
    });
    console.log('Rol admin creado.');
  }

  let usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (usuario) {
    console.log('El usuario admin ya existe.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  usuario = await prisma.usuario.create({
    data: {
      email,
      password: hashedPassword,
      nombre,
      activo: true,
    },
  });

  const usuarioEmpresa = await prisma.usuarioEmpresa.create({
    data: {
      usuario: { connect: { id: usuario.id } },
      empresa: { connect: { id: empresa.id } },
    },
  });

  await prisma.usuarioRol.create({
    data: {
      usuarioEmpresa: { connect: { id: usuarioEmpresa.id } },
      rol: { connect: { id: rolAdmin.id } },
    },
  });

  console.log('Usuario admin creado correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

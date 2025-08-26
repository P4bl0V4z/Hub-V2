// CREACION DE USUARIO ADMINISTRADOR, EMPRESA BELOOP Y ROL ADMIN
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@beloop.io';
  const password = 'Bel00per.2025';
  const nombre = 'admin';
  const nombreEmpresaMaestra = 'BeLoop';

  const pepper = process.env.PASSWORD_PEPPER;
  if (!pepper) {
    throw new Error('Falta la variable de entorno PASSWORD_PEPPER');
  }
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
  if (!Number.isInteger(saltRounds) || saltRounds < 10 || saltRounds > 15) {
    throw new Error('BCRYPT_SALT_ROUNDS debe ser un entero razonable (10-15)');
  }

  let empresa = await prisma.empresa.findFirst({
    where: { nombre: nombreEmpresaMaestra, esEmpresaMaestra: true },
  });

  if (!empresa) {
    empresa = await prisma.empresa.create({
      data: { nombre: nombreEmpresaMaestra, esEmpresaMaestra: true },
    });
    console.log('Empresa maestra creada:', empresa.nombre);
  }

  let rolAdmin = await prisma.rol.findUnique({ where: { nombre: 'admin' } });
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
  let usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    const payload = `${password}${pepper}`;
    const hashedPassword = await bcrypt.hash(payload, saltRounds);

    usuario = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        activo: true,
      },
    });
    console.log('Usuario admin creado.');
  } else {
    console.log('El usuario admin ya existe.');
  }

  // 4) Vinculaciones (idempotentes)
  let usuarioEmpresa = await prisma.usuarioEmpresa.findFirst({
    where: { usuarioId: usuario.id, empresaId: empresa.id },
  });
  if (!usuarioEmpresa) {
    usuarioEmpresa = await prisma.usuarioEmpresa.create({
      data: {
        usuario: { connect: { id: usuario.id } },
        empresa: { connect: { id: empresa.id } },
      },
    });
    console.log('Vinculación usuario-empresa creada.');
  }

  const usuarioRolExistente = await prisma.usuarioRol.findFirst({
    where: {
      usuarioEmpresaId: usuarioEmpresa.id,
      rolId: rolAdmin.id,
    },
  });
  if (!usuarioRolExistente) {
    await prisma.usuarioRol.create({
      data: {
        usuarioEmpresa: { connect: { id: usuarioEmpresa.id } },
        rol: { connect: { id: rolAdmin.id } },
      },
    });
    console.log('Rol admin asignado al usuario.');
  }

  console.log('Proceso completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const passwordPlain = 'miclave123'; // Cambia la clave si quieres
  const hash = await bcrypt.hash(passwordPlain, 10);

  const user = await prisma.usuario.create({
    data: {
      email: 'testuser@ejemplo.com', // Cambia el correo si quieres
      password: hash,
      provider: 'local',
      nombre: 'Usuario Test Console',
      tipoUsuario: 'cliente',
      activo: true,
      // Si tienes otros campos obligatorios en tu modelo, agrégalos aquí
    },
  });

  console.log('Usuario creado:', user);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

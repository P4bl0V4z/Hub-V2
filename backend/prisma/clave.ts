import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('BeLoopAdmin.2025', 10);
  await prisma.usuario.create({
    data: {
      nombre: 'BeLoop Admin',
      email: 'admin@beloop.io',
      password: passwordHash,
      creadoEn: new Date(),
      verificadoEn: new Date(),
      activo: true,            
      provider: 'local',       
      tipoUsuario: 'admin',    
    },
  });

  console.log('Usuario administrador creado con éxito');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

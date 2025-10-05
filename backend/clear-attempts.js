const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearAttempts() {
  try {
    console.log('🗑️  Borrando todos los intentos...');
    const result = await prisma.testAttempt.deleteMany();
    console.log(`✓ ${result.count} intentos borrados exitosamente`);

    // Opcional: Ver estadísticas
    const users = await prisma.user.findMany();
    console.log(`\nUsuarios en la base de datos: ${users.length}`);
    users.forEach(u => console.log(`  - ${u.email} (ID: ${u.id})`));

  } catch (error) {
    console.error('✗ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

clearAttempts();

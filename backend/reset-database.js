const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log('🗑️  Eliminando todos los intentos...');
    const deleteResult = await prisma.testAttempt.deleteMany();
    console.log(`✓ ${deleteResult.count} intentos eliminados`);

    console.log('\n🗑️  Eliminando todos los tests...');
    const deleteTests = await prisma.test.deleteMany();
    console.log(`✓ ${deleteTests.count} tests eliminados`);

    // Resetear el autoincrement en PostgreSQL
    console.log('\n🔄 Reseteando autoincrement...');
    await prisma.$executeRaw`ALTER SEQUENCE "TestAttempt_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "Test_id_seq" RESTART WITH 1`;
    console.log('✓ Autoincrement reseteado');

    console.log('\n✅ Base de datos limpiada exitosamente');
    console.log('   Los próximos IDs comenzarán desde 1\n');

  } catch (error) {
    console.error('✗ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();

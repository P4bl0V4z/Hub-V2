const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixConstraint() {
  try {
    console.log('🔧 Eliminando constraint incorrecta...');

    // Eliminar la constraint única problemática
    await prisma.$executeRaw`
      DROP INDEX IF EXISTS "TestAttempt_userId_testId_completed_key"
    `;
    console.log('✓ Constraint única eliminada');

    // Crear la nueva constraint correcta
    console.log('\n🔧 Creando nueva constraint (userId, testId, attemptNumber)...');
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "TestAttempt_userId_testId_attemptNumber_key"
      ON "TestAttempt"("userId", "testId", "attemptNumber")
    `;
    console.log('✓ Nueva constraint creada');

    console.log('\n✅ Base de datos actualizada correctamente');
    console.log('   Ahora puedes tener múltiples intentos completados del mismo test\n');

  } catch (error) {
    console.error('✗ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixConstraint();

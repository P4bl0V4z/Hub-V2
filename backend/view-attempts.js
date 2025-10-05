const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function viewAttempts() {
  try {
    const attempts = await prisma.testAttempt.findMany({
      include: {
        test: { select: { id: true, nombre: true } },
        user: { select: { id: true, email: true, nombre: true } },
      },
      orderBy: [
        { userId: 'asc' },
        { attemptNumber: 'desc' },
      ],
    });

    console.log(`\n📊 Total de intentos: ${attempts.length}\n`);

    if (attempts.length === 0) {
      console.log('  No hay intentos registrados.\n');
      return;
    }

    attempts.forEach(a => {
      console.log(`─────────────────────────────────────────`);
      console.log(`ID: ${a.id} | Intento #${a.attemptNumber}`);
      console.log(`Usuario: ${a.user.email} (ID: ${a.userId})`);
      console.log(`Test: ${a.test.nombre} (ID: ${a.testId})`);
      console.log(`Completado: ${a.completed ? '✓ Sí' : '✗ No'}`);
      console.log(`Iniciado: ${a.startedAt.toLocaleString()}`);
      if (a.completedAt) {
        console.log(`Terminado: ${a.completedAt.toLocaleString()}`);
      }
      console.log(`Progreso: ${JSON.stringify(a.progress).substring(0, 100)}...`);
    });
    console.log(`─────────────────────────────────────────\n`);

  } catch (error) {
    console.error('✗ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

viewAttempts();

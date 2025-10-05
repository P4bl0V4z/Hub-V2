// Script para verificar los TestAttempts guardados
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAttempts() {
  try {
    console.log('\n🔍 Consultando TestAttempts guardados...\n');

    const attempts = await prisma.testAttempt.findMany({
      include: {
        test: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
          }
        }
      },
      orderBy: { startedAt: 'desc' },
      take: 10
    });

    if (attempts.length === 0) {
      console.log('❌ No hay intentos guardados en la base de datos.\n');
      return;
    }

    console.log(`✅ Se encontraron ${attempts.length} intentos:\n`);

    attempts.forEach((attempt, index) => {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Intento #${index + 1}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`ID: ${attempt.id}`);
      console.log(`Usuario: ${attempt.user.nombre} (${attempt.user.email})`);
      console.log(`Test: ${attempt.test.nombre}`);
      console.log(`Iniciado: ${attempt.startedAt.toLocaleString()}`);
      console.log(`Actualizado: ${attempt.updatedAt.toLocaleString()}`);
      console.log(`Completado: ${attempt.completed ? '✅ Sí' : '❌ No'}`);

      if (attempt.progress) {
        const progress = attempt.progress;
        console.log(`\n📊 PROGRESO:`);
        console.log(`   Version: ${progress.version || 'N/A'}`);
        console.log(`   Pregunta actual: ${progress.currentQid || 'N/A'}`);
        console.log(`   Respuestas guardadas: ${progress.answeredCount || 0}`);

        if (progress.answers && progress.answers.length > 0) {
          console.log(`\n   🔹 Respuestas:`);
          progress.answers.slice(0, 5).forEach(ans => {
            console.log(`      - ${ans.qid}: ${ans.value}`);
          });

          if (progress.answers.length > 5) {
            console.log(`      ... y ${progress.answers.length - 5} más`);
          }
        }
      }

      console.log('');
    });

    console.log(`\n✅ Total de intentos en la base de datos: ${attempts.length}\n`);

  } catch (error) {
    console.error('❌ Error al consultar la base de datos:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAttempts();

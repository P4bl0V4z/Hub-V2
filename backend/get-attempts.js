/**
 * Script para consultar intentos de test de un usuario
 * Uso: node get-attempts.js <userId>
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAttempts() {
  const userId = process.argv[2] ? parseInt(process.argv[2]) : 1;

  console.log(`\n📊 Consultando intentos del usuario ${userId}...\n`);

  try {
    const attempts = await prisma.testAttempt.findMany({
      where: { userId },
      include: {
        test: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });

    if (attempts.length === 0) {
      console.log('❌ No se encontraron intentos para este usuario.\n');
      return;
    }

    console.log(`✅ Se encontraron ${attempts.length} intento(s):\n`);

    attempts.forEach((attempt, index) => {
      console.log(`─────────────────────────────────────────────────────────`);
      console.log(`Intento #${index + 1}`);
      console.log(`─────────────────────────────────────────────────────────`);
      console.log(`ID: ${attempt.id}`);
      console.log(`Test: ${attempt.test.nombre} (ID: ${attempt.test.id})`);
      console.log(`Label: ${attempt.label || 'N/A'}`);
      console.log(`Iniciado: ${attempt.startedAt.toLocaleString('es-ES')}`);
      console.log(`Actualizado: ${attempt.updatedAt.toLocaleString('es-ES')}`);
      console.log(`Completado: ${attempt.completed ? 'Sí' : 'No'}`);

      if (attempt.completed && attempt.completedAt) {
        console.log(`Completado el: ${attempt.completedAt.toLocaleString('es-ES')}`);
      }

      if (attempt.score !== null) {
        console.log(`Score: ${attempt.score}`);
      }

      console.log(`\n📝 Progreso:`);
      const progress = attempt.progress;

      if (progress && typeof progress === 'object') {
        console.log(`   Versión: ${progress.version || 'N/A'}`);
        console.log(`   Pregunta actual: ${progress.currentQid || 'N/A'}`);
        console.log(`   Respuestas: ${progress.answeredCount || 0}`);

        if (progress.answers && Array.isArray(progress.answers)) {
          console.log(`\n   📋 Respuestas guardadas (${progress.answers.length}):`);
          progress.answers.forEach((answer, idx) => {
            console.log(`      ${idx + 1}. ${answer.qid}: ${answer.value}`);
          });
        }
      } else {
        console.log(`   Sin progreso registrado`);
      }

      console.log('');
    });

    console.log(`─────────────────────────────────────────────────────────\n`);
  } catch (error) {
    console.error('❌ Error al consultar intentos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getAttempts();

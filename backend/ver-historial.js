// Script para ver el historial completo de intentos
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verHistorial() {
  try {
    console.log('\n📊 HISTORIAL DE INTENTOS DE TEST\n');

    const attempts = await prisma.testAttempt.findMany({
      include: {
        user: {
          select: { id: true, nombre: true, email: true }
        },
        test: {
          select: { id: true, nombre: true }
        }
      },
      orderBy: [
        { testId: 'asc' },
        { userId: 'asc' },
        { attemptNumber: 'desc' }
      ]
    });

    if (attempts.length === 0) {
      console.log('❌ No hay intentos registrados.\n');
      return;
    }

    console.log(`✅ Total de intentos: ${attempts.length}\n`);

    // Agrupar por usuario y test
    const grouped = {};
    attempts.forEach(attempt => {
      const key = `${attempt.userId}-${attempt.testId}`;
      if (!grouped[key]) {
        grouped[key] = {
          user: attempt.user,
          test: attempt.test,
          attempts: []
        };
      }
      grouped[key].attempts.push(attempt);
    });

    // Mostrar por grupo
    Object.values(grouped).forEach((group, idx) => {
      console.log(`${'='.repeat(70)}`);
      console.log(`📝 ${group.test.nombre}`);
      console.log(`👤 Usuario: ${group.user.nombre} (${group.user.email})`);
      console.log(`📊 Total de intentos: ${group.attempts.length}`);
      console.log(`${'='.repeat(70)}\n`);

      group.attempts.forEach(attempt => {
        const status = attempt.completed ? '✅ Completado' : '⏳ En progreso';
        const score = attempt.score !== null ? `Puntaje: ${attempt.score}` : '';

        console.log(`  Intento #${attempt.attemptNumber} (ID: ${attempt.id})`);
        console.log(`  Estado: ${status} ${score}`);
        console.log(`  Iniciado: ${attempt.startedAt.toLocaleString()}`);
        console.log(`  Actualizado: ${attempt.updatedAt.toLocaleString()}`);

        if (attempt.completed && attempt.completedAt) {
          console.log(`  Completado: ${attempt.completedAt.toLocaleString()}`);
        }

        const progress = attempt.progress;
        if (progress && typeof progress === 'object') {
          console.log(`  Progreso: ${progress.answeredCount || 0} respuestas guardadas`);

          if (progress.answers && progress.answers.length > 0) {
            console.log(`  Primeras respuestas:`);
            progress.answers.slice(0, 3).forEach(ans => {
              console.log(`    - ${ans.qid || ans.questionId}: ${JSON.stringify(ans.value || ans.selectedOption)}`);
            });
            if (progress.answers.length > 3) {
              console.log(`    ... y ${progress.answers.length - 3} más`);
            }
          }
        }

        console.log('');
      });
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verHistorial();

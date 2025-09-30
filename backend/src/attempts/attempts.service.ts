import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TestProgressSchema, type TestProgress } from '../types/test-progress';

@Injectable()
export class AttemptsService {
  constructor(private prisma: PrismaService) {}

  // ya lo tenías:
  async startAttempt(params: { userId: number; testId: number; label?: string }) {
    const { userId, testId, label } = params;

    // verificar que el test exista
    const test = await this.prisma.test.findUnique({ where: { id: testId } });
    if (!test) throw new NotFoundException('Test no encontrado');

    // reanudar si hay intento activo
    const existing = await this.prisma.testAttempt.findFirst({
      where: { userId, testId, completed: false },
    });
    if (existing) return existing;

    // crear nuevo intento
    return this.prisma.testAttempt.create({
      data: {
        userId,
        testId,
        label: label ?? null,
        progress: {
          version: 'v1',
          answeredCount: 0,
          answers: [],
        } as any,
      },
    });
  }

  // NUEVO: guardar progreso (autosave)
  async saveProgress(params: { attemptId: number; userId: number; progress: unknown }) {
    const { attemptId, userId, progress } = params;

    // 1) validar que exista y que pertenezca al usuario
    const attempt = await this.prisma.testAttempt.findUnique({
      where: { id: attemptId },
      select: { id: true, userId: true, completed: true },
    });
    if (!attempt) throw new NotFoundException('Intento no encontrado');
    if (attempt.userId !== userId) throw new ForbiddenException('No puedes modificar este intento');
    if (attempt.completed) throw new ForbiddenException('El intento ya está completado');

    // 2) validar el JSON de progreso con Zod
    const parsed: TestProgress = TestProgressSchema.parse(progress);

    // 3) actualizar (updatedAt se refresca por @updatedAt)
    return this.prisma.testAttempt.update({
      where: { id: attemptId },
      data: { progress: parsed },
    });
  }
}

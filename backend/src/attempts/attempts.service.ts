import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { TestProgressSchema, type TestProgress } from '../types/test-progress';

@Injectable()
export class AttemptsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea un intento nuevo o reanuda el activo (completed = false)
   * Ahora soporta crear test automáticamente si se pasa testName
   */
  async startAttempt(params: { 
    userId: number; 
    testId?: number; 
    testName?: string; 
    label?: string;
  }) {
    const { userId, testName, label } = params;
    let testId = params.testId;

    // Si no hay testId, buscar o crear test por nombre
    if (!testId && testName) {
      let test = await this.prisma.test.findFirst({
        where: { nombre: testName },
      });

      if (!test) {
        test = await this.prisma.test.create({
          data: { nombre: testName },
        });
        console.log('✓ Test creado:', test);
      }

      testId = test.id;
    }

    if (!testId) {
      throw new BadRequestException('Debe proporcionar testId o testName');
    }

    // Reanudar si hay intento activo
    const existing = await this.prisma.testAttempt.findFirst({
      where: { userId, testId, completed: false },
    });
    if (existing) {
      console.log('✓ Reanudando intento existente:', existing.id);
      return existing;
    }

    // Crear nuevo intento con progress inicial
    const initialProgress: TestProgress = {
      version: 'v1',
      answeredCount: 0,
      answers: [],
    };

    const newAttempt = await this.prisma.testAttempt.create({
      data: {
        userId,
        testId,
        label: label ?? null,
        progress: initialProgress as Prisma.InputJsonValue,
      },
    });

    console.log('✓ Nuevo intento creado:', newAttempt.id);
    return newAttempt;
  }

  /**
   * Guarda el progreso (autosave). Valida que el intento sea del usuario y no esté completado.
   */
  async saveProgress(params: { attemptId: number; userId: number; progress: unknown }) {
    const { attemptId, userId, progress } = params;

    const attempt = await this.prisma.testAttempt.findUnique({
      where: { id: attemptId },
      select: { id: true, userId: true, completed: true },
    });
    
    if (!attempt) throw new NotFoundException('Intento no encontrado');
    if (attempt.userId !== userId) throw new ForbiddenException('No puedes modificar este intento');
    if (attempt.completed) throw new ForbiddenException('El intento ya está completado');

    const parsed: TestProgress = TestProgressSchema.parse(progress);

    return this.prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        progress: parsed as Prisma.InputJsonValue,
      },
    });
  }

  /**
   * Obtener un intento (para reanudar en FE).
   */
  async getAttempt(attemptId: number, userId: number) {
    const attempt = await this.prisma.testAttempt.findUnique({
      where: { id: attemptId },
      select: {
        id: true,
        userId: true,
        testId: true,
        label: true,
        startedAt: true,
        updatedAt: true,
        completed: true,
        completedAt: true,
        score: true,
        progress: true,
      },
    });

    if (!attempt) throw new NotFoundException('Intento no encontrado');
    if (attempt.userId !== userId) throw new ForbiddenException('No puedes ver este intento');

    return attempt;
  }

  /**
   * Marcar intento como completado y guardar score (si aplica).
   */
  async completeAttempt(params: { attemptId: number; userId: number; score?: number }) {
    const { attemptId, userId, score } = params;

    const attempt = await this.prisma.testAttempt.findUnique({
      where: { id: attemptId },
      select: { id: true, userId: true, completed: true },
    });
    
    if (!attempt) throw new NotFoundException('Intento no encontrado');
    if (attempt.userId !== userId) throw new ForbiddenException('No puedes completar este intento');
    if (attempt.completed) {
      return this.prisma.testAttempt.findUnique({ where: { id: attemptId } });
    }

    return this.prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        completed: true,
        completedAt: new Date(),
        ...(typeof score === 'number' ? { score } : {}),
      },
    });
  }
}
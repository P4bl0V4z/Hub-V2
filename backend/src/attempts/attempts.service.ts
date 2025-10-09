import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { TestProgressSchema, type TestProgress } from '../types/test-progress';

@Injectable()
export class AttemptsService {
  constructor(private prisma: PrismaService) {}

  async startAttempt(params: {
    userId: number;
    testId?: number;
    testName?: string;
    label?: string;
  }) {
    const { userId, testName, label } = params;
    let testId = params.testId;

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

    const existing = await this.prisma.testAttempt.findFirst({
      where: { userId, testId, completed: false },
    });
    if (existing) {
      console.log('✓ Reanudando intento existente:', existing.id);
      return existing;
    }

    const lastAttempt = await this.prisma.testAttempt.findFirst({
      where: { userId, testId },
      orderBy: { attemptNumber: 'desc' },
      select: { attemptNumber: true },
    });

    const nextAttemptNumber = (lastAttempt?.attemptNumber ?? 0) + 1;

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
        attemptNumber: nextAttemptNumber,
        progress: initialProgress as Prisma.InputJsonValue,
      },
    });

    console.log(`Nuevo intento creado: #${newAttempt.id} (Intento #${nextAttemptNumber})`);
    return newAttempt;
  }
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

    console.log('Guardando progreso:', {
      attemptId,
      answeredCount: parsed.answeredCount,
      totalAnswers: parsed.answers.length,
    });

    const updated = await this.prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        progress: parsed as Prisma.InputJsonValue,
      },
    });

    console.log('Progreso guardado exitosamente');
    return updated;
  }

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

  async getUserAttempts(userId: number) {
    const attempts = await this.prisma.testAttempt.findMany({
      where: { userId },
      include: {
        test: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: [
        { testId: 'asc' },
        { attemptNumber: 'desc' },
      ],
    });

    console.log(`Encontrados ${attempts.length} intentos para el usuario ${userId}`);
    return attempts;
  }

  
  async getTestHistory(userId: number, testId: number) {
    return this.prisma.testAttempt.findMany({
      where: { userId, testId },
      orderBy: { attemptNumber: 'desc' },
    });
  }

  
  async forceNewAttempt(params: {
    userId: number;
    testId?: number;
    testName?: string;
    label?: string;
  }) {
    const { userId, testName, label } = params;
    let testId = params.testId;

    if (!testId && testName) {
      let test = await this.prisma.test.findFirst({
        where: { nombre: testName },
      });

      if (!test) {
        test = await this.prisma.test.create({
          data: { nombre: testName },
        });
        console.log('Test creado:', test);
      }

      testId = test.id;
    }

    if (!testId) {
      throw new BadRequestException('Debe proporcionar testId o testName');
    }

    const activeAttempt = await this.prisma.testAttempt.findFirst({
      where: { userId, testId, completed: false },
    });

    if (activeAttempt) {
      await this.prisma.testAttempt.update({
        where: { id: activeAttempt.id },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });
      console.log(`Intento anterior #${activeAttempt.id} completado automáticamente`);
    }

    const lastAttempt = await this.prisma.testAttempt.findFirst({
      where: { userId, testId },
      orderBy: { attemptNumber: 'desc' },
      select: { attemptNumber: true },
    });

    const nextAttemptNumber = (lastAttempt?.attemptNumber ?? 0) + 1;

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
        attemptNumber: nextAttemptNumber,
        progress: initialProgress as Prisma.InputJsonValue,
      },
    });

    console.log(`Nuevo intento forzado creado: #${newAttempt.id} (Intento #${nextAttemptNumber})`);
    return newAttempt;
  }
}
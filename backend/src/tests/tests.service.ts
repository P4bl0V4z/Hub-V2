import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  // Listar intentos incompletos para mostrar "Continuar o iniciar nuevo"
  async listIncompleteAttempts(userId: string, testId: string) {
    return this.prisma.testAttempt.findMany({
      where: { userId, testId, completed: false },
      orderBy: { startedAt: 'desc' },
    });
  }

  // Crear SIEMPRE un intento nuevo (aunque existan incompletos)
  async createNewAttempt(userId: string, testId: string, label?: string, initialProgress?: Record<string, any>) {
    return this.prisma.testAttempt.create({
      data: {
        userId,
        testId,
        label,
        progress: initialProgress ?? {},
      },
    });
  }

  // Obtener intento por id (para continuar)
  async getAttemptOrThrow(userId: string, testId: string, attemptId: string) {
    const attempt = await this.prisma.testAttempt.findFirst({
      where: { id: attemptId, userId, testId },
    });
    if (!attempt) throw new NotFoundException('Intento no encontrado.');
    return attempt;
  }

  // Guardar progreso sobre un intento específico
  async saveProgressByAttemptId(userId: string, testId: string, attemptId: string, progress: Record<string, any>) {
    await this.getAttemptOrThrow(userId, testId, attemptId);
    return this.prisma.testAttempt.update({
      where: { id: attemptId },
      data: { progress },
    });
  }

  // Marcar como finalizado
  async completeAttempt(userId: string, testId: string, attemptId: string) {
    await this.getAttemptOrThrow(userId, testId, attemptId);
    return this.prisma.testAttempt.update({
      where: { id: attemptId },
      data: { completed: true, completedAt: new Date() },
    });
  }
}

import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { TestProgressSchema } from '../types/test-progress';

@Controller()
export class AttemptsController {
  constructor(private readonly attempts: AttemptsService) {}

  // POST /api/tests/:testId/attempts
  @Post('tests/:testId/attempts')
  async start(@Param('testId') testId: string, @Req() req: any) {
    const userId = req.user.id;

    // Permitir "auto" para crear test automáticamente
    if (testId === 'auto') {
      return this.attempts.startAttempt({
        userId,
        testName: 'Diagnóstico REP',
        label: 'Diagnóstico',
      });
    }

    return this.attempts.startAttempt({
      userId,
      testId: Number(testId),
      label: 'Diagnóstico',
    });
  }

  // PATCH /api/attempts/:attemptId/progress
  @Patch('attempts/:attemptId/progress')
  async save(
    @Param('attemptId') attemptId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    const parsed = TestProgressSchema.parse(body.progress);
    return this.attempts.saveProgress({
      attemptId: Number(attemptId),
      userId,
      progress: parsed,
    });
  }

  // GET /api/attempts/:attemptId - Obtener un intento específico
  @Get('attempts/:attemptId')
  async getOne(@Param('attemptId') attemptId: string, @Req() req: any) {
    const userId = req.user.id;
    return this.attempts.getAttempt(Number(attemptId), userId);
  }

  // GET /api/attempts - Listar todos los intentos del usuario
  @Get('attempts')
  async getAll(@Req() req: any) {
    const userId = req.user.id;
    return this.attempts.getUserAttempts(userId);
  }

  // GET /api/tests/:testId/attempts/history - Obtener historial de intentos de un test
  @Get('tests/:testId/attempts/history')
  async getHistory(@Param('testId') testId: string, @Req() req: any) {
    const userId = req.user.id;
    return this.attempts.getTestHistory(userId, Number(testId));
  }

  // POST /api/attempts/:attemptId/complete - Completar intento
  @Post('attempts/:attemptId/complete')
  async complete(
    @Param('attemptId') attemptId: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.attempts.completeAttempt({
      attemptId: Number(attemptId),
      userId,
      score: body.score,
    });
  }
}
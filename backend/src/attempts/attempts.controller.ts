import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { TestProgressSchema } from '../types/test-progress';

@Controller('api')
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
}
import { Body, Controller, Param, Patch, Post, Req } from '@nestjs/common';
import { AttemptsService } from './attempts.service';

/** Controller para rutas por test (iniciar/reanudar intento) */
@Controller('tests/:testId/attempts')
export class AttemptsController {
  constructor(private attempts: AttemptsService) {}

  @Post('start')
  async start(
    @Param('testId') testIdParam: string,
    @Body() body: { label?: string },
    @Req() req: any,
  ) {
    const testId = Number(testIdParam);
    const userId = Number(req.user?.id ?? 1); // temporal si aún no hay auth

    return this.attempts.startAttempt({
      userId,
      testId,
      label: body.label,
    });
  }
}

/** Controller para rutas por id de intento (autosave, etc.) */
@Controller('attempts')
export class AttemptsByIdController {
  constructor(private attempts: AttemptsService) {}

  @Patch(':attemptId/progress')
  async updateProgress(
    @Param('attemptId') attemptIdParam: string,
    @Body() body: { progress: unknown },
    @Req() req: any,
  ) {
    const attemptId = Number(attemptIdParam);
    const userId = Number(req.user?.id ?? 1); // temporal

    return this.attempts.saveProgress({
      attemptId,
      userId,
      progress: body.progress,
    });
  }
}

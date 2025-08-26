import { Body, Controller, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { SaveProgressDto } from './dto/save-progress.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tests')
@UseGuards(AuthGuard('jwt'))
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Get(':testId/attempts/incomplete')
  async listIncomplete(@Param('testId') testId: string, @Req() req: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.testsService.listIncompleteAttempts(userId, testId);
  }

  @Post(':testId/attempts')
  async createNew(
    @Param('testId') testId: string,
    @Body() dto: CreateAttemptDto,
    @Req() req: any,
  ) {
    const userId = req.user?.sub || req.user?.id;
    return this.testsService.createNewAttempt(userId, testId, dto.label, dto.initialProgress);
  }

  @Get(':testId/attempts/:attemptId')
  async getOne(@Param('testId') testId: string, @Param('attemptId') attemptId: string, @Req() req: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.testsService.getAttemptOrThrow(userId, testId, attemptId);
  }

  @Patch(':testId/attempts/:attemptId')
  async save(
    @Param('testId') testId: string,
    @Param('attemptId') attemptId: string,
    @Body() dto: SaveProgressDto,
    @Req() req: any,
  ) {
    const userId = req.user?.sub || req.user?.id;
    return this.testsService.saveProgressByAttemptId(userId, testId, attemptId, dto.progress);
  }

  @Post(':testId/attempts/:attemptId/complete')
  async complete(@Param('testId') testId: string, @Param('attemptId') attemptId: string, @Req() req: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.testsService.completeAttempt(userId, testId, attemptId);
  }
}

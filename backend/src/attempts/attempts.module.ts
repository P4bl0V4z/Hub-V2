// src/attempts/attempts.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AttemptsService } from './attempts.service';
import { AttemptsController, AttemptsByIdController } from './attempts.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AttemptsController, AttemptsByIdController],
  providers: [AttemptsService],
  exports: [AttemptsService],
})
export class AttemptsModule {}

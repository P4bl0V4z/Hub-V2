// src/attempts/attempts.module.ts
import { Module } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { AttemptsController } from './attempts.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AttemptsController], // 👈 solo este
  providers: [AttemptsService],
  exports: [AttemptsService],
})
export class AttemptsModule {}

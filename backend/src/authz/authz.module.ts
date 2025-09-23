import { Module } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [AuthorizationService, PrismaService],
  exports: [AuthorizationService],
})
export class AuthzModule {}

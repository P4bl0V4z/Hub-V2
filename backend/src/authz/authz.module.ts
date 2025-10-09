import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthorizationService } from './authorization.service';
import { AuthzGuard } from './authz.guard';

@Module({
  imports: [PrismaModule],
  providers: [AuthorizationService, AuthzGuard, Reflector],
  exports: [AuthorizationService, AuthzGuard],
})
export class AuthzModule {}

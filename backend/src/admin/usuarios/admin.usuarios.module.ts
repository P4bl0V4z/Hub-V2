import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AdminUsuariosController } from './admin.usuarios.controller';
import { AdminUsuariosService } from './admin.usuarios.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtCookieAuthGuard } from '../../auth/guards/jwt-cookie.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    AuthModule,
  ],
  controllers: [AdminUsuariosController],
  providers: [
    AdminUsuariosService,
    PrismaService,
    JwtCookieAuthGuard,
    AdminGuard,
  ],
})
export class AdminUsuariosModule {}

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthzModule } from '../authz/authz.module';

@Module({
  imports: [PrismaModule, AuthzModule],   // <-- Añado AuthzModule aquí
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

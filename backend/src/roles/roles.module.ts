import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthzModule } from '../authz/authz.module';

@Module({
  imports: [PrismaModule, AuthzModule],   // <-- Añado AuthzModule
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}

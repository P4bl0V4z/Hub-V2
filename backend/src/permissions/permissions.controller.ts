// backend/src/permissions/permissions.controller.ts
import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie.guard';
import { AuthzGuard } from '../authz/authz.guard';
import { AUTHZ_MIN, AUTHZ_OBJECT } from '../authz/authz.decorator';

@UseGuards(JwtCookieAuthGuard, AuthzGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @SetMetadata(AUTHZ_OBJECT, 'permissions')
  @SetMetadata(AUTHZ_MIN, 'VER')
  @Get()
  list() {
    return this.service.findAll();
  }
}

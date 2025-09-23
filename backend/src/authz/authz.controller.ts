import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
// Usa tu guard de autenticación JWT actual
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('authz')
@UseGuards(JwtAuthGuard)
export class AuthzController {
  constructor(private authz: AuthorizationService) {}

  @Get('access')
  async getAccess(@Req() req, @Query('objectKey') objectKey: string) {
    const userId = req.user.id as number;
    const empresaId = req.empresaId as number; // setéalo en tu middleware
    const level = await this.authz.getAccessLevel(userId, empresaId, objectKey);
    return { objectKey, level };
  }
}

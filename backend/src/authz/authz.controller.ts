import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../auth/guards/jwt.guard';

type ReqUser = { id: number; email: string; nombre: string };

@Controller('authz')
@UseGuards(JwtGuard)
export class AuthzController {
  @Get('access')
  async getAccess(
    @Req() req: Request & { user?: ReqUser },
    @Query('objectKey') objectKey: string,
  ) {
    if (!objectKey) {
      objectKey = '';
    }
    const user = req.user;
    return { ok: true, objectKey, userId: user?.id };
  }
}

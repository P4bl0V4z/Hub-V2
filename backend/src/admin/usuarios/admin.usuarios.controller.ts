import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AdminUsuariosService } from '../../admin/usuarios/admin.usuarios.service';
import { JwtCookieAuthGuard } from '../../auth/guards/jwt-cookie.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';

@Controller('admin/usuarios')
@UseGuards(JwtCookieAuthGuard, AdminGuard)
export class AdminUsuariosController {
  constructor(private readonly svc: AdminUsuariosService) {}

  @Get()
  list(
    @Query('search') search = '',
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 20));
    return this.svc.list({ search, page: p, take });
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.svc.detail(Number(id));
  }
}

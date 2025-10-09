import { Request } from 'express';
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtCookieAuthGuard } from '../auth/guards/jwt-cookie.guard';
import { AuthorizationService } from '../authz/authorization.service';

@UseGuards(JwtCookieAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly service: UsersService,
    private readonly authz: AuthorizationService,
  ) {}

  @Get('me/access')
  async meAccess(@Req() req: Request & { user?: any; empresaId?: number }) {
    const userId = req.user?.id as number | undefined;
    let empresaId = req.empresaId as number | undefined;

    if (!userId) {
      return { isSuperAdmin: false, access: {} };
    }

    // Si no vino empresaId en el request, lo determinamos
    if (!empresaId) {
      const empresas = await this.service['prisma'].usuarioEmpresa.findMany({
        where: { usuarioId: userId },
        select: {
          empresaId: true,
          empresa: { select: { esEmpresaMaestra: true } },
        },
        orderBy: { empresaId: 'asc' },
      });

      const master = empresas.find(e => e.empresa.esEmpresaMaestra);
      empresaId = master?.empresaId ?? empresas[0]?.empresaId;
      if (!empresaId) {
        // El usuario no pertenece a ninguna empresa todavía
        return { isSuperAdmin: false, access: {} };
      }
    }

    // Superadmin si está en empresa maestra y tiene rol con soloEmpresaMaestra=true
    const isSuperAdmin = await this.authz.isSuperAdmin(userId, empresaId);
    if (isSuperAdmin) return { isSuperAdmin: true, access: {} };

    // Si no es superadmin, devolvemos el mapa de accesos
    const accessMap = await this.authz.getAccessMap(userId, empresaId);
    return { isSuperAdmin: false, access: accessMap };
  }
}

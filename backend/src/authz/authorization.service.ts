import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { NivelAcceso } from '@prisma/client';

@Injectable()
export class AuthorizationService {
  constructor(private prisma: PrismaService) {}

  private combine(levels: NivelAcceso[]): NivelAcceso {
    const effective = levels.filter(l => l !== 'SIN_DEFINIR');
    if (effective.includes('SIN_ACCESO')) return 'SIN_ACCESO';
    if (effective.includes('EDITAR'))     return 'EDITAR';
    if (effective.includes('VER'))        return 'VER';
    return 'SIN_DEFINIR';
  }

  async getAccessLevel(
    userId: number,
    empresaId: number,
    objectKey: string
  ): Promise<NivelAcceso> {
    // Trae el contexto del usuario en esta empresa y los roles asignados
    const ue = await this.prisma.usuarioEmpresa.findUnique({
      where: { usuarioId_empresaId: { usuarioId: userId, empresaId } },
      select: {
        empresa: { select: { esEmpresaMaestra: true } },
        roles: {
          select: {
            rol: {
              select: {
                id: true,
                soloEmpresaMaestra: true,
                rolesAcceso: {
                  where: { objeto: { key: objectKey } },
                  select: { nivel: true },
                },
              },
            },
          },
        },
      },
    });

    if (!ue) return 'SIN_DEFINIR';
    const isMaster = ue.empresa.esEmpresaMaestra;

    const levels: NivelAcceso[] = [];
    for (const ur of ue.roles) {
      const rol = ur.rol;
      // Si el rol es solo para empresa maestra, ignóralo si este usuario no está en la maestra
      if (rol.soloEmpresaMaestra && !isMaster) continue;
      for (const ra of rol.rolesAcceso) levels.push(ra.nivel);
    }
    return this.combine(levels);
  }

  async isAuthorized(
    userId: number,
    empresaId: number,
    objectKey: string,
    min: NivelAcceso = 'VER'
  ): Promise<boolean> {
    const level = await this.getAccessLevel(userId, empresaId, objectKey);
    const order: Record<NivelAcceso, number> = {
      SIN_ACCESO: 0, SIN_DEFINIR: 1, VER: 2, EDITAR: 3,
    };
    return order[level] >= order[min];
  }
}

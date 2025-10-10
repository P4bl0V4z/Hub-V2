import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { NivelAcceso } from '@prisma/client';

const ORDER: Record<NivelAcceso, number> = {
  SIN_DEFINIR: 0,
  SIN_ACCESO: 1,
  VER: 2,
  EDITAR: 3,
};

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  private combine(levels: NivelAcceso[]): NivelAcceso {
    const effective = levels.filter((l) => l !== 'SIN_DEFINIR');
    if (effective.length === 0) return 'SIN_DEFINIR';
    return effective.reduce((max, cur) => (ORDER[cur] > ORDER[max] ? cur : max), 'SIN_ACCESO' as NivelAcceso);
  }

  async resolveEmpresaIdFor(userId: number): Promise<number | undefined> {
    const empresas = await this.prisma.usuarioEmpresa.findMany({
      where: { usuarioId: userId },
      select: { empresaId: true, empresa: { select: { esEmpresaMaestra: true } } },
      orderBy: { empresaId: 'asc' },
    });
    const master = empresas.find(e => e.empresa.esEmpresaMaestra);
    return master?.empresaId ?? empresas[0]?.empresaId;
  }

  async isSuperAdmin(userId: number, empresaId: number): Promise<boolean> {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
      select: { esEmpresaMaestra: true },
    });
    if (!empresa?.esEmpresaMaestra) return false;

    const hasMasterRole = await this.prisma.usuarioRol.findFirst({
      where: {
        usuarioEmpresa: { usuarioId: userId, empresaId },
        rol: { soloEmpresaMaestra: true },
      },
      select: { id: true },
    });
    return Boolean(hasMasterRole);
  }

  async getAccessLevel(userId: number, empresaId: number, objectKey: string): Promise<NivelAcceso> {
    const ue = await this.prisma.usuarioEmpresa.findUnique({
      where: { usuarioId_empresaId: { usuarioId: userId, empresaId } },
      select: {
        empresa: { select: { esEmpresaMaestra: true } },
        roles: {
          select: {
            rol: {
              select: {
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

    const niveles: NivelAcceso[] = [];
    for (const ur of ue.roles) {
      const rol = ur.rol;
      if (rol.soloEmpresaMaestra && !isMaster) continue;
      for (const ra of rol.rolesAcceso) niveles.push(ra.nivel);
    }
    return this.combine(niveles);
  }

  async isAuthorized(userId: number, empresaId: number, objectKey: string, min: NivelAcceso = 'VER'): Promise<boolean> {
    const level = await this.getAccessLevel(userId, empresaId, objectKey);
    return ORDER[level] >= ORDER[min];
  }

  async getAccessMap(userId: number, empresaId: number): Promise<Record<string, NivelAcceso>> {
    const rows = await this.prisma.usuarioRol.findMany({
      where: { usuarioEmpresa: { usuarioId: userId, empresaId } },
      select: {
        rol: {
          select: {
            soloEmpresaMaestra: true,
            rolesAcceso: { select: { nivel: true, objeto: { select: { key: true } } } },
          },
        },
        usuarioEmpresa: { select: { empresa: { select: { esEmpresaMaestra: true } } } },
      },
    });

    if (!rows.length) return {};
    const isMaster = rows[0]?.usuarioEmpresa?.empresa?.esEmpresaMaestra ?? false;

    const result: Record<string, NivelAcceso> = {};
    for (const r of rows) {
      if (r.rol.soloEmpresaMaestra && !isMaster) continue;
      for (const ra of r.rol.rolesAcceso) {
        const key = ra.objeto.key;
        const current = result[key] ?? 'SIN_DEFINIR';
        result[key] = ORDER[ra.nivel] > ORDER[current] ? ra.nivel : current;
      }
    }
    return result;
  }
}

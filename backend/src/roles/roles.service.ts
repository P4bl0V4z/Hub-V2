// backend/src/roles/roles.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, NivelAcceso } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(empresaId: number) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id: empresaId } });
    const where = empresa?.esEmpresaMaestra ? {} : { soloEmpresaMaestra: false };

    return this.prisma.rol.findMany({
      where,
      orderBy: [{ soloEmpresaMaestra: 'desc' }, { nombre: 'asc' }],
      include: { _count: { select: { usuarios: true, rolesAcceso: true } } },
    });
  }

  async create(empresaIdCtx: number, dto: CreateRoleDto) {
    if (dto.soloEmpresaMaestra) {
      const isMaster = await this.prisma.empresa.findFirst({
        where: { id: empresaIdCtx, esEmpresaMaestra: true },
        select: { id: true },
      });
      if (!isMaster) throw new ForbiddenException('Solo la empresa maestra puede crear roles soloEmpresaMaestra.');
    }
    return this.prisma.rol.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion ?? null,
        soloEmpresaMaestra: dto.soloEmpresaMaestra,
      },
    });
  }

  async findById(empresaId: number, id: number) {
    const rol = await this.prisma.rol.findUnique({
      where: { id },
      include: {
        rolesAcceso: { include: { objeto: true } }, // para mapear niveles por objeto
        usuarios: { include: { usuarioEmpresa: { include: { usuario: true, empresa: true } } } },
      },
    });
    if (!rol) throw new NotFoundException('Rol no encontrado');

    const empresa = await this.prisma.empresa.findUnique({ where: { id: empresaId }});
    if (!empresa?.esEmpresaMaestra && rol.soloEmpresaMaestra) {
      throw new ForbiddenException('Acceso restringido a empresa maestra.');
    }

    // Transformo a payload para UI
    return {
      role: {
        id: rol.id,
        nombre: rol.nombre,
        descripcion: rol.descripcion,
        soloEmpresaMaestra: rol.soloEmpresaMaestra,
      },
      access: rol.rolesAcceso.map(ra => ({
        objectKey: ra.objeto.key,
        nivel: ra.nivel as NivelAcceso,
      })),
      users: rol.usuarios.map(ur => ({
        id: ur.usuarioEmpresa.usuario.id,
        nombre: ur.usuarioEmpresa.usuario.nombre,
        email: ur.usuarioEmpresa.usuario.email,
        empresaId: ur.usuarioEmpresa.empresa.id,
      })),
    };
  }

  async update(empresaId: number, id: number, dto: UpdateRoleDto) {
    if (dto.soloEmpresaMaestra === true) {
      const isMaster = await this.prisma.empresa.findFirst({
        where: { id: empresaId, esEmpresaMaestra: true },
      });
      if (!isMaster) throw new ForbiddenException('Solo la empresa maestra puede marcar un rol como soloEmpresaMaestra.');
    }
    return this.prisma.rol.update({
      where: { id },
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        soloEmpresaMaestra: dto.soloEmpresaMaestra,
      },
    });
  }

  async remove(empresaId: number, id: number) {
    await this.findById(empresaId, id);
    return this.prisma.rol.delete({ where: { id } });
  }

  /**
   * Reemplaza el mapa de accesos del rol (nivel por ObjetoSistema).
   * entries: [{ objectKey, nivel }]
   */
  async replaceAccess(empresaId: number, roleId: number, entries: { objectKey: string; nivel: NivelAcceso }[]) {
    await this.findById(empresaId, roleId); // valida visibilidad

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Mapeo keys a objetos
      const keys = Array.from(new Set(entries.map(e => e.objectKey)));
      const objetos = await tx.objetoSistema.findMany({ where: { key: { in: keys } } });
      const keyToId = new Map(objetos.map(o => [o.key, o.id]));

      // Limpio existentes
      await tx.rolAcceso.deleteMany({ where: { rolId: roleId } });

      // Creo nuevos
      const data = entries
        .filter(e => keyToId.has(e.objectKey))
        .map(e => ({
          rolId: roleId,
          objetoSistemaId: keyToId.get(e.objectKey)!,
          nivel: e.nivel,
        }));

      if (data.length) {
        await tx.rolAcceso.createMany({ data, skipDuplicates: true });
      }
      return { ok: true, count: data.length };
    });
  }

  /**
   * Reemplaza los usuarios asignados a un rol en el contexto de empresa.
   * - Crea UsuarioEmpresa si el usuario aún no está vinculado a esa empresa.
   * - Reemplaza completamente las filas de UsuarioRol del rol en esa empresa.
   */
  async replaceUsers(empresaId: number, roleId: number, userIds: number[]) {
    // valida rol visible
    await this.findById(empresaId, roleId);

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Asegurar UsuarioEmpresa (vínculo usuario-empresa) para cada usuario
      const users = Array.from(new Set(userIds));
      const existingUE = await tx.usuarioEmpresa.findMany({
        where: { empresaId, usuarioId: { in: users } },
        select: { id: true, usuarioId: true },
      });
      const have = new Set(existingUE.map(x => x.usuarioId));
      const toCreate = users.filter(u => !have.has(u));

      if (toCreate.length) {
        await tx.usuarioEmpresa.createMany({
          data: toCreate.map(usuarioId => ({ usuarioId, empresaId })),
          skipDuplicates: true,
        });
      }

      // Obtener todos los UsuarioEmpresa IDs ahora
      const allUE = await tx.usuarioEmpresa.findMany({
        where: { empresaId, usuarioId: { in: users } },
        select: { id: true },
      });
      const ueIds = allUE.map(x => x.id);

      // Limpiar todas las asignaciones de ese rol EN ESA EMPRESA
      await tx.usuarioRol.deleteMany({
        where: {
          rolId: roleId,
          usuarioEmpresa: { empresaId },
        },
      });

      // Re-crear asignaciones para los ueIds
      if (ueIds.length) {
        await tx.usuarioRol.createMany({
          data: ueIds.map(usuarioEmpresaId => ({ usuarioEmpresaId, rolId: roleId })),
          skipDuplicates: true,
        });
      }

      return { ok: true, count: ueIds.length };
    });
  }
}

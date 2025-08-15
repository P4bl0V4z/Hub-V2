import { Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminUsuariosService {
  constructor(private prisma: PrismaService) {}

  async list({ search, page, take }: { search: string; page: number; take: number }) {
    const term = (search ?? '').trim();

    const where: Prisma.UsuarioWhereInput = term
      ? {
          OR: [
            { email: { contains: term, mode: Prisma.QueryMode.insensitive } },
            { nombre: { contains: term, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const total = await this.prisma.usuario.count({ where });

    const items = await this.prisma.usuario.findMany({
      where,
      orderBy: { creadoEn: Prisma.SortOrder.desc },
      skip: (page - 1) * take,
      take,
    });

    return { total, page, pageSize: take, items };
  }

  async detail(id: number) {
    const u = await this.prisma.usuario.findUnique({
      where: { id },
      include: {
        empresas: {
          include: {
            empresa: { select: { id: true, nombre: true } },
            roles: { include: { rol: { select: { id: true, nombre: true } } } },
          },
        },
      },
    });
    if (!u) throw new NotFoundException('Usuario no encontrado');

    type RolRef = { rol: { id: string | number; nombre: string } };
    type UsuarioEmpresaRef = {
      empresa: { id: string | number; nombre: string };
      roles: RolRef[];
    };

    const empresas = u.empresas.map((ue: UsuarioEmpresaRef) => ({
      id: ue.empresa.id,
      nombre: ue.empresa.nombre,
      roles: ue.roles.map((r: RolRef) => ({
        id: r.rol.id,
        nombre: r.rol.nombre,
      })),
    }));

    return {
      id: u.id,
      email: u.email,
      nombre: u.nombre,
      activo: u.activo,
      verificadoEn: u.verificadoEn,
      tipoUsuario: u.tipoUsuario,
      lastLoginAt: u.lastLoginAt,
      empresas,
    };
  }
}

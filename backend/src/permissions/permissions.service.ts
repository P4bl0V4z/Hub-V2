import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.objetoSistema.findMany({
      orderBy: [{ key: 'asc' }],
      select: { id: true, key: true, nombre: true, descripcion: true },
    });
  }
}

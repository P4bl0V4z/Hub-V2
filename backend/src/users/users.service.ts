import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findBasic(q?: string) {
    const term = (q ?? '').trim();
    const isEmpty = term.length === 0 || term.toLowerCase() === 'undefined' || term.toLowerCase() === 'null';

    const where = !isEmpty
      ? {
          OR: [
            { nombre: { contains: term, mode: 'insensitive' as const } },
            { email:  { contains: term, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return this.prisma.usuario.findMany({
      where,
      select: { id: true, nombre: true, email: true },
      orderBy: [{ nombre: 'asc' }],
      take: 50,
    });
  }
}

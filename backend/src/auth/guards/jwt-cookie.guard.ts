import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const raw = req.cookies?.access_token;
    if (!raw) throw new UnauthorizedException();

    const verifyOpts: Record<string, any> = { secret: this.config.get<string>('JWT_SECRET') };
    const iss = this.config.get<string>('JWT_ISSUER');
    const aud = this.config.get<string>('JWT_AUDIENCE');
    if (iss) verifyOpts.issuer = iss;
    if (aud) verifyOpts.audience = aud;

    const payload = await this.jwt.verifyAsync(raw, verifyOpts);
    const userId: number = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    if (!Number.isFinite(userId)) throw new UnauthorizedException();

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nombre: true, tipoUsuario: true },
    });
    if (!usuario) throw new UnauthorizedException();

    req.user = usuario;
    return true;
  }
}

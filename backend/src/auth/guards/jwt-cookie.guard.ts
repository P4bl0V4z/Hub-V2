import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    const bearer = req.headers?.authorization;
    const headerToken =
      typeof bearer === 'string' && bearer.startsWith('Bearer ')
        ? bearer.slice('Bearer '.length)
        : undefined;

    const raw = req.cookies?.access_token ?? headerToken;
    if (!raw) {
      throw new UnauthorizedException('Missing access token (cookie "access_token" or Authorization: Bearer)');
    }

    const verifyOpts: Record<string, any> = { secret: this.config.get<string>('JWT_SECRET') };
    const iss = this.config.get<string>('JWT_ISSUER');
    const aud = this.config.get<string>('JWT_AUDIENCE');
    if (iss) verifyOpts.issuer = iss;
    if (aud) verifyOpts.audience = aud;

    try {
      const payload = await this.jwt.verifyAsync(raw, verifyOpts);
      const userId: number =
        typeof payload?.sub === 'string' ? parseInt(payload.sub, 10) : payload?.sub;

      if (!Number.isFinite(userId)) {
        throw new UnauthorizedException('Invalid JWT payload (sub)');
      }

      const usuario = await this.prisma.usuario.findUnique({
        where: { id: userId },
        select: { id: true, email: true, nombre: true },
      });

      if (!usuario) {
        throw new UnauthorizedException('User not found');
      }

      req.user = usuario;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

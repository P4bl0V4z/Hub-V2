import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(
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

    // ✅ Instanciamos JwtService localmente para no depender del JwtModule del feature
    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) throw new UnauthorizedException('JWT secret not configured');
    const jwt = new JwtService({ secret });

    const iss = this.config.get<string>('JWT_ISSUER');
    const aud = this.config.get<string>('JWT_AUDIENCE');

    try {
      const payload = await jwt.verifyAsync(raw, {
        secret,
        ...(iss ? { issuer: iss } : {}),
        ...(aud ? { audience: aud } : {}),
      });

      const userId: number =
        typeof payload?.sub === 'string' ? parseInt(payload.sub, 10) : payload?.sub;

      if (!Number.isFinite(userId)) {
        throw new UnauthorizedException('Invalid JWT payload (sub)');
      }

      const usuario = await this.prisma.usuario.findUnique({
        where: { id: userId },
        select: { id: true, email: true, nombre: true },
      });

      if (!usuario) throw new UnauthorizedException('User not found');

      req.user = usuario;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

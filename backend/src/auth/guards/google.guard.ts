import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import type { Request } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private jwt: JwtService, private config: ConfigService) {
    super();
  }

  private sanitizeFrom(from?: string): string {
    if (!from || typeof from !== 'string') return '/';
    try {
      const decoded = decodeURIComponent(from);
      if (!decoded.startsWith('/') || decoded.includes('://')) return '/';
      return decoded.replace(/[\r\n]/g, '');
    } catch {
      return '/';
    }
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const from = this.sanitizeFrom(req.query?.from as string);

    const state = this.jwt.sign(
      { n: randomBytes(16).toString('hex'), r: from },
      {
        secret: this.config.get<string>('OAUTH_STATE_SECRET')!,
        expiresIn: '10m',
      },
    );

    return {
      scope: ['openid', 'email', 'profile'],
      state,
      accessType: 'offline',
      includeGrantedScopes: true,
    };
  }
}

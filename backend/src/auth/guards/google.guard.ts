import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(private jwt: JwtService, private config: ConfigService) {
    super();
  }

  // Pasa opciones a passport.authenticate por request (scope + state firmado)
  getAuthenticateOptions(context: ExecutionContext) {
    const state = this.jwt.sign(
      { n: randomBytes(16).toString('hex') },
      {
        secret: this.config.get<string>('OAUTH_STATE_SECRET')!,
        expiresIn: '10m',
      },
    );
    return { scope: ['openid', 'email', 'profile'], state };
  }
}

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import type {Profile as PassportProfile} from 'passport';
type Profile = PassportProfile;
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      clientID: config.get<string>('MS_CLIENT_ID')!,
      clientSecret: config.get<string>('MS_CLIENT_SECRET')!,
      callbackURL: config.get<string>('MS_CALLBACK_URL')!,
      scope: ['openid', 'email', 'profile'],
      tenant: config.get<string>('MS_TENANT') || 'common',
    });
  }

  async validate(_at: string, _rt: string, profile: Profile, done: Function) {
    const msId = profile.id;
    const email = profile.emails?.[0]?.value?.toLowerCase();
    const nombre = profile.displayName;

    let user = await this.prisma.usuario.findUnique({ where: { msId } });
    if (user) {
      user = await this.prisma.usuario.update({ where: { id: user.id }, data: { lastLoginAt: new Date() }});
      return done(null, user);
    }

    if (email) {
      const byEmail = await this.prisma.usuario.findUnique({ where: { email } });
      if (byEmail) {
        const linked = await this.prisma.usuario.update({
          where: { id: byEmail.id },
          data: {
            msId,
            activo: true,
            verificadoEn: byEmail.verificadoEn ?? new Date(),
            tokenVerificacion: null,
            nombre: byEmail.nombre || nombre,
            lastLoginAt: new Date(),
          },
        });
        return done(null, linked);
      }
    }

    const created = await this.prisma.usuario.create({
      data: {
        email: email ?? `${msId}@no-email.microsoft`,
        nombre,
        msId,
        password: null,
        activo: true,
        verificadoEn: new Date(),
        tokenVerificacion: null,
        lastLoginAt: new Date(),
      },
    });
    return done(null, created);
  }
}

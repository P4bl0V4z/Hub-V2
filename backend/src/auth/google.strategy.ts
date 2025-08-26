import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL')!,
      scope: ['openid', 'email', 'profile'],
    });
  }

  async validate(_at: string, _rt: string, profile: Profile, done: Function) {
    const googleId = profile.id;
    const email = profile.emails?.[0]?.value?.toLowerCase();
    const nombre = profile.displayName || [profile.name?.givenName, profile.name?.familyName].filter(Boolean).join(' ');

    // 1) ¿ya está vinculado por googleId?
    let user = await this.prisma.usuario.findUnique({ where: { googleId } });
    if (user) {
      user = await this.prisma.usuario.update({ where: { id: user.id }, data: { lastLoginAt: new Date() }});
      return done(null, user);
    }

    // 2) Vincular por email (si coincide y Google lo trae verificado)
    const emailVerified = (profile as any)?._json?.email_verified === true;
    if (email) {
      const byEmail = await this.prisma.usuario.findUnique({ where: { email } });
      if (byEmail) {
        if (!emailVerified) return done(new Error('Email no verificado por Google'), false);
        const linked = await this.prisma.usuario.update({
          where: { id: byEmail.id },
          data: {
            googleId,
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

    // 3) Crear nuevo (sin contraseña)
    const created = await this.prisma.usuario.create({
      data: {
        email: email ?? `${googleId}@no-email.google`,
        nombre,
        googleId,
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

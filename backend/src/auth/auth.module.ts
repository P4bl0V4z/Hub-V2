import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from '../mailer/mailer.module';
import { GoogleStrategy } from './google.strategy';
import { GoogleAuthGuard } from './guards/google.guard';
import { AuthzModule } from '../authz/authz.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PrismaModule,
    MailerModule,
    ConfigModule,
    PassportModule.register({ session: false }),
    AuthzModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
        expiresIn: '30m',
        audience: 'beloop',
        issuer: 'auth.beloop',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleAuthGuard, GoogleStrategy],
})
export class AuthModule {}

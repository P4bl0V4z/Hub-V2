import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../mailer/mailer.service';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private mailer: MailerService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existing = await this.prisma.usuario.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existing) {
      throw new BadRequestException('Email ya registrado');
    }

    const pepper = this.config.get<string>('PASSWORD_PEPPER') ?? '';
    const cost = Number(this.config.get('BCRYPT_COST') ?? 12);
    const hashed = await bcrypt.hash(data.password + pepper, cost);

    const token = await this.jwtService.signAsync(
      { email: data.email.toLowerCase() },
      {
        secret: this.config.get<string>('JWT_SECRET'),
        algorithm: 'HS256',
        expiresIn: '1d',
      },
    );

    const tokenHash = createHash('sha256').update(token).digest('hex');

    await this.prisma.usuario.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashed,
        nombre: data.nombre,
        tokenVerificacion: tokenHash,
        activo: false,
        creadoEn: new Date(),
        verificadoEn: null,
      },
    });

    await this.mailer.sendVerificationEmail(data.email.toLowerCase(), token);

    return { message: 'Usuario creado. Revisa tu email para activarlo.' };
  }

  async verifyEmail(token: string) {
    if (!token) throw new BadRequestException('Token requerido');

    try {
      const decoded = await this.jwtService.verifyAsync<{
        email: string;
        iat: number;
        exp: number;
      }>(token, {
        secret: this.config.get<string>('JWT_SECRET'),
        algorithms: ['HS256'],
        clockTolerance: 300,
      });

      if (!decoded?.email) throw new BadRequestException('Token inválido');

      const usuario = await this.prisma.usuario.findUnique({
        where: { email: decoded.email.toLowerCase() },
        select: { email: true, activo: true, tokenVerificacion: true },
      });
      if (!usuario) throw new BadRequestException('Token inválido');
      if (usuario.activo) {
        return { message: 'Cuenta ya verificada' };
      }

      const incomingHash = createHash('sha256').update(token).digest('hex');
      if (!usuario.tokenVerificacion || usuario.tokenVerificacion !== incomingHash) {
        throw new BadRequestException('Token inválido o expirado');
      }

      await this.prisma.usuario.update({
        where: { email: decoded.email.toLowerCase() },
        data: {
          activo: true,
          verificadoEn: new Date(),
          tokenVerificacion: null,
        },
      });

      return { message: 'Cuenta verificada correctamente' };
    } catch (e) {
      // console.error('verifyEmail error:', e?.name, e?.message);
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  async login(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        empresas: {
          include: {
            empresa: true,
            roles: { include: { rol: true } },
          },
        },
      },
    });

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas o usuario no verificado');
    }

    if (usuario.tokenVerificacion) {
      throw new UnauthorizedException('Cuenta no verificada');
    }

    if (!usuario.password) {
      throw new UnauthorizedException('Esta cuenta no tiene contraseña local. Inicia con Google/Microsoft.');
    }

    const pepper = this.config.get<string>('PASSWORD_PEPPER') ?? '';
    const passwordOk = await bcrypt.compare(password + pepper, usuario.password);
    if (!passwordOk) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
    };
    const token = this.jwtService.sign(payload);

    try {
      await this.prisma.usuario.update({
        where: { id: usuario.id },
        data: { lastLoginAt: new Date() },
      });
    } catch (_) {}

    const empresas = usuario.empresas.map((ue) => ({
      id: ue.empresa.id,
      nombre: ue.empresa.nombre,
      roles: ue.roles.map((r) => r.rol.nombre),
    }));

    return {
      token,
      nombre: usuario.nombre,
      email: usuario.email,
      empresas,
    };
  }
}

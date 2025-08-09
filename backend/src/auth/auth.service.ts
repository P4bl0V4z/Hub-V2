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
import { stringify } from 'querystring';

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
      where: { email: data.email },
    });

    if (existing) {
      throw new BadRequestException('Email ya registrado');
    }
    const hashed = await bcrypt.hash(data.password, 10);

    // CAMBIOS EN GENERACION DE TOKEN
    const token = await this.jwtService.signAsync(
      { email: data.email },
      {
        secret: this.config.get<string>('JWT_SECRET'),
        algorithm: 'HS256',
        expiresIn: '1d',
      },
    );

    // Guarda el token tal cual si quieres (mejoraré esto más abajo)
    await this.prisma.usuario.create({
      data: {
        email: data.email,
        password: hashed,
        nombre: data.nombre,
        tokenVerificacion: token,
        activo: false,
        creadoEn: new Date(),
        verificadoEn: null,
      },
    });

    await this.mailer.sendVerificationEmail(data.email, token);
    return { message: 'Usuario creado. Revisa tu email para activarlo.' };
  }

  // CAMBIOS EN VERIFICACION DE CUENTA
  async verifyEmail(token: string) {
    if (!token) throw new BadRequestException('Token requerido');

    try {
      const decoded = await this.jwtService.verifyAsync<{ email: string; iat: number; exp: number }>(token, {
        secret: this.config.get<string>('JWT_SECRET'),
        algorithms: ['HS256'],
        clockTolerance: 300,
      });

      if (!decoded?.email) throw new BadRequestException('Token inválido');

      const usuario = await this.prisma.usuario.findUnique({
        where: { email: decoded.email },
        select: { email: true, activo: true, tokenVerificacion: true },
      });

      if (!usuario) throw new BadRequestException('Token inválido');
      if (usuario.activo) {
        return { message: 'Cuenta ya verificada' };
      }

      if (!usuario.tokenVerificacion || usuario.tokenVerificacion !== token) {
        throw new BadRequestException('Token inválido o expirado');
      }

      await this.prisma.usuario.update({
        where: { email: decoded.email },
        data: {
          activo: true,
          verificadoEn: new Date(),
          tokenVerificacion: null,
        },
      });

      return { message: 'Cuenta verificada correctamente' };
    } catch (e) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  async login(email: string, password: string) {
  const usuario = await this.prisma.usuario.findUnique({
    where: { email },
    include: {
      empresas: {
        include: {
          empresa: true,
          roles: {
            include: {
              rol: true,
            },
          },
        },
      },
    },
  });

  if (!usuario || !usuario.activo || !usuario.password) {
    throw new UnauthorizedException(
      'Credenciales inválidas o usuario no verificado',
    );
  }

  if (usuario.tokenVerificacion) {
    throw new UnauthorizedException('Cuenta no verificada');
  }

  const passwordOk = await bcrypt.compare(password, usuario.password);
  if (!passwordOk) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  const payload = {
    sub: usuario.id,
    email: usuario.email,
    tipoUsuario: usuario.tipoUsuario,
  };

  const token = this.jwtService.sign(payload);

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

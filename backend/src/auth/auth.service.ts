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

  // ---------- REGISTRO ----------
  async register(data: RegisterDto) {
    const email = data.email.toLowerCase();

    const existing = await this.prisma.usuario.findUnique({
      where: { email },
    });
    if (existing) throw new BadRequestException('Email ya registrado');

    const pepper = this.config.get<string>('PASSWORD_PEPPER') ?? '';
    const cost = Number(this.config.get('BCRYPT_COST') ?? 12);
    const hashed = await bcrypt.hash(data.password + pepper, cost);

    // token de verificación (JWT) + hash persistido
    const token = await this.jwtService.signAsync(
      { email },
      {
        secret: this.config.get<string>('JWT_SECRET'),
        algorithm: 'HS256',
        expiresIn: '1d',
      },
    );
    const tokenHash = createHash('sha256').update(token).digest('hex');

    await this.prisma.usuario.create({
      data: {
        email,
        password: hashed,
        nombre: data.nombre,
        tokenVerificacion: tokenHash,
        activo: false,
        creadoEn: new Date(),
        verificadoEn: null,
      },
    });

    await this.mailer.sendVerificationEmail(email, token);
    return { message: 'Usuario creado. Revisa tu email para activarlo.' };
  }

  // ---------- VERIFICACIÓN DE EMAIL ----------
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
      if (usuario.activo) return { message: 'Cuenta ya verificada' };

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
    } catch {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  // ---------- LOGIN LOCAL (sin firmar JWT aquí) ----------
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

    try {
      await this.prisma.usuario.update({
        where: { id: usuario.id },
        data: { lastLoginAt: new Date() },
      });
    } catch {
      /* noop */
    }

    const empresas = usuario.empresas.map((ue) => ({
      id: ue.empresa.id,
      nombre: ue.empresa.nombre,
      roles: ue.roles.map((r) => r.rol.nombre),
    }));

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        tipoUsuario: usuario.tipoUsuario,
      },
      empresas,
    };
  }

  // ---------- OBTENER USUARIO DE SESIÓN ----------
  async getSessionUser(userId: number, expand: string[] = []) {
    const allow = new Set(['empresas', 'roles']);

    const includeEmpresas = allow.has('empresas') && expand.includes('empresas');
    const includeRoles = allow.has('roles') && expand.includes('roles');

    const include: any = {};

    if (includeEmpresas) {
      include.empresas = {
        include: {
          empresa: { select: { id: true, nombre: true } },
          ...(includeRoles
            ? { roles: { include: { rol: { select: { id: true, nombre: true } } } } }
            : { roles: false }),
        },
      };
    }

    const user = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nombre: true,
        tipoUsuario: true,
        ...(includeEmpresas ? { empresas: true } : {}),
      },
    });

    if (!user) return null;

    if (includeEmpresas && Array.isArray(user.empresas)) {
      (user as any).empresas = user.empresas.map((ue: any) => ({
        id: ue.empresa.id,
        nombre: ue.empresa.nombre,
        roles: includeRoles ? ue.roles.map((r: any) => r.rol.nombre) : undefined,
      }));
    }

    return user;
  }

}

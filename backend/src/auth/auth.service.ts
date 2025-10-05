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
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly mailer: MailerService,
  ) {}

  // ---- helpers privados ----
  private getPepper(): string {
    const pepper = this.config.get<string>('PASSWORD_PEPPER');
    if (!pepper) throw new Error('PASSWORD_PEPPER no configurado');
    return pepper;
  }

  private async hashPassword(plain: string): Promise<string> {
    const pepper = this.getPepper();
    const saltRounds = Number(this.config.get<string>('BCRYPT_SALT_ROUNDS') ?? 12);
    return bcrypt.hash(`${plain}${pepper}`, saltRounds);
  }

  private async comparePassword(plain: string, hash: string): Promise<boolean> {
    const pepper = this.getPepper();
    return bcrypt.compare(`${plain}${pepper}`, hash);
  }

  // ---------- REGISTRO ----------
  async register(data: RegisterDto) {
    const email = data.email.trim().toLowerCase();

    const existing = await this.prisma.usuario.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Email ya registrado');

    // hash consistente con seeding: password + pepper
    const hashed = await this.hashPassword(data.password);

    // token de verificación (JWT) + hash persistido
    const token = await this.jwtService.signAsync(
      { email },
      {
        secret: this.config.get<string>('JWT_SECRET'),
        algorithm: 'HS256',
        expiresIn: '1d',
        audience: 'beloop',
        issuer: 'auth.beloop',
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

    await this.mailer.sendVerificationEmail(data.email, token);

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
        audience: 'beloop',
        issuer: 'auth.beloop',
      });

      if (!decoded?.email) throw new BadRequestException('Token inválido');

      const email = decoded.email.trim().toLowerCase();

      const usuario = await this.prisma.usuario.findUnique({
        where: { email },
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
        where: { email },
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

  // ---------- LOGIN LOCAL ----------
  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const u = await this.prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        nombre: true,
        password: true,
        activo: true,
      },
    });

    // Evitamos filtrar por detalle para no dar pistas
    if (!u || !u.password || u.activo === false) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparación consistente con el seeding: password + pepper
    const ok = await this.comparePassword(dto.password, u.password);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    // almacena login de usuario
    try {
      await this.prisma.usuario.update({
        where: { id: u.id },
        data: { lastLoginAt: new Date() },
      });
    } catch {
      /* noop */
    }

    // firma JWT; puedes incluir aud/iss si quieres alinear con verify
    const payload = { sub: u.id, name: u.nombre };
    const token = await this.jwtService.signAsync(payload, {
      audience: 'beloop',
      issuer: 'auth.beloop',
      expiresIn: '30m',
    });

    return {
      token,
      usuario: {
        id: u.id,
        nombre: u.nombre,
      },
    };
  }

  // ---------- OBTENER USUARIO DE SESIÓN ----------
  async getSessionUser(userId: number, expand: string[] = []) {
    const allow = new Set(['empresas', 'roles']);

    const includeEmpresas = allow.has('empresas') && expand.includes('empresas');
    const includeRoles = allow.has('roles') && expand.includes('roles');

    const include: any = {};
    if (includeEmpresas){
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
        // tipoUsuario: true, // <- eliminado si no existe
        ...(includeEmpresas ? { empresas: true } : {}),
      },
    });

    if (!user) return null;

    if (includeEmpresas && Array.isArray((user as any).empresas)) {
      (user as any).empresas = (user as any).empresas.map((ue: any) => ({
        id: ue.empresa.id,
        nombre: ue.empresa.nombre,
        roles: includeRoles ? ue.roles.map((r: any) => r.rol.nombre) : undefined,
      }));
    }

    return user;
  }
}

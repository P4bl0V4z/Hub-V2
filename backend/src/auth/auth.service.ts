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

    const token = this.jwtService.sign(
      { email: data.email },
      {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: '1d',
      },
    );

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

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      if (typeof decoded !== 'object' || !('email' in decoded)) {
        throw new Error();
      }

      const email = (decoded as any).email as string;

      const usuario = await this.prisma.usuario.findUnique({ where: { email } });

      if (!usuario || usuario.activo) throw new Error();

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

  async login(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: {
        usuarios_empresas: { include: { empresa: true, rol: true } },
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

    const respuesta: any = {
      token,
      nombre: usuario.nombre,
      email: usuario.email,
    };

    if (usuario.usuarios_empresas?.length > 0) {
      const ue = usuario.usuarios_empresas[0];
      respuesta.empresa = {
        id: ue.empresa.id,
        nombre: ue.empresa.nombre,
      };
      respuesta.rol = ue.rol.nombre;
    }

    return respuesta;
  }
}

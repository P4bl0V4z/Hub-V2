import {Body, Controller, Get, Post, Query, Req, Res, UseGuards} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthorizationService } from '../authz/authorization.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly authorizationService: AuthorizationService,
  ) {}
//@Post('login')
  //async login(@Body() dto: LoginDto) {
   // return this.authService.login(dto);
  //}
@Post('login')
async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
  const { token, usuario } = await this.authService.login(dto);

  res.cookie('access_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 30,
  });

  return { ok: true, usuario };
}

@Get('me')
  async me(
    @Req() req: Request,
    @Query('expand') expand?: string,
    @Query('empresaId') empresaIdQ?: string,
    @Query('objects') objectsCsv?: string,
  ) {
    //Obtener token 
    const cookieToken = (req.cookies as any)?.access_token as string | undefined;
    const headerToken = (req.headers.authorization || '').startsWith('Bearer ')
      ? req.headers.authorization!.slice('Bearer '.length)
      : undefined;
    const raw = cookieToken ?? headerToken;
    if (!raw) throw new UnauthorizedException('Missing token');

    //Verificar JWT con issuer/audience si están configurados
    const verifyOpts: Record<string, any> = {
      secret: this.config.get<string>('JWT_SECRET'),
    };
    const iss = this.config.get<string>('JWT_ISSUER');
    const aud = this.config.get<string>('JWT_AUDIENCE');
    if (iss) verifyOpts.issuer = iss;
    if (aud) verifyOpts.audience = aud;

    let payload: any;
    try {
      payload = await this.jwt.verifyAsync(raw, verifyOpts);
    } catch {
      throw new UnauthorizedException('Invalid/expired token');
    }

    const userId: number = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : payload.sub;
    if (!Number.isFinite(userId)) throw new UnauthorizedException('Invalid subject');

    const expandSet = new Set((expand ?? '').split(',').map(s => s.trim()).filter(Boolean));
    const includeEmpresas = expandSet.has('empresas');
    const includeRoles    = expandSet.has('roles');

    //  usuario y  sus empresas/roles
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, nombre: true, tipoUsuario: true,
        ...(includeEmpresas ? {
          empresas: {
            include: {
              empresa: { select: { id: true, nombre: true } },
              ...(includeRoles
                ? { roles: { include: { rol: { select: { id: true, nombre: true } } } } }
                : {}),
            },
          },
        } : {}),
      },
    });
    if (!usuario) throw new UnauthorizedException('User not found');

    //  empresas → [{id, nombre, roles: string[]}]
    let empresas: Array<{ id: number; nombre: string; roles?: string[] }> | undefined;
    if (includeEmpresas) {
      empresas = (usuario.empresas ?? []).map((ue: any) => ({
        id: ue.empresa.id,
        nombre: ue.empresa.nombre,
        ...(includeRoles ? { roles: ue.roles.map((r: any) => r.rol.nombre) } : {}),
      }));
    }

    // permisos para una empresa y lista de objetos
    let permisos: Record<string, 'SIN_ACCESO'|'SIN_DEFINIR'|'VER'|'EDITAR'> | undefined;
    const empresaId = empresaIdQ ? Number(empresaIdQ) : undefined;
    const objectKeys = (objectsCsv ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (empresaId && objectKeys.length > 0) {
      permisos = {};
      // Nota: AuthorizationService espera (userId, empresaId, objectKey)
      await Promise.all(objectKeys.map(async (key) => {
        permisos![key] = await this.authorizationService.getAccessLevel(userId, empresaId, key);
      }));
    }

    // retorno
    return {
      id: usuario.id,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
      nombre: usuario.nombre,
      ...(includeEmpresas ? { empresas } : {}),
      ...(permisos ? { permisos } : {}),
    };
  }

//-------------- me() ------------------
  // ---- LOCAL
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('access_token', { path: '/', domain: '.beloop.io' });
    return res.status(204).send();
  }

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // ===== OAUTH: GOOGLE =====
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleStart() {
    // vacío a propósito
  }

  // Callback de Google
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCb(@Req() req: Request, @Res() res: Response) {
    const { state } = req.query as { state?: string };
    if (!state) return res.status(400).send('Missing state');

    let r = '/';
    try {
      const decoded = this.jwt.verify(state, {
        secret: this.config.get<string>('OAUTH_STATE_SECRET')!,
      }) as { r?: string };
      if (decoded?.r && typeof decoded.r === 'string') r = decoded.r;
    } catch {
      return res.status(400).send('Invalid state');
    }

    const u = (req as any).user;
    const accessTtl = Number(this.config.get('JWT_ACCESS_TTL') || 3600);
    const signOpts: Record<string, any> = { expiresIn: accessTtl };
    const iss = this.config.get<string>('JWT_ISSUER');
    const aud = this.config.get<string>('JWT_AUDIENCE');
    if (typeof iss === 'string' && iss.length) signOpts.issuer = iss;
    if (typeof aud === 'string' && aud.length) signOpts.audience = aud;

    const token = await this.jwt.signAsync({ sub: u.id }, signOpts);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: accessTtl * 1000,
    });

    const frontend = this.config.get<string>('FRONTEND_URL')!;
    return res.redirect(303, `${frontend}${r || '/'}`);
  }
}

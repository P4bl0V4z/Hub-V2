import {Body, Controller, Get, Post, Query, Req, Res, UseGuards} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { UnauthorizedException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  @Get('me')
  async me(@Req() req: Request) {
    const raw = req.cookies?.access_token;
    if (!raw) throw new UnauthorizedException();
    const verifyOpts: Record<string, any> = {
      secret: this.config.get<string>('JWT_SECRET'),
    };
    const iss = this.config.get<string>('JWT_ISSUER');
    const aud = this.config.get<string>('JWT_AUDIENCE');
    if (typeof iss === 'string' && iss.length) verifyOpts.issuer = iss;
    if (typeof aud === 'string' && aud.length) verifyOpts.audience = aud;

    const payload = await this.jwt.verifyAsync(raw, verifyOpts);

    const userId: number = typeof (payload as any).sub === 'string'
        ? parseInt((payload as any).sub, 10)
        : (payload as any).sub;

    if (!Number.isFinite(userId)) throw new UnauthorizedException();

    const usuario = await this.authService.getSessionUser(userId);
    if (!usuario) throw new UnauthorizedException();

    return {
      id: usuario.id,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
      nombre: usuario.nombre,
    };
  }
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

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { usuario } = await this.authService.login(dto.email, dto.password);
    const accessTtl = Number(this.config.get('JWT_ACCESS_TTL') || 3600);
    const signOpts: Record<string, any> = { expiresIn: accessTtl };
    const iss = this.config.get<string>('JWT_ISSUER');
    const aud = this.config.get<string>('JWT_AUDIENCE');
    if (typeof iss === 'string' && iss.length) signOpts.issuer = iss;
    if (typeof aud === 'string' && aud.length) signOpts.audience = aud;

    const token = await this.jwt.signAsync({ sub: usuario.id }, signOpts);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: accessTtl * 1000,
    });

    return res.status(200).json({ ok: true, nombre: usuario.nombre, rol: usuario.tipoUsuario });
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

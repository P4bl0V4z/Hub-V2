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

    try {
      // Verifica el token JWT
      const payload = await this.jwt.verifyAsync(raw, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      return { id: payload.sub, email: payload.email, tipoUsuario: payload.tipoUsuario };
    } catch {
      throw new UnauthorizedException();
    }
  }

  // ---- LOCAL
  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  // ===== OAUTH: GOOGLE =====
  // Inicio: el GoogleAuthGuard genera "state" firmado y redirige a Google
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleStart() {
    // vacío a propósito
  }
  // Callback de Google
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleCb(@Req() req: Request, @Res() res: Response) {
    const { state } = req.query as { state?: string };
    if (!state) return res.status(400).send('Missing state');
    // Verifica el "state" firmado
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
    const token = this.jwt.sign(
      { sub: u.id, email: u.email, tipoUsuario: u.tipoUsuario },
      { expiresIn: accessTtl }
    );

    console.log('[googleCb] host=', req.headers.host, 'r=', r, 'token?', !!token);

    // cookie para todos los subdominios de beloop.io
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: accessTtl * 1000,
      //domain: '.beloop.io',
      path: '/',
    });

    const frontend = this.config.get<string>('FRONTEND_URL')!;
    return res.redirect(303, `${frontend}${r || '/'}`);
  }
}

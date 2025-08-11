import {Body, Controller, Get, Post, Query, Req, Res, UseGuards} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

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
    // Verificación (anti-CSRF)
    const { state } = req.query as { state?: string };
    if (!state) return res.status(400).send('Missing state');

    try {
      this.jwt.verify(state, {
        secret: this.config.get<string>('OAUTH_STATE_SECRET')!,
      });
    } catch {
      return res.status(400).send('Invalid state');
    }

    // Usuario autenticado por GoogleStrategy.validate(...)
    const u = (req as any).user;

    const accessTtl = Number(this.config.get('JWT_ACCESS_TTL') || 3600); // segundos
    const token = this.jwt.sign(
      { sub: u.id, email: u.email, tipoUsuario: u.tipoUsuario },
      { expiresIn: accessTtl } // evita tokens sin expiración
    );

    // Cookie de sesión (ajusta SameSite según dominios)
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax', // 🔁 Si API y Frontend están en dominios distintos, usa 'none'
      maxAge: accessTtl * 1000,
      domain: 'plataforma.beloop.io', // asegúrate que cubra tus subdominios reales
      path: '/',
    });

    const frontend = this.config.get('FRONTEND_URL');
    return res.redirect(303, `${frontend}/oauth-callback`);
  }
}

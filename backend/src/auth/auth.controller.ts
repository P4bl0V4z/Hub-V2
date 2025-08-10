import {
  Body, Controller, Get, Post, Query, Req, Res, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { randomBytes } from 'crypto';

import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import * as passport from 'passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ---- LOCAL 
  @Post('register') register(@Body() data: RegisterDto) {return this.authService.register(data); }
  @Get('verify-email') verifyEmail(@Query('token') token: string) {return this.authService.verifyEmail(token); }
  @Post('login') login(@Body() dto: LoginDto) {return this.authService.login(dto.email, dto.password); }

  // ===== OAUTH SEGURO =====

  @Get('google')
  googleStart(@Req() req: Request, @Res() res: Response) {
    const state = this.jwt.sign(
      { n: randomBytes(16).toString('hex') },
      { secret: this.config.get<string>('OAUTH_STATE_SECRET')!, expiresIn: '10m' },
    );
    return passport.authenticate('google', {
      scope: ['openid', 'email', 'profile'],
      state,
    })(req, res);
  }
  // Google callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCb(@Req() req: Request, @Res() res: Response) {
    const { state } = req.query as { state?: string };
    if (!state) return res.status(400).send('Missing state');
    try {
      this.jwt.verify(state, { secret: this.config.get<string>('OAUTH_STATE_SECRET')! });
    } catch {
      return res.status(400).send('Invalid state');
    }

    const u = (req as any).user;
    const accessTtl = Number(this.config.get('JWT_ACCESS_TTL') || 3600); // sec
    const token = this.jwt.sign({ sub: u.id, email: u.email, tipoUsuario: u.tipoUsuario });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: accessTtl * 1000,
      domain: 'plataforma.beloop.io',
      path: '/',
    });
    return res.redirect(303, `${this.config.get('FRONTEND_URL')}/oauth-callback`);
  }

  // Microsoft
  @Get('microsoft')
  msStart(@Req() req: Request, @Res() res: Response) {
    const state = this.jwt.sign(
      { n: randomBytes(16).toString('hex') },
      { secret: this.config.get<string>('OAUTH_STATE_SECRET')!, expiresIn: '10m' },
    );
    return passport.authenticate('microsoft', {
      scope: ['openid', 'email', 'profile'],
      state,
    })(req, res);
  }

  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  msCb(@Req() req: Request, @Res() res: Response) {
    const { state } = req.query as { state?: string };
    if (!state) return res.status(400).send('Missing state');
    try {
      this.jwt.verify(state, { secret: this.config.get<string>('OAUTH_STATE_SECRET')! });
    } catch {
      return res.status(400).send('Invalid state');
    }

    const u = (req as any).user;
    const accessTtl = Number(this.config.get('JWT_ACCESS_TTL') || 3600);
    const token = this.jwt.sign({ sub: u.id, email: u.email, tipoUsuario: u.tipoUsuario });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: accessTtl * 1000,
      domain: 'plataforma.beloop.io',
      path: '/',
    });
    return res.redirect(303, `${this.config.get('FRONTEND_URL')}/oauth-callback`);
  }
}

import { Injectable } from '@nestjs/common';
import { JwtCookieAuthGuard } from './jwt-cookie.guard';

@Injectable()
export class JwtGuard extends JwtCookieAuthGuard {}

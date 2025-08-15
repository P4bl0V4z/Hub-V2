import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user; // ← asumimos que un JwtAuthGuard ya setea req.user desde la cookie
    if (user?.tipoUsuario === 'admin') return true;
    throw new ForbiddenException('Solo administradores');
  }
}

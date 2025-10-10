import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationService } from './authorization.service';
import { AUTHZ_MIN, AUTHZ_OBJECT } from './authz.decorator';

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(private reflector: Reflector, private authz: AuthorizationService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const objectKey = this.reflector.get<string>(AUTHZ_OBJECT, ctx.getHandler());
    if (!objectKey) return true;
    const min = this.reflector.get<'VER' | 'EDITAR'>(AUTHZ_MIN, ctx.getHandler()) ?? 'VER';

    const req = ctx.switchToHttp().getRequest();
    const userId = req.user?.id as number | undefined;
    let empresaId = req.empresaId as number | undefined;

    if (!userId) throw new ForbiddenException('Contexto incompleto');

    if (!empresaId) {
      empresaId = await this.authz.resolveEmpresaIdFor(userId);
      if (empresaId) req.empresaId = empresaId;
    }

    if (!empresaId) throw new ForbiddenException('Contexto incompleto');

    const ok = await this.authz.isAuthorized(userId, empresaId, objectKey, min);
    if (!ok) throw new ForbiddenException(`Acceso insuficiente a ${objectKey}`);
    return true;
  }
}

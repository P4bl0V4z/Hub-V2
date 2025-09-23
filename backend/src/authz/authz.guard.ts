import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Reflector } from '@nestjs/common';
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
    const empresaId = req.empresaId as number | undefined; // asegúrate de setearla con tu middleware

    if (!userId || !empresaId) throw new ForbiddenException('Contexto incompleto');

    const ok = await this.authz.isAuthorized(userId, empresaId, objectKey, min);
    if (!ok) throw new ForbiddenException(`Acceso insuficiente a ${objectKey}`);
    return true;
  }
}

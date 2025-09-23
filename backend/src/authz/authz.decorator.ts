import { SetMetadata } from '@nestjs/common';
export const AUTHZ_OBJECT = 'authz:object';
export const AUTHZ_MIN = 'authz:min';

export function RequireAccess(objectKey: string, min: 'VER' | 'EDITAR' = 'VER') {
  return (target: any, key?: any, desc?: any) => {
    SetMetadata(AUTHZ_OBJECT, objectKey)(target, key, desc);
    SetMetadata(AUTHZ_MIN, min)(target, key, desc);
  };
}

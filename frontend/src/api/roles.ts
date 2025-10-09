/*import { api } from './_base';

export type Role = { id:number; nombre:string; descripcion?:string|null; soloEmpresaMaestra:boolean };
export type Permission = { id:number; key:string; nombre:string; categoria:string };
export type BasicUser = { id:number; nombre:string; email:string };

export const RolesAPI = {
  list: () => api.get<Role[]>('/roles'),
  create: (payload: { nombre:string; descripcion?:string; soloEmpresaMaestra:boolean }) => api.post<Role>('/roles', payload),
  detail: (id:number) => api.get<{ role:Role; permissions:Permission[]; users:BasicUser[] }>(`/roles/${id}`),
  update: (id:number, payload: Partial<{ nombre:string; descripcion?:string; soloEmpresaMaestra:boolean }>) => api.patch(`/roles/${id}`, payload),
  remove: (id:number) => api.delete(`/roles/${id}`),
  setPermissions: (id:number, permissionKeys:string[]) => api.put(`/roles/${id}/permissions`, { permissionKeys }),
  setUsers: (id:number, userIds:number[]) => api.put(`/roles/${id}/users`, { userIds }),
};

export const PermissionsAPI = {
  list: () => api.get<Permission[]>('/permissions'),
};
*/
import { api } from './_base';

export type Role = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  soloEmpresaMaestra: boolean;
};

export type BasicUser = {
  id: number;
  nombre: string;
  email: string;
  empresaId?: number;
};

export type SystemObject = {
  id: number;
  key: string;
  nombre: string;
  descripcion?: string | null;
};

export type NivelAcceso = 'SIN_DEFINIR' | 'SIN_ACCESO' | 'VER' | 'EDITAR';

export const RolesAPI = {
  list: () => api.get<Role[]>('/roles'),

  create: (payload: { nombre: string; descripcion?: string; soloEmpresaMaestra: boolean }) =>
    api.post<Role>('/roles', payload),

  detail: (id: number) =>
    api.get<{
      role: Role;
      access: { objectKey: string; nivel: NivelAcceso }[];
      users: BasicUser[];
    }>(`/roles/${id}`),

  update: (id: number, payload: Partial<{ nombre: string; descripcion?: string; soloEmpresaMaestra: boolean }>) =>
    api.patch(`/roles/${id}`, payload),

  remove: (id: number) => api.delete(`/roles/${id}`),

  setAccess: (id: number, entries: { objectKey: string; nivel: NivelAcceso }[]) =>
    api.put(`/roles/${id}/access`, { entries }),

  setUsers: (id: number, userIds: number[]) => api.put(`/roles/${id}/users`, { userIds }),
};

export const SystemObjectsAPI = {
  list: () => api.get<SystemObject[]>('/permissions'),
};

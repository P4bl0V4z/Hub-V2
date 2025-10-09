import { api } from './_base';

export type SystemObject = {
  id: number;
  key: string;
  nombre: string;
  descripcion?: string | null;
};

export const PermissionsAPI = {
  list: () => api.get<SystemObject[]>('/permissions'),
  create: (data: { key: string; nombre: string; descripcion?: string }) =>
    api.post<SystemObject>('/permissions', data),
  update: (id: number, data: Partial<{ key: string; nombre: string; descripcion?: string }>) =>
    api.put<SystemObject>(`/permissions/${id}`, data),
  remove: (id: number) => api.delete(`/permissions/${id}`),
};

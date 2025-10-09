// Módulo: frontend
// Archivo: src/hooks/useAccess.ts

import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/_base';

export type NivelAcceso = 'SIN_DEFINIR' | 'SIN_ACCESO' | 'VER' | 'EDITAR';
type AccessResponse = { isSuperAdmin: boolean; access: Record<string, NivelAcceso> };

const ORDER: Record<NivelAcceso, number> = {
  SIN_DEFINIR: 0,
  SIN_ACCESO: 1,
  VER: 2,
  EDITAR: 3,
};

type UseAccessOpts = { enabled?: boolean };

export function useAccess(opts: UseAccessOpts = {}) {
  const { enabled = true } = opts;

  const { data, isLoading, error } = useQuery({
    queryKey: ['me-access'],
    queryFn: async () => (await api.get<AccessResponse>('/users/me/access')).data,
    enabled,            // ← no consulta si no estás autenticado
    retry: false,       // evita reintentos ruidosos (401/403)
    staleTime: 30_000,  // cache cortita
  });

  const isSuperAdmin = Boolean(data?.isSuperAdmin);
  const access = data?.access ?? {};

  function can(objectKey: string, min: NivelAcceso = 'VER') {
    if (isSuperAdmin) return true;
    const cur = access[objectKey] ?? 'SIN_DEFINIR';
    return ORDER[cur] >= ORDER[min];
  }

  return { isLoading, error, isSuperAdmin, access, can };
}

export type NivelAcceso = 'SIN_ACCESO' | 'SIN_DEFINIR' | 'VER' | 'EDITAR';

export async function fetchAccess(objectKey: string): Promise<NivelAcceso> {
  const res = await fetch(`/api/authz/access?objectKey=${encodeURIComponent(objectKey)}`, { credentials: 'include' });
  if (!res.ok) return 'SIN_DEFINIR';
  const data = await res.json();
  return data.level as NivelAcceso;
}

export function can(level: NivelAcceso, min: NivelAcceso): boolean {
  const order: Record<NivelAcceso, number> = {
    SIN_ACCESO: 0, SIN_DEFINIR: 1, VER: 2, EDITAR: 3,
  };
  return order[level] >= order[min];
}

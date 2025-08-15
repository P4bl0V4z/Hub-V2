import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const API_URL = (import.meta.env.VITE_API_URL as string)?.replace(/\/+$/, '');

async function fetchUsers({ search, page, pageSize }: {search: string; page: number; pageSize: number}) {
  const qs = new URLSearchParams({ search, page: String(page), pageSize: String(pageSize) });
  const res = await fetch(`${API_URL}/admin/usuarios?${qs}`, { credentials: 'include' });
  if (!res.ok) throw new Error('No se pudo cargar usuarios');
  return res.json() as Promise<{ total: number; page: number; pageSize: number; items: any[] }>;
}

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-users', search, page],
    queryFn: () => fetchUsers({ search, page, pageSize }),
    keepPreviousData: true,
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Buscar por nombre o email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => { setPage(1); refetch(); }}>Buscar</Button>
        <div className="ml-auto text-sm text-muted-foreground">
          {isLoading ? 'Cargando…' : `${data?.total ?? 0} usuarios`}
        </div>
      </div>

      <div className="overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Activo</th>
              <th className="text-left p-3">Verificado</th>
              <th className="text-left p-3">Rol</th>
              <th className="text-left p-3">Empresas</th>
              <th className="text-right p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.nombre}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.activo ? 'Sí' : 'No'}</td>
                <td className="p-3">{u.verificadoEn ? 'Sí' : 'No'}</td>
                <td className="p-3">{u.tipoUsuario ?? '-'}</td>
                <td className="p-3">{u._count?.empresas ?? 0}</td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="outline" onClick={() => window.location.href = `/admin/users/${u.id}`}>Ver</Button>
                </td>
              </tr>
            ))}
            {!isLoading && data?.items?.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación simple */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" disabled={page<=1} onClick={() => setPage(p => p-1)}>Atrás</Button>
        <span className="text-sm">Página {page}</span>
        <Button variant="outline" disabled={!!data && (page*pageSize >= (data.total || 0))} onClick={() => setPage(p => p+1)}>Siguiente</Button>
      </div>
    </div>
  );
}

import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

const API_URL = (import.meta.env.VITE_API_URL as string)?.replace(/\/+$/, '');

async function fetchUser(id: number) {
  const res = await fetch(`${API_URL}/admin/usuarios/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('No se pudo cargar el usuario');
  return res.json();
}

export default function AdminUserDetail() {
  const { id } = useParams();
  const userId = Number(id);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-user', userId],
    queryFn: () => fetchUser(userId),
    enabled: Number.isFinite(userId),
  });

  if (!Number.isFinite(userId)) return <div className="p-6">ID inválido</div>;
  if (isLoading) return <div className="p-6">Cargando…</div>;
  if (isError) return <div className="p-6">Error al cargar</div>;

  const u = data;
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Usuario #{u.id}</h2>
        <div className="flex gap-2">
          <Button variant="outline">Activar/Desactivar</Button>
          <Button variant="outline">Cambiar rol</Button>
          <Button variant="outline">Reset contraseña</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4">
        <div><span className="text-muted-foreground">Nombre: </span>{u.nombre}</div>
        <div><span className="text-muted-foreground">Email: </span>{u.email}</div>
        <div><span className="text-muted-foreground">Rol: </span>{u.tipoUsuario ?? '-'}</div>
        <div><span className="text-muted-foreground">Activo: </span>{u.activo ? 'Sí' : 'No'}</div>
        <div><span className="text-muted-foreground">Verificado: </span>{u.verificadoEn ? 'Sí' : 'No'}</div>
        <div><span className="text-muted-foreground">Último login: </span>{u.lastLoginAt ?? '-'}</div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Empresas y roles</h3>
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">Empresa</th>
                <th className="text-left p-3">Roles</th>
              </tr>
            </thead>
            <tbody>
              {u.empresas?.map((e: any) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.nombre}</td>
                  <td className="p-3">{e.roles?.map((r: any) => r.nombre).join(', ') || '-'}</td>
                </tr>
              ))}
              {(!u.empresas || u.empresas.length === 0) && (
                <tr><td colSpan={2} className="p-4 text-center text-muted-foreground">Sin asignaciones</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

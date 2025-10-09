import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RolesAPI, type Role, type NivelAcceso, SystemObjectsAPI, type SystemObject } from '@/api/roles';
import { UsersAPI } from '@/api/users';

function Button(props: any) { return <button {...props} className={'px-3 py-2 border rounded-md ' + (props.className ?? '')} /> }
function Input(props: any) { return <input {...props} className={'px-3 py-2 border rounded-md w-full ' + (props.className ?? '')} /> }
function Select({ value, onChange, children }: any) {
  return (
    <select className="px-2 py-1 border rounded-md" value={value} onChange={(e)=>onChange(e.target.value)}>
      {children}
    </select>
  );
}

const LEVELS: NivelAcceso[] = ['SIN_DEFINIR','SIN_ACCESO','VER','EDITAR'];

export default function RoleDetailPage() {
  const { id } = useParams();
  const roleId = Number(id);
  const qc = useQueryClient();

  const { data: detail } = useQuery({
    queryKey: ['role', roleId],
    queryFn: () => RolesAPI.detail(roleId).then(r => r.data),
  });
  const { data: objects } = useQuery({
    queryKey: ['system-objects'],
    queryFn: () => SystemObjectsAPI.list().then(r => r.data),
  });

  const [meta, setMeta] = useState<Partial<Role>>({});
  // accessMap: objectKey -> nivel
  const [accessMap, setAccessMap] = useState<Record<string, NivelAcceso>>({});
  const [search, setSearch] = useState('');
  const { data: usersFound } = useQuery({
    queryKey: ['users-basic', search],
    queryFn: () => UsersAPI.listBasic(search).then(r => r.data),
  });
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (detail?.role) {
      setMeta(detail.role);
      setAccessMap(
        Object.fromEntries((detail.access ?? []).map(a => [a.objectKey, a.nivel]))
      );
      setSelectedUsers(new Set((detail.users ?? []).map(u => u.id)));
    }
  }, [detail]);

  const saveMeta = useMutation({
    mutationFn: () => RolesAPI.update(roleId, {
      nombre: meta.nombre,
      descripcion: meta.descripcion,
      soloEmpresaMaestra: meta.soloEmpresaMaestra,
    }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['role', roleId] }),
  });

  const saveAccess = useMutation({
    mutationFn: () => {
      const entries = Object.entries(accessMap).map(([objectKey, nivel]) => ({ objectKey, nivel }));
      return RolesAPI.setAccess(roleId, entries);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['role', roleId] }),
  });

  const saveUsers = useMutation({
    mutationFn: () => RolesAPI.setUsers(roleId, Array.from(selectedUsers)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['role', roleId] }),
  });

  const toggleUser = (uid: number) => {
    const next = new Set(selectedUsers);
    next.has(uid) ? next.delete(uid) : next.add(uid);
    setSelectedUsers(next);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-3 max-w-xl">
        <h1 className="text-2xl font-semibold">Rol #{roleId}</h1>
        <Input value={meta.nombre ?? ''} onChange={e => setMeta(s => ({ ...s, nombre: e.target.value }))} placeholder="Nombre" />
        <Input value={meta.descripcion ?? ''} onChange={e => setMeta(s => ({ ...s, descripcion: e.target.value }))} placeholder="Descripción" />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(meta.soloEmpresaMaestra)}
            onChange={(e)=> setMeta(s => ({ ...s, soloEmpresaMaestra: e.target.checked }))}
          />
          <span>Solo empresa maestra</span>
        </label>
        <Button onClick={()=>saveMeta.mutate()}>Guardar cambios</Button>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-medium">Accesos (nivel por objeto)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {(objects ?? []).map((obj: SystemObject) => {
            const current = accessMap[obj.key] ?? 'SIN_DEFINIR';
            return (
              <div key={obj.key} className="border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{obj.nombre} <span className="opacity-60 text-xs">({obj.key})</span></div>
                  {obj.descripcion && <div className="text-xs opacity-70">{obj.descripcion}</div>}
                </div>
                <Select
                  value={current}
                  onChange={(val: NivelAcceso) => setAccessMap(m => ({ ...m, [obj.key]: val }))}
                >
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </Select>
              </div>
            );
          })}
        </div>
        <Button onClick={()=>saveAccess.mutate()}>Guardar accesos</Button>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-medium">Usuarios del rol</h2>
        <Input placeholder="Buscar usuarios por nombre o email" value={search} onChange={e=>setSearch(e.target.value)} />
        <div className="max-h-64 overflow-auto border rounded-md">
          {(usersFound ?? []).map(u => (
            <label key={u.id} className="flex items-center gap-2 p-2 border-b">
              <input type="checkbox" checked={selectedUsers.has(u.id)} onChange={()=>toggleUser(u.id)} />
              <span className="text-sm">{u.nombre} <span className="opacity-60">&lt;{u.email}&gt;</span></span>
            </label>
          ))}
        </div>
        <Button onClick={()=>saveUsers.mutate()}>Guardar usuarios</Button>
      </div>
    </div>
  );
}

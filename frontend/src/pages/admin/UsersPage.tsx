import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UsersAPI } from '@/api/users';
import { RolesAPI, type Role } from '@/api/roles';

function Button(props: any) { return <button {...props} className={'px-3 py-2 border rounded-md ' + (props.className ?? '')} /> }
function Input(props: any) { return <input {...props} className={'px-3 py-2 border rounded-md w-full ' + (props.className ?? '')} /> }
function Dialog({ open, onClose, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-4 rounded-xl min-w-[420px]" onClick={(e)=>e.stopPropagation()}>{children}</div>
    </div>
  );
}

export default function UsersPage() {
  const [q, setQ] = useState('');
  const { data: users } = useQuery({ queryKey: ['users', q], queryFn: () => UsersAPI.listBasic(q).then(r => r.data) });

  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const { data: roles } = useQuery({ queryKey: ['roles-for-assign'], queryFn: () => RolesAPI.list().then(r => r.data) });
  const [selectedRoles, setSelectedRoles] = useState<Set<number>>(new Set());

  const qc = useQueryClient();
  const openAssign = (id: number) => { setUserId(id); setOpen(true); setSelectedRoles(new Set()); };

  const save = useMutation({
    mutationFn: async () => {
      const uid = userId!;
      const ops = Array.from(selectedRoles).map(async (rid) => {
        const cur = await RolesAPI.detail(rid).then(r => r.data.users.map(u => u.id));
        const next = Array.from(new Set([...cur, uid]));
        return RolesAPI.setUsers(rid, next);
      });
      await Promise.all(ops);
    },
    onSuccess: () => {
      setOpen(false);
      qc.invalidateQueries({ queryKey: ['roles-for-assign'] });
    },
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Usuarios</h1>

      <div className="max-w-xl">
        <Input placeholder="Buscar por nombre o email" value={q} onChange={e=>setQ(e.target.value)} />
      </div>

      <div className="grid gap-2">
        {(users ?? []).map(u => (
          <div key={u.id} className="flex items-center justify-between border rounded-xl p-3">
            <div>
              <div className="font-medium">{u.nombre}</div>
              <div className="text-sm opacity-70">{u.email}</div>
            </div>
            <Button onClick={()=>openAssign(u.id)}>Asignar roles</Button>
          </div>
        ))}
      </div>

      <Dialog open={open} onClose={()=>setOpen(false)}>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Asignar roles al usuario</h2>
          <div className="max-h-64 overflow-auto border rounded-md">
            {(roles ?? []).map((r: Role) => (
              <label key={r.id} className="flex items-center gap-2 p-2 border-b">
                <input
                  type="checkbox"
                  checked={selectedRoles.has(r.id)}
                  onChange={() => {
                    const next = new Set(selectedRoles);
                    next.has(r.id) ? next.delete(r.id) : next.add(r.id);
                    setSelectedRoles(next);
                  }}
                />
                <span className="text-sm">{r.nombre} {r.soloEmpresaMaestra && <span className="opacity-60">(solo empresa maestra)</span>}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <Button onClick={()=>setOpen(false)}>Cancelar</Button>
            <Button onClick={()=>save.mutate()} disabled={!selectedRoles.size}>Guardar</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

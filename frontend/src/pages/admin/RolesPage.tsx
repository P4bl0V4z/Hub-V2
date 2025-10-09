import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RolesAPI, type Role } from '@/api/roles';

function Button(props: any) { return <button {...props} className={'px-3 py-2 border rounded-md ' + (props.className ?? '')} /> }
function Input(props: any) { return <input {...props} className={'px-3 py-2 border rounded-md w-full ' + (props.className ?? '')} /> }
function Dialog({ open, onClose, children }: any) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-4 rounded-xl min-w-[380px]" onClick={(e)=>e.stopPropagation()}>{children}</div>
    </div>
  );
}

export default function RolesPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RolesAPI.list().then(r => r.data),
  });

  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [soloEmpresaMaestra, setSoloEmpresaMaestra] = useState(false);

  const createMut = useMutation({
    mutationFn: () => RolesAPI.create({ nombre, descripcion, soloEmpresaMaestra }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roles'] });
      setOpen(false); setNombre(''); setDescripcion(''); setSoloEmpresaMaestra(false);
    },
  });

  const removeMut = useMutation({
    mutationFn: (id: number) => RolesAPI.remove(id).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roles'] }),
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Roles</h1>
        <Button onClick={() => setOpen(true)}>Nuevo rol</Button>
      </div>

      <div className="grid gap-2">
        {data?.map((r: Role) => (
          <div key={r.id} className="flex items-center justify-between border rounded-xl p-3">
            <div>
              <div className="font-medium">
                {r.nombre}
                {r.soloEmpresaMaestra && <span className="text-xs ml-2 px-2 py-0.5 border rounded-full">Solo empresa maestra</span>}
              </div>
              <div className="text-sm opacity-70">{r.descripcion}</div>
            </div>
            <div className="flex gap-2">
              <Link className="underline text-sm" to={`/admin/roles/${r.id}`}>Detalle</Link>
              <Button onClick={() => removeMut.mutate(r.id)} className="text-red-600">Eliminar</Button>
            </div>
          </div>
        ))}
        {!data?.length && <div className="opacity-70">No hay roles todavía.</div>}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Crear rol</h2>
          <Input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
          <Input placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={soloEmpresaMaestra} onChange={(e)=>setSoloEmpresaMaestra(e.target.checked)} />
            <span>Solo empresa maestra</span>
          </label>
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => createMut.mutate()} disabled={!nombre.trim()}>Crear</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

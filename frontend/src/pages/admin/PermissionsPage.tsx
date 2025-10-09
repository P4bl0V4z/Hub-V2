import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { PermissionsAPI, type SystemObject } from '@/api/permissions';

export default function PermissionsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => PermissionsAPI.list().then(r => r.data),
  });

  const [form, setForm] = useState<Partial<SystemObject>>({ key: '', nombre: '', descripcion: '' });
  const [editing, setEditing] = useState<SystemObject | null>(null);

  const create = useMutation({
    mutationFn: () => PermissionsAPI.create({ key: form.key!, nombre: form.nombre!, descripcion: form.descripcion ?? '' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['permissions'] }); setForm({ key:'', nombre:'', descripcion:'' }); },
  });

  const update = useMutation({
    mutationFn: () => PermissionsAPI.update(editing!.id, { key: form.key, nombre: form.nombre, descripcion: form.descripcion }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['permissions'] }); setEditing(null); setForm({ key:'', nombre:'', descripcion:'' }); },
  });

  const remove = useMutation({
    mutationFn: (id: number) => PermissionsAPI.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['permissions'] }),
  });

  const startEdit = (obj: SystemObject) => {
    setEditing(obj);
    setForm({ key: obj.key, nombre: obj.nombre, descripcion: obj.descripcion ?? '' });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Objetos del sistema</h1>

      <div className="border rounded-md p-4 max-w-2xl space-y-2">
        <h2 className="font-medium">{editing ? `Editar objeto #${editing.id}` : 'Nuevo objeto'}</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <input className="border rounded-md px-3 py-2" placeholder="key (ej: roles, users, reports)"
            value={form.key ?? ''} onChange={(e)=>setForm(s=>({ ...s, key: e.target.value }))} />
          <input className="border rounded-md px-3 py-2" placeholder="Nombre visible"
            value={form.nombre ?? ''} onChange={(e)=>setForm(s=>({ ...s, nombre: e.target.value }))} />
        </div>
        <textarea className="border rounded-md px-3 py-2 w-full" rows={3}
          placeholder="Descripción"
          value={form.descripcion ?? ''} onChange={(e)=>setForm(s=>({ ...s, descripcion: e.target.value }))} />
        <div className="flex gap-2">
          {!editing ? (
            <button className="px-3 py-2 border rounded-md" onClick={()=>create.mutate()} disabled={!form.key || !form.nombre}>Crear</button>
          ) : (
            <>
              <button className="px-3 py-2 border rounded-md" onClick={()=>update.mutate()} disabled={!form.key || !form.nombre}>Guardar</button>
              <button className="px-3 py-2 border rounded-md" onClick={()=>{ setEditing(null); setForm({ key:'', nombre:'', descripcion:'' }); }}>Cancelar</button>
            </>
          )}
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Key</th>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Descripción</th>
              <th className="text-left p-2 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map(o => (
              <tr key={o.id} className="border-t">
                <td className="p-2">{o.id}</td>
                <td className="p-2">{o.key}</td>
                <td className="p-2">{o.nombre}</td>
                <td className="p-2">{o.descripcion}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button className="px-2 py-1 border rounded-md" onClick={()=>startEdit(o)}>Editar</button>
                    <button className="px-2 py-1 border rounded-md text-red-600" onClick={()=>remove.mutate(o.id)}>Borrar</button>
                  </div>
                </td>
              </tr>
            ))}
            {(!data || data.length===0) && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No hay objetos definidos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

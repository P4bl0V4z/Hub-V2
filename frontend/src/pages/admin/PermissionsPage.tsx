// Módulo: frontend
// Archivo: src/pages/admin/PermissionsPage.tsx

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { PermissionsAPI, type SystemObject } from '@/api/permissions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function PermissionsPage() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data, isFetching } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => (await PermissionsAPI.list()).data,
    retry: false,
    staleTime: 15_000,
  });

  const [form, setForm] = useState<Partial<SystemObject>>({
    key: '',
    nombre: '',
    descripcion: '',
  });
  const [editing, setEditing] = useState<SystemObject | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const isValid = useMemo(() => {
    return Boolean((form.key ?? '').trim()) && Boolean((form.nombre ?? '').trim());
  }, [form.key, form.nombre]);

  const resetForm = () => setForm({ key: '', nombre: '', descripcion: '' });

  const create = useMutation({
    mutationFn: async () =>
      PermissionsAPI.create({
        key: form.key!.trim(),
        nombre: form.nombre!.trim(),
        descripcion: (form.descripcion ?? '').trim(),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['permissions'] });
      resetForm();
      toast({ title: 'Objeto creado', description: 'Se creó correctamente.' });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'No se pudo crear el objeto.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });

  const update = useMutation({
    mutationFn: async () =>
      PermissionsAPI.update(editing!.id, {
        key: form.key?.trim(),
        nombre: form.nombre?.trim(),
        descripcion: form.descripcion?.toString().trim(),
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['permissions'] });
      setEditing(null);
      resetForm();
      toast({ title: 'Cambios guardados', description: 'El objeto se actualizó.' });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'No se pudo actualizar el objeto.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: number) => PermissionsAPI.remove(id),
    onMutate: (id) => setRemovingId(id),
    onSettled: () => setRemovingId(null),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['permissions'] });
      toast({ title: 'Objeto eliminado', description: 'Se borró correctamente.' });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'No se pudo borrar el objeto.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });

  const startEdit = (obj: SystemObject) => {
    setEditing(obj);
    setForm({
      key: obj.key,
      nombre: obj.nombre,
      descripcion: obj.descripcion ?? '',
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    resetForm();
  };

  const onDelete = (id: number) => {
    if (removingId) return;
    const ok = window.confirm('¿Seguro que deseas borrar este objeto del sistema?');
    if (ok) remove.mutate(id);
  };

  const submitting = create.isPending || update.isPending;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Objetos del sistema</h1>
        {isFetching && (
          <span className="text-xs text-muted-foreground">Actualizando…</span>
        )}
      </div>

      {/* Formulario */}
      <div className="border rounded-md p-4 max-w-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">
            {editing ? `Editar objeto #${editing.id}` : 'Nuevo objeto'}
          </h2>
          {editing && (
            <Button variant="ghost" size="sm" onClick={cancelEdit}>
              Cancelar
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="border rounded-md px-3 py-2"
            placeholder="key (ej: roles, usuarios, objetos)"
            value={form.key ?? ''}
            onChange={(e) => setForm((s) => ({ ...s, key: e.target.value }))}
            disabled={submitting}
          />
          <input
            className="border rounded-md px-3 py-2"
            placeholder="Nombre visible"
            value={form.nombre ?? ''}
            onChange={(e) => setForm((s) => ({ ...s, nombre: e.target.value }))}
            disabled={submitting}
          />
        </div>

        <textarea
          className="border rounded-md px-3 py-2 w-full"
          rows={3}
          placeholder="Descripción"
          value={form.descripcion ?? ''}
          onChange={(e) => setForm((s) => ({ ...s, descripcion: e.target.value }))}
          disabled={submitting}
        />

        <div className="flex gap-2">
          {!editing ? (
            <Button
              onClick={() => create.mutate()}
              disabled={!isValid || create.isPending}
            >
              {create.isPending ? 'Creando…' : 'Crear'}
            </Button>
          ) : (
            <>
              <Button
                onClick={() => update.mutate()}
                disabled={!isValid || update.isPending}
              >
                {update.isPending ? 'Guardando…' : 'Guardar'}
              </Button>
              <Button
                variant="outline"
                onClick={cancelEdit}
                disabled={update.isPending}
              >
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Key</th>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Descripción</th>
              <th className="text-left p-2 w-40"></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((o) => {
              const rowBusy = removingId === o.id || submitting;
              return (
                <tr key={o.id} className="border-t">
                  <td className="p-2">{o.id}</td>
                  <td className="p-2">{o.key}</td>
                  <td className="p-2">{o.nombre}</td>
                  <td className="p-2">{o.descripcion}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(o)}
                        disabled={rowBusy}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(o.id)}
                        disabled={rowBusy}
                      >
                        {removingId === o.id ? 'Borrando…' : 'Borrar'}
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {(!data || data.length === 0) && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No hay objetos definidos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

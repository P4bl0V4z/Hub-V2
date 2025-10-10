import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { RolesAPI, type Role } from '@/api/roles';
import { useToast } from '@/hooks/use-toast';

function Button(props: any) {
  const { className = '', disabled, children, ...rest } = props;
  return (
    <button
      {...rest}
      disabled={disabled}
      className={
        'px-3 py-2 border rounded-md transition-opacity ' +
        (disabled ? 'opacity-60 cursor-not-allowed ' : '') +
        className
      }
    >
      {children}
    </button>
  );
}
function Input(props: any) {
  const { className = '', ...rest } = props;
  return <input {...rest} className={'px-3 py-2 border rounded-md w-full ' + className} />;
}
function Dialog({ open, onClose, children }: any) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-xl min-w-[380px] max-w-[95vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default function RolesPage() {
  const qc = useQueryClient();
  const { toast } = useToast();

  const { data, isFetching } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RolesAPI.list().then((r) => r.data),
    retry: false,
    staleTime: 15_000,
  });

  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [soloEmpresaMaestra, setSoloEmpresaMaestra] = useState(false);

  const isValid = useMemo(() => Boolean(nombre.trim()), [nombre]);

  const createMut = useMutation({
    mutationFn: () =>
      RolesAPI.create({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        soloEmpresaMaestra: Boolean(soloEmpresaMaestra),
      }).then((r) => r.data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['roles'] });
      setOpen(false);
      setNombre('');
      setDescripcion('');
      setSoloEmpresaMaestra(false);
      toast({ title: 'Rol creado', description: 'El rol se creó correctamente.' });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'No se pudo crear el rol.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });

  const removeMut = useMutation({
    mutationFn: (id: number) => RolesAPI.remove(id).then((r) => r.data),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['roles'] });
      toast({ title: 'Rol eliminado', description: 'Se borró correctamente.' });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? 'No se pudo borrar el rol.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });

  const onDelete = (id: number) => {
    if (removeMut.isPending) return;
    const ok = window.confirm('¿Seguro que deseas eliminar este rol?');
    if (ok) removeMut.mutate(id);
  };

  const anyBusy = createMut.isPending || removeMut.isPending;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Roles</h1>
        <div className="flex items-center gap-3">
          {isFetching && (
            <span className="text-xs text-muted-foreground select-none">Actualizando…</span>
          )}
          <Button onClick={() => setOpen(true)}>Nuevo rol</Button>
        </div>
      </div>

      <div className="grid gap-2">
        {data?.map((r: Role) => {
          const busyThisRow = removeMut.isPending; // una sola operación de borrado a la vez
          return (
            <div key={r.id} className="flex items-center justify-between border rounded-xl p-3">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <span>{r.nombre}</span>
                  {r.soloEmpresaMaestra && (
                    <span className="text-xs px-2 py-0.5 border rounded-full">
                      Solo empresa maestra
                    </span>
                  )}
                </div>
                {r.descripcion && (
                  <div className="text-sm opacity-70">{r.descripcion}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Link className="underline text-sm" to={`/admin/roles/${r.id}`}>
                  Detalle
                </Link>
                <Button
                  onClick={() => onDelete(r.id)}
                  className="text-red-600"
                  disabled={busyThisRow}
                >
                  {busyThisRow ? 'Eliminando…' : 'Eliminar'}
                </Button>
              </div>
            </div>
          );
        })}
        {!data?.length && <div className="opacity-70">No hay roles todavía.</div>}
      </div>

      <Dialog open={open} onClose={() => (createMut.isPending ? null : setOpen(false))}>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Crear rol</h2>
          <Input
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={createMut.isPending}
          />
          <Input
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            disabled={createMut.isPending}
          />
          <label className="flex items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={soloEmpresaMaestra}
              onChange={(e) => setSoloEmpresaMaestra(e.target.checked)}
              disabled={createMut.isPending}
            />
            <span>Solo empresa maestra</span>
          </label>
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setOpen(false)} disabled={createMut.isPending}>
              Cancelar
            </Button>
            <Button onClick={() => createMut.mutate()} disabled={!isValid || createMut.isPending}>
              {createMut.isPending ? 'Creando…' : 'Crear'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

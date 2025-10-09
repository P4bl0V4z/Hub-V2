import React, { useMemo, useState } from "react";
import {
  TAXONOMY,
  MATERIALS,
  parseDec,
  computeGlobalTotals,
  computeProductTotals,
  decideNextSection,
} from "./Medicion.logic";
import type {
  FamilyKey,
  MaterialKey,
  ProductItem,
  MedicionPayload,
  NextSectionKey,
} from "./Medicion.logic";

// El peso del componente se guarda como string mientras se escribe (permite "0.", "0,5")
type CompDraft = {
  nombre?: string;
  material?: MaterialKey;
  tipoMaterial?: string;
  peso?: string;
};

type Props = {
  /** Valor inicial para reanudar (opcional) */
  initialValue?: MedicionPayload;

  /** Callback tradicional con el payload tal cual (object) */
  onSubmit?: (payload: MedicionPayload) => void;

  /** Navegación a la siguiente sección del flujo */
  goTo?: (section: NextSectionKey) => void;

  /**
   * 👇 NUEVO (opcional):
   * Permite guardar la respuesta directamente en tu answersMap (o donde quieras),
   * usando el QID "Q_MEDICION_TODO" y el payload como string JSON.
   * Ejemplo de uso en el contenedor:
   *    onSaveAnswer={(qid, value) => setAnswersMap(prev => ({ ...prev, [qid]: value }))}
   */
  onSaveAnswer?: (qid: "Q_MEDICION_TODO", value: string) => void;
};

export default function MedicionCard({ initialValue, onSubmit, goTo, onSaveAnswer }: Props) {
  const [productos, setProductos] = useState<ProductItem[]>(
    () => initialValue?.productos ?? []
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftProd, setDraftProd] = useState<ProductItem>({
    retornable: "no",
    componentes: [],
  });
  const [compDraft, setCompDraft] = useState<CompDraft>({});

  // 👇 controlar qué productos están desplegados
  const [openProducts, setOpenProducts] = useState<Set<number>>(new Set());
  const toggleOpen = (idx: number) => {
    setOpenProducts((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  // ---------- Validación producto ----------
  const canSaveProd = useMemo(() => {
    const hasTipo =
      draftProd.familia === "otro" || draftProd.tipo === "otro"
        ? (draftProd.tipoOtro ?? "").trim().length > 0
        : !!draftProd.tipo;

    return (
      !!draftProd.familia &&
      hasTipo &&
      !!(draftProd.nombre ?? "").trim() &&
      !!draftProd.retornable &&
      Number.isFinite(draftProd.ventas) &&
      (draftProd.ventas ?? 0) >= 0
    );
  }, [draftProd]);

  const saveProductBase = () => {
    if (!canSaveProd) return;
    setProductos((p) => [...p, { ...draftProd, componentes: [] }]);
    setEditingIndex(productos.length);
    setDraftProd({ retornable: "no", componentes: [] });
  };

  // ---------- Componentes ----------
  const addComponent = () => {
    if (editingIndex === null) return;

    const nombre = (compDraft.nombre ?? "").trim();
    const material = compDraft.material;
    const tipoMaterial = compDraft.tipoMaterial;
    const peso = parseDec(String(compDraft.peso ?? ""));

    if (!nombre || !material || !tipoMaterial || !Number.isFinite(peso) || peso < 0) return;

    setProductos((list) =>
      list.map((p, i) =>
        i !== editingIndex
          ? p
          : {
              ...p,
              componentes: [
                ...p.componentes,
                { nombre, material, tipoMaterial, peso },
              ],
            }
      )
    );
    setCompDraft({});
  };

  const removeComponent = (idx: number) => {
    if (editingIndex === null) return;
    setProductos((list) =>
      list.map((p, i) =>
        i !== editingIndex
          ? p
          : { ...p, componentes: p.componentes.filter((_, j) => j !== idx) }
      )
    );
  };

  const closeEditing = () => {
    if (editingIndex === null) return;
    setProductos((list) => list.map((p, i) => (i !== editingIndex ? p : computeProductTotals(p))));
    setEditingIndex(null);
  };

  // ---------- Productos ----------
  const removeProduct = (idx: number) => {
    setProductos((list) => list.filter((_, i) => i !== idx));
    if (editingIndex === idx) setEditingIndex(null);
    // opcional: cerrar si estaba abierto
    setOpenProducts((prev) => {
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });
  };

  // ---------- Submit global ----------
  const totalsGlobal = useMemo(() => computeGlobalTotals(productos), [productos]);
  const canSubmit = productos.length === 1 && editingIndex === null; // Solo 1 producto permitido

  const submitAll = () => {
    if (!canSubmit) return;

    const payload: MedicionPayload = {
      productos,
      totalKg: totalsGlobal.totalKg,
      totalKgPorMaterial: totalsGlobal.totalKgPorMaterial,
    };

    // 1) Guardado clásico por callback (mantiene compatibilidad)
    onSubmit?.(payload);

    // 2) 👇 NUEVO: guardar en answersMap (o lo que definas) con QID y JSON string
    onSaveAnswer?.("Q_MEDICION_TODO", JSON.stringify(payload));

    // 3) Navegar según totalKg
    const next = decideNextSection(payload.totalKg); // "trazabilidad" | "vu_retc"
    goTo?.(next);
  };

  /* ===================== UI ===================== */
  return (
    <div className="space-y-8">
      {/* Instrucciones destacadas */}
      <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="text-3xl">✓</div>
          <div>
            <h3 className="font-bold text-lg text-green-900 mb-2">
              Ingresa tu producto con más ventas
            </h3>
            <p className="text-sm text-green-800">
              Para esta medición, solo necesitas ingresar <strong>1 producto: el que tenga más ventas anuales</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de productos guardados */}
      {productos.map((p, idx) => {
        const isOpen = openProducts.has(idx);
        return (
          <section key={idx} className="rounded-2xl border-2 border-green-200 bg-green-50 p-5 shadow-sm">
            <div className="mb-2 font-semibold uppercase text-green-900">
              Tu Producto con Más Ventas
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm">
                <div className="font-semibold">{p.nombre}</div>
                <div className="text-xs opacity-70">
                  {p.familia ? TAXONOMY[p.familia].label : "-"} •{" "}
                  {p.familia === "otro" || p.tipo === "otro"
                    ? p.tipoOtro
                    : p.familia
                    ? TAXONOMY[p.familia].types.find((t) => t.value === p.tipo)?.label
                    : "-"}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div>
                  <span className="opacity-70">Ventas:</span>{" "}
                  <span className="font-semibold">
                    {(p.ventas ?? 0).toLocaleString()} un
                  </span>
                </div>

                {/* botón para desplegar/ocultar componentes */}
                {p.componentes.length > 0 && editingIndex !== idx && (
                  <button
                    className="rounded-xl border px-3 py-2"
                    onClick={() => toggleOpen(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`prod-${idx}-componentes`}
                    title={isOpen ? "Ocultar componentes" : "Ver componentes"}
                  >
                    <span className="inline-block mr-1">{isOpen ? "▾" : "▸"}</span>
                    {isOpen ? "Ocultar componentes" : `Ver componentes (${p.componentes.length})`}
                  </button>
                )}
              </div>
            </div>

            {/* componentes colapsables */}
            {isOpen && p.componentes.length > 0 && editingIndex !== idx && (
              <div id={`prod-${idx}-componentes`} className="mt-4">
                {p.componentes.map((c, i) => (
                  <div key={i} className="flex items-center justify-between border-t py-2 text-sm">
                    <div className="opacity-70">Componente {String(i + 1).padStart(2, "0")}</div>
                    <div className="flex-1 px-4">{c.nombre}</div>
                    <div className="w-40 truncate">{MATERIALS[c.material].label}</div>
                    <div className="w-48 truncate">
                      {MATERIALS[c.material].types.find((t) => t.value === c.tipoMaterial)?.label}
                    </div>
                    <div className="w-32 text-right">{c.peso.toLocaleString()} g</div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex gap-3">
              {editingIndex === idx ? (
                <button className="rounded-xl border px-3 py-2" onClick={closeEditing}>
                  Cerrar edición
                </button>
              ) : (
                <button className="rounded-xl border px-3 py-2" onClick={() => setEditingIndex(idx)}>
                  {p.componentes.length ? "Editar componentes" : "Agregar componentes"}
                </button>
              )}
              <button className="rounded-xl border px-3 py-2" onClick={() => removeProduct(idx)}>
                Eliminar producto
              </button>
            </div>

            {editingIndex !== idx && p.kgTotales != null && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg border p-3">
                  <div className="opacity-70">Peso unidad</div>
                  <div className="font-semibold">{p.pesoUnidadGr?.toFixed(2)} g</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="opacity-70">Kg totales</div>
                  <div className="font-semibold">{p.kgTotales?.toFixed(3)} kg</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="opacity-70">Kg por material</div>
                  <div className="text-xs">
                    {Object.entries(p.kgPorMaterial ?? {}).map(([k, v]) => (
                      <div key={k}>
                        {MATERIALS[k as MaterialKey].label}: <b>{(v ?? 0).toFixed(3)} kg</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        );
      })}

      {/* Formulario de producto */}
      {editingIndex === null && productos.length === 0 && (
        <section className="rounded-2xl border p-5 shadow-sm">
          <div className="font-semibold mb-4">Ingresa tu producto con más ventas</div>

          <label className="block text-sm mb-1">Producto</label>
          <input
            className="w-full border rounded-lg p-2 mb-3"
            placeholder="Ej. Sprite 3Lts."
            value={draftProd.nombre ?? ""}
            onChange={(e) => setDraftProd((d) => ({ ...d, nombre: e.target.value }))}
          />

          <label className="block text-sm mb-1">Familia de producto</label>
          <select
            className="w-full border rounded-lg p-2 mb-3"
            value={draftProd.familia ?? ""}
            onChange={(e) =>
              setDraftProd((d) => ({
                ...d,
                familia: (e.target.value || undefined) as FamilyKey,
                tipo: undefined,
                tipoOtro: undefined,
              }))
            }
          >
            <option value="">Selecciona una opción</option>
            {Object.entries(TAXONOMY).map(([k, f]) => (
              <option key={k} value={k}>
                {f.label}
              </option>
            ))}
          </select>

          <label className="block text-sm mb-1">Tipo de producto</label>
          <select
            className="w-full border rounded-lg p-2 mb-3"
            disabled={!draftProd.familia}
            value={draftProd.tipo ?? ""}
            onChange={(e) => setDraftProd((d) => ({ ...d, tipo: e.target.value || undefined }))}
          >
            <option value="">Selecciona una opción</option>
            {draftProd.familia &&
              TAXONOMY[draftProd.familia].types.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
          </select>

          {(draftProd.familia === "otro" || draftProd.tipo === "otro") && (
            <>
              <label className="block text-sm mb-1">Tipo de producto</label>
              <input
                className="w-full border rounded-lg p-2 mb-3"
                placeholder="Especifica el tipo"
                value={draftProd.tipoOtro ?? ""}
                onChange={(e) => setDraftProd((d) => ({ ...d, tipoOtro: e.target.value }))}
              />
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <fieldset>
              <legend className="block text-sm mb-1">Retornable</legend>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name="retornable"
                    checked={draftProd.retornable === "si"}
                    onChange={() => setDraftProd((d) => ({ ...d, retornable: "si" }))}
                  />{" "}
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="retornable"
                    checked={draftProd.retornable === "no"}
                    onChange={() => setDraftProd((d) => ({ ...d, retornable: "no" }))}
                  />{" "}
                  No
                </label>
              </div>
            </fieldset>

            <label className="text-sm">
              <span className="block mb-1">Ventas anuales del producto (unidades)</span>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full border rounded-lg p-2"
                placeholder="Ej. 10000"
                value={draftProd.ventas ?? ""}
                onChange={(e) => {
                  const n = parseDec(e.target.value);
                  setDraftProd((d) => ({
                    ...d,
                    ventas: Number.isFinite(n) ? Math.max(0, Math.floor(n)) : undefined,
                  }));
                }}
              />
            </label>
          </div>

          <div className="mt-4">
            <button
              className="rounded-xl border px-4 py-2"
              disabled={!canSaveProd}
              onClick={saveProductBase}
            >
              Guardar producto
            </button>
          </div>
        </section>
      )}

      {/* Editor de componentes */}
      {editingIndex !== null && (
        <section className="rounded-2xl border p-5 shadow-sm">
          <div className="font-semibold mb-2">
            Ingresa componentes — Producto {String(editingIndex + 1).padStart(2, "0")}
          </div>

          {productos[editingIndex].componentes.length > 0 && (
            <div className="mb-4">
              {productos[editingIndex].componentes.map((c, i) => (
                <div key={i} className="flex items-center justify-between border-t py-2 text-sm">
                  <div className="opacity-70">Componente {String(i + 1).padStart(2, "0")}</div>
                  <div className="flex-1 px-4">{c.nombre}</div>
                  <div className="w-40 truncate">{MATERIALS[c.material].label}</div>
                  <div className="w-48 truncate">
                    {MATERIALS[c.material].types.find((t) => t.value === c.tipoMaterial)?.label}
                  </div>
                  <div className="w-32 text-right">{c.peso.toLocaleString()} g</div>
                  <div className="w-28 text-right">
                    <button className="text-xs underline" onClick={() => removeComponent(i)}>
                      eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <label className="text-sm">
              <span className="block mb-1">Componente</span>
              <input
                className="w-full border rounded-lg p-2"
                placeholder="Botella, tapa, etiqueta…"
                value={compDraft.nombre ?? ""}
                onChange={(e) => setCompDraft((c) => ({ ...c, nombre: e.target.value }))}
              />
            </label>

            <label className="text-sm">
              <span className="block mb-1">Material</span>
              <select
                className="w-full border rounded-lg p-2"
                value={compDraft.material ?? ""}
                onChange={(e) =>
                  setCompDraft((c) => ({
                    ...c,
                    material: (e.target.value || undefined) as MaterialKey,
                    tipoMaterial: undefined,
                  }))
                }
              >
                <option value="">Selecciona una opción</option>
                {Object.entries(MATERIALS).map(([k, m]) => (
                  <option key={k} value={k}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="block mb-1">Tipo de material</span>
              <select
                className="w-full border rounded-lg p-2"
                disabled={!compDraft.material}
                value={compDraft.tipoMaterial ?? ""}
                onChange={(e) => setCompDraft((c) => ({ ...c, tipoMaterial: e.target.value }))}
              >
                <option value="">Selecciona una opción</option>
                {(compDraft.material ? MATERIALS[compDraft.material].types : []).map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm">
              <span className="block mb-1">Peso (g)</span>
              <input
                inputMode="decimal"
                placeholder="400"
                className="w-full border rounded-lg p-2"
                value={compDraft.peso ?? ""}
                onChange={(e) => setCompDraft((c) => ({ ...c, peso: e.target.value }))}
              />
            </label>
          </div>

          <div className="mt-3 flex gap-3">
            <button className="rounded-xl border px-4 py-2" onClick={addComponent}>
              Guardar componente
            </button>
            <button className="rounded-xl border px-4 py-2" onClick={closeEditing}>
              Terminar y calcular
            </button>
          </div>
        </section>
      )}

      {/* Totales globales + submit */}
      {productos.length > 0 && (
        <section className="rounded-2xl border p-5 shadow-sm">
          <div className="font-semibold mb-4">Resumen de Medición</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border p-4 bg-gray-50">
              <div className="text-gray-600 mb-1">Total Kg anuales</div>
              <div className="text-2xl font-bold text-gray-900">
                {totalsGlobal.totalKg.toFixed(3)} kg
              </div>
              {totalsGlobal.totalKg >= 300 ? (
                <div className="mt-2 text-xs text-green-700 font-semibold">
                  ✓ Supera los 300 kg → Afecta REP
                </div>
              ) : (
                <div className="mt-2 text-xs text-orange-700 font-semibold">
                  ⚠ No supera los 300 kg → No afecta REP
                </div>
              )}
            </div>
            <div className="rounded-lg border p-4 bg-gray-50">
              <div className="text-gray-600 mb-2">Kg por material</div>
              <div className="text-xs space-y-1">
                {Object.entries(totalsGlobal.totalKgPorMaterial).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span>{MATERIALS[k as MaterialKey].label}:</span>
                    <span className="font-semibold">{(v ?? 0).toFixed(3)} kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              className="rounded-2xl px-6 py-3 bg-sky-600 text-white disabled:opacity-50 font-semibold hover:bg-sky-700 transition-colors"
              disabled={!canSubmit}
              onClick={submitAll}
            >
              Continuar con el diagnóstico
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

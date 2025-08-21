import React, { useMemo, useState } from "react";

/* ===================== Catálogos ===================== */

type FamilyKey =
  | "alimentos"
  | "cuidado_personal"
  | "hogar"
  | "oficina"
  | "tecnologia"
  | "otro";

const TAXONOMY: Record<
  FamilyKey,
  { label: string; types: { value: string; label: string }[] }
> = {
  alimentos: {
    label: "Alimentos",
    types: [
      { value: "aceites", label: "Aceites" },
      { value: "aguas", label: "Aguas" },
      { value: "arroz_avena_legumbres", label: "Arroz, avena, legumbres" },
      { value: "azucar_te_cafe_endulzantes", label: "Azúcar, té, café, endulzantes" },
      { value: "bebidas_jugos", label: "Bebidas, jugos" },
      { value: "panaderia_pasteleria", label: "Panadería, pastelería" },
      { value: "cereales", label: "Cereales" },
      { value: "cervezas", label: "Cervezas" },
      { value: "comida_rapida", label: "Comida rápida" },
      { value: "salsas_condimentos", label: "Salsas, condimentos" },
      { value: "conservas", label: "Conservas" },
      { value: "frutos_secos", label: "Frutos secos" },
      { value: "harinas_derivados", label: "Harinas, derivados" },
      { value: "congelados", label: "Congelados" },
      { value: "huevos", label: "Huevos" },
      { value: "bebidas_alcoholicas", label: "Bebidas alcohólicas" },
      { value: "pan", label: "Pan" },
      { value: "pastas", label: "Pastas" },
      { value: "no_se", label: "No lo sé" },
      { value: "otro", label: "Otro" },
    ],
  },
  cuidado_personal: {
    label: "Cuidado Personal",
    types: [
      { value: "cosmetica_perfumeria", label: "Cosmética, perfumería" },
      { value: "farmacias", label: "Farmacias" },
      { value: "higiene", label: "Higiene" },
      { value: "insumos_medicos", label: "Insumos médicos, laboratorio" },
      { value: "vestuario", label: "Vestuario" },
      { value: "no_se", label: "No lo sé" },
      { value: "otro", label: "Otro" },
    ],
  },
  hogar: {
    label: "Hogar",
    types: [
      { value: "mobiliario", label: "Mobiliario" },
      { value: "decoracion", label: "Decoración" },
      { value: "jardineria", label: "Jardinería" },
      { value: "ferreteria", label: "Ferretería" },
      { value: "aseo_limpieza", label: "Aseo, Limpieza" },
      { value: "no_se", label: "No lo sé" },
      { value: "otro", label: "Otro" },
    ],
  },
  oficina: {
    label: "Artículos de oficina",
    types: [
      { value: "archivos_registros", label: "Archivos, registros" },
      { value: "escritura", label: "Escritura" },
      { value: "mobiliario_oficina", label: "Mobiliario" },
      { value: "papeleria", label: "Papelería" },
      { value: "suministros_varios", label: "Suministros varios" },
      { value: "no_se", label: "No lo sé" },
      { value: "otro", label: "Otro" },
    ],
  },
  tecnologia: {
    label: "Tecnología electrodomésticos",
    types: [
      { value: "audio", label: "Audio" },
      { value: "computadores_accesorios", label: "Computadores, accesorios" },
      { value: "impresoras_multifuncionales", label: "Impresoras multifuncionales" },
      { value: "insumos_suministros", label: "Insumos, suministros" },
      { value: "linea_blanca", label: "Línea blanca" },
      { value: "no_se", label: "No lo sé" },
      { value: "otro", label: "Otro" },
    ],
  },
  otro: { label: "Otro", types: [{ value: "otro", label: "Otro" }] },
};

type MaterialKey = "plasticos" | "metales" | "papel_carton" | "maderas" | "vidrios";

const MATERIALS: Record<MaterialKey, { label: string; types: { value: string; label: string }[] }> = {
  plasticos: {
    label: "Plásticos",
    types: [
      { value: "pet_botella", label: "PET Botella" },
      { value: "pet_otro", label: "PET Otro" },
      { value: "pehd_sin_grasa", label: "PEHD sin grasa" },
      { value: "pehd_con_grasa", label: "PEHD con grasa" },
      { value: "peld_sin_grasa", label: "PELD sin grasa" },
      { value: "peld_con_grasa", label: "PELD con grasa" },
      { value: "pebd_sin_grasa", label: "PEBD sin grasa" },
      { value: "pebd_con_grasa", label: "PEBD con grasa" },
      { value: "pead_sin_grasa", label: "PEAD sin grasa" },
      { value: "pead_con_grasa", label: "PEAD con grasa" },
      { value: "pp_sin_grasa", label: "PP sin grasa" },
      { value: "pp_con_grasa", label: "PP con grasa" },
      { value: "ps_sin_grasa", label: "PS sin grasa" },
      { value: "ps_con_grasa", label: "PS con grasa" },
      { value: "otro", label: "Otro" },
    ],
  },
  metales: {
    label: "Metales",
    types: [
      { value: "aluminio", label: "Aluminio" },
      { value: "hojalata", label: "Hojalata" },
      { value: "metal_con_aire", label: "Metal con aire" },
      { value: "otro", label: "Otro" },
    ],
  },
  papel_carton: {
    label: "Papel Cartón",
    types: [
      { value: "papel_blanco", label: "Papel blanco" },
      { value: "papel_color", label: "Papel color" },
      { value: "papel_kraft", label: "Papel kraft" },
      { value: "papel_carton", label: "Papel cartón" },
      { value: "papel_laminado", label: "Papel laminado" },
      { value: "papel_compuesto", label: "Papel compuesto" },
      { value: "tetrapak", label: "Tetrapak" },
      { value: "otro", label: "Otro" },
    ],
  },
  maderas: {
    label: "Maderas",
    types: [
      { value: "despunte_madera", label: "Despunte madera" },
      { value: "pallets", label: "Pallets" },
      { value: "otro", label: "Otro" },
    ],
  },
  vidrios: {
    label: "Vidrios",
    types: [
      { value: "vidrio_transparente", label: "Vidrio transparente" },
      { value: "vidrio_color", label: "Vidrio color" },
      { value: "otro", label: "Otro" },
    ],
  },
};

/* ===================== Tipos de datos ===================== */

export type ComponentItem = {
  nombre: string;
  material: MaterialKey;
  tipoMaterial: string;
  peso: number; // gramos por unidad
};

export type ProductItem = {
  familia?: FamilyKey;
  tipo?: string;
  tipoOtro?: string;
  nombre?: string;
  retornable?: "si" | "no";
  ventas?: number; // unidades anuales
  componentes: ComponentItem[];

  // calculados
  pesoUnidadGr?: number;
  kgTotales?: number;
  kgPorMaterial?: Partial<Record<MaterialKey, number>>;
};

export type MedicionPayload = {
  productos: ProductItem[];
  totalKg: number;
  totalKgPorMaterial: Partial<Record<MaterialKey, number>>;
};

type Props = {
  initialValue?: MedicionPayload;
  onSubmit?: (payload: MedicionPayload) => void;
};

/* ===================== Utils ===================== */
const round2 = (n: number) => Math.round(n * 100) / 100;
const round3 = (n: number) => Math.round(n * 1000) / 1000;
const parseDec = (s: string) => {
  const v = s.replace(",", ".").replace(/[^\d.-]/g, "");
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : NaN;
};

/* ===================== Componente ===================== */

export default function MedicionCard({ initialValue, onSubmit }: Props) {
  const [productos, setProductos] = useState<ProductItem[]>(() => initialValue?.productos ?? []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null); // producto que está en “agregar componentes”

  // draft del producto nuevo (pantalla de la 2ª imagen)
  const [draftProd, setDraftProd] = useState<ProductItem>({ retornable: "no", componentes: [] });

  // draft del componente (pantallas 3ª y 4ª)
  const [compDraft, setCompDraft] = useState<Partial<ComponentItem>>({});

  const tiposProducto = useMemo(
    () => (draftProd.familia ? TAXONOMY[draftProd.familia].types : []),
    [draftProd.familia]
  );

  const tiposMaterial = useMemo(
    () => (compDraft.material ? MATERIALS[compDraft.material].types : []),
    [compDraft.material]
  );

  /* ---------- producto: validar y guardar (pasa a “agregar componentes”) ---------- */

  const canSaveProd = (() => {
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
  })();

  const saveProductBase = () => {
    if (!canSaveProd) return;
    setProductos((p) => [...p, { ...draftProd, componentes: [] }]);
    setEditingIndex(productos.length); // nuevo índice
    setDraftProd({ retornable: "no", componentes: [] }); // limpia el formulario de producto
  };

  /* ---------- componentes: agregar / eliminar para el producto en edición ---------- */

  const addComponent = () => {
    if (editingIndex === null) return;
    const nombre = (compDraft.nombre ?? "").trim();
    const material = compDraft.material;
    const tipoMaterial = compDraft.tipoMaterial;
    const pesoTxt = String(compDraft.peso ?? "");
    const peso = parseDec(pesoTxt);

    if (!nombre || !material || !tipoMaterial || !Number.isFinite(peso) || peso < 0) return;

    setProductos((list) =>
      list.map((p, i) =>
        i !== editingIndex
          ? p
          : { ...p, componentes: [...p.componentes, { nombre, material, tipoMaterial, peso }] }
      )
    );
    setCompDraft({});
  };

  const removeComponent = (idx: number) => {
    if (editingIndex === null) return;
    setProductos((list) =>
      list.map((p, i) =>
        i !== editingIndex ? p : { ...p, componentes: p.componentes.filter((_, j) => j !== idx) }
      )
    );
  };

  /* ---------- cerrar edición de componentes: calcula totales del producto ---------- */

  const closeEditing = () => {
    if (editingIndex === null) return;
    setProductos((list) =>
      list.map((p, i) => (i !== editingIndex ? p : computeProductTotals(p)))
    );
    setEditingIndex(null);
  };

  /* ---------- eliminar producto ---------- */

  const removeProduct = (idx: number) => {
    setProductos((list) => list.filter((_, i) => i !== idx));
    if (editingIndex === idx) setEditingIndex(null);
  };

  /* ---------- submit global ---------- */

  const totalsGlobal = useMemo(() => computeGlobalTotals(productos), [productos]);
  const canSubmit = productos.length > 0 && editingIndex === null;

  const submitAll = () => {
    if (!canSubmit) return;
    onSubmit?.({
      productos,
      totalKg: totalsGlobal.totalKg,
      totalKgPorMaterial: totalsGlobal.totalKgPorMaterial,
    });
  };

  /* ===================== UI ===================== */

  return (
    <div className="space-y-8">
      {/* Lista de productos guardados (como tu 1ª imagen) */}
      {productos.map((p, idx) => (
        <section key={idx} className="rounded-2xl border p-5 shadow-sm bg-white/70">
          <div className="mb-2 font-semibold uppercase">Producto {String(idx + 1).padStart(2, "0")}</div>
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
            <div className="text-sm">
              <span className="opacity-70">Ventas:</span>{" "}
              <span className="font-semibold">
                {(p.ventas ?? 0).toLocaleString()} un
              </span>
            </div>
          </div>

          {/* detalle de componentes si el producto ya tiene */}
          {p.componentes.length > 0 && (
            <div className="mt-4">
              {p.componentes.map((c, i) => (
                <div key={i} className="flex items-center justify-between border-t py-2 text-sm">
                  <div className="opacity-70">Componente {String(i + 1).padStart(2, "0")}</div>
                  <div className="flex-1 px-4">{c.nombre}</div>
                  <div className="w-40 truncate">
                    {MATERIALS[c.material].label}
                  </div>
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

          {/* Totales del producto (si ya se cerró edición y fueron calculados) */}
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
      ))}

      {/* Formulario de producto (2ª imagen) */}
      {editingIndex === null && (
        <section className="rounded-2xl border p-5 shadow-sm">
          <div className="font-semibold mb-4">Ingresa tus productos</div>

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
              <span className="block mb-1">Ventas anuales del producto (un)</span>
              {/* input textual para evitar flechitas */}
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full border rounded-lg p-2"
                placeholder="300"
                value={draftProd.ventas ?? ""}
                onChange={(e) => {
                  const n = parseDec(e.target.value);
                  setDraftProd((d) => ({ ...d, ventas: Number.isFinite(n) ? Math.max(0, Math.floor(n)) : undefined }));
                }}
              />
            </label>
          </div>

          <div className="mt-4">
            <button className="rounded-xl border px-4 py-2" disabled={!canSaveProd} onClick={saveProductBase}>
              Guardar producto
            </button>
          </div>
        </section>
      )}

      {/* Formulario de componentes (3ª y 4ª imagen) */}
      {editingIndex !== null && (
        <section className="rounded-2xl border p-5 shadow-sm">
          <div className="font-semibold mb-2">
            Ingresa componentes — Producto {String(editingIndex + 1).padStart(2, "0")}
          </div>

          {/* componentes ya cargados */}
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

          {/* formulario de un componente */}
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
              {/* input textual para evitar flechitas */}
              <input
                inputMode="decimal"
                placeholder="400"
                className="w-full border rounded-lg p-2"
                value={compDraft.peso ?? ""}
                onChange={(e) => {
                  const n = parseDec(e.target.value);
                  setCompDraft((c) => ({ ...c, peso: Number.isFinite(n) ? n : ("" as unknown as number) }));
                }}
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
      <section className="rounded-2xl border p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border p-3">
            <div className="opacity-70">Productos</div>
            <div className="font-semibold">{productos.length}</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="opacity-70">Total Kg</div>
            <div className="font-semibold">{totalsGlobal.totalKg.toFixed(3)} kg</div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="opacity-70">Kg por material</div>
            <div className="text-xs">
              {Object.entries(totalsGlobal.totalKgPorMaterial).map(([k, v]) => (
                <div key={k}>
                  {MATERIALS[k as MaterialKey].label}: <b>{(v ?? 0).toFixed(3)} kg</b>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="rounded-2xl px-4 py-2 bg-sky-600 text-white disabled:opacity-50" disabled={!canSubmit} onClick={submitAll}>
            Guardar / Continuar
          </button>
        </div>
      </section>
    </div>
  );
}

/* ===================== Cálculos ===================== */

function computeProductTotals(p: ProductItem): ProductItem {
  const pesoUnidad = p.componentes.reduce((s, c) => s + (c.peso || 0), 0); // g
  const kg = ((p.ventas ?? 0) * pesoUnidad) / 1000;

  const porMaterial: Partial<Record<MaterialKey, number>> = {};
  p.componentes.forEach((c) => {
    const kgMat = ((p.ventas ?? 0) * (c.peso || 0)) / 1000;
    porMaterial[c.material] = round3((porMaterial[c.material] ?? 0) + kgMat);
  });

  return {
    ...p,
    pesoUnidadGr: round2(pesoUnidad),
    kgTotales: round3(kg),
    kgPorMaterial: porMaterial,
  };
}

function computeGlobalTotals(productos: ProductItem[]) {
  let totalKg = 0;
  const totalKgPorMaterial: Partial<Record<MaterialKey, number>> = {};

  productos.forEach((p) => {
    const pp = p.kgTotales == null ? computeProductTotals(p) : p;
    totalKg += pp.kgTotales ?? 0;
    Object.entries(pp.kgPorMaterial ?? {}).forEach(([k, v]) => {
      const key = k as MaterialKey;
      totalKgPorMaterial[key] = round3((totalKgPorMaterial[key] ?? 0) + (v ?? 0));
    });
  });

  return { totalKg: round3(totalKg), totalKgPorMaterial };
}

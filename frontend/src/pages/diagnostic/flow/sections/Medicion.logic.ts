// ==== Tipos ====
export type FamilyKey =
  | "alimentos"
  | "cuidado_personal"
  | "hogar"
  | "oficina"
  | "tecnologia"
  | "otro";

export type MaterialKey = "plasticos" | "metales" | "papel_carton" | "maderas" | "vidrios";

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

// ==== Catálogos ====
export const TAXONOMY: Record<
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

export const MATERIALS: Record<
  MaterialKey,
  { label: string; types: { value: string; label: string }[] }
> = {
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

// ==== Utils ====
export const round2 = (n: number) => Math.round(n * 100) / 100;
export const round3 = (n: number) => Math.round(n * 1000) / 1000;

/** Acepta "1.5" o "1,5". Devuelve NaN si no hay número. */
export const parseDec = (s: string) => {
  const v = s.replace(",", ".").replace(/[^\d.-]/g, "");
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : NaN;
};

// ==== Dominio (cálculos) ====
export function computeProductTotals(p: ProductItem): ProductItem {
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

export function computeGlobalTotals(productos: ProductItem[]) {
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

/* ===== Decisión de ruteo por kg ===== */
export const REP_THRESHOLD_KG = 300 as const;

export type NextSectionKey = "trazabilidad" | "vu_retc";

/** > 300 kg -> "trazabilidad"; <= 300 kg -> "vu_retc" */
export function decideNextSection(totalKg: number): NextSectionKey {
  return totalKg >= REP_THRESHOLD_KG ? "trazabilidad" : "vu_retc";
}

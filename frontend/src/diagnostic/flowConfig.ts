// src/diagnostic/flowConfig.ts
// -----------------------------------------------------------------------------
// OBJETIVO (v3 con Trazabilidad + Sistema de Gestión):
// Flujo declarativo para el diagnóstico de afectación a la Ley REP.
// El grafo se recorre pregunta por pregunta (single-choice).
//
// Ramas principales:
// 1) Antecedentes
//    - Q_SIZE (tamaño empresa)
//        * Micro  => no afecta REP => deriva a subflujo VU‑RETC (Q_VU_*)
//        * Pequeña/Mediana/Grande => preguntar si comercializa
//    - Q_COMERCIALIZA
//        * No => no afecta REP => VU‑RETC
//        * Sí => preguntar si supera 300 kg
//    - Q_KG300
//        * No lo sé => Medición (placeholder)
//        * No => no afecta REP => VU‑RETC
//        * Sí => Sí afecta REP => entrar a Trazabilidad -> Sistema de Gestión -> VU‑RETC
//
// 2) Trazabilidad – Línea Base
//    - Q_TRAZ_ESTAND (mapea una "madurez" informativa para el resumen)
//    - Q_TRAZ_ENCARGADO (solo guarda)
//    - Q_TRAZ_COMPLEJIDAD (solo guarda)
//    => Luego pasa a Sistema de Gestión
//
// 3) Sistema de Gestión
//    - Q_SG_ADHERIDO (ambas ramas llevan a Q_SG_DECLARADO)
//    - Q_SG_DECLARADO (al terminar, pasa a VU‑RETC)
//    => Con esto garantizamos que SIEMPRE se pregunte declaraciones
//
// 4) VU – RETC (sin cambios funcionales)
//    - Q_VU_REG, Q_VU_APERTURA, Q_VU_DECL, Q_ENCARGADO, Q_PLAN
//
// 5) Medición (placeholder)
//    - Q_MEDICION_TODO
//
// 6) END
//
// computeOutcome:
// - Determina "afecta_rep" según tamaño/comercializa/300kg.
// - Calcula "vu_stage" si respondieron VU‑RETC.
// - Expone "encargado_flag" y "selected_plan".
// - Agrega "traz_madurez" (informativo) mapeado desde Q_TRAZ_ESTAND.
//
// NOTA: El Runner/Componente que consuma este archivo debe:
// - Mostrar la pregunta actual y sus opciones.
// - Guardar la respuesta en un diccionario `answers`.
// - Calcular el `next` según la opción elegida.
// - Al llegar a END, invocar `computeOutcome(answers)` para el resumen.
// -----------------------------------------------------------------------------

// Claves de sección para ordenar/rotular el flujo en la UI
export type SectionKey =
  | "antecedentes"
  | "trazabilidad"
  | "sistema_gestion"
  | "vu_retc"
  | "medicion";

// IDs de preguntas. Mantener consistencia con el grafo de `QUESTIONS`.
export type QuestionId =
  // Antecedentes
  | "Q_SIZE"
  | "Q_COMERCIALIZA"
  | "Q_KG300"
  // Trazabilidad – Línea Base
  | "Q_TRAZ_ESTAND"
  | "Q_TRAZ_ENCARGADO"
  | "Q_TRAZ_COMPLEJIDAD"
  // Sistema de Gestión
  | "Q_SG_ADHERIDO"
  | "Q_SG_DECLARADO"
  // VU – RETC
  | "Q_VU_REG"
  | "Q_VU_APERTURA"
  | "Q_VU_DECL"
  | "Q_ENCARGADO"
  | "Q_PLAN"
  // Medición (placeholder)
  | "Q_MEDICION_TODO"
  // Fin
  | "END";

// Secciones visibles (orden para UI)
export const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "antecedentes", label: "Antecedentes" },
  { key: "trazabilidad", label: "Trazabilidad – Línea Base" },
  { key: "sistema_gestion", label: "Sistema de Gestión" },
  { key: "vu_retc", label: "VU – RETC" },
  { key: "medicion", label: "Medición" },
];

// Opción genérica para preguntas single-choice
export type Option = {
  label: string;  // Texto visible
  value: string;  // Valor guardado en `answers[questionId]`
  next?: QuestionId | ((answer: string, answers: Record<string, string>) => QuestionId);
                  // Siguiente pregunta (o función para decidirla dinámicamente)
};

// Estructura de una pregunta single-choice
export type Question = {
  id: QuestionId;
  sectionKey: SectionKey;
  title: string;
  type: "single";
  options?: Option[];
  validate?: (answers: Record<string, string>) => string | null; // Retorna mensaje si hay error
};

// -----------------------------------------------------------------------------
// Grafo de preguntas (flujo declarativo)
// -----------------------------------------------------------------------------
export const QUESTIONS: Record<QuestionId, Question> = {
  // ----------------- 1) Antecedentes -----------------
  Q_SIZE: {
    id: "Q_SIZE",
    sectionKey: "antecedentes",
    title: "¿Cuál es el tamaño de tu empresa?",
    type: "single",
    options: [
      // Micro => no afecta REP => derivamos a VU‑RETC para perfilar la empresa
      { label: "Micro empresa", value: "micro", next: "Q_VU_REG" },
      // Pequeña/Mediana/Grande => debemos consultar comercialización
      { label: "Pequeña empresa", value: "pequena", next: "Q_COMERCIALIZA" },
      { label: "Mediana empresa", value: "mediana", next: "Q_COMERCIALIZA" },
      { label: "Empresa grande", value: "grande", next: "Q_COMERCIALIZA" },
    ],
    validate: (a) => (!a.Q_SIZE ? "Selecciona un tamaño de empresa." : null),
  },

  Q_COMERCIALIZA: {
    id: "Q_COMERCIALIZA",
    sectionKey: "antecedentes",
    title: "¿Comercializas en Chile productos con envases y embalajes?",
    type: "single",
    options: [
      // Si NO comercializa => No afecta REP => VU‑RETC
      { label: "No", value: "no", next: "Q_VU_REG" },
      // Si comercializa => preguntamos si supera el umbral de 300 kg/año
      { label: "Sí", value: "si", next: "Q_KG300" },
    ],
    validate: (a) => (!a.Q_COMERCIALIZA ? "Selecciona una opción." : null),
  },

  Q_KG300: {
    id: "Q_KG300",
    sectionKey: "antecedentes",
    title: "¿Pones en mercado más de 300 kg/año de envases y embalajes en mercado nacional?",
    type: "single",
    options: [
      // Desconoce => derivar a Medición (placeholder de momento)
      { label: "No lo sé", value: "ns", next: "Q_MEDICION_TODO" },
      // No => No afecta REP => VU‑RETC
      { label: "No", value: "no", next: "Q_VU_REG" },
      // Sí => Sí afecta REP => entrar a Trazabilidad
      { label: "Sí", value: "si", next: "Q_TRAZ_ESTAND" },
    ],
    validate: (a) => (!a.Q_KG300 ? "Selecciona una opción." : null),
  },

  // ----------------- 2) Trazabilidad – Línea Base -----------------
  // 2.1) Estandarización: esta pregunta mapea una "madurez" para el resumen.
  Q_TRAZ_ESTAND: {
    id: "Q_TRAZ_ESTAND",
    sectionKey: "trazabilidad",
    title: "¿Con qué nivel de estandarización se representa la empresa?",
    type: "single",
    options: [
      { label: "Óptimo",   value: "optimo",   next: "Q_TRAZ_ENCARGADO" },
      { label: "Bueno",    value: "bueno",    next: "Q_TRAZ_ENCARGADO" },
      { label: "Regular",  value: "regular",  next: "Q_TRAZ_ENCARGADO" },
      { label: "Limitado", value: "limitado", next: "Q_TRAZ_ENCARGADO" },
      { label: "Crítico",  value: "critico",  next: "Q_TRAZ_ENCARGADO" },
    ],
    validate: (a) => (!a.Q_TRAZ_ESTAND ? "Selecciona un nivel de estandarización." : null),
  },

  // 2.2) Encargado en Trazabilidad: solo registro de respuesta (no afecta resumen)
  Q_TRAZ_ENCARGADO: {
    id: "Q_TRAZ_ENCARGADO",
    sectionKey: "trazabilidad",
    title: "¿Tienes un encargado de Cumplimiento REP y/o VU‑RETC?",
    type: "single",
    options: [
      { label: "Sí", value: "si", next: "Q_TRAZ_COMPLEJIDAD" },
      { label: "No", value: "no", next: "Q_TRAZ_COMPLEJIDAD" },
    ],
    validate: (a) => (!a.Q_TRAZ_ENCARGADO ? "Selecciona una opción." : null),
  },

  // 2.3) Complejidad de productos: solo registro de respuesta
  Q_TRAZ_COMPLEJIDAD: {
    id: "Q_TRAZ_COMPLEJIDAD",
    sectionKey: "trazabilidad",
    title: "¿Qué nivel de complejidad de productos tiene la empresa?",
    type: "single",
    options: [
      { label: "Básica",     value: "basica",     next: "Q_SG_ADHERIDO" },
      { label: "Intermedia", value: "intermedia", next: "Q_SG_ADHERIDO" },
      { label: "Avanzada",   value: "avanzada",   next: "Q_SG_ADHERIDO" },
      { label: "Compleja",   value: "compleja",   next: "Q_SG_ADHERIDO" },
    ],
    validate: (a) => (!a.Q_TRAZ_COMPLEJIDAD ? "Selecciona una opción." : null),
  },

  // ----------------- 3) Sistema de Gestión -----------------
  // IMPORTANTE: Ambas ramas (Sí/No) van a Q_SG_DECLARADO para siempre preguntar declaraciones.
  Q_SG_ADHERIDO: {
    id: "Q_SG_ADHERIDO",
    sectionKey: "sistema_gestion",
    title: "¿Está adherido a un Sistema de Gestión?",
    type: "single",
    options: [
      { label: "Sí", value: "si", next: "Q_SG_DECLARADO" },
      { label: "No", value: "no", next: "Q_SG_DECLARADO" }, // ← no salta directo a VU‑RETC
    ],
    validate: (a) => (!a.Q_SG_ADHERIDO ? "Selecciona una opción." : null),
  },

  // Después de adherencia, SIEMPRE preguntar si ha declarado; luego pasar a VU‑RETC.
  Q_SG_DECLARADO: {
    id: "Q_SG_DECLARADO",
    sectionKey: "sistema_gestion",
    title: "¿Has realizado declaraciones?",
    type: "single",
    options: [
      { label: "Sí", value: "si", next: "Q_VU_REG" },
      { label: "No", value: "no", next: "Q_VU_REG" },
    ],
    validate: (a) => (!a.Q_SG_DECLARADO ? "Selecciona una opción." : null),
  },

  // ----------------- 4) VU – RETC (sin cambios de lógica) -----------------
  Q_VU_REG: {
    id: "Q_VU_REG",
    sectionKey: "vu_retc",
    title: "¿Estás registrado en Ventanilla Única (RETC)?",
    type: "single",
    options: [
      // Si "Sí", validamos si aperturó sectoriales
      { label: "Sí", value: "si", next: "Q_VU_APERTURA" },
      // Si "No", empresa inicial; preguntamos por encargado y plan
      { label: "No", value: "no", next: "Q_ENCARGADO" },
    ],
    validate: (a) => (!a.Q_VU_REG ? "Selecciona una opción." : null),
  },

  Q_VU_APERTURA: {
    id: "Q_VU_APERTURA",
    sectionKey: "vu_retc",
    title: "¿Has aperturado sectoriales?",
    type: "single",
    options: [
      // Si "Sí", verificamos si ya declaró
      { label: "Sí", value: "si", next: "Q_VU_DECL" },
      // Si "No", empresa en transición; vamos a encargado y plan
      { label: "No", value: "no", next: "Q_ENCARGADO" },
    ],
    validate: (a) => (!a.Q_VU_APERTURA ? "Selecciona una opción." : null),
  },

  Q_VU_DECL: {
    id: "Q_VU_DECL",
    sectionKey: "vu_retc",
    title: "¿Has realizado declaraciones?",
    type: "single",
    options: [
      // Si "Sí", empresa avanzada; pasamos a encargado y plan
      { label: "Sí", value: "si", next: "Q_ENCARGADO" },
      // Si "No", empresa en transición; igualmente a encargado y plan
      { label: "No", value: "no", next: "Q_ENCARGADO" },
    ],
    validate: (a) => (!a.Q_VU_DECL ? "Selecciona una opción." : null),
  },

  Q_ENCARGADO: {
    id: "Q_ENCARGADO",
    sectionKey: "vu_retc",
    title: "¿Tienes un encargado de Cumplimiento REP y/o VU‑RETC?",
    type: "single",
    options: [
      { label: "Sí", value: "si", next: "Q_PLAN" },
      { label: "No", value: "no", next: "Q_PLAN" },
    ],
    validate: (a) => (!a.Q_ENCARGADO ? "Selecciona una opción." : null),
  },

  Q_PLAN: {
    id: "Q_PLAN",
    sectionKey: "vu_retc",
    title: "Selecciona el plan que prefieras",
    type: "single",
    options: [
      { label: "Plan Simple", value: "simple", next: "END" },
      { label: "Plan Pro", value: "pro", next: "END" },
      { label: "Plan Enterprise", value: "enterprise", next: "END" },
    ],
    validate: (a) => (!a.Q_PLAN ? "Debes seleccionar un plan para continuar." : null),
  },

  // ----------------- 5) Medición (placeholder) -----------------
  Q_MEDICION_TODO: {
    id: "Q_MEDICION_TODO",
    sectionKey: "medicion",
    title: "Medición (pendiente de implementación)",
    type: "single",
    options: [
      // Temporalmente cerramos el flujo aquí hasta implementar Medición
      { label: "Continuar más tarde", value: "todo", next: "END" },
    ],
  },

  // ----------------- 6) END -----------------
  END: {
    id: "END",
    sectionKey: "antecedentes",
    title: "Fin",
    type: "single",
    options: [],
  },
};

// Primera pregunta del flujo
export const FIRST_QUESTION: QuestionId = "Q_SIZE";

// -----------------------------------------------------------------------------
// computeOutcome
// Consolida el estado final para un resumen/backend.
// - Calcula "afecta_rep" combinando tamaño, comercialización y 300 kg.
// - Mapea "traz_madurez" desde Q_TRAZ_ESTAND (informativo).
// - Determina "vu_stage" solo si respondieron VU (Q_VU_*).
// - Expone "encargado_flag" y "selected_plan".
// -----------------------------------------------------------------------------
export function computeOutcome(answers: Record<string, string>) {
  // Antecedentes
  const size = answers.Q_SIZE;
  const comercializa = answers.Q_COMERCIALIZA;
  const kg300 = answers.Q_KG300;

  // VU – RETC
  const vu_reg = answers.Q_VU_REG;
  const vu_ap = answers.Q_VU_APERTURA;
  const vu_dec = answers.Q_VU_DECL;
  const encargado = answers.Q_ENCARGADO;
  const plan = answers.Q_PLAN;

  // Trazabilidad (mapeo informativo de madurez)
  const traz_estand = answers.Q_TRAZ_ESTAND ?? null as (string | null);
  let traz_madurez: "Empresa Avanzada" | "Empresa en Transición" | "Empresa Inicial" | null = null;
  if (traz_estand) {
    // Mapeo:
    // - Óptimo, Bueno     => Empresa Avanzada
    // - Regular           => Empresa en Transición
    // - Limitado, Crítico => Empresa Inicial
    if (traz_estand === "optimo" || traz_estand === "bueno") {
      traz_madurez = "Empresa Avanzada";
    } else if (traz_estand === "regular") {
      traz_madurez = "Empresa en Transición";
    } else if (traz_estand === "limitado" || traz_estand === "critico") {
      traz_madurez = "Empresa Inicial";
    }
  }

  // === Afectación Ley REP ===
  // Regla:
  // - Micro => No afecta
  // - Peq/Med/Gran:
  //     - Comercializa = No => No afecta
  //     - Comercializa = Sí:
  //         - kg300 = No => No afecta
  //         - kg300 = Sí => Sí afecta
  //         - kg300 = ns => Indeterminado (deriva a Medición)
  let afecta_rep: "Sí" | "No" | "Indeterminado" = "Indeterminado";
  if (size === "micro") {
    afecta_rep = "No";
  } else if (size === "pequena" || size === "mediana" || size === "grande") {
    if (comercializa === "no") afecta_rep = "No";
    if (comercializa === "si") {
      if (kg300 === "no") afecta_rep = "No";
      if (kg300 === "si") afecta_rep = "Sí";
      if (kg300 === "ns") afecta_rep = "Indeterminado";
    }
  }

  // === Etapa VU (solo si respondieron el subflujo VU) ===
  let vu_stage: "Empresa Inicial" | "Empresa en Transición" | "Empresa Avanzada" | null = null;
  if (vu_reg === "no") vu_stage = "Empresa Inicial";
  if (vu_reg === "si" && vu_ap === "no") vu_stage = "Empresa en Transición";
  if (vu_reg === "si" && vu_ap === "si" && vu_dec === "no") vu_stage = "Empresa en Transición";
  if (vu_reg === "si" && vu_ap === "si" && vu_dec === "si") vu_stage = "Empresa Avanzada";

  // Bandera de encargado y plan seleccionado (para resumen/UI)
  const encargado_flag = encargado ?? null; // "si" | "no" | null
  const selected_plan = plan ?? null;       // "simple" | "pro" | "enterprise" | null

  // Resumen final
  return {
    afecta_rep,
    traz_madurez,   // informativo (derivado desde Q_TRAZ_ESTAND)
    vu_stage,
    encargado_flag,
    selected_plan,
  };
}

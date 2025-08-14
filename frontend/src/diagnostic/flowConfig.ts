// src/diagnostic/flowConfig.ts
// -----------------------------------------------------------------------------
// OBJETIVO (v2):
// 1) Tamaño de empresa (Q_SIZE):
//    - Si "Micro": No afecta REP ⇒ ir a VU-RETC (subflujo Q_VU_*).
//    - Si Pequeña/Mediana/Grande: preguntar "¿Comercializas...?" (Q_COMERCIALIZA).
// 2) Q_COMERCIALIZA:
//    - No ⇒ No afecta REP ⇒ ir a VU-RETC.
//    - Sí ⇒ preguntar 300 kg (Q_KG300).
// 3) Q_KG300:
//    - "No lo sé" ⇒ redirigir a sección Medición (placeholder por ahora).
//    - "No" ⇒ No afecta REP ⇒ ir a VU-RETC.
//    - "Sí" ⇒ Sí afecta REP ⇒ redirigir a Trazabilidad (placeholder por ahora).
// 4) VU-RETC (Q_VU_*), Encargado, Plan (igual a versión anterior)
//
// NOTAS:
// - Mantenemos secciones lógicas (antecedentes, vu_retc, medicion*, trazabilidad*)
//   solo para modularidad interna. Las secciones *medicion y *trazabilidad
//   tienen preguntas "placeholder" para dejar la ruta montada sin implementarlas.
// -----------------------------------------------------------------------------

export type SectionKey = "antecedentes" | "vu_retc" | "medicion" | "trazabilidad";

export type QuestionId =
  // Antecedentes
  | "Q_SIZE"           // ¿Cuál es el tamaño?
  | "Q_COMERCIALIZA"   // ¿Comercializas en Chile productos con envases y embalajes?
  | "Q_KG300"          // ¿Pones en mercado más de 300kg...?
  // VU – RETC
  | "Q_VU_REG"         // ¿Estás registrado en VU-RETC?
  | "Q_VU_APERTURA"    // ¿Has aperturado sectoriales?
  | "Q_VU_DECL"        // ¿Has realizado declaraciones?
  | "Q_ENCARGADO"      // ¿Tienes encargado?
  | "Q_PLAN"           // Selección de plan
  // Placeholders (a implementar luego)
  | "Q_MEDICION_TODO"
  | "Q_TRAZ_TODO"
  // Fin
  | "END";

export const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: "antecedentes", label: "Antecedentes" },
  { key: "vu_retc", label: "VU – RETC" },
  { key: "medicion", label: "Medición" },
  { key: "trazabilidad", label: "Trazabilidad – Línea Base" },
];

// Opción genérica
export type Option = {
  label: string;
  value: string;
  next?: QuestionId | ((answer: string, answers: Record<string, string>) => QuestionId);
};

export type Question = {
  id: QuestionId;
  sectionKey: SectionKey;
  title: string;
  type: "single";
  options?: Option[];
  validate?: (answers: Record<string, string>) => string | null;
};

// -----------------------------------------------------------------------------
// Grafo de preguntas
// -----------------------------------------------------------------------------
export const QUESTIONS: Record<QuestionId, Question> = {
  // ----------------- 1) Antecedentes -----------------
  Q_SIZE: {
    id: "Q_SIZE",
    sectionKey: "antecedentes",
    title: "¿Cuál es el tamaño de tu empresa?",
    type: "single",
    options: [
      // Micro: No afecta REP y sigue por VU-RETC
      { label: "Micro empresa", value: "micro", next: "Q_VU_REG" },
      // Otras: se consulta si comercializa
      { label: "Pequeña empresa", value: "pequena", next: "Q_COMERCIALIZA" },
      { label: "Mediana empresa", value: "mediana", next: "Q_COMERCIALIZA" },
      { label: "Empresa grande", value: "grande", next: "Q_COMERCIALIZA" },
    ],
    validate: (a) => (!a.Q_SIZE ? "Selecciona un tamaño de empresa." : null),
  },

  // ¿Comercializas en Chile productos con envases y embalajes?
  Q_COMERCIALIZA: {
    id: "Q_COMERCIALIZA",
    sectionKey: "antecedentes",
    title: "¿Comercializas en Chile productos con envases y embalajes?",
    type: "single",
    options: [
      // No ⇒ No afecta REP ⇒ VU-RETC
      { label: "No", value: "no", next: "Q_VU_REG" },
      // Sí ⇒ preguntar 300 kg
      { label: "Sí", value: "si", next: "Q_KG300" },
    ],
    validate: (a) => (!a.Q_COMERCIALIZA ? "Selecciona una opción." : null),
  },

  // ¿> 300 kg / año?
  Q_KG300: {
    id: "Q_KG300",
    sectionKey: "antecedentes",
    title: "¿Pones en mercado más de 300 kg/año de envases y embalajes en mercado nacional?",
    type: "single",
    options: [
      // "No lo sé" ⇒ Medición (placeholder por ahora)
      { label: "No lo sé", value: "ns", next: "Q_MEDICION_TODO" },
      // "No" ⇒ No afecta REP ⇒ VU-RETC
      { label: "No", value: "no", next: "Q_VU_REG" },
      // "Sí" ⇒ Sí afecta REP ⇒ Trazabilidad (placeholder por ahora)
      { label: "Sí", value: "si", next: "Q_TRAZ_TODO" },
    ],
    validate: (a) => (!a.Q_KG300 ? "Selecciona una opción." : null),
  },

  // ----------------- 2) VU – RETC (sin cambios) -----------------
  Q_VU_REG: {
    id: "Q_VU_REG",
    sectionKey: "vu_retc",
    title: "¿Estás registrado en Ventanilla Única (RETC)?",
    type: "single",
    options: [
      { label: "Sí", value: "si", next: "Q_VU_APERTURA" },
      { label: "No", value: "no", next: "Q_ENCARGADO" }, // Empresa Inicial
    ],
    validate: (a) => (!a.Q_VU_REG ? "Selecciona una opción." : null),
  },

  Q_VU_APERTURA: {
    id: "Q_VU_APERTURA",
    sectionKey: "vu_retc",
    title: "¿Has aperturado sectoriales?",
    type: "single",
    options: [
      { label: "Sí", value: "si", next: "Q_VU_DECL" },
      { label: "No", value: "no", next: "Q_ENCARGADO" }, // Empresa en Transición
    ],
    validate: (a) => (!a.Q_VU_APERTURA ? "Selecciona una opción." : null),
  },

  Q_VU_DECL: {
    id: "Q_VU_DECL",
    sectionKey: "vu_retc",
    title: "¿Has realizado declaraciones?",
    type: "single",
    options: [
      { label: "Sí", value: "si", next: "Q_ENCARGADO" }, // Empresa Avanzada
      { label: "No", value: "no", next: "Q_ENCARGADO" }, // Empresa en Transición
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

  // ----------------- 3) Placeholders (a implementar luego) -----------------
  Q_MEDICION_TODO: {
    id: "Q_MEDICION_TODO",
    sectionKey: "medicion",
    title: "Medición (pendiente de implementación)",
    type: "single",
    options: [
      // temporal: cerrar el flujo mientras no está implementado
      { label: "Continuar más tarde", value: "todo", next: "END" },
    ],
  },

  Q_TRAZ_TODO: {
    id: "Q_TRAZ_TODO",
    sectionKey: "trazabilidad",
    title: "Trazabilidad – Línea Base (pendiente de implementación)",
    type: "single",
    options: [
      // temporal: cerrar el flujo mientras no está implementado
      { label: "Continuar más tarde", value: "todo", next: "END" },
    ],
  },

  // ----------------- END -----------------
  END: {
    id: "END",
    sectionKey: "antecedentes",
    title: "Fin",
    type: "single",
    options: [],
  },
};

export const FIRST_QUESTION: QuestionId = "Q_SIZE";

// -----------------------------------------------------------------------------
// computeOutcome: consolida estado final para el resumen/backend.
// - Ahora calcula "afecta_rep" con la lógica completa de este tramo.
// - Mantiene la etapa VU si se contestaron esas preguntas.
// -----------------------------------------------------------------------------
export function computeOutcome(answers: Record<string, string>) {
  const size = answers.Q_SIZE;
  const comercializa = answers.Q_COMERCIALIZA;
  const kg300 = answers.Q_KG300;

  // VU
  const vu_reg = answers.Q_VU_REG;
  const vu_ap = answers.Q_VU_APERTURA;
  const vu_dec = answers.Q_VU_DECL;
  const encargado = answers.Q_ENCARGADO;
  const plan = answers.Q_PLAN;

  // === Afectación Ley REP ===
  // Regla:
  // - Micro => No afecta
  // - Peq/Med/Gran:
  //   - Comercializa = No => No afecta
  //   - Comercializa = Sí:
  //       - kg300 = No => No afecta
  //       - kg300 = Sí => Sí afecta
  //       - kg300 = ns => Indeterminado (deriva a Medición)
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

  // === Etapa VU (solo si contestaron parte VU) ===
  let vu_stage: "Empresa Inicial" | "Empresa en Transición" | "Empresa Avanzada" | null = null;
  if (vu_reg === "no") vu_stage = "Empresa Inicial";
  if (vu_reg === "si" && vu_ap === "no") vu_stage = "Empresa en Transición";
  if (vu_reg === "si" && vu_ap === "si" && vu_dec === "no") vu_stage = "Empresa en Transición";
  if (vu_reg === "si" && vu_ap === "si" && vu_dec === "si") vu_stage = "Empresa Avanzada";

  const encargado_flag = encargado ?? null;
  const selected_plan = plan ?? null;

  return { afecta_rep, vu_stage, encargado_flag, selected_plan };
}

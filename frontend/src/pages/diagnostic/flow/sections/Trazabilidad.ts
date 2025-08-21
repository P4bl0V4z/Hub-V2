import { Question, QuestionsMap } from "../types";

export const trazabilidad: QuestionsMap = {
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

  Q_TRAZ_ENCARGADO: {
    id: "Q_TRAZ_ENCARGADO",
    sectionKey: "trazabilidad",
    title: "¿Tienes un encargado de Cumplimiento REP y/o VU‑RETC?",
    type: "single",
    options: [
      { label: "Sí", value: "si", next: "Q_TRAZ_FAMILIAS" },
      { label: "No", value: "no", next: "Q_TRAZ_FAMILIAS" },
    ],
    validate: (a) => (!a.Q_TRAZ_ENCARGADO ? "Selecciona una opción." : null),
  },

  Q_TRAZ_FAMILIAS: {
    id: "Q_TRAZ_FAMILIAS",
    sectionKey: "trazabilidad",
    title: "Amplitud de Familias",
    type: "single",
    options: [
      { label: "1–3 (Básica)",      value: "basica",     next: "Q_TRAZ_LINEAS" },
      { label: "4–10 (Intermedia)", value: "intermedia", next: "Q_TRAZ_LINEAS" },
      { label: "11–20 (Avanzada)",  value: "avanzada",   next: "Q_TRAZ_LINEAS" },
      { label: ">20 (Compleja)",    value: "compleja",   next: "Q_TRAZ_LINEAS" },
    ],
    validate: (a) => (!a.Q_TRAZ_FAMILIAS ? "Selecciona una opción." : null),
  },

  Q_TRAZ_LINEAS: {
    id: "Q_TRAZ_LINEAS",
    sectionKey: "trazabilidad",
    title: "Amplitud de Líneas por Familia",
    type: "single",
    options: [
      { label: "1–5 (Básica)",        value: "basica",     next: "Q_TRAZ_CATEGORIAS" },
      { label: "6–15 (Intermedia)",   value: "intermedia", next: "Q_TRAZ_CATEGORIAS" },
      { label: "16–30 (Avanzada)",    value: "avanzada",   next: "Q_TRAZ_CATEGORIAS" },
      { label: ">30 (Compleja)",      value: "compleja",   next: "Q_TRAZ_CATEGORIAS" },
    ],
    validate: (a) => (!a.Q_TRAZ_LINEAS ? "Selecciona una opción." : null),
  },

  Q_TRAZ_CATEGORIAS: {
    id: "Q_TRAZ_CATEGORIAS",
    sectionKey: "trazabilidad",
    title: "Amplitud de Categorías por Línea/marcas",
    type: "single",
    options: [
      { label: "1–3 (Básica)",        value: "basica",     next: "Q_TRAZ_SKUS" },
      { label: "4–8 (Intermedia)",    value: "intermedia", next: "Q_TRAZ_SKUS" },
      { label: "9–15 (Avanzada)",     value: "avanzada",   next: "Q_TRAZ_SKUS" },
      { label: ">15 (Compleja)",      value: "compleja",   next: "Q_TRAZ_SKUS" },
    ],
    validate: (a) => (!a.Q_TRAZ_CATEGORIAS ? "Selecciona una opción." : null),
  },

  Q_TRAZ_SKUS: {
    id: "Q_TRAZ_SKUS",
    sectionKey: "trazabilidad",
    title: "Amplitud de SKUs por Categoría",
    type: "single",
    options: [
      { label: "1–10 (Básica)",       value: "basica",     next: "Q_TRAZ_NIVELES" },
      { label: "11–50 (Intermedia)",  value: "intermedia", next: "Q_TRAZ_NIVELES" },
      { label: "51–200 (Avanzada)",   value: "avanzada",   next: "Q_TRAZ_NIVELES" },
      { label: ">200 (Compleja)",     value: "compleja",   next: "Q_TRAZ_NIVELES" },
    ],
    validate: (a) => (!a.Q_TRAZ_SKUS ? "Selecciona una opción." : null),
  },

  Q_TRAZ_NIVELES: {
    id: "Q_TRAZ_NIVELES",
    sectionKey: "trazabilidad",
    title: "Profundidad de Niveles",
    type: "single",
    options: [
      { label: "3 niveles (Básica)",        value: "basica",     next: "Q_TRAZ_COMPONENTES" },
      { label: "4–5 niveles (Intermedia)",  value: "intermedia", next: "Q_TRAZ_COMPONENTES" },
      { label: "6–7 niveles (Avanzada)",    value: "avanzada",   next: "Q_TRAZ_COMPONENTES" },
      { label: ">7 niveles (Compleja)",     value: "compleja",   next: "Q_TRAZ_COMPONENTES" },
    ],
    validate: (a) => (!a.Q_TRAZ_NIVELES ? "Selecciona una opción." : null),
  },

  Q_TRAZ_COMPONENTES: {
    id: "Q_TRAZ_COMPONENTES",
    sectionKey: "trazabilidad",
    title: "Complejidad de Componentes (por SKU)",
    type: "single",
    options: [
      { label: "<5 por SKU (Básica)",        value: "basica",     next: "Q_SG_ADHERIDO" },
      { label: "5–15 por SKU (Intermedia)",  value: "intermedia", next: "Q_SG_ADHERIDO" },
      { label: "16–50 por SKU (Avanzada)",   value: "avanzada",   next: "Q_SG_ADHERIDO" },
      { label: ">50 por SKU (Compleja)",     value: "compleja",   next: "Q_SG_ADHERIDO" },
    ],
    validate: (a) => (!a.Q_TRAZ_COMPONENTES ? "Selecciona una opción." : null),
  },
} as QuestionsMap;

// Claves de sección para ordenar/rotular el flujo en la UI
export type SectionKey =
  | "antecedentes"
  | "trazabilidad"
  | "sistema_gestion"
  | "vu_retc"
  | "medicion";

// IDs de preguntas
export type QuestionId =
  // Antecedentes
  | "Q_SIZE"
  | "Q_COMERCIALIZA"
  | "Q_KG300"
  // Trazabilidad – Línea Base
  | "Q_TRAZ_ESTAND"
  | "Q_TRAZ_ENCARGADO"
  | "Q_TRAZ_FAMILIAS"
  | "Q_TRAZ_LINEAS"
  | "Q_TRAZ_CATEGORIAS"
  | "Q_TRAZ_SKUS"
  | "Q_TRAZ_NIVELES"
  | "Q_TRAZ_COMPONENTES"
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

// Tipo exportado para el diccionario de preguntas
export type QuestionsMap = Record<QuestionId, Question>;

// Primera pregunta del flujo (pública)
export const FIRST_QUESTION: QuestionId = "Q_SIZE";

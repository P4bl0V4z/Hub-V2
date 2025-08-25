// Re-export público del flujo completo (API igual a tu archivo original)

export * from "./types";
export * from "./constants";
export { computeOutcome } from "./computeOutcome";

import type { QuestionsMap, QuestionId } from "./types";
import { antecedentes } from "./sections/Antecedentes";
import { trazabilidad } from "./sections/Trazabilidad";
import { sistema_gestion } from "./sections/SistemaGestion";
import { vu_retc } from "./sections/VuRetc";
import { medicion } from "./sections/Medicion";

// Mezcla ordenada de todas las preguntas
export const QUESTIONS: QuestionsMap = {
  ...antecedentes,
  ...trazabilidad,
  ...sistema_gestion,
  ...vu_retc,
  ...medicion,
};

// Para compatibilidad con el consumo actual
export const FIRST_QUESTION: QuestionId = "Q_SIZE";

// src/pages/diagnostic/flow/sections/Medicion.ts
import { QuestionsMap } from "../types";

export const medicion: QuestionsMap = {
  Q_MEDICION_TODO: {
    id: "Q_MEDICION_TODO",
    sectionKey: "medicion",
    title: "Medición",
    type: "single",
    options: [], // no se usa; la UI la pone MedicionCard
  },

  END: {
    id: "END",
    sectionKey: "medicion",
    title: "Fin",
    type: "single",
    options: [],
  },
};
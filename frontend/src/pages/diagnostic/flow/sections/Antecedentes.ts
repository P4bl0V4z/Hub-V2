import { Question, QuestionsMap } from "../types";

export const antecedentes: QuestionsMap = {
  Q_SIZE: {
    id: "Q_SIZE",
    sectionKey: "antecedentes",
    title: "¿Cuál es el tamaño de tu empresa?",
    type: "single",
    options: [
      { label: "Micro empresa", value: "micro", next: "Q_VU_REG" },
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
      { label: "No", value: "no", next: "Q_VU_REG" },
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
      { label: "No lo sé", value: "ns", next: "Q_MEDICION_TODO" },
      { label: "No", value: "no", next: "Q_VU_REG" },
      { label: "Sí", value: "si", next: "Q_TRAZ_ESTAND" },
    ],
    validate: (a) => (!a.Q_KG300 ? "Selecciona una opción." : null),
  },
} as Record<string, Question> as QuestionsMap;

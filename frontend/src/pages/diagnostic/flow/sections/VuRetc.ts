import { QuestionsMap } from "../types";

export const vu_retc: QuestionsMap = {
  Q_VU_REG: {
    id: "Q_VU_REG",
    sectionKey: "vu_retc",
    title: "¿Estás registrado en Ventanilla Única (RETC)?",
    type: "single",
    options: [
      { label: "Sí", value: "si", next: "Q_VU_APERTURA" },
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
      { label: "Sí", value: "si", next: "Q_VU_DECL" },
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
      { label: "Sí", value: "si", next: "Q_ENCARGADO" },
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
};

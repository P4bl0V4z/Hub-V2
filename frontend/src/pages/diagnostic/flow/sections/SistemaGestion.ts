import { QuestionsMap } from "../types";

export const sistema_gestion: QuestionsMap = {
  Q_SG_ADHERIDO: {
    id: "Q_SG_ADHERIDO",
    sectionKey: "sistema_gestion",
    title: "¿Está adherido a un Sistema de Gestión?",
    type: "single",
    options: [
      // Si está adherido, preguntamos por declaraciones
      { label: "Sí", value: "si", next: "Q_SG_DECLARADO" },
      // ⬇️ CAMBIO: si NO está adherido, saltamos directo a VU – RETC
      { label: "No", value: "no", next: "Q_VU_REG" },
    ],
    validate: (a) => (!a.Q_SG_ADHERIDO ? "Selecciona una opción." : null),
  },

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
};

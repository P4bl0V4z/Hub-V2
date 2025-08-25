// src/pages/diagnostic/flow/sections/VuRetc.ts
import { QuestionsMap } from "../types";

/**
 * Sección VU-RETC
 * - Si el usuario ya respondió el encargado en Trazabilidad (Q_TRAZ_ENCARGADO)
 *   o previamente en esta misma sección (Q_ENCARGADO), se salta esa pantalla.
 * - Si no existe respuesta previa, se pregunta Q_ENCARGADO al final.
 */
export const vu_retc: QuestionsMap = {
  Q_VU_REG: {
    id: "Q_VU_REG",
    sectionKey: "vu_retc",
    title: "¿Estás registrado en Ventanilla Única (RETC)?",
    type: "single",
    options: [
      { label: "Sí", value: "si", next: "Q_VU_APERTURA" },
      {
        label: "No",
        value: "no",
        next: (_v, a) => (a.Q_ENCARGADO || a.Q_TRAZ_ENCARGADO) ? "END" : "Q_ENCARGADO",
      },
    ],
    validate: (a) => (!a.Q_VU_REG ? "Selecciona una opción." : null),
  },

  Q_VU_APERTURA: {
    id: "Q_VU_APERTURA",
    sectionKey: "vu_retc",
    title: "¿Abriste el VU-RETC este año?",
    type: "single",
    options: [
      { label: "Sí", value: "si", next: "Q_VU_DECL" },
      { label: "No", value: "no", next: "Q_VU_DECL" },
    ],
    validate: (a) => (!a.Q_VU_APERTURA ? "Selecciona una opción." : null),
  },

  Q_VU_DECL: {
    id: "Q_VU_DECL",
    sectionKey: "vu_retc",
    title: "¿Has realizado declaraciones en VU-RETC?",
    type: "single",
    options: [
      {
        label: "Sí",
        value: "si",
        next: (_v, a) => (a.Q_ENCARGADO || a.Q_TRAZ_ENCARGADO) ? "END" : "Q_ENCARGADO",
      },
      {
        label: "No",
        value: "no",
        next: (_v, a) => (a.Q_ENCARGADO || a.Q_TRAZ_ENCARGADO) ? "END" : "Q_ENCARGADO",
      },
    ],
    validate: (a) => (!a.Q_VU_DECL ? "Selecciona una opción." : null),
  },

  // Solo aparece si NO fue respondida antes (ni en VU ni en Trazabilidad)
  Q_ENCARGADO: {
    id: "Q_ENCARGADO",
    sectionKey: "vu_retc",
    title: "¿Tienes un encargado de Cumplimiento REP y/o VU-RETC?",
    type: "single",
    options: [
      { label: "Sí", value: "si", next: "END" },
      { label: "No", value: "no", next: "END" },
    ],
    validate: (a) => (!a.Q_ENCARGADO ? "Selecciona una opción." : null),
  },
};

export default vu_retc;

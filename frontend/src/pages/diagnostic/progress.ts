// src/pages/diagnostic/progress.ts
export type SectionKey = 'antecedentes'|'medicion'|'trazabilidad'|'gestion'|'vu_retc';
export const DONE_KEY = 'diagnostic_test_done_v1';

const base: Record<SectionKey, boolean> = {
  antecedentes:false, medicion:false, trazabilidad:false, gestion:false, vu_retc:false
};

export const getDone = (): Record<SectionKey, boolean> => {
  try { return { ...base, ...(JSON.parse(localStorage.getItem(DONE_KEY) || '{}')) }; }
  catch { return { ...base }; }
};

export const setDone = (patch: Partial<Record<SectionKey, boolean>>) => {
  const curr = getDone();
  localStorage.setItem(DONE_KEY, JSON.stringify({ ...curr, ...patch }));
};

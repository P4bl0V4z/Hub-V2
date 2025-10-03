/**
 * Define aquí el orden LÓGICO de las preguntas (QIDs) por sección.
 * Ajusta los arrays con tus QIDs reales.
 *
 * Reglas:
 * - Cada QID es un string estable del frontend, ej: "Q_TRAZ_FAMILIAS"
 * - No mezcles IDs numéricos de DB; usa los lógicos del FE.
 * - Evita duplicados (la utilidad ensureUnique() te avisa).
 */

// ====== TRAZABILIDAD ======
export const TRAZ_QIDS: string[] = [
  'Q_TRAZ_ESTAND',
  'Q_TRAZ_ENCARGADO',
  'Q_TRAZ_FAMILIAS',
  'Q_TRAZ_LINEAS',
  'Q_TRAZ_CATEGORIAS',
  'Q_TRAZ_SKUS',
  'Q_TRAZ_NIVELES',
  'Q_TRAZ_COMPONENTES',
];

// ====== SISTEMA DE GESTIÓN ======
export const SG_QIDS: string[] = [
  'Q_SG_ADHERIDO',
  'Q_SG_DECLARADO',
];

// ====== VU / RETC ======
export const VU_RETC_QIDS: string[] = [
  'Q_VU_REG',
  'Q_VU_APERTURA',
  'Q_VU_DECL',
  'Q_ENCARGADO',
];

// ====== ANTECEDENTES ======
export const ANTECEDENTES_QIDS: string[] = [
  'Q_SIZE',
  'Q_COMERCIALIZA',
  'Q_KG300',
];

// ====== MEDICIÓN ======
export const MEDICION_QIDS: string[] = [
  'Q_MEDICION_TODO',
];

// =======================================================
// Armado de ORDER global y utilidades de navegación
// =======================================================

export const ORDER_BY_SECTION: Record<string, string[]> = {
  antecedentes: ANTECEDENTES_QIDS,
  trazabilidad: TRAZ_QIDS,
  sistema_gestion: SG_QIDS,
  vu_retc: VU_RETC_QIDS,
  medicion: MEDICION_QIDS,
};

export const ORDER: string[] = (() => {
  const list: string[] = [];
  for (const key of Object.keys(ORDER_BY_SECTION)) {
    list.push(...ORDER_BY_SECTION[key]);
  }
  return ensureUnique(list);
})();

export const SECTION_TITLES: Record<keyof typeof ORDER_BY_SECTION, string> = {
  antecedentes: 'Antecedentes',
  trazabilidad: 'Trazabilidad',
  sistema_gestion: 'Sistema de Gestión',
  vu_retc: 'VU / RETC',
  medicion: 'Medición',
};

// -------------------- helpers --------------------

function ensureUnique(qids: string[]): string[] {
  const seen = new Set<string>();
  for (const q of qids) {
    if (seen.has(q)) {
      throw new Error(`ORDER contiene QID duplicado: ${q}`);
    }
    seen.add(q);
  }
  return qids;
}

export function getNextQid(order: string[], currentQid?: string): string | undefined {
  if (!order.length) return undefined;
  if (!currentQid) return order[0];
  const i = order.indexOf(currentQid);
  if (i < 0) return order[0];
  return order[i + 1];
}

export function getPrevQid(order: string[], currentQid?: string): string | undefined {
  if (!order.length || !currentQid) return undefined;
  const i = order.indexOf(currentQid);
  if (i <= 0) return undefined;
  return order[i - 1];
}

export function getIndex(order: string[], qid?: string): number {
  return qid ? order.indexOf(qid) : -1;
}

// ========== NUEVAS FUNCIONES PARA AUTOSAVE ==========

export function toProgressFromMap(
  answersMap: Record<string, string>,
  orderedQids: string[],
  currentQid?: string
) {
  const answers = orderedQids
    .filter(qid => answersMap[qid] != null)
    .map(qid => ({
      qid,
      value: answersMap[qid],
      answeredAt: new Date().toISOString(),
    }));

  return {
    version: 'v1',
    currentQid,
    answeredCount: answers.length,
    answers,
  };
}

export async function autosaveProgress(attemptId: number, progress: any) {
  const token = localStorage.getItem('beloop_token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(`http://localhost:3001/api/attempts/${attemptId}/progress`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ progress }),
  });

  if (!response.ok) {
    throw new Error(`Autosave failed: ${response.statusText}`);
  }

  return response.json();
}
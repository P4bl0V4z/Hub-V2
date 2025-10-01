import { z } from 'zod';

export type TestAnswerItem = {
  qid: string;          // ej: "Q_TRAZ_FAMILIAS"
  value: string;        // ej: "intermedia" o JSON stringificado
  answeredAt: string;   // ISO
};

export type TestProgress = {
  version: string;                // "v1"
  currentQid?: string;            // para reanudar
  answeredCount: number;          // para UI
  answers: TestAnswerItem[];      // historial ordenado
  meta?: Record<string, string>;  // opcional, cosas de UI
};

// Zod
export const TestAnswerItemSchema = z.object({
  qid: z.string().min(1),
  value: z.string(),
  answeredAt: z.string().datetime(),
});

export const TestProgressSchema = z.object({
  version: z.string(),
  currentQid: z.string().optional(),
  answeredCount: z.number().int().nonnegative(),
  answers: z.array(TestAnswerItemSchema),
  meta: z.record(z.string(), z.string()).optional(),
});

export function assertIsTestProgress(input: unknown): asserts input is TestProgress {
  TestProgressSchema.parse(input);
}

// === Helpers FE ===
export const isoNow = () => new Date().toISOString();

/**
 * Convierte tu Record<qid, string> a TestProgress (ordenado)
 * - orderedQids define el orden lógico de navegación
 */
export function toProgressFromMap(
  answersMap: Record<string, string>,
  orderedQids: string[],
  currentQid?: string
): TestProgress {
  const answers = orderedQids
    .filter(qid => answersMap[qid] != null)
    .map(qid => ({
      qid,
      value: answersMap[qid],
      answeredAt: isoNow(),
    }));

  const progress: TestProgress = {
    version: 'v1',
    currentQid,
    answeredCount: answers.length,
    answers,
  };

  // validación opcional en FE (detecta formatos inválidos antes de enviar)
  TestProgressSchema.parse(progress);

  return progress;
}

/**
 * Llama a PATCH /api/attempts/:attemptId/progress
 */
export async function autosaveProgress(attemptId: number, progress: TestProgress) {
  const res = await fetch(`/api/attempts/${attemptId}/progress`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ progress }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Autosave failed: ${res.status} ${text}`);
  }
}


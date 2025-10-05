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

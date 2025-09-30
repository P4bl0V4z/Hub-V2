import { z } from 'zod';

export type TestProgress = {
  version: string;
  startedAt?: string;
  currentQuestionId?: number;
  answeredCount: number;
  answers: Array<{
    questionId: number;
    value: unknown;
    answeredAt: string;
  }>;
  meta?: {
    sectionKey?: string;
    lastAutosaveAt?: string;
    [k: string]: unknown;
  };
};

export const TestProgressSchema = z.object({
  version: z.string(),
  startedAt: z.string().datetime().optional(),
  currentQuestionId: z.number().int().optional(),
  answeredCount: z.number().int().nonnegative(),
  answers: z.array(z.object({
    questionId: z.number().int(),
    value: z.unknown(),
    answeredAt: z.string().datetime(),
  })),
  meta: z.object({}).catchall(z.unknown()).optional(),
});

export function assertIsTestProgress(input: unknown): asserts input is TestProgress {
  TestProgressSchema.parse(input);
}

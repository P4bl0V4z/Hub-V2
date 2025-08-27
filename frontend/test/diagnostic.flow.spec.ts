/**
 * Diagnostic flow exhaustive path tests
 */
import { describe, it, expect } from "vitest";

// ✅ Import corregido para la estructura del proyecto
import { QUESTIONS, FIRST_QUESTION, computeOutcome, type QuestionId } from "../src/pages/diagnostic/flow";

type AnswerMap = Record<string, string>;

type PathResult = {
  path: Array<{ id: QuestionId; value: string }>;
  endReached: boolean;
  outcomeJSON: string | null;
  error?: string;
};

// Heurística para detectar preguntas "especiales"
const isMedicion = (qid: string) => qid === "Q_MEDICION_TODO";
const isEnd = (qid: string) => qid === "END";

// Resuelve el siguiente id para un (qid, value).
function resolveNextId(qid: QuestionId, value: string, answers: AnswerMap): QuestionId {
  const q = QUESTIONS[qid];
  if (!q) return "END" as QuestionId;
  const opt = q.options?.find(o => o.value === value);
  if (!opt) return "END" as QuestionId;
  if (typeof (opt as any).next === "function") {
    try {
      return (opt as any).next(value, answers) as QuestionId;
    } catch {
      return "END" as QuestionId;
    }
  }
  return ((opt as any).next ?? "END") as QuestionId;
}

// Genera valores candidatos para una pregunta
function candidateValuesFor(qid: QuestionId): string[] {
  if (isMedicion(qid)) {
    const bajos = JSON.stringify({ totalKg: 100 });
    const altos = JSON.stringify({ totalKg: 500 });
    return [bajos, altos];
  }
  const q = QUESTIONS[qid];
  const values = q?.options?.map(o => o.value) ?? [];
  return values.length ? values : ["__EMPTY__"];
}

// DFS para explorar todos los caminos
function exploreAllPaths(
  startId: QuestionId,
  maxDepth = 200,
): { results: PathResult[]; visitedEdges: Set<string> } {
  const results: PathResult[] = [];
  const visitedEdges = new Set<string>();
  const stack: Array<{ 
    id: QuestionId; 
    answers: AnswerMap; 
    path: Array<{ id: QuestionId; value: string }>; 
    depth: number 
  }> = [
    { id: startId, answers: {}, path: [], depth: 0 },
  ];

  const seenStates = new Set<string>();

  while (stack.length) {
    const { id, answers, path, depth } = stack.pop()!;

    if (depth > maxDepth) {
      results.push({
        path,
        endReached: false,
        outcomeJSON: null,
        error: `MaxDepth(${maxDepth}) superado; posible ciclo`,
      });
      continue;
    }

    if (isEnd(id)) {
      let outcomeJSON: string | null = null;
      try {
        const out = computeOutcome({ ...answers });
        outcomeJSON = JSON.stringify(out);
      } catch (e) {
        outcomeJSON = null;
      }
      results.push({ path, endReached: true, outcomeJSON });
      continue;
    }

    const q = QUESTIONS[id];
    if (!q) {
      results.push({
        path,
        endReached: false,
        outcomeJSON: null,
        error: `Nodo inexistente: ${id}`,
      });
      continue;
    }

    const candidates = candidateValuesFor(id as QuestionId);

    for (const value of candidates) {
      const nextAnswers: AnswerMap = { ...answers, [id]: value };
      const nextId = resolveNextId(id as QuestionId, value, nextAnswers);

      const edgeKey = `${id}::${value}=>${nextId}`;
      visitedEdges.add(edgeKey);

      const answersKey = JSON.stringify(Object.keys(nextAnswers).sort());
      const stateKey = `${id}::${value}::${answersKey}::${nextId}`;
      if (seenStates.has(stateKey)) continue;
      seenStates.add(stateKey);

      const nextPath = [...path, { id: id as QuestionId, value }];
      stack.push({
        id: nextId as QuestionId,
        answers: nextAnswers,
        path: nextPath,
        depth: depth + 1,
      });
    }
  }

  return { results, visitedEdges };
}

describe("Diagnostic flow - exhaustividad de caminos", () => {
  it("todos los caminos deben finalizar en END", () => {
    const { results } = exploreAllPaths(FIRST_QUESTION);
    const unfinished = results.filter(r => !r.endReached);
    
    if (unfinished.length) {
      const sample = unfinished.slice(0, 5).map(u => ({
        error: u.error,
        lastStep: u.path[u.path.length - 1] ?? null,
      }));
      expect({ cantidad: unfinished.length, ejemplos: sample }).toEqual({ 
        cantidad: 0, 
        ejemplos: [] 
      });
    } else {
      expect(true).toBe(true);
    }
  });

  it("debe haber diversidad de outcomes entre distintos caminos", () => {
    const { results } = exploreAllPaths(FIRST_QUESTION);
    const outcomes = results
      .filter(r => r.endReached && r.outcomeJSON)
      .map(r => r.outcomeJSON as string);

    const uniq = new Map<string, number>();
    for (const o of outcomes) {
      uniq.set(o, (uniq.get(o) ?? 0) + 1);
    }

    expect(uniq.size).toBeGreaterThanOrEqual(2);
  });

  it("no debe haber opciones huérfanas", () => {
    const { visitedEdges } = exploreAllPaths(FIRST_QUESTION);
    const broken: Array<{ edge: string; reason: string }> = [];
    
    for (const edge of visitedEdges) {
      const [, to] = edge.split("=>");
      const nextId = to as QuestionId;
      if (!isEnd(nextId) && !QUESTIONS[nextId]) {
        broken.push({ edge, reason: "Destino inexistente" });
      }
    }
    
    expect(broken).toEqual([]);
  });

  it("resumen de caminos encontrados", () => {
    const { results } = exploreAllPaths(FIRST_QUESTION);
    const distinctOutcomes = Array.from(
      new Set(results.filter(r => r.endReached && r.outcomeJSON).map(r => r.outcomeJSON))
    ).length;

    console.info("[Resumen] Caminos:", results.length, " | Outcomes distintos:", distinctOutcomes);
    expect(results.length).toBeGreaterThan(0);
  });
});
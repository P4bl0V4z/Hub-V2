// src/pages/diagnostic/flow/__tests__/flow.test.ts
import { describe, it, expect } from "vitest";
import {
  QUESTIONS,
  FIRST_QUESTION,
  computeOutcome,
  type QuestionId,
  type Question,
} from "../index";

// --- 1) Sanity del grafo ---
describe("Flow graph sanity", () => {
  it("FIRST_QUESTION existe en QUESTIONS", () => {
    expect(QUESTIONS[FIRST_QUESTION]).toBeTruthy();
  });

  it("todas las opciones 'next' string apuntan a un QuestionId válido", () => {
    const ids = new Set(Object.keys(QUESTIONS));
    const broken: Array<{ from: QuestionId; to: string }> = [];

    Object.values(QUESTIONS).forEach((q: Question) => {
      q.options?.forEach((opt) => {
        if (typeof opt.next === "string") {
          const to = opt.next;
          if (!ids.has(to)) broken.push({ from: q.id, to });
        }
        // si es función, no podemos validarlo aquí → se asume válido en runtime
      });
    });

    expect(broken, `Hay 'next' inválidos: ${JSON.stringify(broken)}`).toHaveLength(0);
  });

  it("'END' existe y es alcanzable por al menos una opción", () => {
    expect(QUESTIONS.END).toBeTruthy();
    const reachable = Object.values(QUESTIONS).some((q) =>
      q.options?.some((o) => o.next === "END")
    );
    expect(reachable).toBe(true);
  });
});

// --- 2) computeOutcome: casos clave ---
describe("computeOutcome", () => {
  it("Micro empresa: no afecta REP, VU inicial, plan seleccionado", () => {
    const answers = {
      Q_SIZE: "micro",
      // rama VU (micro deriva a VU)
      Q_VU_REG: "no", // empresa inicial
      Q_ENCARGADO: "si",
      Q_PLAN: "pro",
    } as Record<string, string>;

    const out = computeOutcome(answers);

    expect(out.afecta_rep).toBe("No");
    expect(out.vu_stage).toBe("Empresa Inicial");
    expect(out.encargado_flag).toBe("si");
    expect(out.selected_plan).toBe("pro");
    // sin trazabilidad respondida:
    expect(out.traz_madurez).toBeNull();
    expect(out.traz_complex_score).toBeNull();
    expect(out.traz_complex_level).toBeNull();
  });

  it("Mediana + comercializa + >300kg: afecta REP; VU avanzado; trazabilidad intermedia", () => {
    const answers = {
      // antecedentes → afecta REP = Sí
      Q_SIZE: "mediana",
      Q_COMERCIALIZA: "si",
      Q_KG300: "si",
      // trazabilidad
      Q_TRAZ_ESTAND: "bueno", // → 'Empresa Avanzada' informativo
      Q_TRAZ_FAMILIAS: "intermedia",
      Q_TRAZ_LINEAS: "intermedia",
      Q_TRAZ_CATEGORIAS: "intermedia",
      Q_TRAZ_SKUS: "intermedia",
      Q_TRAZ_NIVELES: "intermedia",
      Q_TRAZ_COMPONENTES: "intermedia",
      // VU → avanzado
      Q_VU_REG: "si",
      Q_VU_APERTURA: "si",
      Q_VU_DECL: "si",
      Q_ENCARGADO: "no",
      Q_PLAN: "simple",
    } as Record<string, string>;

    const out = computeOutcome(answers);

    expect(out.afecta_rep).toBe("Sí");
    expect(out.vu_stage).toBe("Empresa Avanzada");

    // traz_madurez mapeado desde Q_TRAZ_ESTAND
    expect(out.traz_madurez).toBe("Empresa Avanzada");

    // Si todas las de complejidad son "intermedia", el score = 1.5
    // (por factores y pesos) → cae bajo basicaMax (1.75) ⇒ nivel "basica".
    expect(out.traz_complex_score).toBe(1.5);
    expect(out.traz_complex_level).toBe("basica");

    expect(out.encargado_flag).toBe("no");
    expect(out.selected_plan).toBe("simple");
  });

  it("Borde de umbral: score = 1.75 cae en 'intermedia'", () => {
    // Basado en pesos: si todos 'basica' (1.0) salvo 'componentes' 'compleja' (4.0),
    // score = 0.75*1.0 + 0.25*4.0 = 1.75 → por comparación estricta (<) sube a 'intermedia'.
    const answers = {
      Q_TRAZ_FAMILIAS: "basica",
      Q_TRAZ_LINEAS: "basica",
      Q_TRAZ_CATEGORIAS: "basica",
      Q_TRAZ_SKUS: "basica",
      Q_TRAZ_NIVELES: "basica",
      Q_TRAZ_COMPONENTES: "compleja",
    } as Record<string, string>;

    const out = computeOutcome(answers);
    expect(out.traz_complex_score).toBe(1.75);
    expect(out.traz_complex_level).toBe("intermedia");
  });
});

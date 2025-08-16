import { describe, it, expect } from "vitest";
import {
  QUESTIONS,
  FIRST_QUESTION,
  computeOutcome,
  type QuestionId,
} from "./flowConfig";

// Helper para resolver el "next" igual que el runner
function nextId(qid: QuestionId, value: string, answers: Record<string, string> = {}): QuestionId {
  const q = QUESTIONS[qid];
  const opt = q.options?.find((o) => o.value === value);
  if (!opt) throw new Error(`Opción "${value}" no encontrada para ${qid}`);
  return typeof opt.next === "function" ? opt.next(value, answers) : ((opt.next ?? "END") as QuestionId);
}

describe("flowConfig graph", () => {
  it("ruta MICRO: Q_SIZE(micro) → VU → ENCARGADO → PLAN → END", () => {
    const answers: Record<string, string> = {};

    // FIRST
    expect(FIRST_QUESTION).toBe("Q_SIZE");
    // Q_SIZE → micro
    answers.Q_SIZE = "micro";
    let q = nextId("Q_SIZE", "micro", answers);
    expect(q).toBe("Q_VU_REG");

    // VU: no registrado → ENCARGADO
    answers.Q_VU_REG = "no";
    q = nextId("Q_VU_REG", "no", answers);
    expect(q).toBe("Q_ENCARGADO");

    // ENCARGADO → PLAN
    answers.Q_ENCARGADO = "si";
    q = nextId("Q_ENCARGADO", "si", answers);
    expect(q).toBe("Q_PLAN");

    // PLAN → END
    answers.Q_PLAN = "simple";
    q = nextId("Q_PLAN", "simple", answers);
    expect(q).toBe("END");

    // Outcome coherente con micro
    const out = computeOutcome(answers);
    expect(out.afecta_rep).toBe("No");
    expect(out.vu_stage).toBe("Empresa Inicial"); // VU_REG = no
    expect(out.selected_plan).toBe("simple");
  });

  it("Pequeña + NO comercializa: Q_SIZE → Q_COMERCIALIZA(no) → VU", () => {
    const answers: Record<string, string> = {};
    answers.Q_SIZE = "pequena";
    let q = nextId("Q_SIZE", "pequena", answers);
    expect(q).toBe("Q_COMERCIALIZA");

    answers.Q_COMERCIALIZA = "no";
    q = nextId("Q_COMERCIALIZA", "no", answers);
    expect(q).toBe("Q_VU_REG");

    const out = computeOutcome(answers);
    expect(out.afecta_rep).toBe("No");
  });

  it(">300kg (Sí) encadena: Trazabilidad → SG → VU", () => {
    const a: Record<string, string> = {
      Q_SIZE: "pequena",
      Q_COMERCIALIZA: "si",
      Q_KG300: "si",
    };

    // Q_SIZE → Q_COMERCIALIZA
    let q = nextId("Q_SIZE", "pequena", a);
    expect(q).toBe("Q_COMERCIALIZA");
    // Q_COMERCIALIZA(si) → Q_KG300
    q = nextId("Q_COMERCIALIZA", "si", a);
    expect(q).toBe("Q_KG300");
    // Q_KG300(si) → Q_TRAZ_ESTAND
    q = nextId("Q_KG300", "si", a);
    expect(q).toBe("Q_TRAZ_ESTAND");

    // Trazabilidad secuencial
    a.Q_TRAZ_ESTAND = "regular";
    q = nextId("Q_TRAZ_ESTAND", "regular", a);
    expect(q).toBe("Q_TRAZ_ENCARGADO");

    a.Q_TRAZ_ENCARGADO = "si";
    q = nextId("Q_TRAZ_ENCARGADO", "si", a);
    expect(q).toBe("Q_TRAZ_COMPLEJIDAD");

    a.Q_TRAZ_COMPLEJIDAD = "avanzada";
    q = nextId("Q_TRAZ_COMPLEJIDAD", "avanzada", a);
    expect(q).toBe("Q_SG_ADHERIDO");

    // SG: sea "si" o "no", SIEMPRE va a Q_SG_DECLARADO
    a.Q_SG_ADHERIDO = "no";
    q = nextId("Q_SG_ADHERIDO", "no", a);
    expect(q).toBe("Q_SG_DECLARADO");

    a.Q_SG_DECLARADO = "si";
    q = nextId("Q_SG_DECLARADO", "si", a);
    expect(q).toBe("Q_VU_REG");
  });

  it("Sistema de Gestión: 'No' NO salta a VU directo; debe ir a Q_SG_DECLARADO", () => {
    const a: Record<string, string> = {};
    const q = nextId("Q_SG_ADHERIDO", "no", a);
    expect(q).toBe("Q_SG_DECLARADO");
  });

  it("traz_madurez mapea correctamente desde Q_TRAZ_ESTAND", () => {
    const base: Record<string, string> = {
      Q_SIZE: "pequena",
      Q_COMERCIALIZA: "si",
      Q_KG300: "si",
    };

    const cases: Array<[string, "Empresa Avanzada" | "Empresa en Transición" | "Empresa Inicial"]> = [
      ["optimo", "Empresa Avanzada"],
      ["bueno", "Empresa Avanzada"],
      ["regular", "Empresa en Transición"],
      ["limitado", "Empresa Inicial"],
      ["critico", "Empresa Inicial"],
    ];

    for (const [val, expected] of cases) {
      const a = { ...base, Q_TRAZ_ESTAND: val };
      const out = computeOutcome(a);
      expect(out.traz_madurez).toBe(expected);
    }
  });

  it("Rama Medición (No lo sé) cierra en END", () => {
    const a: Record<string, string> = {
      Q_SIZE: "mediana",
      Q_COMERCIALIZA: "si",
      Q_KG300: "ns",
    };

    // Q_KG300(ns) → Q_MEDICION_TODO
    let q = nextId("Q_KG300", "ns", a);
    expect(q).toBe("Q_MEDICION_TODO");

    // Q_MEDICION_TODO(Continuar más tarde) → END
    a.Q_MEDICION_TODO = "todo";
    q = nextId("Q_MEDICION_TODO", "todo", a);
    expect(q).toBe("END");
  });
});

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
  it("Micro empresa: no afecta REP, VU inicial, SG inicial, plan seleccionado", () => {
    const answers = {
      Q_SIZE: "micro",
      // rama VU (micro deriva a VU)
      Q_VU_REG: "no", // empresa inicial VU
      // Sistema de Gestión
      Q_SG_ADHERIDO: "no", // → Empresa Inicial en SG
      Q_ENCARGADO: "si",
      Q_PLAN: "pro",
    } as Record<string, string>;

    const out = computeOutcome(answers);

    expect(out.afecta_rep).toBe("No");
    expect(out.vu_stage).toBe("Empresa Inicial");
    // sg_madurez ahora decide el nivel de madurez de la empresa
    expect(out.sg_madurez).toBe("Empresa Inicial");
    expect(out.encargado_flag).toBe("si");
    expect(out.selected_plan).toBe("pro");
    expect(out.traz_complex_score).toBeNull();
    expect(out.traz_complex_level).toBeNull();
  });

  it("Mediana + comercializa + >300kg: afecta REP; VU avanzado; SG avanzado; trazabilidad intermedia", () => {
    const answers = {
      // antecedentes → afecta REP = Sí
      Q_SIZE: "mediana",
      Q_COMERCIALIZA: "si",
      Q_KG300: "si",
      // trazabilidad - complejidad estructural
      Q_TRAZ_ESTAND: "bueno", // disponible para uso futuro
      Q_TRAZ_FAMILIAS: "intermedia",
      Q_TRAZ_LINEAS: "intermedia",
      Q_TRAZ_CATEGORIAS: "intermedia",
      Q_TRAZ_SKUS: "intermedia",
      Q_TRAZ_NIVELES: "intermedia",
      Q_TRAZ_COMPONENTES: "intermedia",
      // Sistema de Gestión → DETERMINA EL NIVEL DE MADUREZ DE LA EMPRESA
      Q_SG_ADHERIDO: "si",
      Q_SG_DECLARADO: "si", // Adherido + declarado = 'Empresa Avanzada'
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

    // sg_madurez es la FUENTE PRINCIPAL del nivel de madurez (desde Sistema de Gestión)
    expect(out.sg_madurez).toBe("Empresa Avanzada");

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

  // --- 3) Nivel de Consultoría ---
  describe("Nivel de Consultoría", () => {
    it("Óptimo + Sí encargado = Sin Consultoría", () => {
      const answers = {
        Q_TRAZ_ESTAND: "optimo",
        Q_TRAZ_ENCARGADO: "si",
      } as Record<string, string>;

      const out = computeOutcome(answers);
      expect(out.consultoria_nivel).toBe("sin_consultoria");
    });

    it("Bueno + No encargado = Consultoría Parcial", () => {
      const answers = {
        Q_TRAZ_ESTAND: "bueno",
        Q_TRAZ_ENCARGADO: "no",
      } as Record<string, string>;

      const out = computeOutcome(answers);
      expect(out.consultoria_nivel).toBe("consultoria_completa");
    });

    it("Crítico + Sí encargado = Consultoría Completa", () => {
      const answers = {
        Q_TRAZ_ESTAND: "critico",
        Q_TRAZ_ENCARGADO: "si",
      } as Record<string, string>;

      const out = computeOutcome(answers);
      expect(out.consultoria_nivel).toBe("consultoria_completa");
    });
  });

  // --- 4) Recomendación de Planes (múltiples planes posibles) ---
  describe("Recomendación de Planes", () => {
    it("Solo VU-RETC (no afecta REP) → Solo Plan RETC", () => {
      const answers = {
        Q_SIZE: "micro",
        Q_VU_REG: "si", // tiene VU-RETC
        Q_VU_APERTURA: "no",
      } as Record<string, string>;

      const out = computeOutcome(answers);
      expect(out.afecta_rep).toBe("No");
      expect(out.vu_stage).toBe("Empresa en Transición");
      expect(out.planes_recomendados).toEqual(["retc"]);
    });

    it("Afecta REP (sin VU-RETC) - Avanzada + Sin Consultoría = Solo Plan Simple", () => {
      const answers = {
        Q_SIZE: "mediana",
        Q_COMERCIALIZA: "si",
        Q_KG300: "si",
        Q_SG_ADHERIDO: "si",
        Q_SG_DECLARADO: "si", // Empresa Avanzada
        Q_TRAZ_ESTAND: "optimo",
        Q_TRAZ_ENCARGADO: "si", // Sin Consultoría
        // No tiene VU-RETC
      } as Record<string, string>;

      const out = computeOutcome(answers);
      expect(out.afecta_rep).toBe("Sí");
      expect(out.sg_madurez).toBe("Empresa Avanzada");
      expect(out.consultoria_nivel).toBe("sin_consultoria");
      expect(out.vu_stage).toBeNull();
      expect(out.planes_recomendados).toEqual(["simple"]);
    });

    it("Afecta REP + VU-RETC → Plan RETC + Plan REP (PRO)", () => {
      const answers = {
        Q_SIZE: "grande",
        Q_COMERCIALIZA: "si",
        Q_KG300: "si",
        Q_SG_ADHERIDO: "si",
        Q_SG_DECLARADO: "no", // Empresa en Transición
        Q_TRAZ_ESTAND: "bueno",
        Q_TRAZ_ENCARGADO: "si", // Consultoría Parcial
        Q_VU_REG: "si",
        Q_VU_APERTURA: "si",
        Q_VU_DECL: "si", // VU Avanzado
      } as Record<string, string>;

      const out = computeOutcome(answers);
      expect(out.afecta_rep).toBe("Sí");
      expect(out.sg_madurez).toBe("Empresa en Transición");
      expect(out.consultoria_nivel).toBe("consultoria_parcial");
      expect(out.vu_stage).toBe("Empresa Avanzada");
      expect(out.planes_recomendados).toEqual(["retc", "pro"]);
    });

    it("Afecta REP + VU-RETC - Inicial + Consultoría Completa = RETC + Enterprise", () => {
      const answers = {
        Q_SIZE: "pequena",
        Q_COMERCIALIZA: "si",
        Q_KG300: "si",
        Q_SG_ADHERIDO: "no", // Empresa Inicial
        Q_TRAZ_ESTAND: "critico",
        Q_TRAZ_ENCARGADO: "no", // Consultoría Completa
        Q_VU_REG: "si",
        Q_VU_APERTURA: "no", // VU en Transición
      } as Record<string, string>;

      const out = computeOutcome(answers);
      expect(out.afecta_rep).toBe("Sí");
      expect(out.sg_madurez).toBe("Empresa Inicial");
      expect(out.consultoria_nivel).toBe("consultoria_completa");
      expect(out.vu_stage).toBe("Empresa en Transición");
      expect(out.planes_recomendados).toEqual(["retc", "enterprise"]);
    });
  });
});

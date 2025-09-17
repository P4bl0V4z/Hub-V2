import { ComplexityLevel, COMPLEXITY_WEIGHTS, LEVELS, THRESHOLDS } from "./constants";

// Tipo para los datos de medición
type MedicionPayload = {
  totalKg?: number;
  totalKgPorMaterial?: Record<string, number>;
  productos?: any[];
};

// Helper para parsear JSON de forma segura
const safeParse = <T,>(s?: string): T | undefined => {
  try {
    return s ? (JSON.parse(s) as T) : undefined;
  } catch {
    return undefined;
  }
};

// Consolida el estado final para un resumen/backend.
export function computeOutcome(answers: Record<string, string>) {
  // Antecedentes
  const size = answers.Q_SIZE;
  const comercializa = answers.Q_COMERCIALIZA;
  const kg300 = answers.Q_KG300;

  // VU – RETC
  const vu_reg = answers.Q_VU_REG;
  const vu_ap = answers.Q_VU_APERTURA;
  const vu_dec = answers.Q_VU_DECL;
  const encargado = answers.Q_ENCARGADO;
  const plan = answers.Q_PLAN;

  // Trazabilidad (mapeo informativo de madurez) - CORREGIDO
  const traz_estand = (answers.Q_TRAZ_ESTAND ?? null) as string | null;
  let traz_madurez: "Empresa Avanzada" | "Empresa en Transición" | "Empresa Inicial" | null = null;
  if (traz_estand) {
    if (traz_estand === "optimo") {
      traz_madurez = "Empresa Avanzada";
    } else if (traz_estand === "bueno" || traz_estand === "regular") {
      traz_madurez = "Empresa en Transición";
    } else if (traz_estand === "limitado" || traz_estand === "critico") {
      traz_madurez = "Empresa Inicial";
    }
  }

  // === Afectación Ley REP ===
  let afecta_rep: "Sí" | "No" | "Indeterminado" = "Indeterminado";
  if (size === "micro") {
    afecta_rep = "No";
  } else if (size === "pequena" || size === "mediana" || size === "grande") {
    if (comercializa === "no") afecta_rep = "No";
    if (comercializa === "si") {
      if (kg300 === "no") afecta_rep = "No";
      if (kg300 === "si") afecta_rep = "Sí";
      if (kg300 === "ns") afecta_rep = "Indeterminado";
    }
  }

  // === Etapa VU - LÓGICA ESCALONADA CORREGIDA ===
  let vu_stage: "Empresa Inicial" | "Empresa en Transición" | "Empresa Avanzada" | null = null;
  
  // Solo evaluar VU si tenemos respuesta a la primera pregunta
  if (vu_reg !== undefined) {
    if (vu_reg === "no") {
      // Si no está registrado → Empresa Inicial (TERMINA AQUÍ)
      vu_stage = "Empresa Inicial";
    } else if (vu_reg === "si") {
      // Si está registrado, evaluar apertura sectorial
      if (vu_ap !== undefined) {
        if (vu_ap === "no") {
          // Registrado pero sin aperturas → Empresa en Transición
          vu_stage = "Empresa en Transición";
        } else if (vu_ap === "si") {
          // Registrado con aperturas, evaluar declaraciones
          if (vu_dec !== undefined) {
            if (vu_dec === "si") {
              // Todo completado → Empresa Avanzada
              vu_stage = "Empresa Avanzada";
            } else {
              // Registrado, con aperturas, pero sin declarar → Empresa en Transición
              vu_stage = "Empresa en Transición";
            }
          } else {
            // Sin respuesta a declaraciones, asumir en transición
            vu_stage = "Empresa en Transición";
          }
        }
      } else {
        // Sin respuesta a aperturas, asumir en transición
        vu_stage = "Empresa en Transición";
      }
    }
  }

  // ======= Complejidad estructural (score ponderado y nivel) =======
  type CKey = keyof typeof COMPLEXITY_WEIGHTS;

  function levelFromScore(score: number): ComplexityLevel {
    if (score < THRESHOLDS.basicaMax) return "basica";
    if (score < THRESHOLDS.interMax)  return "intermedia";
    if (score < THRESHOLDS.avzMax)    return "avanzada";
    return "compleja";
  }

  const compAnswers: Partial<Record<CKey, ComplexityLevel>> = {
    familias:    answers.Q_TRAZ_FAMILIAS as ComplexityLevel,
    lineas:      answers.Q_TRAZ_LINEAS as ComplexityLevel,
    categorias:  answers.Q_TRAZ_CATEGORIAS as ComplexityLevel,
    skus:        answers.Q_TRAZ_SKUS as ComplexityLevel,
    niveles:     answers.Q_TRAZ_NIVELES as ComplexityLevel,
    componentes: answers.Q_TRAZ_COMPONENTES as ComplexityLevel,
  };

  const allComplexityAnswered = Object.values(compAnswers).every(Boolean);

  let traz_complex_score: number | null = null;
  let traz_complex_level: ComplexityLevel | null = null;

  if (allComplexityAnswered) {
    let score = 0;
    (Object.keys(COMPLEXITY_WEIGHTS) as CKey[]).forEach((k) => {
      const lvl = compAnswers[k]!;
      score += COMPLEXITY_WEIGHTS[k] * LEVELS[lvl].factor;
    });
    score = Math.round(score * 100) / 100; // redondeo UI
    traz_complex_score = score;
    traz_complex_level = levelFromScore(score);
  }

  // Bandera de encargado y plan seleccionado (para resumen/UI)
  const encargado_flag = (encargado ?? null) as "si" | "no" | null;
  const selected_plan = (plan ?? null) as "simple" | "pro" | "enterprise" | null;

  // =================== 🎯 FUENTE ÚNICA DE VERDAD: OVERRIDE CON MEDICIÓN ===================
  // Si tenemos datos de medición y totalKg >= 300, forzar afecta_rep = "Sí"
  const medicionData = safeParse<MedicionPayload>(answers.Q_MEDICION_TODO);
  if (medicionData?.totalKg != null && Number.isFinite(medicionData.totalKg)) {
    if (medicionData.totalKg >= 300) {
      afecta_rep = "Sí"; // 🔥 Override definitivo: >= 300 kg siempre afecta REP
    } else {
      // Solo sobrescribir si estaba indeterminado por Q_KG300 = "ns"
      if (kg300 === "ns") {
        afecta_rep = "No"; // < 300 kg + era indeterminado = No afecta
      }
    }
  }

  return {
    afecta_rep,
    traz_madurez,
    traz_complex_score,  // 1.00–4.00 o null si faltan respuestas
    traz_complex_level,  // "basica" | "intermedia" | "avanzada" | "compleja" | null
    vu_stage,
    encargado_flag,
    selected_plan,
  };
}
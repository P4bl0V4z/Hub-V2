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

  // Sistema de Gestión (clasificación de empresa según adherencia y declaraciones)
  // ESTA ES LA FUENTE PRINCIPAL DEL NIVEL DE MADUREZ
  const sg_adherido = answers.Q_SG_ADHERIDO;
  const sg_declarado = answers.Q_SG_DECLARADO;
  let sg_madurez: "Empresa Avanzada" | "Empresa en Transición" | "Empresa Inicial" | null = null;

  if (sg_adherido !== undefined) {
    if (sg_adherido === "no") {
      // No adherido → Empresa Inicial (TERMINA AQUÍ)
      sg_madurez = "Empresa Inicial";
    } else if (sg_adherido === "si") {
      // Adherido → Revisar si ha declarado
      if (sg_declarado !== undefined) {
        if (sg_declarado === "si") {
          // Adherido y ha declarado → Empresa Avanzada
          sg_madurez = "Empresa Avanzada";
        } else if (sg_declarado === "no") {
          // Adherido pero no ha declarado → Empresa en Transición
          sg_madurez = "Empresa en Transición";
        }
      } else {
        // Sin respuesta a declaraciones, asumir en transición
        sg_madurez = "Empresa en Transición";
      }
    }
  }

  // === Nivel de Consultoría (Trazabilidad) ===
  // Combinación de estandarización + encargado REP
  const traz_estand = answers.Q_TRAZ_ESTAND;
  const traz_encargado = answers.Q_TRAZ_ENCARGADO;

  let consultoria_estand: "sin_consultoria" | "consultoria_parcial" | "consultoria_completa" | null = null;
  let consultoria_encargado: "consultoria_parcial" | "consultoria_completa" | null = null;
  let consultoria_nivel: "sin_consultoria" | "consultoria_parcial" | "consultoria_completa" | null = null;

  // Mapeo de estandarización → nivel de consultoría
  if (traz_estand !== undefined) {
    switch (traz_estand) {
      case "optimo":
        consultoria_estand = "sin_consultoria";
        break;
      case "bueno":
      case "regular":
        consultoria_estand = "consultoria_parcial";
        break;
      case "limitado":
      case "critico":
        consultoria_estand = "consultoria_completa";
        break;
    }
  }

  // Mapeo de encargado → nivel de consultoría
  if (traz_encargado !== undefined) {
    consultoria_encargado = traz_encargado === "si" ? "consultoria_parcial" : "consultoria_completa";
  }

  // Combinación final según tabla de la imagen 3
  if (consultoria_estand !== null && consultoria_encargado !== null) {
    if (consultoria_estand === "sin_consultoria") {
      // Sin Consultoría + Consultoría Parcial = Sin Consultoría
      // Sin Consultoría + Consultoría Completa = Consultoría Parcial
      consultoria_nivel = consultoria_encargado === "consultoria_parcial"
        ? "sin_consultoria"
        : "consultoria_parcial";
    } else if (consultoria_estand === "consultoria_parcial") {
      // Consultoría Parcial + Consultoría Parcial = Consultoría Parcial
      // Consultoría Parcial + Consultoría Completa = Consultoría Completa
      consultoria_nivel = consultoria_encargado === "consultoria_parcial"
        ? "consultoria_parcial"
        : "consultoria_completa";
    } else if (consultoria_estand === "consultoria_completa") {
      // Consultoría Completa + cualquiera = Consultoría Completa
      consultoria_nivel = "consultoria_completa";
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

  // === Recomendación de Planes ===
  // Puede haber múltiples planes recomendados (RETC + un plan REP)
  const planes_recomendados: Array<"retc" | "simple" | "pro" | "enterprise"> = [];

  // 1) Plan RETC: Se recomienda si está sujeto a VU-RETC (independiente de REP)
  if (vu_stage !== null) {
    planes_recomendados.push("retc");
  }

  // 2) Planes REP: Solo si afecta REP
  if (afecta_rep === "Sí" && sg_madurez !== null && consultoria_nivel !== null) {
    let plan_rep: "simple" | "pro" | "enterprise" | null = null;

    if (sg_madurez === "Empresa Avanzada") {
      plan_rep = consultoria_nivel === "sin_consultoria" ? "simple" : "pro";
    } else if (sg_madurez === "Empresa en Transición") {
      if (consultoria_nivel === "sin_consultoria") {
        plan_rep = "simple";
      } else if (consultoria_nivel === "consultoria_parcial") {
        plan_rep = "pro";
      } else if (consultoria_nivel === "consultoria_completa") {
        plan_rep = "enterprise";
      }
    } else if (sg_madurez === "Empresa Inicial") {
      if (consultoria_nivel === "sin_consultoria") {
        plan_rep = "simple";
      } else if (consultoria_nivel === "consultoria_parcial") {
        plan_rep = "pro";
      } else if (consultoria_nivel === "consultoria_completa") {
        plan_rep = "enterprise";
      }
    }

    if (plan_rep) {
      planes_recomendados.push(plan_rep);
    }
  }

  return {
    afecta_rep,
    sg_madurez,  // Clasificación basada en Sistema de Gestión
    consultoria_nivel,  // "sin_consultoria" | "consultoria_parcial" | "consultoria_completa" | null
    planes_recomendados,  // Array de planes: puede incluir RETC + un plan REP
    traz_complex_score,  // 1.00–4.00 o null si faltan respuestas
    traz_complex_level,  // "basica" | "intermedia" | "avanzada" | "compleja" | null
    vu_stage,
    encargado_flag,
    selected_plan,
  };
}
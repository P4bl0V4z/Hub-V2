// src/pages/diagnostic/DiagnosticSummary.tsx
import { useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { QUESTIONS, SECTIONS, computeOutcome } from "./flow";
import { VuRetcCard } from "./components/VuRetcCards";
import { RepCard } from "./components/RepCards";

const STATE_KEY = "dt_state_v3";

// -------------------------------
// Utilidades
// -------------------------------
function safeParse<T>(s?: string): T | undefined {
  try {
    return s ? (JSON.parse(s) as T) : undefined;
  } catch {
    return undefined;
  }
}

type TrazComplexPayload = { score?: number; answered?: number };

const COMPLEXITY_QIDS = [
  "Q_TRAZ_FAMILIAS",
  "Q_TRAZ_LINEAS",
  "Q_TRAZ_CATEGORIAS",
  "Q_TRAZ_SKUS",
  "Q_TRAZ_NIVELES",
  "Q_TRAZ_COMPONENTES",
] as const;

function mapVuStage(stage: string | null): "inicial" | "transicion" | "avanzada" | null {
  if (!stage) return null;
  if (stage === "Empresa Inicial") return "inicial";
  if (stage === "Empresa en Transición") return "transicion";
  if (stage === "Empresa Avanzada") return "avanzada";
  return null;
}

// Determinar estado REP basado en afectación y estandarización
function determineRepStatus(
  afectaRep: "Sí" | "No" | "Indeterminado" | string,
  _trazMadurez: "Empresa Avanzada" | "Empresa en Transición" | "Empresa Inicial" | null,
  trazEstand: "optimo" | "bueno" | "regular" | "limitado" | "critico" | null
): "no_afecto" | "inicial" | "transicion" | "avanzada" {
  // 1) Si NO está afecto → tarjeta 4
  if (afectaRep === "No") return "no_afecto";

  // 2) Si está afecto → mapeo por estandarización
  if (afectaRep === "Sí") {
    switch (trazEstand) {
      case "optimo":
        return "avanzada"; // tarjeta 3 (verde)
      case "bueno":
      case "regular":
        return "transicion"; // tarjeta 2 (amarillo)
      case "limitado":
      case "critico":
        return "inicial"; // tarjeta 1 (rojo)
      default:
        return "inicial"; // prudente si falta dato
    }
  }

  // 3) Indeterminado → prudente
  return "inicial";
}

// Calcular progreso VU-RETC (1/3, 2/3, 3/3)
function calculateVuProgress(vuStage: string | null): number {
  if (!vuStage) return 0;
  switch (vuStage) {
    case "Empresa Inicial":
      return 1;
    case "Empresa en Transición":
      return 2;
    case "Empresa Avanzada":
      return 3;
    default:
      return 0;
  }
}

export default function DiagnosticSummary() {
  // 1) Cargar estado y respuestas
  const state = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STATE_KEY) || "{}");
    } catch {
      return {};
    }
  }, []);
  const answers: Record<string, string> = state?.answers ?? {};

  // 2) Outcome oficial
  const outcome = useMemo(() => computeOutcome(answers), [answers]);

  // 3) Progreso y estados derivados
  const vuProgress = useMemo(() => calculateVuProgress(outcome.vu_stage), [outcome.vu_stage]);
  const vuStage = useMemo(() => mapVuStage(outcome.vu_stage), [outcome.vu_stage]);

  // Normalizamos Q_TRAZ_ESTAND a union válido o null
  const trazEstandNorm = useMemo(() => {
    const raw = (answers.Q_TRAZ_ESTAND ?? "").toLowerCase();
    return (["optimo", "bueno", "regular", "limitado", "critico"].includes(raw)
      ? (raw as "optimo" | "bueno" | "regular" | "limitado" | "critico")
      : null);
  }, [answers.Q_TRAZ_ESTAND]);

  const repStatus = useMemo(
    () => determineRepStatus(outcome.afecta_rep, outcome.traz_madurez, trazEstandNorm),
    [outcome.afecta_rep, outcome.traz_madurez, trazEstandNorm]
  );

  // REP progress (por ahora 0 — se completa en otro módulo)
  const repProgress = 0;

  // 4) Trazabilidad: payload de complejidad
  const trazComplex = useMemo(() => {
    return safeParse<TrazComplexPayload>(answers.Q_TRAZ_COMPLEX);
  }, [answers]);

  // 5) Lista de preguntas para “todo lo demás”
  const qList = useMemo(
    () =>
      Object.values(QUESTIONS)
        .filter((q) => q.id !== "END")
        .filter((q) => !COMPLEXITY_QIDS.includes(q.id as any)),
    []
  );

  const labelFor = (qid: string, val: string) => {
    const q = QUESTIONS[qid as keyof typeof QUESTIONS];
    if (!q) return val || "—";
    const opt = q.options?.find((o) => o.value === val);
    return opt?.label ?? (val ?? "—");
    // Nota: si necesitas uppercasing de algún label, hazlo aquí según qid
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-3xl font-bold">Resumen del Diagnóstico</h1>

          {/* 1) REP — tarjeta con nueva lógica */}
          <RepCard status={repStatus} completedSteps={repProgress} />

          {/* 2) Ventanilla Única – RETC */}
          {vuStage && <VuRetcCard stage={vuStage} completedSteps={vuProgress} />}

          {/* 3) Trazabilidad – Línea Base */}
          <Card>
            <CardHeader>
              <CardTitle>Trazabilidad – Línea Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border p-3 text-sm flex items-center justify-between">
                <div className="font-medium">Puntaje estructural del portafolio</div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {outcome.traz_complex_score !== null ? outcome.traz_complex_score : "—"}
                  </Badge>
                  {typeof trazComplex?.answered === "number" && (
                    <span className="text-xs text-muted-foreground">{trazComplex.answered}/6</span>
                  )}
                </div>
              </div>

              {COMPLEXITY_QIDS.map((qid) => {
                const q = QUESTIONS[qid as keyof typeof QUESTIONS];
                if (!q) return null;
                const val = answers[qid] ?? "—";
                const label = labelFor(qid, val);

                return (
                  <div key={qid} className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground mb-1">
                      {SECTIONS.find((s) => s.key == q.sectionKey)?.label}
                    </div>
                    <div className="text-sm font-medium mb-1">{q.title}</div>
                    <Badge variant="secondary">{label}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* 4) Preguntas y respuestas */}
          <Card>
            <CardHeader>
              <CardTitle>Preguntas y respuestas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {qList.map((q) => {
                const section = SECTIONS.find((s) => s.key == q.sectionKey)?.label;
                const val = answers[q.id] ?? "—";
                let label = labelFor(q.id, val);

                // Extra visual en estandarización usando outcome
                if (q.id === "Q_TRAZ_ESTAND" && val !== "—" && outcome.traz_madurez) {
                  label = `${label} • ${outcome.traz_madurez}`;
                }

                return (
                  <div key={q.id} className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground mb-1">{section}</div>
                    <div className="text-sm font-medium mb-1">{q.title}</div>
                    <Badge variant="secondary">{label}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

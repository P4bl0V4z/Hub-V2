// src/pages/diagnostic/DiagnosticSummary.tsx
// -----------------------------------------------------------------------------
// SUMARIO (v4) — actualizado:
// - "Registro interno": Tarjeta simple de Afectación REP
// - "Ventanilla Única – RETC": Componente VuRetcCard dinámico según estado
// - "Trazabilidad – Línea Base": Muestra PUNTAJE + las 6 respuestas.
// - "Preguntas y respuestas": todo lo demás (excluye las 6 de complejidad).
// -----------------------------------------------------------------------------

import { useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { QUESTIONS, SECTIONS, computeOutcome } from "./flow";
import { VuRetcCard } from "./components/VuRetcCards";

const STATE_KEY = "dt_state_v3";

// Safe parse para JSON guardado en answers
function safeParse<T>(s?: string): T | undefined {
  try { return s ? (JSON.parse(s) as T) : undefined; } catch { return undefined; }
}

type TrazComplexPayload = { score?: number; answered?: number };

// IDs de la Línea Base de Trazabilidad
const COMPLEXITY_QIDS = [
  "Q_TRAZ_FAMILIAS",
  "Q_TRAZ_LINEAS", 
  "Q_TRAZ_CATEGORIAS",
  "Q_TRAZ_SKUS",
  "Q_TRAZ_NIVELES",
  "Q_TRAZ_COMPONENTES",
] as const;

// Mapear resultado de computeOutcome a tipos del componente
function mapVuStage(stage: string | null): "inicial" | "transicion" | "avanzada" | null {
  if (!stage) return null;
  if (stage === "Empresa Inicial") return "inicial";
  if (stage === "Empresa en Transición") return "transicion";
  if (stage === "Empresa Avanzada") return "avanzada";
  return null;
}

export default function DiagnosticSummary() {
  const state = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STATE_KEY) || "{}");
    } catch {
      return {};
    }
  }, []);

  const answers: Record<string, string> = state?.answers ?? {};

  // Usar la lógica oficial de computeOutcome
  const outcome = useMemo(() => computeOutcome(answers), [answers]);

  // Calcular progreso VU-RETC
  const vuProgress = useMemo(() => {
    let completedSteps = 0;
    if (answers.Q_VU_REG === "si") completedSteps++;
    if (answers.Q_VU_APERTURA === "si") completedSteps++;
    if (answers.Q_VU_DECL === "si") completedSteps++;
    return completedSteps;
  }, [answers]);

  // Mapear stage para el componente
  const vuStage = useMemo(() => mapVuStage(outcome.vu_stage), [outcome.vu_stage]);

  // Puntaje de complejidad guardado desde el Runner
  const trazComplex = useMemo(() => {
    return safeParse<TrazComplexPayload>(answers.Q_TRAZ_COMPLEX);
  }, [answers]);

  // Lista de preguntas para "todo lo demás"
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
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-3xl font-bold">Resumen del Diagnóstico</h1>

          {/* 1) Registro interno - Tarjeta simple */}
          <Card>
            <CardHeader>
              <CardTitle>Registro interno</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <div className="text-sm">
                  <div className="mb-1 font-medium">Afectación Ley REP</div>
                  <Badge>{outcome.afecta_rep}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2) Ventanilla Única – RETC - Componente VuRetcCard */}
          {vuStage && (
            <VuRetcCard stage={vuStage} completedSteps={vuProgress} />
          )}

          {/* 3) Trazabilidad – Línea Base */}
          <Card>
            <CardHeader>
              <CardTitle>Trazabilidad – Línea Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Encabezado con puntaje */}
              <div className="rounded-md border p-3 text-sm flex items-center justify-between">
                <div className="font-medium">Puntaje estructural del portafolio</div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {outcome.traz_complex_score !== null ? outcome.traz_complex_score : "—"}
                  </Badge>
                  {typeof trazComplex?.answered === "number" && (
                    <span className="text-xs text-muted-foreground">
                      {trazComplex.answered}/6
                    </span>
                  )}
                </div>
              </div>

              {/* Detalle de las 6 preguntas de complejidad */}
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
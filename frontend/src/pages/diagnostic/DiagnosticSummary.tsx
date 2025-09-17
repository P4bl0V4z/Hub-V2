// src/pages/diagnostic/DiagnosticSummary.tsx
import { useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { QUESTIONS, SECTIONS, computeOutcome } from "./flow";
import { VuRetcCard } from "./components/VuRetcCards";
import { RepCard } from "./components/RepCards";

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

// Mapear resultado de computeOutcome a tipos del componente VU-RETC
function mapVuStage(stage: string | null): "inicial" | "transicion" | "avanzada" | null {
  if (!stage) return null;
  if (stage === "Empresa Inicial") return "inicial";
  if (stage === "Empresa en Transición") return "transicion";
  if (stage === "Empresa Avanzada") return "avanzada";
  return null;
}

// Determinar estado REP basado en afectación y estandarización
function determineRepStatus(afectaRep: string, trazMadurez: string | null, trazEstand: string | null): "no_afecto" | "transicion" | "inicial" {
  console.log('determineRepStatus inputs:', { afectaRep, trazMadurez, trazEstand }); // DEBUG
  
  // Si estandarización es "óptimo" → NO afecto a REP (estado verde)
  if (trazEstand === "optimo") return "no_afecto";
  
  if (afectaRep === "No") return "no_afecto";
  
  if (afectaRep === "Sí") {
    // Si está afecto, revisar la madurez de trazabilidad (estandarización)
    if (trazMadurez === "Empresa en Transición") return "transicion";
    if (trazMadurez === "Empresa Inicial") return "inicial";
    // Si no hay información de madurez o es avanzada, por defecto inicial
    return "inicial";
  }
  
  // Si es indeterminado, mostrar como inicial por precaución
  return "inicial";
}

// Calcular progreso VU-RETC basado en el flujo escalonado
function calculateVuProgress(vuStage: string | null): number {
  if (!vuStage) return 0;
  
  switch (vuStage) {
    case "Empresa Inicial":     return 1; // No registrado → 1/3
    case "Empresa en Transición": return 2; // Registrado pero sin aperturas → 2/3  
    case "Empresa Avanzada":    return 3; // Registrado, con aperturas y declaraciones → 3/3
    default: return 0;
  }
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

  // Calcular progreso VU-RETC basado en el stage (1/3, 2/3, 3/3)
  const vuProgress = useMemo(() => calculateVuProgress(outcome.vu_stage), [outcome.vu_stage]);

  // Calcular progreso REP - SIEMPRE 0 de 5 (se completa en otro módulo)
  const repProgress = 0;

  // Mapear states para los componentes
  const vuStage = useMemo(() => mapVuStage(outcome.vu_stage), [outcome.vu_stage]);
  const repStatus = useMemo(() => determineRepStatus(outcome.afecta_rep, outcome.traz_madurez, answers.Q_TRAZ_ESTAND), [outcome.afecta_rep, outcome.traz_madurez, answers.Q_TRAZ_ESTAND]);

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

          {/* 1) Registro interno - Componente RepCard con nueva lógica */}
          <RepCard status={repStatus} completedSteps={repProgress} />

          {/* 2) Ventanilla Única – RETC - Solo si aplica */}
          {vuStage && (
            <VuRetcCard stage={vuStage} completedSteps={0} />
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
// src/pages/diagnostic/DiagnosticSummary.tsx
// -----------------------------------------------------------------------------
// SUMARIO (v3) — actualizado:
// - "Registro interno": Afectación Ley REP (derivada de respuestas).
// - "Trazabilidad – Línea Base": Muestra PUNTAJE (answers.Q_TRAZ_COMPLEX) + las 6 respuestas.
// - "Preguntas y respuestas": todo lo demás (excluye las 6 de complejidad).
// -----------------------------------------------------------------------------

import { useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { QUESTIONS, SECTIONS } from "./flow";

const STATE_KEY = "dt_state_v3";

// Mapea estandarización → madurez (solo usada para mostrar extra en Q_TRAZ_ESTAND)
function madurezFromEstand(v?: string | null) {
  if (!v) return null;
  if (v === "optimo" || v === "bueno") return "Empresa Avanzada";
  if (v === "regular") return "Empresa en Transición";
  if (v === "limitado" || v === "critico") return "Empresa Inicial";
  return null;
}

// Safe parse para JSON guardado en answers (p.ej. Q_MEDICION_TODO / Q_TRAZ_COMPLEX)
function safeParse<T>(s?: string): T | undefined {
  try { return s ? (JSON.parse(s) as T) : undefined; } catch { return undefined; }
}

type MedicionPayload = { totalKg?: number };
type TrazComplexPayload = { score?: number; answered?: number };

// IDs de la Línea Base de Trazabilidad (familias → componentes)
const COMPLEXITY_QIDS = [
  "Q_TRAZ_FAMILIAS",
  "Q_TRAZ_LINEAS",
  "Q_TRAZ_CATEGORIAS",
  "Q_TRAZ_SKUS",
  "Q_TRAZ_NIVELES",
  "Q_TRAZ_COMPONENTES",
] as const;

export default function DiagnosticSummary() {
  const state = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STATE_KEY) || "{}");
    } catch {
      return {};
    }
  }, []);

  const answers: Record<string, string> = state?.answers ?? {};

  // Afectación REP (derivada de respuestas)
  const repStatus: "Sí" | "No" | "Indeterminado" = useMemo(() => {
    if (answers.Q_SIZE === "micro") return "No";
    const comercializa = answers.Q_COMERCIALIZA;          // "si" | "no"
    const kg300 = answers.Q_KG300;                        // "si" | "no" | "ns"
    const medicion = safeParse<MedicionPayload>(answers.Q_MEDICION_TODO);
    const totalKg = medicion?.totalKg;

    if (comercializa === "no") return "No";
    if (kg300 === "si") return "Sí";
    if (kg300 === "no") return "No";

    if (kg300 === "ns") {
      if (typeof totalKg === "number" && Number.isFinite(totalKg)) {
        return totalKg >= 300 ? "Sí" : "No";
      }
      return "Indeterminado";
    }
    return "Indeterminado";
  }, [answers]);

  // Puntaje de complejidad guardado desde el Runner
  const trazComplex = useMemo(() => {
    return safeParse<TrazComplexPayload>(answers.Q_TRAZ_COMPLEX);
  }, [answers]);

  // Lista de preguntas para "todo lo demás" (excluye las 6 de complejidad y END)
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

          {/* Registro interno: SOLO Afectación Ley REP */}
          <Card>
            <CardHeader>
              <CardTitle>Registro interno</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4">
                <div className="text-sm">
                  <div className="mb-1 font-medium">Afectación Ley REP</div>
                  <Badge>{repStatus}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trazabilidad – Línea Base: puntaje + 6 respuestas */}
          <Card>
            <CardHeader>
              <CardTitle>Trazabilidad – Línea Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Encabezado compacto con puntaje */}
              <div className="rounded-md border p-3 text-sm flex items-center justify-between">
                <div className="font-medium">Puntaje estructural del portafolio</div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {trazComplex?.score !== undefined ? trazComplex.score : "—"}
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

          {/* Preguntas y respuestas — el resto del test */}
          <Card>
            <CardHeader>
              <CardTitle>Preguntas y respuestas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {qList.map((q) => {
                const section = SECTIONS.find((s) => s.key == q.sectionKey)?.label;
                const val = answers[q.id] ?? "—";
                let label = labelFor(q.id, val);

                // Extra visual en estandarización
                if (q.id === "Q_TRAZ_ESTAND" && val !== "—") {
                  const madurez = madurezFromEstand(val);
                  if (madurez) label = `${label} • ${madurez}`;
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

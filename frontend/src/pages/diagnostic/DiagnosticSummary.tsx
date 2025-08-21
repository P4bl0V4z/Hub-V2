// src/pages/diagnostic/DiagnosticSummary.tsx
// -----------------------------------------------------------------------------
// SUMARIO (v3):
// - Lee el estado v3 del diagnóstico.
// - Muestra un "Registro interno" con:
//   * Timestamp de decisión, Afectación REP, Etapa VU, Encargado, Plan,
//     Madurez, Complejidad (nivel + puntaje total).
// - Muestra TODAS las PREGUNTAS y RESPUESTAS en una tarjeta aparte.
//   * Para Q_TRAZ_ESTAND, además del rótulo elegido (Óptimo/Bueno/…),
//     muestra la clasificación de madurez: Empresa Avanzada / en Transición / Inicial.
// -----------------------------------------------------------------------------

import { useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { QUESTIONS, SECTIONS } from "./flow";

const STATE_KEY = "dt_state_v3";

type Outcome = {
  afecta_rep?: "Sí" | "No" | "Indeterminado";
  vu_stage?: string | null;
  encargado_flag?: "si" | "no" | null;
  selected_plan?: "simple" | "pro" | "enterprise" | null;
  traz_madurez?: "Empresa Avanzada" | "Empresa en Transición" | "Empresa Inicial" | null;
  traz_complex_score?: number | null;
  traz_complex_level?: "basica" | "intermedia" | "avanzada" | "compleja" | null;
  decided_at: string;
  tag?: string;
};

// Mapea estandarización → madurez
function madurezFromEstand(v?: string | null) {
  if (!v) return null;
  if (v === "optimo" || v === "bueno") return "Empresa Avanzada";
  if (v === "regular") return "Empresa en Transición";
  if (v === "limitado" || v === "critico") return "Empresa Inicial";
  return null;
}

export default function DiagnosticSummary() {
  const state = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || "{}"); } catch { return {}; }
  }, []);

  const answers: Record<string, string> = state?.answers ?? {};
  const outcomes: Outcome[] = state?.outcomes ?? [];

  const qList = useMemo(
    () => Object.values(QUESTIONS).filter((q) => q.id !== "END"),
    []
  );

  const labelFor = (qid: string, val: string) => {
    const q = QUESTIONS[qid as keyof typeof QUESTIONS];
    if (!q) return val || "—";
    const opt = q.options?.find((o) => o.value === val);
    return opt?.label ?? val ?? "—";
  };

  const prettyYesNo = (v?: "si" | "no" | null) =>
    v == null ? "—" : v === "si" ? "Sí" : "No";

  const prettyPlan = (p?: "simple" | "pro" | "enterprise" | null) => {
    if (!p) return "—";
    if (p === "simple") return "Plan Simple";
    if (p === "pro") return "Plan Pro";
    if (p === "enterprise") return "Plan Enterprise";
    return p;
  };

  const prettyLevel = (lvl?: string | null) => {
    if (!lvl) return "—";
    if (lvl === "basica") return "Básica";
    if (lvl === "intermedia") return "Intermedia";
    if (lvl === "avanzada") return "Avanzada";
    if (lvl === "compleja") return "Compleja";
    return lvl;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-3xl font-bold">Resumen del Diagnóstico</h1>

          {/* Registro interno */}
          <Card>
            <CardHeader><CardTitle>Registro interno</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {outcomes.length === 0 ? (
                <div className="text-sm text-muted-foreground">Sin decisiones registradas aún.</div>
              ) : (
                outcomes.map((o, i) => (
                  <div key={i} className="rounded-md border p-4">
                    <div className="mb-2 text-xs text-muted-foreground">
                      Decidido en:{" "}
                      <span className="font-medium">
                        {o.decided_at ? new Date(o.decided_at).toLocaleString() : "—"}
                      </span>
                      {o.tag ? <span className="ml-2">({o.tag})</span> : null}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="text-sm">
                        <div className="mb-1 font-medium">Afectación Ley REP</div>
                        <Badge>{o.afecta_rep ?? "—"}</Badge>
                      </div>
                      <div className="text-sm">
                        <div className="mb-1 font-medium">Etapa VU</div>
                        <Badge variant="secondary">{o.vu_stage ?? "—"}</Badge>
                      </div>
                      <div className="text-sm">
                        <div className="mb-1 font-medium">Encargado</div>
                        <Badge variant="secondary">{prettyYesNo(o.encargado_flag)}</Badge>
                      </div>
                      <div className="text-sm">
                        <div className="mb-1 font-medium">Plan Seleccionado</div>
                        <Badge variant="secondary">{prettyPlan(o.selected_plan)}</Badge>
                      </div>
                      <div className="text-sm">
                        <div className="mb-1 font-medium">Madurez (Estandarización)</div>
                        <Badge variant="secondary">{o.traz_madurez ?? "—"}</Badge>
                      </div>
                      <div className="text-sm">
                        <div className="mb-1 font-medium">Complejidad Estructural</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{prettyLevel(o.traz_complex_level)}</Badge>
                          <span className="text-muted-foreground text-xs">
                            {o.traz_complex_score != null
                              ? `puntaje total ${o.traz_complex_score.toFixed(2)}`
                              : "puntaje total —"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Preguntas y respuestas */}
          <Card>
            <CardHeader><CardTitle>Preguntas y respuestas</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {qList.map((q) => {
                const section = SECTIONS.find((s) => s.key === q.sectionKey)?.label;
                const val = answers[q.id] ?? "—";
                let label = labelFor(q.id, val);

                // Para Q_TRAZ_ESTAND agregamos la madurez (Avanzada/Transición/Inicial)
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

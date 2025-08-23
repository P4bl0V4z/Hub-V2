// src/pages/diagnostic/DiagnosticSummary.tsx
// -----------------------------------------------------------------------------
// SUMARIO (v3):
// - Lee el estado v3 del diagnóstico.
// - "Registro interno": SOLO muestra si está afecto a la Ley REP (Sí/No/Indeterminado)
//   derivado de:
//     * (NEW) Q_SIZE = "micro" -> No
//     * Q_COMERCIALIZA = "no"  -> No
//     * Q_KG300 = "si"         -> Sí
//     * Q_KG300 = "no"         -> No
//     * Q_KG300 = "ns"         -> usa Medición.totalKg (>300 -> Sí; <=300 -> No; sin datos -> Indeterminado)
// - Muestra TODAS las PREGUNTAS y RESPUESTAS en una tarjeta aparte
//   (para Q_TRAZ_ESTAND agrega la madurez visual).
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

// Safe parse para JSON guardado en answers (p.ej. Q_MEDICION_TODO)
function safeParse<T>(s?: string): T | undefined {
  try { return s ? (JSON.parse(s) as T) : undefined; } catch { return undefined; }
}

type MedicionPayload = { totalKg?: number };

export default function DiagnosticSummary() {
  const state = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STATE_KEY) || "{}");
    } catch {
      return {};
    }
  }, []);

  const answers: Record<string, string> = state?.answers ?? {};

  // Lista plana de preguntas (excluye END)
  const qList = useMemo(
    () => Object.values(QUESTIONS).filter((q) => q.id !== "END"),
    []
  );

  // ---- Derivar Afectación REP SOLO desde respuestas ---------------------------------
  const repStatus: "Sí" | "No" | "Indeterminado" = useMemo(() => {
    // NEW: micro = No afecto (salta todo lo demás)
    if (answers.Q_SIZE === "micro") return "No";

    const comercializa = answers.Q_COMERCIALIZA;          // "si" | "no"
    const kg300 = answers.Q_KG300;                        // "si" | "no" | "ns"
    const medicion = safeParse<MedicionPayload>(answers.Q_MEDICION_TODO);
    const totalKg = medicion?.totalKg;

    // Si NO comercializa, no está afecto
    if (comercializa === "no") return "No";

    // Si sí comercializa:
    if (kg300 === "si") return "Sí";
    if (kg300 === "no") return "No";

    // "No lo sé": usar medición si existe
    if (kg300 === "ns") {
      if (typeof totalKg === "number" && Number.isFinite(totalKg)) {
        return totalKg >= 300 ? "Sí" : "No"; // "más de 300 kg"
      }
      return "Indeterminado";
    }

    // Si aún no respondió esas preguntas
    return "Indeterminado";
  }, [answers]);

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

          {/* Registro interno: SOLO Afectación Ley REP (derivada de respuestas) */}
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

          {/* Preguntas y respuestas */}
          <Card>
            <CardHeader>
              <CardTitle>Preguntas y respuestas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {qList.map((q) => {
                const section = SECTIONS.find((s) => s.key == q.sectionKey)?.label;
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

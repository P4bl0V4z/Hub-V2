// src/pages/diagnostic/DiagnosticSummary.tsx
import { useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { QUESTIONS, SECTIONS } from "../../diagnostic/flowConfig";

const STATE_KEY = "dt_state_v2";

export default function DiagnosticSummary() {
  const state = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || "{}"); } catch { return {}; }
  }, []);

  const answers: Record<string,string> = state?.answers ?? {};
  const outcomes = state?.outcomes ?? [];
  const qList = Object.values(QUESTIONS).filter(q => q.id !== "END");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="text-3xl font-bold">Resumen del Diagnóstico</h1>

          <Card>
            <CardHeader><CardTitle>Respuestas</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {qList.map(q => {
                const section = SECTIONS.find(s => s.key === q.sectionKey)?.label;
                const val = answers[q.id] ?? "—";
                const label = q.options?.find(o => o.value === val)?.label ?? val;
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

          <Card>
            <CardHeader><CardTitle>Registro interno</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {outcomes.length === 0 ? (
                <div className="text-sm text-muted-foreground">Sin decisiones registradas aún.</div>
              ) : outcomes.map((o: any, i: number) => (
                <div key={i} className="rounded-md border p-3 text-sm">
                  <div>Decidido en: <span className="text-muted-foreground">{new Date(o.decided_at).toLocaleString()}</span></div>
                  <div>Afecta a Ley REP: <Badge className="ml-2">{o.afecta_rep}</Badge></div>
                  <div>Sección sugerida: <Badge variant="secondary" className="ml-2">
                    {SECTIONS.find(s => s.key === o.nextSection)?.label ?? "—"}
                  </Badge></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

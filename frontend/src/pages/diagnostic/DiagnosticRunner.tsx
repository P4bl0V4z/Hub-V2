// src/pages/diagnostic/DiagnosticRunner.tsx
// -----------------------------------------------------------------------------
// RUNNER CON SIDEBAR + PORCENTAJE DE AVANCE HACIA "Q_PLAN":
// - Pantalla limpia: título de pregunta, opciones, botón "Siguiente".
// - % muestra cuánto falta para llegar a elegir plan (solo ruta "Micro").
// - Persistencia en localStorage.
// - Botón "Reiniciar" para testear el flujo.
// -----------------------------------------------------------------------------

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Si no tienes estos componentes, sustituye por <div>/<button>
import Sidebar from "../../components/Sidebar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";

import {
  QUESTIONS,
  FIRST_QUESTION,
  type QuestionId,
  type SectionKey,
  computeOutcome,
} from "@/diagnostic/flowConfig"; // ← usa alias @ a src

const STATE_KEY = "dt_state_v2";

// Estado canónico
type State = {
  currentId: QuestionId;
  answers: Record<string, string>;
  sectionDone: Record<SectionKey, boolean>;
  history: QuestionId[];
  finished: boolean;
  outcomes: Array<{
    afecta_rep?: "Sí" | "No" | "Indeterminado";
    vu_stage?: string | null;
    encargado_flag?: string | null;      // "si" | "no" | null
    selected_plan?: string | null;       // "simple" | "pro" | "enterprise" | null
    decided_at: string;
    tag?: string;
  }>;
};

// Helpers de persistencia
function loadState(): State {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch {}
  return {
    currentId: FIRST_QUESTION,
    answers: {},
    // incluye TODAS las secciones actuales del flow
    sectionDone: {
      antecedentes: false,
      trazabilidad: false,
      sistema_gestion: false,
      vu_retc: false,
      medicion: false,
    },
    history: [],
    finished: false,
    outcomes: [],
  };
}
function saveState(s: State) {
  localStorage.setItem(STATE_KEY, JSON.stringify(s));
}

export default function DiagnosticRunner() {
  const navigate = useNavigate();
  const [state, setState] = useState<State>(() => loadState());

  // Persistimos cada cambio
  useEffect(() => { saveState(state); }, [state]);

  // Pregunta actual
  const current = useMemo(() => QUESTIONS[state.currentId], [state.currentId]);

  // ---------------------------------------------------------------------------
  // PROGRESO HACIA Q_PLAN (solo ruta Micro):
  // 1) Q_SIZE (micro) → 2) Q_VU_REG → 3) Q_VU_APERTURA (si aplica)
  // → 4) Q_VU_DECL (si aplica) → 5) Q_ENCARGADO → Q_PLAN
  // ---------------------------------------------------------------------------
  const PLAN_TOTAL_STEPS = 5;
  const progressToPlan = useMemo(() => {
    const a = state.answers;

    if (state.currentId === "Q_PLAN" || state.finished) {
      return { applicable: true, remaining: 0, percent: 100 };
    }
    if (!a.Q_SIZE) return { applicable: true, remaining: PLAN_TOTAL_STEPS, percent: 0 };
    if (a.Q_SIZE !== "micro") return { applicable: false, remaining: 0, percent: 0 };

    let completed = 1; // Q_SIZE (micro)
    if (a.Q_VU_REG) completed += 1;

    if (a.Q_VU_REG === "si") {
      if (a.Q_VU_APERTURA) completed += 1;
      if (a.Q_VU_APERTURA === "si" && a.Q_VU_DECL) completed += 1;
    }
    if (a.Q_ENCARGADO) completed += 1;

    if (completed > PLAN_TOTAL_STEPS) completed = PLAN_TOTAL_STEPS;
    const remaining = PLAN_TOTAL_STEPS - completed;
    const percent = Math.round((completed / PLAN_TOTAL_STEPS) * 100);
    return { applicable: true, remaining, percent };
  }, [state.answers, state.currentId, state.finished]);

  // Validación mínima
  const validationMsg = useMemo(
    () => current?.validate?.(state.answers) ?? null,
    [current, state.answers]
  );

  // Guardar selección
  const handleSelect = (qid: QuestionId, value: string) => {
    setState(s => ({ ...s, answers: { ...s.answers, [qid]: value } }));
  };

  // Decidir siguiente nodo según opción elegida
  const computeNextId = (qid: QuestionId, value: string): QuestionId => {
    const q = QUESTIONS[qid];
    const opt = q.options?.find(o => o.value === value);
    if (!opt) return "END";
    if (typeof opt.next === "function") return opt.next(value, state.answers);
    return (opt.next ?? "END") as QuestionId;
  };

  // Marcar sección como completa si todas sus preguntas están respondidas
  const markSectionIfCompleted = (qid: QuestionId, answers: Record<string,string>) => {
    const section = QUESTIONS[qid].sectionKey;
    const ids = Object.values(QUESTIONS)
      .filter(q => q.sectionKey === section && q.id !== "END")
      .map(q => q.id);
    const allAnswered = ids.every(id => answers[id]);
    return { ...state.sectionDone, [section]: allAnswered };
  };

  // Reiniciar
  const resetAll = () => {
    localStorage.removeItem(STATE_KEY);
    setState({
      currentId: FIRST_QUESTION,
      answers: {},
      sectionDone: {
        antecedentes: false,
        trazabilidad: false,
        sistema_gestion: false,
        vu_retc: false,
        medicion: false,
      },
      history: [],
      finished: false,
      outcomes: [],
    });
  };

  // Siguiente
  const onNext = () => {
    if (current.id === "END") return;
    if (validationMsg) return;

    const qid = current.id;
    const value = state.answers[qid];
    const nextId = computeNextId(qid, value);

    if (nextId === "END") {
      const { afecta_rep, vu_stage, encargado_flag, selected_plan } = computeOutcome({ ...state.answers });
      const finalOutcome = {
        afecta_rep,
        vu_stage,
        encargado_flag,
        selected_plan,
        decided_at: new Date().toISOString(),
        tag: "final",
      };
      const sectionDone = markSectionIfCompleted(qid, state.answers);

      setState(s => ({
        ...s,
        currentId: "END",
        history: [...s.history, qid],
        finished: true,
        outcomes: [...s.outcomes, finalOutcome],
        sectionDone,
      }));
      return;
    }

    const sectionDone = markSectionIfCompleted(qid, state.answers);
    setState(s => ({
      ...s,
      currentId: nextId,
      history: [...s.history, qid],
      sectionDone,
    }));
  };

  // Render pregunta single-choice
  const renderSingle = () => {
    const qid = current.id;
    const selected = state.answers[qid] || "";
    return (
      <RadioGroup
        value={selected}
        onValueChange={(v: any) => handleSelect(qid, v)}
        className="grid gap-3 sm:grid-cols-2"
      >
        {current.options?.map((o) => (
          <Label key={o.value} className="flex cursor-pointer items-center gap-3 rounded-md border p-4">
            <RadioGroupItem value={o.value} /> {o.label}
          </Label>
        ))}
      </RadioGroup>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar conservada */}
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl p-6">
          {/* Encabezado: % a la izquierda + Reiniciar a la derecha */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {progressToPlan.applicable && (
                <div className="min-w-[56px] rounded-md border px-2 py-1 text-center text-xs font-semibold">
                  {progressToPlan.percent}%
                </div>
              )}
            </div>

            <Button variant="outline" size="sm" onClick={resetAll}>
              Reiniciar
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{current.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {current.type === "single" && renderSingle()}
              {validationMsg && <p className="text-sm text-red-600">{validationMsg}</p>}
            </CardContent>

            <CardFooter className="flex justify-end">
              <Button onClick={onNext} disabled={!!validationMsg}>Siguiente</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}

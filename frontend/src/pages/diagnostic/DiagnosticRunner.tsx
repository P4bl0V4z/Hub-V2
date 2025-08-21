// src/pages/diagnostic/DiagnosticRunner.tsx
// (imports y navegación corregidos para el nuevo árbol de rutas)
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import {
  QUESTIONS,
  FIRST_QUESTION,
  type QuestionId,
  type SectionKey,
  computeOutcome,
  LEVELS,
  COMPLEXITY_WEIGHTS,
  type ComplexityLevel,
} from "./flow";

// 👇 Importa la tarjeta única de Medición
import MedicionCard from "./flow/sections/MedicionCard";

const STATE_KEY = "dt_state_v3";
const SUMMARY_PATH = "/diagnostic/summary";

const COMPLEXITY_QIDS: QuestionId[] = [
  "Q_TRAZ_FAMILIAS",
  "Q_TRAZ_LINEAS",
  "Q_TRAZ_CATEGORIAS",
  "Q_TRAZ_SKUS",
  "Q_TRAZ_NIVELES",
  "Q_TRAZ_COMPONENTES",
];

// Mapea cada QuestionId de complejidad a su clave de ponderación
const COMPLEXITY_ID_TO_KEY: Partial<Record<QuestionId, keyof typeof COMPLEXITY_WEIGHTS>> = {
  Q_TRAZ_FAMILIAS: "familias",
  Q_TRAZ_LINEAS: "lineas",
  Q_TRAZ_CATEGORIAS: "categorias",
  Q_TRAZ_SKUS: "skus",
  Q_TRAZ_NIVELES: "niveles",
  Q_TRAZ_COMPONENTES: "componentes",
} as const;

type State = {
  currentId: QuestionId;
  answers: Record<string, string>;
  sectionDone: Record<SectionKey, boolean>;
  history: QuestionId[];
  finished: boolean;
  outcomes: Array<{
    afecta_rep?: "Sí" | "No" | "Indeterminado";
    vu_stage?: string | null;
    encargado_flag?: "si" | "no" | null;
    selected_plan?: "simple" | "pro" | "enterprise" | null;
    traz_madurez?: "Empresa Avanzada" | "Empresa en Transición" | "Empresa Inicial" | null;
    traz_complex_score?: number | null;
    traz_complex_level?: "basica" | "intermedia" | "avanzada" | "compleja" | null;
    decided_at: string;
    tag?: string;
  }>;
};

function loadState(): State {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch {}
  return {
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
  };
}
function saveState(s: State) {
  localStorage.setItem(STATE_KEY, JSON.stringify(s));
}

const publicLabel = (label: string) => label.replace(/\s*\(.*?\)\s*$/, "");
const contiguousAnsweredCount = (answers: Record<string, string>) => {
  let count = 0;
  for (let i = 0; i < COMPLEXITY_QIDS.length; i++) {
    const id = COMPLEXITY_QIDS[i];
    if (!answers[id]) break;
    count++;
  }
  return count;
};

// Helper para parsear JSON guardado en answers
const safeParse = <T,>(s?: string): T | undefined => {
  try {
    return s ? (JSON.parse(s) as T) : undefined;
  } catch {
    return undefined;
  }
};

export default function DiagnosticRunner() {
  const navigate = useNavigate();
  const [state, setState] = useState<State>(() => loadState());
  useEffect(() => {
    saveState(state);
  }, [state]);

  const current = useMemo(() => QUESTIONS[state.currentId], [state.currentId]);

  const PLAN_TOTAL_STEPS = 5;
  const progressToPlan = useMemo(() => {
    const a = state.answers;
    if (state.currentId === "Q_PLAN" || state.finished) return { applicable: true, remaining: 0, percent: 100 };
    if (!a.Q_SIZE) return { applicable: true, remaining: PLAN_TOTAL_STEPS, percent: 0 };
    if (a.Q_SIZE !== "micro") return { applicable: false, remaining: 0, percent: 0 };
    let completed = 1;
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

  const isComplexityScreen = state.currentId === "Q_TRAZ_FAMILIAS";
  const isMedicionScreen = current.sectionKey === "medicion" && current.id === "Q_MEDICION_TODO";

  const validationMsg = useMemo(() => {
    if (isMedicionScreen) return null; // La tarjeta maneja su propia validación
    if (isComplexityScreen) {
      const missing = COMPLEXITY_QIDS.filter((id) => !state.answers[id]);
      return missing.length ? "Responde las 6 preguntas de complejidad." : null;
    }
    return current?.validate?.(state.answers) ?? null;
  }, [current, state.answers, isComplexityScreen, isMedicionScreen]);

  // Puntaje acumulado de complejidad (factor × ponderación) mientras responden
  const complexityAccum = useMemo(() => {
    let total = 0;
    let answered = 0;

    (COMPLEXITY_QIDS as QuestionId[]).forEach((qid) => {
      const val = state.answers[qid] as ComplexityLevel | undefined;
      if (!val) return;
      const factor = LEVELS[val]?.factor ?? 0;
      const wKey = COMPLEXITY_ID_TO_KEY[qid] as keyof typeof COMPLEXITY_WEIGHTS;
      const weight = COMPLEXITY_WEIGHTS[wKey];
      total += factor * weight;
      answered += 1;
    });

    total = Math.round(total * 100) / 100; // redondeo UI
    return { total, answered };
  }, [state.answers]);

  const handleSelect = (qid: QuestionId, value: string) => {
    if (COMPLEXITY_QIDS.includes(qid)) {
      const idx = COMPLEXITY_QIDS.indexOf(qid);
      setState((s) => {
        const nextAnswers = { ...s.answers, [qid]: value };
        for (let i = idx + 1; i < COMPLEXITY_QIDS.length; i++) delete nextAnswers[COMPLEXITY_QIDS[i]];
        return { ...s, answers: nextAnswers };
      });
      return;
    }
    setState((s) => ({ ...s, answers: { ...s.answers, [qid]: value } }));
  };

  const computeNextId = (qid: QuestionId, value: string): QuestionId => {
    // Al salir de la pantalla de complejidad (Q_TRAZ_FAMILIAS) saltamos a SG
    if (qid === "Q_TRAZ_FAMILIAS") return "Q_SG_ADHERIDO";
    const q = QUESTIONS[qid];
    const opt = q.options?.find((o) => o.value === value);
    if (!opt) return "END";
    if (typeof opt.next === "function") return opt.next(value, state.answers);
    return (opt.next ?? "END") as QuestionId;
  };

  // ⬇️ Ajuste para considerar completa la sección si se salta Q_SG_DECLARADO
  const markSectionIfCompleted = (qid: QuestionId, answers: Record<string, string>) => {
    const section = QUESTIONS[qid].sectionKey;
    let ids = Object.values(QUESTIONS)
      .filter((q) => q.sectionKey === section && q.id !== "END")
      .map((q) => q.id as QuestionId);

    // Si en Sistema de Gestión respondió "no" en Q_SG_ADHERIDO, no exigimos Q_SG_DECLARADO
    if (section === "sistema_gestion" && answers.Q_SG_ADHERIDO === "no") {
      ids = ids.filter((id) => id !== "Q_SG_DECLARADO");
    }

    const allAnswered = ids.every((id) => answers[id]);
    return { ...state.sectionDone, [section]: allAnswered };
  };

  const resetAll = () => {
    localStorage.removeItem(STATE_KEY);
    setState(loadState());
  };

  const onNext = () => {
    if (isMedicionScreen) return; // La tarjeta propia hace submit y navegación
    if (current.id === "END") return;
    if (validationMsg) return;

    const qid = current.id;
    const value = state.answers[qid];
    const nextId = computeNextId(qid, value);

    if (nextId === "END") {
      const {
        afecta_rep,
        vu_stage,
        encargado_flag,
        selected_plan,
        traz_madurez,
        traz_complex_score,
        traz_complex_level,
      } = computeOutcome({ ...state.answers });

      const finalOutcome = {
        afecta_rep,
        vu_stage,
        encargado_flag,
        selected_plan,
        traz_madurez,
        traz_complex_score,
        traz_complex_level,
        decided_at: new Date().toISOString(),
        tag: "final",
      };
      const sectionDone = markSectionIfCompleted(qid, state.answers);

      setState((s) => ({
        ...s,
        currentId: "END",
        history: [...s.history, qid],
        finished: true,
        outcomes: [...s.outcomes, finalOutcome],
        sectionDone,
      }));

      setTimeout(() => navigate(SUMMARY_PATH), 0);
      return;
    }

    const sectionDone = markSectionIfCompleted(qid, state.answers);
    setState((s) => ({
      ...s,
      currentId: nextId,
      history: [...s.history, qid],
      sectionDone,
    }));
  };

  const renderSingle = () => {
    const qid = current.id;
    const selected = state.answers[qid] || "";
    return (
      <RadioGroup value={selected} onValueChange={(v: any) => handleSelect(qid, v)} className="grid gap-3 sm:grid-cols-2">
        {current.options?.map((o) => (
          <Label key={o.value} className="flex cursor-pointer items-center gap-3 rounded-md border p-4">
            <RadioGroupItem value={o.value} /> {o.label}
          </Label>
        ))}
      </RadioGroup>
    );
  };

  const renderComplexityGroup = () => {
    const items = COMPLEXITY_QIDS.map((id) => ({
      id,
      title: QUESTIONS[id].title,
      options: (QUESTIONS[id].options ?? []).map((o) => ({ label: publicLabel(o.label), value: o.value })),
    }));
    const answered = contiguousAnsweredCount(state.answers);

    return (
      <div className="space-y-3">
        <div className="rounded-xl border">
          <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center justify-between">
            <span>Trazabilidad – Línea Base</span>
            <div className="flex items-center gap-3">
              <span className="text-[10px]">Completado {answered}/{items.length}</span>
              <span className="text-[10px]">Puntaje acumulado: {complexityAccum.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="px-4 pb-2">
            <div className="text-base font-extrabold">¿Qué nivel de complejidad tiene tu portafolio de productos en la empresa?</div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto px-4 pb-4 pr-2 space-y-3">
            {items.map(({ id, title, options }, idx) => {
              const selected = state.answers[id] || "";
              const isEnabled = idx === 0 || Boolean(state.answers[COMPLEXITY_QIDS[idx - 1]]);
              return (
                <div key={id} className={`rounded-lg border p-3 ${isEnabled ? "bg-muted/30" : "bg-muted/60 opacity-70"}`}>
                  <div className="mb-2 text-sm font-semibold">
                    {title}
                    {!isEnabled && <span className="ml-2 text-[10px] text-muted-foreground">(bloqueada)</span>}
                  </div>

                  <RadioGroup
                    value={selected}
                    onValueChange={(v: any) => isEnabled && handleSelect(id, v)}
                    className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                  >
                    {options.map((o) => (
                      <Label
                        key={o.value}
                        className={`flex items-center justify-center rounded-md border px-3 py-2 text-sm ${
                          isEnabled ? "cursor-pointer" : "cursor-not-allowed"
                        } ${selected === o.value ? "ring-2 ring-primary border-transparent" : ""}`}
                        aria-disabled={!isEnabled}
                      >
                        <RadioGroupItem value={o.value} className="sr-only" disabled={!isEnabled} />
                        {o.label}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl p-6">
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
              <CardTitle>
                {isComplexityScreen ? "Complejidad Estructural del Portafolio" : current.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {isMedicionScreen ? (
                <MedicionCard
                  initialValue={safeParse(state.answers.Q_MEDICION_TODO)}
                  onSubmit={(payload) => {
                    const qid: QuestionId = "Q_MEDICION_TODO";
                    const nextAnswers = { ...state.answers, [qid]: JSON.stringify(payload) };

                    const {
                      afecta_rep,
                      vu_stage,
                      encargado_flag,
                      selected_plan,
                      traz_madurez,
                      traz_complex_score,
                      traz_complex_level,
                    } = computeOutcome({ ...nextAnswers });

                    const finalOutcome = {
                      afecta_rep,
                      vu_stage,
                      encargado_flag,
                      selected_plan,
                      traz_madurez,
                      traz_complex_score,
                      traz_complex_level,
                      decided_at: new Date().toISOString(),
                      tag: "final",
                    };

                    const sectionDone = markSectionIfCompleted(qid, nextAnswers);

                    setState((s) => ({
                      ...s,
                      answers: nextAnswers,
                      currentId: "END",
                      history: [...s.history, qid],
                      finished: true,
                      outcomes: [...s.outcomes, finalOutcome],
                      sectionDone,
                    }));

                    setTimeout(() => navigate(SUMMARY_PATH), 0);
                  }}
                />
              ) : isComplexityScreen ? (
                renderComplexityGroup()
              ) : (
                current.type === "single" && renderSingle()
              )}

              {!isMedicionScreen && validationMsg && (
                <p className="text-sm text-red-600">{validationMsg}</p>
              )}
            </CardContent>

            {!isMedicionScreen && (
              <CardFooter className="flex justify-end">
                <Button onClick={onNext} disabled={!!validationMsg}>
                  Siguiente
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

// src/pages/diagnostic/DiagnosticRunner.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { InfoCard } from "@/components/InfoCard";
import { getQuestionInfo } from "./flow/infoContent";
import { X } from 'lucide-react';

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

import MedicionCard from "./flow/sections/MedicionCard";
import { toProgressFromMap, autosaveProgress } from "./ORDER";

const STATE_KEY = "dt_state_v3";
const SUMMARY_PATH = "/diagnostic/summary";
const KEY_TRAZ_COMPLEX = "Q_TRAZ_COMPLEX";

const COMPLEXITY_QIDS: QuestionId[] = [
  "Q_TRAZ_FAMILIAS",
  "Q_TRAZ_LINEAS",
  "Q_TRAZ_CATEGORIAS",
  "Q_TRAZ_SKUS",
  "Q_TRAZ_NIVELES",
  "Q_TRAZ_COMPONENTES",
];

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
  attemptId?: number | null;
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
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);

  // Resetear estado si el localStorage está vacío (nuevo test)
  useEffect(() => {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) {
      setState(loadState());
    }
  }, []);

  // Inicializar intento al montar el componente
  useEffect(() => {
    const initAttempt = async () => {
      try {
        const token = localStorage.getItem('beloop_token');
        if (!token) {
          console.error('✗ No hay token de autenticación');
          return;
        }

        const response = await fetch('http://localhost:3001/api/tests/auto/attempts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✓ Intento iniciado/reanudado:', data);
        setAttemptId(data.id);

        // Guardar attemptId en el state para que esté disponible en DiagnosticSummary
        setState(prev => ({ ...prev, attemptId: data.id }));

        // Solo rehidratar si hay localStorage con estado
        // Si el localStorage está vacío, significa que es un nuevo test
        const hasLocalStorage = localStorage.getItem(STATE_KEY);

        if (hasLocalStorage && data.progress?.answers?.length > 0) {
          const answersMap: Record<string, string> = {};
          data.progress.answers.forEach((a: any) => {
            answersMap[a.qid] = a.value;
          });

          // Reconstruir historial desde las respuestas guardadas
          const orderedQids = Object.values(QUESTIONS)
            .filter(q => q.id !== 'END')
            .map(q => q.id as QuestionId);

          const history = orderedQids.filter(qid => answersMap[qid]);

          setState(prev => ({
            ...prev,
            answers: answersMap,
            currentId: data.progress.currentQid || FIRST_QUESTION,
            history: history,
          }));

          console.log('✓ Progreso rehidratado desde backend:', {
            respuestas: Object.keys(answersMap).length,
            preguntaActual: data.progress.currentQid,
          });
        } else {
          console.log('✓ Nuevo test iniciado (no hay progreso previo a rehidratar)');
        }
      } catch (error) {
        console.error('✗ Error al iniciar intento:', error);
      }
    };

    initAttempt();
  }, []);
  
  // Guardar en localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Autosave al backend
  useEffect(() => {
    if (!attemptId) return;
    
    const orderedQids = Object.values(QUESTIONS)
      .filter(q => q.id !== 'END')
      .map(q => q.id as QuestionId);
    
    const progress = toProgressFromMap(state.answers, orderedQids, state.currentId);
    
    autosaveProgress(attemptId, progress)
      .then(() => console.log('✓ Autosave exitoso'))
      .catch(err => console.error('✗ Error autosave:', err));
      
  }, [attemptId, state.answers, state.currentId]);

  useEffect(() => {
    setShowInfoCard(false);
  }, [state.currentId]);

  // Redirigir automáticamente si llegamos a END (ya está finished)
  useEffect(() => {
    if (state.currentId === "END" && state.finished) {
      navigate(SUMMARY_PATH);
    }
  }, [state.currentId, state.finished, navigate]);

  const current = useMemo(() => QUESTIONS[state.currentId], [state.currentId]);
  const questionInfo = useMemo(() => getQuestionInfo(state.currentId), [state.currentId]);

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
    
    const hasEncargado = (a: Record<string, string>) =>
      Boolean(a.Q_ENCARGADO || a.Q_TRAZ_ENCARGADO);

    if (hasEncargado(a)) completed += 1;
    if (completed > PLAN_TOTAL_STEPS) completed = PLAN_TOTAL_STEPS;
    
    const remaining = PLAN_TOTAL_STEPS - completed;
    const percent = Math.round((completed / PLAN_TOTAL_STEPS) * 100);
    return { applicable: true, remaining, percent };
  }, [state.answers, state.currentId, state.finished]);

  const isComplexityScreen = state.currentId === "Q_TRAZ_FAMILIAS";
  const isMedicionScreen = current.sectionKey === "medicion" && current.id === "Q_MEDICION_TODO";

  const validationMsg = useMemo(() => {
    if (isMedicionScreen) return null;
    if (isComplexityScreen) {
      const missing = COMPLEXITY_QIDS.filter((id) => !state.answers[id]);
      return missing.length ? "Responde las 6 preguntas de complejidad." : null;
    }
    return current?.validate?.(state.answers) ?? null;
  }, [current, state.answers, isComplexityScreen, isMedicionScreen]);

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

    total = Math.round(total * 100) / 100;
    return { total, answered };
  }, [state.answers]);

  const handleSelect = (qid: QuestionId, value: string) => {
    if (COMPLEXITY_QIDS.includes(qid)) {
      const idx = COMPLEXITY_QIDS.indexOf(qid);
      setState((s) => {
        const nextAnswers = { ...s.answers, [qid]: value };
        for (let i = idx + 1; i < COMPLEXITY_QIDS.length; i++) {
          delete nextAnswers[COMPLEXITY_QIDS[i]];
        }
        return { ...s, answers: nextAnswers };
      });
      return;
    }

    setState((s) => {
      const nextAnswers: Record<string, string> = { ...s.answers, [qid]: value };
      if (qid === "Q_TRAZ_ENCARGADO" && !nextAnswers.Q_ENCARGADO) {
        nextAnswers.Q_ENCARGADO = value;
      }
      return { ...s, answers: nextAnswers };
    });
  };

  const computeNextId = (qid: QuestionId, value: string): QuestionId => {
    if (qid === "Q_TRAZ_FAMILIAS") return "Q_SG_ADHERIDO";
    const q = QUESTIONS[qid];
    const opt = q.options?.find((o) => o.value === value);
    if (!opt) return "END";
    if (typeof opt.next === "function") return opt.next(value, state.answers);
    return (opt.next ?? "END") as QuestionId;
  };

  const markSectionIfCompleted = (qid: QuestionId, answers: Record<string, string>) => {
    const section = QUESTIONS[qid].sectionKey;
    let ids = Object.values(QUESTIONS)
      .filter((q) => q.sectionKey === section && q.id !== "END")
      .map((q) => q.id as QuestionId);

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

  const onBack = () => {
    if (state.history.length === 0) return;

    const previousId = state.history[state.history.length - 1];
    const newHistory = state.history.slice(0, -1);

    setState((s) => ({
      ...s,
      currentId: previousId,
      history: newHistory,
    }));
  };

  const canGoBack = state.history.length > 0 && !isMedicionScreen;

  const onNext = () => {
    if (isMedicionScreen) return;
    if (current.id === "END") return;
    if (validationMsg) return;

    const qid = current.id;
    const value = state.answers[qid];

    if (qid === "Q_TRAZ_FAMILIAS") {
      setState((s) => {
        const answersWithScore = {
          ...s.answers,
          [KEY_TRAZ_COMPLEX]: JSON.stringify({
            score: complexityAccum.total,
            answered: complexityAccum.answered,
          }),
        };

        const nextId = computeNextId(qid, value);
        const sectionDone = markSectionIfCompleted(qid, answersWithScore);

        return {
          ...s,
          answers: answersWithScore,
          currentId: nextId,
          history: [...s.history, qid],
          sectionDone,
        };
      });
      return;
    }

    const nextId = computeNextId(qid, value);

    if (nextId === "END") {
      const finalOutcome = {
        ...computeOutcome({ ...state.answers }),
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

      // Completar intento en el backend (la navegación la maneja el useEffect)
      const completeBackendAttempt = async () => {
        if (!attemptId) {
          console.warn('⚠ No hay attemptId, no se puede completar en backend');
          return;
        }

        try {
          const token = localStorage.getItem('beloop_token');
          if (!token) {
            console.error('✗ No hay token de autenticación');
            return;
          }

          const response = await fetch(`http://localhost:3001/api/attempts/${attemptId}/complete`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          console.log('✓ Intento completado en backend');
        } catch (error) {
          console.error('✗ Error al completar intento:', error);
        }
      };

      completeBackendAttempt();
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
      <div className={`mx-auto p-6 ${questionInfo && showInfoCard ? 'max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6' : 'max-w-2xl flex flex-col items-center'}`}>
        <div className={`w-full ${questionInfo && showInfoCard ? '' : 'max-w-xl'}`}>
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

          <Card className={`${questionInfo  ? 'mt-16' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span>
                  {isComplexityScreen ? "Complejidad Estructural del Portafolio" : current.title}
                </span>
                {questionInfo && (
                  <InfoCard 
                    isOpen={showInfoCard}
                    onToggle={() => setShowInfoCard(!showInfoCard)}
                  />
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {isMedicionScreen ? (
                <MedicionCard
                  initialValue={safeParse(state.answers.Q_MEDICION_TODO)}
                  onSubmit={(payload) => {
                    const qid: QuestionId = "Q_MEDICION_TODO";
                    const nextAnswers = { ...state.answers, [qid]: JSON.stringify(payload) };

                    const outcome = {
                      ...computeOutcome({ ...nextAnswers }),
                      decided_at: new Date().toISOString(),
                      tag: "medicion" as const,
                    };

                    const toTraz = (payload?.totalKg ?? 0) >= 300;
                    const cleaned = { ...nextAnswers };
                    
                    if (toTraz) {
                      const TRAZ_QIDS: QuestionId[] = [
                        "Q_TRAZ_ESTAND",
                        "Q_TRAZ_ENCARGADO",
                        "Q_TRAZ_FAMILIAS",
                        "Q_TRAZ_LINEAS",
                        "Q_TRAZ_CATEGORIAS",
                        "Q_TRAZ_SKUS",
                        "Q_TRAZ_NIVELES",
                        "Q_TRAZ_COMPONENTES",
                      ];
                      TRAZ_QIDS.forEach((id) => delete (cleaned as any)[id]);

                      setState((s) => ({
                        ...s,
                        answers: cleaned,
                        currentId: "Q_TRAZ_ESTAND",
                        history: [...s.history, qid],
                        finished: false,
                        outcomes: [...s.outcomes, outcome],
                        sectionDone: { ...s.sectionDone, trazabilidad: false },
                      }));
                    } else {
                      const VU_IDS: QuestionId[] = ["Q_VU_REG", "Q_VU_APERTURA", "Q_VU_DECL"];
                      VU_IDS.forEach((id) => delete (cleaned as any)[id]);

                      setState((s) => ({
                        ...s,
                        answers: cleaned,
                        currentId: "Q_VU_REG",
                        history: [...s.history, qid],
                        finished: false,
                        outcomes: [...s.outcomes, outcome],
                        sectionDone: { ...s.sectionDone, vu_retc: false },
                      }));
                    }
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
              <CardFooter className="flex justify-between">
                <Button
                  onClick={onBack}
                  disabled={!canGoBack}
                  variant="outline"
                >
                  Volver atrás
                </Button>
                <Button onClick={onNext} disabled={!!validationMsg}>
                  Siguiente
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {questionInfo && showInfoCard && (
          <Card className={`h-fit ${questionInfo && !isComplexityScreen ? 'mt-16' : ''}`}>
            <CardContent className="p-4 relative">
              <button
                onClick={() => setShowInfoCard(false)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cerrar"
                type="button"
              >
                <X size={16} className="text-gray-500" />
              </button>
              
              <div className="pr-6 text-sm text-gray-700 leading-relaxed">
                {questionInfo}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  </div>
 );
}
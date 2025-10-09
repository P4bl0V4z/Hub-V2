// src/pages/diagnostic/DiagnosticSummary.tsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { QUESTIONS, SECTIONS, computeOutcome } from "./flow";
import { VuRetcCard } from "./components/VuRetcCards";
import { RepCard } from "./components/RepCards";
import { RotateCcw, CheckCircle } from "lucide-react";

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

// Determinar estado REP basado en afectación y madurez de Sistema de Gestión
function determineRepStatus(
  afectaRep: "Sí" | "No" | "Indeterminado" | string,
  sgMadurez: "Empresa Avanzada" | "Empresa en Transición" | "Empresa Inicial" | null
): "no_afecto" | "inicial" | "transicion" | "avanzada" {
  // 1) Si NO está afecto → tarjeta 4
  if (afectaRep === "No") return "no_afecto";

  // 2) Si está afecto → mapeo por madurez de Sistema de Gestión
  if (afectaRep === "Sí") {
    switch (sgMadurez) {
      case "Empresa Avanzada":
        return "avanzada"; // tarjeta 3 (verde)
      case "Empresa en Transición":
        return "transicion"; // tarjeta 2 (amarillo)
      case "Empresa Inicial":
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
  const navigate = useNavigate();
  const [showNewTestDialog, setShowNewTestDialog] = useState(false);
  const [activeView, setActiveView] = useState<"resultados" | "soluciones">("resultados");
  const [showAllPlans, setShowAllPlans] = useState(false);

  // 1) Cargar estado y respuestas
  const state = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(STATE_KEY) || "{}");
    } catch {
      return {};
    }
  }, []);
  const answers: Record<string, string> = state?.answers ?? {};

  // Verificar si hay respuestas completadas
  const hasCompletedTest = useMemo(() => {
    return Object.keys(answers).length > 0;
  }, [answers]);

  // Redirigir si no hay test completado
  useEffect(() => {
    if (!hasCompletedTest) {
      navigate('/diagnostic');
    }
  }, [hasCompletedTest, navigate]);

  // Marcar el intento como completado en el backend al cargar los resultados
  useEffect(() => {
    const completeAttemptInBackend = async () => {
      // Solo completar si hay un test completado en el estado
      if (!hasCompletedTest || !state?.finished) {
        return;
      }

      // Obtener el attemptId del localStorage o del state
      const attemptId = state?.attemptId;
      if (!attemptId) {
        console.warn('⚠️ No se encontró attemptId en el estado');
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

        console.log('✓ Intento marcado como completado en backend');
      } catch (error) {
        console.error('✗ Error al completar intento en backend:', error);
      }
    };

    completeAttemptInBackend();
  }, [hasCompletedTest, state]);

  // Función para iniciar un nuevo test
  const handleNewTest = async () => {
    try {
      const token = localStorage.getItem('beloop_token');
      if (!token) {
        console.error('✗ No hay token de autenticación');
        return;
      }

      console.log('🔄 Iniciando nuevo test...');

      // Llamar al endpoint que fuerza la creación de un nuevo intento
      const response = await fetch('http://localhost:3001/api/tests/auto/attempts/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const newAttempt = await response.json();
      console.log('✓ Nuevo intento creado en backend:', newAttempt);

      // Limpiar el localStorage completamente para resetear el estado de React
      localStorage.removeItem(STATE_KEY);
      console.log('✓ LocalStorage limpiado');

      // Usar navigate en lugar de window.location.href para evitar recarga completa
      // y permitir que React maneje el cambio de ruta correctamente
      navigate('/diagnostic', { replace: true });
    } catch (error) {
      console.error('✗ Error al crear nuevo intento:', error);
      // Si falla, al menos limpiar localStorage y redirigir
      localStorage.removeItem(STATE_KEY);
      navigate('/diagnostic', { replace: true });
    }
  };

  // 2) Outcome oficial
  const outcome = useMemo(() => computeOutcome(answers), [answers]);

  // 3) Progreso y estados derivados
  const vuProgress = useMemo(() => calculateVuProgress(outcome.vu_stage), [outcome.vu_stage]);
  const vuStage = useMemo(() => mapVuStage(outcome.vu_stage), [outcome.vu_stage]);

  // Estado REP basado en afectación y madurez de Sistema de Gestión
  const repStatus = useMemo(
    () => determineRepStatus(outcome.afecta_rep, outcome.sg_madurez),
    [outcome.afecta_rep, outcome.sg_madurez]
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

  // Determinar planes recomendados desde outcome
  const planesRecomendados = useMemo(() => {
    const planes = outcome.planes_recomendados;
    if (!planes || planes.length === 0) return [];

    // Mapear a formato uppercase para mostrar
    const planMap: Record<string, string> = {
      retc: "RETC",
      simple: "Simple",
      pro: "Pro",
      enterprise: "Enterprise",
    };

    return planes.map(plan => planMap[plan]).filter(Boolean) as string[];
  }, [outcome.planes_recomendados]);

  // Lista de todos los planes disponibles
  const allPlans = ["RETC", "Simple", "Pro", "Enterprise"];

  // Otros planes (excluyendo los recomendados)
  const otherPlans = useMemo(() => {
    if (planesRecomendados.length === 0) return allPlans;
    return allPlans.filter(plan => !planesRecomendados.includes(plan));
  }, [planesRecomendados]);

  // Planes a mostrar
  const plansToShow = useMemo(() => {
    if (showAllPlans) return allPlans;
    return planesRecomendados;
  }, [showAllPlans, planesRecomendados]);

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Resumen del Diagnóstico</h1>
            <Button
              variant="outline"
              onClick={() => setShowNewTestDialog(true)}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Nuevo Test
            </Button>
          </div>

          {/* Navegación entre Resultados y Soluciones */}
          <div className="flex gap-6 text-sm border-b">
            <button
              onClick={() => setActiveView("resultados")}
              className={`pb-2 px-1 ${
                activeView === "resultados"
                  ? "font-bold border-b-2 border-black"
                  : "text-gray-500"
              }`}
            >
              RESULTADOS
            </button>
            <button
              onClick={() => setActiveView("soluciones")}
              className={`pb-2 px-1 ${
                activeView === "soluciones"
                  ? "font-bold border-b-2 border-black"
                  : "text-gray-500"
              }`}
            >
              SOLUCIONES
            </button>
          </div>

          {/* Vista de Resultados */}
          {activeView === "resultados" && (
            <>
              {/* 1) REP — tarjeta con nueva lógica */}
              <RepCard status={repStatus} completedSteps={repProgress} />

              {/* 2) Ventanilla Única – RETC */}
              {vuStage && <VuRetcCard stage={vuStage} completedSteps={vuProgress} />}
            </>
          )}

          {/* Vista de Soluciones */}
          {activeView === "soluciones" && (
            <div className="space-y-6">
              {/* Tarjeta de encabezado */}
              {planesRecomendados.length > 0 && !showAllPlans && (
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-900 mb-2">
                          {planesRecomendados.length === 1 ? "TU PLAN RECOMENDADO" : "TUS PLANES RECOMENDADOS"}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Según las respuestas de tu test hemos evaluado el estado de tu empresa y determinado {planesRecomendados.length === 1 ? "el plan" : "los planes"} que mejor se {planesRecomendados.length === 1 ? "ajusta" : "ajustan"} a sus necesidades actuales.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lista de Planes */}
              <div className="space-y-4">
                {plansToShow.map((plan) => (
                  <Card key={plan} className="border-2 hover:border-gray-300 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">
                            PLAN {plan.toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {plan === "RETC" && "Te Apoyamos En El Cumplimiento De Declaraciones En RETC"}
                            {plan === "Simple" && "Utiliza Nuestro Software Para Registrar Tu Información Y Automatizar Tus Declaraciones."}
                            {plan === "Pro" && "Te Apoyamos En El Cumplimiento De La Ley REP Utilizando Nuestro Software"}
                            {plan === "Enterprise" && "Si No Tienes Tiempo, Lo Hacemos Por Ti."}
                          </p>
                        </div>
                        <div className="flex items-center gap-6">
                          {/* Estrellas */}
                          <div className="flex gap-1">
                            {plan === "RETC" && (
                              <>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span key={star} className="text-yellow-400 text-xl">★</span>
                                ))}
                              </>
                            )}
                            {plan === "Simple" && (
                              <>
                                <span className="text-yellow-400 text-xl">★</span>
                                {[2, 3, 4, 5].map((star) => (
                                  <span key={star} className="text-gray-300 text-xl">★</span>
                                ))}
                              </>
                            )}
                            {plan === "Pro" && (
                              <>
                                {[1, 2, 3].map((star) => (
                                  <span key={star} className="text-yellow-400 text-xl">★</span>
                                ))}
                                {[4, 5].map((star) => (
                                  <span key={star} className="text-gray-300 text-xl">★</span>
                                ))}
                              </>
                            )}
                            {plan === "Enterprise" && (
                              <>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span key={star} className="text-yellow-400 text-xl">★</span>
                                ))}
                              </>
                            )}
                          </div>
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-300"
                            aria-label={`Seleccionar plan ${plan}`}
                          />
                          <span className="text-sm text-gray-600">SELECCIONAR PLAN</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-4 justify-center pt-4">
                {!showAllPlans && otherPlans.length > 0 && (
                  <Button
                    variant="outline"
                    className="px-6"
                    onClick={() => setShowAllPlans(true)}
                  >
                    REVISAR OTROS PLANES
                  </Button>
                )}
                {showAllPlans && (
                  <Button
                    variant="outline"
                    className="px-6"
                    onClick={() => setShowAllPlans(false)}
                  >
                    VER SOLO PLAN RECOMENDADO
                  </Button>
                )}
                <Button
                  className="px-6 bg-black text-white hover:bg-gray-800"
                  onClick={() => {
                    // TODO: Backend debe enviar email a ejecutivos con resultados del test
                    alert("Solicitud enviada. Un ejecutivo se contactará contigo pronto.");
                  }}
                >
                  AGENDAR CON EJECUTIVO
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Diálogo de confirmación para nuevo test */}
      <AlertDialog open={showNewTestDialog} onOpenChange={setShowNewTestDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Iniciar un nuevo test?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción creará un nuevo intento del test. Tus respuestas actuales quedarán guardadas en el historial,
              pero comenzarás el test desde cero con un nuevo intento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleNewTest}>
              Sí, iniciar nuevo test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertTriangle } from "lucide-react";

type NextSection = "medicion" | "vu_retc";

const DONE_KEY = "diagnostic_test_done_v1";
const OUTCOME_KEY = "diagnostic_test_outcomes_v1";
const NEXT_KEY = "diagnostic_test_next_v1";

export default function DiagnosticAntecedentes() {
  const navigate = useNavigate();

  // Wizard: 1) Tamaño  2) ¿Comercializas EE?  3) ¿>300 kg/año?  4) Resumen
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Paso 1
  const [size, setSize] = useState("");
  // Paso 2
  const [vende, setVende] = useState<"" | "Sí" | "No">("");
  // Paso 3 (solo si vende = "Sí")
  const [kg300, setKg300] = useState<"" | "Sí" | "No" | "No lo sé">("");

  // Registro interno (gris)
  const afectaREP: "Sí" | "No" | "Indeterminado" = useMemo(() => {
    if (vende === "No") return "No";
    if (vende === "Sí" && kg300 === "Sí") return "Sí";
    if (vende === "Sí" && kg300 === "No") return "No";
    return "Indeterminado"; // mientras no sabemos
  }, [vende, kg300]);

  // Siguiente sección (amarillo) sugerida por la lógica del diagrama
  const nextSection: NextSection | null = useMemo(() => {
    if (vende === "No") return "vu_retc";
    if (vende === "Sí") {
      if (kg300 === "Sí") return "medicion";
      if (kg300 === "No") return "vu_retc";
      if (kg300 === "No lo sé") return "medicion";
    }
    return null; // aún no respondido
  }, [vende, kg300]);

  const guardarYSeguir = () => {
    // 1) marcar sección completada
    let currDone: any = {};
    try { currDone = JSON.parse(localStorage.getItem(DONE_KEY) || "{}"); } catch {}
    localStorage.setItem(DONE_KEY, JSON.stringify({ ...currDone, antecedentes: true }));

    // 2) guardar outcome interno (gris)
    let currOut: any[] = [];
    try { currOut = JSON.parse(localStorage.getItem(OUTCOME_KEY) || "[]"); } catch {}
    currOut = Array.isArray(currOut) ? currOut : [];
    const payload = {
      afecta_rep: afectaREP,            // "Sí" | "No" | "Indeterminado"
      size, vende, kg300,               // trazabilidad de respuestas
      decided_at: new Date().toISOString(),
    };
    localStorage.setItem(OUTCOME_KEY, JSON.stringify([...currOut, payload]));

    // 3) hint de navegación para el hub
    if (nextSection) {
      localStorage.setItem(NEXT_KEY, nextSection);
    }

    // 4) Navegar directo a la sección sugerida (si existe la ruta),
    //    o volver al hub si todavía no la tienes creada.
    if (nextSection === "medicion") {
      navigate("/diagnostic-test/medicion");
    } else if (nextSection === "vu_retc") {
      navigate("/diagnostic-test/vu-retc");
    } else {
      navigate("/diagnostic-test");
    }
  };

  // Validaciones por paso
  const canNextFrom1 = !!size;
  const canNextFrom2 = vende === "Sí" || vende === "No";
  const canFinish = (vende === "No") || (vende === "Sí" && !!kg300);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>1) Antecedentes</CardTitle>
              <CardDescription>Te iremos guiando con preguntas y abriremos la sección adecuada según tu caso.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Paso 1: Tamaño de empresa */}
              {step === 1 && (
                <div>
                  <p className="mb-2 font-medium">¿Cuál es el tamaño de tu empresa?</p>
                  <RadioGroup value={size} onValueChange={setSize} className="grid gap-2 sm:grid-cols-2">
                    {["Micro empresa", "Pequeña empresa", "Mediana empresa", "Empresa grande"].map((o) => (
                      <Label key={o} className="flex cursor-pointer items-center gap-3 rounded-md border p-3">
                        <RadioGroupItem value={o} />
                        {o}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Paso 2: ¿Comercializas EE? */}
              {step === 2 && (
                <div>
                  <p className="mb-2 font-medium">¿Comercializas en Chile productos con envases y embalajes?</p>
                  <RadioGroup value={vende} onValueChange={(v: any) => { setVende(v); setKg300(""); }}>
                    {["Sí", "No"].map((o) => (
                      <Label key={o} className="flex cursor-pointer items-center gap-3 rounded-md border p-3 mt-2">
                        <RadioGroupItem value={o as any} /> {o}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Paso 3: ¿>300 kg/año? (solo si vende = Sí) */}
              {step === 3 && vende === "Sí" && (
                <div>
                  <p className="mb-2 font-medium">¿Pones en el mercado más de <strong>300 kg/año</strong> de envases y embalajes en mercado nacional?</p>
                  <RadioGroup value={kg300} onValueChange={(v: any) => setKg300(v)} className="grid gap-2 sm:grid-cols-3">
                    {["Sí", "No", "No lo sé"].map((o) => (
                      <Label key={o} className="flex cursor-pointer items-center gap-3 rounded-md border p-3">
                        <RadioGroupItem value={o as any} /> {o}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Paso 4: Resumen (registro gris + link amarillo) */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-md border bg-muted/40 p-3">
                    {afectaREP === "Sí" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                    )}
                    <div className="text-sm">
                      <span className="mr-2 text-muted-foreground">Registro:</span>
                      <Badge variant="secondary" className="uppercase">Afecta a Ley REP: {afectaREP}</Badge>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Siguiente sección sugerida:
                    {" "}
                    <Badge className="ml-2">
                      {nextSection === "medicion" ? "Medición" : "VU – RETC"}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Separador visual si no es el primer paso */}
              {step > 1 && <Separator />}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate("/diagnostic-test")}>Cancelar</Button>

              {step === 1 && (
                <Button onClick={() => setStep(2)} disabled={!canNextFrom1}>Siguiente</Button>
              )}
              {step === 2 && (
                <Button onClick={() => setStep(vende === "Sí" ? 3 : 4)} disabled={!canNextFrom2}>
                  {vende === "Sí" ? "Siguiente" : "Ver resultado"}
                </Button>
              )}
              {step === 3 && vende === "Sí" && (
                <Button onClick={() => setStep(4)} disabled={!kg300}>Ver resultado</Button>
              )}
              {step === 4 && (
                <Button onClick={guardarYSeguir} disabled={!canFinish}>
                  Continuar a {nextSection === "medicion" ? "Medición" : "VU – RETC"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}

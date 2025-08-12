import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, CircleDot } from "lucide-react";

// =============================
// DiagnosticTestHub (página 1)
// =============================
// Muestra las 5 secciones y el % de progreso. Desde aquí el usuario entra a cada sección.

export type SectionKey = "antecedentes" | "medicion" | "trazabilidad" | "gestion" | "vu_retc";

const SECTIONS: { key: SectionKey; label: string; path: string }[] = [
  { key: "antecedentes", label: "Antecedentes", path: "/diagnostic-test/antecedentes" },
  { key: "medicion", label: "Medición", path: "/diagnostic-test/medicion" },
  { key: "trazabilidad", label: "Trazabilidad – Línea Base", path: "/diagnostic-test/trazabilidad" },
  { key: "gestion", label: "Sistema de Gestión", path: "/diagnostic-test/gestion" },
  { key: "vu_retc", label: "VU – RETC", path: "/diagnostic-test/vu-retc" },
];

// Clave de localStorage para guardar avance "hecho" por sección
const DONE_KEY = "diagnostic_test_done_v1";

export default function DiagnosticTestHub() {
  const navigate = useNavigate();

  // Estado: qué secciones están completas (persistido)
  const [done, setDone] = useState<Record<SectionKey, boolean>>(() => {
    try {
      const raw = localStorage.getItem(DONE_KEY);
      return raw ? (JSON.parse(raw) as Record<SectionKey, boolean>) : { antecedentes: false, medicion: false, trazabilidad: false, gestion: false, vu_retc: false };
    } catch {
      return { antecedentes: false, medicion: false, trazabilidad: false, gestion: false, vu_retc: false };
    }
  });

  useEffect(() => {
    localStorage.setItem(DONE_KEY, JSON.stringify(done));
  }, [done]);

  // Lógica: solo la primera sección NO completada queda habilitada (las completadas también son reingresables)
  const nextKey = useMemo<SectionKey>(() => {
    for (const s of SECTIONS) {
      if (!done[s.key]) return s.key;
    }
    return SECTIONS[SECTIONS.length - 1].key; // todas hechas: deja habilitada la última
  }, [done]);

  const isEnabled = (k: SectionKey) => done[k] || k === nextKey;

  const completedCount = SECTIONS.filter((s) => done[s.key]).length;
  const progressPct = Math.round((completedCount / SECTIONS.length) * 100);

  const resetProgreso = () => {
    const reset = { antecedentes: false, medicion: false, trazabilidad: false, gestion: false, vu_retc: false } as Record<SectionKey, boolean>;
    setDone(reset);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl p-6">
          <header className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Test de Diagnóstico</h1>
              <p className="text-sm text-muted-foreground">Selecciona una sección para comenzar. El flujo es secuencial.</p>
            </div>
            <Button variant="outline" onClick={resetProgreso}>Reiniciar progreso</Button>
          </header>

          {/* Barra de progreso */}
          <div className="mb-8">
            <div className="mb-2 flex items-baseline gap-3">
              <span className="text-sm text-muted-foreground">Progreso</span>
              <span className="text-lg font-semibold">{progressPct}%</span>
              <Badge variant="secondary">{completedCount}/{SECTIONS.length} secciones</Badge>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Grid de secciones */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s, idx) => {
              const enabled = isEnabled(s.key);
              const completed = done[s.key];
              const status = completed ? "Completada" : enabled ? "Disponible" : "Bloqueada";
              const Icon = completed ? CheckCircle2 : enabled ? CircleDot : Lock;

              return (
                <Card key={s.key} className={completed ? "border-green-500/50" : enabled ? "" : "opacity-60"}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="flex items-center gap-2"><span className="rounded-full border px-2 py-0.5 text-xs">{idx + 1}</span> {s.label}</span>
                      <Badge variant={completed ? "default" : "secondary"} className={completed ? "bg-green-600 text-white" : ""}>
                        {status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {s.key === "antecedentes" && "Datos básicos para determinar si aplica Ley REP."}
                      {s.key === "medicion" && "Carga de productos y análisis de componentes."}
                      {s.key === "trazabilidad" && "Línea base y roles de cumplimiento."}
                      {s.key === "gestion" && "Sistema de gestión y declaraciones."}
                      {s.key === "vu_retc" && "Ventanilla Única / RETC."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className={completed ? "text-green-600" : enabled ? "text-primary" : "text-muted-foreground"} size={18} />
                      {completed ? "Sección completada" : enabled ? "Puedes continuar aquí" : "Completa la sección anterior"}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={() => enabled && navigate(s.path)} disabled={!enabled}>
                      {completed ? "Revisar" : "Iniciar"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
}

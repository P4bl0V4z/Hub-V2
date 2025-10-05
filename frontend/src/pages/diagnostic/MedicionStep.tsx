// src/pages/diagnostic/MedicionStep.tsx (o donde la montes)
import { useEffect, useState } from "react";
import MedicionCard from "./flow/sections/MedicionCard";
import type { MedicionPayload } from "./flow/sections/Medicion.logic";
import { ORDER, ORDER_BY_SECTION } from "@/ORDER";
import {
  toProgressFromMap,
  autosaveProgress,
  TestProgress,
} from "@/types/test-progress";

type Props = {
  attemptId: number;               // te lo da POST /api/tests/:testId/attempts
  goToSection: (key: "trazabilidad" | "vu_retc") => void; // tu router/estado
};

export default function MedicionStep({ attemptId, goToSection }: Props) {
  // estado global/local del diagnóstico
  const [answersMap, setAnswersMap] = useState<Record<string, string>>({});
  const [currentQid, setCurrentQid] = useState<string | undefined>(undefined);

  // AUTOSAVE: cada cambio de answersMap/currentQid → PATCH progress
  useEffect(() => {
    if (!attemptId) return;
    const progress: TestProgress = toProgressFromMap(answersMap, ORDER, currentQid);
    autosaveProgress(attemptId, progress).catch(console.error);
  }, [attemptId, answersMap, currentQid]);

  // rehidratación opcional de Medición si ya había algo guardado
  const initialMedicion = (() => {
    const raw = answersMap["Q_MEDICION_TODO"];
    if (!raw) return undefined;
    try { return JSON.parse(raw) as MedicionPayload; } catch { return undefined; }
  })();

  return (
    <MedicionCard
      initialValue={initialMedicion}
      onSubmit={() => {
        // opcional: si quieres hacer algo con el objeto crudo
      }}
      onSaveAnswer={(qid, value) => {
        // GUARDA LA RESPUESTA DE MEDICIÓN EN TU MAP (string JSON)
        setAnswersMap(prev => ({ ...prev, [qid]: value }));
      }}
      goTo={(next) => {
        // mueve el cursor a la siguiente sección (opcional)
        const firstQid = ORDER_BY_SECTION[next][0];
        setCurrentQid(firstQid);
        // navega tu UI
        goToSection(next);
      }}
    />
  );
}

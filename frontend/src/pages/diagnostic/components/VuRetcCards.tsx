// src/pages/diagnostic/components/VuRetcCards.tsx
import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

type VuStage = "inicial" | "transicion" | "avanzada";

interface VuRetcCardProps {
  stage: VuStage;
  defaultExpanded?: boolean;
}

export function VuRetcCard({ stage, defaultExpanded = false }: VuRetcCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const cfg = (() => {
    switch (stage) {
      case "inicial":
        return {
          badgeText: "EMPRESA INICIAL",
          badgeClass: "bg-red-100 text-red-800 border border-red-200",
          iconColor: "text-red-600",
          sectionIconBg: "bg-red-500",     // <- NUEVO: color del icono lateral
          progressColor: "bg-red-500",
          progressPct: 33.33,
          message:
            "¡TE PODEMOS APOYAR! ACTUALMENTE TE ENCUENTRAS EN LA FASE INICIAL DEL PROCESO DE CUMPLIMIENTO RETC. ESTO SIGNIFICA QUE AÚN NO ESTÁS REGISTRADO EN VENTANILLA ÚNICA, POR LO TANTO NO HAS REALIZADO TUS DECLARACIONES. PARA ALCANZAR EL SIGUIENTE NIVEL, DEBES REGISTRARTE Y APERTURAR TUS SECTORIALES PERTINENTES.",
        };
      case "transicion":
        return {
          badgeText: "EMPRESA EN TRANSICIÓN",
          badgeClass: "bg-yellow-100 text-yellow-800 border border-yellow-200",
          iconColor: "text-yellow-600",
          sectionIconBg: "bg-yellow-500",  // <- NUEVO
          progressColor: "bg-yellow-500",
          progressPct: 66.67,
          message:
            "¡TE PODEMOS APOYAR! ACTUALMENTE TE ENCUENTRAS EN TRANSICIÓN EN EL PROCESO DE CUMPLIMIENTO RETC. ESTO SIGNIFICA QUE ESTÁS REGISTRADO, SÓLO NECESITAS DECLARAR PARA AVANZAR AL SIGUIENTE NIVEL.",
        };
      case "avanzada":
      default:
        return {
          badgeText: "EMPRESA EN VERDE",
          badgeClass: "bg-green-100 text-green-800 border border-green-200",
          iconColor: "text-green-600",
          sectionIconBg: "bg-green-500",   // <- NUEVO
          progressColor: "bg-green-500",
          progressPct: 100,
          message:
            "¡FELICITACIONES! ACTUALMENTE TE ENCUENTRAS EN LA FASE AVANZADA DEL PROCESO DE CUMPLIMIENTO RETC. ESTO SIGNIFICA QUE ESTÁS AL DÍA CON TU REGISTRO Y DECLARACIONES.",
        };
    }
  })();

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header negro colapsable */}
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className={`w-full bg-black text-white p-4 ${
            isExpanded ? "rounded-t-lg" : "rounded-lg"
          } flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity`}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <CheckCircle className={`w-4 h-4 ${cfg.iconColor}`} />
            </div>
            <span className="font-semibold text-sm">
              ESTÁS SUJETO A DECLARAR EN VENTANILLA ÚNICA RETC
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-white" />
          ) : (
            <ChevronDown className="w-5 h-5 text-white" />
          )}
        </button>

        {isExpanded && (
          <div className="p-6 space-y-6">
            {/* Resultados */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                {/* Ícono lateral con color por estado */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.sectionIconBg}`}>
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  RESULTADOS VENTANILLA ÚNICA RETC
                </h3>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {cfg.message}
              </p>

              <p className="text-xs text-gray-500 leading-relaxed">
                El <strong>RETC</strong> (Registro de Emisiones y Transferencia de
                Contaminantes) es un sistema nacional que recopila información sobre
                emisiones al aire, agua y suelo, y transferencias de residuos de
                establecimientos industriales. Las empresas reportan anualmente sus
                datos ambientales para cumplir con la normativa y promover la
                transparencia de información ambiental hacia la ciudadanía.
              </p>
            </section>

            {/* Estado de cumplimiento */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.sectionIconBg}`}>
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    ESTADO DE CUMPLIMIENTO
                  </h3>
                  <p className="text-xs text-gray-600">
                    Basado en sus respuestas, éste es el nivel actual de cumplimiento
                    respecto a Ventanilla Única RETC.
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">VU - RETC</h4>
                    <p className="text-sm text-gray-600">
                      RESUMEN DEL CUMPLIMIENTO:
                    </p>
                  </div>
                  <Badge className={cfg.badgeClass}>{cfg.badgeText}</Badge>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${cfg.progressColor} h-3 rounded-full transition-all duration-300`}
                    style={{ width: `${cfg.progressPct}%` }}
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

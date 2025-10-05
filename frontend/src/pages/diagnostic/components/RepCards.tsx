// src/pages/diagnostic/components/RepCards.tsx
import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

type RepStatus = "no_afecto" | "inicial" | "transicion" | "avanzada";

interface RepCardProps {
  status: RepStatus;
  defaultExpanded?: boolean;
}

export function RepCard({ status, defaultExpanded = false }: RepCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const cfg = (() => {
    switch (status) {
      case "inicial":
        return {
          // afecto + inicial (rojo)
          sectionIconBg: "bg-red-500",
          badgeText: "EMPRESA INICIAL",
          badgeClass: "bg-red-100 text-red-800 border border-red-200",
          progressColor: "bg-red-500",
          progressPct: 25,
          headerTitle:
            "ESTÁS AFECTO A LA LEY REP 20.920 DE ENVASES Y EMBALAJES",
          resultTitle:
            "ESTÁS AFECTO A LEY REP. PONES EN MERCADO MÁS DE 300 KG DE PRODUCTOS PRIORITARIOS.",
          message:
            "¡TE PODEMOS APOYAR! ACTUALMENTE TE ENCUENTRAS EN LA FASE INICIAL DEL PROCESO DE CUMPLIMIENTO REP. ESTO SIGNIFICA QUE AÚN NO ESTÁS ADHERIDO A UN SISTEMA DE GESTIÓN, POR LO TANTO NO HAS REALIZADO TUS DECLARACIONES. PARA ALCANZAR EL SIGUIENTE NIVEL, DEBES REGISTRARTE Y DECLARAR PARA NO ENFRENTAR MULTAS Y SANCIONES.",
          showCompliance: true,
        };
      case "transicion":
        return {
          // afecto + transición (amarillo)
          sectionIconBg: "bg-yellow-500",
          badgeText: "EMPRESA EN TRANSICIÓN",
          badgeClass: "bg-yellow-100 text-yellow-800 border border-yellow-200",
          progressColor: "bg-yellow-500",
          progressPct: 66.67,
          headerTitle:
            "ESTÁS AFECTO A LA LEY REP 20.920 DE ENVASES Y EMBALAJES",
          resultTitle:
            "ESTÁS AFECTO A LEY REP. PONES EN MERCADO MÁS DE 300 KG DE PRODUCTOS PRIORITARIOS.",
          message:
            "¡TE PODEMOS APOYAR! ACTUALMENTE TE ENCUENTRAS EN TRANSICIÓN EN EL PROCESO DE CUMPLIMIENTO REP. ESTO SIGNIFICA QUE ESTÁS ADHERIDO, SÓLO NECESITAS DECLARAR PARA AVANZAR AL SIGUIENTE NIVEL.",
          showCompliance: true,
        };
      case "avanzada":
        return {
          // afecto + óptimo (verde) → tarjeta 3
          sectionIconBg: "bg-green-500",
          badgeText: "EMPRESA EN VERDE",
          badgeClass: "bg-green-100 text-green-800 border border-green-200",
          progressColor: "bg-green-500",
          progressPct: 100,
          headerTitle:
            "ESTÁS AFECTO A LA LEY REP 20.920 DE ENVASES Y EMBALAJES",
          resultTitle:
            "ESTÁS AFECTO A LEY REP. PONES EN MERCADO MÁS DE 300 KG DE PRODUCTOS PRIORITARIOS.",
          message:
            "¡FELICITACIONES! ACTUALMENTE TE ENCUENTRAS EN LA FASE AVANZADA DEL PROCESO DE CUMPLIMIENTO REP.  ESTO SIGNIFICA QUE ESTÁS AL DÍA CON TU REGISTRO Y DECLARACIONES.",
          showCompliance: true,
        };
      case "no_afecto":
      default:
        return {
          // tarjeta 4 (no afecto)
          sectionIconBg: "bg-neutral-900",
          badgeText: "",
          badgeClass: "",
          progressColor: "",
          progressPct: 0,
          headerTitle:
            "NO ESTÁS AFECTO A LA LEY REP 20.920 DE ENVASES Y EMBALAJES",
          resultTitle: "NO ESTÁS AFECTO A LEY REP.",
          message:
            "La Ley REP Es Una Ley Marco OCDE Para La Gestión De Los Residuos Y La Transición Hacia Modelos Productivos Más Eficientes Y Circulares. La REP Es Obligatoria Desde Septiembre 2023 Para Los Productores De Productos Prioritarios. Acá Descubrirás Cómo Le Afecta A Tu Empresa.",
          showCompliance: false,
        };
    }
  })();

  return (
    <Card>
      <CardContent className="p-0">
        
          <button
            type="button"
            onClick={() => setIsExpanded(v => !v)}
            className={`w-full bg-black text-white p-4 ${
              isExpanded ? "rounded-t-lg" : "rounded-lg"
            } flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-center gap-3">
              {/* mismo tamaño de “chip” e ícono que VU-RETC */}
              <div className={`w-6 h-6 bg-white rounded-full flex items-center justify-center`}>
                <CheckCircle className={`w-4 h-4 ${
                  status === "inicial" ? "text-red-600" :
                  status === "transicion" ? "text-yellow-600" :
                  status === "avanzada" ? "text-green-600" :
                  "text-neutral-300"
                }`} />
              </div>
              <span className="font-semibold text-sm">
                {cfg.headerTitle}
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-white" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </button>

        {/* Contenido */}
        {isExpanded && (
          <div className="p-6 space-y-6">
            {/* Resultados */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.sectionIconBg}`}
                >
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">
                  RESULTADOS LEY REP 20.920
                </h3>
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">
                {cfg.resultTitle}
              </h4>

              {/* Mensaje principal */}
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {cfg.message}
              </p>

              {/* Texto contextual (se mantiene también para no_afecto) */}
              <p className="text-xs text-gray-500 leading-relaxed">
                La Ley REP Es Una Ley Marco OCDE Para La Gestión De Los Residuos
                Y La Transición Hacia Modelos Productivos Más Eficientes Y
                Circulares. La REP Es Obligatoria Desde Septiembre 2023 Para Los
                Productores De Productos Prioritarios. Acá Descubrirás Cómo Le
                Afecta A Tu Empresa.
              </p>
            </section>

            {/* Estado de Cumplimiento — solo para estados afectos */}
            {cfg.showCompliance && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.sectionIconBg}`}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      ESTADO DE CUMPLIMIENTO
                    </h3>
                    <p className="text-xs text-gray-600">
                      Basado En Sus Respuestas, Presentamos Una Evaluación Del
                      Nivel De Cumplimiento De Su Empresa Respecto A Los Distintos
                      Hitos Establecidos, Identificando Avances Y Áreas Por Mejorar.
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">CUMPLIMIENTO REP</h4>
                      <p className="text-sm text-gray-600">
                        RESUMEN DEL CUMPLIMIENTO:
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Indicador redondo tipo “semáforo” a la derecha */}
                      <div
                        className={`w-6 h-6 rounded-md ${cfg.sectionIconBg}`}
                        aria-hidden
                      />
                      <Badge className={cfg.badgeClass}>{cfg.badgeText}</Badge>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${cfg.progressColor} h-3 rounded-full transition-all duration-300`}
                      style={{ width: `${cfg.progressPct}%` }}
                    />
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

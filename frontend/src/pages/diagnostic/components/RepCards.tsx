// src/pages/diagnostic/components/RepCards.tsx
import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

type RepStatus = "no_afecto" | "transicion" | "inicial";

interface RepCardProps {
  status: RepStatus;
  completedSteps?: number;
}

export function RepCard({ status, completedSteps = 0 }: RepCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getConfig = () => {
    switch (status) {
      case "no_afecto":
        return {
          headerColor: "bg-green-600",
          dotColor: "bg-green-500",
          badgeText: "EMPRESA EN VERDE",
          badgeClass: "bg-green-100 text-green-800 border-green-200",
          progressColor: "bg-green-500",
          progressWidth: 100,
          title: "NO ESTÁS AFECTO A LEY REP.",
          message:
            "¡FELICITACIONES! ACTUALMENTE TE ENCUENTRAS EN LA FASE AVANZADA DEL PROCESO DE CUMPLIMIENTO REP. ESTO SIGNIFICA QUE ESTÁS AL DÍA CON TU REGISTRO Y DECLARACIONES.",
        };
      case "transicion":
        return {
          headerColor: "bg-yellow-600",
          dotColor: "bg-yellow-500",
          badgeText: "EMPRESA EN TRANSICIÓN",
          badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
          progressColor: "bg-yellow-500",
          progressWidth: 66.67,
          title:
            "ESTÁS AFECTO A LEY REP. PONES EN MERCADO MÁS DE 300 KG DE PRODUCTOS PRIORITARIOS.",
          message:
            "¡TE PODEMOS APOYAR! ACTUALMENTE TE ENCUENTRAS EN TRANSICIÓN EN EL PROCESO DE CUMPLIMIENTO REP. ESTO SIGNIFICA QUE ESTÁS ADHERIDO, SÓLO NECESITAS DECLARAR PARA AVANZAR AL SIGUIENTE NIVEL.",
        };
      case "inicial":
        return {
          headerColor: "bg-red-600",
          dotColor: "bg-red-500",
          badgeText: "EMPRESA INICIAL",
          badgeClass: "bg-red-100 text-red-800 border-red-200",
          progressColor: "bg-red-500",
          progressWidth: 20,
          title:
            "ESTÁS AFECTO A LEY REP. PONES EN MERCADO MÁS DE 300 KG DE PRODUCTOS PRIORITARIOS.",
          message:
            "¡TE PODEMOS APOYAR! ACTUALMENTE TE ENCUENTRAS EN LA FASE INICIAL DEL PROCESO DE CUMPLIMIENTO REP. ESTO SIGNIFICA QUE AÚN NO ESTÁS ADHERIDO A UN SISTEMA DE GESTIÓN, POR LO TANTO NO HAS REALIZADO TUS DECLARACIONES. PARA ALCANZAR EL SIGUIENTE NIVEL, DEBES REGISTRARTE Y DECLARAR PARA NO ENFRENTAR MULTAS Y SANCIONES.",
        };
    }
  };

  const config = getConfig();

  // Título del header según el estado
  const headerTitle =
    status === "no_afecto"
      ? "NO ESTÁS AFECTO A LA LEY REP 20.920 DE ENVASES Y EMBALAJES"
      : "ESTÁS AFECTO A LA LEY REP 20.920 DE ENVASES Y EMBALAJES";

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header dinámico */}
        <div
          className={`${config.headerColor} text-white p-4 rounded-t-lg flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-6 h-6 ${config.dotColor} rounded-full flex items-center justify-center`}
            >
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">{headerTitle}</span>
          </div>
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-white" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </div>
        </div>

        {/* Contenido expandible */}
        {isExpanded && (
          <div className="p-6 space-y-6">
            {/* Sección de Resultados */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    RESULTADOS LEY REP 20.920
                  </h3>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">
                {config.title}
              </h4>

              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {config.message}
              </p>

              <p className="text-sm text-gray-500 leading-relaxed">
                La Ley REP Es Una Ley Marco OCDE Para La Gestión De Los Residuos
                Y La Transición Hacia Modelos Productivos Más Eficientes Y
                Circulares. La REP Es Obligatoria Desde Septiembre 2023 Para Los
                Productores De Productos Prioritarios. Acá Descubrirás Cómo Le
                Afecta A Tu Empresa.
              </p>
            </div>

            {/* Estado de Cumplimiento */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    ESTADO DE CUMPLIMIENTO
                  </h3>
                  <p className="text-sm text-gray-600">
                    Basado En Sus Respuestas, Presentamos Una Evaluación Del
                    Nivel De Cumplimiento De Su Empresa Respecto A Los
                    Distintos Hitos Establecidos, Identificando Avances Y Áreas
                    Por Mejorar.
                  </p>
                </div>
              </div>

              {/* Tarjeta CUMPLIMIENTO REP */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">CUMPLIMIENTO REP</h4>
                    <p className="text-sm text-gray-600">
                      RESUMEN DEL CUMPLIMIENTO:
                    </p>
                  </div>
                  <Badge className={config.badgeClass}>{config.badgeText}</Badge>
                </div>

                {/* Barra de progreso dinámica según status */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className={`${config.progressColor} h-3 rounded-full transition-all duration-300`}
                    style={{ width: `${config.progressWidth}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Recomendaciones */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    RECOMENDACIONES INMEDIATAS
                  </h3>
                  <p className="text-sm text-gray-600">
                    ¿Qué Hacer? - Ventanilla Única RETC - Acciones Prioritarias
                    Para Mejorar Su Cumplimiento
                  </p>
                </div>
              </div>

              {/* TU RUTA CUMPLIMIENTO REP */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      TU RUTA CUMPLIMIENTO REP
                    </h4>
                    <p className="text-sm text-gray-600">¿QUÉ HACER?</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-black rounded-sm" />
                    <span className="text-sm font-medium">
                      {completedSteps} DE 5 HITOS COMPLETADOS
                    </span>
                  </div>
                </div>

                {/* Barra visual de etapas */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-4 bg-black rounded-sm" />
                    <div className="w-8 h-4 bg-red-500 rounded-sm" />
                    <div className="w-8 h-4 bg-orange-500 rounded-sm" />
                    <div className="w-8 h-4 bg-yellow-400 rounded-sm" />
                    <div className="w-8 h-4 bg-green-500 rounded-sm" />
                  </div>
                  <div className="w-full bg-gray-300 h-2 rounded-full relative">
                    <div className="w-2 h-2 bg-black rounded-full absolute left-0 top-0 transform -translate-y-0.5" />
                  </div>
                </div>

                {/* Lista de pasos */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 bg-black rounded-full mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-sm">
                        RUTA CUMPLIMIENTO REP
                      </h5>
                      <p className="text-sm text-gray-600">
                        Modelo De Trazabilidad De Residuos Inicial (Regularizar
                        Ventanilla Única RETC) Y Generar Una Ruta REP Interna A
                        Nivel Operacional Y Estratégico).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-sm">
                        RUTA CUMPLIMIENTO REP
                      </h5>
                      <p className="text-sm text-gray-600">
                        Levantar Línea Base De Residuos De Productos
                        Prioritarios
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-sm">
                        RUTA CUMPLIMIENTO REP
                      </h5>
                      <p className="text-sm text-gray-600">
                        Operar Bajo Un Sistema De Gestión REP
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-sm">
                        RUTA CUMPLIMIENTO REP
                      </h5>
                      <p className="text-sm text-gray-600">
                        Modelo De Trazabilidad Avanzado
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium text-sm">
                        RUTA CUMPLIMIENTO REP
                      </h5>
                      <p className="text-sm text-gray-600">
                        Chequeos Validados En Auditorías
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

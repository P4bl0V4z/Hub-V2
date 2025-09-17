// src/pages/diagnostic/components/VuRetcCards.tsx
import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";

type VuStage = "inicial" | "transicion" | "avanzada";

interface VuRetcCardProps {
  stage: VuStage;
  completedSteps: number; // Este valor ya no se usa, siempre será 0
}

export function VuRetcCard({ stage, completedSteps }: VuRetcCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getConfig = () => {
    switch (stage) {
      case "inicial":
        return {
          headerColor: "bg-red-600",
          iconColor: "text-red-600",
          badgeText: "EMPRESA INICIAL",
          badgeClass: "bg-red-100 text-red-800 border-red-200",
          progressColor: "bg-red-500",
          message: "¡TE PODEMOS APOYAR! ACTUALMENTE TE ENCUENTRAS EN LA FASE INICIAL DEL PROCESO DE CUMPLIMIENTO RETC. ESTO SIGNIFICA QUE AÚN NO ESTÁS REGISTRADO EN VENTANILLA ÚNICA, POR LO TANTO NO HAS REALIZADO TUS DECLARACIONES. PARA ALCANZAR EL SIGUIENTE NIVEL, DEBES REGISTRARTE Y APERTURAR TUS SECTORIALES PERTINENTES."
        };
      case "transicion":
        return {
          headerColor: "bg-yellow-600",
          iconColor: "text-yellow-600",
          badgeText: "EMPRESA EN TRANSICIÓN",
          badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
          progressColor: "bg-yellow-500",
          message: "¡TE PODEMOS APOYAR! ACTUALMENTE TE ENCUENTRAS EN TRANSICIÓN EN EL PROCESO DE CUMPLIMIENTO RETC. ESTO SIGNIFICA QUE ESTÁS REGISTRADO, SÓLO NECESITAS DECLARAR PARA AVANZAR AL SIGUIENTE NIVEL."
        };
      case "avanzada":
        return {
          headerColor: "bg-green-600",
          iconColor: "text-green-600",
          badgeText: "EMPRESA EN VERDE",
          badgeClass: "bg-green-100 text-green-800 border-green-200",
          progressColor: "bg-green-500",
          message: "¡FELICITACIONES! ACTUALMENTE TE ENCUENTRAS EN LA FASE AVANZADA DEL PROCESO DE CUMPLIMIENTO RETC. ESTO SIGNIFICA QUE ESTÁS AL DÍA CON TU REGISTRO Y DECLARACIONES."
        };
    }
  };

  const config = getConfig();

  // Definir los 5 pasos de la ruta VU-RETC tal como aparece en la imagen
  const getRouteSteps = () => {
    return [
      {
        title: "RUTA VENTANILLA ÚNICA RETC",
        description: "Registra tu establecimiento en RETC",
        color: stage === "inicial" ? "bg-black" : "bg-gray-300", // Negro para empresa inicial en paso 1
        isActive: stage !== "inicial" // Solo activo si no es inicial
      },
      {
        title: "RUTA VENTANILLA ÚNICA RETC", 
        description: "Caracteriza tus procesos productivos, identificando todas las fuentes de emisión, residuos y transferencias",
        color: "bg-red-500", // Rojo
        isActive: false
      },
      {
        title: "RUTA VENTANILLA ÚNICA RETC",
        description: "Apertura Todos Los Sistemas Sectoriales Pertinentes", 
        color: "bg-orange-500", // Naranja
        isActive: false
      },
      {
        title: "RUTA VENTANILLA ÚNICA RETC",
        description: "Completa La Declaración Anual De Emisiones, Residuos Y Transferencias En Plataforma RETC",
        color: "bg-yellow-400", // Amarillo
        isActive: false
      },
      {
        title: "RUTA VENTANILLA ÚNICA RETC",
        description: "Somete Tu Declaración A Verificación Externa, Obtén Aprobación Ministerial Y Asegura La Publicación Del Reporte.",
        color: "bg-green-500", // Verde
        isActive: false
      }
    ];
  };

  const routeSteps = getRouteSteps();

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header dinámico clickeable */}
        <div 
          className={`${config.headerColor} text-white p-4 ${isExpanded ? 'rounded-t-lg' : 'rounded-lg'} flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <CheckCircle className={`w-4 h-4 ${config.iconColor}`} />
            </div>
            <span className="font-semibold text-sm">ESTÁS SUJETO A DECLARAR EN VENTANILLA ÚNICA RETC</span>
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
                  <h3 className="font-semibold text-gray-900">RESULTADOS VENTANILLA ÚNICA RETC</h3>
                </div>
              </div>

              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {config.message}
              </p>

              <p className="text-sm text-gray-500 leading-relaxed">
                El <strong>RETC</strong> (Registro de Emisiones y Transferencia de Contaminantes) es un {stage === "transicion" ? "catálogo" : "sistema"} nacional
                que recopila información sobre emisiones al aire, agua y suelo, y sobre transferencias de residuos de
                establecimientos industriales. Las empresas {stage === "avanzada" ? "deben" : "reportan"} {stage === "avanzada" ? "reportar" : ""} anualmente sus datos ambientales para cumplir con la
                normativa y promover la transparencia {stage === "transicion" || stage === "avanzada" ? "de información ambiental" : ""} hacia la ciudadanía.
              </p>
            </div>

            {/* Estado de Cumplimiento */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">ESTADO DE CUMPLIMIENTO</h3>
                  <p className="text-sm text-gray-600">
                    Basado En Sus Respuestas, {stage === "transicion" ? "Presentamos Una Evaluación Del Nivel De Cumplimiento De Su Empresa Respecto A Los Distintos Hitos Establecidos, Identificando Avances Y Areas Por Mejorar." : "HEMOS EVALUADO EL ESTADO DE SU EMPRESA CON RESPECTO A LOS SIGUIENTES HITOS"}
                  </p>
                </div>
              </div>

              {/* Tarjeta VU-RETC con semáforo */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold">VU - RETC</h4>
                    <p className="text-sm text-gray-600">RESUMEN DEL CUMPLIMIENTO:</p>
                  </div>
                  <Badge className={config.badgeClass}>{config.badgeText}</Badge>
                </div>

                {/* Barra de progreso dinámica - basada en el stage, no en completedSteps */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className={`${config.progressColor} h-3 rounded-full transition-all duration-300`}
                    style={{ 
                      width: `${
                        stage === "inicial" ? 33.33 : 
                        stage === "transicion" ? 66.67 : 
                        stage === "avanzada" ? 100 : 0
                      }%` 
                    }}
                  ></div>
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
                  <h3 className="font-semibold text-gray-900">RECOMENDACIONES INMEDIATAS</h3>
                  <p className="text-sm text-gray-600">
                    ¿Qué Hacer? - Ventanilla Única RETC - Acciones Prioritarias Para Mejorar Su Cumplimiento
                  </p>
                </div>
              </div>

              {/* Ruta VU-RETC con 5 pasos exactos de la imagen */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">TU RUTA VU - RETC</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">¿QUÉ HACER?</span>
                    <Badge variant="secondary">0 DE 5 HITOS COMPLETADOS</Badge>
                  </div>
                </div>

                {/* Representación visual de los 5 pasos como en la imagen */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    {routeSteps.map((step, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-8 h-4 ${step.color} rounded-sm`}></div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full bg-gray-300 h-2 rounded-full relative">
                    <div className="w-2 h-2 bg-black rounded-full absolute left-0 top-0"></div>
                  </div>
                </div>

                {/* Lista detallada de pasos */}
                <div className="space-y-4">
                  {routeSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-4 h-4 ${step.color} rounded-sm mt-1 flex-shrink-0`}></div>
                      <div>
                        <h5 className="font-medium text-sm">{step.title}</h5>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
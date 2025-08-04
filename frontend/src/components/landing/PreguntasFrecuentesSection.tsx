import { useState } from "react";

import preguntas from "@/assets/landing/preguntas-frecuentes.svg";
import flecha2 from '@/assets/landing/flecha2.svg';

const PREGUNTAS_FRECUENTES = [
  {
    label: "¿QUÉ INCLUYE EL SOFTWARE?",
    description: "El software incluye un sistema integral de trazabilidad de ciclo de vida de productos, incluyendo el módulo REP con declaración automática mensual, reportes personalizados y un dashboard de KPIs en tiempo real. Además, tendrás acceso a notificaciones de plazos, validación de datos y soporte técnico especializado para garantizar tu cumplimiento normativo sin complicaciones.",
    key: "incluye"
  },
  {
    label: "¿CÓMO SE INTEGRAN MIS DATOS?",
    description: "La integración es sencilla y flexible: hoy puedes cargar datos mediante Excel en base a nuestras plantillas. Luego, podrás conectar directamente tu ERP a través de API. Nuestro equipo te acompañará durante todo el proceso de onboarding, configurando validaciones personalizadas para asegurar la coherencia de tu información desde el primer día.",
    key: "integracion"
  },
  {
    label: "¿PUEDO PROBARLO ANTES DE CONTRATAR?",
    description: "¡Absolutamente! Ofrecemos una demo personalizada de 14 días con tus propios datos para que compruebes cómo funciona en tu caso específico. Además, te asignamos un consultor especializado que te guiará durante la prueba y responderá todas tus dudas sobre la plataforma y el cumplimiento REP.",
    key: "probar"
  },
  {
    label: "¿SE PUEDEN UTILIZAR AMBOS MÓDULOS SIMULTÁNEAMENTE?",
    description: "Sí, los módulos REP y HUELLA están diseñados para funcionar perfectamente juntos, potenciando sus beneficios mutuos. Esta integración te permite mantener un control total sobre tus obligaciones REP mientras optimizas recursos, evitas duplicidades y obtienes una visión completa de tu gestión ambiental de productos en una sola plataforma.",
    key: "modulos"
  },
  {
    label: "¿CUÁNTO DURA LA LICENCIA?",
    description: "Nuestras licencias son anuales con renovación automática para garantizar continuidad en tu cumplimiento normativo. Incluyen todas las actualizaciones del software, adaptaciones a cambios regulatorios y soporte técnico. Además, ofrecemos descuentos por contratación multianual y por número de usuarios según las necesidades de tu organización",
    key: "licencia"
  }
];

export default function PreguntasFrecuentesSection() {
  const [active, setActive] = useState(PREGUNTAS_FRECUENTES,[0].key);

  const activeObj = PREGUNTAS_FRECUENTES.find(p => p.key === active);

  return (
    <section className="w-full bg-[#fafbfa] flex flex-col items-center py-1 md:py-12 lg:py-20 px-4">
      {/* Título con imagen */}
      <div className="flex flex-col items-center mb-8 md:mb-12 lg:mb-16">
        <img 
          src={preguntas} 
          alt="Preguntas Frecuentes" 
          className="h-auto max-w-full w-64 sm:w-80 md:w-96 lg:w-auto"
          draggable={false}
        />
      </div>
      
      {/* Caja principal */}
      <div className="w-full max-w-7xl border-2 md:border-4 border-black rounded-2xl md:rounded-3xl mb-6 md:mb-32 lg:mb-[100px] mx-auto shadow-md bg-white overflow-hidden">
        
        {/* DESKTOP: Layout horizontal */}
        <div className="hidden lg:flex items-stretch h-[400px] px-[5px]">
          {/* IZQUIERDA: Lista de preguntas */}
          <div className="w-[45%] flex flex-col justify-start pl-[80px] pr-[40px] py-12 gap-[12px]">
            {PREGUNTAS_FRECUENTES.map((p, index) => (
              <div key={p.key} className="flex items-center gap-4 h-[50px]">
                <button
                  onClick={() => setActive(p.key)}
                  className={`font-asap text-left text-[16px] tracking-[1.5px] uppercase transition-all duration-200 leading-tight ${
                    active === p.key 
                      ? 'text-[#02090A] font-bold' 
                      : 'text-[#02090A]/70 font-normal hover:text-[#02090A]/90'
                  }`}
                  style={{ 
                    fontFeatureSettings: '"case" on',
                    fontFamily: 'Asap Expanded, sans-serif',
                    fontWeight: active === p.key ? '700' : '400'
                  }}
                >
                  {p.label}
                </button>
                {active === p.key && (
                  <img 
                    src={flecha2} 
                    alt="flecha activa" 
                    className="w-[93px] h-[22px] ml-[20px] flex-shrink-0" 
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </div>

          {/* DERECHA: Descripción de la pregunta activa */}
          <div className="w-[55%] flex flex-col justify-start py-12 pr-16 pb-10">
            {activeObj && (
              <div className="flex items-start justify-start h-full pt-4">
                <p 
                  className="font-asap text-[17px] tracking-wide text-[#02090A] font-normal leading-relaxed transition-all duration-200" 
                  style={{ 
                    fontFeatureSettings: '"case" on',
                    fontFamily: 'Source Code Pro, sans-serif'
                  }}
                >
                  {activeObj.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE & TABLET: Layout vertical */}
        <div className="lg:hidden p-4 md:p-8">
          {/* Botones de navegación */}
          <div className="flex flex-col gap-2 mb-6 md:mb-8">
            {PREGUNTAS_FRECUENTES.map((p) => (
              <button
                key={p.key}
                onClick={() => setActive(p.key)}
                className={`font-asap text-left text-sm md:text-base tracking-wide uppercase transition-all duration-200 py-3 px-4 rounded-lg ${
                  active === p.key 
                    ? 'text-[#02090A] font-bold bg-gray-100' 
                    : 'text-[#02090A]/70 font-normal hover:text-[#02090A]/90 hover:bg-gray-50'
                }`}
                style={{ 
                  fontFeatureSettings: '"case" on',
                  fontFamily: 'Asap Expanded, sans-serif',
                  fontWeight: active === p.key ? '700' : '400'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Contenido activo */}
          <div className="text-center">
            {activeObj && (
              <div className="flex flex-col items-center gap-4">
                <img 
                  src={flecha2} 
                  alt="flecha activa" 
                  className="w-16 h-4 sm:w-20 sm:h-5" 
                  draggable={false}
                />
                <p 
                  className="font-asap text-sm sm:text-base md:text-lg tracking-wide text-[#02090A] font-normal leading-relaxed max-w-2xl text-left" 
                  style={{ 
                    fontFeatureSettings: '"case" on',
                    fontFamily: 'Source Code Pro, sans-serif'
                  }}
                >
                  {activeObj.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
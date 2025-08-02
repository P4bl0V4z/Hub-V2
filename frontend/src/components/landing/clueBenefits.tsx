import { useState } from "react";
import title from "@/assets/landing/benefitsclue.svg";
import flecha2 from '@/assets/landing/flecha2.svg';

const BENEFICIOS = [
  {
    label: "DIAGNÓSTICO",
    description: "Diagnóstico: Identificamos la brecha a trabajar, y te entregamos un plan de acción.",
    key: "diagnostico"
  },
  {
    label: "CERTIFÍCATE",
    description: "Mide, cumple y certifícate: cuantificamos tu huella de productos, y te acompañamos en la regularización y certificación.",
    key: "certificate"
  },
  {
    label: "AUTOMATIZA",
    description: "Automatiza con software: escala tus resultados con un software ágil y robusto.",
    key: "automatiza"
  }
];

export default function BeneficiosClavesSection() {
  const [active, setActive] = useState(BENEFICIOS[0].key);
  const activeObj = BENEFICIOS.find(b => b.key === active);

  return (
    <section className="w-full bg-[#fafbfa] flex flex-col items-center py-1 md:py-12 lg:py-20 px-4">
      {/* Título con imagen */}
      <div className="flex flex-col items-center mb-8 md:mb-12 lg:mb-16">
        <img 
          src={title} 
          alt="Beneficios Claves del Software" 
          className="h-auto max-w-full w-64 sm:w-80 md:w-96 lg:w-auto"
          draggable={false}
        />
      </div>
      
      {/* Caja principal */}
      <div className="w-full max-w-7xl border-2 md:border-4 border-black rounded-2xl md:rounded-3xl mb-6 md:mb-32 lg:mb-[100px] mx-auto shadow-md bg-white overflow-hidden">
        
        {/* DESKTOP: Layout horizontal */}
        <div className="hidden lg:flex items-stretch h-[200px] px-[5px]">
          {/* IZQUIERDA: Lista de beneficios */}
          <div className="w-[50%] flex flex-col justify-center pl-[100px] py-10 gap-[20px]">
            {BENEFICIOS.map((b) => (
              <div key={b.key} className="flex items-center gap-4 h-[40px]">
                <button
                  onClick={() => setActive(b.key)}
                  className={`font-asap text-left text-[20px] tracking-[1.5px] uppercase transition-all duration-200 ${
                    active === b.key 
                      ? 'text-[#02090A] font-bold' 
                      : 'text-[#02090A]/70 font-normal hover:text-[#02090A]/90'
                  }`}
                  style={{ 
                    fontFeatureSettings: '"case" on',
                    fontFamily: 'Asap Expanded, sans-serif',
                    fontWeight: active === b.key ? '700' : '400'
                  }}
                >
                  {b.label}
                </button>
                {active === b.key && (
                  <img 
                    src={flecha2} 
                    alt="flecha activa" 
                    className="w-[93px] h-[22px] ml-[90px]" 
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </div>

          {/* DERECHA: Solo la descripción, sin label */}
          <div className="w-[50%] flex flex-col justify-center py-10 pr-12 gap-[20px]">
            {BENEFICIOS.map((b) => (
              <div 
                key={b.key} 
                className="h-[40px] flex items-center"
              >
                {active === b.key && (
                  <p 
                    className="font-asap text-[17px] tracking-wide text-[#02090A] font-normal leading-relaxed transition-all duration-200" 
                    style={{ 
                      fontFeatureSettings: '"case" on',
                      fontFamily: 'Source Code Pro, sans-serif'
                    }}
                  >
                    {b.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE & TABLET: Layout vertical */}
        <div className="lg:hidden p-4 md:p-8">
          {/* Botones de navegación */}
          <div className="flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-4 mb-6 md:mb-8">
            {BENEFICIOS.map((b) => (
              <button
                key={b.key}
                onClick={() => setActive(b.key)}
                className={`font-asap text-center text-sm sm:text-base md:text-lg tracking-wide uppercase transition-all duration-200 py-2 px-3 sm:px-4 rounded-lg ${
                  active === b.key 
                    ? 'text-[#02090A] font-bold bg-gray-100' 
                    : 'text-[#02090A]/70 font-normal hover:text-[#02090A]/90 hover:bg-gray-50'
                }`}
                style={{ 
                  fontFeatureSettings: '"case" on',
                  fontFamily: 'Asap Expanded, sans-serif',
                  fontWeight: active === b.key ? '700' : '400'
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Contenido activo (solo descripción) */}
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
                  className="font-asap text-sm sm:text-base md:text-lg tracking-wide text-[#02090A] font-normal leading-relaxed max-w-2xl" 
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

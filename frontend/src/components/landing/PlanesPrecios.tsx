import React, { useState } from 'react';
import elige from "@/assets/landing/elige.svg";
import estrella from "@/assets/landing/estrella.svg";
import estrellaVerde from "@/assets/landing/estrella-verde.svg";

// Tipos/Interfaces
interface Plan {
  id: number;
  nombre: string;
  tipo: 'SIMPLE' | 'PRO' | 'ENTERPRISE';
  caracteristicas: string[];
  estrellas: number;
  destacado?: boolean;
}

interface PlanesPrecios {
  className?: string;
}

const PlanesPrecios: React.FC<PlanesPrecios> = ({ className = '' }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const planes: Plan[] = [
    {
      id: 1,
      nombre: 'PLAN SIMPLE',
      tipo: 'SIMPLE',
      caracteristicas: [
        'Licencia anual software'
      ],
      estrellas: 1
    },
    {
      id: 2,
      nombre: 'PLAN PRO',
      tipo: 'PRO',
      caracteristicas: [
        'Licencia anual software',
        'Capacitación RFP',
        'Diagnóstico',
        'Cumplimiento crítico',
        'Cumplimiento 100% vía telemática'
      ],
      estrellas: 3
    },
    {
      id: 3,
      nombre: 'PLAN ENTERPRISE',
      tipo: 'ENTERPRISE',
      caracteristicas: [
        'Licencia Anual Software',
        'Diagnóstico',
        'Cumplimiento Crítico',
        'Cumplimiento 100%',
        'Ejecutivo Dedicado'
      ],
      estrellas: 5,
      destacado: true
    }
  ];

  const renderEstrellas = (cantidad: number, planId: number) => {
    const isHovered = hoveredCard === planId;
    
    return (
      <div className="flex justify-center gap-1">
        {Array.from({ length: cantidad }, (_, index) => (
          <img
            key={index}
            src={isHovered ? estrellaVerde : estrella}
            alt="Estrella"
            className="w-8 h-8 transition-all duration-300"
            draggable={false}
          />
        ))}
      </div>
    );
  };

  return (
    <section className={`w-full bg-gray-50 py-40 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Título principal con imagen */}
        <div className="text-center mb-16">
          <img 
            src={elige}
            alt="Elige tu plan y comencemos"
            className="mx-auto h-auto max-w-2xl w-full"
            draggable={false}
          />
        </div>

        {/* Cards de planes */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch mb-[100px]">
          {planes.map((plan: Plan) => (
            <div 
              key={plan.id}
              className="bg-white border-4 border-black rounded-2xl p-8 flex-1 max-w-sm mx-auto lg:mx-0 hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              onMouseEnter={() => setHoveredCard(plan.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Título del plan */}
              <h3 
                className="text-black text-lg font-bold mb-6 text-center tracking-wide"
                style={{ 
                  fontFamily: 'Asap Expanded, sans-serif',
                  fontFeatureSettings: '"case" on'
                }}
              >
                {plan.nombre}
              </h3>

              {/* Línea separadora */}
              <div className="w-full border-t-2 border-black mb-6"></div>

              {/* Características - flex-grow para ocupar espacio disponible */}
              <div className="space-y-1 mb-6 flex-grow">
                {plan.caracteristicas.map((caracteristica, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-black mr-2">-</span>
                    <p 
                      className="text-black text-sm leading-relaxed"
                      style={{ 
                        fontFamily: 'Source Code Pro, sans-serif'
                      }}
                    >
                      {caracteristica}
                    </p>
                  </div>
                ))}
              </div>

              {/* Línea separadora */}
              <div className="w-full border-t-2 border-black mb-6"></div>

              {/* Estrellas - siempre al final */}
              {renderEstrellas(plan.estrellas, plan.id)}
            </div>
          ))}
        </div>

        {/* Botón CTA */}
        <div className="flex justify-center">
          <button 
            className="bg-transparent border-4 border-black text-black px-[40px] py-[15px] rounded-3xl font-bold tracking-wide hover:border-2 transition-all duration-3000"
            style={{ 
              fontFamily: 'Asap Expanded, sans-serif',
              fontFeatureSettings: '"case" on'
            }}
          >
            EMPIEZA AHORA
          </button>
        </div>
      </div>
    </section>
  );
};

export default PlanesPrecios;
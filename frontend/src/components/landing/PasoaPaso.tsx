import React from 'react';
import paso from "@/assets/landing/paso-a-paso.svg";
import cruz from "@/assets/landing/cruz.svg";
import botella from "@/assets/landing/botella.svg";
import reporte from "@/assets/landing/reporte.svg";

interface PasoAPasoProps {
  className?: string;
}

const PasoAPaso: React.FC<PasoAPasoProps> = ({ className = '' }) => {
  return (
    <section className={`w-full bg-[#02090A] pt-[180px] pb-0 ${className}`}>
      <div className="max-w-7xl h-[600px] mx-auto px-4">
        {/* Título principal */}
        <div className="flex flex-col items-center mb-16">
          <img 
            src={paso}
            alt="PASO A PASO."
            className="h-[20px] md:h-[20px] w-auto mb-[15px]"
            draggable={false}
          />
          <p 
            className="text-white/80 text-sm tracking-[2px] uppercase"
            style={{ 
              fontFamily: 'Asap Expanded, sans-serif',
              fontFeatureSettings: '"case" on'
            }}
          >
            IMPLEMENTACIÓN SIMPLIFICADA
          </p>
        </div>

        {/* Cards de pasos: cada una editable por separado */}
        <div className="flex flex-col lg:flex-row gap-16 justify-center items-stretch">
          {/* Carta 1 */}
          <div 
            className="bg-transparent border-4 border-white rounded-2xl p-8  max-w-sm mx-auto lg:mx-0 hover:border-[#05DD71] transition-all duration-300"
          >
            <div className="mb-6">
              <img 
                src={cruz} 
                alt="Icono conecta tu operación"
                className="w-12 h-12"
                draggable={false}
              />
            </div>
            <h3 
              className="text-white text-lg  mb-4 leading-tight tracking-wide"
              style={{ 
                fontFamily: 'Asap Expanded, sans-serif',
                fontFeatureSettings: '"case" on'
              }}
            >
              CONECTA TU OPERACIÓN
            </h3>
            <p 
              className="text-white/70 text-sm leading-relaxed tracking-wide"
              style={{ fontFamily: 'Source Code Pro, sans-serif' }}
            >
              Carga tus productos y su información.
            </p>
          </div>

          {/* Carta 2 */}
          <div 
            className="bg-transparent border-4 border-white rounded-2xl  p-8 max-w-sm mx-auto lg:mx-0 hover:border-[#05DD71] transition-all duration-300"
          >
            <div className="mb-6">
              <img 
                src={botella} 
                alt="Icono gestión de productos"
                className="w-12 h-12"
                draggable={false}
              />
            </div>
            <h3 
              className="text-white text-lg  mb-4 leading-tight tracking-wide"
              style={{ 
                fontFamily: 'Asap Expanded, sans-serif',
                fontFeatureSettings: '"case" on'
              }}
            >
              GESTIÓN EL MAESTRO DE PRODUCTOS E INVENTARIOS
            </h3>
            <p 
              className="text-white/70 text-sm leading-relaxed tracking-wide"
              style={{ fontFamily: 'Source Code Pro, sans-serif' }}
            >
              Regula y certifica la medición de huella de tu portafolio de productos.
            </p>
          </div>

          {/* Carta 3 */}
          <div 
            className="bg-transparent border-4 border-white rounded-2xl p-8 max-w-sm mx-auto lg:mx-0 hover:border-[#05DD71] transition-all duration-300"
          >
            <div className="mb-6">
              <img 
                src={reporte} 
                alt="Icono reportes"
                className="w-12 h-12"
                draggable={false}
              />
            </div>
            <h3 
              className="text-white text-lg mb-4 leading-tight tracking-wide"
              style={{ 
                fontFamily: 'Asap Expanded, sans-serif',
                fontFeatureSettings: '"case" on'
              }}
            >
              GENERA REPORTES E INFORMES DE HUELLA
            </h3>
            <p 
              className="text-white/70 text-sm leading-relaxed tracking-wide"
              style={{ fontFamily: 'Source Code Pro, sans-serif' }}
            >
              Gestión de maestros de productos e inventarios.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasoAPaso;

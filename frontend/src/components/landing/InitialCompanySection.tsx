import empresaInicial from "@/assets/landing/empresa-inicial.svg";
import flecha from "@/assets/landing/flecha.svg";

export default function InitialCompanySection() {
  return (
    <section id="usuarios" className="bg-[#fafbfa] w-full flex flex-col items-center py-16 sm:py-24 md:py-32 lg:py-48 relative px-4 sm:px-6 lg:px-8">
      {/* Contenedor relativo para superponer la flecha */}
      <div className="w-full max-w-7xl mx-auto relative flex flex-col items-center">
        {/* Flecha: absolutamente posicionada FUERA de la caja */}
        <img
          src={flecha}
          alt="Flecha derecha"
          className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 absolute -top-12 sm:-top-16 lg:-top-20 left-2 sm:left-4 lg:-left-1 z-20"
          style={{transform: "translateY(-40%)"}}
          draggable={false}
        />

        {/* Caja principal */}
        <div className="w-full border-2 sm:border-4 border-black rounded-2xl sm:rounded-3xl flex flex-col lg:flex-row items-center px-4 sm:px-8 lg:px-[50px] py-6 sm:py-8 lg:py-[30px] bg-white gap-4 lg:gap-8 min-h-[200px] sm:min-h-[180px] lg:min-h-[160px]">
          
          {/* Imagen empresa-inicial */}
          <div className="flex-1 flex items-center justify-center lg:justify-start order-1 lg:order-1">
            <img
              src={empresaInicial}
              alt="EMPRESA INICIAL"
              className="max-h-12 sm:max-h-16 md:max-h-20 lg:max-h-24 w-auto"
              draggable={false}
            />
          </div>

          {/* Descripción */}
          <div className="flex-1 flex items-center justify-center lg:justify-end order-2 lg:order-2">
            <p className="text-xs sm:text-sm md:text-base text-black tracking-wide max-w-md font-mono text-center lg:text-right leading-relaxed">
              Empresa que <b>no cuenta con el equipo técnico</b> para cumplir con la <b>Ley REP</b> de forma eficiente, lo que implica <b>riesgos regulatorios, reputacionales</b>, y posibles <b>sanciones elevadas</b>.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
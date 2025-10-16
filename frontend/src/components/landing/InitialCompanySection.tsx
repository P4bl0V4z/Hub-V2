import { useState } from "react";
import empresaInicial from "@/assets/landing/empresa-inicial.svg";
import empresaTransicion from "@/assets/landing/empresa-transición.svg";
import empresaAvanzada from "@/assets/landing/empresa-avanzada.svg";
import flecha from "@/assets/landing/flecha.svg";
import inicial from "@/assets/landing/inicial.svg";
import transicion from "@/assets/landing/en-transición.svg";
import avanzada from "@/assets/landing/avanzada.svg";
import guincha from "@/assets/landing/guincha.svg";

export default function InitialCompanySection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Datos de cada slide
  const slides = [
    {
      id: 0,
      logo: empresaInicial,
      background: inicial,
      title: "EMPRESA INICIAL",
      description: (
        <>
          Empresa que <b>no cuenta con el equipo técnico</b> para cumplir con la{" "}
          <b>Ley REP</b> de forma eficiente, lo que implica{" "}
          <b>riesgos regulatorios, reputacionales</b>, y posibles{" "}
          <b>sanciones elevadas</b>.
        </>
      ),
    },
    {
      id: 1,
      logo: empresaTransicion,
      background: transicion,
      title: "EMPRESA EN TRANSICIÓN",
      description: (
        <>
          La empresa ya cumple parcialmente con la Ley REP, está en un sistema
          de gestión, yo declara mensual, pero sus procesos son manuales,
          desarticulados y se dificulta la trazabilidad de productos prioritarios
          REP. Aún hay riesgos de posible sanción o multa.
        </>
      ),
    },
    {
      id: 2,
      logo: empresaAvanzada,
      background: avanzada,
      title: "EMPRESA AVANZADA",
      description: (
        <>
          La empresa ha logrado un alto nivel de cumplimiento REP. Faltan herramientas
          que automaticen y escalen procesos de trazabilidad del ciclo de vida de productos
          prioritarios REP.
        </>
      ),
    },
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      id="usuarios"
      className="w-full flex flex-col items-center py-32 sm:py-40 md:py-48 lg:py-64 relative px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-in-out overflow-hidden"
      style={{
        backgroundImage: `url(${slides[currentSlide].background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Guincha en la esquina superior izquierda - MÁS GRANDE */}
      <img
        src={guincha}
        alt="Guincha decorativa"
        className="absolute top-0 left-0 z-50"
        style={{
          width: "350px",
          height: "auto",
          maxWidth: "40vw",
        }}
        draggable={false}
      />

      {/* Contenedor relativo para superponer la flecha */}
      <div className="w-full max-w-7xl mx-auto relative flex flex-col items-center">
        {/* Flecha interactiva: MÁS GRANDE */}
        <button
          onClick={handleNext}
          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 absolute -top-16 sm:-top-20 lg:-top-24 left-2 sm:left-4 lg:-left-2 z-20 transition-transform duration-300 ease-in-out hover:scale-125 cursor-pointer focus:outline-none active:scale-110"
          style={{ transform: "translateY(-40%)" }}
          aria-label="Siguiente slide"
        >
          <img
            src={flecha}
            alt="Flecha derecha"
            className="w-full h-full"
            draggable={false}
          />
        </button>

        {/* Caja principal con transición - MÁS GRANDE */}
        <div className="w-full border-4 sm:border-6 border-white rounded-3xl sm:rounded-4xl flex flex-col lg:flex-row items-center px-8 sm:px-12 lg:px-[80px] py-10 sm:py-12 lg:py-[50px] bg-transparent gap-6 lg:gap-12 min-h-[320px] sm:min-h-[300px] lg:min-h-[280px]">
          {/* Imagen empresa - MÁS GRANDE */}
          <div className="flex-1 flex items-center justify-center lg:justify-start order-1 lg:order-1">
            <img
              src={slides[currentSlide].logo}
              alt={slides[currentSlide].title}
              className="max-h-20 sm:max-h-24 md:max-h-32 lg:max-h-40 w-auto transition-opacity duration-500"
              draggable={false}
              key={`logo-${currentSlide}`}
            />
          </div>

          {/* Descripción - TEXTO MÁS GRANDE */}
          <div className="flex-1 flex items-center justify-center lg:justify-end order-2 lg:order-2">
            <p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white tracking-wide max-w-2xl font-mono text-center lg:text-right leading-relaxed transition-opacity duration-500"
              key={`text-${currentSlide}`}
            >
              {slides[currentSlide].description}
            </p>
          </div>
        </div>

        {/* Indicadores de slide - MÁS GRANDES */}
        <div className="flex gap-3 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "bg-white w-12"
                  : "bg-white/50 hover:bg-white/75 w-3"
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
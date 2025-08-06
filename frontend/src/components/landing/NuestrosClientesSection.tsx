import nuestrosClientesTitle from "@/assets/landing/nuestros-clientes.svg";
import laboratoriaIcon from "@/assets/landing/laboratorio-chile.svg";
import freeMeetIcon from "@/assets/landing/free_meet.svg";
import marleyIcon from "@/assets/landing/marley.svg";
import tevaIcon from "@/assets/landing/teva.svg";

export default function NuestrosClientesSection() {
  return (
    <section id = "clientes"
      className="
        w-full 
        bg-white 
        flex flex-col items-center 
        py-10 
        md:py-16 
        xl:py-20 
        h-auto 
        xl:h-[500px]
      "
    >
      {/* Título */}
      <img
        src={nuestrosClientesTitle}
        alt="Nuestros Clientes"
        className="
          w-[250px] 
          md:w-[350px] 
          xl:w-[400px] 
          mb-10 
          xl:mb-20
        "
      />

      {/* Logos */}
      <div
        className="
          w-full 
          max-w-[1940px] 
          flex flex-wrap 
          justify-center 
          items-center 
          gap-x-20 
          gap-y-10 
          px-6 
          xl:px-20
        "
      >
        {/* 1. Laboratoria Chile */}
        <div className="w-24 h-12 md:w-32 md:h-16 flex items-center justify-center">
          <img src={laboratoriaIcon} alt="Laboratoria Chile" className="max-w-full max-h-full object-contain" />
        </div>

        {/* 2. Teva */}
        <div className="w-24 h-12 md:w-32 md:h-16 flex items-center justify-center">
          <img src={tevaIcon} alt="Teva" className="max-w-full max-h-full object-contain" />
        </div>

        {/* 3. FreeMeet */}
        <div className="w-24 h-12 md:w-32 md:h-16 flex items-center justify-center">
          <img src={freeMeetIcon} alt="Free Meet" className="max-w-full max-h-full object-contain" />
        </div>

        {/* 4. Marley */}
        <div className="w-24 h-12 md:w-32 md:h-16 flex items-center justify-center">
          <img src={marleyIcon} alt="Marley" className="max-w-full max-h-full object-contain" />
        </div>
      </div>
    </section>
  );
}

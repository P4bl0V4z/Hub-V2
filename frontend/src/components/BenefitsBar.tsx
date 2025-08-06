import iconReport from "@/assets/landing/form.svg"
import iconAutomation from "@/assets/landing/checklist.svg";
import iconFootprint from "@/assets/landing/files.svg";
import iconFine from "@/assets/landing/error_file.svg";

const benefits = [
  {
    icon: iconReport,
    title: "Centraliza",
    desc: ["Tus Reportes", "Ambientales"],
  },
  {
    icon: iconAutomation,
    title: "Automatiza",
    desc: ["Tareas", "Repetitivas"],
  },
  {
    icon: iconFootprint,
    title: "Calcula Tu",
    desc: ["Huella De", "Productos"],
  },
  {
    icon: iconFine,
    title: "Evita",
    desc: ["Multas Por", "Incumplimiento"],
  },
];

export default function BenefitsBar() {
  return (
    <>
      {/* Barra de Beneficios */}
      <section className="bg-black w-full flex justify-center items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="
          w-full max-w-[1200px]
          border-2 sm:border-4 border-[#05DD71]
          rounded-2xl sm:rounded-3xl
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8
          px-4 sm:px-8 lg:px-[50px] py-6 sm:py-8 lg:py-[30px]
          bg-[#000]
        ">
          {benefits.map((b, idx) => (
            <div 
              key={idx} 
              className="flex flex-row sm:flex-col lg:flex-row items-center sm:items-center lg:items-center gap-3 sm:gap-4 text-center sm:text-center lg:text-left"
            >
              <img 
                src={b.icon} 
                alt={b.title} 
                className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 flex-shrink-0" 
              />
              <div className="flex-1">
                <div className="text-white font-normal text-sm sm:text-base lg:text-lg tracking-wide sm:tracking-widest font-['Source_Code_Pro'] mb-1">
                  {b.title}
                </div>
                {b.desc.map((line, i) => (
                  <div
                    key={i}
                    className="text-white font-mono text-xs sm:text-sm lg:text-base tracking-wide sm:tracking-widest font-['Source_Code_Pro'] opacity-90"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Espacio extra negro abajo */}
      <div className="w-full h-[60px] sm:h-[80px] lg:h-[120px] bg-[#000]" />
    </>
  );
}
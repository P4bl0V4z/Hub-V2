import heroImg from '../../assets/landing/hero-illustration.png';
import cumple from '../../assets/landing/cumple.svg';

export default function HeroSection() {
  return (
    <section className="bg-black min-h-screen text-white flex flex-col">
      {/* Contenedor principal que crece y centra el contenido */}
      <div className="flex-grow flex items-center py-8 sm:py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Columna de texto */}
            <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1">
              <img
                src={cumple}
                alt="Texto cumple con la ley REP"
                className="max-w-full h-auto mb-4 sm:mb-6 mx-auto lg:mx-0 w-full max-w-md sm:max-w-lg lg:max-w-full"
                draggable={false}
              />
              
              <p className="mt-4 sm:mt-6 mb-6 sm:mb-8 font-['Source_Code_Pro'] tracking-wide sm:tracking-wider text-sm sm:text-base lg:text-lg leading-relaxed px-4 sm:px-0">
                Automatiza tu gestión de productos prioritarios
              </p>
              
              <button className="border-white mt-4 sm:mt-8 lg:mt-12 px-6 sm:px-8 lg:px-[30px] py-3 sm:py-4 lg:py-[12px] uppercase font-medium rounded-2xl sm:rounded-3xl font-bold border-2 sm:border-4 tracking-wide sm:tracking-wider hover:border-[#05DD71] hover:text-[#05DD71] transition-all duration-300 text-xs sm:text-sm lg:text-base">
                Pide tu demo gratis
              </button>
            </div>

            {/* Columna de imagen */}
            <div className="w-full lg:w-1/2 flex justify-center order-1 lg:order-2">
              <img
                src={heroImg}
                alt="Hero Ilustración BeLoop"
                className="max-w-full h-auto w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
                draggable={false}
              />
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
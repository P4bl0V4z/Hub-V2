import logo from "@/assets/landing/logo_beloop.svg";
import corfoLogo from "@/assets/landing/corfo.svg";
import mailIcon from "@/assets/landing/mail.svg";
import whatsappIcon from "@/assets/landing/whatsapp.svg";
import linkedinIcon from "@/assets/landing/linkedin.svg";
import instagramIcon from "@/assets/landing/instagram.svg";
import facebookIcon from "@/assets/landing/facebook.svg";
import youtubeIcon from "@/assets/landing/youtube.svg";
import globeIcon from "@/assets/landing/beloop.svg";
import sumateText from "@/assets/landing/sumate-ts.svg";
import suscribete from "@/assets/landing/suscribete_al_newsletter.svg";

export default function Footer() {
  return (
    <footer className="w-full bg-[#000] border-t-4 border-[#05DD71] text-[#F9F9F9]">
      {/* Contenedor general con padding responsivo */}
      <div className="w-full px-4 sm:px-6 md:pl-[50px] md:pr-[10px] py-[50px]">
        {/* Contenido central responsivo */}
        <div className="w-full ml-6 pr-8 flex flex-col md:flex-row justify-between items-start gap-12">
          
          {/* Columna izquierda */}
          <div className="flex flex-col items-start gap-4">
            <img src={logo} alt="BeLoop Logo" className="h-14" />
            <img src={sumateText} alt="Súmate a la transición circular" className="w-auto h-auto" />

            {/* Correos */}
            <div className="flex flex-col gap-1 mt-1">
              <div className="text-[18px] font-semibold leading-[23px] font-['Source_Code_Pro'] [font-feature-settings:'salt'_on,'liga'_off]">
                <span className="text-[#F9F9F9]">Ventas:</span> gabriel@beloop.io
              </div>
              <div className="text-[18px] font-semibold leading-[23px] font-['Source_Code_Pro'] [font-feature-settings:'salt'_on,'liga'_off]">
                <span className="text-[#F9F9F9]">Asuntos corporativos:</span> contacto@beloop.io
              </div>
              <div className="text-[18px] font-semibold leading-[23px] font-['Source_Code_Pro'] [font-feature-settings:'salt'_on,'liga'_off]">
                <span className="text-[#F9F9F9]">Operaciones:</span> operaciones.beloop@gmail.com
              </div>
            </div>

            {/* Íconos sociales */}
            <div className="flex gap-3 mt-2 flex-wrap">
              {[mailIcon, whatsappIcon, linkedinIcon, instagramIcon, facebookIcon, youtubeIcon, globeIcon].map((icon, idx) => (
                <a key={idx} href="#" target="_blank" rel="noopener noreferrer">
                  <img src={icon} alt={`social-${idx}`} className="h-5" />
                </a>
              ))}
            </div>

            <div className=" text-gray-400 text-xs font-mono mt-3">
              Copyright | 2025 beloop.io
            </div>
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col items-end justify-between w-full md:w-auto">

            <div>
                <img
                  src={suscribete}
                  alt="SUSCRÍBETE AL NEWSLETTER"
                  className="w-auto max-w-[300px] md:max-w-[340px] lg:max-w-[380px]"
                />
            </div>

            <div className="text-right mt-12">
              <img src={corfoLogo} alt="CORFO" className="h-[6vw] ml-auto" />
            </div>

            <div className="text-[.65rem] font-mono text-right opacity-70 mt-[60px]">
              Términos y condiciones&nbsp;|&nbsp;Política de privacidad&nbsp;|&nbsp;Política de calidad
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

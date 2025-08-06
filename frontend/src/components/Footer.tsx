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
    <footer className="w-full bg-[#000] border-t-[15px] border-[#05DD71] text-[#F9F9F9]">
      <div className="w-full px-4 sm:px-6 md:pl-[50px] md:pr-[10px] py-[20px]">
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

            {/* Íconos sociales con enlaces específicos */}
            <div className="flex gap-3 mt-2 flex-wrap">
              {/* Reemplaza los href con las URLs reales de tus redes */}
              <a href="gabriel@beloop.io" target="_blank" rel="noopener noreferrer">
                <img src={mailIcon} alt="Email" className="h-5" />
              </a>
              <a href="https://wa.me/+56996917263" target="_blank" rel="noopener noreferrer">
                <img src={whatsappIcon} alt="WhatsApp" className="h-5" />
              </a>
              <a href="https://www.linkedin.com/company/beloop" target="_blank" rel="noopener noreferrer">
                <img src={linkedinIcon} alt="LinkedIn" className="h-5" />
              </a>
              <a href="https://www.instagram.com/beloop.io" target="_blank" rel="noopener noreferrer">
                <img src={instagramIcon} alt="Instagram" className="h-5" />
              </a>
              <a href="https://web.facebook.com/p/Beloop-Chile-100063857302587" target="_blank" rel="noopener noreferrer">
                <img src={facebookIcon} alt="Facebook" className="h-5" />
              </a>
              <a href="https://www.youtube.com/@beloopcircular" target="_blank" rel="noopener noreferrer">
                <img src={youtubeIcon} alt="YouTube" className="h-5" />
              </a>
              <a href="https://beloop.io" target="_blank" rel="noopener noreferrer">
                <img src={globeIcon} alt="Sitio web" className="h-5" />
              </a>
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

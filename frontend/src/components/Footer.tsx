
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t py-6 mt-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">BeLoop</h3>
            <p className="text-sm text-muted-foreground">
              Plataforma líder en gestión de ciclo de vida para una economía circular.
              Soluciones integrales para el cumplimiento normativo y la sostenibilidad empresarial.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Soluciones</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/inventory" className="text-muted-foreground hover:text-foreground">Gestión de Inventario</Link></li>
              <li><Link to="/compliance" className="text-muted-foreground hover:text-foreground">Cumplimiento REP</Link></li>
              <li><Link to="/modules" className="text-muted-foreground hover:text-foreground">Módulos especializados</Link></li>
              <li><Link to="/reports" className="text-muted-foreground hover:text-foreground">Reportes de sostenibilidad</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/academy" className="text-muted-foreground hover:text-foreground">Academia BeLoop</Link></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Webinars</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Casos de éxito</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">contacto@beloop.com</li>
              <li className="text-muted-foreground">+34 911 234 567</li>
              <li className="text-muted-foreground">C/ Gran Vía 123, Madrid</li>
              <li className="flex space-x-4 mt-4">
                <a href="#" className="text-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="text-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="text-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} BeLoop. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="text-xs text-muted-foreground hover:text-foreground">Términos de servicio</Link>
            <Link to="#" className="text-xs text-muted-foreground hover:text-foreground">Política de privacidad</Link>
            <Link to="#" className="text-xs text-muted-foreground hover:text-foreground">Cookies</Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            BeLoop cumple con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos y Garantía de los Derechos Digitales.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

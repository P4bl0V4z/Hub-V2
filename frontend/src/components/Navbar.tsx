import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/landing/logo_beloop.svg';
import orn from '../assets/landing/orn.svg';
import glass from '../assets/landing/glass.svg';
import user from '../assets/landing/user.svg';

const navLinks = [
  { label: 'Usuarios', href: '/usuarios' },
  { label: 'Beneficios', href: '/beneficios' },
  { label: 'Paso A Paso', href: '/paso-a-paso' },
  { label: 'Planes', href: '/planes' },
  { label: 'Clientes', href: '/clientes' },
];

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[#000] border-b-[3px] border-[#05DD71] z-50">
      <div className="w-full mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 h-[80px] sm:h-[90px] md:h-[104px] overflow-x-hidden">
        
        {/* Logo */}
        <a href="/" className="flex-shrink-0 flex items-center">
          <img src={logo} alt="BeLoop logo" className="h-6 sm:h-8 md:h-10 w-auto" />
        </a>

        {/* Nav links: desktop */}
        <ul className="hidden md:flex gap-6 lg:gap-10 flex-1 justify-center overflow-x-auto">
          {navLinks.map(link => (
            <li key={link.label} className="flex-shrink-0">
              <a
                href={link.href}
                className={`
                  text-[#F9F9F9]
                  text-sm lg:text-base
                  tracking-widest
                  transition-all
                  duration-300
                  hover:text-[#05DD71]
                  whitespace-nowrap
                  ${currentPath === link.href
                    ? 'font-bold'
                    : 'font-thin opacity-80'}
                `}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile menu button + Icons */}
        <div className="flex items-center gap-2 justify-end flex-shrink-0">
          {/* Hamburger menu button - solo visible en móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-6 h-6 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-[#F9F9F9] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-[#F9F9F9] transition-all duration-300 my-1 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-[#F9F9F9] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </button>

          {/* Icons */}
          {[orn, glass, user].map((icon, idx) => (
            <div key={idx} className="h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center cursor-pointer">
              <img
                src={icon}
                alt={`icon-${idx}`}
                className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      <div className={`md:hidden bg-[#000] border-t border-[#05DD71] transition-all duration-300 overflow-hidden ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <ul className="py-4 px-4 space-y-3">
          {navLinks.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  block text-[#F9F9F9]
                  text-sm
                  tracking-wide
                  py-2
                  transition-all
                  duration-300
                  hover:text-[#05DD71]
                  hover:pl-2
                  ${currentPath === link.href
                    ? 'font-bold text-[#05DD71]'
                    : 'font-thin opacity-80'}
                `}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext'; // Adjust the import path as necessary
import logo from '../assets/landing/logo_beloop.svg';
import orn from '../assets/landing/orn.svg';
import glass from '../assets/landing/glass.svg';
import userIcon from '../assets/landing/user.svg';

const navLinks = [
  { label: 'Usuarios', href: '#usuarios' },
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Paso A Paso', href: '#paso-a-paso' },
  { label: 'Planes', href: '#planes' },
  { label: 'Clientes', href: '#clientes' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = encodeURIComponent(`${location.pathname}${location.search}${location.hash || ''}`);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  // Cerrar menú usuario al click fuera
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const getInitial = () => {
    const source = user?.name || user?.email || '';
    return source.trim().charAt(0).toUpperCase() || '?';
  };

  const handleUserClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${redirect}`);
      return;
    }
    setIsUserMenuOpen(v => !v);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <nav className="w-full bg-[#000] border-b-[6px] border-[#05DD71] z-50">
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
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="
                  text-[#F9F9F9]
                  text-sm lg:text-base
                  tracking-widest
                  transition-all
                  duration-300
                  hover:text-[#05DD71]
                  whitespace-nowrap
                  font-thin opacity-80
                "
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile menu button + Icons */}
        <div className="flex items-center gap-2 justify-end flex-shrink-0">
          {/* Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-6 h-6 cursor-pointer"
            aria-label="Abrir menú"
            aria-expanded={isMenuOpen}
          >
            <span className={`block w-5 h-0.5 bg-[#F9F9F9] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#F9F9F9] transition-all duration-300 my-1 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[#F9F9F9] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </button>

          {/* Otros íconos */}
          {[orn, glass].map((icon, idx) => (
            <div key={idx} className="h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center">
              <img
                src={icon}
                alt={`icon-${idx}`}
                className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8"
              />
            </div>
          ))}

          {/* Usuario: vacío → /login | autenticado → inicial + menú */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={handleUserClick}
              className="h-6 w-6 sm:h-8 sm:w-8 flex items-center justify-center focus:outline-none"
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              aria-label={isAuthenticated ? 'Cuenta' : 'Ingresar'}
            >
              {!isAuthenticated ? (
                <img
                  src={userIcon}
                  alt="Ingresar"
                  className="h-4 w-4 sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-8 lg:w-8"
                />
              ) : (
                <div
                  title={user?.name || user?.email}
                  className="flex items-center justify-center rounded-full h-6 w-6 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10
                             bg-[#05DD71] text-[#000] font-semibold text-xs sm:text-sm"
                >
                  {getInitial()}
                </div>
              )}
            </button>

            {isAuthenticated && isUserMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-10 min-w-44 rounded-2xl border border-[#05DD71]/30 bg-[#0b0b0b] shadow-xl z-[60] overflow-hidden"
              >
                <div className="px-4 py-3 text-[#F9F9F9] opacity-80 text-sm">
                  {user?.name || user?.email}
                </div>
                <div className="h-px bg-[#05DD71]/30" />
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-[#F9F9F9] opacity-90 hover:opacity-100 hover:text-[#05DD71] transition"
                  role="menuitem"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Mi perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-[#F9F9F9] opacity-90 hover:opacity-100 hover:text-[#05DD71] transition"
                  role="menuitem"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
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
                onClick={(e) => handleAnchorClick(e, link.href)}
                className="
                  block text-[#F9F9F9]
                  text-sm
                  tracking-wide
                  py-2
                  transition-all
                  duration-300
                  hover:text-[#05DD71]
                  hover:pl-2
                  font-thin opacity-80
                "
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

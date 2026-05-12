import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { name: 'Portada', path: '/' },
  { name: 'Galería', path: '/gallery' },
  { name: 'Visualizador 3D', path: '/3d' },
  { name: 'Estudio', path: '/about' },
  { name: 'Contacto', path: '/contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-ink-black/80 backdrop-blur-md py-4' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link 
          to="/" 
          className="text-2xl font-serif tracking-tighter hover:text-ink-red transition-colors"
        >
          ART IN INK
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-12">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm tracking-[0.2em] uppercase font-medium transition-all hover:text-ink-red relative py-1 ${
                location.pathname === link.path ? 'text-white' : 'text-ink-silver/60'
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-ink-red"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile Nav Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X strokeWidth={1} /> : <Menu strokeWidth={1} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-ink-black z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-serif tracking-widest uppercase hover:text-ink-red transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

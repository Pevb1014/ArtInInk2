import React from 'react';
import { motion } from 'motion/react';
import { STUDIO_DATA } from '../lib/constants';

export const Footer = () => {
  return (
    <footer className="py-24 px-6 border-t border-ink-charcoal">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-4xl font-serif mb-8 tracking-tighter">ArtInInk Studio</h2>
          <p className="text-ink-silver/50 max-w-sm mb-12 leading-relaxed">
            Elevando el arte del tatuaje a través de la precisión visual y la 
            innovación tecnológica. Bogotá D.C.
          </p>
        </div>
        
        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] font-medium mb-8 text-white">Horarios</h3>
          <ul className="space-y-4">
            {STUDIO_DATA.hours.map((h) => (
              <li key={h.day} className="flex justify-between text-sm text-ink-silver/60">
                <span>{h.day}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] font-medium mb-8 text-white">Navegación</h3>
          <ul className="space-y-4 text-sm text-ink-silver/60">
            <li><a href="/" className="hover:text-white transition-colors">Inicio</a></li>
            <li><a href="/gallery" className="hover:text-white transition-colors">Gallería</a></li>
            <li><a href="/3d" className="hover:text-white transition-colors">Visualizador 3D</a></li>
            <li><a href="/contact" className="hover:text-white transition-colors">Citas</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-ink-charcoal flex flex-col md:flex-row justify-between gap-6 text-[10px] uppercase tracking-[0.2em] text-ink-silver/30">
        <p>© 2024 ArtInInk Studio. Todos los derechos reservados.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Threads</a>
          <a href="#" className="hover:text-white transition-colors">Vimeo</a>
        </div>
      </div>
    </footer>
  );
};

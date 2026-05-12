import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GALLERY_ITEMS, TATTOO_FLASH } from '../lib/constants';
import { Maximize2, Plus } from 'lucide-react';

export const Gallery = () => {
  const [filter, setFilter] = useState('Todos');
  const categories = ['Todos', 'Blackwork', 'Fine Line', 'Realismo', 'Geometry'];

  const filteredItems = filter === 'Todos' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === filter);

  return (
    <div className="bg-ink-black min-h-screen pt-48 pb-64 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Curated Archive Header */}
        <header className="mb-32 flex flex-col lg:flex-row lg:items-end justify-between gap-16">
          <div className="max-w-3xl">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] uppercase tracking-[0.5em] text-ink-red mb-8 font-bold"
            >
              ARCHIVO VISUAL
            </motion.p>
            <h1 className="text-6xl md:text-9xl font-serif tracking-tighter text-white">Galería <br /><span className="italic">Curada.</span></h1>
          </div>
          
          <div className="flex flex-wrap gap-8 text-[10px] uppercase tracking-[0.3em] font-bold text-white/30 pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`transition-all hover:text-white relative pb-2 ${
                  filter === cat ? 'text-white border-b-2 border-ink-red' : ''
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32 mb-64">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group cursor-none"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-ink-charcoal mb-10 border border-white/5">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-ink-black/20 group-hover:bg-transparent transition-all" />
                  
                  {/* Floating ID Tag */}
                  <div className="absolute top-6 right-6 text-[10px] font-mono text-white/40 bg-black/40 backdrop-blur-md px-3 py-1">
                    ITEM_{item.id.toString().padStart(3, '0')}
                  </div>
                </div>
                
                <div className="flex justify-between items-start px-2">
                  <div>
                    <h3 className="text-3xl font-serif text-white mb-2 leading-none">{item.title}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-ink-red font-bold">{item.category}</p>
                  </div>
                  <span className="text-[10px] font-mono text-white/20 mt-2">{item.year}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Flash Collection Section */}
        <div className="pt-32 border-t border-white/5">
          <header className="mb-24">
            <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tighter sm:mb-12">Colección de <span className="italic">Flash.</span></h2>
            <p className="text-ink-silver/40 text-sm max-w-xl uppercase tracking-widest leading-relaxed">
              Diseños listos para ser grabados. Disponibilidad inmediata sin alteraciones estructurales.
            </p>
          </header>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TATTOO_FLASH.map((url, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 0.98 }}
                className="aspect-square bg-ink-charcoal border border-white/5 overflow-hidden group relative cursor-pointer"
                onClick={() => window.location.href = `#/3d` /* In a real app we'd pass the image via state or URL */}
              >
                <img src={url} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Flash" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-ink-black/40 backdrop-blur-sm">
                  <div className="bg-white text-ink-black px-4 py-2 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                    <Maximize2 className="w-3 h-3" />
                    Probar en 3D
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

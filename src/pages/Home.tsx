import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Hexagon, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STUDIO_DATA, TATTOO_FLASH } from '../lib/constants';

export const Home = () => {
  return (
    <div className="relative bg-ink-black overflow-hidden">
      {/* Hero Section */}
      <section className="h-screen w-full flex items-center justify-center relative px-6">
        <div className="absolute inset-0 z-0">
          <img 
            src={STUDIO_DATA.images.hero} 
            className="w-full h-full object-cover opacity-60 grayscale"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-ink-black/40 bg-gradient-to-t from-ink-black via-transparent to-ink-black" />
        </div>

        <div className="relative z-10 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.8em" }}
            transition={{ duration: 1.5 }}
            className="text-[10px] uppercase mb-12 text-ink-silver font-bold"
          >
            SANTUARIO DE ARTE CORPORAL
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-7xl md:text-[11rem] font-serif tracking-tighter mb-16 leading-[0.8] text-white"
          >
            ART IN <span className="italic text-ink-red">INK</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col md:flex-row gap-12 justify-center items-center"
          >
            <Link 
              to="/gallery"
              className="px-14 py-6 bg-white text-ink-black text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-ink-red hover:text-white transition-all flex items-center gap-4 group"
            >
              Archivo Visual
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link 
              to="/contact"
              className="text-white text-[10px] uppercase tracking-[0.4em] font-bold border-b border-white/20 hover:border-ink-red py-3 transition-all"
            >
              Consultas Privadas
            </Link>
          </motion.div>
        </div>

        {/* HUD Elements */}
        <div className="absolute bottom-12 left-12 hidden lg:block text-[10px] font-bold tracking-[0.2em] text-white/20">
          LOCATION: 4.6974° N, 74.0538° W<br />
          ELEVATION: 2,640M
        </div>
        <div className="absolute bottom-12 right-12 hidden lg:block text-right text-[10px] font-bold tracking-[0.2em] text-white/20">
          PROTOCOLO: GRADO MÉDICO<br />
          ESTATUS: OPERATIVO
        </div>
      </section>

      {/* Featured Gallery Section */}
      <section className="py-48 px-6 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-end">
          <div className="lg:col-span-5 space-y-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-ink-red">Curaduría</p>
            <h2 className="text-5xl md:text-7xl font-serif tracking-tighter leading-tight text-white">
              Piezas de <span className="italic">Vanguardia</span> Clínica.
            </h2>
            <p className="text-ink-silver/50 text-lg leading-relaxed font-light">
              Desde el Blackwork más denso hasta la línea fina que desafía la percepción. 
              Cada trazo es un compromiso con la longevidad y la armonía anatómica.
            </p>
            <Link to="/gallery" className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white border-b-2 border-ink-red pb-2">
              Explorar Catálogo Completo
            </Link>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="aspect-[3/4] bg-ink-charcoal mt-24 overflow-hidden"
            >
              <img src={TATTOO_FLASH[0]} className="w-full h-full object-cover grayscale opacity-80 hover:opacity-100 transition-all duration-700" alt="Work 1" />
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="aspect-[3/4] bg-ink-charcoal overflow-hidden"
            >
              <img src={TATTOO_FLASH[1]} className="w-full h-full object-cover grayscale opacity-80 hover:opacity-100 transition-all duration-700" alt="Work 2" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Banner */}
      <section className="py-48 bg-white text-ink-black px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <Hexagon className="w-12 h-12 mx-auto text-ink-red" />
          <h2 className="text-4xl md:text-6xl font-serif tracking-tighter leading-tight">
            "La piel no es un límite, es la última frontera donde la identidad se hace 
            <span className="italic"> tangible</span>."
          </h2>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-ink-black/40">— ART IN INK MANIFESTO</p>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="py-48 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-24">
          <div className="space-y-6">
            <Zap className="w-8 h-8 text-ink-red" />
            <h3 className="text-2xl font-serif text-white">Precisión Digital</h3>
            <p className="text-ink-silver/50 text-sm leading-relaxed">
              Utilizamos escaneos 3D y realidad aumentada para pre-visualizar el impacto 
              visual de cada diseño antes del primer contacto con la aguja.
            </p>
          </div>
          <div className="space-y-6">
            <Shield className="w-8 h-8 text-ink-red" />
            <h3 className="text-2xl font-serif text-white">Blindaje Higiénico</h3>
            <p className="text-ink-silver/50 text-sm leading-relaxed">
              Protocolos que superan los estándares hospitalarios. Bioseguridad en cada 
              mililitro de tinta y en cada superficie de nuestro estudio.
            </p>
          </div>
          <div className="space-y-6">
            <Hexagon className="w-8 h-8 text-ink-red" />
            <h3 className="text-2xl font-serif text-white">Alquimia de Tinta</h3>
            <p className="text-ink-silver/50 text-sm leading-relaxed">
              Pigmentos orgánicos de alta gama formulados para una estabilidad cromática 
              excepcional a lo largo de las décadas.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-6 bg-ink-charcoal/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={STUDIO_DATA.images.interior} className="w-full h-full object-cover" alt="Interior" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <h2 className="text-6xl md:text-8xl font-serif tracking-tighter mb-12 text-white">¿Listo para el <span className="italic">Impacto?</span></h2>
          <Link 
            to="/contact"
            className="px-16 py-8 bg-ink-red text-white text-xs uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-ink-black transition-all"
          >
            Agendar Sesión
          </Link>
        </div>
      </section>
    </div>
  );
};

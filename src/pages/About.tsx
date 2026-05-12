import React from 'react';
import { motion } from 'motion/react';
import { STUDIO_DATA } from '../lib/constants';
import { ShieldAlert, Droplets, FlaskConical, Thermometer } from 'lucide-react';

export const About = () => {
  return (
    <div className="bg-ink-black text-ink-silver">
      {/* Header Section */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] uppercase tracking-[0.5em] text-ink-red mb-8 font-bold"
          >
            NUESTRA GÉNESIS
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-serif tracking-tighter leading-[0.9] text-white"
          >
            Ingeniería de la <br /> <span className="italic">Memoria Corporal.</span>
          </motion.h1 >
        </div>
      </section>

      {/* Maestro Artesano Section */}
      <section className="py-48 px-6 bg-ink-charcoal/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="relative group">
            <div className="aspect-[4/5] bg-ink-charcoal overflow-hidden border border-white/5">
              <img 
                src={STUDIO_DATA.images.artist} 
                className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:scale-105"
                alt="Maestro Artesano"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-ink-red flex items-center justify-center p-8 text-center text-white hidden md:flex">
              <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                EXCELENCIA TÉCNICA CERTIFICADA
              </p>
            </div>
          </div>
          <div className="space-y-12">
            <p className="text-[10px] uppercase tracking-[0.4em] text-ink-red font-bold">El Visionario</p>
            <h2 className="text-5xl font-serif text-white tracking-tighter">Maestro Artesano</h2>
            <div className="space-y-8 text-lg font-light leading-relaxed text-ink-silver/60">
              <p>
                Con más de una década de trayectoria en las capitales del arte corporal, 
                nuestro director creativo fusiona la precisión quirúrgica con una sensibilidad 
                estética brutalista.
              </p>
              <p>
                Cada sesión en ArtInInk es una colaboración intelectual donde la anatomía 
                dicta la forma y la voluntad del cliente define el significado. No 
                reproducimos imágenes, creamos extensiones del ser.
              </p>
            </div>
            <div className="pt-12 border-t border-white/5 grid grid-cols-2 gap-12">
              <div>
                <p className="text-white font-serif text-2xl mb-2">Bogotá</p>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Base de Operaciones</p>
              </div>
              <div>
                <p className="text-white font-serif text-2xl mb-2">Global</p>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Visión Estética</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocolo Section */}
      <section className="py-48 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32 space-y-6">
            <p className="text-[10px] uppercase tracking-[0.5em] text-ink-red font-bold">SEGURIDAD TOTAL</p>
            <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tighter">Protocolo de Curación</h2>
            <p className="max-w-2xl mx-auto text-ink-silver/50">
              La creación de la pieza es solo la mitad del proceso. Nuestro sistema de 
              post-tratamiento garantiza una preservación óptima del pigmento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Droplets, title: "Hidratación", desc: "Uso de apósitos biomédicos de última generación para regeneración acelerada." },
              { icon: ShieldAlert, title: "Protección", desc: "Barreras físicas contra agentes externos durante las críticas primeras 72 horas." },
              { icon: FlaskConical, title: "Limpieza", desc: "Soluciones de pH balanceado diseñadas específicamente para tejido tatuado." },
              { icon: Thermometer, title: "Control", desc: "Monitoreo post-sesión para asegurar que la inflamación siga el curso previsto." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-12 bg-ink-charcoal/20 border border-white/5 space-y-8"
              >
                <item.icon className="w-10 h-10 text-ink-red" />
                <h3 className="text-xl font-serif text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-silver/40">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Interior Section */}
      <section className="h-[70vh] w-full relative">
        <img src={STUDIO_DATA.images.interior} className="w-full h-full object-cover grayscale opacity-40" alt="Interior" />
        <div className="absolute inset-0 flex items-center justify-center bg-ink-black/20">
          <div className="bg-ink-black/60 backdrop-blur-3xl p-16 border border-white/5 text-center max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-8 tracking-tighter italic">"El espacio influye en el resultado."</h2>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/40 leading-relaxed">
              Nuestro estudio está diseñado como un entorno clínico minimalista para eliminar distracciones y maximizar el enfoque.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

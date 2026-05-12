import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, MapPin, Phone, Instagram, Upload, ArrowRight, X, Send } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { STUDIO_DATA } from '../lib/constants';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    idea: '',
    placement: '',
    size: '',
  });

  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Load 3D preview if exists
    const storedPreview = sessionStorage.getItem('tattoo_preview');
    if (storedPreview) {
      setPreviews([storedPreview]);
      sessionStorage.removeItem('tattoo_preview');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPreviews(prev => [...prev, event.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePreview = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const sendToWhatsApp = () => {
    const message = `SOLICITUD ARTININK\n\nNombre: ${formData.name}\nWhatsApp: ${formData.whatsapp}\nUbicación: ${formData.placement}\nTamaño: ${formData.size}\nIdea: ${formData.idea}\n\n*Nota: He adjuntado ${previews.length} imágenes de referencia.*`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${STUDIO_DATA.whatsapp}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-ink-black text-ink-silver min-h-screen">
      <div className="pt-48 pb-48 px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-24">
            <p className="text-[10px] uppercase tracking-[0.5em] text-ink-red mb-8 font-bold">SOLICITUDES</p>
            <h1 className="text-6xl md:text-9xl font-serif tracking-tighter text-white">Inicia tu <br /><span className="italic">Proceso.</span></h1>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
            {/* Form Side */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Identidad</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border-b border-white/10 py-4 focus:border-ink-red outline-none transition-colors text-white"
                    placeholder="NOMBRE COMPLETO"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">WhatsApp</label>
                  <input 
                    type="tel" 
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full bg-transparent border-b border-white/10 py-4 focus:border-ink-red outline-none transition-colors text-white"
                    placeholder="+57..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Ubicación Corporal</label>
                  <input 
                    type="text" 
                    value={formData.placement}
                    onChange={(e) => setFormData({...formData, placement: e.target.value})}
                    className="w-full bg-transparent border-b border-white/10 py-4 focus:border-ink-red outline-none transition-colors text-white"
                    placeholder="EJ: ANTEBRAZO EXT."
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Tamaño Estimado</label>
                  <input 
                    type="text" 
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    className="w-full bg-transparent border-b border-white/10 py-4 focus:border-ink-red outline-none transition-colors text-white"
                    placeholder="EJ: 15CM X 10CM"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Descripción del Concepto</label>
                <textarea 
                  rows={4}
                  value={formData.idea}
                  onChange={(e) => setFormData({...formData, idea: e.target.value})}
                  className="w-full bg-transparent border-b border-white/10 py-4 focus:border-ink-red outline-none transition-colors resize-none text-white leading-relaxed"
                  placeholder="DESCRIBE TU VISIÓN..."
                />
              </div>

              <div className="space-y-6">
                <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Referencias Visuales</label>
                
                {/* Preview Grid */}
                {previews.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                    {previews.map((src, i) => (
                      <div key={i} className="relative aspect-square border border-white/10 group">
                        <img src={src} className="w-full h-full object-cover grayscale opacity-60" alt="Preview" />
                        <button 
                          onClick={() => removePreview(i)}
                          className="absolute top-1 right-1 bg-ink-red p-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="border-2 border-dashed border-white/10 p-12 text-center group hover:border-ink-red transition-all cursor-pointer block">
                  <Upload className="w-8 h-8 mx-auto mb-4 text-white/20 group-hover:text-ink-red transition-colors" />
                  <p className="text-[10px] uppercase tracking-widest text-white/20">Sube imágenes de referencia</p>
                  <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              </div>

              <button 
                onClick={sendToWhatsApp}
                className="w-full flex items-center justify-center gap-4 py-8 bg-white text-ink-black uppercase tracking-[0.2em] font-bold hover:bg-ink-red hover:text-white transition-all shadow-2xl"
              >
                <Send className="w-5 h-5" />
                Enviar Solicitud vía WhatsApp
              </button>
            </motion.div>

            {/* Info Side */}
            <div className="space-y-24">
              <div className="h-[500px] border border-white/5 grayscale invert contrast-125 relative overflow-hidden">
                {!GOOGLE_MAPS_API_KEY ? (
                  <div className="w-full h-full bg-ink-charcoal flex items-center justify-center p-8 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-white/40">Llave de Google Maps requerida para visualización cartográfica</p>
                  </div>
                ) : (
                  <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                    <Map
                      defaultCenter={STUDIO_DATA.coords}
                      defaultZoom={15}
                      mapId="ARTININK_MAP"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{ width: '100%', height: '100%' }}
                    >
                      <AdvancedMarker position={STUDIO_DATA.coords}>
                        <Pin background="#E11D48" glyphColor="#fff" />
                      </AdvancedMarker>
                    </Map>
                  </APIProvider>
                )}
                <div className="absolute inset-0 pointer-events-none border-[20px] border-ink-black" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] text-white font-bold">Ubicación</h3>
                  <p className="text-sm leading-relaxed text-ink-silver/50">
                    {STUDIO_DATA.address}<br />
                    BOGOTÁ, COLOMBIA
                  </p>
                </div>
                <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] text-white font-bold">Social</h3>
                  <div className="flex gap-6 items-center">
                    <a 
                      href={`https://instagram.com/${STUDIO_DATA.instagram}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-ink-silver/50 hover:text-white transition-colors flex items-center gap-2 text-sm"
                    >
                      <Instagram size={18} />
                      @{STUDIO_DATA.instagram}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-24 border-t border-white/5 opacity-20">
                <p className="text-[10px] uppercase tracking-[0.8em] font-bold">PROTOCOLO DE SEGURIDAD ACTIVADO</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

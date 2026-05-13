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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string }>({});

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

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    const message = `*Nueva Solicitud de Tatuaje*%0A%0A` +
      `*Nombre:* ${formData.name}%0A` +
      `*WhatsApp:* ${formData.whatsapp}%0A` +
      `*Zona:* ${formData.placement}%0A` +
      `*Tamaño:* ${formData.size}%0A` +
      `*Idea:* ${formData.idea}%0A%0A` +
      `_Nota: Por favor adjunta las imágenes de referencia y la captura de la simulación a continuación._`;

    const whatsappUrl = `https://wa.me/${STUDIO_DATA.whatsapp}?text=${message}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    setIsSubmitting(false);
    setSubmitStatus({ success: true, message: "Redirigiendo a WhatsApp..." });
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
              {/* Status Message */}
              {submitStatus.message && (
                <div className={`p-6 border ${submitStatus.success ? 'border-green-500 text-green-500' : 'border-ink-red text-ink-red'} text-[10px] uppercase font-bold tracking-widest`}>
                  {submitStatus.message}
                </div>
              )}

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

              {previews.length > 0 && (
                <div className="space-y-6">
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Referencias Visuales</label>
                  
                  {/* Preview Grid - Solo para la captura 3D si existe */}
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                    {previews.map((src, i) => (
                      <div key={i} className="relative aspect-square border border-white/10">
                        <img src={src} className="w-full h-full object-cover grayscale opacity-60" alt="3D Preview" />
                      </div>
                    ))}
                  </div>

                  <div className="bg-ink-charcoal/30 border border-white/5 p-6 space-y-4">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 leading-relaxed font-bold">
                      * El sistema ha optimizado tu solicitud. No es necesario subir archivos aquí. 
                      Al enviar la solicitud, se te dirigirá a WhatsApp donde podrás adjuntar tus referencias 
                      manualmente para una atención personalizada.
                    </p>
                  </div>
                </div>
              )}

              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-4 py-8 bg-white text-ink-black uppercase tracking-[0.2em] font-bold hover:bg-ink-red hover:text-white transition-all shadow-2xl ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Send className="w-5 h-5" />
                Continuar a WhatsApp
              </button>
            </motion.div>

            {/* Info Side */}
            <div className="space-y-24">
              <div className="h-[500px] border border-white/5 grayscale invert contrast-125 relative overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.4740430766365!2d-74.10795302412473!3d4.6873751952876255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9b41e2687105%3A0x31ed91691a9f8a2d!2zQ3JhLiA4MCAjIDY3LTIwLCBFbmdhdGl2w6EsIEJvZ290w6EsIEQuQy4sIEJvZ290w6EsIEJvZ290w6EsIEQuQy4!5e0!3m2!1ses-419!2sco!4v1778620960475!5m2!1ses-419!2sco" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
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
                <p className="text-[8px] uppercase tracking-[0.2em] font-bold mt-2">NOTA: Adjunta tus fotos manualmente en WhatsApp después de enviar el mensaje.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

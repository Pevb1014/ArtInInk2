import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, MeshDistortMaterial, ContactShadows, Decal, useTexture, useGLTF } from '@react-three/drei';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { TATTOO_FLASH } from '../lib/constants';
import { Upload, Camera, User, UserRound } from 'lucide-react';

// Helper para cargar modelos con error fallback
const ModelWithFallback = ({ gender, tattooUrl, tattooPos, tattooNormal, tattooScale, tattooOpacity, tattooRotation, onPointSelection }: any) => {
  const [error, setError] = useState(false);
  const tattooTexture = useTexture(tattooUrl);
  
  const modelPath = gender === 'male' ? '/models/male.glb' : '/models/female.glb';
  
  let model: any = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    model = useGLTF(modelPath, false);
  } catch (e) {
    if (!error) setError(true);
  }

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    // Extraemos la posición y la normal del punto clickeado
    if (e.point && e.face) {
      onPointSelection(e.point.toArray());
    }
  };

  if (error || !model) {
    return (
      <mesh 
        castShadow 
        receiveShadow 
        onPointerDown={handlePointerDown}
      >
        <capsuleGeometry args={[gender === 'female' ? 1.1 : 1.3, 3, 32, 64]} />
        <meshStandardMaterial color="#e8c1b5" roughness={0.7} />
        {tattooUrl && (
          <Decal 
            position={tattooPos} 
            rotation={[0, tattooRotation, 0]} 
            scale={[tattooScale * 2, tattooScale * 2, 1]}
          >
            <meshStandardMaterial 
              map={tattooTexture} 
              transparent 
              opacity={tattooOpacity} 
              polygonOffset 
              polygonOffsetFactor={-1} 
            />
          </Decal>
        )}
      </mesh>
    );
  }

  return (
    <primitive 
      object={model.scene} 
      scale={gender === 'male' ? 4 : 3.8} 
      position={[0, -4, 0]}
      onPointerDown={handlePointerDown}
    >
      {tattooUrl && (
        <Decal 
          position={tattooPos} 
          rotation={[0, tattooRotation, 0]} 
          scale={[tattooScale, tattooScale, 1]}
        >
          <meshStandardMaterial 
            map={tattooTexture} 
            transparent 
            opacity={tattooOpacity} 
            polygonOffset 
            polygonOffsetFactor={-1} 
          />
        </Decal>
      )}
    </primitive>
  );
};

const SceneContent = ({ 
  gender, 
  selectedTattoo, 
  tattooPos, 
  tattooScale, 
  tattooOpacity, 
  tattooRotation,
  onPointSelection
}: any) => {
  return (
    <Suspense fallback={<mesh><sphereGeometry args={[1, 32, 32]} /><meshStandardMaterial color="#222" wireframe /></mesh>}>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls makeDefault enableZoom={true} minDistance={5} maxDistance={15} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} />
      <Environment preset="night" />
      
      <ModelWithFallback 
        gender={gender}
        tattooUrl={selectedTattoo}
        tattooPos={tattooPos}
        tattooScale={tattooScale}
        tattooOpacity={tattooOpacity}
        tattooRotation={tattooRotation}
        onPointSelection={onPointSelection}
      />
      
      <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
    </Suspense>
  );
};

export const ThreeDViewer = () => {
  const navigate = useNavigate();
  
  const [gender, setGender] = useState('male');
  const [selectedTattoo, setSelectedTattoo] = useState(TATTOO_FLASH[0]);
  const [tattooScale, setTattooScale] = useState(1);
  const [tattooOpacity, setTattooOpacity] = useState(0.8);
  const [tattooRotation, setTattooRotation] = useState(0);
  const [tattooPos, setTattooPos] = useState<[number, number, number]>([0, 0, 1.3]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedTattoo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const capturePreview = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      sessionStorage.setItem('tattoo_preview', dataUrl);
      navigate('/contact');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row relative bg-ink-black overflow-hidden pt-20 lg:pt-0">
      {/* UI Sidebar */}
      <div className="w-full lg:w-[450px] h-full z-20 border-r border-white/5 bg-ink-black/40 backdrop-blur-3xl pt-16 lg:pt-32 px-8 overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-24">
          <section>
            <p className="text-[10px] uppercase tracking-[0.5em] text-ink-red mb-4 font-bold">Simulación Avanzada</p>
            <h1 className="text-4xl font-serif text-white leading-tight">Proyección <span className="italic">Prototipo</span></h1>
          </section>

          {/* Gender selection */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">Anatomía</h3>
              <div className="flex gap-4">
                <button 
                  onClick={() => setGender('male')} 
                  className={`flex items-center gap-2 p-2 transition-all ${gender === 'male' ? 'text-ink-red' : 'text-white/20'}`}
                >
                  <User size={18} />
                  <span className="text-[8px] font-bold">HOMBRE</span>
                </button>
                <button 
                  onClick={() => setGender('female')} 
                  className={`flex items-center gap-2 p-2 transition-all ${gender === 'female' ? 'text-ink-red' : 'text-white/20'}`}
                >
                  <UserRound size={18} />
                  <span className="text-[8px] font-bold">MUJER</span>
                </button>
              </div>
            </div>
            <p className="text-[9px] text-white/30 uppercase tracking-widest leading-relaxed">
              * Haz clic directamente sobre el modelo para posicionar el diseño.
            </p>
          </section>

          {/* Placement Controls */}
          <section className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white border-b border-white/10 pb-2">Ajustes de Diseño</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span>Rotación</span>
                <span>{Math.round((tattooRotation * 180) / Math.PI)}°</span>
              </div>
              <input 
                type="range" min={-Math.PI} max={Math.PI} step="0.1" 
                value={tattooRotation} onChange={(e) => setTattooRotation(parseFloat(e.target.value))}
                className="w-full accent-ink-red h-1 bg-ink-charcoal appearance-none cursor-pointer"
              />
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span>Escala</span>
                <span>{Math.round(tattooScale * 100)}%</span>
              </div>
              <input 
                type="range" min="0.1" max="2" step="0.1" 
                value={tattooScale} onChange={(e) => setTattooScale(parseFloat(e.target.value))}
                className="w-full accent-ink-red h-1 bg-ink-charcoal appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span>Opacidad</span>
                <span>{Math.round(tattooOpacity * 100)}%</span>
              </div>
              <input 
                type="range" min="0.1" max="1" step="0.05" 
                value={tattooOpacity} onChange={(e) => setTattooOpacity(parseFloat(e.target.value))}
                className="w-full accent-ink-red h-1 bg-ink-charcoal appearance-none cursor-pointer"
              />
            </div>
          </section>

          {/* Design Source */}
          <section className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white border-b border-white/10 pb-2">Selección de Arte</h3>
            <div className="grid grid-cols-4 gap-2">
              {TATTOO_FLASH.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTattoo(url)}
                  className={`aspect-square bg-ink-charcoal border overflow-hidden transition-all ${
                    selectedTattoo === url ? 'border-ink-red' : 'border-transparent'
                  }`}
                >
                  <img src={url} className="w-full h-full object-cover grayscale opacity-50" alt="Flash" />
                </button>
              ))}
              <label className="aspect-square bg-ink-charcoal border border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-ink-red transition-all group">
                <Upload size={16} className="text-white/20 group-hover:text-ink-red" />
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </section>

          {/* Capture Action */}
          <button 
            onClick={capturePreview}
            className="w-full py-6 bg-white text-ink-black text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-ink-red hover:text-white transition-all shadow-xl"
          >
            <Camera size={16} />
            Confirmar y Consultar
          </button>
        </motion.div>
      </div>

      {/* 3D Scene */}
      <div className="flex-1 h-full bg-ink-black relative">
        <Canvas shadows className="cursor-crosshair" gl={{ preserveDrawingBuffer: true }}>
          <SceneContent 
            gender={gender}
            selectedTattoo={selectedTattoo}
            tattooPos={tattooPos}
            tattooScale={tattooScale}
            tattooOpacity={tattooOpacity}
            tattooRotation={tattooRotation}
            onPointSelection={setTattooPos}
          />
        </Canvas>
        
        <div className="absolute bottom-8 right-8 text-right pointer-events-none">
          <p className="text-[10px] font-bold tracking-[0.4em] text-ink-red uppercase mb-2">Simulación en tiempo real</p>
          <p className="text-[9px] font-bold tracking-[0.2em] text-white/20 uppercase whitespace-pre-line leading-relaxed">
            Arrastra para rotar la vista{"\n"}
            Haz clic para reposicionar
          </p>
        </div>
      </div>
    </div>
  );
};

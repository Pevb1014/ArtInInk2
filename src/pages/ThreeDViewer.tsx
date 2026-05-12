import React, { Suspense, useState, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, MeshDistortMaterial, ContactShadows, Decal, useTexture } from '@react-three/drei';
import { motion } from 'motion/react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { STUDIO_DATA, TATTOO_FLASH } from '../lib/constants';
import { Upload, Camera, User, UserRound, ArrowRightLeft, Move } from 'lucide-react';

const BodyPart = ({ 
  gender, 
  type, 
  tattooUrl, 
  tattooPos, 
  tattooScale, 
  tattooOpacity, 
  tattooRotation 
}: { 
  gender: string; 
  type: string; 
  tattooUrl: string;
  tattooPos: [number, number, number];
  tattooScale: number;
  tattooOpacity: number;
  tattooRotation: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const tattooTexture = useTexture(tattooUrl);

  return (
    <group>
      <mesh ref={meshRef} castShadow receiveShadow>
        {type === 'brazo' ? (
          <cylinderGeometry args={[1, gender === 'female' ? 0.6 : 0.75, 4.5, 32]} />
        ) : type === 'pierna' ? (
          <cylinderGeometry args={[1.3, gender === 'female' ? 0.8 : 1, 5, 32]} />
        ) : (
          <capsuleGeometry args={[gender === 'female' ? 1.1 : 1.3, 3, 32, 64]} />
        )}
        <meshStandardMaterial 
          color="#e8c1b5" 
          roughness={0.7}
          metalness={0.05}
        />
        {tattooUrl && (
          <Decal
            position={tattooPos}
            rotation={[0, tattooRotation, 0]}
            scale={[tattooScale * 2, tattooScale * 2, 1]}
            opacity={tattooOpacity}
            transparent
          >
            <meshStandardMaterial
              map={tattooTexture}
              transparent
              opacity={tattooOpacity}
              depthTest={true}
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </Decal>
        )}
      </mesh>
    </group>
  );
};

const SceneContent = ({ 
  gender, 
  bodyPart, 
  selectedTattoo, 
  tattooPos, 
  tattooScale, 
  tattooOpacity, 
  tattooRotation 
}: any) => {
  return (
    <Suspense fallback={null}>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls 
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.5}
      />
      
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
      <pointLight position={[-10, -10, 5]} intensity={0.5} />
      <Environment preset="night" />
      
      <BodyPart 
        gender={gender}
        type={bodyPart} 
        tattooUrl={selectedTattoo}
        tattooPos={tattooPos}
        tattooScale={tattooScale}
        tattooOpacity={tattooOpacity}
        tattooRotation={tattooRotation}
      />
      
      <ContactShadows 
        position={[0, -4, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={4.5} 
      />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[8, 3, -15]}>
          <sphereGeometry args={[4, 64, 64]} />
          <MeshDistortMaterial color="#121212" speed={2} distort={0.4} metalness={1} roughness={0} />
        </mesh>
      </Float>
    </Suspense>
  );
};

export const ThreeDViewer = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [gender, setGender] = useState('male');
  const [bodyPart, setBodyPart] = useState('tronco');
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

          {/* Gender & Area */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">Anatomía</h3>
              <div className="flex gap-4">
                <button onClick={() => setGender('male')} className={`transition-colors ${gender === 'male' ? 'text-ink-red' : 'text-white/20'}`}><User size={18} /></button>
                <button onClick={() => setGender('female')} className={`transition-colors ${gender === 'female' ? 'text-ink-red' : 'text-white/20'}`}><UserRound size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['tronco', 'brazo', 'pierna'].map((part) => (
                <button
                  key={part}
                  onClick={() => {
                    setBodyPart(part);
                    setTattooPos([0, 0, part === 'tronco' ? 1.4 : 1.1]);
                  }}
                  className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                    bodyPart === part ? 'bg-white text-ink-black' : 'bg-ink-charcoal text-ink-silver/30 hover:bg-white/5'
                  }`}
                >
                  {part}
                </button>
              ))}
            </div>
          </section>

          {/* Placement Controls */}
          <section className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white border-b border-white/10 pb-2">Posicionamiento</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span>Altura (Y)</span>
                <span>{tattooPos[1].toFixed(1)}</span>
              </div>
              <input 
                type="range" min="-2" max="2" step="0.1" 
                value={tattooPos[1]} onChange={(e) => setTattooPos([tattooPos[0], parseFloat(e.target.value), tattooPos[2]])}
                className="w-full accent-ink-red h-1 bg-ink-charcoal appearance-none cursor-pointer"
              />
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
            </div>
          </section>

          {/* Design Source */}
          <section className="space-y-6">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white border-b border-white/10 pb-2">Fuente de Tinta</h3>
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
            Capturar y Consultar
          </button>
        </motion.div>
      </div>

      {/* 3D Scene */}
      <div className="flex-1 h-full bg-ink-black relative">
        <Canvas shadows className="cursor-move" gl={{ preserveDrawingBuffer: true }}>
          <SceneContent 
            gender={gender}
            bodyPart={bodyPart} 
            selectedTattoo={selectedTattoo}
            tattooPos={tattooPos}
            tattooScale={tattooScale}
            tattooOpacity={tattooOpacity}
            tattooRotation={tattooRotation}
          />
        </Canvas>
        
        <div className="absolute top-8 right-8 text-right pointer-events-none hidden md:block">
          <p className="text-[10px] font-bold tracking-[0.4em] text-white/20 uppercase mb-2">Protocolo de Visualización 3D</p>
          <p className="text-[10px] font-bold tracking-[0.4em] text-white/10 uppercase">Habilite rotación táctil para inspección</p>
        </div>
      </div>
    </div>
  );
};

import * as THREE from 'three';
import React, { Suspense, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas, createPortal } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Decal, useTexture, useGLTF } from '@react-three/drei';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { TATTOO_FLASH } from '../lib/constants';
import { Upload, Camera, User, UserRound } from 'lucide-react';

// Componente que renderiza el tatuaje
const TattooDecal = ({ url, pos, rot, scale, opacity }: any) => {
  const texture = useTexture(url);
  
  return (
    <Decal 
      position={pos} 
      rotation={rot} 
      scale={scale}
    >
      <meshStandardMaterial 
        map={texture as THREE.Texture} 
        transparent 
        opacity={opacity} 
        depthTest={true}
        depthWrite={false}
        polygonOffset 
        polygonOffsetFactor={-10} 
      />
    </Decal>
  );
};

// Error Boundary mejorado para manejar fallos
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, lastKey: props.instanceKey };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  static getDerivedStateFromProps(props: any, state: any) {
    if (props.instanceKey !== state.lastKey) {
      return { hasError: false, lastKey: props.instanceKey };
    }
    return null;
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Componente que centraliza la carga de modelos y la lógica de tatuaje
const ModelManager = ({ 
  gender, 
  tattooUrl, 
  tattooPos,
  tattooNormal,
  tattooScale, 
  tattooOpacity, 
  tattooRotation, 
  onPointSelection 
}: any) => {
  const modelPath = gender === 'male' ? '/models/male.glb' : '/models/female.glb';
  const { scene } = useGLTF(modelPath);
  
  // Estado para la malla seleccionada y datos locales
  const [target, setTarget] = useState<{ mesh: THREE.Mesh; pos: [number, number, number]; rot: [number, number, number] } | null>(null);

  // Efecto para posicionamiento inicial
  useEffect(() => {
    if (scene && !target) {
      let mainMesh: THREE.Mesh | null = null;
      scene.traverse((child: any) => {
        if (child.isMesh && !mainMesh) mainMesh = child;
      });

      if (mainMesh) {
        const mesh = mainMesh as THREE.Mesh;
        const localPos = mesh.worldToLocal(new THREE.Vector3(...tattooPos));
        const localNormal = new THREE.Vector3(...tattooNormal);
        
        const up = new THREE.Vector3(0, 1, 0);
        if (Math.abs(localNormal.dot(up)) > 0.99) up.set(1, 0, 0);
        const matrix = new THREE.Matrix4();
        matrix.lookAt(new THREE.Vector3(0, 0, 0), localNormal, up);
        const euler = new THREE.Euler().setFromRotationMatrix(matrix);

        setTarget({
          mesh,
          pos: localPos.toArray() as [number, number, number],
          rot: [euler.x, euler.y, euler.z]
        });
      }
    }
  }, [scene, tattooUrl]);

  // Reiniciar cuando cambia el género
  useEffect(() => {
    setTarget(null);
  }, [gender]);

  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    if (!mesh || !mesh.isMesh) return;

    const localPoint = mesh.worldToLocal(e.point.clone());
    const localNormal = e.face.normal.clone();
    
    // Rotación alineada a la superficie
    const up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(localNormal.dot(up)) > 0.99) up.set(1, 0, 0);
    const matrix = new THREE.Matrix4();
    matrix.lookAt(new THREE.Vector3(0, 0, 0), localNormal, up);
    const euler = new THREE.Euler().setFromRotationMatrix(matrix);
    
    // Offset muy ligero para evitar solapamiento
    const adjustedPoint = localPoint.clone().add(localNormal.clone().multiplyScalar(0.005));

    setTarget({
      mesh,
      pos: adjustedPoint.toArray() as [number, number, number],
      rot: [euler.x, euler.y, euler.z]
    });

    onPointSelection(e.point.toArray(), e.face.normal.toArray());
  }, [onPointSelection]);

  return (
    <group>
      <primitive 
        object={scene} 
        scale={gender === 'male' ? 4 : 3.8} 
        position={[0, -1.5, 0]} 
        onPointerDown={handlePointerDown} 
      />
      {tattooUrl && target && createPortal(
        <TattooDecal 
          url={tattooUrl}
          pos={target.pos}
          rot={[target.rot[0], target.rot[1], target.rot[2] + tattooRotation]}
          scale={[tattooScale * 0.4, tattooScale * 0.4, 0.1]} 
          opacity={tattooOpacity}
        />,
        target.mesh
      )}
    </group>
  );
};

// Cargar modelos fuera del ciclo de renderizado
useGLTF.preload('/models/male.glb');
useGLTF.preload('/models/female.glb');

// Fallback preventivo
const CapsuleModel = ({ gender, tattooUrl, tattooScale, tattooOpacity, tattooRotation, onPointSelection }: any) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [pointData, setPointData] = useState<any>(null);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    const mesh = meshRef.current;
    const localPoint = mesh.worldToLocal(e.point.clone());
    const localNormal = e.face.normal.clone();
    
    const up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(localNormal.dot(up)) > 0.99) up.set(1, 0, 0);
    const matrix = new THREE.Matrix4();
    matrix.lookAt(new THREE.Vector3(0, 0, 0), localNormal, up);
    const euler = new THREE.Euler().setFromRotationMatrix(matrix);
    
    setPointData({
      pos: localPoint.clone().add(localNormal.clone().multiplyScalar(0.01)).toArray(),
      rot: [euler.x, euler.y, euler.z],
      mesh: mesh
    });
    onPointSelection(e.point.toArray(), e.face.normal.toArray());
  };

  return (
    <group position={[0, -1.5, 0]}>
      <mesh ref={meshRef} castShadow receiveShadow onPointerDown={handlePointerDown}>
        <capsuleGeometry args={[gender === 'female' ? 1.1 : 1.3, 3, 32, 64]} />
        <meshStandardMaterial color="#e8c1b5" roughness={0.7} />
      </mesh>
      {tattooUrl && pointData && createPortal(
        <TattooDecal 
          url={tattooUrl}
          pos={pointData.pos}
          rot={[pointData.rot[0], pointData.rot[1], pointData.rot[2] + tattooRotation]}
          scale={[tattooScale * 0.4, tattooScale * 0.4, 0.1]}
          opacity={tattooOpacity}
        />,
        pointData.mesh
      )}
    </group>
  );
};

const SceneContent = ({ 
  gender, 
  selectedTattoo, 
  tattooPos,
  tattooNormal,
  tattooScale, 
  tattooOpacity, 
  tattooRotation,
  onPointSelection
}: any) => {
  return (
    <Suspense fallback={null}>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls makeDefault enableZoom={true} minDistance={5} maxDistance={15} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} />
      <Environment preset="night" />
      
      <ErrorBoundary fallback={<CapsuleModel gender={gender} tattooUrl={selectedTattoo} tattooScale={tattooScale} tattooOpacity={tattooOpacity} tattooRotation={tattooRotation} onPointSelection={onPointSelection} />}>
        <Suspense fallback={null}>
          <ModelManager 
            gender={gender}
            tattooUrl={selectedTattoo}
            tattooPos={tattooPos}
            tattooNormal={tattooNormal}
            tattooScale={tattooScale}
            tattooOpacity={tattooOpacity}
            tattooRotation={tattooRotation}
            onPointSelection={onPointSelection}
          />
        </Suspense>
      </ErrorBoundary>
      
      <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
    </Suspense>
  );
};

export const ThreeDViewer = () => {
  const navigate = useNavigate();
  
  const [gender, setGender] = useState('male');
  const [selectedTattoo, setSelectedTattoo] = useState(TATTOO_FLASH[0]);
  const [tattooScale, setTattooScale] = useState(0.1);
  const [tattooOpacity, setTattooOpacity] = useState(0.8);
  const [tattooRotation, setTattooRotation] = useState(0);
  const [tattooPos, setTattooPos] = useState<[number, number, number]>([0, 1.5, 3]);
  const [tattooNormal, setTattooNormal] = useState<[number, number, number]>([0, 0, 1]);

  const handlePointSelection = (pos: [number, number, number], normal: [number, number, number]) => {
    setTattooPos(pos);
    setTattooNormal(normal);
  };

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
      
      // Descarga automática de la captura
      const link = document.createElement('a');
      link.download = `tattoo-preview-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      
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
                type="range" min="0.1" max="1" step="0.05" 
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
            Capturar y Continuar
          </button>
        </motion.div>
      </div>

      {/* 3D Scene */}
      <div className="flex-1 h-full bg-ink-black relative">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center bg-ink-black z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-ink-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Cargando Simulación...</p>
            </div>
          </div>
        }>
          <Canvas shadows className="cursor-crosshair" gl={{ preserveDrawingBuffer: true }}>
            <SceneContent 
              gender={gender}
              selectedTattoo={selectedTattoo}
              tattooPos={tattooPos}
              tattooNormal={tattooNormal}
              tattooScale={tattooScale}
              tattooOpacity={tattooOpacity}
              tattooRotation={tattooRotation}
              onPointSelection={handlePointSelection}
            />
          </Canvas>
        </Suspense>
        
        <div className="absolute bottom-8 right-8 text-right pointer-events-none z-10">
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

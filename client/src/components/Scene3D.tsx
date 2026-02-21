import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { MorphingObject } from './MorphingObject';

interface Scene3DProps {
  scrollProgress: number;
  className?: string;
}

export function Scene3D({ scrollProgress, className = '' }: Scene3DProps) {
  const [webglAvailable, setWebglAvailable] = useState(false); // Start with fallback

  useEffect(() => {
    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      setWebglAvailable(true);
    }
  }, []);

  if (!webglAvailable) {
    // Fallback for environments without WebGL
    return (
      <div className={`w-full h-full ${className} flex items-center justify-center`}>
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 animate-spin-slow">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.6" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.4" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.2" />
            </svg>
          </div>
          <div className="absolute inset-0 animate-pulse">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,10 90,90 10,90" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.3" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 5]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
          <MorphingObject scrollProgress={scrollProgress} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>
    </div>
  );
}

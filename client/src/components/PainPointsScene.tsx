import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { PainPointsMorphing } from './PainPointsMorphing';

interface PainPointsSceneProps {
  scrollProgress: number;
  className?: string;
}

export function PainPointsScene({ scrollProgress, className = '' }: PainPointsSceneProps) {
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
              <rect x="25" y="25" width="50" height="50" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.6" transform="rotate(45 50 50)" />
              <circle cx="50" cy="50" r="35" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.4" />
            </svg>
          </div>
          <div className="absolute inset-0 animate-pulse">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon points="50,20 80,80 20,80" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.3" />
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
          <PerspectiveCamera makeDefault position={[0, 0, 4]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#ef4444" />
          <pointLight position={[-10, -10, -10]} intensity={0.6} color="#f97316" />
          <PainPointsMorphing scrollProgress={scrollProgress} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
        </Suspense>
      </Canvas>
    </div>
  );
}

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PainPointsMorphingProps {
  scrollProgress: number;
}

export function PainPointsMorphing({ scrollProgress }: PainPointsMorphingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create different geometries for pain points: brain-like → warning → error → solution
  const geometries = useMemo(() => {
    const dodecahedron = new THREE.DodecahedronGeometry(1, 0);
    const tetrahedron = new THREE.TetrahedronGeometry(1, 0);
    const box = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const cone = new THREE.ConeGeometry(0.8, 1.5, 8);
    
    return [dodecahedron, tetrahedron, box, cone];
  }, []);

  // Animate rotation and morphing based on scroll
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Different rotation pattern from hero
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    
    // Morph based on scroll progress
    const morphProgress = (scrollProgress % 1) * geometries.length;
    const currentGeomIndex = Math.floor(morphProgress);
    const nextGeomIndex = (currentGeomIndex + 1) % geometries.length;
    
    const currentGeom = geometries[currentGeomIndex];
    
    if (meshRef.current.geometry !== currentGeom) {
      meshRef.current.geometry = currentGeom;
    }
    
    // Pulsing scale effect
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.15;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} geometry={geometries[0]}>
      <meshStandardMaterial
        color="#ef4444"
        emissive="#ef4444"
        emissiveIntensity={0.6}
        wireframe={true}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
}

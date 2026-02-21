import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MorphingObjectProps {
  scrollProgress: number;
}

export function MorphingObject({ scrollProgress }: MorphingObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Create geometries for morphing: wrench → circuit → neural network → gear
  const geometries = useMemo(() => {
    // Simplified shapes that represent: tool → tech → AI → automation
    const sphere = new THREE.SphereGeometry(1, 32, 32);
    const torus = new THREE.TorusGeometry(0.8, 0.3, 16, 100);
    const octahedron = new THREE.OctahedronGeometry(1, 0);
    const icosahedron = new THREE.IcosahedronGeometry(1, 1);
    
    return [sphere, torus, octahedron, icosahedron];
  }, []);

  // Animate rotation and morphing based on scroll
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Continuous rotation
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    
    // Morph based on scroll progress (0-1)
    const morphProgress = (scrollProgress % 1) * geometries.length;
    const currentGeomIndex = Math.floor(morphProgress);
    const nextGeomIndex = (currentGeomIndex + 1) % geometries.length;
    const lerpFactor = morphProgress - currentGeomIndex;
    
    // Interpolate between geometries
    const currentGeom = geometries[currentGeomIndex];
    const nextGeom = geometries[nextGeomIndex];
    
    if (meshRef.current.geometry !== currentGeom) {
      meshRef.current.geometry = currentGeom;
    }
    
    // Scale pulsing effect
    const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef} geometry={geometries[0]}>
      <meshStandardMaterial
        color="#a855f7"
        emissive="#a855f7"
        emissiveIntensity={0.5}
        wireframe={false}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

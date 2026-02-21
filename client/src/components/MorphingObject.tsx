import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MorphingObjectProps {
  scrollProgress: number;
}

// Generate points on a sphere surface
function spherePoints(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }
  return positions;
}

// Generate points on a torus
function torusPoints(count: number, R: number, r: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    positions[i * 3] = (R + r * Math.cos(phi)) * Math.cos(theta);
    positions[i * 3 + 1] = (R + r * Math.cos(phi)) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.sin(phi);
  }
  return positions;
}

// Generate DNA helix points
function helixPoints(count: number, radius: number, height: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 6;
    const strand = i % 2 === 0 ? 1 : -1;
    const noise = (Math.random() - 0.5) * 0.15;
    positions[i * 3] = Math.cos(t) * radius * strand + noise;
    positions[i * 3 + 1] = ((i / count) - 0.5) * height + noise;
    positions[i * 3 + 2] = Math.sin(t) * radius * strand + noise;
  }
  return positions;
}

// Generate brain-like shape (bumpy sphere)
function brainPoints(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    // Add bumps using noise-like function
    const bump = 1 + 0.3 * Math.sin(theta * 8) * Math.sin(phi * 6) + 0.15 * Math.sin(theta * 12 + phi * 10);
    const r = radius * bump;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8; // Slightly flattened
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

// Generate cube wireframe points
function cubePoints(count: number, size: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const half = size / 2;
  for (let i = 0; i < count; i++) {
    // Distribute points along edges
    const edge = Math.floor(Math.random() * 12);
    const t = Math.random();
    const noise = (Math.random() - 0.5) * 0.08;
    switch (edge) {
      case 0: positions[i*3]=-half+noise; positions[i*3+1]=-half+noise; positions[i*3+2]=-half+t*size; break;
      case 1: positions[i*3]=-half+noise; positions[i*3+1]=half+noise; positions[i*3+2]=-half+t*size; break;
      case 2: positions[i*3]=half+noise; positions[i*3+1]=-half+noise; positions[i*3+2]=-half+t*size; break;
      case 3: positions[i*3]=half+noise; positions[i*3+1]=half+noise; positions[i*3+2]=-half+t*size; break;
      case 4: positions[i*3]=-half+t*size; positions[i*3+1]=-half+noise; positions[i*3+2]=-half+noise; break;
      case 5: positions[i*3]=-half+t*size; positions[i*3+1]=half+noise; positions[i*3+2]=-half+noise; break;
      case 6: positions[i*3]=-half+t*size; positions[i*3+1]=-half+noise; positions[i*3+2]=half+noise; break;
      case 7: positions[i*3]=-half+t*size; positions[i*3+1]=half+noise; positions[i*3+2]=half+noise; break;
      case 8: positions[i*3]=-half+noise; positions[i*3+1]=-half+t*size; positions[i*3+2]=-half+noise; break;
      case 9: positions[i*3]=half+noise; positions[i*3+1]=-half+t*size; positions[i*3+2]=-half+noise; break;
      case 10: positions[i*3]=-half+noise; positions[i*3+1]=-half+t*size; positions[i*3+2]=half+noise; break;
      default: positions[i*3]=half+noise; positions[i*3+1]=-half+t*size; positions[i*3+2]=half+noise; break;
    }
  }
  return positions;
}

export function MorphingObject({ scrollProgress }: MorphingObjectProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 3000;

  // Pre-generate all target shapes
  const shapes = useMemo(() => ({
    sphere: spherePoints(particleCount, 1.5),
    helix: helixPoints(particleCount, 1.2, 3.5),
    cube: cubePoints(particleCount, 2.5),
    brain: brainPoints(particleCount, 1.4),
    torus: torusPoints(particleCount, 1.2, 0.5),
  }), []);

  const shapeOrder = useMemo(() => ['sphere', 'helix', 'cube', 'brain', 'torus'] as const, []);

  // Initial positions
  const initialPositions = useMemo(() => {
    return new Float32Array(shapes.sphere);
  }, [shapes]);

  // Random sizes for particles
  const sizes = useMemo(() => {
    const s = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      s[i] = Math.random() * 3 + 1;
    }
    return s;
  }, []);

  // Custom shader material for glowing particles
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#a855f7') },
        uColor2: { value: new THREE.Color('#ec4899') },
        uColor3: { value: new THREE.Color('#6366f1') },
        uOpacity: { value: 0.85 },
      },
      vertexShader: `
        attribute float aSize;
        uniform float uTime;
        varying float vDistance;
        varying float vRandom;
        
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vDistance = length(position);
          vRandom = aSize;
          gl_PointSize = aSize * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform float uOpacity;
        varying float vDistance;
        varying float vRandom;
        
        void main() {
          // Soft circular particle
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // Glow falloff
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 1.5);
          
          // Color mixing based on position and time
          float colorMix = sin(vDistance * 2.0 + uTime * 0.5) * 0.5 + 0.5;
          float colorMix2 = cos(vRandom * 3.14 + uTime * 0.3) * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, colorMix);
          color = mix(color, uColor3, colorMix2 * 0.3);
          
          gl_FragColor = vec4(color, glow * uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    // Determine which two shapes to lerp between
    const totalShapes = shapeOrder.length;
    const progress = ((scrollProgress * 0.8) % 1) * totalShapes;
    const currentIndex = Math.floor(progress) % totalShapes;
    const nextIndex = (currentIndex + 1) % totalShapes;
    const lerpFactor = progress - Math.floor(progress);

    // Smooth easing
    const eased = lerpFactor * lerpFactor * (3 - 2 * lerpFactor);

    const currentShape = shapes[shapeOrder[currentIndex]];
    const nextShape = shapes[shapeOrder[nextIndex]];

    // Lerp positions
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] += ((currentShape[i] + (nextShape[i] - currentShape[i]) * eased) - positions[i]) * 0.05;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Slow rotation
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;

    // Update shader time
    shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
          count={particleCount}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
          count={particleCount}
        />
      </bufferGeometry>
      <primitive object={shaderMaterial} attach="material" />
    </points>
  );
}

import { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import {
  orbPositions,
  hardHatPositions,
  hammerPositions,
  neuralNetPositions,
  voiceAIPositions,
} from './particle-shapes';

// ─── Types ─────────────────────────────────────────────────────────

interface ParticleMorphProps {
  scrollProgress: number;
  variant: 'hero' | 'painPoints';
  className?: string;
}

// ─── Constants ─────────────────────────────────────────────────────

const DESKTOP_PARTICLES = 12000;
const MOBILE_PARTICLES = 4000;

function getParticleCount(): number {
  if (typeof window === 'undefined') return DESKTOP_PARTICLES;
  return window.innerWidth < 768 ? MOBILE_PARTICLES : DESKTOP_PARTICLES;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

// ─── Vertex Shader ─────────────────────────────────────────────────

const vertexShader = /* glsl */ `
  attribute vec3 positionB;
  attribute float aSize;
  attribute float aRandom;

  uniform float uMorphT;
  uniform float uTime;
  uniform float uPixelRatio;

  varying float vAlpha;
  varying float vRandom;

  void main() {
    // Hermite interpolation for smooth morph
    float t = uMorphT;
    t = t * t * (3.0 - 2.0 * t);

    // Interpolate between shape A (position) and shape B (positionB)
    vec3 morphed = mix(position, positionB, t);

    // Organic noise wobble
    float wobble = sin(morphed.x * 3.0 + uTime * 0.8) * cos(morphed.y * 2.5 + uTime * 0.6) * 0.02;
    morphed += wobble * aRandom;

    vec4 mvPosition = modelViewMatrix * vec4(morphed, 1.0);

    // Perspective-scaled point size
    float size = aSize * uPixelRatio * (150.0 / -mvPosition.z);
    gl_PointSize = size;

    // Alpha based on depth + size
    vAlpha = smoothstep(0.0, 0.5, aSize / 3.0) * (0.6 + 0.4 * (1.0 / (1.0 + abs(mvPosition.z) * 0.1)));
    vRandom = aRandom;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

// ─── Fragment Shader ───────────────────────────────────────────────

const fragmentShader = /* glsl */ `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTime;

  varying float vAlpha;
  varying float vRandom;

  void main() {
    // Soft radial glow circle
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    // Power-curve falloff for premium glow
    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
    glow = pow(glow, 2.0);

    // Core brightness boost
    float core = smoothstep(0.15, 0.0, dist) * 0.5;

    // Color blend between brand purple and accent pink
    float colorMix = sin(vRandom * 6.28 + uTime * 0.3) * 0.5 + 0.5;
    vec3 color = mix(uColor1, uColor2, colorMix * 0.3);

    // Boost brightness for additive blending
    color *= 1.2 + core;

    gl_FragColor = vec4(color, (glow + core) * vAlpha);
  }
`;

// ─── ParticlePoints Component (core morph logic) ───────────────────

function ParticlePoints({
  scrollProgress,
  variant,
}: {
  scrollProgress: number;
  variant: 'hero' | 'painPoints';
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const progressRef = useRef(0);
  const NUM_PARTICLES = useMemo(getParticleCount, []);

  // Pre-generate all shapes
  const shapes = useMemo(() => {
    if (variant === 'hero') {
      return [
        orbPositions(NUM_PARTICLES),
        hardHatPositions(NUM_PARTICLES),
        hammerPositions(NUM_PARTICLES),
        neuralNetPositions(NUM_PARTICLES),
        voiceAIPositions(NUM_PARTICLES),
        orbPositions(NUM_PARTICLES),
      ];
    }
    // painPoints variant just shows static orb
    return [orbPositions(NUM_PARTICLES)];
  }, [variant, NUM_PARTICLES]);

  // Buffer attributes
  const { positionsA, positionsB, sizes, randoms } = useMemo(() => {
    const posA = new Float32Array(shapes[0]);
    const posB = new Float32Array(shapes.length > 1 ? shapes[1] : shapes[0]);
    const s = new Float32Array(NUM_PARTICLES);
    const r = new Float32Array(NUM_PARTICLES);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      s[i] = 1.0 + Math.random() * 2.0;
      r[i] = Math.random();
    }
    return { positionsA: posA, positionsB: posB, sizes: s, randoms: r };
  }, [shapes, NUM_PARTICLES]);

  // Shader material uniforms
  const uniforms = useMemo(
    () => ({
      uMorphT: { value: 0 },
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColor1: { value: new THREE.Color('#a855f7') }, // brand purple
      uColor2: { value: new THREE.Color('#ec4899') }, // accent pink
    }),
    []
  );

  // Track current segment so we can update buffer B when it changes
  const currentSegRef = useRef(0);

  useEffect(() => {
    progressRef.current = Math.max(0, Math.min(1, scrollProgress));
  }, [scrollProgress]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const elapsed = state.clock.elapsedTime;
    uniforms.uTime.value = elapsed;

    const progress = progressRef.current;
    const numShapes = shapes.length;

    if (numShapes <= 1) {
      // Static orb — no morphing
      uniforms.uMorphT.value = 0;
      pointsRef.current.rotation.y = elapsed * 0.12;
      pointsRef.current.rotation.x = Math.sin(elapsed * 0.08) * 0.1;
      return;
    }

    const segLen = 1 / (numShapes - 1);
    const segIdx = Math.min(Math.floor(progress / segLen), numShapes - 2);
    const segProg = (progress - segIdx * segLen) / segLen;

    // Dwell/plateau: shape holds for 65%, transitions during 35%
    const dwellRatio = 0.65;
    let morphT: number;
    if (segProg <= dwellRatio) {
      morphT = 0;
    } else {
      morphT = (segProg - dwellRatio) / (1 - dwellRatio);
    }

    uniforms.uMorphT.value = morphT;

    // Update buffer attributes when segment changes
    if (segIdx !== currentSegRef.current) {
      currentSegRef.current = segIdx;
      const geo = pointsRef.current.geometry;
      const posAttr = geo.getAttribute('position') as THREE.BufferAttribute;
      const posBAttr = geo.getAttribute('positionB') as THREE.BufferAttribute;

      const s1 = shapes[segIdx];
      const s2 = shapes[segIdx + 1];

      for (let j = 0; j < NUM_PARTICLES * 3; j++) {
        (posAttr.array as Float32Array)[j] = s1[j];
        (posBAttr.array as Float32Array)[j] = s2[j];
      }
      posAttr.needsUpdate = true;
      posBAttr.needsUpdate = true;
    }

    // Auto-rotate
    pointsRef.current.rotation.y = elapsed * 0.15;
    pointsRef.current.rotation.x = Math.sin(elapsed * 0.08) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positionsA, 3]}
          count={NUM_PARTICLES}
        />
        <bufferAttribute
          attach="attributes-positionB"
          args={[positionsB, 3]}
          count={NUM_PARTICLES}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
          count={NUM_PARTICLES}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          args={[randoms, 1]}
          count={NUM_PARTICLES}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Glass Sphere Background ───────────────────────────────────────

function GlassSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.6, 64, 64]} />
      <meshPhysicalMaterial
        transparent
        opacity={0.03}
        color="#a855f7"
        clearcoat={1}
        roughness={0.1}
      />
    </mesh>
  );
}

// ─── CSS Fallback Orb ──────────────────────────────────────────────

function FallbackOrb() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-64 h-64 rounded-full animate-pulse"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, rgba(168,85,247,0.6), rgba(168,85,247,0.1) 70%, transparent)',
          boxShadow: '0 0 80px rgba(168,85,247,0.3), inset 0 0 40px rgba(168,85,247,0.1)',
        }}
      />
    </div>
  );
}

// ─── Main Exported Component ───────────────────────────────────────

export default function ParticleMorph({
  scrollProgress,
  variant,
  className,
}: ParticleMorphProps) {
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    setWebglAvailable(hasWebGL());
  }, []);

  if (!webglAvailable) {
    return (
      <div className={`relative ${className || ''}`} style={{ minHeight: '100%', minWidth: '100%' }}>
        <FallbackOrb />
      </div>
    );
  }

  return (
    <div className={`relative ${className || ''}`} style={{ minHeight: '100%', minWidth: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ParticlePoints scrollProgress={scrollProgress} variant={variant} />
        <GlassSphere />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            intensity={1.5}
            radius={0.8}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

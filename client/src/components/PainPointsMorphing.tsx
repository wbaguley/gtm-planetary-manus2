import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PainPointsMorphingProps {
  scrollProgress: number;
}

function shatteredSphere(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * (0.8 + Math.random() * 0.6);
    const explode = Math.random() > 0.7 ? 1.5 : 1;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * explode;
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * explode;
    positions[i * 3 + 2] = r * Math.cos(phi) * explode;
  }
  return positions;
}

function networkPoints(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const nodes = 12;
  const nodePositions: number[][] = [];
  for (let n = 0; n < nodes; n++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    nodePositions.push([
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    ]);
  }
  for (let i = 0; i < count; i++) {
    if (i < count * 0.3) {
      const node = nodePositions[Math.floor(Math.random() * nodes)];
      positions[i * 3] = node[0] + (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = node[1] + (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 2] = node[2] + (Math.random() - 0.5) * 0.3;
    } else {
      const a = nodePositions[Math.floor(Math.random() * nodes)];
      const b = nodePositions[Math.floor(Math.random() * nodes)];
      const t = Math.random();
      positions[i * 3] = a[0] + (b[0] - a[0]) * t + (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 1] = a[1] + (b[1] - a[1]) * t + (Math.random() - 0.5) * 0.1;
      positions[i * 3 + 2] = a[2] + (b[2] - a[2]) * t + (Math.random() - 0.5) * 0.1;
    }
  }
  return positions;
}

function shieldPoints(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.6;
    const r = radius + (Math.random() - 0.5) * 0.1;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi) - 0.3;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  return positions;
}

function gearPoints(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const teeth = 8;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const toothAngle = angle * teeth;
    const toothHeight = Math.sin(toothAngle) > 0 ? 0.3 : 0;
    const r = (radius + toothHeight) * (0.9 + Math.random() * 0.2);
    const depth = (Math.random() - 0.5) * 0.4;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = Math.sin(angle) * r;
    positions[i * 3 + 2] = depth;
  }
  return positions;
}

export function PainPointsMorphing({ scrollProgress }: PainPointsMorphingProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 2500;

  const shapes = useMemo(() => ({
    shattered: shatteredSphere(particleCount, 1.3),
    network: networkPoints(particleCount, 1.4),
    gear: gearPoints(particleCount, 1.3),
    shield: shieldPoints(particleCount, 1.5),
  }), []);

  const shapeOrder = useMemo(() => ['shattered', 'network', 'gear', 'shield'] as const, []);
  const initialPositions = useMemo(() => new Float32Array(shapes.shattered), [shapes]);

  const sizes = useMemo(() => {
    const s = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      s[i] = Math.random() * 2.5 + 0.8;
    }
    return s;
  }, []);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color('#ef4444') },
        uColor2: { value: new THREE.Color('#f97316') },
        uColor3: { value: new THREE.Color('#a855f7') },
        uOpacity: { value: 0.8 },
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
          gl_PointSize = aSize * (180.0 / -mvPosition.z);
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
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float glow = 1.0 - smoothstep(0.0, 0.5, dist);
          glow = pow(glow, 1.5);
          float colorMix = sin(vDistance * 2.5 + uTime * 0.4) * 0.5 + 0.5;
          float colorMix2 = cos(vRandom * 2.0 + uTime * 0.2) * 0.5 + 0.5;
          vec3 color = mix(uColor1, uColor2, colorMix);
          color = mix(color, uColor3, colorMix2 * 0.4);
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

    const totalShapes = shapeOrder.length;
    const progress = ((scrollProgress * 0.6) % 1) * totalShapes;
    const currentIndex = Math.floor(progress) % totalShapes;
    const nextIndex = (currentIndex + 1) % totalShapes;
    const lerpFactor = progress - Math.floor(progress);
    const eased = lerpFactor * lerpFactor * (3 - 2 * lerpFactor);

    const currentShape = shapes[shapeOrder[currentIndex]];
    const nextShape = shapes[shapeOrder[nextIndex]];

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] += ((currentShape[i] + (nextShape[i] - currentShape[i]) * eased) - positions[i]) * 0.04;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.15;
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

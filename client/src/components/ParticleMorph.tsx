import { useEffect, useRef, useCallback, useMemo } from 'react';

// ─── HERO Shape Generators ──────────────────────────────────────────

// ORB — evenly distributed sphere shell (used as start/end)
function orbPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const phi = Math.acos(-1 + (2 * i) / n);
    const theta = Math.sqrt(n * Math.PI) * phi;
    const r = 1.4;
    p[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    p[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
    p[i * 3 + 2] = Math.cos(phi) * r;
  }
  return p;
}

// WRENCH — simple open-end wrench, no box end
function wrenchPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const zSpread = 0.15;

  for (let i = 0; i < n; i++) {
    const section = Math.random();

    if (section < 0.35) {
      // Open jaw at top — two parallel prongs opening upward
      const prong = Math.random() > 0.5 ? 1 : -1;
      const t = Math.random();
      // Prongs go from shaft width out to jaw width
      p[i * 3] = prong * (0.15 + t * 0.35) + (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = 1.0 + t * 0.5 + (Math.random() - 0.5) * 0.04;
    } else if (section < 0.50) {
      // Jaw shoulders — angled connection from shaft to prongs
      const side = Math.random() > 0.5 ? 1 : -1;
      const t = Math.random();
      p[i * 3] = side * (0.12 + t * 0.25) + (Math.random() - 0.5) * 0.03;
      p[i * 3 + 1] = 0.7 + t * 0.35 + (Math.random() - 0.5) * 0.03;
    } else if (section < 0.90) {
      // Long straight shaft — the main handle
      const edge = Math.random();
      if (edge < 0.35) {
        // Left edge
        p[i * 3] = -0.12 + (Math.random() - 0.5) * 0.03;
        p[i * 3 + 1] = 0.7 - Math.random() * 2.8;
      } else if (edge < 0.70) {
        // Right edge
        p[i * 3] = 0.12 + (Math.random() - 0.5) * 0.03;
        p[i * 3 + 1] = 0.7 - Math.random() * 2.8;
      } else {
        // Fill
        p[i * 3] = (Math.random() - 0.5) * 0.22;
        p[i * 3 + 1] = 0.7 - Math.random() * 2.8;
      }
    } else {
      // Bottom end — slightly rounded tip
      const angle = Math.PI + Math.random() * Math.PI;
      const r = 0.12 + (Math.random() - 0.5) * 0.03;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = -2.1 + Math.sin(angle) * r * 0.5;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * zSpread;
  }
  return p;
}

// HAMMER — clean rectangular head on a straight handle, no claw
function hammerPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const zSpread = 0.15;

  for (let i = 0; i < n; i++) {
    const section = Math.random();

    if (section < 0.45) {
      // Hammer head — clean rectangle, wider than tall
      const headW = 1.0, headH = 0.35, headY = 1.0;
      const edge = Math.random();
      if (edge < 0.20) {
        // Top edge
        p[i * 3] = (Math.random() - 0.5) * headW * 2;
        p[i * 3 + 1] = headY + headH + (Math.random() - 0.5) * 0.03;
      } else if (edge < 0.40) {
        // Bottom edge
        p[i * 3] = (Math.random() - 0.5) * headW * 2;
        p[i * 3 + 1] = headY - headH + (Math.random() - 0.5) * 0.03;
      } else if (edge < 0.55) {
        // Left edge
        p[i * 3] = -headW + (Math.random() - 0.5) * 0.03;
        p[i * 3 + 1] = headY + (Math.random() - 0.5) * headH * 2;
      } else if (edge < 0.70) {
        // Right edge
        p[i * 3] = headW + (Math.random() - 0.5) * 0.03;
        p[i * 3 + 1] = headY + (Math.random() - 0.5) * headH * 2;
      } else {
        // Head fill
        p[i * 3] = (Math.random() - 0.5) * headW * 1.8;
        p[i * 3 + 1] = headY + (Math.random() - 0.5) * headH * 1.6;
      }
    } else if (section < 0.88) {
      // Handle — straight shaft, centered under head
      const edge = Math.random();
      if (edge < 0.35) {
        p[i * 3] = -0.10 + (Math.random() - 0.5) * 0.02;
        p[i * 3 + 1] = 0.6 - Math.random() * 2.6;
      } else if (edge < 0.70) {
        p[i * 3] = 0.10 + (Math.random() - 0.5) * 0.02;
        p[i * 3 + 1] = 0.6 - Math.random() * 2.6;
      } else {
        p[i * 3] = (Math.random() - 0.5) * 0.18;
        p[i * 3 + 1] = 0.6 - Math.random() * 2.6;
      }
    } else {
      // Grip at bottom — slightly wider
      p[i * 3] = (Math.random() - 0.5) * 0.30;
      p[i * 3 + 1] = -2.0 - Math.random() * 0.25 + (Math.random() - 0.5) * 0.03;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * zSpread;
  }
  return p;
}

// NEURAL NETWORK — nodes in layers with connection lines
function neuralNetPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const zSpread = 0.2;

  const layers: [number, number[]][] = [
    [-1.3, [-0.8, -0.25, 0.25, 0.8]],
    [-0.45, [-1.0, -0.5, 0.0, 0.5, 1.0]],
    [0.45, [-1.0, -0.5, 0.0, 0.5, 1.0]],
    [1.3, [-0.8, -0.25, 0.25, 0.8]],
  ];

  const allNodes: [number, number][] = [];
  for (const [x, ys] of layers) {
    for (const y of ys) {
      allNodes.push([x, y]);
    }
  }

  for (let i = 0; i < n; i++) {
    const section = Math.random();

    if (section < 0.30) {
      // Node clusters — dense circles at each node
      const node = allNodes[Math.floor(Math.random() * allNodes.length)];
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.15;
      p[i * 3] = node[0] + Math.cos(angle) * r;
      p[i * 3 + 1] = node[1] + Math.sin(angle) * r;
    } else if (section < 0.50) {
      // Node outlines — rings around each node
      const node = allNodes[Math.floor(Math.random() * allNodes.length)];
      const angle = Math.random() * Math.PI * 2;
      const r = 0.15 + (Math.random() - 0.5) * 0.03;
      p[i * 3] = node[0] + Math.cos(angle) * r;
      p[i * 3 + 1] = node[1] + Math.sin(angle) * r;
    } else {
      // Connection lines between adjacent layers
      const layerIdx = Math.floor(Math.random() * (layers.length - 1));
      const [x1, ys1] = layers[layerIdx];
      const [x2, ys2] = layers[layerIdx + 1];
      const y1 = ys1[Math.floor(Math.random() * ys1.length)];
      const y2 = ys2[Math.floor(Math.random() * ys2.length)];
      const t = Math.random();
      p[i * 3] = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 0.02;
      p[i * 3 + 1] = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 0.02;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * zSpread;
  }
  return p;
}

// VOICE AI — microphone with soundwaves
function voiceAIPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const zSpread = 0.15;

  for (let i = 0; i < n; i++) {
    const section = Math.random();

    if (section < 0.20) {
      // Microphone head — dome (top half circle)
      const angle = Math.random() * Math.PI;
      const r = 0.30 + (Math.random() - 0.5) * 0.04;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = 0.5 + Math.sin(angle) * r;
    } else if (section < 0.32) {
      // Mic body sides
      const side = Math.random() > 0.5 ? 0.30 : -0.30;
      p[i * 3] = side + (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = -0.1 + Math.random() * 0.6;
    } else if (section < 0.38) {
      // Mic body fill
      p[i * 3] = (Math.random() - 0.5) * 0.55;
      p[i * 3 + 1] = -0.1 + Math.random() * 0.6;
    } else if (section < 0.43) {
      // Grill lines on mic head
      const line = Math.floor(Math.random() * 4);
      const lineY = 0.4 + line * 0.12;
      p[i * 3] = (Math.random() - 0.5) * 0.45;
      p[i * 3 + 1] = lineY + (Math.random() - 0.5) * 0.02;
    } else if (section < 0.48) {
      // Bottom of mic body (curved)
      const angle = Math.PI + Math.random() * Math.PI;
      const r = 0.30 + (Math.random() - 0.5) * 0.04;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = -0.1 + Math.sin(angle) * 0.08;
    } else if (section < 0.53) {
      // Stand/stem
      p[i * 3] = (Math.random() - 0.5) * 0.05;
      p[i * 3 + 1] = -0.25 - Math.random() * 0.5;
    } else if (section < 0.60) {
      // Base (flat bottom)
      p[i * 3] = (Math.random() - 0.5) * 0.6;
      p[i * 3 + 1] = -0.78 + (Math.random() - 0.5) * 0.05;
    } else {
      // Sound waves — 3 concentric arcs on each side
      const side = Math.random() > 0.5 ? 1 : -1;
      const waveIdx = Math.floor(Math.random() * 3);
      const waveR = 0.55 + waveIdx * 0.30;
      const angle = (Math.random() - 0.5) * Math.PI * 0.6;
      p[i * 3] = side * (0.40 + Math.cos(angle) * waveR) + (Math.random() - 0.5) * 0.03;
      p[i * 3 + 1] = 0.3 + Math.sin(angle) * waveR * 0.4 + (Math.random() - 0.5) * 0.03;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * zSpread;
  }
  return p;
}


// ─── PAIN POINT Shape Generators (4 shapes + resolved orb) ─────────

// 1. Job Management Chaos — broken clock
function chaosClockPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const zSpread = 0.2;

  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.35) {
      // Clock circle outline
      const angle = Math.random() * Math.PI * 2;
      const r = 1.2 + (Math.random() - 0.5) * 0.05;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
    } else if (section < 0.50) {
      // Clock hands
      const isMinute = Math.random() > 0.5;
      const len = isMinute ? 0.9 : 0.6;
      const angle = isMinute ? 1.8 : 4.2;
      const t = Math.random() * len;
      p[i * 3] = Math.cos(angle) * t + (Math.random() - 0.5) * 0.03;
      p[i * 3 + 1] = Math.sin(angle) * t + (Math.random() - 0.5) * 0.03;
    } else if (section < 0.62) {
      // Hour markers (12 dots)
      const hour = Math.floor(Math.random() * 12);
      const angle = (hour / 12) * Math.PI * 2 - Math.PI / 2;
      p[i * 3] = Math.cos(angle) * 1.0 + (Math.random() - 0.5) * 0.07;
      p[i * 3 + 1] = Math.sin(angle) * 1.0 + (Math.random() - 0.5) * 0.07;
    } else if (section < 0.70) {
      // Center dot
      p[i * 3] = (Math.random() - 0.5) * 0.10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.10;
    } else {
      // Scattered debris
      const angle = Math.random() * Math.PI * 2;
      const dist = 1.5 + Math.random() * 1.0;
      p[i * 3] = Math.cos(angle) * dist + (Math.random() - 0.5) * 0.15;
      p[i * 3 + 1] = Math.sin(angle) * dist + (Math.random() - 0.5) * 0.15;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * zSpread;
  }
  return p;
}

// 2. Cash Flow Crunch — dollar sign ($)
function dollarSignPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const zSpread = 0.15;

  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.30) {
      // Top S-curve (backwards C)
      const t = Math.random() * Math.PI;
      p[i * 3] = Math.cos(t + Math.PI) * 0.65 + (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = Math.sin(t) * 0.35 + 0.45 + (Math.random() - 0.5) * 0.04;
    } else if (section < 0.60) {
      // Bottom S-curve (forwards C)
      const t = Math.random() * Math.PI;
      p[i * 3] = Math.cos(t) * 0.65 + (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = Math.sin(t + Math.PI) * 0.35 - 0.45 + (Math.random() - 0.5) * 0.04;
    } else if (section < 0.80) {
      // Vertical line through center
      p[i * 3] = (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
    } else {
      // Top and bottom serifs/caps
      const isTop = Math.random() > 0.5;
      p[i * 3] = (Math.random() - 0.5) * 0.3;
      p[i * 3 + 1] = (isTop ? 1.1 : -1.1) + (Math.random() - 0.5) * 0.04;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * zSpread;
  }
  return p;
}

// 3. Contract Hunting — target/bullseye with crosshairs
function targetPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const zSpread = 0.15;

  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.12) {
      // Center bullseye dot
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.15;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
    } else if (section < 0.30) {
      // Inner ring
      const angle = Math.random() * Math.PI * 2;
      const r = 0.45 + (Math.random() - 0.5) * 0.05;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
    } else if (section < 0.50) {
      // Middle ring
      const angle = Math.random() * Math.PI * 2;
      const r = 0.85 + (Math.random() - 0.5) * 0.05;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
    } else if (section < 0.68) {
      // Outer ring
      const angle = Math.random() * Math.PI * 2;
      const r = 1.25 + (Math.random() - 0.5) * 0.05;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
    } else {
      // Crosshair lines
      const isHorizontal = Math.random() > 0.5;
      const t = (Math.random() - 0.5) * 2.8;
      p[i * 3] = isHorizontal ? t : (Math.random() - 0.5) * 0.03;
      p[i * 3 + 1] = isHorizontal ? (Math.random() - 0.5) * 0.03 : t;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * zSpread;
  }
  return p;
}

// 4. Customer Service Gaps — phone with broken signal waves
function phoneGapsPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const zSpread = 0.15;

  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.25) {
      // Phone body outline (rectangle with rounded corners)
      const edge = Math.random();
      if (edge < 0.25) {
        // Left side
        p[i * 3] = -0.35 + (Math.random() - 0.5) * 0.03;
        p[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      } else if (edge < 0.50) {
        // Right side
        p[i * 3] = 0.35 + (Math.random() - 0.5) * 0.03;
        p[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      } else if (edge < 0.75) {
        // Top
        p[i * 3] = (Math.random() - 0.5) * 0.7;
        p[i * 3 + 1] = 0.75 + (Math.random() - 0.5) * 0.03;
      } else {
        // Bottom
        p[i * 3] = (Math.random() - 0.5) * 0.7;
        p[i * 3 + 1] = -0.75 + (Math.random() - 0.5) * 0.03;
      }
    } else if (section < 0.35) {
      // Screen area
      p[i * 3] = (Math.random() - 0.5) * 0.55;
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.9 + 0.1;
    } else if (section < 0.45) {
      // X mark on screen (missed call)
      const arm = Math.random() > 0.5 ? 1 : -1;
      const t = (Math.random() - 0.5) * 0.35;
      p[i * 3] = t * arm + (Math.random() - 0.5) * 0.02;
      p[i * 3 + 1] = t + 0.1 + (Math.random() - 0.5) * 0.02;
    } else {
      // Signal waves — arcs radiating from top, with breaks
      const side = Math.random() > 0.5 ? 1 : -1;
      const waveIdx = Math.floor(Math.random() * 3);
      const waveR = 0.5 + waveIdx * 0.35;
      const angle = (Math.random() - 0.5) * Math.PI * 0.6;
      const broken = Math.sin(angle * 4 + waveIdx) > 0.5;
      if (!broken) {
        p[i * 3] = side * (0.45 + Math.cos(angle) * waveR) + (Math.random() - 0.5) * 0.03;
        p[i * 3 + 1] = 0.3 + Math.sin(angle) * waveR * 0.4 + (Math.random() - 0.5) * 0.03;
      } else {
        p[i * 3] = side * (0.45 + Math.cos(angle) * (waveR + 0.15)) + (Math.random() - 0.5) * 0.15;
        p[i * 3 + 1] = 0.3 + Math.sin(angle) * waveR * 0.4 + (Math.random() - 0.5) * 0.15;
      }
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * zSpread;
  }
  return p;
}


// ─── Component ──────────────────────────────────────────────────────

interface ParticleMorphProps {
  scrollProgress: number;
  variant: 'hero' | 'painPoints';
  className?: string;
}

const NUM_PARTICLES = 12000;
const PERSPECTIVE = 4;

// GTM Planetary purple — unified color for all shapes
const BRAND_PURPLE: [number, number, number] = [168, 85, 247];

export default function ParticleMorph({ scrollProgress, variant, className }: ParticleMorphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const dprRef = useRef(1);
  const logicalWidthRef = useRef(0);
  const logicalHeightRef = useRef(0);
  const rotationRef = useRef(0);

  const shapes = useMemo(() => {
    if (variant === 'hero') {
      return [
        orbPositions(NUM_PARTICLES),
        wrenchPositions(NUM_PARTICLES),
        hammerPositions(NUM_PARTICLES),
        neuralNetPositions(NUM_PARTICLES),
        voiceAIPositions(NUM_PARTICLES),
        orbPositions(NUM_PARTICLES),
      ];
    } else {
      // Pain points: 4 shapes + resolved orb = 5 total
      return [
        chaosClockPositions(NUM_PARTICLES),
        dollarSignPositions(NUM_PARTICLES),
        targetPositions(NUM_PARTICLES),
        phoneGapsPositions(NUM_PARTICLES),
        orbPositions(NUM_PARTICLES),
      ];
    }
  }, [variant]);

  // Current particle positions (mutable for performance)
  const currentPositions = useMemo(() => {
    const pos = new Float32Array(NUM_PARTICLES * 3);
    const first = shapes[0];
    for (let i = 0; i < NUM_PARTICLES * 3; i++) pos[i] = first[i];
    return pos;
  }, [shapes]);

  // Per-particle random offsets for organic feel
  const particleOffsets = useMemo(() => {
    const offsets = new Float32Array(NUM_PARTICLES * 3);
    for (let i = 0; i < NUM_PARTICLES * 3; i++) {
      offsets[i] = (Math.random() - 0.5) * 0.05;
    }
    return offsets;
  }, []);

  // Per-particle size variation
  const particleSizes = useMemo(() => {
    const sizes = new Float32Array(NUM_PARTICLES);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      sizes[i] = 1.0 + Math.random() * 1.3;
    }
    return sizes;
  }, []);

  const project = useCallback((x: number, y: number, z: number, w: number, h: number) => {
    const scale = PERSPECTIVE / (PERSPECTIVE + z);
    return {
      x: x * scale * (w * 0.22) + w / 2,
      y: -y * scale * (h * 0.22) + h / 2,
      scale,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let isActive = true;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      if (w === 0 || h === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      logicalWidthRef.current = w;
      logicalHeightRef.current = h;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    };

    resizeCanvas();
    const resizeTimeout = setTimeout(resizeCanvas, 100);
    const resizeTimeout2 = setTimeout(resizeCanvas, 500);
    const resizeTimeout3 = setTimeout(resizeCanvas, 1000);
    window.addEventListener('resize', resizeCanvas);

    let resizeObserver: ResizeObserver | null = null;
    const parent = canvas.parentElement;
    if (parent && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => resizeCanvas());
      resizeObserver.observe(parent);
    }

    const animate = (time: number) => {
      if (!isActive) return;
      animFrameRef.current = requestAnimationFrame(animate);

      const delta = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0.016;
      lastTimeRef.current = time;

      const w = logicalWidthRef.current;
      const h = logicalHeightRef.current;
      const dpr = dprRef.current;

      if (w === 0 || h === 0) return;

      const progress = progressRef.current;
      const numShapes = shapes.length;
      const segLen = 1 / (numShapes - 1);
      const segIdx = Math.min(Math.floor(progress / segLen), numShapes - 2);
      const segProg = (progress - segIdx * segLen) / segLen;

      // Dwell/plateau: shape holds for 65% of segment, transitions during 35%
      const dwellRatio = 0.65;
      let morphT: number;
      if (segProg <= dwellRatio) {
        morphT = 0;
      } else {
        morphT = (segProg - dwellRatio) / (1 - dwellRatio);
      }
      const eased = morphT * morphT * (3 - 2 * morphT);

      const s1 = shapes[segIdx];
      const s2 = shapes[segIdx + 1];

      // AUTO-SPIN: continuous slow rotation driven by time
      const spinSpeed = variant === 'hero' ? 0.15 : 0.12;
      rotationRef.current += delta * spinSpeed;
      const rotAngle = rotationRef.current;
      const cosR = Math.cos(rotAngle);
      const sinR = Math.sin(rotAngle);

      // Very subtle tilt oscillation
      const tiltAngle = Math.sin(time * 0.0003) * 0.06;
      const cosT = Math.cos(tiltAngle);
      const sinT = Math.sin(tiltAngle);

      const lerpSpeed = Math.min(delta * 6, 1);
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const i3 = i * 3;
        const tx = s1[i3] + (s2[i3] - s1[i3]) * eased + particleOffsets[i3] * (1 - eased * 0.5);
        const ty = s1[i3 + 1] + (s2[i3 + 1] - s1[i3 + 1]) * eased + particleOffsets[i3 + 1] * (1 - eased * 0.5);
        const tz = s1[i3 + 2] + (s2[i3 + 2] - s1[i3 + 2]) * eased + particleOffsets[i3 + 2] * (1 - eased * 0.5);
        currentPositions[i3] += (tx - currentPositions[i3]) * lerpSpeed;
        currentPositions[i3 + 1] += (ty - currentPositions[i3 + 1]) * lerpSpeed;
        currentPositions[i3 + 2] += (tz - currentPositions[i3 + 2]) * lerpSpeed;
      }

      ctx.resetTransform();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.globalCompositeOperation = 'lighter';

      const [cr, cg, cb] = BRAND_PURPLE;

      for (let i = 0; i < NUM_PARTICLES; i++) {
        const i3 = i * 3;
        let x = currentPositions[i3];
        let y = currentPositions[i3 + 1];
        let zVal = currentPositions[i3 + 2];

        // Y-axis rotation (auto-spin)
        const rx = x * cosR - zVal * sinR;
        const rz = x * sinR + zVal * cosR;
        x = rx;
        zVal = rz;

        // Subtle X-axis tilt
        const ry = y * cosT - zVal * sinT;
        const rz2 = y * sinT + zVal * cosT;
        y = ry;
        zVal = rz2;

        const proj = project(x, y, zVal, w, h);
        if (proj.scale <= 0) continue;

        const size = particleSizes[i] * proj.scale;
        const alpha = Math.min(1, proj.scale * 0.8) * (0.5 + Math.random() * 0.1);

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';

      // Subtle glow behind shape
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.35);
      gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.06)`);
      gradient.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, 0.02)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isActive = false;
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(resizeTimeout);
      clearTimeout(resizeTimeout2);
      clearTimeout(resizeTimeout3);
      window.removeEventListener('resize', resizeCanvas);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [shapes, currentPositions, particleOffsets, particleSizes, project, variant]);

  useEffect(() => {
    progressRef.current = Math.max(0, Math.min(1, scrollProgress));
  }, [scrollProgress]);

  return (
    <div className={`relative ${className || ''}`} style={{ minHeight: '100%', minWidth: '100%' }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
}

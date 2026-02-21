import { useEffect, useRef, useCallback, useMemo } from 'react';

// ─── Shape Generators ──────────────────────────────────────────────
// Each returns [x, y, z] arrays for N particles

function spherePositions(n: number, r: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const phi = Math.acos(-1 + (2 * i) / n);
    const theta = Math.sqrt(n * Math.PI) * phi;
    p[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    p[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
    p[i * 3 + 2] = Math.cos(phi) * r;
  }
  return p;
}

function wrenchPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const s = Math.random();
    if (s < 0.35) {
      // Open jaw head
      const a = Math.random() * Math.PI * 1.5 + Math.PI * 0.25;
      const r = 0.8 + Math.random() * 0.4;
      p[i * 3] = Math.cos(a) * r;
      p[i * 3 + 1] = 1.2 + Math.sin(a) * r;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    } else if (s < 0.7) {
      // Handle shaft
      p[i * 3] = (Math.random() - 0.5) * 0.25;
      p[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
    } else {
      // Bottom jaw
      const a = Math.random() * Math.PI * 1.2 - Math.PI * 0.6;
      const r = 0.5 + Math.random() * 0.3;
      p[i * 3] = Math.cos(a) * r;
      p[i * 3 + 1] = -1.2 + Math.sin(a) * r;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
  }
  return p;
}

function brainPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const h = Math.random() > 0.5 ? 1 : -1;
    const phi = Math.acos(-1 + 2 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const r = 1.2 + Math.sin(theta * 6) * 0.15 + Math.sin(phi * 8) * 0.1;
    p[i * 3] = Math.sin(phi) * Math.cos(theta) * r * 0.6 + h * 0.3;
    p[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.8;
    p[i * 3 + 2] = Math.cos(phi) * r * 0.7;
  }
  return p;
}

function circuitPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = Math.random();
    if (t < 0.4) {
      const axis = Math.floor(Math.random() * 3);
      const line = (Math.floor(Math.random() * 8) - 4) * 0.35;
      const v = (Math.random() - 0.5) * 2.8;
      if (axis === 0) { p[i*3]=v; p[i*3+1]=line; p[i*3+2]=(Math.random()-0.5)*0.1; }
      else if (axis === 1) { p[i*3]=line; p[i*3+1]=v; p[i*3+2]=(Math.random()-0.5)*0.1; }
      else { p[i*3]=(Math.random()-0.5)*0.1; p[i*3+1]=line; p[i*3+2]=v; }
    } else if (t < 0.7) {
      const x = (Math.floor(Math.random()*8)-4)*0.35;
      const y = (Math.floor(Math.random()*8)-4)*0.35;
      p[i*3]=x+(Math.random()-0.5)*0.08;
      p[i*3+1]=y+(Math.random()-0.5)*0.08;
      p[i*3+2]=(Math.random()-0.5)*0.08;
    } else {
      const a = Math.random()*Math.PI*2;
      const r = Math.random()*0.5;
      p[i*3]=Math.cos(a)*r; p[i*3+1]=Math.sin(a)*r; p[i*3+2]=(Math.random()-0.5)*0.3;
    }
  }
  return p;
}

function dnaPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const height = 3, radius = 0.8, turns = 3;
  for (let i = 0; i < n; i++) {
    const t = Math.random();
    const y = (t - 0.5) * height;
    const angle = t * Math.PI * 2 * turns;
    const type = Math.random();
    if (type < 0.4) {
      p[i*3]=Math.cos(angle)*radius+(Math.random()-0.5)*0.05;
      p[i*3+1]=y; p[i*3+2]=Math.sin(angle)*radius+(Math.random()-0.5)*0.05;
    } else if (type < 0.8) {
      p[i*3]=Math.cos(angle+Math.PI)*radius+(Math.random()-0.5)*0.05;
      p[i*3+1]=y; p[i*3+2]=Math.sin(angle+Math.PI)*radius+(Math.random()-0.5)*0.05;
    } else {
      const rp = Math.random();
      p[i*3]=Math.cos(angle)*radius*rp+Math.cos(angle+Math.PI)*radius*(1-rp);
      p[i*3+1]=y;
      p[i*3+2]=Math.sin(angle)*radius*rp+Math.sin(angle+Math.PI)*radius*(1-rp);
    }
  }
  return p;
}

function torusPositions(n: number, R: number, r: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = (i/n)*Math.PI*2*20;
    const v = Math.random()*Math.PI*2;
    p[i*3]=(R+r*Math.cos(v))*Math.cos(u);
    p[i*3+1]=(R+r*Math.cos(v))*Math.sin(u);
    p[i*3+2]=r*Math.sin(v);
  }
  return p;
}

// Pain point shapes
function scatteredPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    p[i*3]=(Math.random()-0.5)*4;
    p[i*3+1]=(Math.random()-0.5)*4;
    p[i*3+2]=(Math.random()-0.5)*4;
  }
  return p;
}

function brokenCubePositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const face = Math.floor(Math.random()*6);
    const off = (Math.random()-0.5)*0.3;
    const u = (Math.random()-0.5)*1.8, v = (Math.random()-0.5)*1.8;
    switch(face) {
      case 0: p[i*3]=1+off; p[i*3+1]=u; p[i*3+2]=v; break;
      case 1: p[i*3]=-1-off; p[i*3+1]=u; p[i*3+2]=v; break;
      case 2: p[i*3]=u; p[i*3+1]=1+off; p[i*3+2]=v; break;
      case 3: p[i*3]=u; p[i*3+1]=-1-off; p[i*3+2]=v; break;
      case 4: p[i*3]=u; p[i*3+1]=v; p[i*3+2]=1+off; break;
      case 5: p[i*3]=u; p[i*3+1]=v; p[i*3+2]=-1-off; break;
    }
  }
  return p;
}

function networkPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const nodes: [number,number,number][] = [];
  for (let i = 0; i < 30; i++) {
    const phi = Math.acos(-1+(2*i)/30);
    const theta = Math.sqrt(30*Math.PI)*phi;
    nodes.push([Math.sin(phi)*Math.cos(theta)*1.5, Math.sin(phi)*Math.sin(theta)*1.5, Math.cos(phi)*1.5]);
  }
  for (let i = 0; i < n; i++) {
    if (Math.random() < 0.4) {
      const nd = nodes[Math.floor(Math.random()*nodes.length)];
      p[i*3]=nd[0]+(Math.random()-0.5)*0.15;
      p[i*3+1]=nd[1]+(Math.random()-0.5)*0.15;
      p[i*3+2]=nd[2]+(Math.random()-0.5)*0.15;
    } else {
      const n1 = nodes[Math.floor(Math.random()*nodes.length)];
      const n2 = nodes[Math.floor(Math.random()*nodes.length)];
      const t = Math.random();
      p[i*3]=n1[0]+(n2[0]-n1[0])*t+(Math.random()-0.5)*0.03;
      p[i*3+1]=n1[1]+(n2[1]-n1[1])*t+(Math.random()-0.5)*0.03;
      p[i*3+2]=n1[2]+(n2[2]-n1[2])*t+(Math.random()-0.5)*0.03;
    }
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

export default function ParticleMorph({ scrollProgress, variant, className }: ParticleMorphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const rotationRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  // Store DPR and logical dimensions to avoid cumulative ctx.scale issues
  const dprRef = useRef(1);
  const logicalWidthRef = useRef(0);
  const logicalHeightRef = useRef(0);

  // Pre-compute shapes once
  const shapes = useMemo(() => {
    if (variant === 'hero') {
      return [
        wrenchPositions(NUM_PARTICLES),
        torusPositions(NUM_PARTICLES, 1.2, 0.4),
        brainPositions(NUM_PARTICLES),
        circuitPositions(NUM_PARTICLES),
        dnaPositions(NUM_PARTICLES),
        spherePositions(NUM_PARTICLES, 1.5),
      ];
    } else {
      return [
        scatteredPositions(NUM_PARTICLES),
        brokenCubePositions(NUM_PARTICLES),
        networkPositions(NUM_PARTICLES),
        spherePositions(NUM_PARTICLES, 1.5),
      ];
    }
  }, [variant]);

  const colors = useMemo(() => {
    if (variant === 'hero') {
      return [
        [153, 102, 255],  // Purple - wrench
        [102, 51, 255],   // Deep purple - torus
        [178, 25, 230],   // Magenta - brain
        [77, 204, 255],   // Cyan - circuit
        [128, 255, 128],  // Green - DNA
        [204, 102, 255],  // Light purple - sphere
      ];
    } else {
      return [
        [255, 51, 51],    // Red - chaos
        [255, 128, 25],   // Orange - broken
        [77, 204, 255],   // Cyan - network
        [102, 255, 102],  // Green - resolved
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
      offsets[i] = (Math.random() - 0.5) * 0.08;
    }
    return offsets;
  }, []);

  // Per-particle size variation
  const particleSizes = useMemo(() => {
    const sizes = new Float32Array(NUM_PARTICLES);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      sizes[i] = 1 + Math.random() * 1.5;
    }
    return sizes;
  }, []);

  const project = useCallback((x: number, y: number, z: number, w: number, h: number) => {
    const scale = PERSPECTIVE / (PERSPECTIVE + z);
    return {
      x: x * scale * (w * 0.22) + w / 2,
      y: y * scale * (h * 0.22) + h / 2,
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
      
      // Skip if parent has no dimensions (not yet laid out)
      if (w === 0 || h === 0) return;
      
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      logicalWidthRef.current = w;
      logicalHeightRef.current = h;
      
      // Set canvas pixel buffer size
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      
      // Set CSS display size
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      
      // NOTE: We do NOT call ctx.scale(dpr, dpr) here.
      // Instead, we use setTransform per frame to avoid cumulative scaling on resize.
    };

    resizeCanvas();
    // Retry resize after layout settles (critical for production where layout may be delayed)
    const resizeTimeout = setTimeout(resizeCanvas, 100);
    const resizeTimeout2 = setTimeout(resizeCanvas, 500);
    const resizeTimeout3 = setTimeout(resizeCanvas, 1000);
    window.addEventListener('resize', resizeCanvas);
    
    // Use ResizeObserver for robust detection when parent gets dimensions
    let resizeObserver: ResizeObserver | null = null;
    const parent = canvas.parentElement;
    if (parent && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
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
      
      // Skip frame if canvas has no size
      if (w === 0 || h === 0) return;

      const progress = progressRef.current;
      const numShapes = shapes.length;
      const segLen = 1 / (numShapes - 1);
      const segIdx = Math.min(Math.floor(progress / segLen), numShapes - 2);
      const segProg = (progress - segIdx * segLen) / segLen;
      // Smooth easing
      const eased = segProg * segProg * (3 - 2 * segProg);

      const s1 = shapes[segIdx];
      const s2 = shapes[segIdx + 1];
      const c1 = colors[segIdx];
      const c2 = colors[segIdx + 1];

      // Interpolate color
      const cr = Math.round(c1[0] + (c2[0] - c1[0]) * eased);
      const cg = Math.round(c1[1] + (c2[1] - c1[1]) * eased);
      const cb = Math.round(c1[2] + (c2[2] - c1[2]) * eased);

      // Update rotation
      rotationRef.current += delta * 0.3;
      const rot = rotationRef.current;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const tiltAngle = Math.sin(time * 0.0003) * 0.15;
      const cosT = Math.cos(tiltAngle);
      const sinT = Math.sin(tiltAngle);

      // Update positions with lerp
      const lerpSpeed = Math.min(delta * 6, 1);
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const i3 = i * 3;
        const tx = s1[i3] + (s2[i3] - s1[i3]) * eased + particleOffsets[i3] * (1 - eased * 0.5);
        const ty = s1[i3+1] + (s2[i3+1] - s1[i3+1]) * eased + particleOffsets[i3+1] * (1 - eased * 0.5);
        const tz = s1[i3+2] + (s2[i3+2] - s1[i3+2]) * eased + particleOffsets[i3+2] * (1 - eased * 0.5);
        currentPositions[i3] += (tx - currentPositions[i3]) * lerpSpeed;
        currentPositions[i3+1] += (ty - currentPositions[i3+1]) * lerpSpeed;
        currentPositions[i3+2] += (tz - currentPositions[i3+2]) * lerpSpeed;
      }

      // Clear the entire canvas buffer (use pixel dimensions, not logical)
      ctx.resetTransform();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set the DPR transform for this frame (avoids cumulative scaling)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Draw particles with additive blending
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < NUM_PARTICLES; i++) {
        const i3 = i * 3;
        let x = currentPositions[i3];
        let y = currentPositions[i3+1];
        let z = currentPositions[i3+2];

        // Apply Y rotation
        const rx = x * cosR - z * sinR;
        const rz = x * sinR + z * cosR;
        x = rx;
        z = rz;

        // Apply X tilt
        const ry = y * cosT - z * sinT;
        const rz2 = y * sinT + z * cosT;
        y = ry;
        z = rz2;

        const proj = project(x, y, z, w, h);
        if (proj.scale <= 0) continue;

        const size = particleSizes[i] * proj.scale;
        const alpha = Math.min(1, proj.scale * 0.7) * (0.4 + Math.random() * 0.1);

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
        ctx.fill();
      }

      // Reset composite
      ctx.globalCompositeOperation = 'source-over';

      // Draw glow overlay in center
      const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.35);
      gradient.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, 0.08)`);
      gradient.addColorStop(0.5, `rgba(${cr}, ${cg}, ${cb}, 0.03)`);
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
  }, [shapes, colors, currentPositions, particleOffsets, particleSizes, project]);

  // Update progress
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

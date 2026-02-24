import { useEffect, useRef, useCallback, useMemo } from 'react';
import { orbPositions } from './particle-shapes';

// ─── Types & Constants ─────────────────────────────────────────────

interface ParticleMorphProps {
  scrollProgress: number;
  variant: 'hero' | 'painPoints';
  className?: string;
}

const NUM_PARTICLES = 12000;
const PERSPECTIVE = 4;

// GTM Planetary brand purple
const BRAND_PURPLE: [number, number, number] = [168, 85, 247];

// ─── Component ─────────────────────────────────────────────────────

export default function ParticleMorph({ scrollProgress, variant, className }: ParticleMorphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const dprRef = useRef(1);
  const logicalWidthRef = useRef(0);
  const logicalHeightRef = useRef(0);
  const rotationRef = useRef(0);

  // Both hero and pain points: static orb only
  const shapes = useMemo(() => {
    return [orbPositions(NUM_PARTICLES)];
  }, []);

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

      // No morphing - just use the orb shape
      const s1 = shapes[0];
      const eased = 0;

      // Breathing effect: subtle scale pulse (3.5 second cycle)
      const breathCycle = Math.sin(time * 0.0018) * 0.08 + 1.0; // 0.92 to 1.08 scale

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
        // Apply breathing scale to orb positions
        const tx = s1[i3] * breathCycle + particleOffsets[i3] * 0.5;
        const ty = s1[i3 + 1] * breathCycle + particleOffsets[i3 + 1] * 0.5;
        const tz = s1[i3 + 2] * breathCycle + particleOffsets[i3 + 2] * 0.5;
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

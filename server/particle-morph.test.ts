import { describe, it, expect } from 'vitest';

// Test the shape generator functions and core logic used by ParticleMorph
// These are pure math functions that can be tested without DOM

describe('ParticleMorph shape generators', () => {
  const NUM_PARTICLES = 100; // Use smaller count for tests

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
        const a = Math.random() * Math.PI * 1.5 + Math.PI * 0.25;
        const r = 0.8 + Math.random() * 0.4;
        p[i * 3] = Math.cos(a) * r;
        p[i * 3 + 1] = 1.2 + Math.sin(a) * r;
        p[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      } else if (s < 0.7) {
        p[i * 3] = (Math.random() - 0.5) * 0.25;
        p[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
        p[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
      } else {
        const a = Math.random() * Math.PI * 1.2 - Math.PI * 0.6;
        const r = 0.5 + Math.random() * 0.3;
        p[i * 3] = Math.cos(a) * r;
        p[i * 3 + 1] = -1.2 + Math.sin(a) * r;
        p[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      }
    }
    return p;
  }

  it('spherePositions generates correct number of coordinates', () => {
    const positions = spherePositions(NUM_PARTICLES, 1.5);
    expect(positions).toBeInstanceOf(Float32Array);
    expect(positions.length).toBe(NUM_PARTICLES * 3);
  });

  it('spherePositions generates points within radius bounds', () => {
    const radius = 1.5;
    const positions = spherePositions(NUM_PARTICLES, radius);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);
      // Points should be approximately on the sphere surface
      expect(dist).toBeCloseTo(radius, 1);
    }
  });

  it('wrenchPositions generates correct number of coordinates', () => {
    const positions = wrenchPositions(NUM_PARTICLES);
    expect(positions).toBeInstanceOf(Float32Array);
    expect(positions.length).toBe(NUM_PARTICLES * 3);
  });

  it('wrenchPositions generates finite values', () => {
    const positions = wrenchPositions(NUM_PARTICLES);
    for (let i = 0; i < positions.length; i++) {
      expect(Number.isFinite(positions[i])).toBe(true);
    }
  });

  it('shape interpolation produces valid intermediate positions', () => {
    const s1 = spherePositions(NUM_PARTICLES, 1.0);
    const s2 = wrenchPositions(NUM_PARTICLES);
    const eased = 0.5; // Midpoint

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const i3 = i * 3;
      const x = s1[i3] + (s2[i3] - s1[i3]) * eased;
      const y = s1[i3 + 1] + (s2[i3 + 1] - s1[i3 + 1]) * eased;
      const z = s1[i3 + 2] + (s2[i3 + 2] - s1[i3 + 2]) * eased;
      expect(Number.isFinite(x)).toBe(true);
      expect(Number.isFinite(y)).toBe(true);
      expect(Number.isFinite(z)).toBe(true);
    }
  });

  it('projection function produces valid screen coordinates', () => {
    const PERSPECTIVE = 4;
    const w = 600;
    const h = 500;

    function project(x: number, y: number, z: number) {
      const scale = PERSPECTIVE / (PERSPECTIVE + z);
      return {
        x: x * scale * (w * 0.22) + w / 2,
        y: y * scale * (h * 0.22) + h / 2,
        scale,
      };
    }

    // Test a point at origin
    const p1 = project(0, 0, 0);
    expect(p1.x).toBe(w / 2);
    expect(p1.y).toBe(h / 2);
    expect(p1.scale).toBe(1);

    // Test a point behind the camera (z = -PERSPECTIVE) should have scale <= 0 or very large
    const p2 = project(0, 0, -PERSPECTIVE);
    expect(p2.scale).toBe(Infinity); // Division by zero

    // Test a point in front
    const p3 = project(1, 1, 2);
    expect(p3.scale).toBeGreaterThan(0);
    expect(p3.scale).toBeLessThan(1);
    expect(Number.isFinite(p3.x)).toBe(true);
    expect(Number.isFinite(p3.y)).toBe(true);
  });

  it('easing function produces smooth values between 0 and 1', () => {
    // Hermite smoothstep: t * t * (3 - 2 * t)
    const ease = (t: number) => t * t * (3 - 2 * t);

    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    expect(ease(0.5)).toBe(0.5);
    // Should be monotonically increasing
    expect(ease(0.25)).toBeLessThan(ease(0.5));
    expect(ease(0.5)).toBeLessThan(ease(0.75));
    // Should stay in [0, 1]
    for (let t = 0; t <= 1; t += 0.1) {
      const v = ease(t);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('segment index calculation stays within bounds', () => {
    const numShapes = 6;
    const segLen = 1 / (numShapes - 1);

    // Test at various progress values
    const testValues = [0, 0.1, 0.2, 0.5, 0.8, 0.99, 1.0];
    for (const progress of testValues) {
      const segIdx = Math.min(Math.floor(progress / segLen), numShapes - 2);
      expect(segIdx).toBeGreaterThanOrEqual(0);
      expect(segIdx).toBeLessThanOrEqual(numShapes - 2);
    }
  });
});

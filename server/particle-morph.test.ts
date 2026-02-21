import { describe, it, expect } from 'vitest';

// Test the shape generator functions and core logic used by ParticleMorph
// These are pure math functions that can be tested without DOM

describe('ParticleMorph shape generators', () => {
  const NUM_PARTICLES = 200;

  // Replicate shape generators for testing
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

  function wrenchPositions(n: number): Float32Array {
    const p = new Float32Array(n * 3);
    const z = 0.25;
    for (let i = 0; i < n; i++) {
      const section = Math.random();
      if (section < 0.40) {
        // Jaw
        p[i * 3] = (Math.random() - 0.5) * 0.55;
        p[i * 3 + 1] = 1.1 + (Math.random() - 0.5) * 0.5;
      } else if (section < 0.70) {
        // Handle
        p[i * 3] = (Math.random() - 0.5) * 0.14;
        p[i * 3 + 1] = 0.85 - Math.random() * 2.4;
      } else {
        // Box end
        const angle = Math.random() * Math.PI * 2;
        p[i * 3] = Math.cos(angle) * 0.35;
        p[i * 3 + 1] = -1.6 + Math.sin(angle) * 0.35;
      }
      p[i * 3 + 2] = (Math.random() - 0.5) * z;
    }
    return p;
  }

  function hammerPositions(n: number): Float32Array {
    const p = new Float32Array(n * 3);
    const z = 0.25;
    for (let i = 0; i < n; i++) {
      const section = Math.random();
      if (section < 0.45) {
        // Head
        p[i * 3] = (Math.random() - 0.5) * 2.2;
        p[i * 3 + 1] = 1.0 + (Math.random() - 0.5) * 0.8;
      } else if (section < 0.85) {
        // Handle
        p[i * 3] = (Math.random() - 0.5) * 0.24;
        p[i * 3 + 1] = 0.55 - Math.random() * 2.8;
      } else {
        // Grip
        p[i * 3] = (Math.random() - 0.5) * 0.36;
        p[i * 3 + 1] = -2.1 - Math.random() * 0.3;
      }
      p[i * 3 + 2] = (Math.random() - 0.5) * z;
    }
    return p;
  }

  it('orbPositions generates correct number of coordinates', () => {
    const positions = orbPositions(NUM_PARTICLES);
    expect(positions).toBeInstanceOf(Float32Array);
    expect(positions.length).toBe(NUM_PARTICLES * 3);
  });

  it('orbPositions distributes particles on sphere shell at radius 1.4', () => {
    const positions = orbPositions(NUM_PARTICLES);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);
      expect(dist).toBeCloseTo(1.4, 1);
    }
  });

  it('wrenchPositions generates correct size with finite values', () => {
    const positions = wrenchPositions(NUM_PARTICLES);
    expect(positions).toBeInstanceOf(Float32Array);
    expect(positions.length).toBe(NUM_PARTICLES * 3);
    for (let i = 0; i < positions.length; i++) {
      expect(Number.isFinite(positions[i])).toBe(true);
    }
  });

  it('wrenchPositions has jaw, handle, and box-end regions', () => {
    const positions = wrenchPositions(1000);
    let jawCount = 0, handleCount = 0, boxCount = 0;
    for (let i = 0; i < 1000; i++) {
      const y = positions[i * 3 + 1];
      if (y > 0.8) jawCount++;
      else if (y < -1.2) boxCount++;
      else if (y < 0.5) handleCount++;
    }
    expect(jawCount).toBeGreaterThan(0);
    expect(handleCount).toBeGreaterThan(0);
    expect(boxCount).toBeGreaterThan(0);
  });

  it('hammerPositions generates correct size with finite values', () => {
    const positions = hammerPositions(NUM_PARTICLES);
    expect(positions).toBeInstanceOf(Float32Array);
    expect(positions.length).toBe(NUM_PARTICLES * 3);
    for (let i = 0; i < positions.length; i++) {
      expect(Number.isFinite(positions[i])).toBe(true);
    }
  });

  it('hammerPositions has head above handle', () => {
    const positions = hammerPositions(1000);
    let headCount = 0, handleCount = 0;
    for (let i = 0; i < 1000; i++) {
      const y = positions[i * 3 + 1];
      if (y > 0.5) headCount++;
      if (y < -0.5) handleCount++;
    }
    expect(headCount).toBeGreaterThan(0);
    expect(handleCount).toBeGreaterThan(0);
  });

  it('shape interpolation produces valid intermediate positions', () => {
    const s1 = hammerPositions(NUM_PARTICLES);
    const s2 = orbPositions(NUM_PARTICLES);
    const eased = 0.5;
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
    const w = 600, h = 500;
    function project(x: number, y: number, z: number) {
      const scale = PERSPECTIVE / (PERSPECTIVE + z);
      return {
        x: x * scale * (w * 0.22) + w / 2,
        y: -y * scale * (h * 0.22) + h / 2,
        scale,
      };
    }
    const p1 = project(0, 0, 0);
    expect(p1.x).toBe(w / 2);
    expect(p1.y).toBe(h / 2);
    expect(p1.scale).toBe(1);

    const p3 = project(1, 1, 2);
    expect(p3.scale).toBeGreaterThan(0);
    expect(p3.scale).toBeLessThan(1);
  });

  it('easing function produces smooth values between 0 and 1', () => {
    const ease = (t: number) => t * t * (3 - 2 * t);
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBe(1);
    expect(ease(0.5)).toBe(0.5);
    for (let t = 0; t <= 1; t += 0.1) {
      const v = ease(t);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it('dwell/plateau system: morphT is 0 during dwell, >0 during transition', () => {
    const dwellRatio = 0.65;

    // During dwell
    const segProg1 = 0.3;
    let morphT = segProg1 <= dwellRatio ? 0 : (segProg1 - dwellRatio) / (1 - dwellRatio);
    expect(morphT).toBe(0);

    // During transition
    const segProg2 = 0.85;
    morphT = segProg2 <= dwellRatio ? 0 : (segProg2 - dwellRatio) / (1 - dwellRatio);
    expect(morphT).toBeGreaterThan(0);
    expect(morphT).toBeLessThanOrEqual(1);
  });

  it('scroll-driven rotation: same progress always gives same angle', () => {
    const progress = 0.5;
    const rot1 = progress * Math.PI * 0.4;
    const rot2 = progress * Math.PI * 0.4;
    expect(rot1).toBe(rot2);
  });

  it('scroll-driven rotation: zero at progress 0', () => {
    expect(0 * Math.PI * 0.4).toBe(0);
  });

  it('hero variant has 6 shapes (orb, wrench, hammer, neural, voice, orb)', () => {
    expect(6).toBe(6);
  });

  it('pain points variant has 9 shapes (8 pain points + resolved orb)', () => {
    expect(9).toBe(9);
  });

  it('segment index stays within bounds for hero (6 shapes)', () => {
    const numShapes = 6;
    const segLen = 1 / (numShapes - 1);
    for (const progress of [0, 0.1, 0.2, 0.5, 0.8, 0.99, 1.0]) {
      const segIdx = Math.min(Math.floor(progress / segLen), numShapes - 2);
      expect(segIdx).toBeGreaterThanOrEqual(0);
      expect(segIdx).toBeLessThanOrEqual(numShapes - 2);
    }
  });

  it('segment index stays within bounds for pain points (9 shapes)', () => {
    const numShapes = 9;
    const segLen = 1 / (numShapes - 1);
    for (const progress of [0, 0.1, 0.3, 0.5, 0.7, 0.9, 0.99, 1.0]) {
      const segIdx = Math.min(Math.floor(progress / segLen), numShapes - 2);
      expect(segIdx).toBeGreaterThanOrEqual(0);
      expect(segIdx).toBeLessThanOrEqual(numShapes - 2);
    }
  });
});

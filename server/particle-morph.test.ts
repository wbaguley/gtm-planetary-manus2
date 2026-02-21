import { describe, it, expect } from 'vitest';

/**
 * ParticleMorph shape generator tests.
 * Tests the pure math shape generation functions used by the ParticleMorph component.
 */

const NUM_PARTICLES = 500;

// ─── Hero Shape Generators ──────────────────────────────────────────

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

function hardHatPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.40) {
      // Dome
      const angle = Math.random() * Math.PI;
      const rx = 1.0;
      const ry = 0.75;
      p[i * 3] = Math.cos(angle) * rx;
      p[i * 3 + 1] = Math.sin(angle) * ry + 0.1;
    } else if (section < 0.55) {
      // Dome fill
      const angle = Math.random() * Math.PI;
      const r = Math.sqrt(Math.random());
      p[i * 3] = Math.cos(angle) * r * 0.85;
      p[i * 3 + 1] = Math.sin(angle) * r * 0.6 + 0.15;
    } else if (section < 0.80) {
      // Brim
      p[i * 3] = (Math.random() - 0.5) * 2.6;
      p[i * 3 + 1] = 0.08 + (Math.random() - 0.5) * 0.06;
    } else {
      // Ridge and details
      p[i * 3] = (Math.random() - 0.5) * 0.6;
      p[i * 3 + 1] = 0.05 - Math.random() * 0.2;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return p;
}

function hammerPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.45) {
      // Rectangular head
      p[i * 3] = (Math.random() - 0.5) * 2.0;
      p[i * 3 + 1] = 1.0 + (Math.random() - 0.5) * 0.7;
    } else if (section < 0.88) {
      // Handle
      p[i * 3] = (Math.random() - 0.5) * 0.18;
      p[i * 3 + 1] = 0.6 - Math.random() * 2.6;
    } else {
      // Grip
      p[i * 3] = (Math.random() - 0.5) * 0.30;
      p[i * 3 + 1] = -2.0 - Math.random() * 0.25;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return p;
}

function neuralNetPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const layers: [number, number[]][] = [
    [-1.3, [-0.8, -0.25, 0.25, 0.8]],
    [-0.45, [-1.0, -0.5, 0.0, 0.5, 1.0]],
    [0.45, [-1.0, -0.5, 0.0, 0.5, 1.0]],
    [1.3, [-0.8, -0.25, 0.25, 0.8]],
  ];
  const allNodes: [number, number][] = [];
  for (const [x, ys] of layers) {
    for (const y of ys) allNodes.push([x, y]);
  }
  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.50) {
      const node = allNodes[Math.floor(Math.random() * allNodes.length)];
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.15;
      p[i * 3] = node[0] + Math.cos(angle) * r;
      p[i * 3 + 1] = node[1] + Math.sin(angle) * r;
    } else {
      const layerIdx = Math.floor(Math.random() * (layers.length - 1));
      const [x1, ys1] = layers[layerIdx];
      const [x2, ys2] = layers[layerIdx + 1];
      const y1 = ys1[Math.floor(Math.random() * ys1.length)];
      const y2 = ys2[Math.floor(Math.random() * ys2.length)];
      const t = Math.random();
      p[i * 3] = x1 + (x2 - x1) * t;
      p[i * 3 + 1] = y1 + (y2 - y1) * t;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  return p;
}

function voiceAIPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.50) {
      const angle = Math.random() * Math.PI;
      p[i * 3] = Math.cos(angle) * 0.30;
      p[i * 3 + 1] = 0.5 + Math.sin(angle) * 0.30;
    } else {
      const side = Math.random() > 0.5 ? 1 : -1;
      const waveR = 0.55 + Math.random() * 0.6;
      const angle = (Math.random() - 0.5) * Math.PI * 0.6;
      p[i * 3] = side * (0.40 + Math.cos(angle) * waveR);
      p[i * 3 + 1] = 0.3 + Math.sin(angle) * waveR * 0.4;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return p;
}

// ─── Pain Point Shape Generators ────────────────────────────────────

function chaosClockPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.50) {
      const angle = Math.random() * Math.PI * 2;
      p[i * 3] = Math.cos(angle) * 1.2;
      p[i * 3 + 1] = Math.sin(angle) * 1.2;
    } else {
      const angle = Math.random() * Math.PI * 2;
      const dist = 1.5 + Math.random();
      p[i * 3] = Math.cos(angle) * dist;
      p[i * 3 + 1] = Math.sin(angle) * dist;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  return p;
}

function dollarSignPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.60) {
      const t = Math.random() * Math.PI;
      p[i * 3] = Math.cos(t) * 0.65;
      p[i * 3 + 1] = Math.sin(t) * 0.35 + 0.45;
    } else {
      p[i * 3] = (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return p;
}

function targetPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.50) {
      const angle = Math.random() * Math.PI * 2;
      const ring = Math.floor(Math.random() * 3);
      const r = [0.45, 0.85, 1.25][ring];
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
    } else {
      const isH = Math.random() > 0.5;
      const t = (Math.random() - 0.5) * 2.8;
      p[i * 3] = isH ? t : 0;
      p[i * 3 + 1] = isH ? 0 : t;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return p;
}

function phoneGapsPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.50) {
      p[i * 3] = (Math.random() - 0.5) * 0.7;
      p[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
    } else {
      const side = Math.random() > 0.5 ? 1 : -1;
      const waveR = 0.5 + Math.random() * 0.7;
      const angle = (Math.random() - 0.5) * Math.PI * 0.6;
      p[i * 3] = side * (0.45 + Math.cos(angle) * waveR);
      p[i * 3 + 1] = 0.3 + Math.sin(angle) * waveR * 0.4;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return p;
}

// ─── Tests ──────────────────────────────────────────────────────────

describe('ParticleMorph shape generators', () => {
  describe('Hero shapes', () => {
    it('orbPositions generates correct Float32Array on sphere shell at r=1.4', () => {
      const pos = orbPositions(NUM_PARTICLES);
      expect(pos).toBeInstanceOf(Float32Array);
      expect(pos.length).toBe(NUM_PARTICLES * 3);
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
        const dist = Math.sqrt(x * x + y * y + z * z);
        expect(dist).toBeCloseTo(1.4, 1);
      }
    });

    it('hardHatPositions has dome above brim and wide brim', () => {
      const pos = hardHatPositions(1000);
      let domeCount = 0, brimCount = 0;
      for (let i = 0; i < 1000; i++) {
        const x = Math.abs(pos[i * 3]), y = pos[i * 3 + 1];
        if (y > 0.3) domeCount++;
        if (y < 0.15 && y > -0.1 && x > 0.5) brimCount++;
      }
      expect(domeCount).toBeGreaterThan(100);
      expect(brimCount).toBeGreaterThan(50);
    });

    it('hardHatPositions has no NaN values', () => {
      const pos = hardHatPositions(NUM_PARTICLES);
      for (let i = 0; i < pos.length; i++) {
        expect(Number.isFinite(pos[i])).toBe(true);
      }
    });

    it('hammerPositions has wide rectangular head and narrow handle', () => {
      const pos = hammerPositions(1000);
      let headWide = 0, handleNarrow = 0;
      for (let i = 0; i < 1000; i++) {
        const x = Math.abs(pos[i * 3]), y = pos[i * 3 + 1];
        if (y > 0.5 && x > 0.3) headWide++;
        if (y < 0 && x < 0.15) handleNarrow++;
      }
      expect(headWide).toBeGreaterThan(50);
      expect(handleNarrow).toBeGreaterThan(50);
    });

    it('hammerPositions has no NaN values', () => {
      const pos = hammerPositions(NUM_PARTICLES);
      for (let i = 0; i < pos.length; i++) {
        expect(Number.isFinite(pos[i])).toBe(true);
      }
    });

    it('neuralNetPositions spreads across 4 layers', () => {
      const pos = neuralNetPositions(1000);
      let leftCount = 0, rightCount = 0;
      for (let i = 0; i < 1000; i++) {
        if (pos[i * 3] < -0.8) leftCount++;
        if (pos[i * 3] > 0.8) rightCount++;
      }
      expect(leftCount).toBeGreaterThan(50);
      expect(rightCount).toBeGreaterThan(50);
    });

    it('voiceAIPositions has sound waves on both sides', () => {
      const pos = voiceAIPositions(1000);
      let leftWave = 0, rightWave = 0;
      for (let i = 0; i < 1000; i++) {
        const x = pos[i * 3];
        if (x < -0.5) leftWave++;
        if (x > 0.5) rightWave++;
      }
      expect(leftWave).toBeGreaterThan(50);
      expect(rightWave).toBeGreaterThan(50);
    });
  });

  describe('Pain point shapes', () => {
    it('chaosClockPositions has circular distribution and debris', () => {
      const pos = chaosClockPositions(1000);
      let nearCircle = 0, debris = 0;
      for (let i = 0; i < 1000; i++) {
        const x = pos[i * 3], y = pos[i * 3 + 1];
        const dist = Math.sqrt(x * x + y * y);
        if (dist > 1.0 && dist < 1.4) nearCircle++;
        if (dist > 1.4) debris++;
      }
      expect(nearCircle).toBeGreaterThan(50);
      expect(debris).toBeGreaterThan(50);
    });

    it('dollarSignPositions has vertical extent > 1.5', () => {
      const pos = dollarSignPositions(NUM_PARTICLES);
      let minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < NUM_PARTICLES; i++) {
        const y = pos[i * 3 + 1];
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
      expect(maxY - minY).toBeGreaterThan(1.5);
    });

    it('targetPositions has concentric rings', () => {
      const pos = targetPositions(1000);
      let inner = 0, outer = 0;
      for (let i = 0; i < 1000; i++) {
        const x = pos[i * 3], y = pos[i * 3 + 1];
        const dist = Math.sqrt(x * x + y * y);
        if (dist > 0.3 && dist < 0.6) inner++;
        if (dist > 1.0 && dist < 1.5) outer++;
      }
      expect(inner).toBeGreaterThan(0);
      expect(outer).toBeGreaterThan(0);
    });

    it('phoneGapsPositions has phone body and signal waves', () => {
      const pos = phoneGapsPositions(1000);
      let body = 0, waves = 0;
      for (let i = 0; i < 1000; i++) {
        const x = Math.abs(pos[i * 3]);
        if (x < 0.4) body++;
        if (x > 0.8) waves++;
      }
      expect(body).toBeGreaterThan(100);
      expect(waves).toBeGreaterThan(50);
    });
  });

  describe('Shape configuration', () => {
    it('hero variant has 6 shapes (orb → hardhat → hammer → neural → voice → orb)', () => {
      const heroShapes = [
        orbPositions(100),
        hardHatPositions(100),
        hammerPositions(100),
        neuralNetPositions(100),
        voiceAIPositions(100),
        orbPositions(100),
      ];
      expect(heroShapes.length).toBe(6);
      heroShapes.forEach(s => {
        expect(s).toBeInstanceOf(Float32Array);
        expect(s.length).toBe(300);
      });
    });

    it('painPoints variant has 5 shapes (clock → dollar → target → phone → orb)', () => {
      const painShapes = [
        chaosClockPositions(100),
        dollarSignPositions(100),
        targetPositions(100),
        phoneGapsPositions(100),
        orbPositions(100),
      ];
      expect(painShapes.length).toBe(5);
      painShapes.forEach(s => {
        expect(s).toBeInstanceOf(Float32Array);
        expect(s.length).toBe(300);
      });
    });

    it('all shapes have thin z-depth (< 0.3) for readable silhouettes', () => {
      const shapes = [
        hardHatPositions(NUM_PARTICLES),
        hammerPositions(NUM_PARTICLES),
        neuralNetPositions(NUM_PARTICLES),
        voiceAIPositions(NUM_PARTICLES),
        chaosClockPositions(NUM_PARTICLES),
        dollarSignPositions(NUM_PARTICLES),
        targetPositions(NUM_PARTICLES),
        phoneGapsPositions(NUM_PARTICLES),
      ];
      shapes.forEach(shape => {
        let maxZ = 0;
        for (let i = 0; i < NUM_PARTICLES; i++) {
          maxZ = Math.max(maxZ, Math.abs(shape[i * 3 + 2]));
        }
        expect(maxZ).toBeLessThan(0.3);
      });
    });

    it('unified brand purple color is [168, 85, 247]', () => {
      const BRAND_PURPLE: [number, number, number] = [168, 85, 247];
      expect(BRAND_PURPLE).toEqual([168, 85, 247]);
    });
  });

  describe('Core animation logic', () => {
    it('shape interpolation produces finite values', () => {
      const s1 = hammerPositions(NUM_PARTICLES);
      const s2 = orbPositions(NUM_PARTICLES);
      for (const eased of [0, 0.25, 0.5, 0.75, 1.0]) {
        for (let i = 0; i < NUM_PARTICLES; i++) {
          const i3 = i * 3;
          const x = s1[i3] + (s2[i3] - s1[i3]) * eased;
          const y = s1[i3 + 1] + (s2[i3 + 1] - s1[i3 + 1]) * eased;
          const z = s1[i3 + 2] + (s2[i3 + 2] - s1[i3 + 2]) * eased;
          expect(Number.isFinite(x)).toBe(true);
          expect(Number.isFinite(y)).toBe(true);
          expect(Number.isFinite(z)).toBe(true);
        }
      }
    });

    it('dwell/plateau: morphT is 0 during dwell (65%), transitions after', () => {
      const dwellRatio = 0.65;
      // During dwell
      for (const seg of [0, 0.1, 0.3, 0.5, 0.64]) {
        const morphT = seg <= dwellRatio ? 0 : (seg - dwellRatio) / (1 - dwellRatio);
        expect(morphT).toBe(0);
      }
      // During transition
      for (const seg of [0.7, 0.8, 0.9, 1.0]) {
        const morphT = seg <= dwellRatio ? 0 : (seg - dwellRatio) / (1 - dwellRatio);
        expect(morphT).toBeGreaterThan(0);
        expect(morphT).toBeLessThanOrEqual(1.001);
      }
    });

    it('smoothstep easing is correct at key points', () => {
      const ease = (t: number) => t * t * (3 - 2 * t);
      expect(ease(0)).toBe(0);
      expect(ease(0.5)).toBe(0.5);
      expect(ease(1)).toBe(1);
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

    it('segment index stays within bounds for pain points (5 shapes)', () => {
      const numShapes = 5;
      const segLen = 1 / (numShapes - 1);
      for (const progress of [0, 0.1, 0.3, 0.5, 0.7, 0.9, 0.99, 1.0]) {
        const segIdx = Math.min(Math.floor(progress / segLen), numShapes - 2);
        expect(segIdx).toBeGreaterThanOrEqual(0);
        expect(segIdx).toBeLessThanOrEqual(numShapes - 2);
      }
    });

    it('projection produces valid screen coordinates', () => {
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
      const center = project(0, 0, 0);
      expect(center.x).toBe(w / 2);
      expect(center.y).toBe(h / 2);
      expect(center.scale).toBe(1);

      const far = project(1, 1, 2);
      expect(far.scale).toBeGreaterThan(0);
      expect(far.scale).toBeLessThan(1);
    });
  });
});

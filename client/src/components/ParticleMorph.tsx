import { useEffect, useRef, useCallback, useMemo } from 'react';

// ─── Utility: fill outline of a 2D path with particles ─────────────
// Distributes particles along line segments with thickness for visibility
function fillPath2D(
  n: number,
  segments: { x1: number; y1: number; x2: number; y2: number }[],
  thickness: number = 0.06,
  zSpread: number = 0.25
): Float32Array {
  const p = new Float32Array(n * 3);
  // Calculate total length for proportional distribution
  const lengths = segments.map(s => Math.sqrt((s.x2 - s.x1) ** 2 + (s.y2 - s.y1) ** 2));
  const totalLen = lengths.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) {
    // Pick a random point along the total path
    let t = Math.random() * totalLen;
    let segIdx = 0;
    while (segIdx < lengths.length - 1 && t > lengths[segIdx]) {
      t -= lengths[segIdx];
      segIdx++;
    }
    const seg = segments[segIdx];
    const frac = lengths[segIdx] > 0 ? t / lengths[segIdx] : 0;
    const x = seg.x1 + (seg.x2 - seg.x1) * frac + (Math.random() - 0.5) * thickness;
    const y = seg.y1 + (seg.y2 - seg.y1) * frac + (Math.random() - 0.5) * thickness;
    const z = (Math.random() - 0.5) * zSpread;
    p[i * 3] = x;
    p[i * 3 + 1] = y;
    p[i * 3 + 2] = z;
  }
  return p;
}

// Fill a circle arc with particles
function fillArc(
  p: Float32Array, startIdx: number, count: number,
  cx: number, cy: number, r: number,
  startAngle: number, endAngle: number,
  thickness: number = 0.06, zSpread: number = 0.25
) {
  for (let i = 0; i < count; i++) {
    const angle = startAngle + Math.random() * (endAngle - startAngle);
    const rr = r + (Math.random() - 0.5) * thickness;
    const idx = (startIdx + i) * 3;
    p[idx] = cx + Math.cos(angle) * rr;
    p[idx + 1] = cy + Math.sin(angle) * rr;
    p[idx + 2] = (Math.random() - 0.5) * zSpread;
  }
}

// Fill a filled circle area
function fillDisk(
  p: Float32Array, startIdx: number, count: number,
  cx: number, cy: number, r: number, zSpread: number = 0.25
) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const rr = Math.sqrt(Math.random()) * r;
    const idx = (startIdx + i) * 3;
    p[idx] = cx + Math.cos(angle) * rr;
    p[idx + 1] = cy + Math.sin(angle) * rr;
    p[idx + 2] = (Math.random() - 0.5) * zSpread;
  }
}

// ─── HERO Shape Generators ──────────────────────────────────────────

// 1. HAMMER - clear trade tool silhouette
function hammerPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const headCount = Math.floor(n * 0.45);
  const handleCount = n - headCount;
  
  // Hammer head - rectangular block at top
  for (let i = 0; i < headCount; i++) {
    const section = Math.random();
    if (section < 0.7) {
      // Main head block
      p[i * 3] = (Math.random() - 0.5) * 1.8;
      p[i * 3 + 1] = 0.8 + (Math.random() - 0.5) * 0.7;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    } else {
      // Claw fork on one side
      const clawAngle = Math.random() * 0.6 + 0.2;
      p[i * 3] = -0.9 - Math.random() * 0.4;
      p[i * 3 + 1] = 0.8 + Math.sin(clawAngle * Math.PI) * 0.5;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.3 + (Math.random() > 0.5 ? 0.15 : -0.15);
    }
  }
  
  // Handle - long shaft going down
  for (let i = 0; i < handleCount; i++) {
    const idx = headCount + i;
    p[idx * 3] = (Math.random() - 0.5) * 0.2;
    p[idx * 3 + 1] = 0.4 - Math.random() * 2.4;
    p[idx * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  return p;
}

// 2. GEAR/COG - mechanical transition
function gearPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const outerR = 1.4;
  const innerR = 0.9;
  const teeth = 10;
  const toothH = 0.35;
  
  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.15) {
      // Center hole
      const angle = Math.random() * Math.PI * 2;
      const r = 0.25 + (Math.random() - 0.5) * 0.08;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    } else if (section < 0.55) {
      // Outer ring with teeth
      const angle = Math.random() * Math.PI * 2;
      const toothPhase = (angle / (Math.PI * 2)) * teeth;
      const inTooth = (toothPhase % 1) < 0.45;
      const r = inTooth ? outerR + toothH * Math.random() : outerR;
      p[i * 3] = Math.cos(angle) * (r + (Math.random() - 0.5) * 0.08);
      p[i * 3 + 1] = Math.sin(angle) * (r + (Math.random() - 0.5) * 0.08);
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.35;
    } else {
      // Inner body fill
      const angle = Math.random() * Math.PI * 2;
      const r = innerR * (0.35 + Math.random() * 0.65);
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
  }
  return p;
}

// 3. BRAIN - AI intelligence (improved for clarity)
function brainPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const section = Math.random();
    
    if (section < 0.6) {
      // Brain hemispheres - two bumpy lobes
      const phi = Math.acos(-1 + 2 * Math.random());
      const theta = Math.random() * Math.PI * 2;
      const baseR = 1.1;
      const bumps = Math.sin(theta * 5) * 0.12 + Math.sin(phi * 7) * 0.08;
      const r = baseR + bumps;
      p[i * 3] = Math.sin(phi) * Math.cos(theta) * r * 0.55 + side * 0.35;
      p[i * 3 + 1] = Math.cos(phi) * r * 0.7 + 0.1;
      p[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r * 0.6;
    } else if (section < 0.75) {
      // Central fissure (dividing line)
      p[i * 3] = (Math.random() - 0.5) * 0.06;
      p[i * 3 + 1] = (Math.random() - 0.3) * 1.4;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    } else if (section < 0.9) {
      // Brain stem
      p[i * 3] = (Math.random() - 0.5) * 0.25;
      p[i * 3 + 1] = -0.8 - Math.random() * 0.6;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
    } else {
      // Wrinkle ridges on surface
      const ridge = Math.floor(Math.random() * 6);
      const t = Math.random();
      const angle = (ridge / 6) * Math.PI + t * 0.3;
      const r = 0.9 + Math.sin(t * 10) * 0.05;
      p[i * 3] = Math.cos(angle) * r * 0.5 + side * 0.2;
      p[i * 3 + 1] = (t - 0.5) * 1.2 + 0.1;
      p[i * 3 + 2] = Math.sin(angle) * r * 0.5;
    }
  }
  return p;
}

// 4. NEURAL NETWORK - connected nodes with visible connections
function neuralNetPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  // Create node positions in layers
  const layers = [
    [-1.2, [-0.9, -0.3, 0.3, 0.9]],
    [-0.4, [-1.1, -0.5, 0.0, 0.5, 1.1]],
    [0.4, [-1.1, -0.5, 0.0, 0.5, 1.1]],
    [1.2, [-0.9, -0.3, 0.3, 0.9]],
  ] as [number, number[]][];
  
  const allNodes: [number, number][] = [];
  for (const [x, ys] of layers) {
    for (const y of ys) {
      allNodes.push([x, y]);
    }
  }
  
  const nodeCount = Math.floor(n * 0.35);
  const connectionCount = n - nodeCount;
  
  // Nodes - dense clusters
  for (let i = 0; i < nodeCount; i++) {
    const node = allNodes[Math.floor(Math.random() * allNodes.length)];
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.15;
    p[i * 3] = node[0] + Math.cos(angle) * r;
    p[i * 3 + 1] = node[1] + Math.sin(angle) * r;
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  
  // Connections between layers
  for (let i = 0; i < connectionCount; i++) {
    const idx = nodeCount + i;
    const layerIdx = Math.floor(Math.random() * (layers.length - 1));
    const [x1, ys1] = layers[layerIdx];
    const [x2, ys2] = layers[layerIdx + 1];
    const y1 = ys1[Math.floor(Math.random() * ys1.length)];
    const y2 = ys2[Math.floor(Math.random() * ys2.length)];
    const t = Math.random();
    p[idx * 3] = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 0.03;
    p[idx * 3 + 1] = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 0.03;
    p[idx * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return p;
}

// 5. DNA Helix - advanced AI
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

// 6. Glowing Sphere - fully evolved AI
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


// ─── PAIN POINT Shape Generators (8 shapes, one per pain point) ────

// 1. Job Management Chaos - scattered calendar/clock fragments
function chaosClockPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const clockCount = Math.floor(n * 0.4);
  const debrisCount = n - clockCount;
  
  // Broken clock face
  for (let i = 0; i < clockCount; i++) {
    const section = Math.random();
    if (section < 0.4) {
      // Clock circle outline (broken)
      const angle = Math.random() * Math.PI * 2;
      if (Math.sin(angle * 3) > -0.3) { // gaps in the circle
        const r = 1.2 + (Math.random() - 0.5) * 0.08;
        p[i * 3] = Math.cos(angle) * r;
        p[i * 3 + 1] = Math.sin(angle) * r;
      }
    } else if (section < 0.6) {
      // Clock hands (broken, at odd angles)
      const hand = Math.random() > 0.5 ? 0.7 : 1.0;
      const angle = Math.random() > 0.5 ? 2.1 : 4.5; // two hands
      const t = Math.random() * hand;
      p[i * 3] = Math.cos(angle) * t + (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = Math.sin(angle) * t + (Math.random() - 0.5) * 0.04;
    } else {
      // Hour markers
      const hour = Math.floor(Math.random() * 12);
      const angle = (hour / 12) * Math.PI * 2 - Math.PI / 2;
      p[i * 3] = Math.cos(angle) * 1.0 + (Math.random() - 0.5) * 0.1;
      p[i * 3 + 1] = Math.sin(angle) * 1.0 + (Math.random() - 0.5) * 0.1;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }
  
  // Scattered debris flying outward
  for (let i = 0; i < debrisCount; i++) {
    const idx = clockCount + i;
    const angle = Math.random() * Math.PI * 2;
    const dist = 1.5 + Math.random() * 1.5;
    p[idx * 3] = Math.cos(angle) * dist + (Math.random() - 0.5) * 0.3;
    p[idx * 3 + 1] = Math.sin(angle) * dist + (Math.random() - 0.5) * 0.3;
    p[idx * 3 + 2] = (Math.random() - 0.5) * 1.5;
  }
  return p;
}

// 2. System Overload - tangled chain links / broken connections
function tangledSystemPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const numChains = 6;
  
  for (let i = 0; i < n; i++) {
    const chain = Math.floor(Math.random() * numChains);
    const t = Math.random();
    
    // Each chain is a tangled curve
    const baseAngle = (chain / numChains) * Math.PI * 2;
    const wobble = Math.sin(t * 8 + chain * 2) * 0.5;
    const r = 0.3 + t * 1.2;
    
    p[i * 3] = Math.cos(baseAngle + t * 3 + wobble) * r + (Math.random() - 0.5) * 0.08;
    p[i * 3 + 1] = Math.sin(baseAngle + t * 3 + wobble) * r + (Math.random() - 0.5) * 0.08;
    p[i * 3 + 2] = Math.sin(t * 5 + chain) * 0.6 + (Math.random() - 0.5) * 0.15;
  }
  return p;
}

// 3. Cash Flow Crunch - dollar sign crumbling/breaking apart
function dollarSignPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const signCount = Math.floor(n * 0.6);
  const crumbleCount = n - signCount;
  
  // Dollar sign shape
  for (let i = 0; i < signCount; i++) {
    const section = Math.random();
    if (section < 0.35) {
      // Top S-curve
      const t = Math.random() * Math.PI;
      const r = 0.7;
      p[i * 3] = Math.cos(t + Math.PI) * r + (Math.random() - 0.5) * 0.06;
      p[i * 3 + 1] = Math.sin(t) * 0.4 + 0.5 + (Math.random() - 0.5) * 0.06;
    } else if (section < 0.7) {
      // Bottom S-curve (reversed)
      const t = Math.random() * Math.PI;
      const r = 0.7;
      p[i * 3] = Math.cos(t) * r + (Math.random() - 0.5) * 0.06;
      p[i * 3 + 1] = Math.sin(t + Math.PI) * 0.4 - 0.5 + (Math.random() - 0.5) * 0.06;
    } else {
      // Vertical line through center
      p[i * 3] = (Math.random() - 0.5) * 0.06;
      p[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
  }
  
  // Crumbling pieces falling away
  for (let i = 0; i < crumbleCount; i++) {
    const idx = signCount + i;
    const angle = Math.random() * Math.PI * 2;
    const dist = 1.0 + Math.random() * 1.2;
    const fall = -Math.random() * 1.5; // falling downward
    p[idx * 3] = Math.cos(angle) * dist * 0.6 + (Math.random() - 0.5) * 0.2;
    p[idx * 3 + 1] = fall + (Math.random() - 0.5) * 0.5;
    p[idx * 3 + 2] = Math.sin(angle) * dist * 0.4 + (Math.random() - 0.5) * 0.5;
  }
  return p;
}

// 4. Contract Hunting - target/bullseye with gaps
function targetPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  
  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.2) {
      // Center dot
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.2;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
    } else if (section < 0.45) {
      // Inner ring (with gaps)
      const angle = Math.random() * Math.PI * 2;
      if (Math.sin(angle * 2) > -0.5) {
        const r = 0.55 + (Math.random() - 0.5) * 0.08;
        p[i * 3] = Math.cos(angle) * r;
        p[i * 3 + 1] = Math.sin(angle) * r;
      }
    } else if (section < 0.7) {
      // Outer ring (with gaps)
      const angle = Math.random() * Math.PI * 2;
      if (Math.cos(angle * 3) > -0.3) {
        const r = 1.0 + (Math.random() - 0.5) * 0.08;
        p[i * 3] = Math.cos(angle) * r;
        p[i * 3 + 1] = Math.sin(angle) * r;
      }
    } else if (section < 0.85) {
      // Outermost ring
      const angle = Math.random() * Math.PI * 2;
      const r = 1.4 + (Math.random() - 0.5) * 0.08;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
    } else {
      // Crosshair lines
      const axis = Math.random() > 0.5;
      const t = (Math.random() - 0.5) * 3.0;
      p[i * 3] = axis ? t : (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = axis ? (Math.random() - 0.5) * 0.04 : t;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  return p;
}

// 5. Admin Time Sink - hourglass draining
function hourglassPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  
  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.25) {
      // Top triangle (inverted) - full of sand
      const t = Math.random();
      const width = t * 1.0;
      p[i * 3] = (Math.random() - 0.5) * width * 2;
      p[i * 3 + 1] = 0.1 + t * 1.3;
    } else if (section < 0.5) {
      // Bottom triangle - filling with sand
      const t = Math.random();
      const width = (1 - t) * 1.0;
      p[i * 3] = (Math.random() - 0.5) * width * 2;
      p[i * 3 + 1] = -0.1 - t * 1.3;
    } else if (section < 0.6) {
      // Narrow middle (neck)
      p[i * 3] = (Math.random() - 0.5) * 0.08;
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
    } else if (section < 0.7) {
      // Sand stream through middle
      p[i * 3] = (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
    } else if (section < 0.85) {
      // Top frame bar
      const y = Math.random() > 0.5 ? 1.45 : -1.45;
      p[i * 3] = (Math.random() - 0.5) * 2.2;
      p[i * 3 + 1] = y + (Math.random() - 0.5) * 0.08;
    } else {
      // Side frame lines
      const side = Math.random() > 0.5 ? 1 : -1;
      const topOrBottom = Math.random() > 0.5;
      if (topOrBottom) {
        const t = Math.random();
        p[i * 3] = side * (0.04 + t * 0.96);
        p[i * 3 + 1] = 1.4 + (Math.random() - 0.5) * 0.06;
      } else {
        const t = Math.random();
        p[i * 3] = side * (0.04 + t * 0.96);
        p[i * 3 + 1] = -1.4 + (Math.random() - 0.5) * 0.06;
      }
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
  }
  return p;
}

// 6. Scaling Wall - brick wall barrier
function brickWallPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const rows = 7;
  const cols = 5;
  const brickW = 0.55;
  const brickH = 0.32;
  const gap = 0.04;
  
  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.8) {
      // Brick outlines
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      const offset = (row % 2) * brickW * 0.5; // stagger rows
      
      const bx = (col - cols / 2) * (brickW + gap) + offset;
      const by = (row - rows / 2) * (brickH + gap);
      
      // Place on brick edges
      const edge = Math.random();
      if (edge < 0.25) {
        p[i * 3] = bx + (Math.random() - 0.5) * brickW;
        p[i * 3 + 1] = by + brickH / 2;
      } else if (edge < 0.5) {
        p[i * 3] = bx + (Math.random() - 0.5) * brickW;
        p[i * 3 + 1] = by - brickH / 2;
      } else if (edge < 0.75) {
        p[i * 3] = bx + brickW / 2;
        p[i * 3 + 1] = by + (Math.random() - 0.5) * brickH;
      } else {
        p[i * 3] = bx - brickW / 2;
        p[i * 3 + 1] = by + (Math.random() - 0.5) * brickH;
      }
    } else {
      // Cracks running through wall
      const crackY = (Math.random() - 0.5) * 2.5;
      const crackX = Math.sin(crackY * 2) * 0.3 + (Math.random() - 0.5) * 0.1;
      p[i * 3] = crackX;
      p[i * 3 + 1] = crackY;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  return p;
}

// 7. Customer Service Gaps - phone with disconnected signal waves
function phoneGapsPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const phoneCount = Math.floor(n * 0.45);
  const waveCount = n - phoneCount;
  
  // Phone body
  for (let i = 0; i < phoneCount; i++) {
    const section = Math.random();
    if (section < 0.6) {
      // Phone rectangle body
      const edge = Math.random();
      if (edge < 0.3) {
        // Fill body
        p[i * 3] = (Math.random() - 0.5) * 0.8;
        p[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      } else if (edge < 0.55) {
        // Left/right edges
        p[i * 3] = (Math.random() > 0.5 ? 0.4 : -0.4) + (Math.random() - 0.5) * 0.04;
        p[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      } else if (edge < 0.8) {
        // Top/bottom edges
        p[i * 3] = (Math.random() - 0.5) * 0.8;
        p[i * 3 + 1] = (Math.random() > 0.5 ? 0.8 : -0.8) + (Math.random() - 0.5) * 0.04;
      } else {
        // Screen area
        p[i * 3] = (Math.random() - 0.5) * 0.6;
        p[i * 3 + 1] = (Math.random() - 0.5) * 1.0 + 0.1;
      }
    } else {
      // X mark on screen (missed call)
      const arm = Math.random() > 0.5 ? 1 : -1;
      const t = (Math.random() - 0.5) * 0.5;
      p[i * 3] = t * arm;
      p[i * 3 + 1] = t + 0.1;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  
  // Broken signal waves radiating out
  for (let i = 0; i < waveCount; i++) {
    const idx = phoneCount + i;
    const waveNum = Math.floor(Math.random() * 3);
    const r = 1.0 + waveNum * 0.5;
    const angle = Math.random() * Math.PI * 0.8 + Math.PI * 0.1; // upper right quadrant
    
    // Broken arcs (gaps)
    if (Math.sin(angle * 4 + waveNum) > -0.2) {
      p[idx * 3] = 0.5 + Math.cos(angle) * r + (Math.random() - 0.5) * 0.06;
      p[idx * 3 + 1] = 0.3 + Math.sin(angle) * r + (Math.random() - 0.5) * 0.06;
    } else {
      // Scattered fragments where gaps are
      p[idx * 3] = 0.5 + Math.cos(angle) * (r + 0.3) + (Math.random() - 0.5) * 0.3;
      p[idx * 3 + 1] = 0.3 + Math.sin(angle) * (r + 0.3) + (Math.random() - 0.5) * 0.3;
    }
    p[idx * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  return p;
}

// 8. Tech Resistance - paper stack / spreadsheet
function paperStackPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const numSheets = 5;
  
  for (let i = 0; i < n; i++) {
    const sheet = Math.floor(Math.random() * numSheets);
    const zOff = (sheet - numSheets / 2) * 0.2;
    const xOff = sheet * 0.08;
    const yOff = sheet * 0.05;
    const section = Math.random();
    
    if (section < 0.5) {
      // Paper edges
      const edge = Math.random();
      if (edge < 0.25) {
        p[i * 3] = xOff + (Math.random() - 0.5) * 1.4;
        p[i * 3 + 1] = yOff + 0.9;
      } else if (edge < 0.5) {
        p[i * 3] = xOff + (Math.random() - 0.5) * 1.4;
        p[i * 3 + 1] = yOff - 0.9;
      } else if (edge < 0.75) {
        p[i * 3] = xOff + 0.7;
        p[i * 3 + 1] = yOff + (Math.random() - 0.5) * 1.8;
      } else {
        p[i * 3] = xOff - 0.7;
        p[i * 3 + 1] = yOff + (Math.random() - 0.5) * 1.8;
      }
    } else if (section < 0.75) {
      // Text lines on paper
      const line = Math.floor(Math.random() * 6);
      p[i * 3] = xOff + (Math.random() - 0.3) * 1.0 - 0.1;
      p[i * 3 + 1] = yOff + 0.6 - line * 0.25 + (Math.random() - 0.5) * 0.02;
    } else {
      // Dog-eared corner
      if (sheet === numSheets - 1) {
        const t = Math.random() * 0.3;
        p[i * 3] = xOff + 0.7 - t;
        p[i * 3 + 1] = yOff + 0.9 - t;
      } else {
        // Random fill
        p[i * 3] = xOff + (Math.random() - 0.5) * 1.2;
        p[i * 3 + 1] = yOff + (Math.random() - 0.5) * 1.6;
      }
    }
    p[i * 3 + 2] = zOff + (Math.random() - 0.5) * 0.08;
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
  const dprRef = useRef(1);
  const logicalWidthRef = useRef(0);
  const logicalHeightRef = useRef(0);

  // Pre-compute shapes once
  const shapes = useMemo(() => {
    if (variant === 'hero') {
      return [
        hammerPositions(NUM_PARTICLES),       // Trade tool
        gearPositions(NUM_PARTICLES),         // Mechanical transition
        brainPositions(NUM_PARTICLES),        // AI intelligence
        neuralNetPositions(NUM_PARTICLES),    // Connected AI
        dnaPositions(NUM_PARTICLES),          // Advanced AI
        spherePositions(NUM_PARTICLES, 1.5),  // Fully evolved
      ];
    } else {
      // 8 shapes + 1 resolved = 9 shapes for pain points
      return [
        chaosClockPositions(NUM_PARTICLES),     // 1. Job Management Chaos
        tangledSystemPositions(NUM_PARTICLES),   // 2. System Overload
        dollarSignPositions(NUM_PARTICLES),      // 3. Cash Flow Crunch
        targetPositions(NUM_PARTICLES),          // 4. Contract Hunting
        hourglassPositions(NUM_PARTICLES),       // 5. Admin Time Sink
        brickWallPositions(NUM_PARTICLES),       // 6. Scaling Wall
        phoneGapsPositions(NUM_PARTICLES),       // 7. Customer Service Gaps
        paperStackPositions(NUM_PARTICLES),      // 8. Tech Resistance
        spherePositions(NUM_PARTICLES, 1.5),     // Resolved state
      ];
    }
  }, [variant]);

  const colors = useMemo(() => {
    if (variant === 'hero') {
      return [
        [255, 165, 50],   // Orange/amber - hammer (trade warmth)
        [180, 140, 200],  // Muted purple - gear (transition)
        [178, 25, 230],   // Magenta - brain
        [77, 204, 255],   // Cyan - neural net
        [128, 255, 128],  // Green - DNA
        [204, 102, 255],  // Light purple - sphere
      ];
    } else {
      return [
        [255, 60, 60],    // Red - chaos clock
        [255, 100, 30],   // Orange - tangled systems
        [255, 200, 50],   // Gold - dollar sign
        [255, 80, 80],    // Red - target
        [200, 100, 255],  // Purple - hourglass
        [255, 120, 50],   // Orange - brick wall
        [100, 180, 255],  // Blue - phone
        [180, 180, 180],  // Gray - paper
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
      const eased = segProg * segProg * (3 - 2 * segProg);

      const s1 = shapes[segIdx];
      const s2 = shapes[segIdx + 1];
      const c1 = colors[segIdx];
      const c2 = colors[segIdx + 1];

      const cr = Math.round(c1[0] + (c2[0] - c1[0]) * eased);
      const cg = Math.round(c1[1] + (c2[1] - c1[1]) * eased);
      const cb = Math.round(c1[2] + (c2[2] - c1[2]) * eased);

      // Slower rotation for pain points to keep shapes readable
      const rotSpeed = variant === 'painPoints' ? 0.15 : 0.3;
      rotationRef.current += delta * rotSpeed;
      const rot = rotationRef.current;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const tiltAngle = Math.sin(time * 0.0003) * (variant === 'painPoints' ? 0.08 : 0.15);
      const cosT = Math.cos(tiltAngle);
      const sinT = Math.sin(tiltAngle);

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

      ctx.resetTransform();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < NUM_PARTICLES; i++) {
        const i3 = i * 3;
        let x = currentPositions[i3];
        let y = currentPositions[i3+1];
        let z = currentPositions[i3+2];

        const rx = x * cosR - z * sinR;
        const rz = x * sinR + z * cosR;
        x = rx;
        z = rz;

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

      ctx.globalCompositeOperation = 'source-over';

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
  }, [shapes, colors, currentPositions, particleOffsets, particleSizes, project, variant]);

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

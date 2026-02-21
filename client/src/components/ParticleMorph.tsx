import { useEffect, useRef, useCallback, useMemo } from 'react';

// ─── HERO Shape Generators ──────────────────────────────────────────

// 1. ORB (start/end) — evenly distributed sphere shell
function orbPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    // Fibonacci sphere for even distribution
    const phi = Math.acos(-1 + (2 * i) / n);
    const theta = Math.sqrt(n * Math.PI) * phi;
    const r = 1.4;
    p[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
    p[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
    p[i * 3 + 2] = Math.cos(phi) * r;
  }
  return p;
}

// 2. WRENCH — unmistakable wrench silhouette, edge-heavy
function wrenchPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const z = 0.25; // z-spread for 3D feel

  for (let i = 0; i < n; i++) {
    const section = Math.random();

    if (section < 0.40) {
      // Open-end jaw (top) — U shape opening to the right
      const jawW = 0.55, jawH = 0.5, jawY = 1.1;
      const part = Math.random();
      if (part < 0.35) {
        // Top arm of jaw
        const t = Math.random();
        p[i * 3] = -0.15 + t * jawW;
        p[i * 3 + 1] = jawY + jawH / 2 + (Math.random() - 0.5) * 0.05;
      } else if (part < 0.7) {
        // Bottom arm of jaw
        const t = Math.random();
        p[i * 3] = -0.15 + t * jawW;
        p[i * 3 + 1] = jawY - jawH / 2 + (Math.random() - 0.5) * 0.05;
      } else {
        // Back curve connecting the two arms
        const angle = -Math.PI / 2 + Math.random() * Math.PI;
        const r = jawH / 2 + (Math.random() - 0.5) * 0.05;
        p[i * 3] = -0.15 + Math.cos(angle) * 0.05;
        p[i * 3 + 1] = jawY + Math.sin(angle) * r;
      }
    } else if (section < 0.70) {
      // Handle (shaft) — long straight section
      const handleLen = 2.4;
      const handleW = 0.14;
      const part = Math.random();
      if (part < 0.4) {
        // Left edge
        p[i * 3] = -handleW / 2 + (Math.random() - 0.5) * 0.03;
        p[i * 3 + 1] = 0.85 - Math.random() * handleLen;
      } else if (part < 0.8) {
        // Right edge
        p[i * 3] = handleW / 2 + (Math.random() - 0.5) * 0.03;
        p[i * 3 + 1] = 0.85 - Math.random() * handleLen;
      } else {
        // Fill
        p[i * 3] = (Math.random() - 0.5) * handleW;
        p[i * 3 + 1] = 0.85 - Math.random() * handleLen;
      }
    } else {
      // Box-end (bottom) — closed ring/hexagon
      const ringR = 0.35;
      const ringY = -1.6;
      const part = Math.random();
      if (part < 0.6) {
        // Outer ring
        const angle = Math.random() * Math.PI * 2;
        const r = ringR + (Math.random() - 0.5) * 0.05;
        p[i * 3] = Math.cos(angle) * r;
        p[i * 3 + 1] = ringY + Math.sin(angle) * r;
      } else if (part < 0.85) {
        // Inner hole
        const angle = Math.random() * Math.PI * 2;
        const r = ringR * 0.5 + (Math.random() - 0.5) * 0.04;
        p[i * 3] = Math.cos(angle) * r;
        p[i * 3 + 1] = ringY + Math.sin(angle) * r;
      } else {
        // Hex edges inside ring
        const side = Math.floor(Math.random() * 6);
        const a1 = (side / 6) * Math.PI * 2;
        const a2 = ((side + 1) / 6) * Math.PI * 2;
        const t = Math.random();
        const hr = ringR * 0.5;
        p[i * 3] = (Math.cos(a1) * hr * (1 - t) + Math.cos(a2) * hr * t);
        p[i * 3 + 1] = ringY + (Math.sin(a1) * hr * (1 - t) + Math.sin(a2) * hr * t);
      }
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * z;
  }
  return p;
}

// 3. HAMMER — classic claw hammer, very defined
function hammerPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const z = 0.25;

  for (let i = 0; i < n; i++) {
    const section = Math.random();

    if (section < 0.45) {
      // Hammer head — wide rectangle at top
      const headW = 1.1, headH = 0.4, headY = 1.0;
      const part = Math.random();
      if (part < 0.2) {
        // Top edge
        p[i * 3] = (Math.random() - 0.5) * headW * 2;
        p[i * 3 + 1] = headY + headH + (Math.random() - 0.5) * 0.04;
      } else if (part < 0.4) {
        // Bottom edge
        p[i * 3] = (Math.random() - 0.5) * headW * 2;
        p[i * 3 + 1] = headY - headH + (Math.random() - 0.5) * 0.04;
      } else if (part < 0.55) {
        // Left edge
        p[i * 3] = -headW + (Math.random() - 0.5) * 0.04;
        p[i * 3 + 1] = headY + (Math.random() - 0.5) * headH * 2;
      } else if (part < 0.7) {
        // Right edge
        p[i * 3] = headW + (Math.random() - 0.5) * 0.04;
        p[i * 3 + 1] = headY + (Math.random() - 0.5) * headH * 2;
      } else {
        // Head fill (lighter)
        p[i * 3] = (Math.random() - 0.5) * headW * 1.8;
        p[i * 3 + 1] = headY + (Math.random() - 0.5) * headH * 1.6;
      }
    } else if (section < 0.55) {
      // Claw (left side of head) — V-shape fork
      const t = Math.random();
      const fork = Math.random() > 0.5 ? 1 : -1;
      p[i * 3] = -1.0 - t * 0.4;
      p[i * 3 + 1] = 1.0 + fork * t * 0.35 + (Math.random() - 0.5) * 0.04;
    } else if (section < 0.85) {
      // Handle — long vertical shaft
      const handleW = 0.12;
      const part = Math.random();
      if (part < 0.35) {
        // Left edge
        p[i * 3] = -handleW + (Math.random() - 0.5) * 0.03;
        p[i * 3 + 1] = 0.55 - Math.random() * 2.8;
      } else if (part < 0.7) {
        // Right edge
        p[i * 3] = handleW + (Math.random() - 0.5) * 0.03;
        p[i * 3 + 1] = 0.55 - Math.random() * 2.8;
      } else {
        // Fill
        p[i * 3] = (Math.random() - 0.5) * handleW * 2;
        p[i * 3 + 1] = 0.55 - Math.random() * 2.8;
      }
    } else {
      // Handle grip (bottom) — slightly wider
      const gripW = 0.18;
      p[i * 3] = (Math.random() - 0.5) * gripW * 2;
      p[i * 3 + 1] = -2.1 - Math.random() * 0.3 + (Math.random() - 0.5) * 0.04;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * z;
  }
  return p;
}

// 4. NEURAL NETWORK — nodes in layers with dense connection lines
function neuralNetPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const z = 0.3;

  // Define layers: [x, [y positions]]
  const layers: [number, number[]][] = [
    [-1.4, [-0.9, -0.3, 0.3, 0.9]],
    [-0.5, [-1.2, -0.6, 0.0, 0.6, 1.2]],
    [0.5, [-1.2, -0.6, 0.0, 0.6, 1.2]],
    [1.4, [-0.9, -0.3, 0.3, 0.9]],
  ];

  const allNodes: [number, number][] = [];
  for (const [x, ys] of layers) {
    for (const y of ys) {
      allNodes.push([x, y]);
    }
  }

  for (let i = 0; i < n; i++) {
    const section = Math.random();

    if (section < 0.35) {
      // Dense node clusters (big bright dots)
      const node = allNodes[Math.floor(Math.random() * allNodes.length)];
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.18;
      p[i * 3] = node[0] + Math.cos(angle) * r;
      p[i * 3 + 1] = node[1] + Math.sin(angle) * r;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    } else if (section < 0.55) {
      // Node outlines (rings around each node)
      const node = allNodes[Math.floor(Math.random() * allNodes.length)];
      const angle = Math.random() * Math.PI * 2;
      const r = 0.18 + (Math.random() - 0.5) * 0.04;
      p[i * 3] = node[0] + Math.cos(angle) * r;
      p[i * 3 + 1] = node[1] + Math.sin(angle) * r;
      p[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    } else {
      // Connection lines between adjacent layers
      const layerIdx = Math.floor(Math.random() * (layers.length - 1));
      const [x1, ys1] = layers[layerIdx];
      const [x2, ys2] = layers[layerIdx + 1];
      const y1 = ys1[Math.floor(Math.random() * ys1.length)];
      const y2 = ys2[Math.floor(Math.random() * ys2.length)];
      const t = Math.random();
      p[i * 3] = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 0.03;
      p[i * 3 + 1] = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 0.03;
      p[i * 3 + 2] = (Math.random() - 0.5) * z;
    }
  }
  return p;
}

// 5. VOICE AI — microphone with soundwaves
function voiceAIPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const z = 0.25;

  for (let i = 0; i < n; i++) {
    const section = Math.random();

    if (section < 0.25) {
      // Microphone head — rounded capsule top
      const angle = Math.random() * Math.PI; // top half circle
      const r = 0.35 + (Math.random() - 0.5) * 0.05;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = 0.5 + Math.sin(angle) * r;
      p[i * 3 + 2] = (Math.random() - 0.5) * z;
    } else if (section < 0.38) {
      // Microphone body — straight sides below the dome
      const side = Math.random() > 0.5 ? 0.35 : -0.35;
      p[i * 3] = side + (Math.random() - 0.5) * 0.05;
      p[i * 3 + 1] = -0.2 + Math.random() * 0.7;
      p[i * 3 + 2] = (Math.random() - 0.5) * z;
    } else if (section < 0.45) {
      // Mic body fill
      p[i * 3] = (Math.random() - 0.5) * 0.6;
      p[i * 3 + 1] = -0.2 + Math.random() * 0.7;
      p[i * 3 + 2] = (Math.random() - 0.5) * z * 0.5;
    } else if (section < 0.50) {
      // Grill lines on mic head
      const line = Math.floor(Math.random() * 5);
      const lineY = 0.35 + line * 0.12;
      p[i * 3] = (Math.random() - 0.5) * 0.5;
      p[i * 3 + 1] = lineY + (Math.random() - 0.5) * 0.02;
      p[i * 3 + 2] = (Math.random() - 0.5) * z * 0.3;
    } else if (section < 0.55) {
      // Bottom of mic body (curved)
      const angle = Math.PI + Math.random() * Math.PI; // bottom half
      const r = 0.35 + (Math.random() - 0.5) * 0.05;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = -0.2 + Math.sin(angle) * 0.1;
      p[i * 3 + 2] = (Math.random() - 0.5) * z;
    } else if (section < 0.60) {
      // Stand/stem
      p[i * 3] = (Math.random() - 0.5) * 0.06;
      p[i * 3 + 1] = -0.35 - Math.random() * 0.6;
      p[i * 3 + 2] = (Math.random() - 0.5) * z * 0.3;
    } else if (section < 0.67) {
      // Base (flat bottom)
      p[i * 3] = (Math.random() - 0.5) * 0.7;
      p[i * 3 + 1] = -0.95 + (Math.random() - 0.5) * 0.06;
      p[i * 3 + 2] = (Math.random() - 0.5) * z;
    } else {
      // Sound waves radiating from mic (3 arcs on each side)
      const side = Math.random() > 0.5 ? 1 : -1;
      const waveIdx = Math.floor(Math.random() * 3);
      const waveR = 0.6 + waveIdx * 0.35;
      const angle = (Math.random() - 0.5) * Math.PI * 0.6; // arc spread
      p[i * 3] = side * (0.45 + Math.cos(angle) * waveR) + (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = 0.3 + Math.sin(angle) * waveR * 0.5 + (Math.random() - 0.5) * 0.04;
      p[i * 3 + 2] = (Math.random() - 0.5) * z;
    }
  }
  return p;
}


// ─── PAIN POINT Shape Generators ────────────────────────────────────

// 1. Job Management Chaos — broken clock with scattered pieces
function chaosClockPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const z = 0.3;

  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.35) {
      // Clock circle outline (with cracks/gaps)
      const angle = Math.random() * Math.PI * 2;
      const skip = Math.sin(angle * 3) > 0.7; // create gaps
      if (!skip) {
        const r = 1.2 + (Math.random() - 0.5) * 0.06;
        p[i * 3] = Math.cos(angle) * r;
        p[i * 3 + 1] = Math.sin(angle) * r;
      }
    } else if (section < 0.50) {
      // Clock hands (at awkward angles)
      const hand = Math.random() > 0.5;
      const len = hand ? 0.9 : 0.6;
      const angle = hand ? 1.8 : 4.2;
      const t = Math.random() * len;
      p[i * 3] = Math.cos(angle) * t + (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = Math.sin(angle) * t + (Math.random() - 0.5) * 0.04;
    } else if (section < 0.62) {
      // Hour markers (12 dots around the rim)
      const hour = Math.floor(Math.random() * 12);
      const angle = (hour / 12) * Math.PI * 2 - Math.PI / 2;
      const r = 1.0;
      p[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * 0.08;
      p[i * 3 + 1] = Math.sin(angle) * r + (Math.random() - 0.5) * 0.08;
    } else if (section < 0.70) {
      // Center dot
      p[i * 3] = (Math.random() - 0.5) * 0.12;
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.12;
    } else {
      // Scattered debris flying outward
      const angle = Math.random() * Math.PI * 2;
      const dist = 1.5 + Math.random() * 1.2;
      p[i * 3] = Math.cos(angle) * dist + (Math.random() - 0.5) * 0.2;
      p[i * 3 + 1] = Math.sin(angle) * dist + (Math.random() - 0.5) * 0.2;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * z;
  }
  return p;
}

// 2. System Overload — tangled chains/wires
function tangledSystemPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const z = 0.4;
  const numChains = 6;

  for (let i = 0; i < n; i++) {
    const chain = Math.floor(Math.random() * numChains);
    const t = Math.random();
    const baseAngle = (chain / numChains) * Math.PI * 2;
    const wobble = Math.sin(t * 8 + chain * 2) * 0.5;
    const r = 0.3 + t * 1.2;

    p[i * 3] = Math.cos(baseAngle + t * 3 + wobble) * r + (Math.random() - 0.5) * 0.06;
    p[i * 3 + 1] = Math.sin(baseAngle + t * 3 + wobble) * r + (Math.random() - 0.5) * 0.06;
    p[i * 3 + 2] = Math.sin(t * 5 + chain) * 0.5 + (Math.random() - 0.5) * 0.1;
  }
  return p;
}

// 3. Cash Flow Crunch — dollar sign breaking apart
function dollarSignPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const z = 0.25;

  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.30) {
      // Top S-curve
      const t = Math.random() * Math.PI;
      const r = 0.7;
      p[i * 3] = Math.cos(t + Math.PI) * r + (Math.random() - 0.5) * 0.05;
      p[i * 3 + 1] = Math.sin(t) * 0.4 + 0.5 + (Math.random() - 0.5) * 0.05;
    } else if (section < 0.60) {
      // Bottom S-curve (reversed)
      const t = Math.random() * Math.PI;
      const r = 0.7;
      p[i * 3] = Math.cos(t) * r + (Math.random() - 0.5) * 0.05;
      p[i * 3 + 1] = Math.sin(t + Math.PI) * 0.4 - 0.5 + (Math.random() - 0.5) * 0.05;
    } else if (section < 0.75) {
      // Vertical line through center
      p[i * 3] = (Math.random() - 0.5) * 0.05;
      p[i * 3 + 1] = (Math.random() - 0.5) * 2.4;
    } else {
      // Crumbling pieces falling
      const angle = Math.random() * Math.PI * 2;
      const dist = 1.0 + Math.random() * 1.0;
      p[i * 3] = Math.cos(angle) * dist * 0.5 + (Math.random() - 0.5) * 0.15;
      p[i * 3 + 1] = -Math.random() * 1.5 + (Math.random() - 0.5) * 0.3;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * z;
  }
  return p;
}

// 4. Contract Hunting — target/bullseye with crosshairs
function targetPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const z = 0.2;

  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.15) {
      // Center bullseye dot
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 0.18;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
    } else if (section < 0.35) {
      // Inner ring
      const angle = Math.random() * Math.PI * 2;
      const r = 0.5 + (Math.random() - 0.5) * 0.06;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
    } else if (section < 0.55) {
      // Middle ring
      const angle = Math.random() * Math.PI * 2;
      const r = 0.9 + (Math.random() - 0.5) * 0.06;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
    } else if (section < 0.72) {
      // Outer ring
      const angle = Math.random() * Math.PI * 2;
      const r = 1.3 + (Math.random() - 0.5) * 0.06;
      p[i * 3] = Math.cos(angle) * r;
      p[i * 3 + 1] = Math.sin(angle) * r;
    } else {
      // Crosshair lines (full length)
      const axis = Math.random() > 0.5;
      const t = (Math.random() - 0.5) * 3.0;
      p[i * 3] = axis ? t : (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = axis ? (Math.random() - 0.5) * 0.04 : t;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * z;
  }
  return p;
}

// 5. Admin Time Sink — hourglass
function hourglassPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const z = 0.25;

  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.22) {
      // Top triangle outline (inverted V)
      const t = Math.random();
      const width = t * 1.0;
      const edge = Math.random();
      if (edge < 0.5) {
        // Left edge
        p[i * 3] = -width + (Math.random() - 0.5) * 0.04;
        p[i * 3 + 1] = 0.1 + t * 1.3;
      } else {
        // Right edge
        p[i * 3] = width + (Math.random() - 0.5) * 0.04;
        p[i * 3 + 1] = 0.1 + t * 1.3;
      }
    } else if (section < 0.44) {
      // Bottom triangle outline (V)
      const t = Math.random();
      const width = (1 - t) * 1.0;
      const edge = Math.random();
      if (edge < 0.5) {
        p[i * 3] = -width + (Math.random() - 0.5) * 0.04;
        p[i * 3 + 1] = -0.1 - t * 1.3;
      } else {
        p[i * 3] = width + (Math.random() - 0.5) * 0.04;
        p[i * 3 + 1] = -0.1 - t * 1.3;
      }
    } else if (section < 0.52) {
      // Neck (narrow middle)
      p[i * 3] = (Math.random() - 0.5) * 0.06;
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
    } else if (section < 0.60) {
      // Sand stream
      p[i * 3] = (Math.random() - 0.5) * 0.04;
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.7;
    } else if (section < 0.72) {
      // Sand in top (filling)
      const t = Math.random();
      const w = t * 0.8;
      p[i * 3] = (Math.random() - 0.5) * w * 2;
      p[i * 3 + 1] = 0.15 + t * 0.8;
    } else if (section < 0.84) {
      // Sand in bottom (accumulated)
      const t = Math.random();
      const w = (1 - t) * 0.8;
      p[i * 3] = (Math.random() - 0.5) * w * 2;
      p[i * 3 + 1] = -0.15 - t * 0.6;
    } else {
      // Top and bottom frame bars
      const isTop = Math.random() > 0.5;
      const y = isTop ? 1.45 : -1.45;
      p[i * 3] = (Math.random() - 0.5) * 2.2;
      p[i * 3 + 1] = y + (Math.random() - 0.5) * 0.08;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * z;
  }
  return p;
}

// 6. Scaling Wall — brick wall
function brickWallPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const z = 0.2;
  const rows = 7, cols = 5;
  const brickW = 0.55, brickH = 0.32, gap = 0.04;

  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.85) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      const offset = (row % 2) * brickW * 0.5;
      const bx = (col - cols / 2) * (brickW + gap) + offset;
      const by = (row - rows / 2) * (brickH + gap);
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
      // Cracks
      const crackY = (Math.random() - 0.5) * 2.5;
      p[i * 3] = Math.sin(crackY * 2) * 0.3 + (Math.random() - 0.5) * 0.08;
      p[i * 3 + 1] = crackY;
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * z;
  }
  return p;
}

// 7. Customer Service Gaps — phone with broken signal
function phoneGapsPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const z = 0.2;

  for (let i = 0; i < n; i++) {
    const section = Math.random();
    if (section < 0.30) {
      // Phone body outline
      const edge = Math.random();
      if (edge < 0.25) {
        p[i * 3] = (Math.random() > 0.5 ? 0.4 : -0.4) + (Math.random() - 0.5) * 0.04;
        p[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      } else if (edge < 0.5) {
        p[i * 3] = (Math.random() - 0.5) * 0.8;
        p[i * 3 + 1] = (Math.random() > 0.5 ? 0.8 : -0.8) + (Math.random() - 0.5) * 0.04;
      } else {
        // Screen area fill
        p[i * 3] = (Math.random() - 0.5) * 0.6;
        p[i * 3 + 1] = (Math.random() - 0.5) * 1.0 + 0.1;
      }
    } else if (section < 0.42) {
      // X mark on screen (missed call)
      const arm = Math.random() > 0.5 ? 1 : -1;
      const t = (Math.random() - 0.5) * 0.4;
      p[i * 3] = t * arm + (Math.random() - 0.5) * 0.03;
      p[i * 3 + 1] = t + 0.1 + (Math.random() - 0.5) * 0.03;
    } else {
      // Signal waves (3 arcs, upper right, with breaks)
      const side = Math.random() > 0.5 ? 1 : -1;
      const waveIdx = Math.floor(Math.random() * 3);
      const waveR = 0.6 + waveIdx * 0.4;
      const angle = (Math.random() - 0.5) * Math.PI * 0.7;
      const broken = Math.sin(angle * 4 + waveIdx) > 0.6;
      if (!broken) {
        p[i * 3] = side * (0.5 + Math.cos(angle) * waveR) + (Math.random() - 0.5) * 0.04;
        p[i * 3 + 1] = 0.3 + Math.sin(angle) * waveR * 0.5 + (Math.random() - 0.5) * 0.04;
      } else {
        // Scattered fragments
        p[i * 3] = side * (0.5 + Math.cos(angle) * (waveR + 0.2)) + (Math.random() - 0.5) * 0.2;
        p[i * 3 + 1] = 0.3 + Math.sin(angle) * waveR * 0.5 + (Math.random() - 0.5) * 0.2;
      }
    }
    p[i * 3 + 2] = (Math.random() - 0.5) * z;
  }
  return p;
}

// 8. Tech Resistance — paper stack
function paperStackPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const numSheets = 5;

  for (let i = 0; i < n; i++) {
    const sheet = Math.floor(Math.random() * numSheets);
    const zOff = (sheet - numSheets / 2) * 0.2;
    const xOff = sheet * 0.08;
    const yOff = sheet * 0.05;
    const section = Math.random();

    if (section < 0.55) {
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
    } else if (section < 0.8) {
      // Text lines
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
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const dprRef = useRef(1);
  const logicalWidthRef = useRef(0);
  const logicalHeightRef = useRef(0);

  // Pre-compute shapes once
  const shapes = useMemo(() => {
    if (variant === 'hero') {
      return [
        orbPositions(NUM_PARTICLES),          // Start as orb
        wrenchPositions(NUM_PARTICLES),       // Trade tool
        hammerPositions(NUM_PARTICLES),       // Trade tool
        neuralNetPositions(NUM_PARTICLES),    // AI
        voiceAIPositions(NUM_PARTICLES),      // AI Voice
        orbPositions(NUM_PARTICLES),          // End as orb
      ];
    } else {
      return [
        chaosClockPositions(NUM_PARTICLES),
        tangledSystemPositions(NUM_PARTICLES),
        dollarSignPositions(NUM_PARTICLES),
        targetPositions(NUM_PARTICLES),
        hourglassPositions(NUM_PARTICLES),
        brickWallPositions(NUM_PARTICLES),
        phoneGapsPositions(NUM_PARTICLES),
        paperStackPositions(NUM_PARTICLES),
        orbPositions(NUM_PARTICLES),          // Resolved
      ];
    }
  }, [variant]);

  const colors = useMemo(() => {
    if (variant === 'hero') {
      return [
        [204, 102, 255],  // Purple - orb
        [255, 165, 50],   // Orange - wrench
        [255, 200, 60],   // Gold - hammer
        [77, 204, 255],   // Cyan - neural net
        [128, 255, 128],  // Green - voice AI
        [204, 102, 255],  // Purple - orb
      ];
    } else {
      return [
        [255, 60, 60],    // Red - chaos
        [255, 100, 30],   // Orange - tangled
        [255, 200, 50],   // Gold - dollar
        [255, 80, 80],    // Red - target
        [200, 100, 255],  // Purple - hourglass
        [255, 120, 50],   // Orange - wall
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
      offsets[i] = (Math.random() - 0.5) * 0.06;
    }
    return offsets;
  }, []);

  // Per-particle size variation
  const particleSizes = useMemo(() => {
    const sizes = new Float32Array(NUM_PARTICLES);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      sizes[i] = 1.2 + Math.random() * 1.5;
    }
    return sizes;
  }, []);

  const project = useCallback((x: number, y: number, z: number, w: number, h: number) => {
    const scale = PERSPECTIVE / (PERSPECTIVE + z);
    return {
      x: x * scale * (w * 0.22) + w / 2,
      y: -y * scale * (h * 0.22) + h / 2, // Flip Y so positive Y is up
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
      const c1 = colors[segIdx];
      const c2 = colors[segIdx + 1];

      const cr = Math.round(c1[0] + (c2[0] - c1[0]) * eased);
      const cg = Math.round(c1[1] + (c2[1] - c1[1]) * eased);
      const cb = Math.round(c1[2] + (c2[2] - c1[2]) * eased);

      // SCROLL-DRIVEN rotation: rotation angle is directly tied to scroll progress
      // This means the shape holds perfectly still when you stop scrolling
      const scrollRot = progress * Math.PI * 0.4; // Total ~72 degrees over full scroll
      const cosR = Math.cos(scrollRot);
      const sinR = Math.sin(scrollRot);

      // Very subtle tilt that also follows scroll (not time)
      const tiltAngle = Math.sin(progress * Math.PI * 2) * 0.08;
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

      for (let i = 0; i < NUM_PARTICLES; i++) {
        const i3 = i * 3;
        let x = currentPositions[i3];
        let y = currentPositions[i3 + 1];
        let zVal = currentPositions[i3 + 2];

        // Y-axis rotation (scroll-driven)
        const rx = x * cosR - zVal * sinR;
        const rz = x * sinR + zVal * cosR;
        x = rx;
        zVal = rz;

        // Subtle X-axis tilt (scroll-driven)
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

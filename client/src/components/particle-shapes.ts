/**
 * 3D particle shape generators for WebGL morph animation.
 * Each returns Float32Array of interleaved x,y,z positions.
 */

// ─── ORB (Sphere) ──────────────────────────────────────────────────
// Fibonacci distribution with multiple radius layers for volumetric depth
export function orbPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);
  const layers = [0.7, 0.85, 1.0]; // inner core, mid, surface
  const layerWeights = [0.2, 0.3, 0.5];

  for (let i = 0; i < n; i++) {
    // Pick a radius layer
    const rand = Math.random();
    let radius: number;
    if (rand < layerWeights[0]) {
      radius = layers[0] + (Math.random() - 0.5) * 0.15;
    } else if (rand < layerWeights[0] + layerWeights[1]) {
      radius = layers[1] + (Math.random() - 0.5) * 0.1;
    } else {
      radius = layers[2] + (Math.random() - 0.5) * 0.05;
    }

    // Fibonacci sphere distribution
    const phi = Math.acos(-1 + (2 * (i + Math.random() * 0.5)) / n);
    const theta = Math.sqrt(n * Math.PI) * phi + Math.random() * 0.1;

    p[i * 3] = Math.sin(phi) * Math.cos(theta) * radius * 1.4;
    p[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius * 1.4;
    p[i * 3 + 2] = Math.cos(phi) * radius * 1.4;
  }
  return p;
}

// ─── HARD HAT ──────────────────────────────────────────────────────
// 3D half-ellipsoid dome + torus brim with interior fill
export function hardHatPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    const section = Math.random();

    if (section < 0.45) {
      // Dome — parametric half-ellipsoid surface
      const u = Math.random() * Math.PI;       // polar (0 to PI = top hemisphere)
      const v = Math.random() * Math.PI * 2;   // azimuthal
      const rx = 1.0 + (Math.random() - 0.5) * 0.04;
      const ry = 0.75 + (Math.random() - 0.5) * 0.04;
      const rz = 0.9 + (Math.random() - 0.5) * 0.04;
      p[i * 3]     = Math.sin(u) * Math.cos(v) * rx;
      p[i * 3 + 1] = Math.cos(u) * ry * 0.5 + 0.4; // raise dome up
      p[i * 3 + 2] = Math.sin(u) * Math.sin(v) * rz;
    } else if (section < 0.60) {
      // Dome interior fill for density
      const u = Math.random() * Math.PI;
      const v = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.5) * 0.8;
      p[i * 3]     = Math.sin(u) * Math.cos(v) * r * 0.85;
      p[i * 3 + 1] = Math.cos(u) * r * 0.5 + 0.35;
      p[i * 3 + 2] = Math.sin(u) * Math.sin(v) * r * 0.75;
    } else if (section < 0.80) {
      // Brim — torus ring around the base
      const angle = Math.random() * Math.PI * 2;
      const brimR = 1.15 + (Math.random() - 0.5) * 0.2;
      const tubeR = 0.06 + Math.random() * 0.04;
      const tubeAngle = Math.random() * Math.PI * 2;
      p[i * 3]     = Math.cos(angle) * brimR + Math.cos(angle) * Math.cos(tubeAngle) * tubeR;
      p[i * 3 + 1] = 0.0 + Math.sin(tubeAngle) * tubeR;
      p[i * 3 + 2] = Math.sin(angle) * brimR + Math.sin(angle) * Math.cos(tubeAngle) * tubeR;
    } else if (section < 0.92) {
      // Center ridge line on top
      const t = Math.random();
      const ridgeAngle = Math.random() * Math.PI * 2;
      const ridgeR = 0.02 + Math.random() * 0.02;
      p[i * 3]     = Math.cos(ridgeAngle) * ridgeR;
      p[i * 3 + 1] = 0.4 + t * 0.45;
      p[i * 3 + 2] = Math.sin(ridgeAngle) * ridgeR;
    } else {
      // Inner headband ring
      const angle = Math.random() * Math.PI * 2;
      const r = 0.75 + (Math.random() - 0.5) * 0.05;
      p[i * 3]     = Math.cos(angle) * r;
      p[i * 3 + 1] = 0.05 + (Math.random() - 0.5) * 0.04;
      p[i * 3 + 2] = Math.sin(angle) * r;
    }
  }
  return p;
}

// ─── HAMMER ────────────────────────────────────────────────────────
// 3D rectangular prism head + cylinder handle
export function hammerPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    const section = Math.random();

    if (section < 0.45) {
      // Hammer head — 3D box: sample on faces and fill
      const headW = 0.9, headH = 0.3, headD = 0.35;
      const headY = 0.85;

      const face = Math.random();
      if (face < 0.15) {
        // Top face
        p[i * 3]     = (Math.random() - 0.5) * headW * 2;
        p[i * 3 + 1] = headY + headH;
        p[i * 3 + 2] = (Math.random() - 0.5) * headD * 2;
      } else if (face < 0.30) {
        // Bottom face
        p[i * 3]     = (Math.random() - 0.5) * headW * 2;
        p[i * 3 + 1] = headY - headH;
        p[i * 3 + 2] = (Math.random() - 0.5) * headD * 2;
      } else if (face < 0.40) {
        // Left face
        p[i * 3]     = -headW;
        p[i * 3 + 1] = headY + (Math.random() - 0.5) * headH * 2;
        p[i * 3 + 2] = (Math.random() - 0.5) * headD * 2;
      } else if (face < 0.50) {
        // Right face
        p[i * 3]     = headW;
        p[i * 3 + 1] = headY + (Math.random() - 0.5) * headH * 2;
        p[i * 3 + 2] = (Math.random() - 0.5) * headD * 2;
      } else if (face < 0.60) {
        // Front face
        p[i * 3]     = (Math.random() - 0.5) * headW * 2;
        p[i * 3 + 1] = headY + (Math.random() - 0.5) * headH * 2;
        p[i * 3 + 2] = headD;
      } else if (face < 0.70) {
        // Back face
        p[i * 3]     = (Math.random() - 0.5) * headW * 2;
        p[i * 3 + 1] = headY + (Math.random() - 0.5) * headH * 2;
        p[i * 3 + 2] = -headD;
      } else {
        // Interior fill
        p[i * 3]     = (Math.random() - 0.5) * headW * 1.8;
        p[i * 3 + 1] = headY + (Math.random() - 0.5) * headH * 1.6;
        p[i * 3 + 2] = (Math.random() - 0.5) * headD * 1.6;
      }
    } else if (section < 0.88) {
      // Handle — cylinder shaft
      const handleR = 0.09;
      const angle = Math.random() * Math.PI * 2;
      const r = handleR + (Math.random() - 0.5) * 0.02;
      const y = 0.5 - Math.random() * 2.4;
      p[i * 3]     = Math.cos(angle) * r;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = Math.sin(angle) * r;
    } else {
      // Grip at bottom — slightly wider cylinder
      const gripR = 0.13;
      const angle = Math.random() * Math.PI * 2;
      const r = gripR + (Math.random() - 0.5) * 0.04;
      p[i * 3]     = Math.cos(angle) * r;
      p[i * 3 + 1] = -1.9 - Math.random() * 0.25;
      p[i * 3 + 2] = Math.sin(angle) * r;
    }
  }
  return p;
}

// ─── NEURAL NETWORK ────────────────────────────────────────────────
// 3D node spheres at layer positions + connection tubes with z-depth
export function neuralNetPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);

  // Layers with z-depth spread
  const layers: { x: number; nodes: number[]; z: number }[] = [
    { x: -1.3, nodes: [-0.8, -0.25, 0.25, 0.8], z: -0.3 },
    { x: -0.45, nodes: [-1.0, -0.5, 0.0, 0.5, 1.0], z: -0.1 },
    { x: 0.45, nodes: [-1.0, -0.5, 0.0, 0.5, 1.0], z: 0.1 },
    { x: 1.3, nodes: [-0.8, -0.25, 0.25, 0.8], z: 0.3 },
  ];

  type Node3D = { x: number; y: number; z: number };
  const allNodes: Node3D[] = [];
  for (const layer of layers) {
    for (const y of layer.nodes) {
      allNodes.push({ x: layer.x, y, z: layer.z });
    }
  }

  for (let i = 0; i < n; i++) {
    const section = Math.random();

    if (section < 0.35) {
      // Node spheres — small 3D spheres at each node position
      const node = allNodes[Math.floor(Math.random() * allNodes.length)];
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * 0.15;
      p[i * 3]     = node.x + Math.sin(phi) * Math.cos(theta) * r;
      p[i * 3 + 1] = node.y + Math.sin(phi) * Math.sin(theta) * r;
      p[i * 3 + 2] = node.z + Math.cos(phi) * r;
    } else {
      // Connection tubes between adjacent layers
      const layerIdx = Math.floor(Math.random() * (layers.length - 1));
      const l1 = layers[layerIdx];
      const l2 = layers[layerIdx + 1];
      const y1 = l1.nodes[Math.floor(Math.random() * l1.nodes.length)];
      const y2 = l2.nodes[Math.floor(Math.random() * l2.nodes.length)];
      const t = Math.random();
      // Tube radius for 3D feel
      const tubeR = 0.02;
      const tubeAngle = Math.random() * Math.PI * 2;
      p[i * 3]     = l1.x + (l2.x - l1.x) * t + Math.cos(tubeAngle) * tubeR;
      p[i * 3 + 1] = y1 + (y2 - y1) * t + Math.sin(tubeAngle) * tubeR;
      p[i * 3 + 2] = l1.z + (l2.z - l1.z) * t;
    }
  }
  return p;
}

// ─── VOICE AI (Microphone) ─────────────────────────────────────────
// 3D mic head (sphere with grill) + cylinder body + stand + sound wave shells
export function voiceAIPositions(n: number): Float32Array {
  const p = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    const section = Math.random();

    if (section < 0.25) {
      // Mic head — 3D sphere (top half more dense for grill effect)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.30 + (Math.random() - 0.5) * 0.04;
      p[i * 3]     = Math.sin(phi) * Math.cos(theta) * r;
      p[i * 3 + 1] = 0.5 + Math.cos(phi) * r * 0.5 + Math.sin(phi) * Math.sin(theta) * r * 0.3;
      p[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r * 0.8;
    } else if (section < 0.40) {
      // Mic body — cylinder
      const angle = Math.random() * Math.PI * 2;
      const bodyR = 0.25 + (Math.random() - 0.5) * 0.03;
      p[i * 3]     = Math.cos(angle) * bodyR;
      p[i * 3 + 1] = -0.1 + Math.random() * 0.6;
      p[i * 3 + 2] = Math.sin(angle) * bodyR;
    } else if (section < 0.48) {
      // Grill latitude lines on mic head
      const line = Math.floor(Math.random() * 4);
      const angle = Math.random() * Math.PI * 2;
      const lineR = 0.25 - line * 0.03;
      const lineY = 0.55 + line * 0.08;
      p[i * 3]     = Math.cos(angle) * lineR;
      p[i * 3 + 1] = lineY;
      p[i * 3 + 2] = Math.sin(angle) * lineR;
    } else if (section < 0.55) {
      // Stand/stem — thin cylinder
      const angle = Math.random() * Math.PI * 2;
      const stemR = 0.04;
      p[i * 3]     = Math.cos(angle) * stemR;
      p[i * 3 + 1] = -0.25 - Math.random() * 0.5;
      p[i * 3 + 2] = Math.sin(angle) * stemR;
    } else if (section < 0.62) {
      // Base — flat disc
      const angle = Math.random() * Math.PI * 2;
      const baseR = Math.random() * 0.3;
      p[i * 3]     = Math.cos(angle) * baseR;
      p[i * 3 + 1] = -0.78 + (Math.random() - 0.5) * 0.04;
      p[i * 3 + 2] = Math.sin(angle) * baseR;
    } else {
      // Sound wave arc shells — 3D arcs radiating outward
      const waveIdx = Math.floor(Math.random() * 3);
      const waveR = 0.55 + waveIdx * 0.30;
      const theta = (Math.random() - 0.5) * Math.PI * 0.6; // vertical arc angle
      const phi = (Math.random() - 0.5) * Math.PI * 0.6;   // horizontal spread
      const side = Math.random() > 0.5 ? 1 : -1;
      p[i * 3]     = side * (0.35 + Math.cos(theta) * Math.cos(phi) * waveR);
      p[i * 3 + 1] = 0.3 + Math.sin(theta) * waveR * 0.4;
      p[i * 3 + 2] = Math.sin(phi) * waveR * 0.3;
    }
  }
  return p;
}

// Generates public/portrait.svg — a dot-matrix halftone portrait placeholder.
// Silhouette is an analytic head/shoulders shape; dots are placed on a grid,
// dissolving near the edges. Deterministic (seeded RNG) so re-runs are stable.
import { writeFileSync } from "node:fs";

const W = 480, H = 600;
const BG = "#080808";
const SILVER = "#CDCBCA";
const RED = "#C8102E";
const BLUE = "#002F6C";
const YELLOW = "#FFC700";
const GREY = "#B1B3B3";

// mulberry32 seeded RNG
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261115);

// Signed-distance-ish inside tests.
// Head: ellipse at (240, 228) rx 88 ry 116. Neck: rect. Shoulders: ellipse at (240, 665) rx 225 ry 165.
function headSdf(x, y) {
  const dx = (x - 240) / 88, dy = (y - 228) / 116;
  return (dx * dx + dy * dy - 1) * 88; // ~pixels inside when < 0
}
function shoulderSdf(x, y) {
  const dx = (x - 240) / 225, dy = (y - 665) / 165;
  return (dx * dx + dy * dy - 1) * 165;
}
function neckInside(x, y) {
  return x > 196 && x < 284 && y > 300 && y < 470;
}
function silhouetteDepth(x, y) {
  // positive depth = deep inside, negative = outside
  const dHead = -headSdf(x, y);
  const dShoulder = -shoulderSdf(x, y);
  let d = Math.max(dHead, dShoulder);
  if (neckInside(x, y)) d = Math.max(d, 60 - Math.abs(x - 240));
  return d;
}

const dots = [];
const spacing = 11;
for (let gy = spacing / 2; gy < H; gy += spacing) {
  for (let gx = spacing / 2; gx < W; gx += spacing) {
    const jitterX = (rand() - 0.5) * 1.6;
    const jitterY = (rand() - 0.5) * 1.6;
    const x = gx + jitterX, y = gy + jitterY;
    const depth = silhouetteDepth(x, y);

    if (depth > 0) {
      // Inside silhouette — core dots bright, edge dots dissolve
      const edge = Math.min(depth / 26, 1); // 0 at edge, 1 deep
      const keep = rand() < 0.35 + edge * 0.65;
      if (!keep) continue;
      const r = 1.15 + edge * 1.75 + rand() * 0.4;
      const opacity = 0.35 + edge * 0.65;
      dots.push({ x, y, r, fill: SILVER, opacity });
    } else if (depth > -46) {
      // Dissolving halo just outside the edge
      const falloff = 1 - (-depth) / 46;
      if (rand() < falloff * 0.5) {
        const r = 0.8 + rand() * 1.3;
        dots.push({ x, y, r, fill: GREY, opacity: 0.12 + falloff * 0.38 });
      }
    }
  }
}

// Ambient faint matrix behind everything (very dim full-panel grid, sparse)
const ambient = [];
for (let gy = spacing / 2; gy < H; gy += spacing) {
  for (let gx = spacing / 2; gx < W; gx += spacing) {
    if (rand() < 0.32 && silhouetteDepth(gx, gy) <= -8) {
      ambient.push(`<circle cx="${gx.toFixed(1)}" cy="${gy.toFixed(1)}" r="0.8" fill="${SILVER}" opacity="0.07"/>`);
    }
  }
}

// Red eye cluster: two horizontal dot groups on the head
const eyeDots = [];
for (const eyeX of [207, 273]) {
  for (let i = 0; i < 5; i++) {
    const dx = (i - 2) * 5.2;
    const dy = (Math.abs(i - 2) % 2) * 2.4 - 1.2;
    const core = i === 2;
    eyeDots.push(`<circle cx="${(eyeX + dx).toFixed(1)}" cy="${(232 + dy).toFixed(1)}" r="${core ? 3.4 : 2.1}" fill="${RED}" opacity="${core ? 1 : 0.75}"/>`);
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Dot-matrix portrait placeholder for Muhammed Fahim M">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <g>${ambient.join("")}</g>
  <g>${dots.map(d => `<circle cx="${d.x.toFixed(1)}" cy="${d.y.toFixed(1)}" r="${d.r.toFixed(2)}" fill="${d.fill}" opacity="${d.opacity.toFixed(2)}"/>`).join("")}</g>
  <g>${eyeDots.join("")}</g>
  <rect x="10" y="10" width="${W - 20}" height="${H - 20}" fill="none" stroke="${BLUE}" stroke-opacity="0.55" stroke-width="1.5"/>
  <rect x="16" y="16" width="${W - 32}" height="${H - 32}" fill="none" stroke="${BLUE}" stroke-opacity="0.22" stroke-width="0.75"/>
  <path d="M10 34 V10 H34" fill="none" stroke="${YELLOW}" stroke-width="3"/>
  <path d="M${W - 34} 10 H${W - 10} V34" fill="none" stroke="${YELLOW}" stroke-width="3"/>
  <path d="M10 ${H - 34} V${H - 10} H34" fill="none" stroke="${YELLOW}" stroke-width="3"/>
  <path d="M${W - 34} ${H - 10} H${W - 10} V${H - 34}" fill="none" stroke="${YELLOW}" stroke-width="3"/>
</svg>
`;
writeFileSync(new URL("../public/portrait.svg", import.meta.url), svg);
console.log("portrait.svg written", svg.length, "bytes");

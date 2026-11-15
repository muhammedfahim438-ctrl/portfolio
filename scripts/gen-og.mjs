// Generates public/og-cover.svg — 1200x630 social banner placeholder.
import { writeFileSync } from "node:fs";

const BG = "#080808";
const SILVER = "#CDCBCA";
const GREY = "#B1B3B3";
const RED = "#C8102E";
const BLUE = "#002F6C";
const YELLOW = "#FFC700";

// Faint full-panel dot grid
const grid = [];
for (let y = 24; y < 630; y += 26) {
  for (let x = 24; x < 1200; x += 26) {
    grid.push(`<circle cx="${x}" cy="${y}" r="1.35" fill="${SILVER}" opacity="0.055"/>`);
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <defs>
    <pattern id="dots" width="15" height="15" patternUnits="userSpaceOnUse">
      <rect width="15" height="15" fill="${BLUE}"/>
      <circle cx="7.5" cy="7.5" r="4.35" fill="${SILVER}"/>
    </pattern>
    <pattern id="dotsFine" width="9" height="9" patternUnits="userSpaceOnUse">
      <circle cx="4.5" cy="4.5" r="2.1" fill="${SILVER}"/>
    </pattern>
    <linearGradient id="scan" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${YELLOW}" stop-opacity="0"/>
      <stop offset="0.14" stop-color="${YELLOW}" stop-opacity="0.95"/>
      <stop offset="0.86" stop-color="${YELLOW}" stop-opacity="0.95"/>
      <stop offset="1" stop-color="${YELLOW}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <g>${grid.join("")}</g>

  <!-- Left monogram panel: deep blue offset plate with dot-matrix MF -->
  <rect x="78" y="98" width="352" height="434" fill="none" stroke="${SILVER}" stroke-opacity="0.34" stroke-width="1.5"/>
  <rect x="62" y="82" width="352" height="434" fill="url(#dots)"/>
  <rect x="62" y="82" width="352" height="434" fill="none" stroke="${SILVER}" stroke-opacity="0.55" stroke-width="2"/>
  <text x="238" y="392" text-anchor="middle" font-family="'Lettera Mono LL', Consolas, Menlo, monospace" font-weight="700" font-size="215" fill="${SILVER}" letter-spacing="4" opacity="0.92">MF</text>
  <rect x="398" y="66" width="30" height="30" fill="${RED}"/>

  <!-- Right copy block -->
  <text x="492" y="158" font-family="'Lettera Mono LL', Consolas, Menlo, monospace" font-size="19" letter-spacing="6" fill="${YELLOW}">PORTFOLIO / 2026</text>
  <text x="488" y="272" font-family="'Lettera Mono LL', Consolas, Menlo, monospace" font-weight="700" font-size="72" fill="${SILVER}" letter-spacing="2">MUHAMMED</text>
  <text x="488" y="352" font-family="'Lettera Mono LL', Consolas, Menlo, monospace" font-weight="700" font-size="72" fill="${SILVER}" letter-spacing="2">FAHIM M</text>
  <text x="492" y="414" font-family="'Lettera Mono LL', Consolas, Menlo, monospace" font-size="21" letter-spacing="4.5" fill="${GREY}">DATA SCIENCE &amp; FULL-STACK</text>
  <text x="492" y="444" font-family="'Lettera Mono LL', Consolas, Menlo, monospace" font-size="21" letter-spacing="4.5" fill="${GREY}">DEVELOPER / KERALA, INDIA</text>
  <rect x="492" y="476" width="120" height="3" fill="${BLUE}"/>
  <circle cx="500" cy="512" r="3.4" fill="${RED}"/>
  <circle cx="518" cy="512" r="3.4" fill="${SILVER}" opacity="0.7"/>
  <circle cx="536" cy="512" r="3.4" fill="${SILVER}" opacity="0.45"/>
  <circle cx="554" cy="512" r="3.4" fill="${SILVER}" opacity="0.25"/>

  <!-- Yellow scanline -->
  <rect x="40" y="566" width="1120" height="2.5" fill="url(#scan)"/>

  <!-- Corner ticks -->
  <path d="M14 46 V14 H46" fill="none" stroke="${YELLOW}" stroke-width="4"/>
  <path d="M1154 14 H1186 V46" fill="none" stroke="${YELLOW}" stroke-width="4"/>
  <path d="M14 584 V616 H46" fill="none" stroke="${YELLOW}" stroke-width="4"/>
  <path d="M1186 584 V616 H1154" fill="none" stroke="${YELLOW}" stroke-width="4"/>
</svg>
`;
writeFileSync(new URL("../public/og-cover.svg", import.meta.url), svg);
console.log("og-cover.svg written", svg.length, "bytes");

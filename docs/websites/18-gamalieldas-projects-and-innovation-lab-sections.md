# Gamalieldas.in — Projects + Innovation Lab Sections (Deep Dive for Replication)

**Source URL:** https://www.gamalieldas.in/
**Sections covered:** `#work` (Latest projects) and `#innovation-lab` (Innovation Lab)
**Purpose of this doc:** A standalone, copy-paste-ready blueprint that Claude (or any AI) can read to help you rebuild these two sections inside your own portfolio. It isolates everything needed: structure, styles, animations, libraries, colors, type, behavior, and code patterns.

---

## 1. Section Flow & Placement

The two sections sit back-to-back in the long-scroll page:

```
Hero
 ↓
Mission / Animated Stats
 ↓
──────────────────────────
📁 PROJECTS SECTION (#work)        ← single-column stack of 5 horizontal cards
──────────────────────────
 (optional marquee divider: "Scroll for More *")
──────────────────────────
🧪 INNOVATION LAB (#innovation-lab) ← single-column stack of 3 text-dominant cards
──────────────────────────
Roles Tabs (Builder / Competitor / Mentor / Evaluator / Creator)
 ↓
Origin Story / Timeline
 ↓
Recognition / Testimonials / CTA / Footer
```

**Design move:** Projects are *media-heavy* cards. Innovation Lab is *text-heavy* cards. Same skeleton, opposite emphasis — this contrast is what makes the page feel curated, not repetitive.

---

## 2. Shared Design System (used by both sections)

### 2.1 Colors (dark editorial palette)

```css
:root {
  --bg:            #0a0a0a;   /* page background — near black */
  --bg-soft:       #111111;   /* card surface */
  --bg-elev:       #161616;   /* elevated card / hover surface */
  --border:        rgba(255, 255, 255, 0.08);
  --border-hover:  rgba(255, 255, 255, 0.18);
  --text:          #ededed;
  --text-muted:    #8a8a8a;
  --text-dim:      #6a6a6a;
  --accent:        #ff6b35;   /* warm orange — used sparingly */
  /* For Innovation Lab a slightly cooler variant is used: */
  --accent-lab:    #ffb24d;   /* warm amber */
}
```

### 2.2 Typography (two-typeface pairing)

| Role | Font (recommended free / paid alternative) | Notes |
|------|---------------------------------------------|-------|
| **Display headings** | **Instrument Serif** (free) or PP Editorial New (paid) | Italic `<em>` used to highlight one word ("projects", "Lab", "Authentication") |
| **Body / UI** | **Inter** (free) or General Sans (paid) | Clean grotesque, light/regular weights |
| **Mono / tags / counters** | **JetBrains Mono** or **IBM Plex Mono** | Uppercase, wide tracking, small size |

```css
:root {
  --font-display: 'Instrument Serif', 'PP Editorial New', Georgia, serif;
  --font-body:    'Inter', 'General Sans', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace;
}

/* Display heading with italic emphasis */
.display {
  font-family: var(--font-display);
  font-weight: 400;            /* serifs look best at 400 */
  font-size: clamp(2.5rem, 6vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.02em;
}
.display em {
  font-style: italic;
  color: var(--accent);
}
```

### 2.3 Spacing & layout primitives

```css
.section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 8rem 2.5rem;
}
.section__header {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  margin-bottom: 4rem;
}
.eyebrow {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.lede {
  font-family: var(--font-body);
  font-size: 1.125rem;
  line-height: 1.5;
  color: var(--text-muted);
  max-width: 56ch;
}
.link-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text);
  text-decoration: none;
  border-bottom: 1px solid var(--border-hover);
  padding-bottom: 2px;
  transition: gap .3s ease;
}
.link-cta:hover { gap: 0.7rem; }
```

---

## 3. PROJECTS SECTION — Full Blueprint

### 3.1 Layout pattern (NOT a grid, NOT masonry)

A **single-column vertical stack of 5 full-width horizontal cards**. Each card is one row: image on the left, content on the right, with a thin arrow CTA on the far right. On mobile it collapses to a single-column card.

```
┌────────────────────────────────────────────────────────────┐
│ [ cover image · 1.4fr ]   [ tags · title · desc · 1fr ] ↗ │
└────────────────────────────────────────────────────────────┘
```

### 3.2 HTML structure

```html
<section id="work" class="section section--projects">
  <header class="section__header">
    <p class="eyebrow">Selected Work</p>
    <h2 class="display">Latest <em>projects</em></h2>
    <p class="lede">Professional B2B &amp; B2C websites built for real outcomes.</p>
    <a href="#work-archive" class="link-cta">All Works <span class="arrow">↗</span></a>
  </header>

  <div class="projects__list">
    <a href="https://example.com" class="project-card" target="_blank" rel="noopener">
      <div class="project-card__media">
        <img src="cover.webp" alt="Spendflo" loading="lazy" />
      </div>
      <div class="project-card__body">
        <ul class="tag-row">
          <li>Webflow</li><li>Marketing Site</li><li>CMS</li><li>SEO</li>
        </ul>
        <h3 class="project-card__title">Spendflo — A B2B SAAS enterprise marketing website</h3>
        <p class="project-card__desc">Short one-liner describing the outcome / role.</p>
      </div>
      <span class="project-card__arrow">↗</span>
    </a>
    <!-- repeat for 4 more cards -->
  </div>
</section>
```

### 3.3 CSS

```css
.projects__list {
  display: grid;
  grid-template-columns: 1fr;          /* single-column stack */
  gap: 1.25rem;
}

.project-card {
  position: relative;
  display: grid;
  grid-template-columns: 1.4fr 1fr auto;
  align-items: center;
  gap: 2rem;
  padding: 1.25rem;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--bg-soft);
  text-decoration: none;
  color: var(--text);
  overflow: hidden;
  transition:
    background-color .4s ease,
    border-color    .4s ease,
    transform       .4s cubic-bezier(.2,.7,.2,1);
}
.project-card:hover {
  background: var(--bg-elev);
  border-color: var(--border-hover);
  transform: translateY(-4px);
}

/* Media */
.project-card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}
.project-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .8s cubic-bezier(.2,.7,.2,1), filter .4s ease;
  filter: saturate(0.92);
}
.project-card:hover .project-card__media img {
  transform: scale(1.05);
  filter: saturate(1);
}

/* Body */
.project-card__body { display: grid; gap: 0.75rem; padding: 0.5rem 0; }
.tag-row {
  list-style: none;
  display: flex; flex-wrap: wrap; gap: 0.4rem;
  padding: 0; margin: 0;
}
.tag-row li {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  transition: color .3s, border-color .3s;
}
.project-card:hover .tag-row li { color: var(--text); border-color: var(--border-hover); }

.project-card__title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.6vw, 2.25rem);
  line-height: 1.05;
  letter-spacing: -0.01em;
  font-weight: 400;
}
.project-card__desc {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* Arrow */
.project-card__arrow {
  font-size: 1.5rem;
  color: var(--text-muted);
  transition: transform .4s cubic-bezier(.2,.7,.2,1), color .3s;
}
.project-card:hover .project-card__arrow {
  transform: translate(4px, -4px) rotate(0deg);
  color: var(--accent);
}

/* Mobile */
@media (max-width: 768px) {
  .project-card { grid-template-columns: 1fr; }
  .project-card__arrow { position: absolute; top: 1rem; right: 1rem; }
}
```

### 3.4 Animations on Projects

| Trigger | Animation | Library |
|---------|-----------|---------|
| Section enters viewport | Header (eyebrow, title, lede, CTA) fade + rise `y: 60 → 0`, `opacity: 0 → 1` | GSAP + ScrollTrigger |
| Each card enters | Cards stagger up `y: 80 → 0`, `opacity: 0 → 1`, stagger `0.12s` | GSAP + ScrollTrigger |
| Title reveal | Optional `clip-path: inset(0 0 100% 0 → 0)` line mask (line-by-line) | GSAP / SplitText |
| Hover | Image scale `1 → 1.05` (CSS transition), arrow translate+rotate, bg lift, tag color shift | Pure CSS |
| Magnetic cursor on title | Cursor enlarges + label "View" appears over titles | Custom JS / Shery |
| Tag row | Optional stagger fade on hover-in | CSS / GSAP |

### 3.5 Reusable GSAP code

```js
gsap.registerPlugin(ScrollTrigger);

// 1) Section header reveal
gsap.from('#work .section__header > *', {
  y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1,
  scrollTrigger: { trigger: '#work', start: 'top 75%' }
});

// 2) Card stagger
gsap.from('.project-card', {
  y: 80, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.12,
  scrollTrigger: { trigger: '.projects__list', start: 'top 70%' }
});

// 3) Optional line-by-line title mask
document.querySelectorAll('.project-card__title').forEach(title => {
  gsap.from(title, {
    clipPath: 'inset(0 0 100% 0)',
    duration: 1.2, ease: 'power4.out',
    scrollTrigger: { trigger: title, start: 'top 85%' }
  });
});
```

---

## 4. INNOVATION LAB SECTION — Full Blueprint

### 4.1 What makes it different from Projects

Same skeleton, opposite emphasis:

| Projects | Innovation Lab |
|----------|----------------|
| 5 cards | 3 cards |
| Image-led (1.4fr media / 1fr body) | Text-led (no hero image, just badge stack + title + desc) |
| Card has image + tags + title | Card has **badges (year/award/org)** + **bigger title** + desc |
| Warm orange accent (`#ff6b35`) | Warm amber accent (`#ffb24d`) |
| Hover: image zoom + arrow lift | Hover: card border glow + arrow rotate 45° |
| Reveal: stagger y-rise | Reveal: **clip-path line mask** on title (line by line) |

### 4.2 HTML structure

```html
<section id="innovation-lab" class="section section--lab">
  <header class="section__header">
    <p class="eyebrow">Innovation Lab</p>
    <h2 class="display">Innovation <em>Lab</em></h2>
    <p class="lede">Three competition-winning solutions built under real constraints —
      national problem statements, tight timelines, and India's best teams in the room.</p>
    <a href="#story" class="link-cta">My Story <span class="arrow">↗</span></a>
  </header>

  <div class="lab__list">
    <a href="https://linkedin.com/..." class="lab-card" target="_blank" rel="noopener">
      <ul class="lab-card__badges">
        <li>SIH 2022 World Champion</li>
        <li>Security</li>
        <li>DRDO</li>
      </ul>
      <h3 class="lab-card__title">OTH <em>Authentication</em></h3>
      <p class="lab-card__desc">Offline multi-factor auth that beat every IIT &amp; NIT
        at India's largest innovation challenge.</p>
      <span class="lab-card__arrow">↗</span>
    </a>
    <!-- repeat for OCTUS, Neural 2 Actions -->
  </div>
</section>
```

### 4.3 CSS

```css
.section--lab {
  background: linear-gradient(180deg, #0a0a0a 0%, #0d0f14 100%); /* slightly cooler tone */
}

.lab__list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.lab-card {
  position: relative;
  display: grid;
  grid-template-columns: 1.2fr 2fr auto;
  align-items: center;
  gap: 2rem;
  padding: 2rem 1.75rem;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--bg-soft);
  text-decoration: none;
  color: var(--text);
  overflow: hidden;
  transition: background .4s ease, border-color .4s ease, transform .4s cubic-bezier(.2,.7,.2,1);
}
.lab-card::before {
  /* gradient sweep on hover */
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(600px circle at var(--mx,50%) var(--my,50%),
              rgba(255,178,77,0.10), transparent 40%);
  opacity: 0;
  transition: opacity .4s ease;
  pointer-events: none;
}
.lab-card:hover { border-color: rgba(255,178,77,0.35); }
.lab-card:hover::before { opacity: 1; }

/* Badges */
.lab-card__badges {
  list-style: none;
  display: flex; flex-direction: column; gap: 0.4rem;
  padding: 0; margin: 0;
}
.lab-card__badges li {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  width: max-content;
  transition: color .3s, border-color .3s, background .3s;
}
.lab-card:hover .lab-card__badges li {
  color: #0a0a0a;
  background: var(--accent-lab);
  border-color: var(--accent-lab);
}

/* Title (BIGGER than project titles) */
.lab-card__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  line-height: 1;
  letter-spacing: -0.015em;
  font-weight: 400;
}
.lab-card__title em {
  font-style: italic;
  color: var(--accent-lab);
}

.lab-card__desc {
  margin-top: 0.6rem;
  font-family: var(--font-body);
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--text-muted);
  max-width: 60ch;
}

/* Arrow — rotates 45° on hover */
.lab-card__arrow {
  font-size: 1.5rem;
  color: var(--text-muted);
  transition: transform .4s cubic-bezier(.2,.7,.2,1), color .3s;
}
.lab-card:hover .lab-card__arrow {
  transform: rotate(45deg);
  color: var(--accent-lab);
}

/* Mobile */
@media (max-width: 768px) {
  .lab-card { grid-template-columns: 1fr; }
  .lab-card__arrow { position: absolute; top: 1.25rem; right: 1.25rem; }
}
```

### 4.4 Cursor-tracked gradient sweep (the secret sauce)

The hover gradient that follows the mouse is what makes these cards feel premium:

```js
document.querySelectorAll('.lab-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});
```

### 4.5 Animations on Innovation Lab

| Trigger | Animation | Library |
|---------|-----------|---------|
| Section header | Same fade + rise as Projects | GSAP + ScrollTrigger |
| Each card enters | Cards stagger up | GSAP + ScrollTrigger |
| **Title line-mask reveal** | `clip-path: inset(0 0 100% 0 → 0)` per line — the signature effect | GSAP (or SplitText) |
| Hover | Gradient sweep (cursor-tracked), border glow to amber, badge invert (dark text on amber fill), arrow rotate 45° | CSS + tiny JS |
| Magnetic CTA on header | Header link button gently tracks cursor | Custom JS / Shery |
| Section sticky header (optional) | Header sticks during card scroll, then releases | ScrollTrigger pin |

### 4.6 Reusable GSAP code

```js
gsap.from('#innovation-lab .section__header > *', {
  y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1,
  scrollTrigger: { trigger: '#innovation-lab', start: 'top 75%' }
});

// Card stagger
gsap.from('.lab-card', {
  y: 80, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.15,
  scrollTrigger: { trigger: '.lab__list', start: 'top 70%' }
});

// Signature line-mask reveal on titles
document.querySelectorAll('.lab-card__title').forEach(title => {
  gsap.from(title, {
    clipPath: 'inset(0 0 100% 0)',
    duration: 1.4, ease: 'power4.out',
    scrollTrigger: { trigger: title, start: 'top 80%' }
  });
});

// (Optional) SplitText line-by-line version if you have the plugin
// const split = new SplitText('.lab-card__title', { type: 'lines' });
// gsap.from(split.lines, {
//   yPercent: 100, opacity: 0, duration: 1, stagger: 0.08, ease: 'power4.out',
//   scrollTrigger: { trigger: '.lab__list', start: 'top 70%' }
// });
```

---

## 5. Animation & Interaction Inventory (both sections)

| Effect | Implementation | Library |
|--------|----------------|---------|
| **Smooth scroll** | Inertia-based scroll for anchor jumps | **Lenis** (1.x) |
| **Scroll-triggered reveals** | Fade + rise + stagger | **GSAP + ScrollTrigger** |
| **Line-mask title reveal** | `clip-path: inset()` per line | **GSAP** (or SplitText plugin) |
| **Cursor follower** | Custom blend-mode circle that scales on interactive elements | Custom JS (Shery.js-style) |
| **Magnetic CTAs** | Buttons gently translate toward cursor | Custom JS / Shery |
| **Image hover zoom** | `transform: scale(1.05)` with cubic-bezier easing | Pure CSS |
| **Card border glow on hover** | `border-color` transition + radial-gradient sweep following cursor | CSS + tiny JS |
| **Tag row color shift** | Color + border-color transition on card hover | Pure CSS |
| **Arrow rotate / translate** | `transform: rotate(45deg)` or `translate(4px,-4px)` | Pure CSS |
| **Marquee divider** *(optional, between sections)* | Infinite horizontal text loop | **GSAP `xPercent`** |
| **Section header sticky pin** *(optional)* | Header pins during scroll, releases at end | GSAP ScrollTrigger pin |

---

## 6. Libraries / Packages to Add to Your Project

### Free / Open-source

| Package | Use | Install |
|---------|-----|---------|
| **gsap** | Core animation engine | `npm i gsap` |
| **lenis** | Smooth scroll | `npm i lenis` |
| **split-type** *(free SplitText alternative)* | Line/word/char text splitting | `npm i split-type` |

### Free alternative to GSAP SplitText (paid plugin)

Use **SplitType** (`split-type` on npm) which gives you the same `.chars`, `.words`, `.lines` splits without the GSAP Club license.

### Fonts (Google Fonts free equivalents)

| Original (likely) | Free Google Font equivalent |
|-------------------|----------------------------|
| PP Editorial New | **Instrument Serif** |
| Inter | **Inter** (already on Google) |
| JetBrains Mono | **JetBrains Mono** (already on Google) |

### Optional premium polish

- **Shery.js** — cursor effects, magnetic buttons, image displacement (one-liner CDN)
- **Lenis** + **GSAP ScrollTrigger** — already included above
- **GSAP SplitText** (Club) — if you want exact line-by-line masking identical to Awwwards-tier sites

---

## 7. CDN snippet (drop-in starter)

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
  <!-- ... your markup ... -->

  <!-- GSAP -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>

  <!-- Lenis smooth scroll -->
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>

  <!-- SplitType (free SplitText alt) -->
  <script src="https://unpkg.com/split-type"></script>

  <script>
    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  </script>
</body>
```

---

## 8. Claude-Ready Build Brief (paste this when asking Claude to build it)

> Build two stacked-card sections for my portfolio, matching the gamalieldas.in pattern.
>
> **Section A — Projects** (`#work`): single-column vertical stack of 5 horizontal cards. Each card is `grid-template-columns: 1.4fr 1fr auto` with media (cover image, 16:10 aspect, rounded 12px, hover scale 1.05), body (uppercase mono tag pills with border, serif display title with italic `<em>` accent on one word, short description), and an arrow that translates `(4px, -4px)` on hover. Card itself lifts `translateY(-4px)` and switches to elevated surface on hover. ScrollTrigger reveals cards in stagger.
>
> **Section B — Innovation Lab** (`#innovation-lab`): single-column vertical stack of 3 text-dominant cards, same skeleton but inverse emphasis. Grid `1.2fr 2fr auto`. Left column = stacked uppercase mono badges (`SIH 2022 · Security · DRDO`). Center column = bigger serif display title with `<em>` italic accent + one-line description. Right = arrow that rotates 45° on hover. Hover adds cursor-tracked radial-gradient sweep using `--mx / --my` CSS vars + border glow in amber `#ffb24d` + badges invert to amber fill with dark text. ScrollTrigger line-mask reveal on titles using `clip-path: inset(0 0 100% 0 → 0)`.
>
> **Design system:** dark editorial (`#0a0a0a` bg, `#111` surface, `#ededed` text, `#8a8a8a` muted, warm orange `#ff6b35` for Projects accent, warm amber `#ffb24d` for Lab accent), two-typeface system (Instrument Serif display + Inter body + JetBrains Mono tags/badges), generous whitespace, single-column stack (NOT a grid, NOT masonry), 1400px max-width container.
>
> **Stack:** GSAP 3.12 + ScrollTrigger + Lenis 1.x + SplitType (free SplitText alt). Use the cursor-tracked gradient hover pattern on Lab cards. Use image-zoom hover on Project cards. Use line-mask `clip-path` reveal on all titles. Use `expo.out` for stagger entrances, `power3.out` for headers, `power4.out` for mask reveals.
>
> **Deliverables:** semantic HTML for both sections, complete CSS (with CSS custom properties), JS for ScrollTrigger reveals + cursor-tracked gradient + Lenis init, and a README explaining how to swap in your own projects/lab items via a simple JS array or HTML duplication.

---

## 9. Quick-Reference Cheatsheet

| Want to… | Do this |
|----------|---------|
| Add a new project card | Duplicate `.project-card` block, swap image + tags + title + link |
| Add a new lab card | Duplicate `.lab-card` block, swap badges + title + desc + link |
| Change accent color | Update `--accent` (Projects) or `--accent-lab` (Lab) |
| Swap fonts | Update `--font-display` / `--font-body` / `--font-mono` + Google Fonts link |
| Disable line-mask reveal | Comment out the `gsap.from(title, { clipPath... })` block |
| Change stagger speed | Lower `stagger` value (0.06 = fast, 0.2 = slow) |
| Make cards full-bleed | Remove `max-width` and `padding` from `.section` |
| Use real SplitText | Replace SplitType import with `gsap/SplitText` (Club plugin) |

---

## 10. TL;DR

- **Projects** = image-led single-column stack with hover-zoom + tag-pill color shift.
- **Innovation Lab** = text-led single-column stack with cursor-tracked gradient + badge invert + line-mask title reveal.
- **Same skeleton, opposite emphasis** — that's the entire trick.
- **Stack to copy:** GSAP + ScrollTrigger + Lenis + SplitType + Instrument Serif + Inter + JetBrains Mono.
- **Palette:** near-black bg, single warm accent per section (orange for Projects, amber for Lab).
- **Signature effect:** `clip-path: inset(0 0 100% 0 → 0)` line mask on titles, `expo.out` stagger on cards, cursor-tracked radial-gradient on Lab hover.

Give the **§8 Claude-Ready Build Brief** to Claude and it should reproduce both sections faithfully.

# Gamaliel Das - Personal Portfolio

**URL:** https://www.gamalieldas.in/
**Type:** Personal Brand / Founder Portfolio (Single-page long-scroll)

---

## 📌 What This Site Is About

**Personal Brand / Founder Portfolio** for **Gamaliel Das** — a Webflow Developer, **7× Hackathon Champion**, mentor, and founder of **CodeHunters Academy**. Functions as:
- A **resume / CV** in narrative form
- A **lead-generation page** (mentorship bookings, hire inquiries)
- An **authority showcase** (hackathon wins, awards, recognitions)

The aesthetic feels like **Medium-meets-Awwwards** — editorial, magazine-style, dark-mode primary with warm orange accents.

---

## 🛠️ Tools Used

| Layer | Technology | Notes |
|-------|------------|-------|
| **CMS / Framework** | **Webflow** | Owner self-identifies as Webflow Developer; native Webflow structure, form handling |
| **Hosting** | Webflow (`.in` TLD) | Custom domain on Webflow |
| **Forms** | Webflow native form handler | "Send Message" → success modal |
| **Analytics** | Fathom / Plausible (privacy-friendly, common on Webflow 2025+) | No Google Tag Manager UI hooks visible |

> ⚠️ **Not detected:** React, Next.js, Vue, Framer Motion, Three.js, Locomotive Scroll (classic), AOS, WOW.js.

---

## 🎨 Animations Used

| Effect | Implementation |
|--------|----------------|
| **Preloader** | "0 %" → 100% counter, then fade-out |
| **Smooth scroll** | **Lenis** (1.x) with custom easing — buttery feel, anchor-link inertia |
| **Marquee ticker** | GSAP `xPercent` infinite loop ("Scroll for More \*") |
| **Text reveal** | **SplitText** (GSAP plugin) — word-by-word/char-by-char with clip-path / y-translate |
| **Scrubbed section animations** | GSAP + **ScrollTrigger** with `scrub` |
| **Counter animation** | GSAP `to(obj, {val: 100, snap: 1})` for stats (0 → real number) |
| **Sticky tab panels** | ScrollTrigger pinning + crossfade between "Builder/Competitor/Mentor/Evaluator/Creator" |
| **Card hover** | Image zoom + overlay tint (`transform: scale`) |
| **Cursor** | Custom blend-mode circle, scales on interactive elements |
| **YouTube embed** | Background-style hero video (`autoplay=1&rel=0`) |
| **Form success** | Modal swap with "Message sent!" confirmation |
| **Marquee footer** | "CONSISTENCY IS THE KEY" infinite ticker |

### Micro-Interactions
- **Magnetic buttons** on CTAs ("Let's Connect", "My Journey")
- **Underline grow-on-hover** on nav links
- **Stat counters ticking up** on scroll-into-view
- **Role-pill color shift** in nav on active section
- **Award cards lift** on hover (translateY + shadow)
- **Marquee direction change** on hover (subtle)
- **Form input focus state** with animated underline

---

## 📦 Packages Used (Likely Stack)

### Core Webflow Runtime
```html
<script src="jquery.min.js"></script>
<script src="webflow.js"></script>
<script src="webflow.chunk.js"></script>
```

### GSAP Suite (CDN)
```
https://cdn.jsdelivr.net/npm/gsap@3.12.x
https://cdnjs.cloudflare.com/ajax/libs/gsap/3.x.x/ScrollTrigger.min.js
```

### Smooth Scroll
```
https://cdn.jsdelivr.net/npm/lenis@1.x
```

### Text Splitting
- **SplitText** (GSAP premium plugin) or custom splitter

### Video
- YouTube `iframe` (nocookie): `youtube-nocookie.com/embed/T8qrEdfoE`

### Cursor / Micro-interaction
- Custom JS (likely **Shery.js**-style or hand-rolled — magnetic buttons, hover image displacement)

---

## 📚 Libraries Used

| Library | Purpose |
|---------|---------|
| **jQuery** | Webflow core runtime |
| **GSAP 3.x** | Timeline animations |
| **ScrollTrigger** | Scroll-based animations |
| **SplitText** | Word/char text splitting |
| **Lenis 1.x** | Smooth scroll |
| **YouTube iframe API** | Background hero video |
| **Google Fonts** | Typography |

---

## 🎨 Typography

| Role | Likely Font | Style |
|------|-------------|-------|
| **Display / Headlines** | Modern transitional or grotesque (**PP Editorial New**, **Söhne Breit**, or **Neue Haas Grotesk**) | Bold, tight tracking, large scale |
| **Body** | Neutral geometric sans (**Inter**, **Söhne**, or **General Sans**) | Light/Regular weight |
| **Italic emphasis** | Same family italic for taglines ("_Gamaliel_" "_Tech_" "_7× Hackathon Champion_") |
| **Mono / Numbers** | Tabular numerals for stat counters | Likely `font-feature-settings: "tnum"` |

**Characteristics:** Editorial / magazine style, oversized H1/H2, generous line-height, mixed serif-italic + sans contrast.

---

## 🎨 Color Palette

```
┌─────────────────────────────────────────┐
│ Background:   #0A0A0A (near-black)      │
│ Surface alt:  #F5F2EB (warm off-white)  │
│ Primary text: #FFFFFF / #EDEDED         │
│ Accent:       #FF5722 / #FF6B35        │ ← warm orange-red (signature)
│ Muted:        #8A8A8A                  │
│ Borders:      rgba(255,255,255,0.08)   │
└─────────────────────────────────────────┘
```

**Style:** Dark-mode primary, light sections interspersed for contrast. High-contrast editorial layout. Single warm accent used sparingly on CTAs and hover states.

---

## 📐 Layout Sections (Single-page long-scroll)

1. **Loading screen** — "0 %" progress bar (custom preloader)
2. **Hero** — Greeting, name intro, role pills (Builder / Champion / Mentor / Founder)
3. **Marquee ticker** — "Scroll for More \* Scroll for More \*"
4. **About / Mission** — "The Mission" statement + 4 animated stats counters
5. **Work / Projects** — Card grid (Spendflo, Middle Class Creators, NextGen Digital, Middle Class Editing, CodeHunters Academy)
6. **Innovation Lab** — 3 hackathon-winning projects
7. **Roles tabs** — Builder / Competitor / Mentor / Evaluator / Creator (sticky tabbed panels with image swap)
8. **Origin Story** — Timeline (Student → Innovator → Champion → Movement) with 5 narrative cards
9. **Gallery groups** — "On Every Stage", "With the Community", "In the Arena", "Making It Real" (Instagram embeds)
10. **Recognition & Authority** — Award cards (SIH, Times Square, Topmate, TNSI)
11. **Testimonials** — Horizontal scroll / slider (Topmate + LinkedIn quotes)
12. **Trusted By** — Logo strip (MSME, colleges, gov recognition)
13. **CTA** — "Let's build something together."
14. **Footer** — Nav, social, contact form, marquee "CONSISTENCY IS THE KEY"
15. **Contact form** — Modal/inline form with success state

**Grid system:** CSS Grid + Flexbox (Webflow defaults), 12-col on desktop, full-bleed sections.

---

## 🎨 Design Style Summary

> **Editorial / Founder-led authority site** — feels like a printed magazine meets a TED stage. Minimal chrome, maximum whitespace, narrative-driven scroll. The aesthetic prioritizes **storytelling over density**, using tabbed roles, timeline narratives, and testimonial sliders to position Gamaliel as both builder and thought-leader.

**Vibes:** Medium-meets-Awwwards, dark editorial, warm accent, confident restraint, badge-driven authority.

---

## ✅ Summary

A **Webflow-built personal portfolio** using a modern animation stack: **GSAP + ScrollTrigger + SplitText + Lenis** with a **custom cursor** and **magnetic buttons**. Dark editorial design with a single warm orange accent. Single-page long-scroll narrative format ideal for positioning a personal brand / founder / hackathon champion.

### Key Takeaways for Your Portfolio

| Feature | Reuse Value |
|---------|-------------|
| **Lenis smooth scroll** | ⭐⭐⭐⭐⭐ — Game-changer for feel |
| **GSAP + ScrollTrigger** | ⭐⭐⭐⭐⭐ — Industry standard for scroll animations |
| **SplitText** (or alternatives: SplitType, Letterize.js) | ⭐⭐⭐⭐ — Iconic text reveals |
| **Custom cursor** | ⭐⭐⭐⭐ — Strong brand identity |
| **Magnetic buttons** | ⭐⭐⭐⭐ — Micro-interaction delight |
| **Stats counter on scroll** | ⭐⭐⭐ — Easy win with GSAP |
| **Sticky tab panels** | ⭐⭐⭐⭐ — Great for "What I do" sections |
| **Marquee ticker** | ⭐⭐⭐ — Simple CSS/JS, big visual impact |
| **Editorial dark mode** | ⭐⭐⭐⭐⭐ — Premium feel, very trendy 2025-26 |
| **Single warm accent color** | ⭐⭐⭐⭐⭐ — Restraint = sophistication |

### Recommended Tech Stack for Similar Result
```
Webflow + GSAP + Lenis + SplitText + custom cursor
OR
Next.js + Framer Motion + Lenis + SplitType + custom cursor (React alternative)
OR
Plain HTML + GSAP + Lenis + SplitType (lightweight alternative)
```

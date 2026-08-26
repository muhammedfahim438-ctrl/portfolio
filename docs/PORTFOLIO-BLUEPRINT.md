# Portfolio Blueprint — Muhammed Fahim M

> A personalized blueprint of the portfolio website at `github.com/muhammedfahim438-ctrl/portfolio`. Documents the actual tech stack, design system, components, and architecture used.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Build Tool | Vite | 6.x |
| Framework | React | 19.x |
| Language | JavaScript (JSX) | ES2022+ |
| Styling | Tailwind CSS | v4 (CSS-based config) |
| Animations | Framer Motion + GSAP | 13.x + 3.x |
| Routing | React Router DOM | 7.x |
| Backend | Firebase (Firestore, Auth, Storage) | 12.x |
| Charts | Chart.js + react-chartjs-2 | 4.x + 5.x |
| Icons | react-icons | 5.x |
| Notifications | react-hot-toast | 2.x |

### Fonts
- **Headings:** Space Grotesk (display)
- **Body:** Inter (sans-serif)
- **Code/Terminal:** JetBrains Mono (monospace)

---

## Color Palette — "Green Nature"

A nature-inspired palette using soft sage greens and bright lime accents over deep forest backgrounds.

### Dark Mode
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#191e19` | Main page background |
| Background Secondary | `#1e241e` | Scrollbar, secondary surfaces |
| Surface | `#222822` | Cards, inputs, elevated surfaces |
| Text | `#fafcfa` | Primary text |
| Text Secondary | `#a0b8a0` | Muted text, labels |
| Accent (Primary) | `#aac8a7` | Sage green — links, CTAs, highlights |
| Accent Hover | `#bed8bb` | Lighter sage on hover |
| Secondary | `#c3edc0` | Mint green — badges, secondary actions |
| Bright Accent | `#e9ffc2` | Lime — gradient end, emphasis |
| Border | `#2a322a` | Subtle borders |
| Card | `rgba(25,30,25,0.6)` | Glassmorphic card backgrounds |

### Light Mode
| Role | Hex | Usage |
|------|-----|-------|
| Background | `#ffffff` | Main page background |
| Background Secondary | `#f5f7f5` | Scrollbar, secondary surfaces |
| Surface | `#eef2ee` | Cards, inputs, elevated surfaces |
| Text | `#191e19` | Primary text (dark forest) |
| Text Secondary | `#5a6b5a` | Muted text |
| Accent (Primary) | `#aac8a7` | Sage green |
| Accent Hover | `#96b893` | Deeper sage on hover |
| Secondary | `#c3edc0` | Mint green |
| Bright Accent | `#e9ffc2` | Lime |
| Border | `#dde5dd` | Subtle borders |
| Card | `rgba(255,255,255,0.7)` | Glassmorphic card backgrounds |

### CSS Variables (actual implementation in `src/app/globals.css`)
```css
:root {
  /* Light Mode */
  --themeBg: #ffffff;
  --themeBgSecondary: #f5f7f5;
  --themeSurface: #eef2ee;
  --themeText: #191e19;
  --themeTextSecondary: #5a6b5a;
  --themeAccent: #aac8a7;
  --themeAccentHover: #96b893;
  --themeSecondary: #c3edc0;
  --themeBorder: #dde5dd;
  --themeGradientStart: #aac8a7;
  --themeGradientEnd: #e9ffc2;
}

.dark {
  /* Dark Mode */
  --themeBg: #191e19;
  --themeBgSecondary: #1e241e;
  --themeSurface: #222822;
  --themeText: #fafcfa;
  --themeTextSecondary: #a0b8a0;
  --themeAccent: #aac8a7;
  --themeAccentHover: #bed8bb;
  --themeSecondary: #c3edc0;
  --themeBorder: #2a322a;
  --themeGradientStart: #aac8a7;
  --themeGradientEnd: #e9ffc2;
}
```

---

## Project Structure

```
portfolio/
├── index.html                     # Vite entry point
├── vite.config.js                 # Vite config with @ alias
├── postcss.config.js              # Tailwind v4 PostCSS plugin
├── package.json
├── vercel.json                    # SPA rewrite rules
├── firestore.rules                # Firestore security rules
├── firebase.json                  # Firebase Hosting config
├── .env                           # VITE_* environment variables
├── public/
│   └── favicon.svg                # Gradient FM logo
├── docs/
│   ├── PORTFOLIO-MANUAL.md        # Full build spec (1326 lines)
│   ├── PORTFOLIO-BLUEPRINT.md     # This file
│   ├── CLAUDE-AI-INSTRUCTIONS.md  # AI build instructions
│   └── websites/                  # 17 reference website analyses
└── src/
    ├── main.jsx                   # App entry: BrowserRouter + ThemeProvider
    ├── App.jsx                    # Routes: /, /admin/login, /admin, /seed
    ├── app/
    │   └── globals.css            # Aurora CSS variables + Tailwind v4 @theme
    ├── components/
    │   ├── landing/               # 10 landing page components
    │   ├── admin/                 # 6 admin dashboard components
    │   ├── ui/                    # 5 reusable UI components
    │   └── providers/             # ThemeProvider (React context)
    ├── hooks/                     # 6 custom hooks
    ├── lib/                       # Firebase init, auth, Firestore, Storage
    ├── data/                      # seed.js (Firestore population)
    └── pages/                     # SeedPage
```

---

## Landing Page — 10 Sections

Each section is a standalone React component in `src/components/landing/`.

### 1. SplashScreen
- **File:** `SplashScreen.jsx`
- **Animation:** Framer Motion — staggered character-by-character name reveal with gradient text
- **Behavior:** Shows for 3.5s, then slides up and fades out
- **Elements:** Name "MUHAMMED FAHIM M" with per-character motion, subtitle fade-in, gradient progress bar

### 2. HeroSection
- **File:** `HeroSection.jsx`
- **Animation:** Framer Motion — slide-in from left, typewriter effect for name
- **Features:**
  - Typewriter title animation (80ms per character)
  - Blinking cursor
  - Voice intro button (Web Speech API via `useSpeech` hook)
  - Canvas audio visualizer (via `useAudioVisualizer` hook)
  - Floating social dock (GitHub, LinkedIn icons)
  - Glassmorphic resume modal (via Button + Modal)
- **Layout:** 2-column grid (text left, silhouette image right on desktop)

### 3. TerminalWidget
- **File:** `TerminalWidget.jsx`
- **Animation:** Framer Motion — slide-in from bottom
- **Features:**
  - Full CLI simulation with command history
  - 10+ commands: `help`, `whoami`, `skills`, `projects`, `experience`, `contact`, `github`, `cert`, `history`, `clear`
  - 3 easter eggs: `matrix`, `ls -la`, `sudo hire me`
  - Clickable links in output (GitHub, email)
  - Auto-scroll to latest output
- **Styling:** Dark terminal look with green text, JetBrains Mono font

### 4. SkillsBentoGrid
- **File:** `SkillsBentoGrid.jsx`
- **Animation:** Framer Motion — staggered fade-in on scroll
- **Features:**
  - Bento grid layout with category cards
  - Chart.js radar/spider charts for skill visualization
  - 6 categories: Programming, Backend, Frontend, Database, AI/ML, Tools & DevOps
  - 32 skills with proficiency levels
  - Color-coded by category

### 5. WorkflowTimeline
- **File:** `WorkflowTimeline.jsx`
- **Animation:** Framer Motion — scroll-triggered reveals
- **Features:**
  - 4-step data pipeline visualization
  - Admin-configurable (reads from Firestore `workflow_steps` collection)
  - Step icons, titles, descriptions
  - Color-coded steps (admin-editable)
- **Default steps:** Data Collection → Data Cleaning → Analysis & Modeling → Visualization & Deployment

### 6. FeaturedProjects
- **File:** `FeaturedProjects.jsx`
- **Animation:** Framer Motion — staggered card reveals
- **Features:**
  - Shows top 3 featured projects from Firestore
  - Card layout with title, description, tags
  - "View All Projects" button opens ProjectOverlay
  - Click card to open ProjectOverlay

### 7. ProjectOverlay
- **File:** `ProjectOverlay.jsx`
- **Animation:** Framer Motion — fullscreen modal with backdrop blur
- **Features:**
  - Fullscreen overlay showing ALL projects (not just featured 3)
  - Category filter tabs
  - Project cards with live URL and GitHub links
  - Close button to return to landing

### 8. CertificationsSection
- **File:** `CertificationsSection.jsx`
- **Animation:** Framer Motion — staggered card reveals
- **Features:**
  - Badge cards for each certification
  - Issuer, date, credential URL
  - Click to open verification modal
- **Data:** 3 certifications from Firestore `certifications` collection

### 9. GitHubHeatmap
- **File:** `GitHubHeatmap.jsx`
- **Animation:** Framer Motion — fade-in on scroll
- **Features:**
  - Live contribution heatmap fetched directly from GitHub Public Events API
  - GitHub-style green squares with 5 intensity levels
  - Counts ALL event types (PushEvent, CreateEvent, IssuesEvent, PullRequestEvent, etc.)
  - Falls back to placeholder data if API fails
  - Links to GitHub profile

### 10. ContactFooter
- **File:** `ContactFooter.jsx`
- **Animation:** Framer Motion — section reveal
- **Features:**
  - Contact form (name, email, message) → writes to Firestore `messages` collection
  - Toast notifications on success/error (react-hot-toast)
  - Social links (GitHub, LinkedIn)
  - Theme toggle (dark/light mode)
  - Copyright footer

---

## Admin Dashboard

Protected by Firebase Auth. Route: `/admin`

### AuthGuard
- **File:** `components/admin/AuthGuard.jsx`
- Redirects to `/admin/login` if not authenticated
- Shows loading spinner during auth check

### Login Page
- **File:** `app/admin/login/page.jsx`
- Email + password form
- Firebase `signInWithEmailAndPassword`
- Redirects to `/admin` on success

### Dashboard (4 Tabs)
- **File:** `app/admin/page.jsx`

| Tab | Component | Function |
|-----|-----------|----------|
| 1. Hero Config | `TabHeroConfig.jsx` | Edit hero title, subtitle, voice text, photo URL |
| 2. Projects | `TabProjectsManager.jsx` | Full CRUD for projects (add, edit, delete) |
| 3. Skills & Links | `TabSkillsLinks.jsx` | Manage skills, certifications, workflow steps, social links |
| 4. Messages | `TabMessages.jsx` | View/delete contact form submissions |

---

## Custom Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useTheme` | `hooks/useTheme.js` | Access ThemeProvider context (theme, toggleTheme, setTheme) |
| `useAuthGuard` | `hooks/useAuthGuard.js` | Firebase auth state listener, redirects if unauthenticated |
| `useSpeech` | `hooks/useSpeech.js` | Web Speech API — speak/stop text with voice intro |
| `useAudioVisualizer` | `hooks/useAudioVisualizer.js` | Canvas-based waveform/equalizer during speech |
| `useFirestore` | `hooks/useFirestore.js` | Generic Firestore CRUD (get, add, update, delete) |
| `useTerminal` | `hooks/useTerminal.js` | Terminal command processor with history and easter eggs |

---

## Firebase Schema

### Collections

| Collection | Documents | Purpose |
|------------|-----------|---------|
| `site_config` | `hero_data` | Hero section text and photo |
| `projects` | 12 docs | Portfolio projects with tags, URLs, featured flag |
| `skills` | 32 docs | Technical skills with categories and levels |
| `certifications` | 3 docs | Certifications with issuer and dates |
| `workflow_steps` | 4 docs | Workflow pipeline steps with colors |
| `profile` | 1 doc | Social links (GitHub, LinkedIn, email, phone) |
| `messages` | varies | Contact form submissions |

### Security Rules
- **Read:** Public (anyone can view portfolio)
- **Write:** Authenticated only (admin login required)
- **Exception:** `messages` collection allows anonymous `create` (contact form)

---

## Animation Patterns

### Framer Motion (React-integrated)
Used in all landing components for:
- Page transitions and section reveals
- Staggered card animations
- Modal/backdrop animations
- Typewriter effect (HeroSection)
- Character-by-character text reveal (SplashScreen)

### GSAP (loaded but used sparingly)
Available for ScrollTrigger-based animations if needed.

### Patterns Used
```jsx
// Staggered children
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
  transition={{ staggerChildren: 0.1 }}>

// Scroll-triggered
<motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
  viewport={{ once: true }}>

// Modal backdrop
<AnimatePresence>
  {isOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}>...</motion.div>}
</AnimatePresence>
```

---

## Deployment

### Vercel (Production)
- **URL:** `portfolio-delta-three-25.vercel.app`
- **Config:** `vercel.json` with SPA rewrite rules
- **Auto-deploys** from GitHub `main` branch

### Firebase (Firestore Rules)
```bash
firebase deploy --only firestore:rules
```

### Seed Data
Visit `/seed` → click "Seed Data" button to populate Firestore.

---

## Quality Checklist

### Performance
- [ ] Vite build passes with zero errors
- [ ] Production bundle: ~42KB CSS + ~1.1MB JS (gzipped: ~8KB + ~318KB)
- [ ] Lazy load below-fold sections
- [ ] Optimize images (WebP/AVIF)

### Accessibility
- [ ] Semantic HTML (header, nav, main, footer)
- [ ] ARIA labels on interactive elements
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast WCAG AA compliant
- [ ] Reduced motion support (`prefers-reduced-motion`)

### SEO
- [ ] Meta title + description in index.html
- [ ] Open Graph tags
- [ ] Structured data (JSON-LD)
- [ ] Sitemap.xml
- [ ] Robots.txt

### Browser Support
- [ ] Chrome, Edge, Firefox, Safari (latest 2 versions)
- [ ] Mobile Safari iOS 14+
- [ ] Chrome Android

---

## Future Enhancement Ideas

From the 17 reference websites analyzed in `docs/websites/`:

| Feature | Source | Priority |
|---------|--------|----------|
| Lenis smooth scroll | #17 Gamaliel, #14-16 Arolax | High |
| Custom cursor (blend-mode) | #17 Gamaliel | Medium |
| Magnetic buttons | #17 Gamaliel | Low |
| Marquee ticker | #17 Gamaliel | Low |
| Stats counter on scroll | #17 Gamaliel | Medium |
| SplitText character reveal | #17 Gamaliel | Medium |
| Three.js 3D hero | #14, #16 Arolax | Low |
| Swiper.js testimonials | #16 Arolax | Low |
| Preloader percentage counter | #17 Gamaliel | Already have SplashScreen |

---

> **Last Updated:** August 2026
> **Based On:** 17 reference website analyses in `docs/websites/`

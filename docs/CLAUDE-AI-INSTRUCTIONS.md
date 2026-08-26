# Claude AI — Portfolio Build Instructions

> **Purpose:** This file contains the project instruction set, file descriptions, build phases, and the exact first prompt to paste into Claude AI (claude.ai or Claude Code) to build Muhammed Fahim M's portfolio.

---

## STEP 0: SETUP CHECKLIST (Complete Before Building)

Before running any code, complete this checklist. **You CANNOT proceed to Phase 1 without items 1-4.**

### Checklist

| # | Item | Done? | Value |
|---|------|-------|-------|
| 1 | Firebase API Key | [ ] | _______________ |
| 2 | Firebase Auth Domain | [ ] | _______________ |
| 3 | Firebase Project ID | [ ] | _______________ |
| 4 | Firebase Storage Bucket | [ ] | _______________ |
| 5 | Firebase Messaging Sender ID | [ ] | _______________ |
| 6 | Firebase App ID | [ ] | _______________ |
| 7 | Admin Email | [x] | muhammedfahim438@gmail.com |
| 8 | Admin Password | [ ] | _______________ |
| 9 | Gmail for SMTP | [x] | muhammedfahim438@gmail.com |
| 10 | Gmail App Password (16-char) | [ ] | _______________ |
| 11 | Resume PDF | [x] | Using existing `Muhammed Fahim M - Resumeogg.pdf` |
| 12 | Vercel Account | [ ] | Connected to GitHub |
| 13 | Hero Image | [x] | Placeholder (upload later via admin) |

### How to Get Each Item

#### Items 1-6: Firebase Config
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add Project** → Name: `muhammed-fahim-portfolio` → Create
3. **Enable 3 services:**
   - Firestore Database → Create database → Production mode → Region: asia-south1
   - Authentication → Sign-in method → Enable **Email/Password**
   - Storage → Get started → Production mode → Same region
4. Go to **Project Settings** (gear icon top-left) → **General** tab → **Your apps** → Click **Web icon** (`</>`)
5. Register app name: `portfolio-web` → Register
6. You'll see the `firebaseConfig` object — **copy all 6 values**

#### Item 8: Admin Password (Firebase Auth User)
1. Firebase Console → **Authentication** → **Users** tab
2. Click **Add user**
3. Email: `muhammedfahim438@gmail.com`
4. Password: (create a strong password, write it here)
5. This is the login for your admin dashboard at `/admin`

#### Items 9-10: Gmail App Password (Email Notifications)
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (required, follow on-screen steps)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select app: **Mail** → Select device: **Other (Custom name)** → Type: `Portfolio`
5. Click **Generate**
6. Copy the **16-character password** (looks like: `abcd efgh ijkl mnop` — remove spaces when pasting into .env)

#### Item 12: Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** → Choose **Continue with GitHub**
3. Authorize Vercel to access your GitHub
4. That's it — deployment happens via "Import Project" after code is ready

#### Item 11: Resume PDF
- The file `Muhammed Fahim M - Resumeogg.pdf` is already in `D:\portfolio\`
- This will be uploaded to Firebase Storage via the admin dashboard after deployment

#### Item 13: Hero Image
- No image needed now — using placeholder
- After deployment, upload your photo via Admin Dashboard → Tab 1 → Hero Config → Photo Upload

### Create .env.local File

After completing the checklist, create `.env.local` in your project root:

```env
# ========================================
# FIREBASE CONFIGURATION
# From: Firebase Console → Project Settings → General → Your apps → Web app
# ========================================
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# ========================================
# ADMIN CREDENTIALS
# From: Firebase Console → Authentication → Users
# ========================================
VITE_ADMIN_EMAIL=muhammedfahim438@gmail.com
ADMIN_PASSWORD=your_admin_password_here

# ========================================
# SMTP EMAIL NOTIFICATIONS
# From: Google Account → App Passwords
# ========================================
SMTP_EMAIL=muhammedfahim438@gmail.com
SMTP_APP_PASSWORD=your_16_char_app_password
```

**IMPORTANT:**
- Replace ALL `your_xxx_here` placeholders with real values
- NEVER commit `.env.local` to git (it's in .gitignore)
- `.env.local` must be in project root (same level as `package.json`)

### Verification Before Building

- [ ] All 6 Firebase values filled (no placeholders left)
- [ ] Admin password set and tested at Firebase Console → Authentication
- [ ] Gmail App Password is 16 characters, no spaces
- [ ] `.env.local` file exists in project root
- [ ] Vercel account connected to GitHub

---

## PROJECT INSTRUCTION (Paste This as the System Prompt / First Message)

```
ACT AS A SENIOR FULL-STACK SOFTWARE ARCHITECT & HIGH-END UI/UX DESIGNER.

BUILD A PRODUCTION-READY REACT (VITE, JAVASCRIPT, TAILWIND CSS) PORTFOLIO AND FULL-CMS ADMIN DASHBOARD SYSTEM WITH FIREBASE BACKEND.

CRITICAL INSTRUCTIONS:
1. BEFORE GENERATING OR CREATING ANY CODE FILES, EXPLICITLY PRESENT YOUR PROPOSED ARCHITECTURE STEP AND ASK: "DO YOU WANT ME TO PROCEED WITH THIS STEP, OR DO YOU HAVE ANY MODIFICATIONS?" WAIT FOR EXPLICIT APPROVAL BEFORE WRITING CODE FOR EACH SECTION.

2. READ PORTFOLIO-MANUAL.md COMPLETELY before writing any code. It contains:
   - The Aurora color palette (teal + violet, NOT default indigo)
   - All Firestore schemas with pre-filled data
   - Every component specification
   - All resume content and GitHub data
   - Terminal widget commands and easter eggs
   - Admin dashboard CRUD operations
   - CSS variable theme system using HSL

3. NO HARDCODED HEX COLORS in any component. Always use Tailwind theme tokens (bg-themeAccent, text-themeText, etc.) or CSS variables (hsl(var(--themeAccent))).

4. USE HSL CSS VARIABLES for the theme system, NOT raw hex. The Aurora palette uses HSL values.

5. Fonts: Space Grotesk (headings/display), Inter (body), JetBrains Mono (code/terminal).

BUILD PHASES (each requires user approval before coding):
  Phase 1:  Project init + Vite dependencies + configs
  Phase 2:  Theme system (globals.css + vite.config.js)
  Phase 3:  Firebase setup + lib files
  Phase 4:  UI components (GlassCard, Button, Modal, ThemeToggle, AnimatedText, LoadingSpinner)
  Phase 5:  Hooks (useTheme, useAuthGuard, useSpeech, useAudioVisualizer, useTerminal, useFirestore)
  Phase 6:  Landing — SplashScreen (GSAP)
  Phase 7:  Landing — HeroSection (silhouette, voice, social dock, resume modal)
  Phase 8:  Landing — TerminalWidget (full CLI + easter eggs)
  Phase 9:  Landing — SkillsBentoGrid (Chart.js radar charts)
  Phase 10: Landing — WorkflowTimeline (admin-configurable)
  Phase 11: Landing — FeaturedProjects + ProjectOverlay
  Phase 12: Landing — CertificationsSection
  Phase 13: Landing — GitHubHeatmap + API route
  Phase 14: Landing — ContactFooter
  Phase 15: Landing — Page assembly (page.tsx)
  Phase 16: Admin — Auth guard + login page
  Phase 17: Admin — Tab 1 (Hero Config)
  Phase 18: Admin — Tab 2 (Projects CRUD)
  Phase 19: Admin — Tab 3 (Skills, Certs, Workflow, Links)
  Phase 20: Admin — Tab 4 (Messages inbox)
  Phase 21: Seed script
  Phase 22: Root entry point + providers
  Phase 23: Final polish + responsive + accessibility
```

---

## FILES TO PROVIDE TO CLAUDE

Before starting, upload or make these files available to Claude:

| File | Purpose |
|------|---------|
| `PORTFOLIO-MANUAL.md` | Complete specification (master reference) |
| `CLAUDE-AI-INSTRUCTIONS.md` | This file (build instructions + prompts) |

---

## HOW TO USE

### Step 1: Start a Claude Project
1. Go to [claude.ai](https://claude.ai) or use Claude Code
2. Create a new project
3. Upload `PORTFOLIO-MANUAL.md` to the project knowledge base

### Step 2: Paste the First Prompt

```
Read PORTFOLIO-MANUAL.md completely. Then begin Phase 1:

Initialize a Vite React project with JavaScript and Tailwind CSS v4 in the current directory.
Install ALL dependencies from the manual:
  firebase, next-themes, framer-motion, gsap, @studio-freight/lenis,
  react-icons, react-hot-toast, chart.js, react-chartjs-2

Create the complete file/folder structure as defined in PORTFOLIO-MANUAL.md Section 3.
Generate config files: vite.config.js, postcss.config.js

IMPORTANT:
- Do NOT write any components or pages yet — just project scaffolding
- Use the Aurora palette in globals.css (teal + violet, NOT indigo)
- Use HSL CSS variables in the Tailwind color mapping
- Install GSAP via npm (gsap package)

Show me the proposed structure before proceeding to Phase 2.
```

### Step 3: Continue Phase by Phase

After each phase completes, paste the next prompt:

---

**Phase 2:**
```
Phase 2: Build the Aurora theme system.

Create src/app/globals.css with ALL CSS variables from PORTFOLIO-MANUAL.md Section 6.
- Use HSL format for all color variables
- Include both :root (light) and .dark (dark mode) blocks
- Include .glass and .text-gradient utility classes
- Include Lenis, scrollbar, and selection styles

Update vite.config.js with Tailwind CSS plugin configuration.

Create src/components/providers/ThemeProvider.tsx (next-themes wrapper).
Create src/hooks/useTheme.ts.
Create src/components/ui/ThemeToggle.tsx (sun/moon icon toggle).

Add the flash-free theme init script in layout.tsx <head>.

Verify: changing the .dark class on <html> should instantly recolor everything.
```

**Phase 3:**
```
Phase 3: Firebase setup + lib files + types.

Create src/lib/firebase.ts (initialize app, export db, auth, storage).
Create src/lib/firestore.ts (all CRUD functions from the manual).
Create src/lib/storage.ts (upload/delete files).
Create src/lib/auth.ts (signIn, signOut, getCurrentUser).

Create src/types/index.ts with ALL interfaces:
  HeroData, Project, Skill, Certification, WorkflowStep, SocialData, Message, TerminalLine

Create .env.local template (never commit real values).
Create .gitignore entry for .env.local.

Verify: Firebase initializes without errors (add a try-catch test).
```

**Phase 4:**
```
Phase 4: Build all reusable UI components.

Create src/components/ui/:
- GlassCard.tsx (glass class + Framer Motion hover/scroll animations)
- Button.tsx (primary/secondary/ghost variants, loading state)
- Modal.tsx (AnimatePresence, backdrop blur, Escape key)
- AnimatedText.tsx (GSAP SplitText stagger reveal)
- LoadingSpinner.tsx (spinner animation in themeAccent color)

RULES:
- Use Tailwind theme tokens (bg-themeAccent, text-themeText, etc.)
- NO hardcoded hex colors anywhere
- "use client" directive on all
- Proper JSDoc prop types
```

**Phase 5:**
```
Phase 5: Build all custom hooks.

Create src/hooks/:
- useAuthGuard.ts (Firebase onAuthStateChanged, redirect to /admin/login)
- useSpeech.ts (window.speechSynthesis, English voice, rate 0.95)
- useAudioVisualizer.ts (Canvas requestAnimationFrame, 50 bars, accent colors)
- useTerminal.ts (all commands from Section 7.3, easter eggs, history)
- useFirestore.ts (generic CRUD with onSnapshot real-time)

RULES:
- All hooks must be "use client"
- Proper JSDoc return types
- Error handling in all Firebase operations
```

**Phase 6:**
```
Phase 6: Build SplashScreen.

Full-screen overlay:
- GSAP SplitText: "MUHAMMED FAHIM M" letter-by-letter stagger
- Tagline: "Data Science & Full-Stack Developer" fades in
- After 3.5s or click: slides up and unmounts
- Background: hsl(var(--themeBg))
- Name: .text-gradient class (teal → violet)
- Subtle glow pulse behind name

Use the GSAP timeline from Section 7.1 of the manual.
```

**Phase 7:**
```
Phase 7: Build HeroSection.

Two-column layout (responsive):
- Left: Title + subtitle from Firestore, typing cursor, play voice button, CTAs
- Right: Silhouette image with CSS gradient mask + duotone filter
- Floating social dock (GitHub, LinkedIn, Kaggle, LeetCode) with spring animation
- Resume modal (glassmorphic, PDF viewer/download)
- 1-line voice with canvas equalizer visualizer

Load data from Firestore site_config/hero_data.
The voice_text for the 1-liner: "Hi! I'm Muhammed Fahim M, a Data Science and Full-Stack Developer from Kerala, India. I build production APIs, ML models, and scalable web apps. Let's connect!"
```

**Phase 8:**
```
Phase 8: Build TerminalWidget.

Full terminal simulation with:
- Prompt: fahim@portfolio:~$ (teal colored)
- Blinking cursor, typewriter output effect
- Command history (up/down arrows)
- All commands: help, whoami, skills, projects, experience, contact, github, cert, clear, theme, history
- Easter eggs: "sudo hire me" (ASCII art), "matrix" (green rain), "ls -la" (unix joke)
- Color output (teal prompts, white input, muted output, violet errors)
- Auto-scroll to bottom
```

**Phase 9:**
```
Phase 9: Build SkillsBentoGrid.

Bento grid layout (CSS Grid, varied sizes):
- 7 category cards from Firestore skills collection
- Each card: category name + skill list + Chart.js radar chart
- Radar: axes = skill names, value = level (0-100)
- Radar colors: fill = themeAccent/20, border = themeAccent
- On mobile: fallback to horizontal level bars
- Framer Motion stagger animation on scroll

Install chart.js and react-chartjs-2 if not already installed.
Register Chart.js components (RadarController, etc.).
```

**Phase 10:**
```
Phase 10: Build WorkflowTimeline.

4-step horizontal timeline (vertical on mobile):
- Load steps from Firestore workflow_steps collection
- Each: step number circle + icon + title + description
- Connected by dashed lines
- Colors from Firestore color field
- Framer Motion scroll-triggered animation
- Admin-configurable (steps can be reordered)
```

**Phase 11:**
```
Phase 11: Build FeaturedProjects + ProjectOverlay.

FeaturedProjects:
- Query Firestore: projects where featured == true (max 3)
- Glassmorphic cards with image, title, description, tags, buttons
- Featured badge (violet)
- "View All Projects" button

ProjectOverlay:
- Full-screen Framer Motion modal
- All 12 projects from Firestore
- Category filter tabs
- Close on X button or Escape key
- AnimatePresence enter/exit
```

**Phase 12:**
```
Phase 12: Build CertificationsSection.

3-column grid of glassmorphic cards:
- Load from Firestore certifications collection
- Each: TbCertificate icon (teal), title, issuer, date
- "Verify" button → modal with placeholder message
- Framer Motion scroll animation
```

**Phase 13:**
```
Phase 13: Build GitHubHeatmap + API route.

API route: src/app/api/github-contributions/route.ts
- GET handler fetches from https://api.github.com/users/muhammedfahim438-ctrl/events?per_page=100
- Filters PushEvent, aggregates by date (last 365 days)
- Returns { contributions: [{ date, count }] }

Component: GitHubHeatmap.tsx
- 52 cols x 7 rows grid
- Colors from themeHeatmap0-4 CSS variables
- Tooltip on hover (date + count)
- Total contributions counter
- Glassmorphic card
- Graceful fallback if API fails
```

**Phase 14:**
```
Phase 14: Build ContactFooter.

Contact form:
- Name + Email + Message inputs (glassmorphic container)
- Submit → addDoc to Firestore messages collection
- Success/error toast notifications
- Loading state on submit button

Footer:
- Copyright "2026 Muhammed Fahim M"
- "Built with Next.js, Firebase & Tailwind"
- Social icons (GitHub, LinkedIn)
- Theme toggle switch
```

**Phase 15:**
```
Phase 15: Assemble page.tsx.

Import and render all landing page sections in order:
SplashScreen → HeroSection → TerminalWidget → SkillsBentoGrid → WorkflowTimeline
→ FeaturedProjects → CertificationsSection → GitHubHeatmap → ContactFooter

Wrap in Lenis smooth scroll provider.
Add proper section IDs for anchor scrolling.
Verify full page renders with all sections.
```

**Phase 16:**
```
Phase 16: Admin auth guard + login page.

Create src/app/admin/login/page.tsx:
- Glassmorphic login card
- Email + Password inputs
- Sign in button with loading state
- Error display for wrong credentials
- Firebase signInWithEmailAndPassword

Create src/components/admin/AuthGuard.tsx + useAuthGuard hook.
Create src/app/admin/layout.tsx (no Lenis, auth gate).
```

**Phase 17:**
```
Phase 17: Admin Tab 1 — Hero Config.

TabHeroConfig.tsx:
- Hero Title (text input)
- Hero Subtitle (text input)
- Voice Intro Text (textarea)
- Silhouette Photo upload → Firebase Storage → URL to Firestore
- Live preview card
- Save button → update site_config/hero_data
- Photo drag-and-drop zone with preview
```

**Phase 18:**
```
Phase 18: Admin Tab 2 — Projects CRUD.

TabProjectsManager.tsx:
- Table/card list of all 12 projects
- Each row: Title, Tags, Featured toggle, Edit, Delete
- "Add New Project" button
- Add/Edit modal: all project fields
- Featured toggle: instant Firestore update
- CRUD operations with confirmation dialogs
```

**Phase 19:**
```
Phase 19: Admin Tab 3 — Skills, Certs, Workflow, Links.

TabSkillsLinks.tsx with sub-sections:
1. Skills: grouped list, Add/Edit/Delete, name, category, level slider
2. Certifications: list, Add/Edit/Delete, title, issuer, date, URL, badge upload
3. Workflow Steps: ordered list, Add/Edit/Delete/Reorder, title, description, icon, color
4. Social Links: pre-filled form, save button
5. Resume PDF: upload to Storage, update URL
```

**Phase 20:**
```
Phase 20: Admin Tab 4 — Messages Inbox.

TabMessages.tsx:
- Real-time onSnapshot listener on messages collection
- Left panel: message list (newest first)
- Right panel: selected message detail
- Delete button per message
- Empty state: "No messages yet"
- Timestamp formatting
```

**Phase 21:**
```
Phase 21: Create seed script.

src/data/seed.ts with functions:
- seedHeroConfig() — hero_data document
- seedProjects() — 12 project documents from manual
- seedSkills() — 32 skill documents from manual
- seedCertifications() — 3 certification documents
- seedWorkflowSteps() — 4 workflow step documents
- seedProfile() — social_data document
- seedAll() — runs all above

All data from PORTFOLIO-MANUAL.md Sections 5 and 9.
```

**Phase 22:**
```
Phase 22: Root layout + providers + metadata.

src/app/layout.tsx:
- ThemeProvider wrapper
- Toaster (react-hot-toast)
- SEO metadata from Section 9
- Flash-free theme init script in <head>
- Google Fonts: Space Grotesk, Inter, JetBrains Mono

src/app/admin/layout.tsx:
- No Lenis
- Simple admin wrapper
```

**Phase 23:**
```
Phase 23: Final polish.

- Responsive testing (mobile, tablet, desktop)
- Accessibility: ARIA labels, keyboard navigation, semantic HTML
- Error states for all Firebase operations
- Loading states for all async operations
- Verify all terminal commands work
- Verify dark/light mode transitions smoothly
- Verify voice intro plays in Chrome, Edge, Firefox
- Verify GitHub heatmap loads
- Verify radar charts render
- Run: npm run build to check for build errors
- Fix any warnings or errors
```

---

## QUICK START — Copy This as Your Very First Message

```
I'm building a production-ready Vite React portfolio with Firebase backend for Muhammed Fahim M.

I have completed Step 0 (setup checklist). My .env.local is configured with:
- Firebase credentials (all 6 values)
- Admin email/password
- SMTP credentials (Gmail + App Password)

Read PORTFOLIO-MANUAL.md and CLAUDE-AI-INSTRUCTIONS.md completely.

Then start Phase 1:

1. Initialize a Vite React app with JavaScript, Tailwind CSS v4
2. Install dependencies: firebase, next-themes, framer-motion, gsap, @studio-freight/lenis, react-icons, react-hot-toast, chart.js, react-chartjs-2
3. Create the file/folder structure as shown in the manual (Section 3)
4. Generate config files: vite.config.js, postcss.config.js
5. Set up vite.config.js with the Aurora palette (teal + violet HSL variables)
6. Create .env.local with placeholder values (I already have my real .env.local configured)

Do NOT write any components or pages yet — just project scaffolding.
Do NOT overwrite my existing .env.local file.
Show me the structure before proceeding to Phase 2.
```

---

## COLOR PALETTE QUICK REFERENCE

| Token (Light) | Hex | Token (Dark) | Hex |
|---------------|-----|--------------|-----|
| Background | `#f8f9fc` | Background | `#0e0b1a` |
| Surface | `#eef0f6` | Surface | `#1b1530` |
| Text | `#1a1530` | Text | `#f1ecff` |
| Text Secondary | `#6b6889` | Text Secondary | `#9489b8` |
| **Accent (Primary)** | `#3fd0c9` **Teal** | **Accent** | `#3fd0c9` **Teal** |
| **Secondary** | `#a06bff` **Violet** | **Secondary** | `#a06bff` **Violet** |
| Border | `#dfe3ef` | Border | `#2a2440` |

**Font Stack:**
- Headings: `font-display` → Space Grotesk
- Body: `font-sans` → Inter
- Code: `font-mono` → JetBrains Mono

---

## TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| GSAP SplitText not working | GSAP SplitText is a paid plugin. Use a manual character-by-character animation or `gsap.text()` alternative. Check the GSAP docs for free alternatives. |
| Chart.js radar not rendering | Ensure you register components: `import { Radar } from 'react-chartjs-2'; import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js'; ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);` |
| Firebase permission denied | Check Firestore rules are deployed and match the manual |
| GitHub API CORS error | Use the Next.js API route (server-side proxy) as specified |
| Speech synthesis not working | Only works in user-triggered context (button click). Cannot auto-play. |
| Theme flash on load | Ensure the inline script in `<head>` runs before first paint |
| Lenis conflicts with admin | Disable Lenis in admin layout |

# Portfolio — Muhammed Fahim M

A single-page personal portfolio for a **Data Science & Full-Stack Developer** based in Kerala, India.
React 19 + Vite 6 + Tailwind CSS v4 on the front end, with Firebase (Firestore, Authentication,
Storage) used as a headless CMS so the site can be edited without touching code.

- **Live site:** https://muhammedfahim-portfolio.vercel.app/
- **Repo:** https://github.com/muhammedfahim438-ctrl/portfolio

---

## Tech Stack

| Layer | Technology | Declared range | Installed |
|-------|-----------|----------------|-----------|
| UI runtime | React | `^19.0.0` | 19.2.8 |
| DOM renderer | React DOM | `^19.0.0` | 19.2.8 |
| Build tool | Vite | `^6.3.5` | 6.4.3 |
| Vite React plugin | `@vitejs/plugin-react` | `^4.5.2` | 4.7.0 |
| Language | **JavaScript (JSX) — no TypeScript** | — | — |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) | `^4` | 4.3.3 |
| Animation | Framer Motion | `^13.1.1` | 13.1.1 |
| Smooth scroll | Lenis | `^1.3.26` | 1.3.26 |
| Routing | React Router DOM | `^7.6.1` | 7.18.2 |
| Backend / CMS | Firebase — Firestore, Authentication, Storage | `^12.18.0` | 12.18.0 |
| App Check (optional) | `firebase/app-check` (reCAPTCHA v3) — ships inside `firebase` | — | 12.18.0 |
| Icons | react-icons | `^5.7.0` | 5.7.0 |
| Toasts | react-hot-toast | `^2.6.0` | 2.6.0 |
| Linting | ESLint (flat config) + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` | `^10.14.0` | 10.14.0 |

There is **no** GSAP, **no** Chart.js, **no** `react-chartjs-2`, **no** TypeScript, **no** test runner,
and **no** Prettier config in this repository. Fonts (Inter, Space Grotesk, JetBrains Mono,
Instrument Serif) are loaded from Google Fonts in `index.html`.

### Node requirement

`>= 20.19.0` (ESLint 10 requires `^20.19.0 || ^22.13.0 || >=24`).

---

## Features

- Dark/light theme with an inline no-flash script in `index.html` and a persisted `ThemeProvider`
- Animated splash screen with a roulette-word sequence (`site_config/splash_data`)
- Hero with Web Speech API voice intro, availability badge and a crossfading portrait
- Role-based skills tabs driven by the `skills` collection (Firestore) with a static fallback
- Projects section with an overlay, a detail modal and an image/gallery model
- Experience, services, work-process, open-source, "now" log, recognition, certifications,
  testimonials and trusted-by sections — all Firestore-driven
- Contact form writing to Firestore with a honeypot, a minimum fill time, length caps,
  server-side validation and a per-email-per-UTC-day rate limit
- Admin dashboard at `/admin` with **seven** tabs and schema-driven CRUD
- Firebase Storage image uploads from the admin dashboard
- Lenis smooth scrolling, custom cursor, Framer Motion scroll reveals

---

## Routes

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `LandingPage` (`src/App.jsx`) | Eagerly imported; all sections composed in one file |
| `/admin/login` | `src/app/admin/login/page.jsx` | Lazy; e-mail/password sign-in |
| `/admin` | `src/app/admin/page.jsx` | Lazy; wrapped in `AuthGuard` |
| anything else | `NotFound` | No route matches |

`vercel.json` rewrites every non-asset path to `/index.html` so client-side routing works on refresh.
The `/seed` browser route was removed — seeding is now a CLI: `npm run seed`.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env        # Windows PowerShell: copy .env.example .env
#    then fill in the Firebase values from the console (see "Environment Variables")

# 3. Seed Firestore with the starter content
npm run seed

# 4. Start the dev server
npm run dev
```

Open <http://localhost:3000>.

`npm run seed` is a **local Node CLI** (`scripts/seed.mjs`). It loads `src/data/seed.js` through
Vite's SSR module loader, so the `@/` alias and `import.meta.env` both work outside the browser.
It is **idempotent** — existing documents are skipped, so you can re-run it safely.

If `firestore.rules` has been deployed with content writes restricted to signed-in users, set
`SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env` so the seeder can sign in first.
Without them the script still runs, but Firestore will reject the writes with `permission-denied`.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server on **http://localhost:3000** |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint (flat config, no arguments → lints the working directory) |
| `npm run seed` | Seed Firestore from the CLI (`scripts/seed.mjs`) |

There is no `test` script and no `typecheck` script — this is a JavaScript-only project.

---

## Environment Variables

Create a `.env` file in the project root (see `.env.example`).

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_FIREBASE_API_KEY` | yes | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | yes | Auth domain, e.g. `<project-id>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | yes | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | yes | Storage bucket, e.g. `<project-id>.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | yes | Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | yes | Firebase Web app ID |
| `VITE_ADMIN_EMAIL` | yes | E-mail of the single admin account (matches the Auth user you create) |
| `SEED_ADMIN_EMAIL` | for `npm run seed` | Same e-mail; used by the CLI seeder to sign in |
| `SEED_ADMIN_PASSWORD` | for `npm run seed` | Password for that account. **Not** a `VITE_` variable, so it is never bundled into the browser |
| `VITE_FIREBASE_APPCHECK_KEY` | no | reCAPTCHA v3 site key for App Check. Leave empty to skip App Check initialisation |

> **All `VITE_*` variables are inlined into the client bundle.** Never put a secret in one.
> `SEED_ADMIN_PASSWORD` is read from `process.env` by a Node script only, so it never reaches the browser.

`SMTP_EMAIL` / `SMTP_APP_PASSWORD` used to live in `.env` but **nothing in this repository reads
them** (there is no server-side mailer). Delete them and rotate the app password.

---

## Firebase Setup

### 1. Create the project

1. Create a project at <https://console.firebase.google.com>.
2. Enable:
   - **Firestore Database** — create it (production mode).
   - **Authentication** → sign-in method → **Email/Password**.
   - **Storage** — default bucket.
3. Create the admin user: **Authentication → Users → Add user**, using the address you will put in
   `VITE_ADMIN_EMAIL` / `SEED_ADMIN_EMAIL`. This is the only account allowed to write content.
4. Copy your web app config (**Project settings → General → Your apps → Web app**) into `.env`.

### 2. Deploy the rules (both of them)

```bash
firebase login
firebase use --add # or edit .firebaserc
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

`firebase.json` declares both a `firestore` and a `storage` block. `firestore.rules` protects
Firestore (public read, admin-only write, validated public message creation); `storage.rules`
protects Firebase Storage (public read, admin-only write with a 5 MB size cap).

> **Firebase Hosting is not configured.** `firebase.json` has no `hosting` block, so
> `firebase deploy --only hosting` will fail. Deploy the front end to Vercel (below).

### 3. Seed

```bash
npm run seed
```

This writes:

| Target | Contents |
|--------|----------|
| `site_config/hero_data` | `title`, `subtitle`, `voice_text`, `photo_url` |
| `profile/social_data` | `email`, `phone`, `location`, `github`, `linkedin`, `kaggle`, `leetcode`, `resume_pdf_url` |
| `projects` | 12 portfolio projects |
| `skills` | 31 skills (name, category, level, icon) |
| `certifications` | 5 certificates |
| `recognition` | 4 recognition entries |
| `testimonials` | 4 testimonials |
| `trusted_by` | 8 logos/names |

The collections `services`, `work_steps`, `experience`, `open_source`, `now_log` and `marquee` are
**not** seeded — they are edited from the admin dashboard's *Content* tab and each landing section
falls back to static defaults while they are empty.

### 4. (Optional) App Check

App Check (reCAPTCHA v3) is **off by default**. To enable it:

1. In the Firebase console: **App Check → Apps → register your web app** and choose **reCAPTCHA v3**.
2. Put the site key in `VITE_FIREBASE_APPCHECK_KEY`.
3. Register `localhost` and your production domain as authorized domains.
4. Turn on **Enforcement** per product (Authentication / Firestore / Storage) in the console.

Enforcement is a **console toggle**, not a rules change. Note that reCAPTCHA v3 does not run in
Node, so enforcing App Check on Firestore/Authentication will break `npm run seed`.

---

## Admin Dashboard

Go to `/admin/login` and sign in with the admin account.

| Tab | Component | Backed by |
|-----|-----------|-----------|
| Hero & Config | `TabHeroConfig` | `site_config/hero_data` |
| Projects | `TabProjectsManager` | `projects` (custom form + Storage image upload) |
| Content | `TabContent` | `services`, `work_steps`, `experience`, `open_source`, `now_log`, `recognition`, `certifications`, `trusted_by`, `marquee` |
| Settings | `TabSettings` | `site_config/availability_data`, `site_config/portrait_data`, `site_config/splash_data`, `profile/social_data` |
| Skills & Links | `TabSkillsLinks` | `skills`, `certifications`, `profile/social_data` (social links) |
| Testimonials | `TabTestimonials` | `testimonials` |
| Messages | `TabMessages` | `messages` (live `onSnapshot`, newest first) |

The header bar shows a live document count per collection and offers two actions, both behind a
`confirm()` dialog:

- **Cleanup Duplicates** — deletes duplicate documents, keyed on `title`/`name`/`author`.
- **Re-seed Missing** — re-runs the seed logic; existing entries are kept (non-destructive for
  `hero_data` and `social_data`).

> Auth gating is **client-side only**. `AuthGuard` hides the dashboard from signed-out visitors, but
> the real boundary is `firestore.rules` — which restricts every write to the admin account.

---

## Project Structure

```
D:\portfolio
├─ .github\workflows\ci.yml       Lint + build on every push/PR to main
├─ .env.example                   Template for the local .env
├─ AGENTS.md                      Architecture notes for AI agents / contributors
├─ eslint.config.js               ESLint flat config (JS/JSX only)
├─ firebase.json                  Firestore + Storage rules deployment config
├─ firestore.rules                Firestore security rules
├─ firestore.indexes.json         Composite indexes (currently empty)
├─ storage.rules                  Firebase Storage security rules
├─ index.html                     Document shell, fonts, SEO/JSON-LD, theme no-flash script
├─ postcss.config.js              Tailwind v4 PostCSS plugin
├─ vercel.json                    SPA rewrite for Vercel
├─ vite.config.js                 @ alias, manual chunks, dev server on port 3000
├─ scripts\
│  └─ seed.mjs                    CLI seeder (npm run seed)
└─ src\
   ├─ main.jsx                     BrowserRouter → ThemeProvider → App, Toaster, globals.css
   ├─ App.jsx                      Routes + landing section order + Lenis smooth scroll
   ├─ app\
   │  ├─ globals.css               Tailwind v4 import, @theme tokens, .glass, Lenis helpers
   │  └─ admin\
   │     ├─ page.jsx                Admin shell: 7 tabs, collection stats, dedupe, re-seed
   │     └─ login\page.jsx          Email/password sign-in
   ├─ components\
   │  ├─ landing\                  Public sections (one file per section)
   │  │  ├─ SplashScreen.jsx  HeroSection.jsx  MarqueeTicker.jsx  AboutSection.jsx
   │  │  ├─ SkillsTabs.jsx    ExperienceSection.jsx  ServicesSection.jsx
   │  │  ├─ FeaturedProjects.jsx  ProjectOverlay.jsx  ProjectDetailModal.jsx
   │  │  ├─ OpenSourceSection.jsx  CertificationsSection.jsx  RecognitionSection.jsx
   │  │  ├─ NowSection.jsx    TestimonialsSection.jsx  TrustedBySection.jsx
   │  │  ├─ WorkWithMeSection.jsx  ContactFooter.jsx
   │  │  ├─ NotFound.jsx         AnimatedPortrait.jsx  ScenicScene.jsx
   │  ├─ admin\                    Tab components + ConfigEditor + ReusableCrud + ImageUploader
   │  │  ├─ AdminHeader.jsx  AuthGuard.jsx  ConfigEditor.jsx  ReusableCrud.jsx
   │  │  ├─ TabHeroConfig.jsx  TabProjectsManager.jsx  TabContent.jsx  TabSettings.jsx
   │  │  ├─ TabSkillsLinks.jsx  TabTestimonials.jsx  TabMessages.jsx  ImageUploader.jsx
   │  ├─ providers\ThemeProvider.jsx
   │  └─ ui\                       Shared primitives
   │     ├─ Button.jsx  Modal.jsx  ThemeToggle.jsx  SplitText.jsx  ScrambleText.jsx
   │     ├─ CustomCursor.jsx  LoadingSpinner.jsx  MagneticButton.jsx  ResumeModal.jsx
   │     └─ WordHighlight.jsx
   ├─ hooks\
   │  ├─ useAuthGuard.js           Firebase Auth state + redirect
   │  ├─ useTheme.js               Theme context consumer
   │  └─ useSpeech.js              Web Speech API wrapper
   ├─ lib\
   │  ├─ firebase.js               App init (Firebase app singleton only)
   │  ├─ firebaseAuth.js           Firebase Auth handle (admin only)
   │  ├─ firebaseStorage.js        Firebase Storage handle (admin only)
   │  ├─ firestoreDb.js            Firestore handle (admin / seed only)
   │  ├─ firestore.js              The only module that talks to Firestore (lazy-loaded)
   │  ├─ auth.js                   Sign-in / sign-out helpers
   │  ├─ storage.js                Resumable upload / delete helpers
   │  ├─ iconMap.js                ICON_MAP / ICON_KEYS for admin icon pickers
   │  └─ constants.js              Owner contact details, message limits, email regex
   └─ data\
      └─ seed.js                   Seed data + seedAll()
```

### Data model

**Documents**

| Path | Shape |
|------|-------|
| `site_config/hero_data` | `title`, `subtitle`, `voice_text`, `photo_url` |
| `site_config/availability_data` | `available` (bool), `label` |
| `site_config/portrait_data` | `photos` (array of URLs; empty = bundled `/my-picture.*`) |
| `site_config/splash_data` | `words` (array), `final` |
| `profile/social_data` | `email`, `phone`, `location`, `github`, `linkedin`, `kaggle`, `leetcode`, `resume_pdf_url` |
| `messages` | contact submissions — `sender_name`, `sender_email`, `sender_phone`, `reason`, `message_body`, `created_at` |

**Collections** (all documents are `{id, ...data}`):
`projects`, `skills`, `certifications`, `recognition`, `testimonials`, `trusted_by`, `services`,
`work_steps`, `experience`, `open_source`, `now_log`, `marquee`, `messages`.

`firestore.indexes.json` is empty — avoid queries that need a composite index (an equality filter
combined with an `orderBy` on a different field) unless you also add the index.

---

## Deployment

### Vercel (the supported target)

1. Push the repository to GitHub.
2. Import it at <https://vercel.com/new>.
3. Framework preset: **Vite**. Build command `npm run build`. Output directory `dist`.
   (`vercel.json` supplies the SPA rewrite — do not remove it.)
4. Add every `VITE_*` variable from `.env` to **Project Settings → Environment Variables**
   (Production + Preview + Development).
5. Deploy. Vercel builds and serves the app automatically.

### Firebase (rules only)

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

Hosting is **not** configured — there is no `hosting` block in `firebase.json`.

---

## CI

`.github/workflows/ci.yml` runs on every push and pull request targeting `main`:

```bash
npm ci
npm run lint
npm run build
```

`npm ci` requires `package-lock.json` to be in sync with `package.json`. **If you add or remove a
dependency, commit `package.json` and `package-lock.json` in the same commit**, or run
`npm install` first and commit the regenerated lockfile.

---

## Known Limitations

- **Auth gating is client-side.** `AuthGuard` is UX, not security. `firestore.rules` is the boundary.
- **Firestore composite indexes are not configured.** Queries that need one will fail until  `firestore.indexes.json` is updated and redeployed.
- **App Check and the CLI seeder conflict.** reCAPTCHA v3 cannot run in Node.

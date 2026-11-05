# AGENTS.md

Guidance for AI agents and contributors working in this repository.

## What this is

A single-page personal portfolio for **Muhammed Fahim M** (Data Science & Full-Stack Developer, Kerala, India). React 19 + Vite 6 + Tailwind CSS v4, with Firebase (Firestore, Auth, Storage) as a headless CMS.

Two surfaces:

1. **Public landing page** — one long scroll of sections, mostly fed from Firestore.
2. **Admin dashboard** (`/admin`) — schema-driven CRUD so the owner can edit content without code changes.

It is **not** Next.js. The `"use client"` directives at the top of many files are vestigial Next.js leftovers kept for consistency — harmless, do not remove them in bulk.

## Commands

```bash
npm install
npm run dev      # Vite dev server on http://localhost:3000
npm run build    # production build -> dist/
npm run preview  # serve the production build
npm run lint     # eslint (flat config, no args = lints cwd)
```

There is no test runner, no TypeScript, and no Prettier config. Do not invent test commands.

## Project map

```
src/
  main.jsx                     BrowserRouter -> ThemeProvider -> App, Toaster, globals.css
  App.jsx                      Routes + landing section order + Lenis smooth scroll
  app/
    globals.css                Tailwind v4 import, @theme tokens, .glass, lenis styles
    admin/page.jsx             Admin shell: tabs, collection stats, dedupe, re-seed
    admin/login/page.jsx       Email/password sign-in
  pages/SeedPage.jsx           /seed — one-click seedAll()
  components/
    landing/                   Public sections (one file per section)
    admin/                     Tab components + ConfigEditor + ReusableCrud
    ui/                        Button, Modal, ThemeToggle, SplitText, etc.
    providers/ThemeProvider.jsx
  hooks/                       useAuthGuard, useTheme, useSpeech
  lib/                         firebase, firestore, auth, storage, iconMap
  data/seed.js                 Seed data + seedAll()
```

### Routes

| Path           | Component                | Notes                                             |
| -------------- | ------------------------ | ------------------------------------------------- |
| `/`            | `LandingPage` (App.jsx)  | Eager imports, all sections composed in one file   |
| `/admin/login` | `app/admin/login/page`   | Lazy                                               |
| `/admin`       | `app/admin/page`         | Lazy, wrapped in `AuthGuard`                       |
| `/seed`        | `pages/SeedPage`         | Lazy, unauthenticated seed trigger                 |

### Landing composition

Section order lives in `LandingPage` in `src/App.jsx`. To add a section: create `src/components/landing/Foo.jsx`, export a **named** component (`export function Foo`), import it in `App.jsx`, and place it in the JSX. `SplashScreen` and `CustomCursor` sit at the top; `ContactFooter` closes the page.

Smooth scrolling is Lenis, mounted in a `useEffect` in `LandingPage` and exposed as `window.__lenis` (some components call `window.__lenis?.stop()` / `start()` to lock scroll, e.g. modals). Always destroy the instance in the effect cleanup.

## Data layer

`src/lib/firebase.js` exports `db`, `auth`, `storage` singletons, guarded by `getApps()`.

`src/lib/firestore.js` is the only place that should talk to Firestore. Prefer the **generic** helpers for new features; the per-entity wrappers are older duplication:

- `getConfig(key)` / `setConfig(key, data)` → `site_config/{key}` (merge write)
- `getProfile(key)` / `setProfileConfig(key, data)` → `profile/{key}`
- `getCollection(name)` / `addItem` / `updateItem` / `deleteItem` → any collection
- `getCollectionDocs(name)` → same, but maps through a small name allowlist
- `dedupeCollection(name)` → deletes duplicates by `title`/`name`
- `sendMessage`, `subscribeToMessages` (realtime, ordered by `created_at` desc), `deleteMessage`

### Firestore documents

| Document                        | Shape                                                                 |
| ------------------------------- | --------------------------------------------------------------------- |
| `site_config/hero_data`         | `title`, `subtitle`, `voice_text`, `photo_url`                        |
| `site_config/availability_data` | `available` (bool), `label`                                            |
| `site_config/portrait_data`     | `photos` (array of URLs; empty = bundled `/my-picture.*`)              |
| `site_config/splash_data`       | `words` (array), `final`                                               |
| `profile/social_data`           | `email`, `phone`, `location`, `github`, `linkedin`, `resume_pdf_url`   |
| `messages`                      | contact form submissions, `created_at` server timestamp                |

Collections (all `{id, ...data}`): `projects`, `skills`, `certifications`, `recognition`, `testimonials`, `trusted_by`, `services`, `work_steps`, `experience`, `open_source`, `now_log`, `marquee`, `messages`.

`firestore.indexes.json` is empty — avoid queries needing composite indexes (e.g. equality filter + `orderBy` on another field) unless you also add the index.

## Admin dashboard

`src/app/admin/page.jsx` renders seven tabs:

| Tab           | Component             | Backed by                                                    |
| ------------- | --------------------- | ------------------------------------------------------------ |
| Hero & Config | `TabHeroConfig`       | `site_config/hero_data`                                      |
| Projects      | `TabProjectsManager`  | `projects` (custom form + image upload)                      |
| Content       | `TabContent`          | `services`, `work_steps`, `experience`, `open_source`, `now_log`, `recognition`, `certifications`, `trusted_by`, `marquee` |
| Settings      | `TabSettings`         | `availability_data`, `portrait_data`, `splash_data`, `profile/social_data` |
| Skills & Links| `TabSkillsLinks`      | `skills`, `certifications`, social links                     |
| Testimonials  | `TabTestimonials`     | `testimonials`                                               |
| Messages      | `TabMessages`         | `messages` (live `onSnapshot`)                               |

The header bar also shows per-collection counts and offers **Cleanup Duplicates** (`dedupeCollection`) and **Re-seed Missing** (`seedAll`), both guarded by `confirm()`.

### Two reusable admin patterns

- **`ReusableCrud`** — pass `collection`, `schema`, `title`, `emptyItem`, `buildTitle`. Schema field types: `text`, `textarea`, `tags` (comma-separated → array), `lines` (newline-separated → array), `select`, `bool`, `number`. Add a new editable collection by appending an entry to `SECTIONS` in `TabContent.jsx` — no other code needed.
- **`ConfigEditor`** — pass `configKey`, `title`, `schema`, `fallback`, and `profile` for `profile/*` docs. Add a new settings doc by appending a block in `TabSettings.jsx`.

## Styling conventions

Tailwind v4, no `tailwind.config.js`. Design tokens are declared in `src/app/globals.css`:

- `@theme inline` maps CSS vars to utilities: `bg-themeBg`, `text-themeText`, `border-themeBorder`, `bg-themeAccent`, `text-themeAccent`, `bg-themeBg-secondary`, etc.
- `:root` holds the light palette; `.dark` overrides it. Dark is the default (`<html class="dark">`).
- An inline script in `index.html` applies the stored theme before paint to avoid a flash. `ThemeProvider` + `useTheme` toggle `dark`/`light` on `document.documentElement` and persist to `localStorage`.
- Reusable classes: `.glass` (glassmorphism card), plus Lenis helpers.

Rules of thumb:

- **Use theme tokens, never hardcoded hex values** in components. Adding a new color means adding a CSS var in both `:root` and `.dark`, then exposing it in `@theme inline`.
- Fonts: `font-sans` (Inter), `font-display` (Space Grotesk), `font-mono` (JetBrains Mono), `font-accent` (Instrument Serif). Loaded from Google Fonts in `index.html`.
- Animations use `framer-motion`; icons come from `react-icons` (`si` for brands, `fi` for UI). Admin-selectable icons must be registered in `src/lib/iconMap.js` (`ICON_MAP` / `ICON_KEYS`).
- Toasts: `import toast from "react-hot-toast"` — `<Toaster>` is already mounted in `main.jsx`.

## Code conventions

- JavaScript/JSX only. Named exports for components (`export function HeroSection`); pages under `src/app` and `src/pages` use default exports.
- Import via the `@/` alias (`@/components/...`, `@/lib/...`), not long relative paths.
- Every Firestore read in a section is wrapped in `try/catch` with a local fallback constant, so the page still renders when Firebase is unreachable or unseeded. Preserve that pattern.
- Firestore writes from admin components go through `src/lib/firestore.js` and report success/failure with `toast`.
- Keep the existing comment density (sparse) and formatting (2 spaces, double quotes, semicolons).

## Known gotchas

- **Firestore rules are wide open.** `firestore.rules` allows `read, write` for everyone. Auth gating in the app (`AuthGuard` + `useAuthGuard`) is client-side only and is *not* a security boundary — any visitor can write to Firestore directly with the public web config. Tighten the rules before treating the admin area as private.
- **`seedAll()` can fail on `skills`.** `seedNoDuplicates` uses `where(keyField, "in", [...])`, and Firestore caps `in` at 30 values; `seedSkills` currently has 31. Chunk the array (or compare in JS) if you touch this.
- **`VITE_ADMIN_EMAIL` and the `SMTP_*` vars are unused.** They exist in `.env`/README but no code reads them; SMTP has no server component in this repo.
- **README drift.** `README.md` lists files and features that no longer exist (`SkillsBentoGrid`, `WorkflowTimeline`, `useFirestore`, `useAudioVisualizer`, Chart.js/GSAP deps, a `cp .env.example` step with no `.env.example` present). Trust the code over the README.
- **Firebase Hosting is not configured.** `firebase.json` only declares Firestore, so `firebase deploy --only hosting` will fail despite the README instructions. Deployment target is Vercel (`vercel.json` rewrites all non-asset paths to `index.html` for SPA routing).
- **`SkillsTabs` is hardcoded.** The role/skill grid in `src/components/landing/SkillsTabs.jsx` is static and does *not* read the `skills` collection — editing skills in `/admin` will not change that section.
- **Build chunking is manual.** `vite.config.js` splits `react`, `firebase`, `motion`, and `ui` chunks. Keep new heavy dependencies out of the entry chunk; add them to `manualChunks` if they are large.

## Deployment

- **Vercel** — framework preset Vite, build `npm run build`, output `dist`. All `VITE_*` env vars must be set in the project settings (they are baked into the client bundle — never put secrets there).
- **Firebase** — `firebase deploy --only firestore:rules` works; hosting is not configured (see gotchas).

## Before you finish

1. `npm run lint` — no new warnings/errors.
2. `npm run build` — the build must succeed.
3. Manually sanity-check the landing page and `/admin` if you changed data shapes; unseeded Firestore should still render via fallbacks.

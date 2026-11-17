# AGENTS.md

Guidance for AI agents and contributors working in this repository.

## What this is

A single-page personal portfolio for **Muhammed Fahim M**, positioned as a **Data Product Engineer** (Kerala, India) — "I build the part after the notebook." React 19 + Vite 6 + Tailwind CSS v4, with Firebase (Firestore, Auth, Storage) as a headless CMS.

Two surfaces:

1. **Public landing page** — one long scroll of sections, mostly fed from Firestore.
2. **Admin dashboard** (`/admin`) — schema-driven CRUD so the owner can edit content without code changes, including a **Brand Studio** that owns every headline, subhead, CTA and footer line.

It is **not** Next.js. The `"use client"` directives at the top of many files are vestigial Next.js leftovers kept for consistency — harmless, do not remove them in bulk.

## Commands

```bash
npm install
npm run dev      # Vite dev server on http://localhost:3000
npm run build    # production build -> dist/
npm run preview  # serve the production build
npm run lint     # eslint (flat config, no args = lints cwd)
npm run seed     # seed Firestore from the CLI (scripts/seed.mjs)
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
  components/
    landing/                   Public sections (one file per section)
    admin/                     Tab components + ConfigEditor + ReusableCrud
    admin/brand/               BrandForm + BrandPreview + BrandGuideCard
    ui/                        CustomCursor, EntranceReveal, LoadingSpinner,
                               ParallaxLayers, Tilt3D
    providers/
      ThemeProvider.jsx        dark/light class + localStorage
      BrandContentProvider.jsx load 5 brand docs, merge defaults, sync meta
  hooks/                       useAuthGuard, useBrandContent, useTheme, useSpeech
  lib/                         firebase, firestore, auth, storage, iconMap,
                               contentMerge (mergeDeep / getAt / setAt)
  data/
    brandDefaults.js           Every brand string + landing fallback (single source)
    seed.js                    Seed data + seedAll()
scripts/seed.mjs               CLI seeder (npm run seed) — Vite SSR loader
```

### Routes

| Path           | Component                | Notes                                             |
| -------------- | ------------------------ | ------------------------------------------------- |
| `/`            | `LandingPage` (App.jsx)  | Eager imports, all sections composed in one file   |
| `/admin/login` | `app/admin/login/page`   | Lazy                                               |
| `/admin`       | `app/admin/page`         | Lazy, wrapped in `AuthGuard`                       |

The `/seed` browser route was removed. Seeding is now a CLI: `npm run seed`
(`scripts/seed.mjs`), which loads `src/data/seed.js` through Vite's SSR module
loader so the `@/` alias and `import.meta.env` work in Node. `src/pages/SeedPage.jsx`
no longer exists.

### Landing composition

Section order lives in `LandingPage` in `src/App.jsx`: Hero → About → Experience → Stack → Work → Contact (`ContactFooter`). To add a section: create `src/components/landing/Foo.jsx`, export a **named** component (`export function Foo`), import it in `App.jsx`, and place it in the JSX. `SplashScreen` and `CustomCursor` sit at the top; `ContactFooter` closes the page.

The whole tree is wrapped in `BrandContentProvider`. Read copy with `useBrandContent()` — it returns `{ brand, hero, about, sections, footer, sources, ready }`, already merged over `src/data/brandDefaults.js`. Never hardcode a heading, subhead or CTA label in a section; add the key to `brandDefaults.js` and read it from context. The context's default value is the full deck, so a component rendered outside the provider still renders real copy.

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
| `site_config/brand_data`        | `name`, `shortName`, `monogram`, `role`, `tagline`, `brandLine`, `location`, `locationShort`, `metaTitle`, `metaDescription` |
| `site_config/hero_data`         | `eyebrow`, `headline`, `subhead`, `proof` (array), `ctaPrimaryLabel/Href`, `ctaSecondaryLabel/Href`, `footerLine`, `portraitAlt`, `photo_url` |
| `site_config/about_data`        | `label`, `revision`, `display`, `lead`, `paragraphs`, `facts` (`{term,value}`), `stats` (`{value,label}`), `tech`, `coordinates`, `resumeLabel`, `ctaLabel`, `ctaHref` |
| `site_config/sections_data`     | nested `experience`, `skills`, `work`, `contact`; each `{label, heading, subhead}` plus its CTA/success copy |
| `site_config/footer_data`       | `copyright`, `brandLine`, `credit`, `nav` (`{label,href}`), `splashFinal` |
| `site_config/availability_data` | `available` (bool), `label`                                            |
| `site_config/portrait_data`     | `photos` (array of URLs; empty = bundled `/portrait.svg`)               |
| `site_config/splash_data`       | `words` (array), `final`                                               |
| `profile/social_data`           | `email`, `phone`, `location`, `github`, `linkedin`, `resume_pdf_url`   |
| `messages`                      | contact form submissions, `created_at` server timestamp                |

Collections (all `{id, ...data}`): `projects`, `skills`, `certifications`, `recognition`, `testimonials`, `trusted_by`, `services`, `work_steps`, `experience`, `open_source`, `now_log`, `marquee`, `messages`.

`firestore.indexes.json` is empty — avoid queries needing composite indexes (e.g. equality filter + `orderBy` on another field) unless you also add the index.

## Admin dashboard

`src/app/admin/page.jsx` renders seven tabs:

| Tab           | Component             | Backed by                                                    |
| ------------- | --------------------- | ------------------------------------------------------------ |
| Brand Studio  | `TabBrandStudio`      | `brand_data`, `hero_data`, `about_data`, `sections_data`, `footer_data`, `splash_data` |
| Projects      | `TabProjectsManager`  | `projects` (custom form + image upload)                      |
| Content       | `TabContent`          | `services`, `work_steps`, `experience`, `open_source`, `now_log`, `recognition`, `certifications`, `trusted_by`, `marquee` |
| Settings      | `TabSettings`         | `availability_data`, `portrait_data`, `splash_data`, `profile/social_data` |
| Skills & Links| `TabSkillsLinks`      | `skills`, `certifications`, social links                     |
| Testimonials  | `TabTestimonials`     | `testimonials`                                               |
| Messages      | `TabMessages`         | `messages` (live `onSnapshot`)                               |

Brand Studio has nine sub-tabs (Identity, Hero, About, Experience, Stack, Work, Contact, Footer & Splash, SEO). All of them are built on `BrandForm`, which saves with `setConfig(..., { merge: true })`. The Experience and Stack/Work/Contact sub-tabs pass a `path` (`experience`, `skills`, …) so each save writes only its branch of `sections_data`.

The header bar also shows per-collection counts and offers **Cleanup Duplicates** (`dedupeCollection`) and **Re-seed Missing** (`seedAll`), both guarded by `confirm()`.

### Three reusable admin patterns

- **`ReusableCrud`** — pass `collection`, `schema`, `title`, `emptyItem`, `buildTitle`. Schema field types: `text`, `textarea`, `tags` (comma-separated → array), `lines` (newline-separated → array), `select`, `bool`, `number`. Add a new editable collection by appending an entry to `SECTIONS` in `TabContent.jsx` — no other code needed.
- **`ConfigEditor`** — pass `configKey`, `title`, `schema`, `fallback`, and `profile` for `profile/*` docs. Add a new settings doc by appending a block in `TabSettings.jsx`.
- **`BrandForm`** — pass `configKey`, `title`, `desc`, `schema`, `defaults`, plus an optional `path` to edit one branch of a nested document and an optional render-prop child for a live preview. Field types: `text`, `textarea`, `lines`, `tags`, `pairs` (array of two-field rows), `bool`, `number` (plus `max` for a character counter on strings). It loads, merges over `defaults`, saves with `setConfig(..., { merge: true })`, and offers **Load brand defaults** (fills the form only — Save publishes).

## Styling conventions

Tailwind v4, no `tailwind.config.js`. Design tokens are declared in `src/app/globals.css`:

- `@theme inline` maps CSS vars to utilities: `bg-themeBg`, `text-themeText`, `border-themeBorder`, `bg-themeAccent`, `text-themeAccent`, `bg-themeBg-secondary`, etc.
- `:root` holds the light palette; `.dark` overrides it. Dark is the default (`<html class="dark">`).
- An inline script in `index.html` applies the stored theme before paint to avoid a flash. `ThemeProvider` + `useTheme` toggle `dark`/`light` on `document.documentElement` and persist to `localStorage`.
- Reusable classes: `.glass` (glassmorphism card), plus Lenis helpers.

Rules of thumb:

- **Use theme tokens, never hardcoded hex values** in components. Adding a new color means adding a CSS var in both `:root` and `.dark`, then exposing it in `@theme inline`.
- Fonts: `font-display` (NDot55), `font-subhead` (Ntype82), `font-mono` (Lettera Mono LL). Served from `public/fonts/*.woff2` via `@font-face` in `globals.css` with system fallbacks until the files are added.
- Animations use `framer-motion`; icons come from `react-icons` (`si` for brands, `fi` for UI). Admin-selectable icons must be registered in `src/lib/iconMap.js` (`ICON_MAP` / `ICON_KEYS`).
- Toasts: `import toast from "react-hot-toast"` — `<Toaster>` is already mounted in `main.jsx`.

### Units — one rule, no exceptions

| Concern | Unit | In practice |
| ------- | ---- | ----------- |
| Type | `rem` | Every `font-size`, `text-*`, `tracking-*`, `leading-*`. Never `text-[10px]` — write `text-[0.625rem]` or a theme size. Root font size stays at the browser default, so the whole page scales with the user's zoom/text settings. |
| Layout | `%` | Section widths, grids, flex tracks, media, table columns. A block fills its parent (`w-full` + `max-w-*` in `rem`); it never sizes itself with a fixed pixel width. Container caps are `rem` (`max-w-6xl`, `max-w-[75rem]`), not `[1200px]`. |
| Full-screen sections | viewport | `min-h-dvh` for a full first screen, `dvh` over `vh` so mobile browser chrome doesn't clip. Width stays `w-full` inside the `overflow-x-hidden` main — `100vw` includes the scrollbar and produces a horizontal scrollbar. |
| Borders, shadows, hairlines | `px` | `border`, `border-2`, `border-4`, `outline`, the offset `shadow-[4px_4px_0_0_...]`, and `translate-[Npx]` nudges. These are optical details, not layout: they must stay hairline-crisp regardless of root font size. |

Practical checks before finishing:

- `grep "text-\[[0-9.]+px\]"` must return nothing.
- `grep "min-h-screen"` must return nothing — use `min-h-dvh`.
- Arbitrary widths/heights (`max-w-`, `h-`, `w-`, `grid-cols-`) use `rem` or `%`, never `px`.
- `perspective` and transform distances are the one exception: they are 3D scalars and may stay in `px`.

## Code conventions

- JavaScript/JSX only. Named exports for components (`export function HeroSection`); pages under `src/app` and `src/pages` use default exports.
- Import via the `@/` alias (`@/components/...`, `@/lib/...`), not long relative paths.
- Every Firestore read in a section is wrapped in `try/catch` with a local fallback constant, so the page still renders when Firebase is unreachable or unseeded. Preserve that pattern.
- Firestore writes from admin components go through `src/lib/firestore.js` and report success/failure with `toast`.
- Keep the existing comment density (sparse) and formatting (2 spaces, double quotes, semicolons).

### Editorial rules for copy

The brand is built on verifiable proof. Any new string in `brandDefaults.js` or a seed file must obey:

- **Numbers must be traceable to a shipped system.** 619,246 village records, 7 Power BI dashboards, 15 public repositories, 2 internships (2026). No years-of-experience, project-count or award claims that cannot be named.
- **No CGPA, no college name, no marks.** Education appears once as `B.Sc Computer Science (Data Science) · 2024–2027` in the Experience footer. Do not imply the degree is complete.
- **No hackathons.** The VitaSense build was a college team project, not a hackathon entry.
- **No invented testimonials.** Real quotes need a named person and consent.
- **No hype vocabulary.** "Passionate", "innovative", "cutting-edge", "synergy", "rockstar" are banned. Lead with the system that shipped.

## Known gotchas

- **Firestore rules are the real security boundary.** `firestore.rules` allows public reads of content, restricts every content write to the admin account (`isAdmin()` → `request.auth.token.email == <admin email>`), and allows the public to `create` `messages` only when the payload passes validation (field whitelist, email regex, length caps, `created_at` within ±60 s of `request.time`, and a per-email-per-UTC-day document id). `storage.rules` mirrors this for Firebase Storage. The admin e-mail is a **literal in `firestore.rules`** because Security Rules cannot import JavaScript — keep it in sync with `ADMIN_EMAIL` in `src/lib/constants.js`. Auth gating in the app (`AuthGuard` + `useAuthGuard`) is client-side UX only.
- **App Check is opt-in.** `initializeAppCheck` only runs when `VITE_FIREBASE_APPCHECK_KEY` is set. Enforcement is a console toggle (App Check → Apps → your web app → Enforcement), not a rules change. reCAPTCHA v3 does not run in Node, so enabling enforcement on Firestore/Auth breaks `npm run seed`.
- **`npm run seed` needs credentials under locked rules.** Set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env` (not `VITE_`-prefixed, so they are never bundled) so the CLI can sign in before writing. Without them the script still runs but Firestore returns `permission-denied`.
- **Seeding compares in JavaScript, not in Firestore.** `seedNoDuplicates` used to issue `where(keyField, "in", [...])`, which Firestore caps at 30 values while `seedSkills` has 31 — that query threw. It now reads the collection and compares in JS, so any count works.
- **`seedAll()` is non-destructive, at field level.** `seedConfigMissing` reads each config document and writes only keys that are absent, so re-seeding adds new Brand Studio fields without overwriting edited copy. `seedProfile` still uses `{merge: true}`.
- **`seedAll()` does not seed five collections.** `services`, `work_steps`, `open_source`, `now_log` and `marquee` are admin-only; their landing sections fall back to static defaults while the collections are empty. `experience` **is** seeded (`DEFAULT_EXPERIENCE` in `brandDefaults.js`).
- **Testimonials are not seeded.** The old invented quotes were removed. `TabTestimonials` still works; nothing renders until a real, consented quote is added.
- **Brand copy has two sources.** `src/data/brandDefaults.js` is the fallback and the file `index.html` JSON-LD mirrors; Firestore (`brand_data`, `hero_data`, `about_data`, `sections_data`, `footer_data`) is the live copy. Editing the SEO fields in the admin updates the tab title and `meta[name=description]`, but Open Graph/Twitter cards are read from `index.html` by crawlers and only change on redeploy.
- **`VITE_ADMIN_EMAIL` and the `SMTP_*` vars are unused.** They exist in `.env`/README but no code reads them; SMTP has no server component in this repo.
- **README is descriptive, not authoritative.** Component filenames and data shapes change faster than the prose. Verify against `src/` before trusting a path.
- **Firebase Hosting is not configured.** `firebase.json` only declares Firestore, so `firebase deploy --only hosting` will fail despite the README instructions. Deployment target is Vercel (`vercel.json` rewrites all non-asset paths to `index.html` for SPA routing).
- **`SkillsTabs` reads Firestore.** `src/components/landing/SkillsTabs.jsx` calls `getCollection("skills")` and groups the results into the four roles via the `CATEGORY_ROLE` map (`Programming`/`Data Analysis` → Data Scientist, `Backend`/`Database` → Backend Builder, `Frontend` → Frontend Crafter, `AI / ML`/`Tools & DevOps` → ML Engineer). It falls back to the static `FALLBACK_ROLES` list when the collection is empty or unreachable. Editing skills in `/admin` **does** change that section. A skill whose `category` is not in `CATEGORY_ROLE` falls back to the Data Scientist role.
- **Build chunking is manual.** `vite.config.js` splits `react`, `firebase`, `motion`, and `ui` chunks. Keep new heavy dependencies out of the entry chunk; add them to `manualChunks` if they are large.

## Deployment

- **Vercel** — framework preset Vite, build `npm run build`, output `dist`. All `VITE_*` env vars must be set in the project settings (they are baked into the client bundle — never put secrets there).
- **Firebase** — `firebase deploy --only firestore:rules` works; hosting is not configured (see gotchas).

## Before you finish

1. `npm run lint` — no new warnings/errors.
2. `npm run build` — the build must succeed.
3. `npm ci --dry-run` — must print "up to date" (lockfile in sync with package.json).
4. Manually sanity-check the landing page and `/admin` if you changed data shapes; unseeded Firestore should still render via fallbacks.
5. If you changed `firestore.rules` or `storage.rules`, test them in the console **Rules Simulator** before deploying — a rule that fails to compile blocks every read and write.

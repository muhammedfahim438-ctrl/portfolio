# Portfolio — Muhammed Fahim M

A modern, interactive portfolio website for a Data Science & Full-Stack Developer from Kerala, India. Built with React 19, Tailwind CSS v4, and Firebase.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19, Vite 6 |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion, GSAP |
| Routing | React Router DOM v7 |
| Backend | Firebase (Firestore, Auth, Storage) |
| Charts | Chart.js, react-chartjs-2 |
| Icons | react-icons |
| Notifications | react-hot-toast |
| Fonts | Space Grotesk, Inter, JetBrains Mono |

## Features

- Aurora color palette with dark/light mode toggle
- Animated splash screen with loading sequence
- Hero section with voice intro via Web Speech API
- Interactive terminal widget with easter eggs
- Skills displayed in a bento grid layout
- Workflow timeline with scroll animations
- Featured projects with overlay details
- GitHub contribution heatmap (live from GitHub API)
- Certifications showcase
- Contact form that writes to Firestore
- Admin dashboard with 4 management tabs:
  - Hero Config — update hero text, photo, and voice intro
  - Projects Manager — full CRUD for portfolio projects
  - Skills, Certifications & Links — manage skills and social links
  - Messages — view contact form submissions
- Auth-guarded admin routes
- Custom theme provider with system preference detection

## Prerequisites

- Node.js 18+
- npm
- A Firebase project (Firestore, Authentication, Storage enabled)

## Quick Start

```bash
git clone https://github.com/muhammedfahim438-ctrl/portfolio.git
cd portfolio
npm install
```

Copy the environment file and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Seed the Firestore database:

```bash
npm run dev
```

Then visit `http://localhost:3000/seed` and click the seed button to populate your database.

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000` to view the site.

## Project Structure

```
src/
  main.jsx                     Entry point
  App.jsx                      Route definitions
  app/
    globals.css                Tailwind + Aurora theme
    admin/
      page.jsx                 Admin dashboard with tabs
      login/page.jsx           Login form
  pages/
    SeedPage.jsx               Seed Firestore data
  components/
    landing/                   Public-facing sections
      SplashScreen.jsx
      HeroSection.jsx
      TerminalWidget.jsx
      SkillsBentoGrid.jsx
      WorkflowTimeline.jsx
      FeaturedProjects.jsx
      ProjectOverlay.jsx
      CertificationsSection.jsx
      GitHubHeatmap.jsx
      ContactFooter.jsx
    admin/                     Admin dashboard components
      AdminHeader.jsx
      AuthGuard.jsx
      TabHeroConfig.jsx
      TabProjectsManager.jsx
      TabSkillsLinks.jsx
      TabMessages.jsx
    ui/                        Shared UI primitives
      Button.jsx
      GlassCard.jsx
      LoadingSpinner.jsx
      Modal.jsx
      ThemeToggle.jsx
    providers/
      ThemeProvider.jsx        Custom React context for theme
  hooks/
    useTheme.js
    useAuthGuard.js
    useSpeech.js
    useAudioVisualizer.js
    useFirestore.js
  lib/
    firebase.js                Firebase app init
    auth.js                    Firebase Auth helpers
    firestore.js               Firestore CRUD helpers
    storage.js                 Firebase Storage helpers
  data/
    seed.js                    All portfolio seed data
```

## Firebase Setup

1. Create a new project at [Firebase Console](https://console.firebase.google.com).

2. Enable the following services:
   - **Firestore Database** — create in production mode
   - **Authentication** — enable Email/Password provider
   - **Storage** — enable for file uploads

3. Create an admin user in Authentication > Users with the email you set as `VITE_ADMIN_EMAIL`.

4. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

5. Seed your database by visiting `/seed` in the browser and clicking the seed button. This populates:
   - `site_config/hero_data` — hero section content
   - `projects` — portfolio projects
   - `skills` — skill entries
   - `certifications` — certificates
   - `social_links` — social media links

## Admin Dashboard

Navigate to `/admin/login` and sign in with the admin credentials.

The dashboard provides four tabs:

| Tab | Description |
|-----|-------------|
| Hero Config | Edit hero title, subtitle, voice intro text, and profile photo URL |
| Projects | Create, read, update, and delete portfolio projects |
| Skills, Certs & Links | Manage skills, certifications, and social links |
| Messages | Read contact form submissions from Firestore |

## Deployment

### Vercel

1. Push the repository to GitHub.

2. Import the project on [Vercel](https://vercel.com/new).

3. Set the framework preset to **Vite**.

4. Add all environment variables from your `.env` file to the Vercel project settings.

5. Deploy. Vercel will build and serve the app automatically.

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Environment Variables

Create a `.env` file in the project root:

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain (`<project>.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Cloud Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_ADMIN_EMAIL` | Email of the admin user for auth guard checks |

All `VITE_` prefixed variables are exposed to the client bundle. Do not put secrets in these variables. The admin email is used client-side to restrict dashboard access.

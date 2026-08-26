# MUHAMMED FAHIM M — Portfolio & CMS Admin Dashboard

## Complete Build Specification & Content Manual

---

## PREREQUISITES

Before building, complete the setup checklist in `CLAUDE-AI-INSTRUCTIONS.md` (STEP 0).

**You need before starting:**
1. **Firebase project** with Firestore, Auth (Email/Password), and Storage enabled
2. **Firebase config values** (6 items: API key, auth domain, project ID, storage bucket, sender ID, app ID)
3. **Admin email/password** for Firebase Auth (used to login to `/admin` dashboard)
4. **Gmail App Password** (16-char, for SMTP email notifications on contact form submissions)
5. **Vercel account** connected to GitHub (for hosting/deployment)

**Already provided:**
- Resume PDF: `Muhammed Fahim M - Resumeogg.pdf` (in project root)
- Hero image: Placeholder (upload later via admin dashboard)
- GitHub: `github.com/muhammedfahim438-ctrl`
- LinkedIn: `linkedin.com/in/muhammed-fahim-m`

See `CLAUDE-AI-INSTRUCTIONS.md` → "STEP 0: SETUP CHECKLIST" for detailed instructions on obtaining each credential.

---

## COLOR PALETTE — "AURORA" (Research-Backed)

**Why this palette:** Your profile is Data Science + Full-Stack. Research shows Data/ML developers should use "Deep Blues, Slate, Teal" palettes. The Aurora palette uses **teal primary** (signals data precision + technical skill) with **violet accent** (signals creativity) over deep near-black. It avoids the generic zinc-950 + indigo that AI tools default to in 2026.

**Fonts:** Space Grotesk (headings) + Inter (body) + JetBrains Mono (code/terminal)

| Role | Light Mode | Dark Mode | Tailwind Token |
|------|-----------|-----------|----------------|
| Background (60%) | `#f8f9fc` cool off-white | `#0e0b1a` deep indigo-black | `themeBg` |
| Surface (30%) | `#eef0f6` soft lavender-gray | `#1b1530` deep violet-surface | `themeSurface` |
| Text Primary | `#1a1530` near-black violet | `#f1ecff` warm white | `themeText` |
| Text Secondary | `#6b6889` muted lavender | `#9489b8` soft purple-gray | `themeTextSecondary` |
| **Primary (Accent)** | `#3fd0c9` **Teal** | `#3fd0c9` **Teal** | `themeAccent` |
| Primary Hover | `#2fb8b1` deeper teal | `#5de0da` lighter teal | `themeAccentHover` |
| Secondary Accent | `#a06bff` **Violet** | `#a06bff` **Violet** | `themeSecondary` |
| Border | `#dfe3ef` light lavender | `#2a2440` dark violet-border | `themeBorder` |
| Card / Glass | `rgba(255,255,255,0.7)` | `rgba(27,21,48,0.6)` | `themeCard` |
| Gradient Start | `#3fd0c9` Teal | `#3fd0c9` Teal | `themeGradientStart` |
| Gradient End | `#a06bff` Violet | `#a06bff` Violet | `themeGradientEnd` |
| Heatmap Scale | `#ebedf0` → `#9be9a8` → `#40c463` | `#161b22` → `#0e4429` → `#39d353` | `themeHeatmap0-4` |

**Contrast Ratios (WCAG AA):**
- Dark mode text on background: `#f1ecff` on `#0e0b1a` = **15.8:1** (passes AAA)
- Dark mode accent on background: `#3fd0c9` on `#0e0b1a` = **9.2:1** (passes AAA)
- Light mode text on background: `#1a1530` on `#f8f9fc` = **14.6:1** (passes AAA)
- Light mode accent on background: `#2fb8b1` on `#f8f9fc` = **8.1:1** (passes AAA)

---

## TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project File Structure](#3-project-file-structure)
4. [Firebase Setup & Configuration](#4-firebase-setup--configuration)
5. [Firestore Database Schema](#5-firestore-database-schema)
6. [Theme System (CSS Variables & Dark/Light Mode)](#6-theme-system)
7. [Landing Page — Full Specification](#7-landing-page)
8. [Admin Dashboard — Full Specification](#8-admin-dashboard)
9. [All Portfolio Content (Pre-Filled Data)](#9-portfolio-content)
10. [Component Specifications](#10-component-specifications)
11. [Hooks & Utilities](#11-hooks--utilities)
12. [Seed Script Data](#12-seed-script-data)
13. [Deployment Notes](#13-deployment-notes)

---

## 1. PROJECT OVERVIEW

Build a **production-ready React (Vite) portfolio website + full CMS admin dashboard** with Firebase backend for **Muhammed Fahim M** — a Data Science & Full-Stack Developer from Palakkad, Kerala.

**Core Features:**
- Animated intro splash screen with GSAP SVG staggered write-up + silhouette reveal
- Hero section with silhouette duotone blend + CSS gradient mask + 1-line voice intro + canvas equalizer
- Floating social dock with glassmorphic resume modal
- Interactive terminal widget with full simulation + easter eggs
- Dynamic skills bento grid with Chart.js radar/spider charts
- Admin-configurable workflow timeline (4-step data pipeline)
- Featured projects (top 3) with fullscreen overlay + category filters
- Certifications section with badge cards + verification modals
- Live GitHub contribution heatmap (GitHub Public Events API)
- Contact form writing directly to Firestore
- Protected admin dashboard with 4 CRUD tabs
- Dynamic dark/light mode via CSS custom properties (Aurora palette)
- Lenis smooth scrolling throughout

---

## 2. TECH STACK & DEPENDENCIES

### Core
- **Vite 6+** (Build tool)
- **React 19+**

### Styling
- **Tailwind CSS v4** (CSS-based config via `@theme inline` in `globals.css`)
- **CSS Custom Properties** (Aurora palette — NO hardcoded hex in components)
- **Framer Motion 11+** for page transitions, overlays, micro-interactions
- **Lenis** for smooth scrolling

### Animations
- **GSAP 3+** (ScrollTrigger, SplitText for staggered text)
- **Framer Motion** for React-integrated animations

### Charts
- **Chart.js 4+** + **react-chartjs-2** for radar/spider charts

### Backend
- **Firebase 10+**
  - Firestore Database
  - Firebase Auth (email/password)
  - Firebase Storage (images, PDF resume)

### Utilities
- **Web Speech API** (`window.speechSynthesis`) for voice intro
- **HTML5 Canvas** for audio waveform/equalizer visualizer
- **GitHub Public Events API** for contribution heatmap
- **Zero paid APIs**

### Full Dependencies
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.6.1",
    "firebase": "^12.18.0",
    "framer-motion": "^13.1.1",
    "gsap": "^3.15.0",
    "chart.js": "^4.5.1",
    "react-chartjs-2": "^5.3.1",
    "react-hot-toast": "^2.6.0",
    "react-icons": "^5.7.0"
  },
  "devDependencies": {
    "vite": "^6.3.5",
    "@vitejs/plugin-react": "^4.5.2",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4"
  }
}
```

---

## 3. PROJECT FILE STRUCTURE

```
portfolio/
├── public/
│   ├── images/
│   │   ├── silhouette.png              # Hero silhouette photo
│   │   ├── favicon.ico
│   │   └── og-image.png
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── landing/
│   │   │   ├── SplashScreen.jsx        # GSAP animated intro
│   │   │   ├── HeroSection.jsx         # Hero + floating dock + resume modal
│   │   │   ├── TerminalWidget.jsx      # Interactive CLI simulation
│   │   │   ├── SkillsBentoGrid.jsx     # Skills grid + Chart.js radar charts
│   │   │   ├── WorkflowTimeline.jsx    # 4-step pipeline (admin-configurable)
│   │   │   ├── FeaturedProjects.jsx    # Top 3 featured projects
│   │   │   ├── ProjectOverlay.jsx      # Fullscreen all-projects overlay
│   │   │   ├── CertificationsSection.jsx # Badge cards + verification modals
│   │   │   ├── GitHubHeatmap.jsx       # Live contribution heatmap
│   │   │   └── ContactFooter.jsx       # Contact form + footer + theme switcher
│   │   ├── admin/
│   │   │   ├── AuthGuard.jsx           # Firebase auth protection
│   │   │   ├── AdminHeader.jsx         # Admin header with sign out
│   │   │   ├── TabHeroConfig.jsx       # Tab 1: Hero config editor
│   │   │   ├── TabProjectsManager.jsx  # Tab 2: Projects CRUD
│   │   │   ├── TabSkillsLinks.jsx      # Tab 3: Skills, Certs, Workflow, Links
│   │   │   └── TabMessages.jsx         # Tab 4: Messages inbox
│   │   ├── ui/
│   │   │   ├── ThemeToggle.jsx         # Dark/Light mode toggle
│   │   │   ├── GlassCard.jsx           # Reusable glassmorphic card
│   │   │   ├── AnimatedText.jsx        # GSAP text reveal wrapper
│   │   │   ├── Button.jsx              # Themed button component
│   │   │   ├── Modal.jsx               # Reusable modal
│   │   │   └── LoadingSpinner.jsx      # Loading state
│   │   └── providers/
│   │       └── ThemeProvider.jsx        # Theme provider wrapper
│   ├── pages/
│   │   ├── App.jsx                     # Main app with router
│   │   ├── Landing.jsx                 # Landing page (all sections)
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx         # Admin layout (no Lenis, auth gate)
│   │   │   ├── AdminDashboard.jsx      # Admin dashboard (4-tab interface)
│   │   │   └── AdminLogin.jsx          # Admin login page
│   │   └── api/
│   │       └── github-contributions.js # GitHub API proxy for heatmap
│   ├── hooks/
│   │   ├── useTheme.js                 # Theme toggle hook
│   │   ├── useAuthGuard.js             # Firebase auth hook
│   │   ├── useFirestore.js             # Firestore CRUD operations
│   │   ├── useSpeech.js                # Web Speech API hook
│   │   ├── useAudioVisualizer.js       # Canvas waveform hook
│   │   └── useTerminal.js              # Terminal command processor
│   ├── lib/
│   │   ├── firebase.js                 # Firebase app init
│   │   ├── firestore.js                # Firestore service functions
│   │   ├── storage.js                  # Firebase Storage functions
│   │   └── auth.js                     # Firebase Auth functions
│   ├── styles/
│   │   └── globals.css                 # Aurora CSS Variables + Tailwind v4 @theme
│   ├── data/
│   │   └── seed.js                     # Seed data for Firestore population
│   └── main.jsx                        # App entry point
├── vite.config.js
├── postcss.config.js
├── index.html                          # HTML entry point
├── .env.local                          # Firebase config env vars
└── package.json
```

---

## 4. FIREBASE SETUP & CONFIGURATION

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project" → Name: `muhammed-fahim-portfolio`
3. Enable Google Analytics (optional) → Create

### Step 2: Enable Services
1. **Firestore Database**: Create database → Start in production mode → Region: asia-south1 (India)
2. **Authentication**: Sign-in method → Enable "Email/Password"
3. **Storage**: Get started → Production mode → Same region as Firestore

### Step 3: Create Admin User
1. Authentication → Users tab → Add user
2. Email: `muhammedfahim438@gmail.com`
3. Password: (set a strong password — never commit this)

### Step 4: Get Config
1. Project Settings → General → Your apps → Add web app
2. Register: `portfolio-web`
3. Copy the `firebaseConfig` object

### Step 5: Environment Variables (.env.local)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Firebase Config (`src/lib/firebase.ts`)
```typescript
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

### Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site_config/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /projects/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /skills/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /certifications/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /workflow_steps/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /profile/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /messages/{document} {
      allow create: if true;
      allow read, delete: if request.auth != null;
    }
  }
}
```

---

## 5. FIRESTORE DATABASE SCHEMA

### Collection: `site_config`
**Document ID: `hero_data`**
```json
{
  "title": "Hi, I'm Muhammed Fahim M",
  "subtitle": "Data Science & Full-Stack Developer",
  "voice_text": "Hi! I'm Muhammed Fahim M, a Data Science and Full-Stack Developer from Kerala, India. I build production APIs, ML models, and scalable web apps. Let's connect!",
  "photo_url": ""
}
```

### Collection: `projects`
```json
[
  {
    "title": "India Geo API - Village-Level Geographic Data Platform",
    "description": "Built a production-grade SaaS REST API platform serving India's village-level geographic data, parsing 619,000+ villages from Census XLS files into a NeonDB PostgreSQL database. Implemented Redis caching, JWT + API key authentication, tiered rate limiting, and Razorpay subscription payments.",
    "image_url": "",
    "live_url": "https://geo-api-blond.vercel.app",
    "github_url": "https://github.com/muhammedfahim438-ctrl/geo-api",
    "featured": true,
    "tags": ["Next.js", "NeonDB", "Redis", "Razorpay", "JWT", "TypeScript", "SaaS"]
  },
  {
    "title": "VitaSense AI - Diabetes Prediction Platform",
    "description": "Achieved 98.2% accuracy (ROC-AUC 0.9975) using a Random Forest + Gradient Boosting voting ensemble trained on 5,000 patient records with SMOTE-based class balancing. Built a Flask REST API and web app delivering real-time risk prediction, an educational chatbot, and an analytics dashboard.",
    "image_url": "",
    "live_url": "",
    "github_url": "https://github.com/muhammedfahim438-ctrl/VitaSense-AI-v2",
    "featured": true,
    "tags": ["Python", "Flask", "Scikit-learn", "Random Forest", "SMOTE", "Machine Learning"]
  },
  {
    "title": "UniPath - College Counselling & Wellness App",
    "description": "Built a cross-platform Flutter mobile app for student counselling and wellness services with phone/email OTP authentication, appointment booking, a learning-style assessment quiz, and an AI-powered chatbot. Developed an admin analytics dashboard with CSV report generation.",
    "image_url": "",
    "live_url": "https://unipath-woad.vercel.app",
    "github_url": "https://github.com/muhammedfahim438-ctrl/unipath",
    "featured": true,
    "tags": ["Flutter", "Firebase", "AI Chatbot", "Dart", "Mobile App"]
  },
  {
    "title": "Nifty 100 Financial Intelligence Platform",
    "description": "Built a Nifty 100 Financial Intelligence Platform with a Python ETL pipeline, PostgreSQL database, and Django REST API web app. Cleaned and resolved data quality issues across 7 real-world Excel datasets. Computed financial metrics (CAGR, Sharpe Ratio, Alpha, Beta) and designed interactive Power BI dashboards.",
    "image_url": "",
    "live_url": "",
    "github_url": "https://github.com/muhammedfahim438-ctrl/nifty100-platform",
    "featured": false,
    "tags": ["Python", "Pandas", "PostgreSQL", "Django REST", "Power BI", "Finance"]
  },
  {
    "title": "Bluestock Mutual Fund Analytics Platform",
    "description": "Mutual Fund Analytics Platform built as a Bluestock Fintech Capstone project. Python ETL pipeline, PostgreSQL database, Django REST API, Power BI dashboards with real-time NAV tracking.",
    "image_url": "",
    "live_url": "",
    "github_url": "https://github.com/muhammedfahim438-ctrl/bluestock-mf-platform",
    "featured": false,
    "tags": ["Python", "Jupyter Notebook", "Django REST", "Power BI", "Finance"]
  },
  {
    "title": "NASC Grievance Portal",
    "description": "Cross-platform mobile application for college grievance management built with Flutter and Dart. Enables students to submit, track, and resolve academic and administrative grievances.",
    "image_url": "",
    "live_url": "",
    "github_url": "https://github.com/muhammedfahim438-ctrl/NASC-grievance-portal",
    "featured": false,
    "tags": ["Flutter", "Dart", "Mobile App"]
  },
  {
    "title": "AI Email Automation (n8n)",
    "description": "AI-powered email automation system using n8n workflow automation, LLaMA 3.1 LLM, and Gmail API for intelligent email processing and automated responses.",
    "image_url": "",
    "live_url": "",
    "github_url": "https://github.com/muhammedfahim438-ctrl/AI-Email-Automation-n8n",
    "featured": false,
    "tags": ["n8n", "LLaMA 3.1", "Gmail API", "Automation"]
  },
  {
    "title": "Aptitude Test Platform",
    "description": "Online aptitude testing platform with Django backend authentication, question banks, timer-based tests, and result analytics.",
    "image_url": "",
    "live_url": "https://aptitude-test-platform-neon.vercel.app",
    "github_url": "https://github.com/muhammedfahim438-ctrl/aptitude-test-platform",
    "featured": false,
    "tags": ["HTML", "Django", "JavaScript", "Education"]
  },
  {
    "title": "Nehru Arts & Science College Website",
    "description": "Responsive college website built with JavaScript frontend featuring department pages, faculty profiles, event calendars, and student portal.",
    "image_url": "",
    "live_url": "",
    "github_url": "https://github.com/muhammedfahim438-ctrl/COLLEGE-WEBSITE",
    "featured": false,
    "tags": ["JavaScript", "HTML", "CSS", "Responsive Design"]
  },
  {
    "title": "Greencycle",
    "description": "Sustainability and green technology project focused on environmental awareness and cycling promotion.",
    "image_url": "",
    "live_url": "",
    "github_url": "https://github.com/muhammedfahim438-ctrl/Greencycle",
    "featured": false,
    "tags": ["Sustainability", "Web App"]
  },
  {
    "title": "GreenPulse AI",
    "description": "AI-powered green technology initiative project.",
    "image_url": "",
    "live_url": "",
    "github_url": "https://github.com/muhammedfahim438-ctrl/GreenPulse-AI",
    "featured": false,
    "tags": ["AI", "HTML"]
  },
  {
    "title": "Django Project",
    "description": "Django web application project demonstrating backend development skills.",
    "image_url": "",
    "live_url": "",
    "github_url": "https://github.com/muhammedfahim438-ctrl/Django_project",
    "featured": false,
    "tags": ["Django", "Python", "HTML"]
  }
]
```

### Collection: `skills`
```json
[
  { "name": "Python", "category": "Programming", "icon_url": "", "level": 90 },
  { "name": "JavaScript", "category": "Programming", "icon_url": "", "level": 80 },
  { "name": "SQL", "category": "Programming", "icon_url": "", "level": 85 },
  { "name": "Dart", "category": "Programming", "icon_url": "", "level": 70 },
  { "name": "Django", "category": "Backend", "icon_url": "", "level": 90 },
  { "name": "Django REST Framework", "category": "Backend", "icon_url": "", "level": 90 },
  { "name": "FastAPI", "category": "Backend", "icon_url": "", "level": 75 },
  { "name": "Flask", "category": "Backend", "icon_url": "", "level": 80 },
  { "name": "REST APIs", "category": "Backend", "icon_url": "", "level": 88 },
  { "name": "React.js", "category": "Frontend", "icon_url": "", "level": 80 },
  { "name": "Next.js", "category": "Frontend", "icon_url": "", "level": 78 },
  { "name": "Flutter", "category": "Frontend", "icon_url": "", "level": 70 },
  { "name": "HTML5 / CSS3", "category": "Frontend", "icon_url": "", "level": 85 },
  { "name": "PostgreSQL", "category": "Database", "icon_url": "", "level": 85 },
  { "name": "MySQL", "category": "Database", "icon_url": "", "level": 80 },
  { "name": "MongoDB", "category": "Database", "icon_url": "", "level": 70 },
  { "name": "SQLite / NeonDB", "category": "Database", "icon_url": "", "level": 75 },
  { "name": "Scikit-learn", "category": "AI / ML", "icon_url": "", "level": 85 },
  { "name": "Random Forest / Gradient Boosting", "category": "AI / ML", "icon_url": "", "level": 88 },
  { "name": "SMOTE / Predictive Modeling", "category": "AI / ML", "icon_url": "", "level": 82 },
  { "name": "EDA", "category": "AI / ML", "icon_url": "", "level": 80 },
  { "name": "Pandas / NumPy", "category": "Data Analysis", "icon_url": "", "level": 88 },
  { "name": "Power BI", "category": "Data Analysis", "icon_url": "", "level": 78 },
  { "name": "Chart.js", "category": "Data Analysis", "icon_url": "", "level": 70 },
  { "name": "JWT Authentication", "category": "Tools & DevOps", "icon_url": "", "level": 85 },
  { "name": "Razorpay Gateway", "category": "Tools & DevOps", "icon_url": "", "level": 80 },
  { "name": "AWS", "category": "Tools & DevOps", "icon_url": "", "level": 65 },
  { "name": "Docker", "category": "Tools & DevOps", "icon_url": "", "level": 70 },
  { "name": "Git / GitHub", "category": "Tools & DevOps", "icon_url": "", "level": 88 },
  { "name": "Vercel", "category": "Tools & DevOps", "icon_url": "", "level": 82 },
  { "name": "Redis", "category": "Tools & DevOps", "icon_url": "", "level": 75 }
]
```

### Collection: `certifications`
```json
[
  {
    "title": "Programming Fundamentals",
    "issuer": "Infosys Springboard",
    "issue_date": "2026",
    "credential_url": "",
    "badge_image_url": ""
  },
  {
    "title": "n8n Workflow Automation",
    "issuer": "n8n",
    "issue_date": "2026",
    "credential_url": "",
    "badge_image_url": ""
  },
  {
    "title": "Linguaskill Certification",
    "issuer": "Cambridge Assessment English",
    "issue_date": "2026",
    "credential_url": "",
    "badge_image_url": ""
  }
]
```

### Collection: `workflow_steps`
```json
[
  {
    "step_number": 1,
    "title": "Data Collection",
    "description": "Gathering raw data from Census XLS files, REST APIs, databases, and web scraping",
    "icon": "database",
    "color": "#3fd0c9"
  },
  {
    "step_number": 2,
    "title": "Data Cleaning & Processing",
    "description": "Resolving duplicates, inconsistent formats, foreign key mismatches across real-world datasets",
    "icon": "filter",
    "color": "#a06bff"
  },
  {
    "step_number": 3,
    "title": "Analysis & Modeling",
    "description": "Computing financial metrics, training ML models with Scikit-learn, SMOTE class balancing",
    "icon": "brain",
    "color": "#3fd0c9"
  },
  {
    "step_number": 4,
    "title": "Visualization & Deployment",
    "description": "Interactive Power BI dashboards, Chart.js visualizations, Vercel deployment",
    "icon": "chart",
    "color": "#a06bff"
  }
]
```

### Collection: `profile`
**Document ID: `social_data`**
```json
{
  "github": "https://github.com/muhammedfahim438-ctrl",
  "linkedin": "https://linkedin.com/in/muhammed-fahim-m",
  "kaggle": "",
  "leetcode": "",
  "email": "muhammedfahim438@gmail.com",
  "phone": "+91 98959 35274",
  "location": "Palakkad, Kerala, India",
  "resume_pdf_url": ""
}
```

### Collection: `messages`
```json
{
  "sender_name": "string",
  "sender_email": "string",
  "message_body": "string",
  "created_at": "timestamp (serverTimestamp())"
}
```

---

## 6. THEME SYSTEM

### globals.css — Aurora Palette
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Aurora Light Mode */
    --themeBg: 230 20% 97%;
    --themeBgSecondary: 230 16% 93%;
    --themeSurface: 230 18% 95%;
    --themeText: 255 50% 14%;
    --themeTextSecondary: 248 12% 50%;
    --themeAccent: 174 58% 62%;
    --themeAccentHover: 174 58% 54%;
    --themeSecondary: 267 87% 68%;
    --themeBorder: 230 20% 90%;
    --themeCard: 230 20% 97%;
    --themeCardAlpha: 0.7;
    --themeGlass: 0.08;
    --themeGlassBorder: 255 30% 85%;
    --themeShadow: 255 30% 50%;
    --themeGradientStart: 174 58% 62%;
    --themeGradientEnd: 267 87% 68%;
    --themeInput: 0 0% 100%;
    --themeWaveform: 174 58% 62%;
    --themeHeatmap0: 220 14% 92%;
    --themeHeatmap1: 152 58% 75%;
    --themeHeatmap2: 142 62% 54%;
    --themeHeatmap3: 142 62% 43%;
    --themeHeatmap4: 155 50% 32%;
    --radius: 0.75rem;
  }

  .dark {
    /* Aurora Dark Mode */
    --themeBg: 255 50% 7%;
    --themeBgSecondary: 255 40% 10%;
    --themeSurface: 255 35% 14%;
    --themeText: 255 60% 94%;
    --themeTextSecondary: 255 15% 60%;
    --themeAccent: 174 58% 62%;
    --themeAccentHover: 174 58% 72%;
    --themeSecondary: 267 87% 72%;
    --themeBorder: 255 30% 18%;
    --themeCard: 255 35% 12%;
    --themeCardAlpha: 0.6;
    --themeGlass: 0.05;
    --themeGlassBorder: 255 20% 22%;
    --themeShadow: 255 50% 3%;
    --themeGradientStart: 174 58% 62%;
    --themeGradientEnd: 267 87% 68%;
    --themeInput: 255 35% 12%;
    --themeWaveform: 174 58% 62%;
    --themeHeatmap0: 255 30% 12%;
    --themeHeatmap1: 155 50% 18%;
    --themeHeatmap2: 145 60% 26%;
    --themeHeatmap3: 145 60% 36%;
    --themeHeatmap4: 150 65% 48%;
  }

  body {
    background-color: hsl(var(--themeBg));
    color: hsl(var(--themeText));
    transition: background-color 0.3s ease, color 0.3s ease;
  }
}

@layer components {
  .glass {
    background: hsl(var(--themeCard) / var(--themeCardAlpha));
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid hsl(var(--themeGlassBorder) / var(--themeGlass));
    box-shadow: 0 8px 32px hsl(var(--themeShadow) / 0.15);
  }

  .text-gradient {
    background: linear-gradient(135deg, hsl(var(--themeGradientStart)), hsl(var(--themeGradientEnd)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

::selection {
  background-color: hsl(var(--themeAccent));
  color: white;
}

html.lenis, html.lenis body { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto !important; }
.lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: hsl(var(--themeBgSecondary)); }
::-webkit-scrollbar-thumb { background: hsl(var(--themeAccent)); border-radius: 3px; }
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        themeBg: "hsl(var(--themeBg))",
        "themeBg-secondary": "hsl(var(--themeBgSecondary))",
        themeSurface: "hsl(var(--themeSurface))",
        themeText: "hsl(var(--themeText))",
        "themeText-secondary": "hsl(var(--themeTextSecondary))",
        themeAccent: "hsl(var(--themeAccent))",
        "themeAccent-hover": "hsl(var(--themeAccentHover))",
        themeSecondary: "hsl(var(--themeSecondary))",
        themeBorder: "hsl(var(--themeBorder))",
        themeCard: "hsl(var(--themeCard))",
        themeInput: "hsl(var(--themeInput))",
      },
      boxShadow: {
        glass: "0 8px 32px hsl(var(--themeShadow) / 0.15)",
      },
      backgroundImage: {
        gradient: "linear-gradient(135deg, hsl(var(--themeGradientStart)), hsl(var(--themeGradientEnd)))",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        glass: "var(--radius)",
      },
    },
  },
  plugins: [],
};

export default config;
```

### ThemeProvider (`src/components/providers/ThemeProvider.tsx`)
```typescript
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

### useTheme Hook (`src/hooks/useTheme.ts`)
```typescript
"use client";
import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const currentTheme = theme === "system" ? systemTheme : theme;
  return { theme: currentTheme, toggleTheme, setTheme };
}
```

### Flash-Free Theme Init (in `layout.tsx` `<head>`)
```html
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        try {
          var theme = localStorage.getItem('theme') || 'dark';
          if (theme === 'system') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          }
          document.documentElement.classList.add(theme);
        } catch(e) {
          document.documentElement.classList.add('dark');
        }
      })();
    `,
  }}
/>
```

---

## 7. LANDING PAGE — FULL SPECIFICATION

### Section Order
```
SplashScreen → HeroSection → TerminalWidget → SkillsBentoGrid → WorkflowTimeline
→ FeaturedProjects → ProjectOverlay → CertificationsSection → GitHubHeatmap → ContactFooter
```

### 7.1 SplashScreen

**Behavior:**
- Full-screen overlay, z-index: 50, background: `hsl(var(--themeBg))`
- GSAP SplitText: "MUHAMMED FAHIM M" letter-by-letter stagger
- Tagline fades in: "Data Science & Full-Stack Developer"
- After 3.5s or user click → slides up and unmounts

**GSAP Timeline:**
```
0s - 0.05s: Letter stagger (opacity 0→1, y: 20→0)
2s: Tagline fade in
3.5s: Container slide up (y: 0 → -100%, opacity: 1 → 0)
4s: Unmount from DOM
```

**Visual:**
- Name: bold, text-5xl md:text-7xl, `.text-gradient` class (teal → violet)
- Subtle pulse glow behind name using `box-shadow` with `themeAccent`

### 7.2 HeroSection

**Layout:** Full viewport (100vh), two-column desktop / single-column mobile

**Left (Text):**
- Title from Firestore `site_config/hero_data.title`
- Subtitle from Firestore `site_config/hero_data.subtitle`
- Typing cursor animation on subtitle
- Small play button: plays `voice_text` with Web Speech API
- CTA Button: "View My Work" → scrolls to projects
- CTA Button: "Contact Me" → scrolls to contact

**Right (Image):**
- Silhouette from Firestore `site_config/hero_data.photo_url`
- CSS mask: `mask-image: linear-gradient(to bottom, black 60%, transparent 100%)`
- Duotone filter: `filter: grayscale(100%) contrast(1.1); mix-blend-mode: multiply;` (light) / `mix-blend-mode: screen;` (dark)

**Floating Social Dock:**
- Glassmorphic pill dock, fixed bottom-center
- Icons: GitHub, LinkedIn, Kaggle, LeetCode (from react-icons)
- On hover: expand with label (Framer Motion spring)
- Framer Motion: spring bounce on mount

**Resume Modal:**
- Glassmorphic modal triggered from dock icon
- Title: "My Resume"
- PDF viewer/download buttons
- Close on X or Escape

**Hero Voice (1-liner):**
- Canvas element (~150px height) next to play button
- When playing: animated teal/violet bars react
- When stopped: bars settle to minimal

### 7.3 TerminalWidget

**Design:**
- Glassmorphic container, max-width: 700px, centered
- Font: `font-mono` (JetBrains Mono)
- Prompt: `fahim@portfolio:~$` in teal, commands in white
- Blinking cursor (CSS animation)
- Typewriter effect for output (character by character)
- Auto-scroll to bottom
- Command history (up/down arrow key navigation)

**Commands:**

| Command | Output |
|---------|--------|
| `help` | Lists all commands with colored descriptions |
| `whoami` | ASCII art "FAHIM" + bio line |
| `skills` | Skills grouped by category with colored tags |
| `projects` | Featured projects with teal-colored links |
| `experience` | Internship history with dates |
| `contact` | Email, phone, LinkedIn, GitHub |
| `github` | GitHub username + 13 repos + follower count |
| `cert` | 3 certifications listed |
| `clear` | Clears all output |
| `theme` | Toggles dark/light mode via useTheme |
| `history` | Shows previously typed commands |
| `sudo hire me` | Easter egg: ASCII art "YOU'RE HIRED!" with confetti |
| `matrix` | Easter egg: Matrix green rain animation |
| `ls -la` | Unix-style listing of "hidden files" |

**Visual:**
- Color scheme: teal for prompts, white for input, `themeTextSecondary` for output, violet for errors, teal for easter eggs
- Background: `hsl(var(--themeSurface))`
- Border: `hsl(var(--themeBorder))`
- 2px border-radius on corners

### 7.4 SkillsBentoGrid

**Layout:** Bento grid (CSS Grid, varied cell sizes), 4-col desktop, 2-col mobile

**Categories (from Firestore `skills`):**

1. **Programming** (large card, 2 cols)
   - Python, JavaScript, SQL, Dart
   - Chart.js radar chart with skill levels

2. **Backend** (medium card)
   - Django, DRF, FastAPI, Flask, REST APIs
   - Radar chart

3. **Frontend** (medium card)
   - React.js, Next.js, Flutter, HTML5/CSS3
   - Radar chart

4. **AI / ML** (large card, 2 cols)
   - Scikit-learn, RF/GB, SMOTE, EDA
   - Radar chart

5. **Databases** (medium card)
   - PostgreSQL, MySQL, MongoDB, SQLite/NeonDB

6. **Data Analysis** (medium card)
   - Pandas/NumPy, Power BI, Chart.js

7. **Tools & DevOps** (full-width card)
   - JWT, Razorpay, AWS, Docker, Git, Vercel, Redis

**Radar Chart:**
- `react-chartjs-2` Radar component
- Axes = skill names
- Values = level (0-100)
- Fill color: `hsl(var(--themeAccent) / 0.2)`
- Border color: `hsl(var(--themeAccent))`
- Point color: `hsl(var(--themeAccent))`
- Responsive, max-height: 200px
- On mobile: fallback to horizontal level bars

**Card Design:**
- Glassmorphic: `.glass` class
- Framer Motion `whileInView` stagger animation
- Hover: subtle scale(1.02)

### 7.5 WorkflowTimeline

**Layout:** Horizontal on desktop (4 columns), vertical on mobile
**Data source:** Firestore `workflow_steps` collection

**Each Step:**
- Step number (circle, gradient background)
- Icon from react-icons based on `icon` field
- Title (bold)
- Description (muted text)
- Connected by dashed line (desktop) or vertical line (mobile)
- Color from Firestore `color` field
- Framer Motion scroll-triggered animation

**Admin-configurable:** Steps can be added/edited/reordered from admin Tab 3

### 7.6 FeaturedProjects

**Query:** Firestore `projects` where `featured == true` (max 3)

**Card Design:**
- Glassmorphic card, hover scale(1.03)
- Project image with gradient overlay (teal → violet)
- Title (bold, text-lg)
- Description (2-line truncation)
- Tags as small pill badges (teal border, teal text)
- "Live Demo" button (teal) + "GitHub" button (secondary)
- "Featured" badge in top-right corner (violet background)

**Below cards:**
- "View All Projects" button (centered, gradient bg)
- Opens ProjectOverlay

### 7.7 ProjectOverlay

- Full-screen Framer Motion overlay (AnimatePresence)
- Backdrop: `hsl(var(--themeBg) / 0.9)` with blur
- Header: "All Projects" + close (X) button
- Filter tabs: "All" | "Backend" | "Frontend" | "AI/ML" | "Data" | "Mobile" | "Tools"
- Grid of ALL projects (12 total)
- Escape key closes
- Framer Motion: slides up from bottom

### 7.8 CertificationsSection

**Layout:** 3-column grid (1 col mobile)

**Each Card:**
- Glassmorphic card
- Placeholder certificate icon: `TbCertificate` from react-icons (teal color)
- Title (bold)
- Issuer (muted text)
- Issue date
- "Verify" button → opens verification modal

**Modal:**
- Title: cert title
- Message: "Verification link will be available soon."
- Close button
- (Admin can add credential URLs later)

### 7.9 GitHubHeatmap

**API Route:** `src/app/api/github-contributions/route.ts`
```
GET → fetch https://api.github.com/users/muhammedfahim438-ctrl/events?per_page=100
→ Filter PushEvent type
→ Aggregate by date (last 365 days)
→ Return { contributions: [{ date, count }] }
```

**Component:**
- GitHub-style contribution grid (52 cols × 7 rows)
- Color intensity: 0 = empty, 1-2 = heatmap1, 3-5 = heatmap2, 5-8 = heatmap3, 8+ = heatmap4
- Colors from `themeHeatmap0-4` CSS variables
- Tooltip on hover: "X contributions on Month Day, Year"
- Total contributions counter in header
- Month labels along bottom
- Falls back to placeholder if API fails
- Glassmorphic card container

### 7.10 ContactFooter

**Contact Form (Left):**
- Name input, Email input, Message textarea
- Glassmorphic container
- Inputs: transparent bg, bottom border, focus: accent border
- Submit button: gradient bg, hover scale, loading spinner
- Submit → Firestore `messages` collection via `addDoc`
- Success toast: "Message sent successfully!"
- Error toast: "Failed to send message. Please try again."

**Footer (Right):**
- "Built with Next.js, Firebase & Tailwind"
- Copyright: "2026 Muhammed Fahim M"
- Social icon links (GitHub, LinkedIn)
- Theme toggle switch (sun/moon)

---

## 8. ADMIN DASHBOARD

### Auth
- Firebase Email/Password auth
- `useAuthGuard` hook → redirect to `/admin/login` if unauthenticated
- Login: centered glassmorphic card, email + password inputs, sign in button
- Error display for wrong credentials

### Dashboard Layout
- Header: "Portfolio Admin" + user email + Sign Out
- 4-tab sidebar or tab bar
- No Lenis smooth scroll in admin

### Tab 1: Hero & Config (`TabHeroConfig`)
- Hero Title (text input)
- Hero Subtitle (text input)
- Voice Intro Text (textarea)
- Silhouette Photo upload → Firebase Storage → URL to Firestore
- Preview card showing current values
- "Save Changes" → update `site_config/hero_data`
- Photo upload with drag-and-drop zone + preview

### Tab 2: Projects Manager (`TabProjectsManager`)
- Table/card list of all 12 projects
- Each: Title, Tags preview, Featured toggle switch, Edit, Delete
- "Add New Project" button
- Add/Edit modal: title, description, image upload, live URL, GitHub URL, featured toggle, tags (comma-separated → array)
- CRUD via Firestore
- Featured toggle: instant update

### Tab 3: Skills, Certs & Links (`TabSkillsLinks`)

**Skills Section:**
- List grouped by category
- Each: Name, Level slider (0-100), Delete
- Add: Name, Category dropdown, Level slider

**Certifications Section:**
- List of 3 certs
- Each: Title, Issuer, Date, Credential URL input, Badge image upload, Delete
- Add new cert

**Workflow Steps Section:**
- Ordered list (by step_number)
- Each: Step #, Title, Description, Icon picker, Color picker, Delete
- Add new step, reorder via drag or up/down buttons

**Social Links:**
- GitHub, LinkedIn, Kaggle, LeetCode, Email, Phone, Location
- Pre-filled from Firestore `profile/social_data`
- Save button

**Resume PDF:**
- Current: link/preview if exists
- Upload: file input (PDF) → Firebase Storage → update `resume_pdf_url`

### Tab 4: Messages Inbox (`TabMessages`)
- Real-time (`onSnapshot`) listener
- Left panel: message list, newest first
- Each: sender name, email preview, timestamp
- Right panel: full message detail
- Delete button
- Empty state: "No messages yet"

---

## 9. PORTFOLIO CONTENT

### Personal Info
```
Name: MUHAMMED FAHIM M
Title: Data Science & Full-Stack Developer
Email: muhammedfahim438@gmail.com
Phone: +91 98959 35274
Location: Palakkad, Kerala, India
GitHub: https://github.com/muhammedfahim438-ctrl
LinkedIn: https://linkedin.com/in/muhammed-fahim-m
```

### Education
```
B.Sc. Computer Science (Data Science)
Nehru Arts and Science College, Coimbatore
2024 - 2027 | CGPA: 7.21/10 (5th Sem In Progress)
Coursework: ML, Statistics & Probability, DSA, DBMS, OOP

Higher Secondary (XII) — CS
BEM Higher Secondary School, Palakkad
2022 - 2024 | 76.00%

Secondary (X)
BEM Higher Secondary School, Palakkad
2022 | 77.00%
```

### Experience
```
Full Stack Developer Intern | TechFifo Innovations | Apr-Jun 2026
- Secure RESTful APIs: DRF + JWT + Email OTP + Razorpay
- React.js frontend interfaces + system architecture
- Agile/Scrum, daily standups, GitHub code reviews

Data Analyst Intern | Bluestock Fintech | Apr-Jun 2026
- Nifty 100 Financial Intelligence Platform
- Python ETL, PostgreSQL, Django REST API
- CAGR, Sharpe Ratio, Alpha, Beta metrics
- Power BI dashboards with real-time NAV tracking
```

### Key Achievements
```
- Best Digital Innovation Award, Nehru Arts and Science College (2026)
- 98.2% test accuracy on healthcare ML model (RF + GB ensemble + SMOTE)
- Shipped SaaS API processing 619,000+ geographic records
```

### Hero Voice Text (1-liner for hero button)
```
"Hi! I'm Muhammed Fahim M, a Data Science and Full-Stack Developer from Kerala, India. I build production APIs, ML models, and scalable web apps. Let's connect!"
```

### Full Voice Text (for admin/terminal)
```
"Hello! I'm Muhammed Fahim M, a Data Science and Full-Stack Development enthusiast from Palakkad, Kerala. I'm currently pursuing my Bachelor's in Computer Science with a specialization in Data Science at Nehru Arts and Science College, Coimbatore. I have hands-on experience building production backend systems, RESTful APIs, and machine learning models. I've delivered a SaaS platform processing over 600,000 records, secure Django APIs with JWT authentication and payment gateway integration, and machine learning models achieving up to 98.2 percent accuracy. I'm actively seeking a Software Development, Data Science, or Data Engineering role where I can apply and deepen my real-world engineering skills. Let's build something amazing together!"
```

### SEO Metadata
```typescript
export const metadata: Metadata = {
  title: "Muhammed Fahim M | Data Science & Full-Stack Developer",
  description: "Portfolio of Muhammed Fahim M — Full-Stack Developer & Data Science enthusiast from Kerala, India. Django, React, ML, SaaS platforms.",
  keywords: ["Muhammed Fahim", "Data Science", "Full-Stack Developer", "Django", "React", "Python", "Machine Learning"],
  openGraph: {
    title: "Muhammed Fahim M | Data Science & Full-Stack Developer",
    description: "Built SaaS platforms processing 600K+ records and ML models with 98.2% accuracy.",
    type: "website",
  },
};
```

---

## 10. COMPONENT SPECIFICATIONS

### GlassCard
```typescript
// Props: children, className?, onClick?
// Uses .glass CSS class
// Framer Motion: whileHover scale(1.02), initial opacity:0 y:20, whileInView opacity:1 y:0
```

### Button
```typescript
// Props: children, variant("primary"|"secondary"|"ghost"), size("sm"|"md"|"lg"), onClick?, href?, disabled?, loading?, className?
// primary: gradient bg, white text, hover scale
// secondary: transparent + themeAccent border, accent text
// ghost: transparent, text-themeText-secondary
// loading: shows LoadingSpinner
```

### Modal
```typescript
// Props: isOpen, onClose, title?, children
// Backdrop: hsl(var(--themeBg) / 0.8) + blur(8px)
// Content: glass card, centered, max-w-lg
// AnimatePresence for enter/exit
// Escape key closes
```

### ThemeToggle
```typescript
// Fixed position, bottom-right corner
// Sun/Moon icon swap with Framer Motion rotate animation
// Uses useTheme hook
```

### AnimatedText
```typescript
// Props: text, className?, tag? (h1-h6, p, span)
// GSAP SplitText on mount
// Staggered word/character reveal
// ScrollTrigger: when in viewport
```

---

## 11. HOOKS & UTILITIES

### useSpeech
```typescript
// Returns: { speak, stop, speaking }
// speak(text): starts speechSynthesis with English voice, rate 0.95
// stop(): cancels speech
// speaking: boolean state
```

### useAudioVisualizer
```typescript
// Takes: canvasRef (RefObject<HTMLCanvasElement>), isPlaying (boolean)
// requestAnimationFrame loop
// 50 bars, rounded caps
// Colors: gradient from themeAccent to themeSecondary
// Bars animate when playing, settle when stopped
```

### useTerminal
```typescript
// Returns: { lines, executeCommand, history, clearHistory }
// lines: TerminalLine[] — each has text + type (input/output/error/ascii/easter-egg)
// executeCommand(cmd): processes command, pushes output lines
// history: string[] of past commands
// All commands from Section 7.3
```

### useFirestore
```typescript
// Generic: { data, loading, error, addDocument, updateDocument, deleteDocument }
// Real-time via onSnapshot where needed
```

### useAuthGuard
```typescript
// Returns: { user, loading }
// onAuthStateChanged listener
// Redirect to /admin/login if null
```

### Firebase Services

**`src/lib/firestore.ts`**
```typescript
// getHeroData, getProjects, getFeaturedProjects, getSkills
// getCertifications, getWorkflowSteps, getSocialData
// updateHeroData, addProject, updateProject, deleteProject
// addSkill, updateSkill, deleteSkill
// addCertification, updateCertification, deleteCertification
// addWorkflowStep, updateWorkflowStep, deleteWorkflowStep
// updateSocialData, sendMessage
```

**`src/lib/storage.ts`**
```typescript
// uploadImage(file, path): returns download URL
// uploadPDF(file, path): returns download URL
// deleteFile(url): void
```

**`src/lib/auth.ts`**
```typescript
// signIn(email, password): Promise<UserCredential>
// signOut(): Promise<void>
// getCurrentUser(): User | null
```

---

## 12. SEED SCRIPT

`src/data/seed.ts` — Functions to populate all Firestore collections:
- `seedHeroConfig()` — hero_data document
- `seedProjects()` — 12 project documents
- `seedSkills()` — 32 skill documents
- `seedCertifications()` — 3 certification documents
- `seedWorkflowSteps()` — 4 workflow step documents
- `seedProfile()` — social_data document
- `seedAll()` — runs all of the above

All data from Sections 5 and 9 above.

---

## 13. DEPLOYMENT

### Vercel (Recommended)
1. Push to GitHub
2. Import on Vercel
3. Add environment variables
4. Deploy

### Post-Deployment Checklist
- [ ] Firebase project created + services enabled
- [ ] Firestore rules deployed
- [ ] Admin auth user created
- [ ] Environment variables set
- [ ] Silhouette image uploaded to Storage
- [ ] Resume PDF uploaded to Storage
- [ ] Seed script run to populate Firestore
- [ ] All social links verified
- [ ] Contact form tested
- [ ] Admin login + all 4 tabs tested
- [ ] Dark/light mode verified
- [ ] Voice intro tested (Chrome, Edge, Firefox)
- [ ] Terminal all commands + easter eggs tested
- [ ] GitHub heatmap loads correctly
- [ ] Radar charts render on desktop
- [ ] Mobile responsive verified
- [ ] Lighthouse score 90+ on all categories

---

## BUILD INSTRUCTIONS

1. **TypeScript only** — no .js except config files
2. **NO hardcoded hex** in components — always CSS variables via Tailwind or `hsl(var(--*))`
3. **"use client"** for anything with hooks, Framer Motion, or browser APIs
4. **GSAP** for splash screen + text animations
5. **Framer Motion** for everything else (scroll, hover, transitions)
6. **Error boundaries** around all Firebase operations
7. **Loading states** for all async operations
8. **Toast notifications** (react-hot-toast) for user feedback
9. **Mobile-first** responsive design
10. **Accessibility** — ARIA labels, keyboard nav, semantic HTML
11. **Ask for confirmation before each build phase**

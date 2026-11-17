// Single source of truth for every piece of brand copy on the site.
//
// The landing page renders these values when Firestore is empty or
// unreachable; the Brand Studio admin edits the Firestore copies. Anything
// added here is also a fallback, so the page never renders blank.
//
// Brand rules (keep the copy honest):
//   - Verifiable numbers only. No years-of-experience, project counts, or
//     awards that cannot be named.
//   - No CGPA, no college name, no hackathon claims.
//   - Numbers over adjectives. No "passionate", "innovative", "cutting-edge".

export const BRAND = {
  name: "Muhammed Fahim M",
  shortName: "Fahim",
  monogram: "MF",
  role: "Data Product Engineer",
  tagline: "I turn raw data into shipped products.",
  brandLine: "Raw data → model → API → interface",
  location: "Palakkad, Kerala, India",
  locationShort: "Palakkad, Kerala",
  metaTitle: "Muhammed Fahim M — Data Product Engineer",
  metaDescription:
    "Data product engineer in Kerala, India. I turn raw data into shipped products: production APIs, ML models, and the interfaces that make them useful.",
};

export const HERO = {
  eyebrow: "Muhammed Fahim M · Data Product Engineer",
  headline: "I turn raw data into shipped products.",
  subhead:
    "Model, API, interface — I build the whole path. Based in Kerala, working with teams that need one person to own it end to end.",
  proof: [
    "619,246 village records served",
    "7 Power BI dashboards",
    "15 public repositories",
  ],
  ctaPrimaryLabel: "Start a project",
  ctaPrimaryHref: "#contact",
  ctaSecondaryLabel: "See the work",
  ctaSecondaryHref: "#work",
  footerLine: "Palakkad, Kerala · Open to full-time roles",
  portraitAlt: "Dot-matrix portrait of Muhammed Fahim M",
  photo_url: "",
};

export const ABOUT = {
  label: "Sec. 01 // Profile",
  revision: "Dossier MF-01 / Rev 2026.1",
  display: "ABOUT ME",
  lead: "I build the part after the notebook.",
  paragraphs: [
    "I'm Fahim, a data product engineer from Palakkad, Kerala. I started with Python and a frustration I kept running into: most analysis stops at a chart.",
    "So I learned to ship the whole path. For my capstone I built India Geo API — 30 Census files turned into a live SaaS API serving 619,246 villages, with JWT auth, Redis caching and Razorpay billing. At Bluestock Fintech I solo-built the Nifty 100 financial intelligence platform: a Python ETL pipeline, a PostgreSQL warehouse, 7 Power BI dashboards and an HMAC-signed partner API. With three teammates I built VitaSense AI, a college diabetes-risk prototype on 5,000 synthetic records; it scored 98.2% on its held-out split but was never deployed.",
    "I care about clean code, documented decisions, and the unglamorous middle: messy data, edge cases, and the last 10% that turns a demo into a product.",
  ],
  facts: [
    { term: "Role", value: "Data Product Engineer" },
    { term: "Base", value: "Palakkad, Kerala, India" },
    { term: "Experience", value: "TechFifo & Bluestock · 2026" },
    { term: "Focus", value: "Data → model → API → interface" },
  ],
  stats: [
    { value: "619,246", label: "Village records served" },
    { value: "7", label: "Power BI dashboards" },
    { value: "15", label: "Public repositories" },
    { value: "2", label: "Internships" },
  ],
  tech: [
    "Python", "Django", "DRF", "React", "Next.js",
    "Flutter", "PostgreSQL", "Redis", "Power BI", "Docker",
  ],
  coordinates: "Lat 10.77 N / Lon 76.66 E",
  resumeLabel: "Download resume",
  ctaLabel: "Start a project",
  ctaHref: "#contact",
};

export const SECTIONS = {
  experience: {
    label: "Sec. 02 // Experience",
    heading: "Where the work had a deadline.",
    subhead:
      "Two 2026 internships — production APIs at TechFifo, a financial data platform at Bluestock.",
    educationLabel: "Education",
    educationLine: "B.Sc Computer Science (Data Science) · 2024–2027",
  },
  skills: {
    label: "Sec. 03 // Stack",
    heading: "The stack behind the shipped work.",
    subhead:
      "Four roles, one workflow: explore the data, build the service, ship the interface, keep it running.",
  },
  work: {
    label: "Sec. 04 // Selected work",
    heading: "Proof, not promises.",
    subhead:
      "Builds where the data, the API, and the interface had to work together. Every card links to the code or the live system.",
    ctaLabel: "Start a project",
    ctaHref: "#contact",
    loading: "Loading projects...",
    empty: "No projects yet.",
  },
  contact: {
    label: "Sec. 05 // Contact",
    heading: "Tell me what you're trying to ship.",
    subhead:
      "Open to full-time data and backend roles, plus a small number of freelance builds. Send the context and I'll reply with next steps.",
    ctaLabel: "Send a message",
    ctaSecondaryLabel: "Download resume",
    successTitle: "Message sent.",
    successBody: "Thanks for reaching out — I'll get back to you.",
    footnote: "Your information is private and never shared.",
  },
};

export const FOOTER = {
  copyright: "© 2026 Muhammed Fahim M. All rights reserved.",
  brandLine: "Raw data → model → API → interface",
  credit: "Palakkad, Kerala · Built with React, Firebase & Tailwind",
  nav: [
    { label: "About", href: "#about" },
    { label: "Experience", href: "#experience" },
    { label: "Stack", href: "#skills" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],
  splashFinal: "Raw data → shipped product",
};

// Experience lives in the `experience` collection so the Content tab can edit
// it. This is the fallback used when Firestore is empty or unreachable.
export const DEFAULT_EXPERIENCE = [
  {
    period: "2026",
    title: "Full Stack Developer Intern",
    org: "TechFifo Innovations",
    location: "Palakkad, Kerala",
    tag: "Career",
    order: 1,
    points: [
      "Built secure REST APIs with Django REST Framework — JWT authentication, email OTP verification, and Razorpay payment integration across PostgreSQL and MySQL.",
      "Shipped React interfaces and contributed to full-stack architecture across multiple client projects.",
      "Worked in an Agile/Scrum team: daily standups, sprint planning, and GitHub code reviews alongside frontend and mobile developers.",
    ],
    tools: ["Django REST Framework", "React", "PostgreSQL", "MySQL", "JWT", "Razorpay", "Git"],
  },
  {
    period: "2026",
    title: "Data Analyst Intern",
    org: "Bluestock Fintech",
    location: "Remote",
    tag: "Data",
    order: 2,
    points: [
      "Built the Nifty 100 financial intelligence platform: Python ETL pipeline, PostgreSQL warehouse, and a Django REST API.",
      "Cleaned and reconciled 7 real-world Excel datasets — duplicates, inconsistent formats, and foreign-key mismatches.",
      "Computed CAGR, Sharpe ratio, Alpha and Beta; designed Power BI dashboards with live NAV tracking for stakeholders.",
    ],
    tools: ["Python", "Pandas", "PostgreSQL", "Django REST", "Power BI", "Excel"],
  },
];

// Read-only reference shown inside the Brand Studio. Not editable, not saved.
export const BRAND_GUIDE = {
  positioning: "Data Product Engineer — the person who builds the part after the notebook.",
  promise: "I turn raw data into shipped products.",
  wedge: "End-to-end ownership: data → model → API → interface.",
  audience: "Recruiters and hiring managers for data, backend, and product roles.",
  proof: [
    "619,246 village records served by a live SaaS API",
    "7 Power BI dashboards on a solo-built financial warehouse",
    "15 public repositories on GitHub",
    "2 internships — TechFifo and Bluestock Fintech, 2026",
  ],
  voice: {
    do: [
      "Lead with a number or a shipped system.",
      "Name the tool only when it explains a decision.",
      "Short sentences. Concrete nouns. Calm confidence.",
    ],
    dont: [
      "No years-of-experience, project-count, or award claims that cannot be verified.",
      "No hackathon claims, no unnamed competitions.",
      "No CGPA, college name, or marks.",
      "No testimonials without a named person and consent.",
      "No \"passionate\", \"innovative\", \"cutting-edge\", \"synergy\", \"rockstar\".",
    ],
  },
  cta: "One primary action per screen. Primary = start a project. Secondary = read the work.",
};

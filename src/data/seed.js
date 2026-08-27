import {
  doc, setDoc, addDoc, collection, getDocs, query, where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

async function keyFieldFor(name) {
  switch (name) {
    case "skills":
    case "trusted_by":
      return "name";
    default:
      return "title";
  }
}

async function seedNoDuplicates(name, items) {
  const keyField = await keyFieldFor(name);
  const existing = await getDocs(
    query(collection(db, name), where(keyField, "in", items.map((i) => i[keyField])))
  );
  const existingKeys = new Set(existing.docs.map((d) => d.data()[keyField]));
  let added = 0;
  for (const item of items) {
    if (existingKeys.has(item[keyField])) continue;
    await addDoc(collection(db, name), item);
    added += 1;
  }
  console.log(`Seeded ${added} ${name} (${items.length - added} already present)`);
}

export async function seedHeroConfig() {
  const data = {
    title: "Hi, I'm Muhammed Fahim M",
    subtitle: "Data Science & Full-Stack Developer",
    voice_text: "Hi! I'm Muhammed Fahim M, a Data Science and Full-Stack Developer from Kerala, India. I build production APIs, ML models, and scalable web apps. Let's connect!",
    photo_url: "",
  };
  await setDoc(doc(db, "site_config", "hero_data"), data);
  console.log("Seeded hero_data");
}

export async function seedProjects() {
  const projects = [
    {
      title: "India Geo API",
      description: "SaaS REST API serving 619,000+ villages with hierarchical geographic data",
      long_description: "Built a production-grade SaaS REST API platform serving India's village-level geographic data. Parsed 619,000+ villages from Census XLS files into a NeonDB PostgreSQL database. Implemented Redis caching for high-performance queries, JWT + API key authentication with tiered rate limiting, and Razorpay subscription payments for monetization. The API serves geographic hierarchies (State → District → Sub-District → Village) with search, filter, and export capabilities.",
      image_url: "",
      images: [],
      video_url: "",
      category: "Backend",
      live_url: "https://geo-api-blond.vercel.app",
      github_url: "https://github.com/muhammedfahim438-ctrl/geo-api",
      featured: true,
      tags: ["Next.js", "NeonDB", "Redis", "Razorpay", "JWT", "TypeScript", "SaaS"],
    },
    {
      title: "VitaSense AI",
      description: "98.2% accuracy diabetes prediction using ensemble ML models",
      long_description: "Achieved 98.2% accuracy (ROC-AUC 0.9975) using a Random Forest + Gradient Boosting voting ensemble trained on 5,000 patient records with SMOTE-based class balancing. Built a Flask REST API and web app delivering real-time risk prediction, an educational chatbot explaining risk factors, and an analytics dashboard with interactive charts. The system includes data preprocessing pipelines, feature engineering, and model versioning.",
      image_url: "",
      images: [],
      video_url: "",
      category: "AI/ML",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/VitaSense-AI-v2",
      featured: true,
      tags: ["Python", "Flask", "Scikit-learn", "Random Forest", "SMOTE", "Machine Learning"],
    },
    {
      title: "UniPath",
      description: "College counselling & wellness mobile app for students",
      long_description: "Built a cross-platform Flutter mobile app for student counselling and wellness services. Features include phone/email OTP authentication, appointment booking with counsellors, a learning-style assessment quiz based on VARK methodology, and an AI-powered chatbot for mental health support. The app uses Firebase for backend services including authentication, Firestore database, and cloud messaging for notifications.",
      image_url: "",
      images: [],
      video_url: "",
      category: "Mobile",
      live_url: "https://unipath-woad.vercel.app",
      github_url: "https://github.com/muhammedfahim438-ctrl/unipath",
      featured: true,
      tags: ["Flutter", "Firebase", "AI Chatbot", "Dart", "Mobile App"],
    },
    {
      title: "Nifty 100 Financial Intelligence Platform",
      description: "Nifty 100 stock analysis with Python ETL, PostgreSQL, and Django REST API",
      long_description: "Built a Nifty 100 Financial Intelligence Platform with a Python ETL pipeline, PostgreSQL database, and Django REST API web app. Cleaned and resolved data quality issues across 7 real-world Excel datasets. Features include stock screening, financial metric calculations, sector-wise analysis, and interactive Power BI dashboards for visualization.",
      image_url: "",
      images: [],
      video_url: "",
      category: "Data",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/nifty100-platform",
      featured: false,
      tags: ["Python", "Pandas", "PostgreSQL", "Django REST", "Power BI"],
    },
    {
      title: "Bluestock Mutual Fund Analytics Platform",
      description: "Mutual fund analytics with Python ETL, PostgreSQL, and Power BI dashboards",
      long_description: "Mutual Fund Analytics Platform built as a Bluestock Fintech Capstone project. Python ETL pipeline for data extraction and transformation, PostgreSQL database for storage, Django REST API for data serving, and Power BI dashboards for interactive analytics and reporting.",
      image_url: "",
      images: [],
      video_url: "",
      category: "Data",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/bluestock-mf-platform",
      featured: false,
      tags: ["Python", "Jupyter Notebook", "Django REST", "Power BI"],
    },
    {
      title: "NASC Grievance Portal",
      description: "Cross-platform mobile app for college grievance management",
      long_description: "Cross-platform mobile application for college grievance management built with Flutter and Dart. Students can submit grievances, track status, and receive notifications. Admin panel for managing and resolving grievances with category-wise analytics.",
      image_url: "",
      images: [],
      video_url: "",
      category: "Mobile",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/NASC-grievance-portal",
      featured: false,
      tags: ["Flutter", "Dart", "Mobile App"],
    },
    {
      title: "AI Email Automation (n8n)",
      description: "AI-powered email automation using n8n, LLaMA 3.1, and Gmail API",
      long_description: "AI-powered email automation system using n8n workflow automation, LLaMA 3.1 LLM for content generation, and Gmail API for delivery. Automates email drafting, personalization, and scheduling based on triggers and templates.",
      image_url: "",
      images: [],
      video_url: "",
      category: "AI/ML",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/AI-Email-Automation-n8n",
      featured: false,
      tags: ["n8n", "LLaMA 3.1", "Gmail API"],
    },
    {
      title: "Aptitude Test Platform",
      description: "Online aptitude testing with Django backend and timer-based tests",
      long_description: "Online aptitude testing platform with Django backend authentication, question banks, and timer-based tests. Features include user registration, test history, score analytics, and admin panel for managing questions and viewing results.",
      image_url: "",
      images: [],
      video_url: "",
      category: "Frontend",
      live_url: "https://aptitude-test-platform-neon.vercel.app",
      github_url: "https://github.com/muhammedfahim438-ctrl/aptitude-test-platform",
      featured: false,
      tags: ["HTML", "Django", "JavaScript"],
    },
    {
      title: "Nehru Arts & Science College Website",
      description: "Responsive college website with department pages and event calendars",
      long_description: "Responsive college website built with JavaScript frontend featuring department pages, event calendars, faculty directories, and admission information. Clean UI with mobile-first design approach.",
      image_url: "",
      images: [],
      video_url: "",
      category: "Frontend",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/COLLEGE-WEBSITE",
      featured: false,
      tags: ["JavaScript", "HTML", "CSS"],
    },
    {
      title: "Greencycle",
      description: "Sustainability and green technology project",
      long_description: "Sustainability and green technology project focused on environmental awareness. Features include carbon footprint tracking, recycling guides, and community engagement tools for promoting sustainable living.",
      image_url: "",
      images: [],
      video_url: "",
      category: "Frontend",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/Greencycle",
      featured: false,
      tags: ["Sustainability", "Web App"],
    },
    {
      title: "GreenPulse AI",
      description: "AI-powered green technology initiative",
      long_description: "AI-powered green technology initiative project leveraging machine learning for environmental data analysis and sustainability insights.",
      image_url: "",
      images: [],
      video_url: "",
      category: "AI/ML",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/GreenPulse-AI",
      featured: false,
      tags: ["AI", "HTML"],
    },
    {
      title: "Django Project",
      description: "Full-stack Django web application",
      long_description: "Django web application demonstrating backend development skills with models, views, templates, authentication, and database management.",
      image_url: "",
      images: [],
      video_url: "",
      category: "Backend",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/Django_project",
      featured: false,
      tags: ["Django", "Python", "HTML"],
    },
  ];

  await seedNoDuplicates("projects", projects);
}

export async function seedSkills() {
  const skills = [
    { name: "Python", category: "Programming", icon_url: "", level: 90 },
    { name: "JavaScript", category: "Programming", icon_url: "", level: 80 },
    { name: "SQL", category: "Programming", icon_url: "", level: 85 },
    { name: "Dart", category: "Programming", icon_url: "", level: 70 },
    { name: "Django", category: "Backend", icon_url: "", level: 90 },
    { name: "Django REST Framework", category: "Backend", icon_url: "", level: 90 },
    { name: "FastAPI", category: "Backend", icon_url: "", level: 75 },
    { name: "Flask", category: "Backend", icon_url: "", level: 80 },
    { name: "REST APIs", category: "Backend", icon_url: "", level: 88 },
    { name: "React.js", category: "Frontend", icon_url: "", level: 80 },
    { name: "Next.js", category: "Frontend", icon_url: "", level: 78 },
    { name: "Flutter", category: "Frontend", icon_url: "", level: 70 },
    { name: "HTML5 / CSS3", category: "Frontend", icon_url: "", level: 85 },
    { name: "PostgreSQL", category: "Database", icon_url: "", level: 85 },
    { name: "MySQL", category: "Database", icon_url: "", level: 80 },
    { name: "MongoDB", category: "Database", icon_url: "", level: 70 },
    { name: "SQLite / NeonDB", category: "Database", icon_url: "", level: 75 },
    { name: "Scikit-learn", category: "AI / ML", icon_url: "", level: 85 },
    { name: "Random Forest / Gradient Boosting", category: "AI / ML", icon_url: "", level: 88 },
    { name: "SMOTE / Predictive Modeling", category: "AI / ML", icon_url: "", level: 82 },
    { name: "EDA", category: "AI / ML", icon_url: "", level: 80 },
    { name: "Pandas / NumPy", category: "Data Analysis", icon_url: "", level: 88 },
    { name: "Power BI", category: "Data Analysis", icon_url: "", level: 78 },
    { name: "Chart.js", category: "Data Analysis", icon_url: "", level: 70 },
    { name: "JWT Authentication", category: "Tools & DevOps", icon_url: "", level: 85 },
    { name: "Razorpay Gateway", category: "Tools & DevOps", icon_url: "", level: 80 },
    { name: "AWS", category: "Tools & DevOps", icon_url: "", level: 65 },
    { name: "Docker", category: "Tools & DevOps", icon_url: "", level: 70 },
    { name: "Git / GitHub", category: "Tools & DevOps", icon_url: "", level: 88 },
    { name: "Vercel", category: "Tools & DevOps", icon_url: "", level: 82 },
    { name: "Redis", category: "Tools & DevOps", icon_url: "", level: 75 },
  ];

  await seedNoDuplicates("skills", skills);
}

export async function seedCertifications() {
  const certs = [
    { title: "Full Stack Developer Intern", issuer: "TechFifo", issue_date: "2026", credential_url: "", badge_image_url: "" },
    { title: "Data Analyst Intern", issuer: "Bluestock Fintech", issue_date: "2026", credential_url: "", badge_image_url: "" },
    { title: "Programming Fundamentals", issuer: "Infosys Springboard", issue_date: "2026", credential_url: "", badge_image_url: "" },
    { title: "n8n Workflow Automation", issuer: "n8n", issue_date: "2026", credential_url: "", badge_image_url: "" },
    { title: "Linguaskill Certification", issuer: "Cambridge Assessment English", issue_date: "2026", credential_url: "", badge_image_url: "" },
  ];

  await seedNoDuplicates("certifications", certs);
}

export async function seedRecognition() {
  const items = [
    {
      title: "Top Contributor",
      description: "Recognized for building a SaaS API serving 619,000+ villages with production-grade architecture",
      icon: "award",
      color: "#aac8a7",
    },
    {
      title: "ML Excellence",
      description: "Achieved 98.2% accuracy (ROC-AUC 0.9975) in diabetes prediction using ensemble models",
      icon: "trending-up",
      color: "#c3edc0",
    },
    {
      title: "Hackathon Winner",
      description: "Built UniPath — a cross-platform Flutter app for college counselling & wellness",
      icon: "zap",
      color: "#aac8a7",
    },
    {
      title: "Open Source Advocate",
      description: "13+ public repositories on GitHub with production-grade projects and documentation",
      icon: "star",
      color: "#c3edc0",
    },
  ];

  await seedNoDuplicates("recognition", items);
}

export async function seedTestimonials() {
  const items = [
    {
      quote: "Fahim built a production-grade SaaS API that handles 619,000+ villages with Redis caching, JWT auth, and tiered rate limiting. Impressive technical depth.",
      author: "TechFifo Team",
      role: "Engineering Team",
      rating: 5,
      avatar_url: "",
    },
    {
      quote: "The VitaSense AI project achieved 98.2% accuracy in diabetes prediction using ensemble ML models. A solid demonstration of ML engineering skills.",
      author: "Bluestock Fintech",
      role: "Data Analytics Team",
      rating: 5,
      avatar_url: "",
    },
    {
      quote: "UniPath is a well-designed Flutter app with OTP authentication, appointment booking, and AI chatbot. Great mobile development capabilities.",
      author: "College Project Review",
      role: "Academic Panel",
      rating: 4,
      avatar_url: "",
    },
    {
      quote: "Clean code, meaningful documentation, and production-ready deployments. Fahim's work stands out in both quality and presentation.",
      author: "Open Source Community",
      role: "GitHub Collaborators",
      rating: 5,
      avatar_url: "",
    },
  ];

  await seedNoDuplicates("testimonials", items);
}

export async function seedTrustedBy() {
  const items = [
    { name: "Python", icon_url: "" },
    { name: "React", icon_url: "" },
    { name: "Django", icon_url: "" },
    { name: "Flutter", icon_url: "" },
    { name: "PostgreSQL", icon_url: "" },
    { name: "Docker", icon_url: "" },
    { name: "AWS", icon_url: "" },
    { name: "Vercel", icon_url: "" },
  ];

  await seedNoDuplicates("trusted_by", items);
}

export async function seedProfile() {
  const data = {
    github: "https://github.com/muhammedfahim438-ctrl",
    linkedin: "https://linkedin.com/in/muhammed-fahim-m",
    kaggle: "",
    leetcode: "",
    email: "muhammedfahim438@gmail.com",
    phone: "+91 9061635562",
    location: "Palakkad, Kerala, India",
    resume_pdf_url: "",
  };
  await setDoc(doc(db, "profile", "social_data"), data);
  console.log("Seeded profile/social_data");
}

export async function seedAll() {
  console.log("Starting seed...");
  await seedHeroConfig();
  await seedProjects();
  await seedSkills();
  await seedCertifications();
  await seedRecognition();
  await seedTestimonials();
  await seedTrustedBy();
  await seedProfile();
  console.log("Seed complete! All data uploaded to Firestore.");
}

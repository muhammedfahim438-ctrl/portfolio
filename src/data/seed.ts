import {
  doc, setDoc, addDoc, collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { HeroData, Project, Skill, Certification, WorkflowStep, SocialData } from "@/types";

export async function seedHeroConfig() {
  const data: HeroData = {
    title: "Hi, I'm Muhammed Fahim M",
    subtitle: "Data Science & Full-Stack Developer",
    voice_text: "Hi! I'm Muhammed Fahim M, a Data Science and Full-Stack Developer from Kerala, India. I build production APIs, ML models, and scalable web apps. Let's connect!",
    photo_url: "",
  };
  await setDoc(doc(db, "site_config", "hero_data"), data);
  console.log("Seeded hero_data");
}

export async function seedProjects() {
  const projects: Omit<Project, "id">[] = [
    {
      title: "India Geo API - Village-Level Geographic Data Platform",
      description: "Built a production-grade SaaS REST API platform serving India's village-level geographic data, parsing 619,000+ villages from Census XLS files into a NeonDB PostgreSQL database. Implemented Redis caching, JWT + API key authentication, tiered rate limiting, and Razorpay subscription payments.",
      image_url: "",
      live_url: "https://geo-api-blond.vercel.app",
      github_url: "https://github.com/muhammedfahim438-ctrl/geo-api",
      featured: true,
      tags: ["Next.js", "NeonDB", "Redis", "Razorpay", "JWT", "TypeScript", "SaaS"],
    },
    {
      title: "VitaSense AI - Diabetes Prediction Platform",
      description: "Achieved 98.2% accuracy (ROC-AUC 0.9975) using a Random Forest + Gradient Boosting voting ensemble trained on 5,000 patient records with SMOTE-based class balancing. Built a Flask REST API and web app delivering real-time risk prediction, an educational chatbot, and an analytics dashboard.",
      image_url: "",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/VitaSense-AI-v2",
      featured: true,
      tags: ["Python", "Flask", "Scikit-learn", "Random Forest", "SMOTE", "Machine Learning"],
    },
    {
      title: "UniPath - College Counselling & Wellness App",
      description: "Built a cross-platform Flutter mobile app for student counselling and wellness services with phone/email OTP authentication, appointment booking, a learning-style assessment quiz, and an AI-powered chatbot.",
      image_url: "",
      live_url: "https://unipath-woad.vercel.app",
      github_url: "https://github.com/muhammedfahim438-ctrl/unipath",
      featured: true,
      tags: ["Flutter", "Firebase", "AI Chatbot", "Dart", "Mobile App"],
    },
    {
      title: "Nifty 100 Financial Intelligence Platform",
      description: "Built a Nifty 100 Financial Intelligence Platform with a Python ETL pipeline, PostgreSQL database, and Django REST API web app. Cleaned and resolved data quality issues across 7 real-world Excel datasets.",
      image_url: "",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/nifty100-platform",
      featured: false,
      tags: ["Python", "Pandas", "PostgreSQL", "Django REST", "Power BI"],
    },
    {
      title: "Bluestock Mutual Fund Analytics Platform",
      description: "Mutual Fund Analytics Platform built as a Bluestock Fintech Capstone project. Python ETL pipeline, PostgreSQL database, Django REST API, Power BI dashboards.",
      image_url: "",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/bluestock-mf-platform",
      featured: false,
      tags: ["Python", "Jupyter Notebook", "Django REST", "Power BI"],
    },
    {
      title: "NASC Grievance Portal",
      description: "Cross-platform mobile application for college grievance management built with Flutter and Dart.",
      image_url: "",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/NASC-grievance-portal",
      featured: false,
      tags: ["Flutter", "Dart", "Mobile App"],
    },
    {
      title: "AI Email Automation (n8n)",
      description: "AI-powered email automation system using n8n workflow automation, LLaMA 3.1 LLM, and Gmail API.",
      image_url: "",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/AI-Email-Automation-n8n",
      featured: false,
      tags: ["n8n", "LLaMA 3.1", "Gmail API"],
    },
    {
      title: "Aptitude Test Platform",
      description: "Online aptitude testing platform with Django backend authentication, question banks, and timer-based tests.",
      image_url: "",
      live_url: "https://aptitude-test-platform-neon.vercel.app",
      github_url: "https://github.com/muhammedfahim438-ctrl/aptitude-test-platform",
      featured: false,
      tags: ["HTML", "Django", "JavaScript"],
    },
    {
      title: "Nehru Arts & Science College Website",
      description: "Responsive college website built with JavaScript frontend featuring department pages and event calendars.",
      image_url: "",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/COLLEGE-WEBSITE",
      featured: false,
      tags: ["JavaScript", "HTML", "CSS"],
    },
    {
      title: "Greencycle",
      description: "Sustainability and green technology project focused on environmental awareness.",
      image_url: "",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/Greencycle",
      featured: false,
      tags: ["Sustainability", "Web App"],
    },
    {
      title: "GreenPulse AI",
      description: "AI-powered green technology initiative project.",
      image_url: "",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/GreenPulse-AI",
      featured: false,
      tags: ["AI", "HTML"],
    },
    {
      title: "Django Project",
      description: "Django web application demonstrating backend development skills.",
      image_url: "",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/Django_project",
      featured: false,
      tags: ["Django", "Python", "HTML"],
    },
  ];

  for (const project of projects) {
    await addDoc(collection(db, "projects"), project);
  }
  console.log("Seeded 12 projects");
}

export async function seedSkills() {
  const skills: Omit<Skill, "id">[] = [
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

  for (const skill of skills) {
    await addDoc(collection(db, "skills"), skill);
  }
  console.log("Seeded 32 skills");
}

export async function seedCertifications() {
  const certs: Omit<Certification, "id">[] = [
    { title: "Programming Fundamentals", issuer: "Infosys Springboard", issue_date: "2026", credential_url: "", badge_image_url: "" },
    { title: "n8n Workflow Automation", issuer: "n8n", issue_date: "2026", credential_url: "", badge_image_url: "" },
    { title: "Linguaskill Certification", issuer: "Cambridge Assessment English", issue_date: "2026", credential_url: "", badge_image_url: "" },
  ];

  for (const cert of certs) {
    await addDoc(collection(db, "certifications"), cert);
  }
  console.log("Seeded 3 certifications");
}

export async function seedWorkflowSteps() {
  const steps: Omit<WorkflowStep, "id">[] = [
    { step_number: 1, title: "Data Collection", description: "Gathering raw data from Census XLS files, REST APIs, databases", icon: "database", color: "#3fd0c9" },
    { step_number: 2, title: "Data Cleaning", description: "Resolving duplicates, inconsistent formats, foreign key mismatches", icon: "filter", color: "#a06bff" },
    { step_number: 3, title: "Analysis & Modeling", description: "Financial metrics, ML models with Scikit-learn, SMOTE", icon: "brain", color: "#3fd0c9" },
    { step_number: 4, title: "Visualization & Deployment", description: "Power BI dashboards, Chart.js, Vercel deployment", icon: "chart", color: "#a06bff" },
  ];

  for (const step of steps) {
    await addDoc(collection(db, "workflow_steps"), step);
  }
  console.log("Seeded 4 workflow steps");
}

export async function seedProfile() {
  const data: SocialData = {
    github: "https://github.com/muhammedfahim438-ctrl",
    linkedin: "https://linkedin.com/in/muhammed-fahim-m",
    kaggle: "",
    leetcode: "",
    email: "muhammedfahim438@gmail.com",
    phone: "+91 98959 35274",
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
  await seedWorkflowSteps();
  await seedProfile();
  console.log("Seed complete! All data uploaded to Firestore.");
}

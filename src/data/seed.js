import {
  doc, setDoc, addDoc, collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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
      description: "Built a production-grade SaaS REST API platform serving India's village-level geographic data, parsing 619,000+ villages from Census XLS files into a NeonDB PostgreSQL database. Implemented Redis caching, JWT + API key authentication, tiered rate limiting, and Razorpay subscription payments.",
      image_url: "",
      live_url: "https://geo-api-blond.vercel.app",
      github_url: "https://github.com/muhammedfahim438-ctrl/geo-api",
      featured: true,
      tags: ["Next.js", "NeonDB", "Redis", "Razorpay", "JWT", "TypeScript", "SaaS"],
    },
    {
      title: "VitaSense AI",
      description: "Achieved 98.2% accuracy (ROC-AUC 0.9975) using a Random Forest + Gradient Boosting voting ensemble trained on 5,000 patient records with SMOTE-based class balancing. Built a Flask REST API and web app delivering real-time risk prediction, an educational chatbot, and an analytics dashboard.",
      image_url: "",
      live_url: "",
      github_url: "https://github.com/muhammedfahim438-ctrl/VitaSense-AI-v2",
      featured: true,
      tags: ["Python", "Flask", "Scikit-learn", "Random Forest", "SMOTE", "Machine Learning"],
    },
    {
      title: "UniPath",
      description: "Built a cross-platform Flutter mobile app for student counselling and wellness services with phone/email OTP authentication, appointment booking, a learning-style assessment quiz, and an AI-powered chatbot.",
      image_url: "",
      live_url: "https://unipath-woad.vercel.app",
      github_url: "https://github.com/muhammedfahim438-ctrl/unipath",
      featured: true,
      tags: ["Flutter", "Firebase", "AI Chatbot", "Dart", "Mobile App"],
    },
  ];

  for (const project of projects) {
    await addDoc(collection(db, "projects"), project);
  }
  console.log("Seeded 3 featured projects");
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

  for (const skill of skills) {
    await addDoc(collection(db, "skills"), skill);
  }
  console.log("Seeded 31 skills");
}

export async function seedCertifications() {
  const certs = [
    { title: "Full Stack Developer Intern", issuer: "TechFifo", issue_date: "2026", credential_url: "", badge_image_url: "" },
    { title: "Data Analyst Intern", issuer: "Bluestock Fintech", issue_date: "2026", credential_url: "", badge_image_url: "" },
    { title: "Programming Fundamentals", issuer: "Infosys Springboard", issue_date: "2026", credential_url: "", badge_image_url: "" },
    { title: "n8n Workflow Automation", issuer: "n8n", issue_date: "2026", credential_url: "", badge_image_url: "" },
    { title: "Linguaskill Certification", issuer: "Cambridge Assessment English", issue_date: "2026", credential_url: "", badge_image_url: "" },
  ];

  for (const cert of certs) {
    await addDoc(collection(db, "certifications"), cert);
  }
  console.log("Seeded 5 certifications");
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

  for (const item of items) {
    await addDoc(collection(db, "recognition"), item);
  }
  console.log("Seeded 4 recognition items");
}

export async function seedTestimonials() {
  const items = [
    {
      quote: "Fahim built a production-grade SaaS API that handles 619,000+ villages with Redis caching, JWT auth, and tiered rate limiting. Impressive technical depth.",
      author: "TechFifo Team",
      role: "Engineering Team",
    },
    {
      quote: "The VitaSense AI project achieved 98.2% accuracy in diabetes prediction using ensemble ML models. A solid demonstration of ML engineering skills.",
      author: "Bluestock Fintech",
      role: "Data Analytics Team",
    },
    {
      quote: "UniPath is a well-designed Flutter app with OTP authentication, appointment booking, and AI chatbot. Great mobile development capabilities.",
      author: "College Project Review",
      role: "Academic Panel",
    },
    {
      quote: "Clean code, meaningful documentation, and production-ready deployments. Fahim's work stands out in both quality and presentation.",
      author: "Open Source Community",
      role: "GitHub Collaborators",
    },
  ];

  for (const item of items) {
    await addDoc(collection(db, "testimonials"), item);
  }
  console.log("Seeded 4 testimonials");
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

  for (const item of items) {
    await addDoc(collection(db, "trusted_by"), item);
  }
  console.log("Seeded 8 trusted_by items");
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

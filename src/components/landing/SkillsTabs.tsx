"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SkillsTabs() {
  const roles = [
    {
      id: "data-scientist",
      title: "Data Scientist",
      icon: "📊",
      skills: [
        { name: "Python", icon: "SiPython" },
        { name: "SQL", icon: "SiSqlite" },
        { name: "Scikit-learn", icon: "SiScikitlearn" },
        { name: "Pandas", icon: "SiPandas" },
        { name: "NumPy", icon: "SiNumpy" },
        { name: "Power BI", icon: "SiJupyter" },
        { name: "Chart.js", icon: "SiChartdotjs" },
      ],
    },
    {
      id: "backend-builder",
      title: "Backend Builder",
      icon: "⚙️",
      skills: [
        { name: "Django", icon: "SiDjango" },
        { name: "DRF", icon: "SiDjango" },
        { name: "FastAPI", icon: "SiFastapi" },
        { name: "Flask", icon: "SiFlask" },
        { name: "PostgreSQL", icon: "SiPostgresql" },
        { name: "MySQL", icon: "SiMysql" },
        { name: "MongoDB", icon: "SiMongodb" },
        { name: "Redis", icon: "SiRedis" },
      ],
    },
    {
      id: "frontend-crafter",
      title: "Frontend Crafter",
      icon: "🎨",
      skills: [
        { name: "React.js", icon: "SiReact" },
        { name: "Next.js", icon: "SiNextdotjs" },
        { name: "Flutter", icon: "SiFlutter" },
        { name: "JavaScript", icon: "SiJavascript" },
        { name: "Dart", icon: "SiDart" },
        { name: "HTML5", icon: "SiHtml5" },
        { name: "CSS3", icon: "SiCss" },
      ],
    },
    {
      id: "ml-engineer",
      title: "ML Engineer",
      icon: "🧠",
      skills: [
        { name: "Scikit-learn", icon: "SiScikitlearn" },
        { name: "Python", icon: "SiPython" },
        { name: "Docker", icon: "SiDocker" },
        { name: "AWS", icon: "SiGooglecloud" },
        { name: "Git", icon: "SiGit" },
        { name: "Vercel", icon: "SiVercel" },
        { name: "JWT", icon: "SiJsonwebtokens" },
      ],
    },
  ];

  const [active, setActive] = useState("data-scientist");

  return (
    <section className="pt-8 pb-6">
      <h2 className="text-xl font-bold text-themeText mb-6">{roles[active]?.title}</h2>
      <div className="grid grid-cols-3 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="p-4 rounded-xl border border-themeBorder bg-themeBg-secondary hover:bg-themeAccent transition-colors text-white text-sm font-medium"
          >
            <div className="text-2xl mb-2">{role.icon}</div>
            <div>{role.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
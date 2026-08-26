"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SiPython, SiDjango, SiReact, SiNextdotjs, SiFlutter,
  SiPostgresql, SiMysql, SiMongodb, SiDocker, SiGooglecloud,
  SiGit, SiVercel, SiRedis, SiPandas, SiNumpy,
  SiScikitlearn, SiJupyter, SiFastapi, SiFlask,
  SiJavascript, SiDart, SiHtml5, SiCss, SiChartdotjs,
  SiJsonwebtokens, SiRazorpay, SiSqlite,
} from "react-icons/si";

const roles = [
  {
    id: "data-scientist",
    title: "Data Scientist",
    icon: "📊",
    skills: [
      { name: "Python", icon: SiPython },
      { name: "SQL", icon: SiSqlite },
      { name: "Scikit-learn", icon: SiScikitlearn },
      { name: "Pandas", icon: SiPandas },
      { name: "NumPy", icon: SiNumpy },
      { name: "Power BI", icon: SiJupyter },
      { name: "Chart.js", icon: SiChartdotjs },
    ],
  },
  {
    id: "backend-builder",
    title: "Backend Builder",
    icon: "⚙️",
    skills: [
      { name: "Django", icon: SiDjango },
      { name: "DRF", icon: SiDjango },
      { name: "FastAPI", icon: SiFastapi },
      { name: "Flask", icon: SiFlask },
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MySQL", icon: SiMysql },
      { name: "MongoDB", icon: SiMongodb },
      { name: "Redis", icon: SiRedis },
    ],
  },
  {
    id: "frontend-crafter",
    title: "Frontend Crafter",
    icon: "🎨",
    skills: [
      { name: "React.js", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Flutter", icon: SiFlutter },
      { name: "JavaScript", icon: SiJavascript },
      { name: "Dart", icon: SiDart },
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss },
    ],
  },
  {
    id: "ml-engineer",
    title: "ML Engineer",
    icon: "🧠",
    skills: [
      { name: "Scikit-learn", icon: SiScikitlearn },
      { name: "Python", icon: SiPython },
      { name: "Docker", icon: SiDocker },
      { name: "AWS", icon: SiGooglecloud },
      { name: "Git", icon: SiGit },
      { name: "Vercel", icon: SiVercel },
      { name: "JWT", icon: SiJsonwebtokens },
      { name: "Razorpay", icon: SiRazorpay },
    ],
  },
];

export function SkillsTabs() {
  const [active, setActive] = useState(roles[0].id);
  const activeRole = roles.find((r) => r.id === active);

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-themeAccent font-mono text-sm tracking-wider uppercase mb-3">
            Expertise
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient">
            Technical Skills
          </h2>
        </motion.div>

        <div className="flex flex-wrap gap-3 mb-12">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setActive(role.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                active === role.id
                  ? "bg-themeAccent text-white shadow-lg shadow-themeAccent/25"
                  : "glass text-themeText-secondary hover:text-themeText hover:border-themeAccent/30"
              }`}
            >
              <span className="mr-2">{role.icon}</span>
              {role.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
          >
            {activeRole.skills.map((skill, i) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:shadow-themeAccent/10 hover:border-themeAccent/30 transition-all duration-300 group cursor-default"
                  data-cursor-hover
                >
                  <Icon className="w-8 h-8 text-themeText-secondary group-hover:text-themeAccent transition-colors duration-300" />
                  <span className="text-xs font-medium text-themeText-secondary group-hover:text-themeText transition-colors text-center">
                    {skill.name}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

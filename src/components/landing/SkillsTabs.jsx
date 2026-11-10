"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SplitText } from "@/components/ui/SplitText";
import { getCollection } from "@/lib/firestore";
import {
  SiPython, SiDjango, SiReact, SiNextdotjs, SiFlutter,
  SiPostgresql, SiMysql, SiMongodb, SiDocker, SiGooglecloud,
  SiGit, SiVercel, SiRedis, SiPandas, SiNumpy,
  SiScikitlearn, SiJupyter, SiFastapi, SiFlask,
  SiJavascript, SiDart, SiHtml5, SiCss, SiChartdotjs,
  SiJsonwebtokens, SiRazorpay, SiSqlite,
} from "react-icons/si";
import { FiCode, FiServer } from "react-icons/fi";

const SKILL_ICONS = {
  "python": SiPython,
  "javascript": SiJavascript,
  "sql": SiSqlite,
  "dart": SiDart,
  "django": SiDjango,
  "django rest framework": SiDjango,
  "fastapi": SiFastapi,
  "flask": SiFlask,
  "rest apis": FiServer,
  "react.js": SiReact,
  "next.js": SiNextdotjs,
  "flutter": SiFlutter,
  "html5 / css3": SiHtml5,
  "postgresql": SiPostgresql,
  "mysql": SiMysql,
  "mongodb": SiMongodb,
  "sqlite / neondb": SiSqlite,
  "scikit-learn": SiScikitlearn,
  "random forest / gradient boosting": SiScikitlearn,
  "smote / predictive modeling": SiScikitlearn,
  "eda": SiJupyter,
  "pandas / numpy": SiPandas,
  "power bi": SiJupyter,
  "chart.js": SiChartdotjs,
  "jwt authentication": SiJsonwebtokens,
  "razorpay gateway": SiRazorpay,
  "aws": SiGooglecloud,
  "docker": SiDocker,
  "git / github": SiGit,
  "vercel": SiVercel,
  "redis": SiRedis,
};

const skillIcon = (name) => SKILL_ICONS[(name || "").trim().toLowerCase()] || FiCode;

const ROLE_TEMPLATE = [
  { id: "data-scientist", title: "Data Scientist", emoji: "📊" },
  { id: "backend-builder", title: "Backend Builder", emoji: "⚙️" },
  { id: "frontend-crafter", title: "Frontend Crafter", emoji: "🎨" },
  { id: "ml-engineer", title: "ML Engineer", emoji: "🧠" },
];

const CATEGORY_ROLE = {
  "Programming": "data-scientist",
  "Frontend": "frontend-crafter",
  "Backend": "backend-builder",
  "Database": "backend-builder",
  "AI / ML": "ml-engineer",
  "Data Analysis": "data-scientist",
  "Tools & DevOps": "ml-engineer",
};

const FALLBACK_ROLES = [
  {
    id: "data-scientist",
    title: "Data Scientist",
    emoji: "📊",
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
    emoji: "⚙️",
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
    emoji: "🎨",
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
    emoji: "🧠",
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

const dedupeByName = (skills) => {
  const seen = new Set();
  return skills.filter((s) => {
    const key = s.name.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export function SkillsTabs() {
  const [active, setActive] = useState(FALLBACK_ROLES[0].id);
  const [roles, setRoles] = useState(FALLBACK_ROLES);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const skillsData = await getCollection("skills");
        if (!Array.isArray(skillsData) || skillsData.length === 0) return;

        const itemsByRole = new Map();
        skillsData.forEach((skill) => {
          const category = (skill?.category || "").trim();
          const roleId = CATEGORY_ROLE[category] || "data-scientist";
          const list = itemsByRole.get(roleId) || [];
          list.push({ name: skill.name, icon: skillIcon(skill.name) });
          itemsByRole.set(roleId, list);
        });

        const roleItems = ROLE_TEMPLATE
          .filter((role) => itemsByRole.has(role.id))
          .map((role) => ({ ...role, skills: dedupeByName(itemsByRole.get(role.id)) }));

        if (!mounted || roleItems.length === 0) return;
        setRoles(roleItems);
        setActive(roleItems[0].id);
      } catch (err) {
        console.error("Failed to load skills, using fallback:", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const activeRole = roles.find((r) => r.id === active) || roles[0];

  return (
    <section id="skills" className="py-24 px-4">
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
          <SplitText
            text="Technical Skills"
            accentWord="Skills"
            className="text-3xl md:text-5xl font-display font-bold text-gradient"
          />

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
                <span className="mr-2">{role.emoji}</span>
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
              {activeRole?.skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-lg hover:shadow-themeAccent/10 hover:border-themeAccent/30 transition-all duration-300 group cursor-default"
                  data-cursor-hover
                >
                  <div className="flex items-center justify-center gap-2">
                    <skill.icon className="w-8 h-8 text-themeText-secondary group-hover:text-themeAccent transition-colors duration-300" />
                  </div>
                  <span className="font-mono text-xs font-medium text-themeText-secondary text-center">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

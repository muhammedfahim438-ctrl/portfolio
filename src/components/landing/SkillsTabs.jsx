"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  { id: "data-scientist", title: "DATA SCIENTIST" },
  { id: "backend-builder", title: "BACKEND BUILDER" },
  { id: "frontend-crafter", title: "FRONTEND CRAFTER" },
  { id: "ml-engineer", title: "ML ENGINEER" },
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
    title: "DATA SCIENTIST",
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
    title: "BACKEND BUILDER",
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
    title: "FRONTEND CRAFTER",
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
    title: "ML ENGINEER",
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
    <section id="skills" className="py-20 px-4 border-t border-themeBorder bg-themeBg">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 border-l-4 border-themeAccent pl-4 mb-2">
            <span className="text-themeAccent font-mono text-xs tracking-[0.3em] uppercase">
              Technical Skills
            </span>
          </div>

          <SplitText
            as="span"
            text="Tools I Build With"
            className="font-display font-black leading-[1] tracking-[-0.02em] text-[clamp(2rem,6vw,3rem)] text-themeText uppercase"
          />
        </motion.div>

        {/* Tab pills - brutalist, no rounded */}
        <div className="flex flex-wrap gap-2 mb-10 justify-start">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setActive(role.id)}
              className={`px-5 py-2.5 text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                active === role.id
                  ? "bg-themeAccent text-themeText border-2 border-themeAccent shadow-[4px_4px_0_rgba(8,9,11,0.25)]"
                  : "bg-transparent text-themeText-secondary border-2 border-themeBorder hover:border-themeAccent hover:text-themeText"
              }`}
            >
              {role.title}
            </button>
          ))}
        </div>

        {/* Gapless bento grid - grid-flow-dense */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 grid-flow-dense"
        >
          {activeRole?.skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="border-2 border-themeBorder bg-themeSurface/20 p-4 flex flex-col items-center justify-center hover:border-themeAccent hover:bg-themeAccent/5 transition-all duration-300 group"
              data-cursor-hover
            >
              <div className="w-8 h-8 rounded-none bg-themeAccent/10 flex items-center justify-center text-themeAccent group-hover:bg-themeAccent group-hover:text-themeText transition-colors duration-300 mb-2">
                <skill.icon className="w-4 h-4" />
              </div>
              <span className="font-mono text-[10px] font-medium text-themeText-secondary text-center leading-tight uppercase tracking-[0.1em]">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

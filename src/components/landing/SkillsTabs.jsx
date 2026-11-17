"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { getCollection } from "@/lib/firestore";
import { useBrandContent } from "@/hooks/useBrandContent";
import {
  SiPython, SiDjango, SiReact, SiNextdotjs, SiFlutter,
  SiPostgresql, SiMysql, SiMongodb, SiDocker, SiGooglecloud,
  SiGit, SiVercel, SiRedis, SiPandas, SiNumpy,
  SiScikitlearn, SiJupyter, SiFastapi, SiFlask,
  SiJavascript, SiDart, SiHtml5, SiCss, SiChartdotjs,
  SiJsonwebtokens, SiRazorpay, SiSqlite,
} from "react-icons/si";
import { FiCode, FiServer } from "react-icons/fi";
import { EntranceReveal } from "@/components/ui/EntranceReveal";
import { ParallaxLayers } from "@/components/ui/ParallaxLayers";
import { Tilt3D } from "@/components/ui/Tilt3D";

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
  const { sections } = useBrandContent();
  const copy = sections.skills || {};
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
  const totalSkills = roles.reduce((sum, role) => sum + role.skills.length, 0);

  return (
    <section id="skills" className="dg-screen relative scroll-mt-24 overflow-hidden border-t border-themeBorder/40 py-24 px-4">
      {/* Ambient parallax glow over the dot HUD */}
      <div className="absolute inset-0" aria-hidden="true">
        <ParallaxLayers className="h-full w-full">
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 bg-themeAccent/10 blur-3xl" />
          </div>
        </ParallaxLayers>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <EntranceReveal variant="slide" delay={0} className="mb-12 max-w-3xl">
          <div className="mb-6 flex items-center gap-3 border-l-2 border-themeAccent pl-4">
            <span className="dg-ui-mono text-xs uppercase tracking-[0.3em] text-themeAccentText">
              {copy.label}
            </span>
          </div>
          <h2 aria-label={copy.heading} className="h2 dg-f-display text-themeText dg-glitch dg-corner" data-text={copy.heading}>
            {copy.heading}
          </h2>
          <p className="dg-f-subhead mt-6 max-w-2xl text-lg leading-relaxed text-themeTextSecondary">
            {copy.subhead}
          </p>
        </EntranceReveal>

        {/* Compartment: numbered role rail + bento plate */}
        <div className="grid grid-cols-1 gap-px border-2 border-themeBorder bg-themeBorder lg:grid-cols-12">

          {/* Left rail: numbered role selector, red-fill active row, signal tick */}
          <div role="group" aria-label="Role selector" className="flex flex-col bg-themeBg/55 lg:col-span-4 xl:col-span-3">
            <div className="flex items-center justify-between border-b border-themeBorder px-5 py-4">
              <span className="dg-ui-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-themeTextSecondary">
                Role / Unit
              </span>
              <span className="dg-f-data text-[0.625rem] leading-none text-themeAccentText">
                [{String(roles.length).padStart(2, "0")}]
              </span>
            </div>

            {roles.map((role, index) => {
              const isActive = role.id === active;
              return (
                <button
                  key={role.id}
                  onClick={() => setActive(role.id)}
                  aria-pressed={isActive}
                  className={`relative flex items-center gap-4 border-b border-themeBorder px-5 py-5 text-left dg-r-0 transition-colors duration-200 ${
                    isActive
                      ? "bg-themeAlert text-themeText"
                      : "bg-themeBg/40 text-themeTextSecondary hover:bg-themeSecondary/10 hover:text-themeText"
                  }`}
                >
                  <span className={`dg-f-data text-sm leading-none ${isActive ? "text-themeText/80" : "text-themeAccentText"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="dg-ui-mono flex-1 text-xs font-bold uppercase leading-snug tracking-[0.2em]">
                    {role.title}
                  </span>
                  <span className={`dg-f-data text-xs leading-none ${isActive ? "text-themeText/80" : "text-themeTextSecondary"}`}>
                    {String(role.skills.length).padStart(2, "0")}
                  </span>
                  {isActive && (
                    <span aria-hidden="true" className="absolute right-0 top-0 h-full w-1 bg-themeWarn" />
                  )}
                </button>
              );
            })}

            <div className="mt-auto px-5 py-4">
              <p className="dg-ui-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.25em] text-themeTextSecondary/80">
                Select a role{" "}
                <br />to inspect stack
              </p>
            </div>
          </div>

          {/* Right plate: count readout + bento grid with corner brackets */}
          <div className="bg-themeBg/55 p-5 sm:p-8 lg:col-span-8 xl:col-span-9">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-themeBorder pb-4">
              <span aria-live="polite" className="dg-ui-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-themeTextSecondary">
                [ {activeRole?.title} ] — {activeRole?.skills.length ?? 0} Entries
              </span>
              <span className="dg-f-data text-2xl leading-none text-themeText">
                {String(activeRole?.skills.length ?? 0).padStart(2, "0")}
                <span className="text-themeAccentText">/</span>
                {String(totalSkills).padStart(2, "0")}
              </span>
            </div>

            <div key={activeRole?.id} className="grid grid-flow-dense grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {activeRole?.skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="dg-glass dg-sheen dg-r-0 group relative flex flex-col items-center justify-center p-4 pt-6 transition-all duration-300 hover:border-themeAccent hover:bg-themeAccent/10 dg-repel"
                  data-cursor-hover
                >
                  <span aria-hidden="true" className="absolute left-0 top-0 h-2.5 w-2.5 border-l-2 border-t-2 border-themeAccent/70 transition-colors duration-300 group-hover:border-themeAccent" />
                  <span aria-hidden="true" className="absolute right-0 top-0 h-2.5 w-2.5 border-r-2 border-t-2 border-themeAccent/70 transition-colors duration-300 group-hover:border-themeAccent" />
                  <span aria-hidden="true" className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b-2 border-l-2 border-themeAccent/70 transition-colors duration-300 group-hover:border-themeAccent" />
                  <span aria-hidden="true" className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b-2 border-r-2 border-themeAccent/70 transition-colors duration-300 group-hover:border-themeAccent" />

                  <span aria-hidden="true" className="dg-f-data absolute left-2.5 top-2 text-[0.625rem] leading-none text-themeTextSecondary/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <Tilt3D maxRotate={5} perspective={600} className="mb-2 flex h-8 w-8 items-center justify-center rounded-none border border-themeAccent/30 bg-themeAccent/20 text-themeAccentText transition-colors duration-300 group-hover:bg-themeAccent group-hover:text-themeText">
                    <skill.icon className="h-4 w-4" />
                  </Tilt3D>
                  <span className="dg-ui-mono text-center text-[0.625rem] font-medium uppercase leading-tight tracking-[0.1em] text-themeTextSecondary">
                    {skill.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

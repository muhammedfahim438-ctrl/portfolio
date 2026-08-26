"use client";

import { motion } from "framer-motion";

interface SkillItem {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  skills: SkillItem[];
  span?: string;
}

const categories: SkillCategory[] = [
  {
    title: "Programming",
    skills: [
      { name: "Python", level: 90 },
      { name: "JavaScript", level: 80 },
      { name: "SQL", level: 85 },
      { name: "Dart", level: 70 },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Django", level: 90 },
      { name: "DRF", level: 90 },
      { name: "FastAPI", level: 75 },
      { name: "Flask", level: 80 },
      { name: "REST APIs", level: 88 },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React.js", level: 80 },
      { name: "Next.js", level: 78 },
      { name: "Flutter", level: 70 },
      { name: "HTML5/CSS3", level: 85 },
    ],
  },
  {
    title: "AI/ML",
    skills: [
      { name: "Scikit-learn", level: 85 },
      { name: "RF/GB", level: 88 },
      { name: "SMOTE", level: 82 },
      { name: "EDA", level: 80 },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "PostgreSQL", level: 85 },
      { name: "MySQL", level: 80 },
      { name: "MongoDB", level: 70 },
      { name: "SQLite/NeonDB", level: 75 },
    ],
  },
  {
    title: "Data Analysis",
    skills: [
      { name: "Pandas/NumPy", level: 88 },
      { name: "Power BI", level: 78 },
      { name: "Chart.js", level: 70 },
    ],
  },
  {
    title: "Tools",
    skills: [
      { name: "JWT", level: 85 },
      { name: "Razorpay", level: 80 },
      { name: "AWS", level: 65 },
      { name: "Docker", level: 70 },
      { name: "Git", level: 88 },
      { name: "Vercel", level: 82 },
      { name: "Redis", level: 75 },
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function SkillBar({ name, level }: SkillItem) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-themeText-secondary">{name}</span>
        <span className="text-themeText-secondary text-xs">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-themeBg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-themeAccent to-themeSecondary"
        />
      </div>
    </div>
  );
}

export function SkillsBentoGrid() {
  return (
    <section className="py-20 px-4">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-gradient"
      >
        Technical Skills
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.title}
            variants={cardVariants}
            className={`glass rounded-2xl p-6 ${
              cat.title === "Tools" ? "sm:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <h3 className="text-lg font-display font-semibold text-themeText mb-4">
              {cat.title}
            </h3>
            <div className="space-y-3">
              {cat.skills.map((skill) => (
                <SkillBar key={skill.name} {...skill} />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

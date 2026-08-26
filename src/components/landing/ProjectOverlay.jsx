"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const allProjects = [
  {
    title: "India Geo API",
    description: "SaaS REST API serving 619,000+ villages",
    tags: ["Next.js", "NeonDB", "Redis"],
    language: "TypeScript",
    category: ["Backend", "Data"],
    live_url: "https://geo-api-blond.vercel.app",
    github_url: "https://github.com/muhammedfahim438-ctrl/geo-api",
  },
  {
    title: "VitaSense AI",
    description: "98.2% accuracy diabetes prediction",
    tags: ["Python", "Flask", "Scikit-learn"],
    language: "Python",
    category: ["AI/ML", "Backend"],
    github_url: "https://github.com/muhammedfahim438-ctrl/VitaSense-AI-v2",
  },
  {
    title: "UniPath",
    description: "College counselling & wellness mobile app",
    tags: ["Flutter", "Firebase"],
    language: "Dart",
    category: ["Mobile"],
    live_url: "https://unipath-woad.vercel.app",
    github_url: "https://github.com/muhammedfahim438-ctrl/unipath",
  },
  {
    title: "Nifty 100 Platform",
    description: "Nifty 100 stock analysis platform",
    tags: ["Python", "Pandas"],
    language: "Jupyter",
    category: ["Data", "AI/ML"],
    github_url: "https://github.com/muhammedfahim438-ctrl",
  },
  {
    title: "Bluestock MF Platform",
    description: "Mutual fund analysis platform",
    tags: ["Python", "Pandas"],
    language: "Jupyter",
    category: ["Data"],
    github_url: "https://github.com/muhammedfahim438-ctrl",
  },
  {
    title: "NASC Grievance Portal",
    description: "Student grievance redressal system",
    tags: ["Flutter", "Firebase"],
    language: "Dart",
    category: ["Mobile", "Frontend"],
    github_url: "https://github.com/muhammedfahim438-ctrl",
  },
  {
    title: "AI Email Automation",
    description: "Automated email workflows with AI",
    tags: ["n8n", "AI"],
    language: "n8n",
    category: ["AI/ML", "Tools"],
    github_url: "https://github.com/muhammedfahim438-ctrl",
  },
  {
    title: "Aptitude Test Platform",
    description: "Online aptitude testing platform",
    tags: ["HTML", "CSS", "JavaScript"],
    language: "HTML",
    category: ["Frontend"],
    github_url: "https://github.com/muhammedfahim438-ctrl",
  },
  {
    title: "College Website",
    description: "Responsive college website",
    tags: ["JavaScript", "HTML", "CSS"],
    language: "JavaScript",
    category: ["Frontend"],
    github_url: "https://github.com/muhammedfahim438-ctrl",
  },
  {
    title: "Greencycle",
    description: "Sustainable cycling platform",
    tags: ["Web", "JavaScript"],
    language: "Web",
    category: ["Frontend"],
    github_url: "https://github.com/muhammedfahim438-ctrl",
  },
  {
    title: "GreenPulse AI",
    description: "Environmental data analysis tool",
    tags: ["HTML", "Python"],
    language: "HTML",
    category: ["AI/ML", "Frontend"],
    github_url: "https://github.com/muhammedfahim438-ctrl",
  },
  {
    title: "Django Project",
    description: "Full-stack Django web application",
    tags: ["Django", "Python"],
    language: "Django",
    category: ["Backend"],
    github_url: "https://github.com/muhammedfahim438-ctrl",
  },
];

const tabs = ["All", "Backend", "Frontend", "Mobile", "Data", "AI/ML", "Tools"];

export function ProjectOverlay({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("All");

  const filtered =
    activeTab === "All"
      ? allProjects
      : allProjects.filter((p) => p.category.includes(activeTab));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-themeBg/90 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-6xl mx-4 my-8 p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gradient">
                All Projects
              </h2>
              <button
                onClick={onClose}
                className="text-themeText-secondary hover:text-themeText transition-colors p-2"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-themeAccent text-white"
                      : "bg-themeBg-secondary border border-themeBorder text-themeText-secondary hover:border-themeAccent hover:text-themeAccent"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((project) => (
                  <motion.div
                    key={project.title}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="glass rounded-2xl p-6 space-y-4 hover:border-themeAccent/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-display font-semibold text-themeText">
                        {project.title}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-themeBg-secondary border border-themeBorder text-themeText-secondary">
                        {project.language}
                      </span>
                    </div>

                    <p className="text-themeText-secondary text-sm leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-xs bg-themeBg-secondary border border-themeBorder text-themeText-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-linear-to-r from-themeAccent to-themeSecondary text-white text-xs font-medium hover:opacity-90"
                        >
                          <FaExternalLinkAlt className="w-3 h-3" />
                          Live
                        </a>
                      )}
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-themeBorder text-themeText-secondary text-xs font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
                      >
                        <FaGithub className="w-3.5 h-3.5" />
                        Code
                      </a>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

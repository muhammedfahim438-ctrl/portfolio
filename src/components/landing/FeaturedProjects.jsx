"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { ProjectOverlay } from "./ProjectOverlay";

const featuredProjects = [
  {
    title: "India Geo API",
    description: "SaaS REST API serving 619,000+ villages with hierarchical geographic data",
    tags: ["Next.js", "NeonDB", "Redis"],
    live_url: "https://geo-api-blond.vercel.app",
    github_url: "https://github.com/muhammedfahim438-ctrl/geo-api",
  },
  {
    title: "VitaSense AI",
    description: "98.2% accuracy diabetes prediction using ensemble ML models",
    tags: ["Python", "Flask", "Scikit-learn"],
    github_url: "https://github.com/muhammedfahim438-ctrl/VitaSense-AI-v2",
  },
  {
    title: "UniPath",
    description: "College counselling & wellness mobile app for students",
    tags: ["Flutter", "Firebase"],
    live_url: "https://unipath-woad.vercel.app",
    github_url: "https://github.com/muhammedfahim438-ctrl/unipath",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function FeaturedProjects() {
  const [overlayOpen, setOverlayOpen] = useState(false);

  return (
    <>
      <section id="projects" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-themeAccent font-mono text-sm tracking-wider uppercase mb-3">
              Selected Work
            </p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gradient">
              Featured Projects
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredProjects.map((project) => (
              <motion.div
                key={project.title}
                variants={cardVariants}
                className="project-card glass rounded-2xl overflow-hidden group"
              >
                <div className="relative h-52 overflow-hidden">
                  <div className="project-image absolute inset-0 bg-gradient-to-br from-themeAccent/20 to-themeSecondary/20 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-xl bg-themeBg-secondary/50 border border-themeBorder flex items-center justify-center text-3xl font-display font-bold text-themeAccent opacity-60 group-hover:opacity-100 transition-opacity">
                      {project.title.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-themeBg/80 via-transparent to-transparent" />
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-display font-semibold text-themeText">
                    {project.title}
                  </h3>
                  <p className="text-themeText-secondary text-sm leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-themeAccent/10 text-themeAccent border border-themeAccent/20"
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
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-themeAccent text-white text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        <FaExternalLinkAlt className="w-3.5 h-3.5" />
                        Live Demo
                      </a>
                    )}
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
                    >
                      <FaGithub className="w-4 h-4" />
                      GitHub
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => setOverlayOpen(true)}
              className="px-8 py-3 rounded-xl border border-themeBorder text-themeText-secondary hover:border-themeAccent hover:text-themeAccent transition-colors font-medium"
            >
              View All Projects
            </button>
          </motion.div>
        </div>
      </section>

      <ProjectOverlay isOpen={overlayOpen} onClose={() => setOverlayOpen(false)} />
    </>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { getProjects } from "@/lib/firestore";

const TABS = ["All", "Backend", "Frontend", "Mobile", "Data", "AI/ML", "Tools"];

export function ProjectOverlay({ isOpen, onClose, onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const load = useCallback(async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      load();
      setActiveTab("All");
    }
  }, [isOpen, load]);

  const filtered =
    activeTab === "All"
      ? projects
      : projects.filter((p) => p.category === activeTab);

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
              {TABS.map((tab) => (
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

            {loading ? (
              <div className="text-center py-20 text-themeText-secondary">Loading projects…</div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((project) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="glass rounded-2xl overflow-hidden hover:border-themeAccent/30 transition-colors cursor-pointer group"
                      onClick={() => {
                        onClose();
                        onSelectProject?.(project);
                      }}
                      data-cursor-hover
                    >
                      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-themeAccent/20 to-themeSecondary/20 flex items-center justify-center">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <span className="text-3xl font-display font-bold text-themeAccent opacity-50 group-hover:opacity-100 transition-opacity">
                            {project.title.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="text-base font-display font-semibold text-themeText">
                            {project.title}
                          </h3>
                          {project.category && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-themeAccent/15 text-themeAccent shrink-0 ml-2">
                              {project.category}
                            </span>
                          )}
                        </div>

                        <p className="text-themeText-secondary text-xs leading-relaxed line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {(project.tags ?? []).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-[10px] bg-themeBg-secondary border border-themeBorder text-themeText-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                          {project.live_url && (
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-themeAccent text-white text-xs font-medium hover:opacity-90"
                            >
                              <FaExternalLinkAlt className="w-3 h-3" />
                              Live
                            </a>
                          )}
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-themeBorder text-themeText-secondary text-xs font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
                            >
                              <FaGithub className="w-3.5 h-3.5" />
                              Code
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-20 text-themeText-secondary">
                No projects in this category.
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

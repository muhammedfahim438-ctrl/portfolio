"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { getFeaturedProjects } from "@/lib/firestore";
import { ProjectOverlay } from "./ProjectOverlay";
import { ProjectDetailModal } from "./ProjectDetailModal";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [detailProject, setDetailProject] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getFeaturedProjects();
      setProjects(data);
    } catch {
      // silent — fallback to empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openDetail(project) {
    setDetailProject(project);
    setDetailOpen(true);
  }

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

          {loading ? (
            <div className="text-center py-20 text-themeText-secondary">
              Loading projects…
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 text-themeText-secondary">
              No featured projects yet.
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={cardVariants}
                  className="project-card glass rounded-2xl overflow-hidden group cursor-pointer"
                  onClick={() => openDetail(project)}
                  data-cursor-hover
                >
                  <div className="relative h-52 overflow-hidden">
                    <div className="project-image absolute inset-0 bg-gradient-to-br from-themeAccent/20 to-themeSecondary/20 flex items-center justify-center">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-themeBg-secondary/50 border border-themeBorder flex items-center justify-center text-3xl font-display font-bold text-themeAccent opacity-60 group-hover:opacity-100 transition-opacity">
                          {project.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-themeBg/80 via-transparent to-transparent" />
                    {project.category && (
                      <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-themeBg/80 backdrop-blur-sm border border-themeBorder text-themeText-secondary">
                        {project.category}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-display font-semibold text-themeText">
                      {project.title}
                    </h3>
                    <p className="text-themeText-secondary text-sm leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(project.tags ?? []).slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-themeAccent/10 text-themeAccent border border-themeAccent/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
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
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors"
                        >
                          <FaGithub className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

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

      <ProjectOverlay isOpen={overlayOpen} onClose={() => setOverlayOpen(false)} onSelectProject={openDetail} />
      <ProjectDetailModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} project={detailProject} />
    </>
  );
}

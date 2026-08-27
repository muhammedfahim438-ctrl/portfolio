"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFeaturedProjects } from "@/lib/firestore";
import { ProjectOverlay } from "./ProjectOverlay";
import { ProjectDetailModal } from "./ProjectDetailModal";

const MAX_FEATURED = 3;

export function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [detailProject, setDetailProject] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getFeaturedProjects();
      setProjects(data.slice(0, MAX_FEATURED));
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
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 flex flex-col gap-5"
          >
            <p className="theme-eyebrow">Selected Work</p>
            <h2 className="theme-display">
              Latest <em>projects</em>
            </h2>
            <p className="theme-lede">
              Production-grade APIs, ML models, and cross-platform apps built
              for real outcomes — spanning data, backend, and mobile.
            </p>
            <button
              onClick={() => setOverlayOpen(true)}
              className="link-cta"
              data-cursor-hover
            >
              All Works <span aria-hidden>↗</span>
            </button>
          </motion.header>

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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
              className="flex flex-col gap-5"
            >
              {projects.map((project) => (
                <ProjectRow key={project.id} project={project} onOpen={() => openDetail(project)} />
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

const rowVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function ProjectRow({ project, onOpen }) {
  const titleParts = splitTitle(project.title);

  return (
    <motion.button
      variants={rowVariants}
      onClick={onOpen}
      data-cursor-hover
      className="project-row group text-left"
    >
      <div className="project-row__media">
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} loading="lazy" className="project-row__img" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-display font-bold text-themeAccent opacity-60 group-hover:opacity-100 transition-opacity">
            {project.title.charAt(0)}
          </div>
        )}
      </div>

      <div className="project-row__body">
        {(project.tags ?? []).slice(0, 4).length > 0 && (
          <ul className="project-row__tags">
            {(project.tags ?? []).slice(0, 4).map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        <h3 className="project-row__title">
          {titleParts.before}
          {titleParts.em && <em>{titleParts.em}</em>}
          {titleParts.after}
        </h3>
        <p className="project-row__desc">{project.description}</p>
      </div>

      <span className="project-row__arrow" aria-hidden>
        ↗
      </span>
    </motion.button>
  );
}

function splitTitle(title) {
  const words = title.split(" ");
  if (words.length <= 1) return { before: title, em: "", after: "" };
  const emIndex = Math.min(2, words.length - 1);
  return {
    before: words.slice(0, emIndex).join(" ") + " ",
    em: words[emIndex],
    after: " " + words.slice(emIndex + 1).join(" "),
  };
}
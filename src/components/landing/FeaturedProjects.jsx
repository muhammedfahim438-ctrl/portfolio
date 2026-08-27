"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { getFeaturedProjects } from "@/lib/firestore";
import { ProjectOverlay } from "./ProjectOverlay";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { SplitText } from "@/components/ui/SplitText";
import { ScrambleText } from "@/components/ui/ScrambleText";

const MAX_FEATURED = 3;

const rowVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [detailProject, setDetailProject] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 130, damping: 18, mass: 0.4 });
  const py = useSpring(my, { stiffness: 130, damping: 18, mass: 0.4 });

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

  const handleMove = useCallback((e) => {
    mx.set(e.clientX);
    my.set(e.clientY);
  }, [mx, my]);

  const activeProject = activeIdx !== null ? projects[activeIdx] : null;

  return (
    <>
      <section
        id="projects"
        className="py-24 px-5 sm:px-8 lg:px-14"
        onMouseMove={handleMove}
      >
        <div className="mx-auto max-w-[1400px]">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 flex flex-col gap-5"
          >
            <p className="theme-eyebrow">Selected Work</p>
            <SplitText
              text="OUR SIGNATURE WORK"
              accentWord="WORK"
              className="font-display font-bold uppercase leading-[0.95] tracking-tight text-3xl sm:text-4xl md:text-6xl"
            />
            <p className="theme-lede text-themeText-secondary">
              Production-grade APIs, ML models, and cross-platform apps built
              for real outcomes — spanning data, backend, and mobile.
            </p>
            <button
              onClick={() => setOverlayOpen(true)}
              className="link-cta self-start"
              data-cursor-hover
            >
              All Works <span aria-hidden>↗</span>
            </button>
          </motion.header>

          {loading ? (
            <div className="text-center py-24 text-themeText-secondary">
              Loading projects…
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24 text-themeText-secondary">
              No featured projects yet.
            </div>
          ) : (
            <motion.ul
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="flex flex-col"
            >
              {projects.map((project, i) => (
                <motion.li key={project.id} variants={rowVariants} className="group relative border-b border-themeBorder">
                  <div className="pointer-events-none absolute -top-1/2 left-0 h-[220%] w-1/2 rounded-full bg-themeAccent/10 opacity-0 blur-[90px] transition-opacity duration-500 group-hover:opacity-100" />

                  <button
                    onClick={() => openDetail(project)}
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseLeave={() => setActiveIdx(null)}
                    data-cursor-hover
                    className="relative z-10 flex w-full items-center gap-6 py-10 text-left md:gap-12 md:py-14"
                  >
                    <span className="w-10 shrink-0 font-mono text-sm text-themeText-secondary">
                      <ScrambleText
                        text={String(i + 1).padStart(2, "0")}
                        enabled={activeIdx === i}
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-bold uppercase leading-[0.95] tracking-tight text-3xl transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl md:text-6xl lg:text-7xl md:group-hover:translate-x-5">
                        <TitleParts title={project.title} />
                      </h3>

                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-themeText-secondary">
                        {project.category && <span>{project.category}</span>}
                        {(project.tags ?? [])
                          .slice(0, 4)
                          .map((tag) => (
                            <span key={tag} className="flex items-center gap-5">
                              <span className="text-themeAccent" aria-hidden>✦</span>
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>

                    <span
                      className="shrink-0 self-center text-2xl text-themeText-secondary transition-all duration-500 group-hover:rotate-45 group-hover:text-themeAccent md:text-4xl"
                      aria-hidden
                    >
                      ↗
                    </span>
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pt-16"
          >
            <button
              onClick={() => setOverlayOpen(true)}
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-themeAccent to-themeSecondary px-9 py-4 font-display font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
            >
              View All Projects{" "}
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
            </button>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[70] hidden lg:block"
        style={{ x: px, y: py }}
      >
        <motion.div
          animate={{
            opacity: activeProject ? 1 : 0,
            scale: activeProject ? 1 : 0.85,
            rotate: activeProject ? 0 : -8,
          }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className="h-96 w-80 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-themeBorder bg-themeSurface shadow-2xl"
        >
          {activeProject?.image_url ? (
            <img
              src={activeProject.image_url}
              alt={activeProject.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-themeAccent/25 to-themeSecondary/25 font-display text-6xl font-bold text-themeAccent">
              {activeProject ? activeProject.title.charAt(0) : ""}
            </div>
          )}
        </motion.div>
      </motion.div>

      <ProjectOverlay isOpen={overlayOpen} onClose={() => setOverlayOpen(false)} onSelectProject={openDetail} />
      <ProjectDetailModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} project={detailProject} />
    </>
  );
}

function TitleParts({ title }) {
  const words = title.split(" ");
  if (words.length <= 1) {
    return <>{title}</>;
  }
  const emIndex = Math.min(2, words.length - 1);
  const before = words.slice(0, emIndex).join(" ");
  const em = words[emIndex];
  const after = words.slice(emIndex + 1).join(" ");
  return (
    <>
      {before}{" "}
      <em className="accent-word text-shimmer">{em}</em>
      {after && <> {after}</>}
    </>
  );
}
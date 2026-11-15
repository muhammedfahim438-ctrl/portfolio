"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { getProjects } from "@/lib/firestore";
import { EntranceReveal } from "@/components/ui/EntranceReveal";

const rowVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getProjects();
      const ordered = [...data].sort(
        (a, b) => Number(b.featured === true) - Number(a.featured === true)
      );
      setProjects(ordered);
    } catch {
      // silent, fallback handled by empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const featured = projects.slice(0, 6);

  return (
    <section id="work" className="overflow-hidden border-t border-themeBorder/40 bg-themeBg py-24 px-4">
      <div className="mx-auto max-w-[1400px]">
        <EntranceReveal variant="slide" delay={0} className="mb-20 text-start max-w-4xl">
          <div className="mb-6 flex items-center gap-3 border-l-2 border-themeAccent pl-4 dg-corner dg-corner--red">
            <span className="dg-ui-mono text-xs uppercase tracking-[0.3em] text-themeAccent">
              Selected work
            </span>
          </div>

          <h2
            className="h2 dg-f-display text-themeText dg-glitch dg-corner dg-corner--blue"
            data-text="Work that ships"
          >
            Work that ships
          </h2>

          <p className="dg-f-subhead mt-6 max-w-lg text-lg leading-relaxed text-themeTextSecondary">
            Production APIs, machine learning models, and cross-platform apps built for real outcomes. Six case studies below.
          </p>
        </EntranceReveal>

        {loading ? (
          <div className="py-24 text-center text-themeTextSecondary">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center text-themeTextSecondary">No projects yet.</div>
        ) : (
          <>
            <EntranceReveal variant="fade" delay={0.1} className="grid grid-cols-1 gap-3 grid-flow-dense sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  variants={rowVariants}
                  className={i % 3 === 0 ? "lg:col-span-2" : ""}
                >
                  <CaseStudyCard project={p} />
                </motion.div>
              ))}
            </EntranceReveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-10 text-center"
            >
              <a href="#contact" className="btn btn--primary dg-border-neon-red">
                GET IN TOUCH <FiArrowRight className="ml-1.5 w-4 h-4" />
              </a>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

function CaseStudyCard({ project }) {
  const isFeatured = project.featured === true;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden border-2 border-themeBorder/60 bg-themeSurface/10 p-5 dg-r-0 dg-corner dg-corner--red"
      data-cursor-hover
    >
      <div className="absolute top-0 left-0 z-10 h-6 w-6 bg-themeAccent" />

      <div className="relative mb-4 h-48 overflow-hidden border-b border-themeBorder/60 bg-themeBg-secondary/20 dg-r-0">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-themeAccent/10">
            <span className="dg-f-display text-5xl font-bold uppercase text-themeAccent/30">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        {isFeatured && (
          <span className="dg-ui-mono absolute top-2 right-2 border border-themeWarn bg-themeBg/80 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-themeWarn backdrop-blur-sm">
            Featured
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="dg-ui-mono mb-1 flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-themeTextSecondary">
          <span className="text-themeAccent">{project.category}</span>
          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <span className="opacity-60">{project.tags[0]}</span>
          )}
        </div>

        <h3 className="dg-f-subhead text-xl font-bold leading-[1.1] tracking-tight text-themeText transition-colors group-hover:text-themeAccent">
          {project.title}
        </h3>

        {project.description && (
          <p className="dg-f-subhead line-clamp-2 text-sm leading-relaxed text-themeTextSecondary/80">
            {project.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(project.tags ?? []).slice(0, 4).map((t) => (
            <span
              key={t}
              className="dg-ui-mono border border-themeAccent/40 bg-themeAccent/15 px-2.5 py-1 text-[9px] uppercase text-themeText"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="dg-ui-mono mt-4 flex items-center gap-1 text-[10px] text-themeAccent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span>&rarr;</span>
          <span className="text-themeTextSecondary">
            {project.live_url ? "Open live site" : "View case study"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { getProjects } from "@/lib/firestore";


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
      setProjects(data.sort(() => 0.5 - Math.random()));
    } catch {
      // silent
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
    <section id="work" className="py-24 px-4 border-t border-themeBorder/40 bg-themeBg/60 backdrop-blur-sm overflow-hidden dg-glass dg-r-xl dg-border-hairline">
      <div className="mx-auto max-w-[1400px]">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-20 text-start max-w-4xl"
        >
          <div className="flex items-center gap-3 border-l-2 border-themeAccent pl-4 mb-6 dg-corner dg-corner--red">
            <span className="text-themeAccent font-mono text-xs tracking-[0.3em] uppercase dg-ui-mono">
              Selected Work
            </span>
          </div>

          <h2 className="h2 dg-f-display text-themeText uppercase dg-glitch dg-corner dg-corner--blue" data-text="Work That Ships">
            Work That Ships
          </h2>

          <p className="dg-f-subhead text-themeTextSecondary leading-relaxed text-lg max-w-lg mt-6">
            Production-grade APIs, machine learning models, and cross-platform applications — built for real outcomes. Case studies below.
          </p>
        </motion.header>

        {loading ? (
          <div className="text-center py-24 text-themeTextSecondary">Loading projects…</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 text-themeTextSecondary">No projects yet.</div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 grid-flow-dense"
            >
              {featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  variants={rowVariants}
                  style={i % 3 === 0 ? { gridColumn: "span 2" } : {}}
                  className="group cursor-pointer"
                >
                  <CaseStudyCard project={p} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center pt-10"
            >
              <a
                href="#contact"
                className="btn btn--primary dg-border-neon-red"
              >
                Hire Me <FiExternalLink className="w-4 h-4 ml-1.5" />
              </a>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

function CaseStudyCard({ project }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="relative p-5 border border-themeBorder/60 bg-themeSurface/10 backdrop-blur-sm group overflow-hidden dg-r-lg dg-corner dg-corner--red"
      data-cursor-hover
    >
      <div className="absolute top-0 left-0 w-6 h-6 bg-themeAccent z-10" />
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-themeAccent/30 group-hover:bg-themeAccent/80 transition-all duration-300 rounded-md" />

      <div className="relative h-48 overflow-hidden mb-4 bg-themeBgSecondary/20 border-b border-themeBorder/60 backdrop-blur-sm rounded-lg overflow-hidden">
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-themeAccent/10 backdrop-blur-sm">
            <span className="font-display text-5xl font-black text-themeAccent/30 uppercase">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary mb-1 dg-ui-mono">
          <span className="text-themeAccent">{project.category}</span>
          <span className="opacity-60">· {project.type || "WEB"}</span>
        </div>

        <h3 className="font-display font-bold text-xl leading-[1.1] tracking-tight text-themeText group-hover:text-themeAccent transition-colors">
          {project.title}
        </h3>

        {project.description && (
          <p className="dg-f-subhead text-sm text-themeTextSecondary/80 leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {(project.tags ?? []).slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 text-[9px] font-mono uppercase bg-themeAccent/15 text-themeText border border-themeAccent/40 backdrop-blur-sm rounded-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-1 font-mono text-[10px] text-themeAccent opacity-0 group-hover:opacity-100 transition-opacity duration-300 dg-ui-mono">
          <span>→</span>
          <span className="text-themeTextSecondary">CASE STUDY</span>
        </div>
      </div>
    </motion.div>
  );
}

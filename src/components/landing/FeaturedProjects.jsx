"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiGithub, FiExternalLink } from "react-icons/fi";
import { getProjects } from "@/lib/firestore";
import { SplitText } from "@/components/ui/SplitText";

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
    <>
      <section id="work" className="py-20 px-4 border-t border-themeBorder bg-themeBg overflow-hidden">
        <div className="mx-auto max-w-[1400px]">
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16 text-start max-w-4xl"
          >
            <div className="flex items-center gap-3 border-l-4 border-themeAccent pl-4 mb-4">
              <span className="text-themeAccent font-mono text-xs tracking-[0.3em] uppercase">
                Selected Work
              </span>
            </div>

            <SplitText
              text="Work That Ships"
              accentWord="Ships"
              className="font-display font-black uppercase leading-[0.95] tracking-[-0.02em] text-[clamp(2rem,6vw,3rem)] text-themeText"
            />

            <p className="text-themeText-secondary leading-relaxed text-base max-w-lg mt-4">
              Production-grade APIs, machine learning models, and cross-platform applications —
              built for real outcomes. Case studies below.
            </p>
          </motion.header>

          {loading ? (
            <div className="text-center py-24 text-themeText-secondary">Loading projects…</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24 text-themeText-secondary">No projects yet.</div>
          ) : (
            <>
              {/* World-class case study grid - gapless bento */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grid-flow-dense"
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
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-none border-2 border-themeAccent bg-themeAccent text-themeText font-display font-semibold hover:bg-themeAccent-hover hover:text-themeText transition-colors"
                >
                  Hire Me
                  <FiExternalLink className="w-4 h-4 ml-1.5" />
                </a>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function CaseStudyCard({ project }) {
  const ref = useRef(null);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4 }}
      className="relative p-5 border-2 border-themeBorder bg-themeSurface/20 group overflow-hidden"
      data-cursor-hover
    >
      {/* Top-left corner accent */}
      <div className="absolute top-0 left-0 w-6 h-6 bg-themeAccent z-10" />
      {/* Bottom-right corner accent on hover */}
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-themeAccent/20 group-hover:bg-themeAccent transition-all duration-300" />

      {/* Media area */}
      <div className="relative h-48 overflow-hidden mb-4 bg-themeBgSecondary border-b-2 border-themeBorder">
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-themeAccent/8 to-themeAccent-hover/8">
            <span className="font-display text-5xl font-black text-themeAccent/15 uppercase">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-themeText-secondary mb-1">
          <span className="text-themeAccent">{project.category}</span>
          <span className="opacity-60">· {project.type || "WEB"}</span>
        </div>

        <h3 className="font-display font-bold text-xl leading-[1.1] tracking-tight text-themeText group-hover:text-themeAccent transition-colors">
          {project.title}
        </h3>

        {project.description && (
          <p className="text-sm text-themeText-secondary/80 leading-relaxed line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Tech tags - dense metadata */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(project.tags ?? []).slice(0, 4).map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 text-[9px] font-mono uppercase bg-themeAccent/5 text-themeAccent border border-themeAccent/20 rounded-none"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Case study arrow - brutalist directional */}
        <div className="mt-4 flex items-center gap-1 font-mono text-[10px] text-themeAccent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>→</span>
          <span className="text-themeText-secondary">CASE STUDY</span>
        </div>
      </div>
    </motion.div>
  );
}

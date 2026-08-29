"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { getProjects } from "@/lib/firestore";
import { ProjectOverlay } from "./ProjectOverlay";
import { ProjectDetailModal } from "./ProjectDetailModal";
import { SplitText } from "@/components/ui/SplitText";
import { ScrambleText } from "@/components/ui/ScrambleText";

const rowVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const TYPE_HINT = {
  mobile: "Flutter · App",
  data: "ETL · BI",
  ml: "ML · Models",
  backend: "API · Django",
  web: "Web · Frontend",
};

export function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [detailProject, setDetailProject] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

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
    load();
  }, [load]);

  function openDetail(project) {
    setDetailProject(project);
    setDetailOpen(true);
  }

  const spotlight = projects.slice(0, 6);
  const rail = projects.slice(6, 12);
  const caseStudies = projects.slice(0, 4);

  return (
    <>
      <section id="work" className="py-24 px-5 sm:px-8 lg:px-14 overflow-hidden">
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
              text="WORK THAT SHIPS"
              accentWord="SHIPS"
              className="font-display font-bold uppercase leading-[0.95] tracking-tight text-3xl sm:text-4xl md:text-6xl"
            />
            <p className="theme-lede text-themeText-secondary max-w-xl">
              Production-grade APIs, ML models, and cross-platform apps. Hover, tilt, and
              explore — or open any project for the full case study.
            </p>
          </motion.header>

          {loading ? (
            <div className="text-center py-24 text-themeText-secondary">Loading projects…</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24 text-themeText-secondary">No projects yet.</div>
          ) : (
            <>
              {/* ---- Zone 1: Cinematic bento grid with 3D tilt + spotlight ---- */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {spotlight.map((p, i) => (
                  <motion.div
                    key={p.id}
                    variants={rowVariants}
                    className={i < 2 ? "sm:col-span-1 lg:col-span-1" : ""}
                  >
                    <BentoCard project={p} index={i} onClick={() => openDetail(p)} />
                  </motion.div>
                ))}
              </motion.div>

              {/* ---- Zone 2: Horizontal scroll showcase strip ---- */}
              {rail.length > 0 && (
                <div className="mt-20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="theme-eyebrow">More from the shelf</h3>
                    <span className="font-mono text-[11px] uppercase text-themeText-secondary">
                      drag → scroll
                    </span>
                  </div>
                  <div className="relative">
                    <div className="flex gap-5 overflow-x-auto scrollbar-none pb-4 snap-x snap-mandatory">
                      {rail.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => openDetail(p)}
                          className="snap-start shrink-0 w-[280px] sm:w-[320px] rounded-2xl overflow-hidden border border-themeBorder bg-themeSurface cursor-pointer group hover:border-themeAccent/50 transition-colors"
                          data-cursor-hover
                        >
                          <div className="relative h-40 overflow-hidden">
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-themeAccent/25 to-themeSecondary/20">
                                <span className="font-display text-5xl font-bold text-themeAccent/50 group-hover:text-themeAccent transition-colors">
                                  {p.title.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-themeBg/80 to-transparent" />
                          </div>
                          <div className="p-5">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-display font-semibold text-lg text-themeText">{p.title}</h4>
                              <FiArrowUpRight className="w-4 h-4 text-themeText-secondary group-hover:text-themeAccent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                            </div>
                            {p.description && (
                              <p className="mt-1 text-xs text-themeText-secondary line-clamp-2">{p.description}</p>
                            )}
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {(p.tags ?? []).slice(0, 3).map((t) => (
                                <span key={t} className="px-2 py-0.5 text-[10px] font-mono uppercase bg-themeAccent/10 text-themeAccent rounded-full">{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ---- Zone 3: Case-study numbered rows ---- */}
              <div className="mt-20">
                <h3 className="theme-eyebrow mb-8">Case Studies</h3>
                <motion.ul
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                  className="flex flex-col"
                >
                  {caseStudies.map((project, i) => (
                    <CaseRow key={project.id} project={project} index={i} onClick={() => openDetail(project)} />
                  ))}
                </motion.ul>
              </div>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center pt-16"
          >
            <button
              onClick={() => setOverlayOpen(true)}
              className="group inline-flex items-center gap-3 rounded-full bg-linear-to-r from-themeAccent to-themeSecondary px-9 py-4 font-display font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
            >
              View All Projects{" "}
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
            </button>
          </motion.div>
        </div>
      </section>

      <ProjectOverlay isOpen={overlayOpen} onClose={() => setOverlayOpen(false)} onSelectProject={openDetail} />
      <ProjectDetailModal isOpen={detailOpen} onClose={() => setDetailOpen(false)} project={detailProject} />
    </>
  );
}

function BentoCard({ project, index, onClick }) {
  const ref = useRef(null);
  const cx = useMotionValue(0.5);
  const cy = useMotionValue(0.5);
  const rX = useSpring(useTransform(cy, [0, 1], [10, -10]), { stiffness: 200, damping: 20 });
  const rY = useSpring(useTransform(cx, [0, 1], [-12, 12]), { stiffness: 200, damping: 20 });
  const sX = useTransform(cx, [0, 1], [30, 70]);
  const sY = useTransform(cy, [0, 1], [25, 75]);

  function move(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    cx.set((e.clientX - r.left) / r.width);
    cy.set((e.clientY - r.top) / r.height);
  }

  const big = index < 2;

  return (
    <motion.button
      ref={ref}
      onMouseMove={move}
      onMouseLeave={() => { cx.set(0.5); cy.set(0.5); }}
      onClick={onClick}
      whileHover={{ y: -4 }}
      style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" }}
      className="prem-card group relative block w-full text-left cursor-pointer"
      data-cursor-hover
    >
      {/* spotlight follows cursor */}
      <motion.div
        aria-hidden="true"
        className="spotlight"
        style={{ left: sX, top: sY, width: 260, height: 260, translateX: "-50%", translateY: "-50%" }}
      />

      <div className={`relative overflow-hidden ${big ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-square"}`}>
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-linear-to-br from-themeAccent/25 via-themeBg-secondary to-themeSecondary/20">
            <span className="font-display font-bold text-6xl sm:text-7xl text-themeAccent/30 group-hover:text-themeAccent/60 transition-colors">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-themeBg/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

        {/* index number */}
        <span className="absolute top-4 left-4 font-mono text-sm text-themeAccent">
          <ScrambleText text={String(index + 1).padStart(2, "0")} enabled={false} />
        </span>

        {/* open arrow */}
        <span className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-themeBg/60 border border-themeBorder text-themeText-secondary opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 group-hover:text-themeAccent">
          <FiArrowUpRight className="w-5 h-5" />
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-themeText-secondary mb-1.5">
          {project.category && <span className="text-themeAccent">{project.category}</span>}
          {project.type && <span className="opacity-70">· {TYPE_HINT[project.type] ?? project.type}</span>}
        </div>
        <h3 className="font-display font-bold text-2xl sm:text-[1.7rem] leading-tight text-themeText">{project.title}</h3>
        {project.description && (
          <p className="mt-1 text-sm text-themeText-secondary line-clamp-1 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-300">
            {project.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(project.tags ?? []).slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 text-[10px] font-mono uppercase bg-themeAccent/12 text-themeAccent border border-themeAccent/20 rounded-full">{t}</span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

function CaseRow({ project, index, onClick }) {
  return (
    <motion.li variants={rowVariants} className="group relative border-b border-themeBorder">
      <div className="pointer-events-none absolute -top-1/2 left-0 h-[220%] w-1/2 rounded-full bg-themeAccent/10 opacity-0 blur-[90px] transition-opacity duration-500 group-hover:opacity-100" />
      <button
        onClick={onClick}
        data-cursor-hover
        className="relative z-10 flex w-full items-center gap-6 py-10 text-left md:gap-12 md:py-14"
      >
        <span className="w-10 shrink-0 font-mono text-sm text-themeText-secondary">
          <ScrambleText text={String(index + 1).padStart(2, "0")} enabled={false} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold uppercase leading-[0.95] tracking-tight text-3xl transition-transform duration-500 group-hover:translate-x-2 sm:text-4xl md:text-5xl">
            <CaseTitle title={project.title} />
          </h3>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-themeText-secondary">
            {project.category && <span>{project.category}</span>}
            {(project.tags ?? []).slice(0, 4).map((tag) => (
              <span key={tag} className="flex items-center gap-5">
                <span className="text-themeAccent" aria-hidden>✦</span>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <span className="shrink-0 self-center text-2xl text-themeText-secondary transition-all duration-500 group-hover:rotate-45 group-hover:text-themeAccent md:text-4xl" aria-hidden>
          ↗
        </span>
      </button>
    </motion.li>
  );
}

function CaseTitle({ title }) {
  const words = title.split(" ");
  if (words.length <= 1) return <>{title}</>;
  const emIndex = Math.min(2, words.length - 1);
  return (
    <>
      {words.slice(0, emIndex).join(" ")}{" "}
      <em className="emb-text">{words[emIndex]}</em>
      {words.slice(emIndex + 1).length > 0 && <> {words.slice(emIndex + 1).join(" ")}</>}
    </>
  );
}

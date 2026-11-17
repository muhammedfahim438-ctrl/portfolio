"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { getProjects } from "@/lib/firestore";
import { safeUrl } from "@/lib/safeUrl";
import { useBrandContent } from "@/hooks/useBrandContent";
import { EntranceReveal } from "@/components/ui/EntranceReveal";
import { Tilt3D } from "@/components/ui/Tilt3D";

export function FeaturedProjects() {
  const { sections } = useBrandContent();
  const copy = sections?.work || {};
  const loadingText = sections?.work?.loading || "Loading projects...";
  const emptyText = sections?.work?.empty || "No projects yet.";
  const errorText = sections?.work?.error || "Projects are unavailable right now.";
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getProjects();
      const ordered = [...data].sort(
        (a, b) => Number(b.featured === true) - Number(a.featured === true)
      );
      setProjects(ordered);
      setError(false);
    } catch {
      setError(true);
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
    <section id="work" className="dg-screen scroll-mt-24 overflow-hidden border-t border-themeBorder/40 py-24 px-4">
      <div className="mx-auto max-w-[87.5rem]">
        <EntranceReveal variant="slide" delay={0} className="mb-20 text-start max-w-4xl">
          <div className="mb-6 flex items-center gap-3 border-l-2 border-themeAccent pl-4 dg-corner">
            <span className="dg-ui-mono text-xs uppercase tracking-[0.3em] text-themeAccentText">
              {copy.label}
            </span>
          </div>

          <h2
            aria-label={copy.heading}
            className="h2 dg-f-display text-themeText dg-glitch dg-corner dg-corner--signal"
            data-text={copy.heading}
          >
            {copy.heading}
          </h2>

          <p className="dg-f-subhead mt-6 max-w-xl text-lg leading-relaxed text-themeTextSecondary">
            {copy.subhead}
          </p>
        </EntranceReveal>

        {loading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            <span className="sr-only">{loadingText}</span>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                aria-hidden="true"
                className="h-96 animate-pulse border-2 border-themeBorder/40 bg-themeSurface/20"
              />
            ))}
          </div>
        ) : error ? (
          <div role="status" className="py-24 text-center text-themeTextSecondary">{errorText}</div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center text-themeTextSecondary">{emptyText}</div>
        ) : (
          <>
            <EntranceReveal variant="fade" delay={0.1} className="grid grid-cols-1 gap-3 grid-flow-dense sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <Tilt3D
                  key={p.id}
                  maxRotate={4}
                  perspective={800}
                  scale={1.01}
                  className={i % 3 === 0 ? "lg:col-span-2" : ""}
                >
                  <CaseStudyCard project={p} />
                </Tilt3D>
              ))}
            </EntranceReveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-10 text-center"
            >
              <a href={safeUrl(copy.ctaHref, "#contact")} className="btn btn--primary dg-border-neon-red">
                {copy.ctaLabel} <FiArrowRight className="ml-1.5 w-4 h-4" />
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
  const href = safeUrl(project.live_url || project.github_url);
  const imageUrl = safeUrl(project.image_url);
  const linkLabel = project.live_url ? "Open live site" : "View repository";

  const body = (
    <>
      <div className="absolute top-0 left-0 z-10 h-6 w-6 bg-themeAccent" />

      <div className="relative mb-4 h-48 overflow-hidden border-b border-themeBorder/60 bg-themeBg-secondary/20 dg-r-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-themeAccent/10">
            <span className="dg-f-logo text-5xl font-bold uppercase text-themeAccentText/30">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        {isFeatured && (
          <span className="dg-ui-mono absolute top-2 right-2 border border-themeWarn bg-themeBg/80 px-2 py-1 text-[0.5625rem] font-bold uppercase tracking-widest text-themeWarn backdrop-blur-sm">
            Featured
          </span>
        )}
      </div>

      <div className="space-y-2">
        <div className="dg-ui-mono mb-1 flex items-center justify-between gap-2 text-[0.625rem] uppercase tracking-wider text-themeTextSecondary">
          <span className="text-themeAccentText">{project.category}</span>
          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <span className="opacity-60">{project.tags[0]}</span>
          )}
        </div>

        <h3 className="dg-f-subhead text-xl font-bold leading-[1.1] tracking-tight text-themeText transition-colors group-hover:text-themeAccentText">
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
              className="dg-ui-mono border border-themeAccent/40 bg-themeAccent/15 px-2.5 py-1 text-[0.5625rem] uppercase text-themeText"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="dg-ui-mono mt-4 flex items-center gap-1 text-[0.625rem] text-themeAccentText opacity-80 transition-opacity duration-300 group-hover:opacity-100">
          <span>&rarr;</span>
          <span className="text-themeTextSecondary">{linkLabel}</span>
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="dg-sheen group relative h-full w-full overflow-hidden border-2 border-themeBorder/60 bg-themeSurface/15 p-5 backdrop-blur-sm dg-r-0 dg-corner"
      data-cursor-hover
    >
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          aria-label={`${project.title} — ${linkLabel}`}
        >
          {body}
        </a>
      ) : (
        body
      )}
    </motion.div>
  );
}

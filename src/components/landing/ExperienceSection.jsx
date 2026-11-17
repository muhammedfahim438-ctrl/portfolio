"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCollection } from "@/lib/firestore";
import { useBrandContent } from "@/hooks/useBrandContent";
import { DEFAULT_EXPERIENCE } from "@/data/brandDefaults";
import { EntranceReveal } from "@/components/ui/EntranceReveal";
import { ParallaxLayers } from "@/components/ui/ParallaxLayers";

const byOrder = (a, b) => (a.order ?? 99) - (b.order ?? 99);

export function ExperienceSection() {
  const { sections } = useBrandContent();
  const copy = sections.experience || {};
  const [items, setItems] = useState(DEFAULT_EXPERIENCE);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getCollection("experience");
        if (!mounted || !Array.isArray(data) || data.length === 0) return;
        setItems([...data].sort(byOrder));
      } catch {
        // keep the bundled fallback
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="experience"
      className="dg-screen relative scroll-mt-24 overflow-hidden border-t border-themeBorder/40 py-24 px-4"
    >
      {/* Ambient parallax glow over the dot HUD */}
      <div className="absolute inset-0" aria-hidden="true">
        <ParallaxLayers className="h-full w-full">
          <div className="absolute inset-0">
            <div className="absolute -right-28 top-1/4 h-80 w-80 bg-themeAccent/10 blur-3xl" />
          </div>
        </ParallaxLayers>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <EntranceReveal variant="slide" delay={0} className="mb-14 max-w-4xl">
          <div className="mb-6 flex items-center gap-3 border-l-2 border-themeAccent pl-4 dg-corner">
            <span className="dg-ui-mono text-xs uppercase tracking-[0.3em] text-themeAccentText">
              {copy.label}
            </span>
          </div>

          <h2
            aria-label={copy.heading}
            className="h2 dg-f-display dg-glitch text-themeText dg-corner dg-corner--signal"
            data-text={copy.heading}
          >
            {copy.heading}
          </h2>

          <p className="dg-f-subhead mt-6 max-w-2xl text-lg leading-relaxed text-themeTextSecondary">
            {copy.subhead}
          </p>
        </EntranceReveal>

        <div className="grid gap-px border-2 border-themeBorder bg-themeBorder">
          {items.map((item, index) => (
            <motion.article
              key={item.id ?? `${item.org}-${item.title}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="dg-sheen grid gap-6 bg-themeBg/55 p-8 lg:grid-cols-12 lg:p-10"
            >
              <div className="lg:col-span-3">
                <p className="dg-ui-mono text-xs font-bold uppercase tracking-[0.25em] text-themeAccentText">
                  {item.period}
                </p>
                {item.location && (
                  <p className="dg-ui-mono mt-2 text-[0.625rem] uppercase tracking-[0.2em] text-themeTextSecondary">
                    {item.location}
                  </p>
                )}
                {item.tag && (
                  <span className="dg-ui-mono mt-4 inline-block border border-themeWarn px-2 py-1 text-[0.5625rem] font-bold uppercase tracking-[0.2em] text-themeWarn">
                    {item.tag}
                  </span>
                )}
              </div>

              <div className="lg:col-span-9">
                <h3 className="dg-f-subhead text-2xl font-bold leading-tight tracking-tight text-themeText">
                  {item.title}
                </h3>
                <p className="dg-ui-mono mt-1.5 text-xs font-bold uppercase tracking-[0.2em] text-themeAccentText">
                  {item.org}
                </p>

                {Array.isArray(item.points) && item.points.length > 0 && (
                  <ul className="mt-5 space-y-3">
                    {item.points.filter(Boolean).map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-sm leading-relaxed text-themeTextSecondary"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 bg-themeAccent"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {Array.isArray(item.tools) && item.tools.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {item.tools.filter(Boolean).map((tool) => (
                      <span
                        key={tool}
                        className="dg-ui-mono border border-themeBorder px-2.5 py-1 text-[0.5625rem] uppercase tracking-[0.15em] text-themeTextSecondary"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {copy.educationLine && (
          <EntranceReveal variant="fade" delay={0.1}>
            <div className="mt-6 flex flex-col gap-2 border-l-2 border-themeBorder pl-4 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="dg-ui-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-themeTextSecondary">
                {copy.educationLabel}
              </span>
              <span className="dg-ui-mono text-xs font-bold uppercase tracking-[0.15em] text-themeText">
                {copy.educationLine}
              </span>
            </div>
          </EntranceReveal>
        )}
      </div>
    </section>
  );
}

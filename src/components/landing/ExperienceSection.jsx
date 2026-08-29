"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getCollection } from "@/lib/firestore";

const EXPERIENCE = [
  {
    period: "2026 — Present",
    title: "Full Stack Developer Intern",
    org: "TechFifo",
    tag: "Career",
    points: [
      "Building production-grade web applications across the full stack.",
      "Shipping REST APIs, frontend interfaces, and database-backed features.",
    ],
  },
  {
    period: "2026 — Present",
    title: "Data Analyst Intern",
    org: "Bluestock Fintech",
    tag: "Data",
    points: [
      "Mutual fund analytics platform — Python ETL, PostgreSQL, and Power BI.",
      "Cleaned real-world Excel datasets and delivered interactive dashboards.",
    ],
  },
  {
    period: "2025 — 2026",
    title: "BSc Data Science",
    org: "Nehru Arts & Science College · CGPA 8.17",
    tag: "Education",
    points: [
      "Foundations in statistics, machine learning, and full-stack development.",
      "Built academic projects including UniPath and the NASC grievance portal.",
    ],
  },
  {
    period: "2024 — 2025",
    title: "Leveling Up",
    org: "Self-directed · Open Source",
    tag: "Growth",
    points: [
      "Shipped 13+ public repositories, from SaaS APIs to ML platforms.",
      "Mastered Django, React, Flutter, and applied ML across real datasets.",
    ],
  },
];

export function ExperienceSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.6"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const [items, setItems] = useState(EXPERIENCE);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getCollection("experience");
        if (mounted && Array.isArray(data) && data.length) setItems(data);
      } catch {
        // static fallback
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section id="experience" className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="theme-eyebrow mb-3">$ cat experience.log</p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold uppercase leading-[0.95] tracking-tight text-3xl sm:text-4xl md:text-6xl"
          >
            Experience <em className="accent-word text-shimmer">~ Timeline</em>
          </motion.h2>
        </motion.div>

        <div ref={ref} className="relative">
          <div className="absolute left-[7px] top-0 bottom-0 w-px bg-themeBorder sm:left-1/2 sm:-translate-x-px" />
          <motion.div
            className="absolute left-[7px] top-0 w-px bg-themeAccent sm:left-1/2 sm:-translate-x-px"
            style={{ height: lineHeight, boxShadow: "0 0 12px rgba(255,45,45,0.4)" }}
          />

          <div className="space-y-12 sm:space-y-16">
            {items.map((item, i) => {
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: 0.05 }}
                  className={`relative pl-10 sm:w-1/2 sm:pl-0 ${
                    left
                      ? "sm:pr-14 sm:text-right"
                      : "sm:ml-auto sm:pl-14"
                  }`}
                >
                  <span
                    className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-themeAccent bg-themeBg sm:left-auto"
                    style={{
                      ...(left
                        ? { right: "-8px", left: "auto", boxShadow: "0 0 0 4px var(--themeBg)" }
                        : { left: "-8px", boxShadow: "0 0 0 4px var(--themeBg)" }),
                    }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-themeAccent" />
                  </span>

                  <div className="crt-glow rounded-2xl border border-themeBorder bg-themeSurface/70 p-6 backdrop-blur-sm">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-themeAccent/30 bg-themeAccent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-themeAccent">
                        {item.tag}
                      </span>
                      <span className="font-mono text-xs text-themeText-secondary">
                        {item.period}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-themeText sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-mono text-sm text-themeAccent">{item.org}</p>
                    <ul
                      className={`mt-4 space-y-2 text-sm leading-relaxed text-themeText-secondary ${
                        left ? "sm:ml-auto" : ""
                      }`}
                    >
                      {(item.points ?? []).map((p) => (
                        <li key={p} className={left ? "sm:text-right" : ""}>
                          <span className="mr-2 text-themeAccent" aria-hidden>
                            ▸
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

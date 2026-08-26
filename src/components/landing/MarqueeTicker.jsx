"use client";

import { motion } from "framer-motion";

const MARQUEE_ITEMS = [
  "Data Science",
  "Full-Stack Development",
  "Machine Learning",
  "REST APIs",
  "Python",
  "Django",
  "React.js",
  "Flutter",
  "PostgreSQL",
  "Power BI",
  "Docker",
  "AWS",
  "ETL Pipelines",
  "Scikit-learn",
];

export function MarqueeTicker() {
  return (
    <section className="py-8 border-y border-themeBorder overflow-hidden">
      <div className="relative whitespace-nowrap">
        <div className="animate-marquee inline-flex gap-8">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="text-sm md:text-base font-mono tracking-wider text-themeText-secondary/60 select-none uppercase"
            >
              {item}
              <span className="mx-4 text-themeAccent/40">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCollection } from "@/lib/firestore";

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
  const [items, setItems] = useState(MARQUEE_ITEMS);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getCollection("marquee");
        if (mounted && Array.isArray(data) && data.length) {
          setItems(data.map((d) => (typeof d === "string" ? d : d.text || d.title || "")).filter(Boolean));
        }
      } catch {
        // static fallback
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="py-8 border-y border-themeBorder overflow-hidden">
      <div className="relative whitespace-nowrap">
        <div className="animate-marquee inline-flex gap-8">
          {[...items, ...items].map((item, i) => (
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

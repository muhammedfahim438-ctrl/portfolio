"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCollection } from "@/lib/firestore";

const LOG = [
  { type: "building", tag: "BUILD", text: "Production SaaS APIs with Django + DRF, Redis, and PostgreSQL." },
  { type: "learning", tag: "LEARN", text: "Deepening ML engineering — ensembles, feature engineering, deployment." },
  { type: "shipping", tag: "SHIP", text: "Cross-platform apps with Flutter and seamless Firebase integrations." },
  { type: "exploring", tag: "TRY", text: "n8n automation, LLM workflows, and data pipelines with Power BI." },
  { type: "open", tag: "OSS", text: "Maintaining 13+ open-source repos and writing clean, documented code." },
];

export function NowSection() {
  const [items, setItems] = useState(LOG);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getCollection("now_log");
        if (mounted && Array.isArray(data) && data.length) setItems(data);
      } catch {
        // static fallback
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <section id="now" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="theme-eyebrow mb-3">~/.now</p>
          <h2 className="font-display font-bold uppercase leading-[0.95] tracking-tight text-3xl sm:text-4xl md:text-6xl">
            Current <em className="accent-word text-shimmer">Stack</em>
          </h2>
          <p className="theme-lede mt-4 text-themeText-secondary">
            What I&apos;m building, learning, and exploring right now.
          </p>
        </motion.div>

        <div className="term-win">
          <div className="term-win__bar">
            <span className="term-win__dot term-win__dot--red" />
            <span className="term-win__dot term-win__dot--yellow" />
            <span className="term-win__dot term-win__dot--green" />
            <span className="ml-2 font-mono text-[11px] text-themeText-secondary">
              fahim@dev:~$ ./status.sh --live
            </span>
          </div>

          <div className="divide-y divide-themeBorder font-mono text-sm">
            {items.map((row, i) => (
              <motion.div
                key={row.type}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-start gap-4 px-5 py-4 hover:bg-themeBg-secondary/60 transition-colors"
              >
                <span className="mt-0.5 shrink-0 rounded border border-themeAccent/30 bg-themeAccent/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-themeAccent">
                  {row.tag}
                </span>
                <span className="text-themeText leading-relaxed">
                  <span className="mr-2 text-themeAccent" aria-hidden>▸</span>
                  {row.text}
                </span>
              </motion.div>
            ))}
            <div className="flex items-center gap-2 px-5 py-3 text-themeText-secondary">
              <span className="text-themeAccent">$</span>
              <span>tail -f status.log</span>
              <span className="prompt-cursor inline-block h-4 w-2 bg-themeAccent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

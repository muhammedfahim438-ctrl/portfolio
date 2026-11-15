"use client";
import { useRef } from "react";
import { motion } from "framer-motion";
import { SplitText } from "@/components/ui/SplitText";
import { WordHighlight } from "@/components/ui/WordHighlight";

export function AboutSection() {
  const ref = useRef(null);

  return (
    <section id="about" className="py-24 px-4 border-t border-themeBorder/40 bg-themeBg/60 backdrop-blur-sm dg-glass dg-r-xl dg-border-hairline" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-10"
        >
          <SplitText
            as="span"
            text="Building the Future with Data"
            accentWord="Data"
            className="h1 dg-f-display text-themeText uppercase dg-glitch dg-corner dg-corner--red"
            data-text="Building the Future with Data"
          />

          <div className="space-y-8 text-themeTextSecondary leading-relaxed text-lg max-w-lg">
            <div className="relative pl-8 border-l-2 border-themeAccent">
              <WordHighlight text="I'm Muhammed Fahim M, a Data Science and Full-Stack Developer from Palakkad, Kerala, India." />
            </div>
            <div className="relative pl-8 border-l-2 border-themeAccent mt-4">
              <WordHighlight text="I build production-grade APIs, machine learning models, and scalable web applications that solve real problems." />
            </div>
            <div className="relative pl-8 border-l-2 border-themeAccent mt-4">
              <WordHighlight text="Currently pursuing my BSc in Data Science with a CGPA of 8.17 — shipping clean code, meaningful data, and products that matter." />
            </div>
          </div>

          {/* Stats - chunky grid */}
          <div className="grid grid-cols-2 gap-6 mt-8">
            <StatCard number="4+" label="YEARS" sub="experience" />
            <StatCard number="40+" label="PROJECTS" sub="shipped" />
            <StatCard number="13" label="GITHUB" sub="repos" />
            <StatCard number="30+" label="TECH" sub="stack" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatCard({ number, label, sub }) {
  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      initial={{ opacity: 0, y: 20 }}
      className="dg-chunky p-6 relative overflow-hidden dg-r-md"
    >
      <div className="absolute top-0 left-0 w-8 h-8 bg-themeAccent" />
      <span className="text-4xl font-display font-bold text-themeText uppercase tracking-tighter block leading-none">
        {number}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-wider text-themeAccent mt-2 block dg-ui-mono">
        {label}
      </span>
      <span className="font-mono text-[10px] text-themeTextSecondary/60 uppercase tracking-wider block mt-0.5 dg-ui-mono">
        {sub}
      </span>
    </motion.div>
  );
}

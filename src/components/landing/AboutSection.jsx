"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { SplitText } from "@/components/ui/SplitText";
import { WordHighlight } from "@/components/ui/WordHighlight";

export function AboutSection() {
  const ref = useRef(null);

  return (
    <section id="about" className="py-20 px-4 border-t border-themeBorder bg-themeBg" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: JTBD - Jobs to be done */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 border-l-4 border-themeAccent pl-4">
              <span className="text-themeAccent font-mono text-xs tracking-[0.3em] uppercase">
                About Me
              </span>
            </div>

            <SplitText
              as="span"
              text="Building the Future with Data"
              accentWord="Data"
              className="font-display font-black leading-[1] tracking-[-0.02em] text-[clamp(2rem,6vw,3rem)] text-themeText uppercase"
            />

            <div className="space-y-6 text-themeText-secondary leading-relaxed text-base max-w-lg">
              <div className="relative pl-6 border-l-2 border-themeAccent">
                <WordHighlight text="I'm Muhammed Fahim M, a Data Science and Full-Stack Developer from Palakkad, Kerala, India." />
              </div>
              <div className="relative pl-6 border-l-2 border-themeAccent mt-2">
                <WordHighlight text="I build production-grade APIs, machine learning models, and scalable web applications that solve real problems." />
              </div>
              <div className="relative pl-6 border-l-2 border-themeAccent mt-2">
                <WordHighlight text="Currently pursuing my BSc in Data Science with a CGPA of 8.17 — shipping clean code, meaningful data, and products that matter." />
              </div>
            </div>
          </motion.div>

          {/* Right: Brutalist stats - dense data block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <BrutalStat number="4+" label="YEARS" sub="experience" />
              <BrutalStat number="40+" label="PROJECTS" sub="shipped" />
              <BrutalStat number="13" label="GITHUB" sub="repos" />
              <BrutalStat number="30+" label="TECH" sub="stack" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BrutalStat({ number, label, sub }) {
  return (
    <div className="relative p-5 border-2 border-themeBorder bg-themeSurface/30 overflow-hidden">
      {/* Corner accent */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-themeAccent" />
      <span className="text-3xl font-display font-bold text-themeText uppercase tracking-tighter block leading-none">
        {number}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-wider text-themeAccent mt-1 block">
        {label}
      </span>
      <span className="font-mono text-[10px] text-themeText-secondary/60 uppercase tracking-wider block mt-0.5">
        {sub}
      </span>
    </div>
  );
}

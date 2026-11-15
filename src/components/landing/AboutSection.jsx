"use client";
import { useRef } from "react";
import { EntranceReveal } from "@/components/ui/EntranceReveal";

export function AboutSection() {
  const ref = useRef(null);

  return (
    <section
      id="about"
      className="py-24 px-4 border-t-8 border-[#C8102E] bg-[#080808] relative overflow-hidden"
      ref={ref}
    >
      {/* Background dot matrix - subtle */}
      <div className="absolute inset-0 -z-10 opacity-10 dg-dot-matrix" />

      {/* CRT scanline overlay */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
        opacity: 0.3,
      }} />

      {/* Asymmetric corner accents - brutalist */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#C8102E]/20 border-t-4 border-l-4 border-[#C8102E]" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#002F6C]/10 border-b-4 border-r-4 border-[#002F6C]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <EntranceReveal variant="slide" delay={0} className="space-y-16">
          {/* Section header - cyber brutalism chunky */}
          <div className="relative -mt-4 mb-8">
            <div className="absolute top-[-12px] left-[-12px] w-20 h-20 border-t-4 border-l-4 border-[#FFC70E] bg-[#080808]" />
            <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-none text-[#FAF8F3] uppercase dg-glitch dg-chunky p-6 inline-block border-4 border-[#C8102E] shadow-[8px_8px_0_0_#080808]" data-text="ABOUT ME">
              ABOUT ME
            </h2>
          </div>

          {/* Asymmetric content grid - 2 columns with offset */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left column: bio text */}
            <div className="lg:col-span-7 space-y-8">
              <p className="dg-f-subhead text-[#CDCBCA] leading-relaxed text-lg font-mono">
                I&apos;m <span className="text-[#C8102E] font-bold">Muhammed Fahim M</span>, a Data Science and Full-Stack Developer from Palakkad, Kerala, India.
              </p>
              <p className="dg-f-subhead text-[#CDCBCA] leading-relaxed text-lg font-mono">
                I build production-grade APIs, machine learning models, and scalable web applications that solve real problems.
              </p>
              <p className="dg-f-subhead text-[#CDCBCA] leading-relaxed text-lg font-mono">
                Currently pursuing my BSc in Data Science with a CGPA of 8.17 — shipping clean code, meaningful data, and products that matter.
              </p>

              {/* Chunky CTA - brutalist button */}
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C8102E] text-[#080808] font-display font-bold text-lg uppercase tracking-tight border-4 border-[#C8102E] shadow-[8px_8px_0_0_#080808] hover:bg-[#FFC70E] hover:text-[#080808] hover:shadow-[8px_8px_0_0_#080808] transition-all duration-150 active:shadow-[4px_4px_0_0_#080808] active:translate-[4px_4px] dg-f-mono dg-r-0"
              >
                START A PROJECT
              </a>
            </div>

            {/* Right column: stats - asymmetric offset */}
            <div className="lg:col-span-5 lg:col-start-3 space-y-8 mt-8 lg:mt-0">
              <div className="grid grid-cols-2 gap-6">
                <StatCard number="4+" label="YEARS" accent="red" />
                <StatCard number="40+" label="PROJECTS" accent="blue" />
                <StatCard number="13" label="GITHUB" accent="warn" />
                <StatCard number="30+" label="TECH" accent="red" />
              </div>

              {/* Tech stack chips - brutalist */}
              <div className="mt-8 border-t-4 border-[#C8102E] pt-6">
                <h3 className="dg-f-subhead text-[#CDCBCA] uppercase mb-4 font-mono text-sm font-bold">
                  TECH STACK
                </h3>
                <div className="flex flex-wrap gap-4">
                  {["Python", "Django", "React", "Next.js", "Flutter", "PostgreSQL", "MongoDB", "Docker", "Git", "Vercel"].map((tech) => (
                    <TechChip key={tech} tech={tech} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </EntranceReveal>
      </div>
    </section>
  );
}

function StatCard({ number, label, accent }) {
  const styles = {
    red: { bg: "bg-[#C8102E]", text: "text-[#080808]", border: "border-[#C8102E]", shadow: "shadow-[8px_8px_0_0_#080808]" },
    blue: { bg: "bg-[#002F6C]", text: "text-[#080808]", border: "border-[#002F6C]", shadow: "shadow-[8px_8px_0_0_#080808]" },
    warn: { bg: "bg-[#FFC70E]", text: "text-[#080808]", border: "border-[#FFC70E]", shadow: "shadow-[8px_8px_0_0_#080808]" },
  };
  const style = styles[accent] || styles.red;

  return (
    <div className={`relative p-6 overflow-hidden border-8 ${style.border} ${style.bg} ${style.shadow} dg-r-0 dg-chunky`}>
      <div className="absolute top-0 right-0 w-8 h-8 bg-[#080808]" />
      <span className="text-5xl font-display font-bold text-[#080808] uppercase tracking-tighter block leading-none">
        {number}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-wider text-[#C8102E] mt-2 block font-bold">
        {label}
      </span>
    </div>
  );
}

function TechChip({ tech }) {
  return (
    <div className="px-4 py-2 border-4 border-[#C8102E] bg-[#080808] text-[#C8102E] font-mono text-xs font-bold uppercase tracking-wider shadow-[4px_4px_0_0_#080808] hover:bg-[#C8102E] hover:text-[#080808] hover:shadow-[4px_4px_0_0_#080808] transition-all duration-150 active:shadow-[2px_2px_0_0_#080808] active:translate-[2px_2px] dg-r-0">
      {tech}
    </div>
  );
}

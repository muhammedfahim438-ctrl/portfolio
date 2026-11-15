"use client";
import { useRef } from "react";
import { EntranceReveal } from "@/components/ui/EntranceReveal";
import { Tilt3D } from "@/components/ui/Tilt3D";

export function AboutSection() {
  const ref = useRef(null);

  return (
    <section
      id="about"
      className="py-24 px-4 border-t-4 border-themeAccent bg-themeBg relative overflow-hidden dg-dot-grid--dense"
      ref={ref}
    >
      {/* Asymmetric corner accent */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-themeAccent/20 border-4 border-themeAccent" />
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-themeAccent/10 border-4 border-themeAccent/50" />

      <div className="max-w-6xl mx-auto relative z-10">
        <EntranceReveal variant="slide" delay={0} className="space-y-12">
          {/* Section header - cyber brutalism */}
          <div className="relative -mt-4 mb-8 dg-corner dg-corner--red">
            <h2 className="h1 dg-f-display text-themeText uppercase dg-glitch dg-chunky p-4 inline-block border-4 border-themeAccent shadow-[4px_4px_0_0_#080808]" data-text="About Me">
              About Me
            </h2>
          </div>

          {/* Asymmetric content grid - 2 columns with offset */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left column: bio text */}
            <div className="lg:col-span-7 space-y-6">
              <p className="dg-f-subhead text-themeTextSecondary leading-relaxed text-lg dg-ui-mono">
                I&apos;m <span className="text-themeAccent font-bold">Muhammed Fahim M</span>, a Data Science and Full-Stack Developer from Palakkad, Kerala, India.
              </p>
              <p className="dg-f-subhead text-themeTextSecondary leading-relaxed text-lg dg-ui-mono">
                I build production-grade APIs, machine learning models, and scalable web applications that solve real problems.
              </p>
              <p className="dg-f-subhead text-themeTextSecondary leading-relaxed text-lg dg-ui-mono">
                Currently pursuing my BSc in Data Science with a CGPA of 8.17 — shipping clean code, meaningful data, and products that matter.
              </p>

              {/* Chunky CTA */}
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--dg-accent-p)] text-[#080808] font-display font-bold text-lg uppercase tracking-tight border-4 border-[var(--dg-accent-p)] shadow-[4px_4px_0_0_#080808] hover:bg-[var(--dg-warn)] hover:text-[#080808] hover:shadow-[4px_4px_0_0_#080808] transition-all duration-150 active:shadow-[2px_2px_0_0_#080808] active:translate-[2px_2px] dg-f-mono"
              >
                Start a Project
              </a>
            </div>

            {/* Right column: stats - asymmetric offset */}
            <div className="lg:col-span-5 lg:col-start-3 space-y-6 mt-8 lg:mt-0">
              <div className="grid grid-cols-2 gap-4">
                <StatCard number="4+" label="YEARS" sub="experience" accent="red" />
                <StatCard number="40+" label="PROJECTS" sub="shipped" accent="blue" />
                <StatCard number="13" label="GITHUB" sub="repos" accent="warn" />
                <StatCard number="30+" label="TECH" sub="stack" accent="red" />
              </div>

              {/* Tech stack chips */}
              <div className="mt-8 border-t-4 border-themeAccent pt-6">
                <h3 className="dg-f-subhead text-themeText uppercase mb-4 dg-ui-mono text-sm">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-3">
                  {["Python", "Django", "React", "Next.js", "Flutter", "PostgreSQL", "MongoDB", "Docker", "Git", "Vercel"].map((tech) => (
                    <Tilt3D maxRotate={6} perspective={800} key={tech} className="px-4 py-2 bg-themeSurface border-2 border-themeAccent text-themeAccent font-mono text-xs font-bold uppercase tracking-wider dg-chunky shadow-[2px_2px_0_0_#080808] hover:bg-themeAccent hover:text-themeBg transition-all duration-150 active:shadow-[1px_1px_0_0_#080808] active:translate-[1px_1px]">
                      {tech}
                    </Tilt3D>
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

function StatCard({ number, label, sub, accent }) {
  const styles = {
    red: { bg: "bg-[var(--dg-accent-p)]", text: "text-[#080808]", border: "border-[var(--dg-accent-p)]", shadow: "shadow-[4px_4px_0_0_#080808]" },
    blue: { bg: "bg-[var(--dg-accent-s)]", text: "text-[#080808]", border: "border-[var(--dg-accent-s)]", shadow: "shadow-[4px_4px_0_0_#080808]" },
    warn: { bg: "bg-[var(--dg-warn)]", text: "text-[#080808]", border: "border-[var(--dg-warn)]", shadow: "shadow-[4px_4px_0_0_#080808]" },
  };
  const style = styles[accent] || styles.red;

  return (
    <Tilt3D maxRotate={5} perspective={600} className={`relative p-6 overflow-hidden border-4 ${style.border} ${style.bg} ${style.shadow} dg-r-0 dg-chunky`}>
      <div className="absolute top-0 right-0 w-4 h-4 bg-[#080808]" />
      <span className="text-5xl font-display font-bold text-[#080808] uppercase tracking-tighter block leading-none">
        {number}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-wider text-themeAccent mt-2 block dg-ui-mono">
        {label}
      </span>
      <span className="font-mono text-[10px] text-themeTextSecondary/60 uppercase tracking-wider block mt-0.5 dg-ui-mono">
        {sub}
      </span>
    </Tilt3D>
  );
}

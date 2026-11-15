"use client";
import { EntranceReveal } from "@/components/ui/EntranceReveal";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden border-t border-themeBorder/40 bg-themeBg py-24 px-4"
    >
      {/* Subtle dot matrix */}
      <div className="dg-dot-matrix absolute inset-0 -z-10 opacity-10" />

      {/* Asymmetric corner accents */}
      <div className="absolute top-0 left-0 h-32 w-32 border-l-2 border-t-2 border-themeAccent/40" />
      <div className="absolute right-0 bottom-0 h-24 w-24 border-r-2 border-b-2 border-themeSecondary/40" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <EntranceReveal variant="slide" delay={0} className="space-y-16">
          <div className="relative -mt-4 mb-8">
            <div className="absolute -top-3 -left-3 h-20 w-20 border-l-2 border-t-2 border-themeWarn bg-themeBg" />
            <h2
              className="h2 dg-f-display text-themeText dg-glitch dg-corner dg-corner--red"
              data-text="About me"
            >
              About me
            </h2>
          </div>

          {/* Asymmetric content grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left: bio */}
            <div className="space-y-8 lg:col-span-7">
              <p className="dg-f-subhead text-lg leading-relaxed text-themeText">
                I&apos;m <span className="font-bold text-themeAccent">Muhammed Fahim M</span>, a Data Science and Full-Stack Developer from Palakkad, Kerala, India.
              </p>
              <p className="dg-f-subhead text-lg leading-relaxed text-themeText">
                I build production-grade APIs, machine learning models, and web applications that solve real problems.
              </p>
              <p className="dg-f-subhead text-lg leading-relaxed text-themeText">
                I&apos;m pursuing my BSc in Data Science with a CGPA of 8.17, shipping clean code, meaningful data, and products that matter.
              </p>

              <a href="#contact" className="btn btn--primary dg-border-neon-red">
                GET IN TOUCH
              </a>
            </div>

            {/* Right: stats with offset */}
            <div className="mt-8 space-y-8 lg:col-span-5 lg:col-start-3 lg:mt-0">
              <div className="grid grid-cols-2 gap-6">
                <StatCard number="4+" label="Years" accent="red" />
                <StatCard number="40+" label="Projects" accent="blue" />
                <StatCard number="13" label="Repos" accent="warn" />
                <StatCard number="31" label="Skills" accent="red" />
              </div>

              <div className="mt-8 border-t-2 border-themeAccent pt-6">
                <h3 className="dg-ui-mono mb-4 text-sm font-bold uppercase tracking-wider text-themeText">
                  Tech stack
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
    red: { bg: "bg-themeAccent", text: "text-themeBg", border: "border-themeAccent" },
    blue: { bg: "bg-themeSecondary", text: "text-themeText", border: "border-themeSecondary" },
    warn: { bg: "bg-themeWarn", text: "text-themeBg", border: "border-themeWarn" },
  };
  const style = styles[accent] || styles.red;

  return (
    <div className={`dg-chunky relative overflow-hidden border-2 p-6 ${style.border} ${style.bg}`}>
      <div className="absolute top-0 right-0 h-8 w-8 bg-themeBg" />
      <span className={`dg-f-display block text-5xl font-bold uppercase leading-none tracking-tighter ${style.text}`}>
        {number}
      </span>
      <span className="dg-ui-mono mt-2 block text-[10px] font-bold uppercase tracking-wider text-themeTextSecondary">
        {label}
      </span>
    </div>
  );
}

function TechChip({ tech }) {
  return (
    <div className="dg-r-0 border-2 border-themeAccent bg-themeBg px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-themeAccent shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 hover:bg-themeAccent hover:text-themeBg hover:shadow-[2px_2px_0_0_var(--dg-bg-deep)] active:translate-x-0.5 active:translate-y-0.5">
      {tech}
    </div>
  );
}

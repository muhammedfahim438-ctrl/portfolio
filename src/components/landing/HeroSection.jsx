"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiSend } from "react-icons/fi";
import { getHeroData, getSocialData } from "@/lib/firestore";
import { EntranceReveal } from "@/components/ui/EntranceReveal";
import { ParallaxLayers } from "@/components/ui/ParallaxLayers";
import { Tilt3D } from "@/components/ui/Tilt3D";

export function HeroSection() {
  const [social, setSocial] = useState({
    github: "https://github.com/muhammedfahim438-ctrl",
    linkedin: "https://linkedin.com/in/muhammed-fahim-m",
    email: "muhammedfahim438@gmail.com",
    resume: "",
  });

  const [hero, setHero] = useState({
    title: "Muhammed Fahim M",
    subtitle: "Data Science & Full-Stack Developer",
    body: "Data science and full-stack development from Palakkad, Kerala. I ship production APIs, machine learning models, and web apps that solve real problems.",
  });

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const [heroData, socialData] = await Promise.all([
          getHeroData(),
          getSocialData(),
        ]);
        if (!mounted) return;
        if (heroData) {
          setHero((prev) => ({
            title: heroData.title || prev.title,
            subtitle: heroData.subtitle || prev.subtitle,
            body: heroData.voice_text || prev.body,
          }));
        }
        if (socialData) {
          setSocial((prev) => ({
            github: socialData.github || prev.github,
            linkedin: socialData.linkedin || prev.linkedin,
            email: socialData.email || prev.email,
            resume: socialData.resume_pdf_url || "",
          }));
        }
      } catch {
        // fallback to defaults
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const dock = [
    { label: "GitHub", href: social.github, external: true },
    { label: "LinkedIn", href: social.linkedin, external: true },
    { label: "Email", href: `mailto:${social.email}`, external: false },
  ];
  if (social.resume) {
    dock.push({ label: "Resume", href: social.resume, external: true });
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-dvh items-center overflow-hidden border-t-2 border-themeAccent bg-themeBg"
    >
      {/* Parallax background: dot grid, blueprint grid, accent glows */}
      <div className="absolute inset-0" aria-hidden="true">
        <ParallaxLayers className="h-full w-full">
          <div className="dg-halftone absolute inset-0 opacity-20" />
          <div className="dg-blueprint absolute inset-0 opacity-10" />
          <div className="absolute inset-0">
            <div className="absolute -left-24 top-1/4 h-72 w-72 bg-themeSecondary/20 blur-3xl" />
            <div className="absolute -right-16 bottom-0 h-64 w-64 bg-themeAccent/10 blur-3xl" />
          </div>
        </ParallaxLayers>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-24 md:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left: copy */}
          <EntranceReveal variant="slide" delay={0} className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 border-l-2 border-themeAccent pl-4">
                <span className="dg-ui-mono text-[11px] font-bold uppercase tracking-[0.4em] text-themeAccent">
                  {hero.subtitle}
                </span>
              </div>

              <h1
                className="h1 dg-glitch text-themeText"
                data-text={hero.title}
              >
                {hero.title}
              </h1>

              <p className="dg-f-subhead text-lg leading-relaxed text-themeText">
                {hero.body}
              </p>

              <div className="flex flex-col items-start gap-4 pt-8 sm:flex-row sm:items-center">
                <a
                  href="#contact"
                  className="btn btn--primary dg-border-neon-red"
                >
                  GET IN TOUCH <FiSend className="ml-2 w-4 h-4" />
                </a>
                <a
                  href="#work"
                  className="btn btn--secondary"
                >
                  VIEW WORK <FiFileText className="ml-2 w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </EntranceReveal>

          {/* Right: portrait with 3D tilt */}
          <EntranceReveal
            variant="scale"
            delay={0.2}
            className="relative mx-auto w-72 h-80 sm:w-96 sm:h-112 lg:w-lg lg:h-160"
          >
            <Tilt3D maxRotate={6} perspective={900} scale={1.01} className="h-full w-full">
              <div className="relative h-full w-full overflow-hidden border-2 border-themeAccent bg-themeBg shadow-[8px_8px_0_0_var(--dg-accent-s)] dg-r-0">
                <div className="absolute top-0 left-0 h-16 w-16 border-t-2 border-l-2 border-themeWarn bg-themeBg" />
                <div className="absolute right-0 bottom-0 h-16 w-16 border-r-2 border-b-2 border-themeWarn bg-themeBg" />
                <img
                  src="/portrait.svg"
                  alt="Dot-matrix portrait of Muhammed Fahim M"
                  className="h-full w-full object-cover opacity-100 grayscale-[30%] transition-all duration-500 hover:grayscale-0"
                  loading="eager"
                />
              </div>
            </Tilt3D>
          </EntranceReveal>
        </div>

        {/* Social dock, in flow at the hero bottom */}
        <EntranceReveal variant="fade" delay={0.4} className="mt-16">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-themeBorder/40 pt-6">
            {dock.map((item) => (
              <a
                key={item.label}
                href={item.href}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="dg-ui-mono text-xs font-bold uppercase tracking-[0.2em] text-themeTextSecondary transition-colors hover:text-themeAccent"
              >
                {item.label}
              </a>
            ))}
            <span className="dg-ui-mono ml-auto hidden text-[10px] uppercase tracking-[0.3em] text-themeText-secondary/60 md:block">
              Palakkad, Kerala
            </span>
          </div>
        </EntranceReveal>
      </div>

      {/* Scroll indicator */}
      <div className="absolute right-6 bottom-6 hidden flex-col items-center gap-2 md:flex">
        <span className="dg-ui-mono text-[10px] font-bold uppercase tracking-[0.4em] text-themeTextSecondary/70">
          Scroll
        </span>
        <div className="flex h-12 w-4 items-start justify-center border-2 border-themeAccent bg-themeBg px-1">
          <div className="h-2 w-1 animate-scroll-dot bg-themeAccent" />
        </div>
      </div>
    </section>
  );
}

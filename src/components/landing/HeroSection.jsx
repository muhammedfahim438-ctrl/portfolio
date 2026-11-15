"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiSend } from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { getHeroData, getSocialData } from "@/lib/firestore";
import { EntranceReveal } from "@/components/ui/EntranceReveal";
import { ParallaxLayers } from "@/components/ui/ParallaxLayers";
import { Tilt3D } from "@/components/ui/Tilt3D";

export function HeroSection() {
  const [social, setSocial] = useState({
    github: "https://github.com/muhammedfahim438-ctrl",
    linkedin: "https://linkedin.com/in/muhammed-fahim-m",
    email: "muhammedfahim438@gmail.com",
  });

  const [hero, setHero] = useState({
    title: "Muhammed Fahim M",
    subtitle: "Data Science × Full-Stack",
    body: "I build production APIs, machine learning models, and scalable web applications at the intersection of data engineering and full-stack development.",
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
          }));
          if (socialData.resume_pdf_url) {
            // resume URL from social data
          }
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

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex items-center overflow-hidden bg-[#080808] border-t border-[#CDCBCA]/20 dg-dot-matrix"
    >
      {/* Parallax dot layers behind content */}
      <ParallaxLayers className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-20 dg-dot-grid--dense" />
        <div className="absolute inset-0 opacity-10 dg-dot-grid--sparse" />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(600px_400px_at_20%_-10%,rgba(200,16,46,0.08),transparent_60%)]" />
      </ParallaxLayers>

      <div className="container mx-auto px-4 md:px-8 py-24 relative z-10 w-full">
        {/* Backdrop panel behind hero content for readability */}
        <div className="absolute inset-0 -z-10 bg-[#080808]/40 backdrop-blur-md" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: AIDA Attention with staggered entrance reveal */}
          <EntranceReveal variant="slide" delay={0} className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 border-l-4 border-[#C8102E] pl-4 dg-corner dg-corner--red">
                <span className="text-[#C8102E] font-mono text-xs tracking-[0.3em] uppercase dg-ui-mono">
                  {hero.subtitle || "Data Science × Full-Stack"}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter leading-none text-[#FAF8F3] uppercase dg-glitch" data-text={hero.title || "Muhammed Fahim M"} style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(200, 16, 46, 0.4)' }}>
                {hero.title || "Muhammed Fahim M"}
              </h1>

              <p className="dg-f-subhead text-[#CDCBCA]/90 leading-relaxed text-lg max-w-lg">
                {hero.body || "I build production APIs, machine learning models, and scalable web applications at the intersection of data engineering and full-stack development."}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-8">
                <a
                  href="#contact"
                  className="btn btn--primary dg-border-neon-red"
                >
                  Hire Me <FiSend className="w-4 h-4 ml-1.5" />
                </a>
                <a
                  href="#work"
                  className="btn btn--secondary dg-border-neon-blue"
                >
                  View Work <FiFileText className="w-4 h-4 ml-1.5" />
                </a>
              </div>
            </motion.div>
          </EntranceReveal>

          {/* Right: 3D-tilt portrait */}
          <EntranceReveal variant="scale" delay={0.2} className="relative mx-auto w-64 h-72 sm:w-88 sm:h-104 lg:w-[28rem] lg:h-128">
            <Tilt3D maxRotate={10} perspective={1000} className="relative h-full w-full dg-corner dg-corner--blue">
              <div className="absolute inset-[-6px] rounded-none bg-[#C8102E] z-0" />
              <div className="relative h-full w-full border-2 border-[#CDCBCA]/20 bg-[#080808]/10 overflow-hidden z-10 backdrop-blur-sm">
                <img
                  src="/my-picture.webp"
                  alt="Muhammed Fahim M"
                  className="h-full w-full object-cover grayscale-40 hover:grayscale-0 transition-grayscale duration-700"
                  loading="eager"
                />
              </div>
            </Tilt3D>
          </EntranceReveal>
        </div>

        {/* Social dock - cyberpunk pill */}
        <EntranceReveal variant="fade" delay={0.4} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 dg-r-full dg-glass dg-border-neon-red">
          <div className="px-6 py-2.5 flex items-center gap-4">
            <a href={social.github} target="_blank" rel="noopener noreferrer" className="text-[#CDCBCA]/80 hover:text-[#C8102E] transition-colors" aria-label="GitHub">
              <FaGithub className="w-5 h-5" />
            </a>
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#CDCBCA]/80 hover:text-[#C8102E] transition-colors" aria-label="LinkedIn">
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a href={`mailto:${social.email}`} className="text-[#CDCBCA]/80 hover:text-[#C8102E] transition-colors" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-[#CDCBCA]/80 hover:text-[#C8102E] transition-colors" aria-label="Resume">
              <FiFileText className="w-5 h-5" />
            </a>
          </div>
        </EntranceReveal>

        {/* Scroll indicator */}
        <EntranceReveal variant="fade" delay={0.5} className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col items-center gap-2 dg-r-full dg-glass dg-border-hairline">
          <span className="text-[#CDCBCA]/70 text-[10px] tracking-[0.3em] uppercase dg-ui-mono">Scroll</span>
          <div className="w-5 h-9 rounded-full border border-[#CDCBCA]/30 flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-full bg-[#C8102E] animate-scroll-dot" />
          </div>
        </EntranceReveal>
      </div>
    </section>
  );
}

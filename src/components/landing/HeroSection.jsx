"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiSend } from "react-icons/fi";
import { getHeroData, getSocialData } from "@/lib/firestore";
import { EntranceReveal } from "@/components/ui/EntranceReveal";
import { ParallaxLayers } from "@/components/ui/ParallaxLayers";

export function HeroSection() {
  const [social, setSocial] = useState({
    github: "https://github.com/muhammedfahim438-ctrl",
    linkedin: "https://linkedin.com/in/muhammed-fahim-m",
    email: "muhammedfahim438@gmail.com",
  });

  const [hero, setHero] = useState({
    title: "MUHAMMED FAHIM M",
    subtitle: "DATA SCIENCE × FULL-STACK",
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
            title: (heroData.title || prev.title).toUpperCase(),
            subtitle: (heroData.subtitle || prev.subtitle).toUpperCase(),
            body: heroData.voice_text || prev.body,
          }));
        }
        if (socialData) {
          setSocial((prev) => ({
            github: socialData.github || prev.github,
            linkedin: socialData.linkedin || prev.linkedin,
            email: socialData.email || prev.email,
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

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex items-center overflow-hidden bg-[#080808] border-t-4 border-[#C8102E] dg-dot-matrix"
    >
      {/* Background dot matrix - subtle, behind everything */}
      <ParallaxLayers className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 opacity-40 dg-dot-grid--dense" />
        <div className="absolute inset-0 opacity-20 dg-dot-grid--sparse" />
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(600px_400px_at_20%_-10%,rgba(200,16,46,0.12),transparent_60%)]" />
      </ParallaxLayers>

      {/* CRT scanline overlay for cyberpunk feel */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        opacity: 0.4,
      }} />

      <div className="container mx-auto px-4 md:px-8 py-24 relative z-50 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: AIDA Attention with staggered entrance reveal */}
          <EntranceReveal variant="slide" delay={0} className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Eyebrow - chunky monospace */}
              <div className="flex items-center gap-3 border-l-4 border-[#C8102E] pl-4">
                <span className="text-[#C8102E] font-mono text-[11px] tracking-[0.4em] uppercase dg-ui-mono font-bold">
                  {hero.subtitle}
                </span>
              </div>

              {/* Main Headline - massive, chunky, glitch */}
              <h1 className="text-5xl md:text-7xl lg:text-[8rem] font-display font-black tracking-tighter leading-none text-[#FAF8F3] uppercase dg-glitch dg-chunky p-6 inline-block border-4 border-[#C8102E] shadow-[8px_8px_0_0_#080808]" data-text={hero.title}>
                {hero.title}
              </h1>

              {/* Subtext - monospace, high contrast */}
              <p className="dg-f-subhead text-[#CDCBCA] leading-relaxed text-lg max-w-lg font-mono">
                {hero.body}
              </p>

              {/* CTA Buttons - chunky brutalist */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-8">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C8102E] text-[#080808] font-display font-bold text-lg uppercase tracking-tight border-4 border-[#C8102E] shadow-[8px_8px_0_0_#080808] hover:bg-[#FFC700] hover:text-[#080808] hover:shadow-[8px_8px_0_0_#080808] transition-all duration-150 active:shadow-[4px_4px_0_0_#080808] active:translate-[4px_4px] dg-f-mono dg-r-0"
                >
                  HIRE ME <FiSend className="w-4 h-4 ml-2" />
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-4 border-[#CDCBCA] text-[#CDCBCA] font-display font-bold text-lg uppercase tracking-tight shadow-[8px_8px_0_0_#080808] hover:bg-[#CDCBCA] hover:text-[#080808] hover:shadow-[8px_8px_0_0_#080808] transition-all duration-150 active:shadow-[4px_4px_0_0_#080808] active:translate-[4px_4px] dg-f-mono dg-r-0"
                >
                  VIEW WORK <FiFileText className="w-4 h-4 ml-2" />
                </a>
              </div>
            </motion.div>
          </EntranceReveal>

          {/* Right: Portrait with brutalist frame */}
          <EntranceReveal variant="scale" delay={0.2} className="relative mx-auto w-72 h-80 sm:w-96 sm:h-112 lg:w-[32rem] lg:h-[40rem]">
            <div className="relative h-full w-full border-8 border-[#C8102E] bg-[#080808] shadow-[8px_8px_0_0_#002F6C] dg-r-0 overflow-hidden group">
              {/* Top-left corner accent */}
              <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-[#C8102E] bg-[#080808]" />
              {/* Bottom-right corner accent */}
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-[#C8102E] bg-[#080808]" />
              <img
                src="/my-picture.webp"
                alt="Muhammed Fahim M"
                className="h-full w-full object-cover grayscale-30 hover:grayscale-0 transition-all duration-500 opacity-100"
                loading="eager"
              />
            </div>
          </EntranceReveal>
        </div>

        {/* Social dock - brutalist pill at bottom */}
        <EntranceReveal variant="fade" delay={0.4} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-4 border-8 border-[#C8102E] bg-[#080808] shadow-[8px_8px_0_0_#080808] px-8 py-3 dg-r-0">
            <a href={social.github} target="_blank" rel="noopener noreferrer" className="text-[#CDCBCA] hover:text-[#C8102E] transition-colors font-mono text-xs uppercase tracking-wider" aria-label="GitHub">
              GITHUB
            </a>
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#CDCBCA] hover:text-[#C8102E] transition-colors font-mono text-xs uppercase tracking-wider" aria-label="LinkedIn">
              LINKEDIN
            </a>
            <a href={`mailto:${social.email}`} className="text-[#CDCBCA] hover:text-[#C8102E] transition-colors font-mono text-xs uppercase tracking-wider" aria-label="Email">
              EMAIL
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-[#CDCBCA] hover:text-[#C8102E] transition-colors font-mono text-xs uppercase tracking-wider" aria-label="Resume">
              RESUME
            </a>
          </div>
        </EntranceReveal>

        {/* Scroll indicator */}
        <EntranceReveal variant="fade" delay={0.5} className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col items-center gap-2 dg-r-0">
          <span className="text-[#CDCBCA]/70 text-[10px] tracking-[0.4em] uppercase font-mono font-bold">SCROLL</span>
          <div className="w-4 h-12 border-4 border-[#C8102E] flex items-start justify-center px-1 bg-[#080808]">
            <div className="w-1 h-2 bg-[#C8102E] animate-scroll-dot" />
          </div>
        </EntranceReveal>
      </div>
    </section>
  );
}

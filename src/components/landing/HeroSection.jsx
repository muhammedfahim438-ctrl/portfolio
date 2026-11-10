"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiMail, FiFileText } from "react-icons/fi";
import { getSocialData, getHeroData, getConfig } from "@/lib/firestore";
import { AnimatedPortrait } from "@/components/landing/AnimatedPortrait";

const DEFAULT_VOICE_TEXT =
  "Hi! I'm Muhammed Fahim M, a Data Science and Full-Stack Developer from Kerala, India. I build production APIs, ML models, and scalable web apps.";

const QUICK_FACTS = [
  { k: "4+", v: "YEARS EXPERIENCE" },
  { k: "40+", v: "PROJECTS SHIPPED" },
  { k: "ML ×", v: "FULL-STACK" },
];

export function HeroSection() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [social, setSocial] = useState({
    github: "https://github.com/muhammedfahim438-ctrl",
    linkedin: "https://linkedin.com/in/muhammed-fahim-m",
    email: "muhammedfahim438@gmail.com",
  });
  const wrapRef = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  function handleMove(e) {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const [hero, socialData, avail] = await Promise.all([
          getHeroData(),
          getSocialData(),
          getConfig("availability_data", null),
        ]);
        if (!mounted) return;
        if (socialData) {
          setSocial((prev) => ({
            github: socialData.github || prev.github,
            linkedin: socialData.linkedin || prev.linkedin,
            email: socialData.email || prev.email,
          }));
          if (socialData.resume_pdf_url) setResumeUrl(socialData.resume_pdf_url);
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

  const activeResumeUrl = resumeUrl || "/resume.pdf";

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden bg-themeBg">
        {/* Brutalist grid background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(8,9,11,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(8,9,11,0.04) 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
        }} />

        <div className="container mx-auto px-4 md:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: AIDA Attention - Hero */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 border-l-4 border-themeAccent pl-4">
                <span className="text-themeAccent font-mono text-xs tracking-[0.3em] uppercase">
                  Data Science × Full-Stack
                </span>
              </div>

              {/* 2-line hero rule - wide container, max 3 lines */}
              <h1 className="font-display font-black leading-[0.92] tracking-[-0.02em] text-[clamp(2.5rem,9vw,4.5rem)] text-themeText uppercase">
                Muhammed Fahim M
              </h1>

              <p className="text-themeText-secondary leading-relaxed text-base max-w-lg">
                I build production APIs, machine learning models, and scalable web applications at
                the intersection of data engineering and full-stack development.
              </p>

              <div className="flex flex-wrap gap-4">
                {QUICK_FACTS.map((f) => (
                  <div key={f.k} className="flex items-baseline gap-2 border-b border-themeBorder pb-1">
                    <span className="font-display text-2xl md:text-3xl font-bold text-themeAccent uppercase">{f.k}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-themeText-secondary/70">
                      {f.v}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-6">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-none border-2 border-themeAccent bg-themeAccent text-themeText font-display font-semibold hover:bg-themeAccent-hover hover:text-themeText transition-colors"
                >
                  Hire Me
                  <FiFileText className="w-4 h-4 ml-1.5" />
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-none border-2 border-themeBorder bg-transparent text-themeText font-display font-semibold hover:border-themeAccent hover:text-themeAccent transition-colors"
                >
                  View Work
                </a>
              </div>
            </motion.div>

            {/* Right: 90° portrait with border */}
            <motion.div
              ref={wrapRef}
              onMouseMove={handleMove}
              onMouseLeave={() => { mx.set(0); my.set(0); }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-64 h-72 sm:w-[22rem] sm:h-[26rem] lg:w-[28rem] lg:h-[32rem]"
            >
              <div className="absolute inset-[-8px] rounded-none border-2 border-themeAccent bg-themeAccent z-0" />
              <div className="relative h-full w-full rounded-none border-2 border-themeBorder bg-themeSurface overflow-hidden z-10">
                <AnimatedPortrait className="h-full w-full" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Social dock - brutalist pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="rounded-none border-2 border-themeBorder bg-themeSurface px-5 py-2.5 flex items-center gap-3">
            <a href={social.github} target="_blank" rel="noopener noreferrer"
              className="text-themeText-secondary hover:text-themeAccent transition-colors" aria-label="GitHub">
              <FaGithub className="w-4 h-4" />
            </a>
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
              className="text-themeText-secondary hover:text-themeAccent transition-colors" aria-label="LinkedIn">
              <FaLinkedin className="w-4 h-4" />
            </a>
            <a href={`mailto:${social.email}`}
              className="text-themeText-secondary hover:text-themeAccent transition-colors" aria-label="Email">
              <FiMail className="w-4 h-4" />
            </a>
            <button onClick={() => setResumeOpen(true)} data-cursor-hover
              className="text-themeText-secondary hover:text-themeAccent transition-colors" aria-label="Resume">
              <FiFileText className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="fixed bottom-4 right-4 z-40 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-themeText-secondary">Scroll</span>
          <div className="w-5 h-9 rounded-none border-2 border-themeBorder flex items-start justify-center p-1">
            <div className="w-1 h-1.5 rounded-none bg-themeAccent animate-scroll-dot" />
          </div>
        </motion.div>
      </section>
    </>
  );
}

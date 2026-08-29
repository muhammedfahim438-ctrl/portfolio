"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiMail, FiFileText, FiVolume2, FiMic, FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { useSpeech } from "@/hooks/useSpeech";
import { getSocialData, getHeroData, getConfig } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SplitText } from "@/components/ui/SplitText";
import { ResumeModal } from "@/components/ui/ResumeModal";
import { AnimatedPortrait } from "@/components/landing/AnimatedPortrait";
import { ScenicScene } from "@/components/landing/ScenicScene";

const DEFAULT_TITLE = "Hi, I'm Muhammed Fahim M";
const DEFAULT_VOICE_TEXT =
  "Hi! I'm Muhammed Fahim M, a freelance Data Science and Full-Stack Developer from Kerala, India. I build production APIs, ML models, and scalable web apps. Let's connect!";

const ROLE_PILLS = ["Data Scientist", "Full-Stack Developer", "ML Engineer", "API Architect"];

const QUICK_FACTS = [
  { k: "4+", v: "years experience" },
  { k: "40+", v: "projects shipped" },
  { k: "ML ×", v: "full-stack" },
];

export function HeroSection() {
  const { speak, stop, speaking, currentText } = useSpeech();
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [displayTitle, setDisplayTitle] = useState(DEFAULT_TITLE);
  const [voiceText, setVoiceText] = useState(DEFAULT_VOICE_TEXT);
  const [availability, setAvailability] = useState({
    available: true,
    label: "Available for freelance & full-time",
  });
  const [social, setSocial] = useState({
    github: "https://github.com/muhammedfahim438-ctrl",
    linkedin: "https://linkedin.com/in/muhammed-fahim-m",
    email: "muhammedfahim438@gmail.com",
  });

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
        if (hero) {
          if (hero.title) setDisplayTitle(hero.title);
          if (hero.voice_text) setVoiceText(hero.voice_text);
        }
        if (socialData) {
          setSocial((prev) => ({
            github: socialData.github || prev.github,
            linkedin: socialData.linkedin || prev.linkedin,
            email: socialData.email || prev.email,
          }));
          if (socialData.resume_pdf_url) setResumeUrl(socialData.resume_pdf_url);
        }
        if (avail) {
          setAvailability({
            available: avail.available !== false,
            label: avail.label || "Available for freelance & full-time",
          });
        }
      } catch {
        // fallback to defaults below
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const activeResumeUrl = resumeUrl || "/resume.pdf";

  const h1Words = displayTitle.replace(/['']/g, "").split(" ");

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <ScenicScene variant="hero" />
        <div className="container mx-auto px-4 md:px-8 py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* ---- Left: copy ---- */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-7"
            >
              {/* availability pill */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: -12 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-themeBorder bg-themeSurface/70 px-4 py-1.5"
              >
                <span className="avail-dot" />
                <span className="font-mono text-xs tracking-wide text-themeText-secondary">
                  {availability.available ? availability.label : "Currently booked"}
                </span>
              </motion.div>

              {/* headline */}
              <motion.h1
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                className="font-display font-bold leading-[1.02] tracking-tight text-[clamp(2.2rem,6vw,4.2rem)]"
              >
                {h1Words.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
                      visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                    }}
                    className="inline-block mr-[0.28em]"
                  >
                    {i === 1 && /^i['’]m/i.test(word) ? (
                      <em className="emb-text italic font-normal">{word}</em>
                    ) : (
                      word
                    )}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="theme-lede"
              >
                I&apos;m a freelance Data Scientist &amp; Full-Stack Developer who turns ideas into
                production-ready products — sharp APIs, accurate ML models, and scalable web apps
                built for real outcomes.
              </motion.p>

              {/* quick facts */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
                className="flex flex-wrap gap-6"
              >
                {QUICK_FACTS.map((f) => (
                  <div key={f.k} className="flex items-baseline gap-2">
                    <span className="font-display text-2xl md:text-3xl font-bold emb-text">{f.k}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-themeText-secondary max-w-[9rem] leading-tight">
                      {f.v}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* role pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                className="flex flex-wrap gap-2"
              >
                {ROLE_PILLS.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-themeAccent/10 text-themeAccent border border-themeAccent/20"
                  >
                    {role}
                  </span>
                ))}
              </motion.div>

              {/* voice intro */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.95 }}
                className="flex items-center gap-3"
              >
                <button
                  onClick={() => (speaking ? stop() : speak(voiceText))}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-themeBg-secondary border border-themeBorder text-themeText-secondary hover:text-themeAccent hover:border-themeAccent transition-colors text-sm"
                  aria-label={speaking ? "Stop speaking" : "Play voice intro"}
                >
                  {speaking ? (
                    <FiVolume2 className="w-4 h-4 animate-pulse text-themeAccent" />
                  ) : (
                    <FiMic className="w-4 h-4" />
                  )}
                  {speaking ? "Stop" : "Play Voice"}
                </button>
                <AnimatedSpeechText speaking={speaking} currentText={currentText} />
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.05, duration: 0.6 }}
                className="flex flex-wrap items-center gap-4 pt-1"
              >
                <MagneticButton>
                  <Button href="#contact" size="lg" className="group px-7">
                    Hire Me
                    <FiArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Button>
                </MagneticButton>
                <Button href="#work" variant="secondary" size="lg">
                  View Work
                </Button>
                <button
                  onClick={() => setResumeOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-themeBorder text-themeText-secondary hover:border-themeAccent hover:text-themeAccent transition-colors font-medium"
                >
                  <FiFileText className="w-4 h-4" />
                  Resume
                </button>
              </motion.div>
            </motion.div>

            {/* ---- Right: animated portrait ---- */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-72 h-80 sm:w-80 sm:h-96 lg:w-[24rem] lg:h-[28rem]"
            >
              <AnimatedPortrait className="h-full w-full rounded-[2rem]" />
              <RotatingBadge />
            </motion.div>
          </div>
        </div>

        {/* social dock */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="glass rounded-full px-6 py-3 flex items-center gap-4">
            <a href={social.github} target="_blank" rel="noopener noreferrer"
              className="text-themeText-secondary hover:text-themeAccent transition-colors" aria-label="GitHub">
              <FaGithub className="w-5 h-5" />
            </a>
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
              className="text-themeText-secondary hover:text-themeAccent transition-colors" aria-label="LinkedIn">
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a href={`mailto:${social.email}`}
              className="text-themeText-secondary hover:text-themeAccent transition-colors" aria-label="Email">
              <FiMail className="w-5 h-5" />
            </a>
            <button onClick={() => setResumeOpen(true)} data-cursor-hover
              className="text-themeText-secondary hover:text-themeAccent transition-colors" aria-label="Resume">
              <FiFileText className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.35em] uppercase text-themeText-secondary">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-themeBorder flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-themeAccent animate-scroll-dot" />
          </div>
        </motion.div>
      </section>

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} resumeUrl={activeResumeUrl} />
    </>
  );
}

function AnimatedSpeechText({ speaking, currentText }) {
  if (!speaking && !currentText) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 min-w-0 text-sm text-themeText/70 italic leading-relaxed"
    >
      <span className="text-themeAccent font-medium">▸</span> {currentText}
      {speaking && <span className="animate-pulse text-themeAccent">|</span>}
    </motion.p>
  );
}

function RotatingBadge() {
  return (
    <div
      className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 z-10 flex h-24 w-24 md:h-28 md:w-28 items-center justify-center rounded-full bg-themeBg/90 glass"
      data-cursor-hover
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full origin-center animate-spin-slow p-1" aria-hidden="true">
        <defs>
          <path id="hero-badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="10.5" letterSpacing="2.4" fontWeight="600" fill="var(--themeText)"
          className="uppercase" style={{ fontFamily: "ui-monospace, monospace" }}>
          <textPath href="#hero-badge-circle">
            Scroll to explore {/* */}
            &#8226; Let&apos;s connect &#8226;
          </textPath>
        </text>
      </svg>
      <FiArrowDown className="h-4 w-4 text-themeAccent" />
    </div>
  );
}

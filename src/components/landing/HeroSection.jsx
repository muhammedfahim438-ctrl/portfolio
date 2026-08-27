"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FiMail, FiFileText, FiVolume2, FiMic, FiArrowDown } from "react-icons/fi";
import { useSpeech } from "@/hooks/useSpeech";
import { getSocialData, getHeroData } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ResumeModal } from "@/components/ui/ResumeModal";
import { ScenicScene } from "@/components/landing/ScenicScene";

const DEFAULT_TITLE = "Hi, I'm Muhammed Fahim M";
const DEFAULT_VOICE_TEXT =
  "Hi! I'm Muhammed Fahim M, a Data Science and Full-Stack Developer from Kerala, India. I build production APIs, ML models, and scalable web apps. Let's connect!";

const ROLE_PILLS = [
  "Data Scientist",
  "Full-Stack Developer",
  "ML Engineer",
  "API Architect",
];

export function HeroSection() {
  const { speak, stop, speaking, currentText } = useSpeech();
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [fullTitle, setFullTitle] = useState(DEFAULT_TITLE);
  const [voiceText, setVoiceText] = useState(DEFAULT_VOICE_TEXT);
  const [social, setSocial] = useState({
    github: "https://github.com/muhammedfahim438-ctrl",
    linkedin: "https://linkedin.com/in/muhammed-fahim-m",
    email: "muhammedfahim438@gmail.com",
  });

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const [hero, socialData] = await Promise.all([
          getHeroData(),
          getSocialData(),
        ]);
        if (!mounted) return;
        if (hero) {
          if (hero.title) setFullTitle(hero.title);
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
      } catch {
        // fallback to defaults below
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullTitle.length) {
        setTypedText(fullTitle.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [fullTitle]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  const activeResumeUrl = resumeUrl || "/resume.pdf";

  return (
    <>
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <ScenicScene variant="hero" />
        <div className="container mx-auto px-4 md:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-themeAccent font-mono text-sm tracking-wider uppercase"
              >
                Welcome to my portfolio
              </motion.p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                {typedText}
                <span
                  className={`inline-block w-[3px] h-[1em] bg-themeAccent align-middle ml-1 transition-opacity ${
                    showCursor ? "opacity-100" : "opacity-0"
                  }`}
                />
              </h1>

              <div className="flex flex-wrap gap-2">
                {ROLE_PILLS.map((role, i) => (
                  <motion.span
                    key={role}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-themeAccent/10 text-themeAccent border border-themeAccent/20"
                  >
                    {role}
                  </motion.span>
                ))}
              </div>

              <div className="flex items-center gap-3">
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
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <MagneticButton className="px-6 py-3 rounded-xl bg-gradient-to-r from-themeAccent to-themeSecondary text-white font-medium hover:opacity-90 transition-opacity">
                  <Button href="#projects" size="lg">
                    View My Work
                  </Button>
                </MagneticButton>
                <Button href="#contact" variant="secondary" size="lg">
                  Contact Me
                </Button>
                <button
                  onClick={() => setResumeOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-themeBorder text-themeText-secondary hover:border-themeAccent hover:text-themeAccent transition-colors font-medium"
                >
                  <FiFileText className="w-4 h-4" />
                  Resume
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-themeAccent/20 to-themeSecondary/20 blur-2xl" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-themeAccent/10 to-themeSecondary/10 border border-themeBorder flex items-center justify-center overflow-hidden">
                  <PhotoImage />
                </div>

                <RotatingBadge />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="glass rounded-full px-6 py-3 flex items-center gap-4">
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-themeText-secondary hover:text-themeAccent transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-themeText-secondary hover:text-themeAccent transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${social.email}`}
              className="text-themeText-secondary hover:text-themeAccent transition-colors"
              aria-label="Email"
            >
              <FiMail className="w-5 h-5" />
            </a>
            <button
              onClick={() => setResumeOpen(true)}
              className="text-themeText-secondary hover:text-themeAccent transition-colors"
              aria-label="Resume"
              data-cursor-hover
            >
              <FiFileText className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.35em] uppercase text-themeText-secondary">
            Scroll
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-themeBorder flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-themeAccent animate-scroll-dot" />
          </div>
        </motion.div>
      </section>

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        resumeUrl={activeResumeUrl}
      />
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
      {speaking && (
        <span className="animate-pulse text-themeAccent">|</span>
      )}
    </motion.p>
  );
}

function RotatingBadge() {
  return (
    <div
      className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 z-10 flex h-24 w-24 md:h-28 md:w-28 items-center justify-center rounded-full bg-themeBg/90 glass"
      data-cursor-hover
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full origin-center animate-spin-slow p-1"
        aria-hidden="true"
      >
        <defs>
          <path
            id="hero-badge-circle"
            d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
          />
        </defs>
        <text
          fontSize="10.5"
          letterSpacing="2.4"
          fontWeight="600"
          fill="var(--themeText)"
          className="uppercase"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
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

function PhotoImage() {
  const [photoUrl, setPhotoUrl] = useState("");
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getHeroData();
        if (mounted && data?.photo_url) setPhotoUrl(data.photo_url);
      } catch {
        // fallback to bundled image
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const src = (photoUrl && !imgFailed) ? photoUrl : "/my-picture.png";

  return (
    <img
      src={src}
      alt="Muhammed Fahim M"
      onError={() => setImgFailed(true)}
      className="w-full h-full object-cover"
    />
  );
}
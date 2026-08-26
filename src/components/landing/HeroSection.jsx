"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaVolumeUp } from "react-icons/fa";
import { useSpeech } from "@/hooks/useSpeech";
import { useAudioVisualizer } from "@/hooks/useAudioVisualizer";
import { Button } from "@/components/ui/Button";

const VOICE_TEXT =
  "Hi! I'm Muhammed Fahim M, a Data Science and Full-Stack Developer from Kerala, India. I build production APIs, ML models, and scalable web apps. Let's connect!";

export function HeroSection() {
  const { speak, stop, speaking } = useSpeech();
  const canvasRef = useRef(null);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useAudioVisualizer(canvasRef, speaking);

  const fullTitle = "Hi, I'm Muhammed Fahim M";

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
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
              {typedText}
              <span
                className={`inline-block w-[3px] h-[1em] bg-themeAccent align-middle ml-1 transition-opacity ${
                  showCursor ? "opacity-100" : "opacity-0"
                }`}
              />
            </h1>
            <p className="text-xl md:text-2xl text-themeText-secondary font-light">
              Data Science &amp; Full-Stack Developer
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => (speaking ? stop() : speak(VOICE_TEXT))}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-themeBg-secondary border border-themeBorder text-themeText-secondary hover:text-themeAccent hover:border-themeAccent transition-colors text-sm"
                aria-label={speaking ? "Stop speaking" : "Play voice intro"}
              >
                <FaVolumeUp className={`w-4 h-4 ${speaking ? "animate-pulse text-themeAccent" : ""}`} />
                {speaking ? "Stop" : "Play Voice"}
              </button>
            </div>

            {speaking && (
              <canvas
                ref={canvasRef}
                width={400}
                height={48}
                className="w-full max-w-sm h-12"
              />
            )}

            <div className="flex flex-wrap gap-4 pt-2">
              <Button href="#projects" size="lg">
                View My Work
              </Button>
              <Button href="#contact" variant="secondary" size="lg">
                Contact Me
              </Button>
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
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full opacity-40"
                  fill="none"
                >
                  <circle cx="100" cy="70" r="35" fill="currentColor" className="text-themeAccent" />
                  <ellipse cx="100" cy="150" rx="55" ry="45" fill="currentColor" className="text-themeSecondary" />
                </svg>
              </div>
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
            href="https://github.com/muhammedfahim438-ctrl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-themeText-secondary hover:text-themeAccent transition-colors"
            aria-label="GitHub"
          >
            <FaGithub className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/muhammed-fahim-m"
            target="_blank"
            rel="noopener noreferrer"
            className="text-themeText-secondary hover:text-themeAccent transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}

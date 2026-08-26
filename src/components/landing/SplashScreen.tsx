"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAME = "MUHAMMED FAHIM M";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-themeBg"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 blur-3xl opacity-30 animate-pulse-glow rounded-full" />
            <h1 className="relative text-5xl md:text-7xl font-display font-bold">
              {NAME.split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="text-gradient inline-block"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.07,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="text-themeText-secondary text-lg md:text-xl font-light tracking-wide"
          >
            Data Science &amp; Full-Stack Developer
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 2.5, ease: "easeInOut" }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-gradient-to-r from-themeAccent to-themeSecondary origin-left rounded-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

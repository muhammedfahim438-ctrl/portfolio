"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getHeroData } from "@/lib/firestore";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-themeBg"
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 blur-3xl opacity-30 animate-pulse-glow rounded-full" />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-themeAccent/30 to-themeSecondary/30 border border-themeBorder flex items-center justify-center overflow-hidden"
            >
              <img
                src={(photoUrl && !imgFailed) ? photoUrl : "/my-picture.png"}
                alt="Muhammed Fahim M"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-5xl font-display font-bold text-gradient mb-2"
          >
            MUHAMMED FAHIM M
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-themeText-secondary text-base md:text-lg font-light tracking-wide mb-12"
          >
            Data Science &amp; Full-Stack Developer
          </motion.p>

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 flex flex-col items-center gap-3">
            <div className="w-full h-1 rounded-full bg-themeBg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-themeAccent to-themeSecondary preloader-progress"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <span className="text-themeText-secondary text-sm font-mono">
              {Math.min(Math.round(progress), 100)}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

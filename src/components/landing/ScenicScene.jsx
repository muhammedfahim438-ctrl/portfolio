"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const HILL_BACK =
  "M0,62 C180,28 340,50 520,42 C700,34 880,58 1080,44 C1240,32 1360,52 1440,48 L1440,120 L0,120 Z";
const HILL_ACCENT =
  "M0,78 C240,44 480,68 720,54 C960,40 1180,64 1440,50 L1440,120 L0,120 Z";
const HILL_MID =
  "M0,94 C200,52 420,76 640,62 C860,48 1060,82 1280,66 C1380,58 1420,74 1440,64 L1440,120 L0,120 Z";
const HILL_FRONT =
  "M0,104 C240,66 460,90 700,76 C940,62 1160,94 1380,80 L1440,84 L1440,120 L0,120 Z";

export function ScenicScene({ variant = "hero" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const isFooter = variant === "footer";
  const backShift = useTransform(scrollYProgress, [0, 1], [0, isFooter ? -24 : 48]);
  const midShift = useTransform(scrollYProgress, [0, 1], [0, isFooter ? -40 : 72]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="scene-dots absolute inset-0" />

      <div className="animate-orb absolute -top-16 -left-16 h-72 w-72 rounded-full bg-themeAccent/20 blur-3xl" />
      <div
        className="animate-orb absolute top-1/4 right-[-4%] h-96 w-96 rounded-full bg-themeSecondary/25 blur-3xl"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="animate-orb absolute bottom-16 left-1/4 h-56 w-56 rounded-full bg-themeAccent/15 blur-3xl"
        style={{ animationDelay: "-11s" }}
      />

      <motion.svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[30%] w-full"
        style={{ fill: "var(--themeAccent)", opacity: 0.12, y: backShift }}
      >
        <path d={HILL_BACK} />
      </motion.svg>

      <motion.svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[34%] w-full"
        style={{ fill: "var(--themeSecondary)", opacity: 0.2, y: midShift }}
      >
        <path d={HILL_ACCENT} />
      </motion.svg>

      <motion.svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[-3%] h-[38%] w-full"
        style={{ fill: "var(--themeBgSecondary)", y: backShift }}
      >
        <path d={HILL_MID} />
      </motion.svg>

      <div className="absolute inset-x-0 bottom-0">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="block h-[110px] w-full scale-x-105"
          style={{ fill: "var(--themeSurface)" }}
        >
          <path d={HILL_FRONT} />
        </svg>
      </div>
    </div>
  );
}
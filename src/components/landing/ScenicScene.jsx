"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const CODE_LINES = [
  "const builder = new Engineer();",
  "builder.experience = 2;      // years",
  "await builder.deploy('portfolio');",
  "model.fit(X_train, y_train);  // AUC 0.9975",
  "$ git push origin main --force",
  "SELECT name FROM devs WHERE stacks LIKE '%react%';",
  "while alive: build(); learn(); repeat()",
  "Data Science × Full-Stack × ML",
  "server.listen(3000, () => log('ready'))",
];

const GLYPHS = ["</>", "{ }", "()", "=>", "//", "&&", "||", "**", "#!"];

export function ScenicScene({ variant = "hero" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const isFooter = variant === "footer";
  const codeShift = useTransform(scrollYProgress, [0, 1], [0, isFooter ? -24 : 46]);
  const glyphShift = useTransform(scrollYProgress, [0, 1], [0, isFooter ? -30 : 70]);
  const glowY = useTransform(scrollYProgress, [0, 1], [0, isFooter ? -16 : 34]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${isFooter ? "scanlines-light" : ""}`}
    >
      {/* neon grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(rgba(205,242,43,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(205,242,43,0.06) 1px, transparent 1px)`,
        backgroundSize: "44px 44px",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
      }} />

      {/* cinematic neon mesh blobs */}
      {!isFooter && (
        <>
          <div
            className="mesh-blob mesh-blob--1"
            style={{ width: "42rem", height: "42rem", top: "-14%", left: "-8%", background: "linear-gradient(135deg, rgba(205,242,43,0.18), rgba(8,9,11,0.08))" }}
          />
          <div
            className="mesh-blob mesh-blob--2"
            style={{ width: "36rem", height: "36rem", bottom: "-18%", right: "-6%", background: "linear-gradient(135deg, rgba(205,242,43,0.14), rgba(8,9,11,0.06))" }}
          />
          <div
            className="mesh-blob mesh-blob--3"
            style={{ width: "24rem", height: "24rem", top: "40%", left: "55%", background: "rgba(205,242,43,0.08)" }}
          />
        </>
      )}

      {/* subtle drifting code lines */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end gap-[0.35em] px-[8%] pb-[16%] opacity-[0.10]"
        style={{ y: codeShift }}
      >
        {CODE_LINES.slice(0, isFooter ? 3 : 8).map((line, i) => (
          <div
            key={i}
            className="whitespace-nowrap font-mono text-[clamp(0.55rem,1.1vw,0.85rem)]"
            style={{
              color: i % 3 === 0 ? "var(--themeText)" : "var(--themeTextSecondary)",
              transform: `translateX(${i % 2 === 0 ? "-2%" : "6%"})`,
            }}
          >
            <span style={{ color: "var(--themeAccent)" }}>{i % 2 === 0 ? "$" : "#"}</span>{" "}
            {line}
          </div>
        ))}
      </motion.div>

      <motion.div className="absolute inset-0" style={{ y: glyphShift }}>
        {GLYPHS.map((g, i) => (
          <span
            key={i}
            className="absolute font-mono font-bold select-none"
            style={{
              left: `${(i * 13 + 5) % 96}%`,
              top: `${(i * 29 + 7) % 90}%`,
              color: i % 2 === 0 ? "var(--themeTextSecondary)" : "var(--themeBorder)",
              opacity: 0.4,
              fontSize: `clamp(${0.7 + (i % 3) * 0.3}rem, 2.2vw, ${1.3 + (i % 3) * 0.5}rem)`,
            }}
          >
            {g}
          </span>
        ))}
      </motion.div>

      <motion.div
        className="absolute -top-24 -right-24 h-80 w-80 rounded-full"
        style={{ background: "var(--themeAccent)", opacity: 0.12, filter: "blur(90px)", y: glowY }}
      />

      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--themeAccent), transparent)", opacity: 0.5 }}
      />
    </div>
  );
}

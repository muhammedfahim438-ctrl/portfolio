"use client";

import { motion } from "framer-motion";

const letterVariants = {
  hidden: { y: "120%", opacity: 0.001, filter: "blur(8px)" },
  visible: (i) => ({
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
      delay: (i % 7) * 0.03,
    },
  }),
};

export function SplitText({
  text,
  className = "",
  accentWord = "",
  as: Tag = "h2",
}) {
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, wi) => {
        const clean = word.replace(/[^\p{L}\p{N}]/gu, "");
        const isAccent =
          !!accentWord && clean.toUpperCase() === accentWord.toUpperCase();
        const start = charIndex;
        charIndex += word.length + 1;

        return (
          <span key={wi} className="inline-block whitespace-pre">
            {word.split("").map((ch, ci) => (
              <span
                key={ci}
                className="inline-block overflow-hidden align-bottom"
              >
                <motion.span
                  className={
                    isAccent
                      ? "accent-word text-shimmer inline-block will-change-transform"
                      : "inline-block will-change-transform"
                  }
                  variants={letterVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={start + ci}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
            {wi < words.length - 1 && <span>&nbsp;</span>}
          </span>
        );
      })}
    </Tag>
  );
}
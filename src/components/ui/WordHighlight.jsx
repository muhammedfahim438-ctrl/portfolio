"use client";

import { useRef, useState } from "react";
import {
  useScroll,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";

export function WordHighlight({
  text,
  className = "",
  as: Tag = "p",
  idleOpacity = 0.35,
}) {
  const words = text.split(" ");
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "end 0.45"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });

  useMotionValueEvent(smooth, "change", (v) => {
    setRevealed(Math.round(v * words.length));
  });

  return (
    <Tag ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline"
          style={{
            color:
              i < revealed ? "var(--themeText)" : "var(--themeTextSecondary)",
            opacity: i < revealed ? 1 : idleOpacity,
            transition: "color 0.3s, opacity 0.3s",
          }}
        >
          {w}
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Tag>
  );
}
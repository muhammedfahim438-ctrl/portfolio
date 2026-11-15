"use client";

import { useEffect, useRef, useState } from "react";

/**
 * EntranceReveal — scroll-triggered reveal component.
 * Element fades/slides/scales into view when it enters the viewport.
 * Supports variants: default (slide), fade, scale.
 * Respects prefers-reduced-motion.
 */
export function EntranceReveal({
  children,
  className = "",
  variant = "slide",
  delay = 0,
  once = true,
  threshold = 0.1,
}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [reducedMotion, setReducedMotion] = useState(revealed);
  const hasRevealed = useRef(revealed);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      const wasReduced = reducedMotion;
      setReducedMotion(mq.matches);
      if (!wasReduced && mq.matches) {
        setRevealed(true);
        hasRevealed.current = true;
      }
    };
    mq.addEventListener("change", onChange);

    if (!reducedMotion) {
      // Failsafe: never leave content hidden. Instant scroll jumps (anchor
      // links, scroll restoration, screenshots) can skip the IntersectionObserver
      // window entirely, so force-reveal anything not already shown after a beat.
      const failsafe = setTimeout(() => {
        if (!hasRevealed.current) {
          setRevealed(true);
          hasRevealed.current = true;
        }
      }, 1800);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (!once || !hasRevealed.current) {
              setRevealed(true);
              hasRevealed.current = true;
            }
          } else if (!once) {
            setRevealed(false);
          }
        },
        { threshold: 0, rootMargin: "0px 0px -8% 0px" },
      );

      const el = ref.current;
      if (el) observer.observe(el);

      return () => {
        clearTimeout(failsafe);
        observer.disconnect();
      };
    }
  }, [once, threshold, reducedMotion]);

  const isFade = variant === "fade";
  const isScale = variant === "scale";

  return (
    <div
      ref={ref}
      className={`relative ${className} entrance-reveal${revealed ? " revealed" : ""}${isFade ? " entrance-reveal--fade" : isScale ? " entrance-reveal--scale" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

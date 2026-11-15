"use client";

import { useEffect, useRef, useState, Children, isValidElement, cloneElement } from "react";

/**
 * ParallaxLayers — multi-layer scroll parallax component.
 * Each layer moves at a different speed based on scroll progress.
 * Respects prefers-reduced-motion.
 */
export function ParallaxLayers({ children, className = "" }) {
  const ref = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  if (reducedMotion) {
    return (
      <div ref={ref} className={`relative ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ perspective: "1000px" }}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        const depth = index === 0 ? 0.1 : index === 1 ? 0.3 : 0.5;
        const translateY = scrollY * depth * -0.4;

        return cloneElement(child, {
          className: `parallax-layer ${child.props.className || ""}`,
          style: {
            ...child.props.style,
            transform: `translate3d(0, ${translateY}px, 0)`,
          },
        });
      })}
    </div>
  );
}

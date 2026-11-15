"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tilt3D — 3D hover tilt component.
 * Follows the mouse cursor with smooth rotateX/rotateY.
 * Disabled on mobile and under prefers-reduced-motion.
 */
export function Tilt3D({
  children,
  className = "",
  maxRotate = 8,
  perspective = 1000,
  scale = 1.02,
}) {
  const ref = useRef(null);
  const innerRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (reducedMotion || isMobile || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const x = ((mouseY - centerY) / rect.height) * maxRotate * -1;
    const y = ((mouseX - centerX) / rect.width) * maxRotate;

    setRotateX(x);
    setRotateY(y);
    setIsHovered(true);
  }, [reducedMotion, isMobile, maxRotate, ref]);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  if (reducedMotion || isMobile) {
    return (
      <div ref={ref} className={`relative ${className}`} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`tilt-3d relative ${className}`}
      style={{ perspective }}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={innerRef}
        className="tilt-3d__inner"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? scale : 1})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

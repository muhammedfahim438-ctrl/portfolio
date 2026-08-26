"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export function MagneticButton({ children, className = "", onClick, href, ...props }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (clientX - centerX) * 0.2;
    const deltaY = (clientY - centerY) * 0.2;
    setPosition({ x: deltaX, y: deltaY });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Tag = href ? "a" : "button";

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={`inline-block ${className}`}
      {...props}
    >
      <motion.span
        className="inline-flex items-center justify-center gap-2"
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}

"use client";

import { motion } from "framer-motion";

export function LoadingSpinner({ size = "md" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizes[size]} rounded-full border-2 border-themeBg-secondary border-t-themeAccent`}
    />
  );
}

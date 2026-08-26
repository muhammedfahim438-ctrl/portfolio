"use client";

import { motion } from "framer-motion";
import { LoadingSpinner } from "./LoadingSpinner";

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  href,
  disabled,
  loading,
  className = "",
  type = "button",
}) {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl";

  const variants = {
    primary:
      "bg-linear-to-r from-themeAccent to-themeSecondary text-white hover:opacity-90 shadow-lg",
    secondary:
      "border border-themeAccent text-themeAccent hover:bg-themeAccent/10",
    ghost: "text-themeText-secondary hover:text-themeText hover:bg-themeBg-secondary",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {loading ? <LoadingSpinner size="sm" /> : children}
      </a>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${classes} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </motion.button>
  );
}

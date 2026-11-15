"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * GlassCard — reusable liquid glass card with a double-bezel architecture.
 *
 * - Outer wrapper: hairline border + outer bezel shadow
 *   (`double-bezel-outer`)
 * - Inner content container: glass fill + inner bezel
 *   (`double-bezel-inner`)
 * - Hover: accent border glow, tinted shadow intensifies, slight lift.
 */
export function GlassCard({
  children,
  className,
  hoverable = true,
  padding = "p-6",
  ...props
}) {
  const [hovered, setHovered] = useState(false);

  const borderColor = hovered ? "var(--themeAccent)" : "var(--themeHairline)";
  const shadow = hovered
    ? "0 0 0 1px var(--themeAccent), 0 24px 48px -12px var(--themeGlassShadow), 0 0 30px var(--themeAccent)/25"
    : "0 0 0 1px var(--themeDoubleBezelOuter), 0 8px 24px -6px var(--themeGlassShadow)";

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: hoverable ? -6 : 0 }}
      whileTap={{ y: 0 }}
      style={{ borderColor, boxShadow: shadow }}
      className={cn(
        "double-bezel-outer relative overflow-hidden rounded-2xl",
        "transition-all duration-300 ease-out",
        hoverable && "cursor-default",
        className
      )}
      {...props}
    >
      <div className={`double-bezel-inner relative isolation z-10 rounded-2xl ${padding} bg-themeGlass-bg`}>
        {children}
      </div>
    </motion.div>
  );
}

GlassCard.displayName = "GlassCard";

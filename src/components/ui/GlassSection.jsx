"use client";

import { cn } from "@/lib/utils";

/**
 * GlassSection — section wrapper with a subtle liquid-glass panel behind content.
 *
 * Each section gets a glass panel sitting behind its content (-z-10, behind the
 * z-10 content layer), so sections read as Soft Ivory / Midnight Black surfaces
 * with Neon Lime Green accents at a 60/30/10 ratio across the page.
 *
 * Usage:
 *   <GlassSection id="about" className="py-20 px-4">
 *     ...content...
 *   </GlassSection>
 */
export function GlassSection({ children, className, ...props }) {
  return (
    <section
      {...props}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Subtle liquid-glass panel behind the section content. */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          position: "absolute",
          background: "var(--themeGlassBg)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid var(--themeHairline)",
          boxShadow:
            "0 0 0 1px var(--themeDoubleBezelOuter), 0 20px 40px -10px var(--themeGlassShadow)",
          borderRadius: "1rem",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// Distance scrolled before the nav begins to dissolve on a downward scroll.
const DISSOLVE_THRESHOLD = 80;

export function GlassNav({ className }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDissolved, setIsDissolved] = useState(false);
  const lastScrollY = useRef(0);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    const scrollingDown = y > lastScrollY.current;

    if (y > DISSOLVE_THRESHOLD) {
      if (scrollingDown && !isDissolved) {
        // Scroll down past threshold: dissolve into particles (fade + blur up).
        setIsDissolved(true);
      } else if (!scrollingDown && isDissolved) {
        // Scroll up: re-gather (opacity back, blur back).
        setIsDissolved(false);
      }
    } else if (isDissolved) {
      setIsDissolved(false);
    }

    lastScrollY.current = y;
  }, [isDissolved]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // iOS 27 liquid glass values that cross-fade between the two scroll states.
  const blurPx = isDissolved ? 48 : 24;
  const opacity = isDissolved ? 0.6 : 1;
  const saturate = isDissolved ? 130 : 180;
  const contrast = isDissolved ? 150 : 100;
  const backdrop = `blur(${blurPx}px) saturate(${saturate}%) contrast(${contrast}%)`;

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      {/* Fixed full-width nav, sitting above content but below any background canvas. */}
      <nav
        className={cn(
          "fixed left-0 right-0 top-0 z-50 pointer-events-auto",
          "transition-all duration-500 ease-out",
          className
        )}
        style={{
          backdropFilter: backdrop,
          WebkitBackdropFilter: backdrop,
          opacity,
        }}
        aria-label="Main navigation"
      >
        {/* Double-bezel architecture: outer shell (hairline border + outer bezel). */}
        <div className="double-bezel-outer relative overflow-hidden">
          {/* Inner core: glass fill + inner bezel. */}
          <div className="double-bezel-inner relative isolation bg-themeGlass-bg">
            <div className="container mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-themeText tracking-tighter uppercase text-xs">
                  MF
                </span>
              </div>

              <div className="hidden md:flex items-center gap-6">
                {LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-themeText-secondary text-xs font-mono uppercase tracking-wider hover:text-themeAccent transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={openMenu}
                  className="md:hidden p-2.5 rounded-lg border border-themeHairline bg-themeGlass-bg text-themeText hover:text-themeAccent hover:border-themeAccent transition-all duration-200"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile hamburger: glass overlay that gathers the nav links. */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[56] bg-themeGlass-bg/90 backdrop-blur-xl backdrop-saturate-150 border border-themeGlass-border pointer-events-auto"
            onClick={closeMenu}
            aria-hidden="true"
          >
            <div className="container mx-auto px-4 md:px-6 py-20 relative z-10">
              <div className="flex justify-end mb-8">
                <button
                  onClick={closeMenu}
                  className="p-2.5 rounded-lg border border-themeHairline bg-themeGlass-bg text-themeText hover:text-themeAccent hover:bg-themeAccent/20 transition-all duration-200"
                  aria-label="Close menu"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-3">
                {LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={closeMenu}
                    className="block text-themeText text-xl font-mono uppercase tracking-widest hover:text-themeAccent transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

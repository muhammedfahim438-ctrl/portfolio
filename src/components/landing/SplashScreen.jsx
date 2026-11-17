"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getConfig } from "@/lib/firestore";
import { useBrandContent } from "@/hooks/useBrandContent";

const DEFAULT_FINAL = "RAW DATA → SHIPPED PRODUCT";
const SEEN_KEY = "mf-splash-v1";
const CAP_MS = 2800;

// 5x5 dot-matrix boot grid. Center cross renders red, corners yellow.
const DOTS = Array.from({ length: 25 }, (_, i) => {
  const row = Math.floor(i / 5);
  const col = i % 5;
  const isCenter = row === 2 && col === 2;
  const isCross = row === 2 || col === 2;
  const isCorner = (row === 0 || row === 4) && (col === 0 || col === 4);
  const color = isCenter ? "var(--dg-accent-p)" : isCorner ? "var(--dg-warn)" : isCross ? "var(--dg-high)" : "var(--dg-surf)";
  const delay = (row + col) * 85;
  return { i, color, delay };
});

export function SplashScreen() {
  const { footer } = useBrandContent();
  const fallbackFinal = footer.splashFinal || DEFAULT_FINAL;
  const [seen] = useState(() => {
    try {
      return sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [visible, setVisible] = useState(!seen);
  const [pct, setPct] = useState(0);
  const [final, setFinal] = useState("");
  const doneRef = useRef(false);
  const [reducedNow] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    let mounted = true;
    getConfig("splash_data", null)
      .then((data) => {
        if (mounted && data && typeof data.final === "string" && data.final.trim()) {
          setFinal(data.final.trim());
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (seen) return;
    const reduced = reducedNow;
    const start = performance.now();

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // private mode: skip silently
      }
      setVisible(false);
    };

    if (reduced) {
      const p = setTimeout(() => setPct(100), 0);
      const t = setTimeout(finish, 160);
      return () => {
        clearTimeout(p);
        clearTimeout(t);
      };
    }

    let rafId = 0;
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(100, Math.round((elapsed / (CAP_MS - 120)) * 100));
      setPct(progress);
      if (elapsed >= CAP_MS - 120) {
        // let the wipe read as a release, not a hard cut
        setTimeout(finish, 140);
        return;
      }
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);

    // Hard cap: never block the page longer than CAP_MS + wipe.
    const cap = setTimeout(finish, CAP_MS + 250);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(cap);
    };
  }, [seen, reducedNow]);

  if (seen) return null;
  // Reduced motion: unmount instantly instead of playing the exit wipe.
  if (reducedNow && !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="Loading portfolio"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-80 flex flex-col items-center justify-center overflow-hidden bg-themeBg"
        >
          {/* dot-matrix boot grid */}
          <div
            className="grid grid-cols-5 gap-3"
            style={{ width: "min(11.25rem, 40vw)" }}
            aria-hidden="true"
          >
            {DOTS.map((d) => (
              <span
                key={d.i}
                className="dg-splash-dot"
                style={{
                  backgroundColor: d.color,
                  animationDelay: `${d.delay}ms`,
                }}
              />
            ))}
          </div>

          {/* tagline from site_config/splash_data */}
          <p className="dg-ui-mono mt-8 text-[0.6875rem] uppercase tracking-[0.4em] text-themeText-secondary">
            {final || fallbackFinal}
          </p>

          {/* percentage readout */}
          <p className="dg-f-data mt-3 text-xs tracking-[0.2em] text-themeAccentText" aria-hidden="true">
            {String(pct).padStart(3, "0")}%
          </p>

          {/* progress hairline with yellow tip */}
          <div className="absolute bottom-0 left-0 h-0.75 w-full bg-themeBg-secondary">
            <div
              className="relative h-full bg-themeAccent transition-[width] duration-150 ease-linear"
              style={{ width: `${pct}%` }}
            >
              <span className="absolute right-0 top-0 h-full w-0.75 bg-themeWarn" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

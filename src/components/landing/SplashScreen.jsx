"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getConfig } from "@/lib/firestore";

const DEFAULT_WORDS = ["DEVELOPER", "SCIENTIST", "ENGINEER", "BUILDER", "MAKER", "THINKER"];
const DEFAULT_FINAL = "DATA SCIENCE × FULL-STACK";
const INK = "#f3f0ef";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState("idle"); // idle | spin | land | reveal | burst | done
  const [showName, setShowName] = useState(false);
  const slotRef = useRef(null);
  const nameRef = useRef(null);
  const tickRef = useRef(0);
  const wordsRef = useRef(DEFAULT_WORDS);
  const finalRef = useRef(DEFAULT_FINAL);

  // load splash config once
  useEffect(() => {
    let mounted = true;
    getConfig("splash_data", null)
      .then((data) => {
        if (!mounted || !data) return;
        if (Array.isArray(data.words) && data.words.length) wordsRef.current = data.words;
        if (typeof data.final === "string" && data.final.trim()) finalRef.current = data.final.trim();
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  function tick() {
    const el = slotRef.current;
    if (!el) return;
    el.style.transition = "none";
    el.style.transform = "translateY(-100%)";
    el.textContent = wordsRef.current[tickRef.current % wordsRef.current.length];
    void el.offsetWidth;
    el.style.transition = "transform .45s cubic-bezier(.3,.7,.3,1)";
    el.style.transform = "translateY(0)";
    tickRef.current++;
  }

  function land() {
    const el = slotRef.current;
    if (!el) return;
    el.textContent = finalRef.current;
    el.style.color = INK;
    setPhase("land");
  }

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]).then(() => {
      if (reduced) {
        land();
        setShowName(true);
        setPhase("burst");
        return;
      }
      tick();
      const total = 5 + Math.floor(Math.random() * 2);
      let count = 0;
      const iv = setInterval(() => {
        count++;
        tick();
        if (count >= total) {
          clearInterval(iv);
          setTimeout(land, 460);
        }
      }, 240);
      return;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "land") return;
    const t = setTimeout(() => setShowName(true), 120);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "land") {
      const t = setTimeout(() => setPhase("burst"), 1800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "burst") {
      const t = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    const name = nameRef.current;
    if (!showName || !name) return;
    const anim = name.animate(
      [
        { opacity: 0, transform: "translateY(26px)", filter: "blur(6px)" },
        { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
      ],
      { duration: 1100, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" }
    );
    return () => anim.cancel();
  }, [showName]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(1000px 520px at 80% -10%, rgba(255,77,77,.14), transparent 60%), #0b0a0c",
          }}
        >
          {/* grain */}
          <div className="pointer-events-none fixed inset-0 opacity-[0.05]" style={{ backgroundImage: GRAIN }} />

          {/* expanding radial red burst when landing */}
          {phase !== "burst" && (
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "60vmax",
                height: "60vmax",
                background: "radial-gradient(circle, rgba(255,77,77,0.16), transparent 62%)",
                opacity: phase === "land" ? 1 : 0,
                transform: phase === "land" ? "translate(-50%,-50%) scale(1)" : "translate(-50%,-50%) scale(0.4)",
                transition: "transform 1.6s cubic-bezier(.16,1,.3,1), opacity .8s ease",
              }}
            />
          )}

          {/* word slot */}
          <div
            className="relative mb-[6vh] w-[min(90vw,980px)] overflow-hidden text-center"
            style={{
              height: "1.35em",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, #000 24%, #000 76%, transparent 100%)",
              color: "#8f8f99",
              opacity: phase === "idle" ? 0 : 1,
              transition: "opacity .6s ease",
            }}
          >
            <div ref={slotRef} style={{ willChange: "transform" }}>
              {wordsRef.current[0]}
            </div>
          </div>

          {/* name */}
          <h1
            ref={nameRef}
            className="text-center"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2.6rem, 10vw, 8rem)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              lineHeight: 1,
              color: INK,
              opacity: 0,
            }}
          >
            MUHAMMED<span className="emb-text"> FAHIM </span>M
          </h1>

          {/* ember sweep divider */}
          <div
            className="relative mt-[6vh] h-px w-[min(480px,70vw)] overflow-hidden"
            style={{ background: "#2a2326" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent, #ff5c60, #ff8a3d, transparent)",
                transform: "translateX(-100%)",
                animation: "sweep 1.6s .5s ease forwards",
              }}
            />
          </div>

          {/* bottom progress hairline */}
          <div
            className="absolute bottom-0 left-0 h-[3px] bg-linear-to-r from-themeAccent to-themeSecondary transition-all duration-[1600ms]"
            style={{ width: phase === "land" || phase === "burst" ? "100%" : "4%", opacity: phase === "idle" ? 0 : 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

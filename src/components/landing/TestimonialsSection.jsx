"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaQuoteRight } from "react-icons/fa";
import { getTestimonials } from "@/lib/firestore";
import { SplitText } from "@/components/ui/SplitText";

const AUTOPLAY_MS = 6000;

export function TestimonialsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getTestimonials();
      setItems(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  useEffect(() => {
    if (items.length < 2 || paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [items.length, paused]);

  const go = (dir) => {
    setIndex((prev) => (prev + dir + items.length) % items.length);
  };

  const current = items[index];

  return (
    <section id="testimonials" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <p className="text-themeAccent font-mono text-xs tracking-[0.3em] uppercase">
            What People Say
          </p>
          <SplitText
            text="Testimonials"
            className="font-display font-black uppercase leading-[0.95] tracking-tight text-[clamp(2rem,5vw,3rem)] text-themeText"
          />
        </motion.div>

        {loading ? (
          <div className="text-center py-24 text-themeText-secondary">Loading testimonials…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-themeText-secondary">No testimonials yet.</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative"
          >
            <FaQuoteRight className="absolute -top-8 -left-4 w-16 h-16 text-themeAccent/12 z-0" />

            <div className="glass rounded-[2rem] px-8 py-12 relative z-10 overflow-hidden border border-themeBorder">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-themeAccent/20 to-themeAccent-hover/20 blur-lg" />
                    <div className="relative w-20 h-20 rounded-full p-[3px] bg-gradient-to-br from-themeAccent to-themeAccent-hover">
                      <div className="rounded-full overflow-hidden w-full h-full bg-themeBgSecondary flex items-center justify-center">
                        {current.avatar_url ? (
                          <img src={current.avatar_url} alt={current.author} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-display font-bold text-xl text-themeAccent">
                            {getInitials(current.author)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <blockquote className="text-lg md:text-xl text-themeText-secondary leading-relaxed font-light max-w-lg mx-auto mb-8">
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>

                  <div className="mt-4">
                    <p className="font-display font-semibold text-themeText text-base">{current.author}</p>
                    {current.role && (
                      <p className="text-themeText-secondary text-sm mt-1">{current.role}</p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {items.length >= 2 && (
                <>
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous testimonial"
                    className="absolute top-1/2 -translate-y-1/2 left-3 p-2.5 rounded-full border border-themeBorder text-themeText-secondary hover:text-themeAccent hover:border-themeAccent transition-colors"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next testimonial"
                    className="absolute top-1/2 -translate-y-1/2 right-3 p-2.5 rounded-full border border-themeBorder text-themeText-secondary hover:text-themeAccent hover:border-themeAccent transition-colors"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-10 flex items-center justify-center gap-3">
              <span className="font-mono text-xs text-themeText-secondary">
                {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1.5">
                {items.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => setIndex(dotIndex)}
                    aria-label={`Go to testimonial ${dotIndex + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      dotIndex === index ? "w-8 bg-themeAccent" : "w-2 bg-themeBorder hover:bg-themeText-secondary/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function getInitials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

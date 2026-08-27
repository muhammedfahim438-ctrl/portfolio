"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaStar, FaQuoteRight } from "react-icons/fa";
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
      // silent — empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
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
    <section id="testimonials" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="theme-eyebrow mb-3">What People Say</p>
          <SplitText
            text="Testimonials"
            className="text-3xl md:text-5xl font-display font-bold text-gradient"
          />
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-themeText-secondary">
            Loading testimonials…
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-themeText-secondary">
            No testimonials yet.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative"
          >
            <FaQuoteRight className="absolute -top-8 -left-4 w-16 h-16 text-themeAccent/20 z-0" />

            <div className="glass rounded-3xl px-6 py-10 md:px-14 md:py-14 relative z-10 overflow-hidden">
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
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-themeAccent/40 to-themeSecondary/40 blur-lg" />
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] bg-gradient-to-br from-themeAccent to-themeSecondary">
                      <div className="rounded-full overflow-hidden w-full h-full bg-themeBg-secondary">
                        {current.avatar_url ? (
                          <img
                            src={current.avatar_url}
                            alt={current.author}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-display font-bold text-xl text-themeAccent">
                            {getInitials(current.author)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {current.rating > 0 && (
                    <div className="flex items-center gap-1 mb-5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.span
                          key={star}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15 + star * 0.07, duration: 0.3 }}
                        >
                          <FaStar
                            className={
                              star <= Math.round(current.rating)
                                ? "text-themeSecondary w-4 h-4"
                                : "text-themeBorder w-4 h-4"
                            }
                          />
                        </motion.span>
                      ))}
                    </div>
                  )}

                  <blockquote className="text-lg md:text-xl text-themeText-secondary leading-relaxed md:leading-relaxed font-light">
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>

                  <div className="mt-8">
                    <p className="font-display font-semibold text-themeText text-lg">
                      {current.author}
                    </p>
                    {current.role && (
                      <p className="text-themeText-secondary text-sm mt-0.5">
                        {current.role}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {items.length >= 2 && (
                <>
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous testimonial"
                    className="absolute top-1/2 -translate-y-1/2 left-3 md:left-5 p-2 rounded-full border border-themeBorder text-themeText-secondary hover:text-themeAccent hover:border-themeAccent transition-colors"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next testimonial"
                    className="absolute top-1/2 -translate-y-1/2 right-3 md:right-5 p-2 rounded-full border border-themeBorder text-themeText-secondary hover:text-themeAccent hover:border-themeAccent transition-colors"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <span className="font-mono text-xs text-themeText-secondary">
                {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2">
                {items.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    onClick={() => setIndex(dotIndex)}
                    aria-label={`Go to testimonial ${dotIndex + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      dotIndex === index
                        ? "w-8 bg-themeAccent"
                        : "w-2.5 bg-themeBorder hover:bg-themeText-secondary/40"
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
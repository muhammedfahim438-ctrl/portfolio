"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Certifications", href: "/#certifications" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Contact", href: "/#contact" },
];

export function NotFound() {
  useEffect(() => {
    document.title = "404 — Page not found | Muhammed Fahim M";
    return () => {
      document.title = "Muhammed Fahim M | Data Science & Full-Stack Developer";
    };
  }, []);

  return (
    <main className="min-h-screen bg-themeBg flex flex-col items-center justify-center px-4 py-24 text-center">
      <div className="pointer-events-none fixed inset-0 terminal-grid opacity-60" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex max-w-2xl flex-col items-center"
      >
        <p className="theme-eyebrow mb-6">Error 404</p>

        <h1 className="font-display font-bold leading-none tracking-tight text-[clamp(4rem,18vw,9rem)]">
          <span className="emb-text">4</span>
          <span className="text-themeText">0</span>
          <span className="emb-text">4</span>
        </h1>

        <p className="theme-display mt-6">Page not found</p>

        <p className="theme-lede mt-4">
          That route doesn&apos;t exist — it may have been moved, renamed, or
          never shipped. The rest of the site is very much alive.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-xl bg-linear-to-r from-themeAccent to-themeSecondary px-7 py-3.5 font-display font-semibold text-white shadow-lg transition-opacity hover:opacity-90"
          >
            <FiArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>

        <nav aria-label="Site sections" className="mt-14 w-full">
          <p className="theme-eyebrow mb-4">Or jump to a section</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="link-underline text-sm text-themeText-secondary transition-colors hover:text-themeAccent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>
    </main>
  );
}

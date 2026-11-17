"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiSend } from "react-icons/fi";
import { getConfig, getSocialData } from "@/lib/firestore";
import { safeUrl } from "@/lib/safeUrl";
import { useBrandContent } from "@/hooks/useBrandContent";
import { EntranceReveal } from "@/components/ui/EntranceReveal";
import { ParallaxLayers } from "@/components/ui/ParallaxLayers";
import { Tilt3D } from "@/components/ui/Tilt3D";

export function HeroSection() {
  const { hero } = useBrandContent();

  const [social, setSocial] = useState({
    github: "https://github.com/muhammedfahim438-ctrl",
    linkedin: "https://linkedin.com/in/muhammed-fahim-m",
    email: "muhammedfahim438@gmail.com",
    resume: "",
  });

  // `portrait_data.photos` is a list of optional hero portraits. One image is
  // shown at a time; when several are configured the hero rotates through them.
  const [portraits, setPortraits] = useState([]);
  const [portraitIndex, setPortraitIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    getConfig("portrait_data")
      .then((data) => {
        if (!mounted) return;
        const photos = Array.isArray(data?.photos)
          ? data.photos.filter(Boolean)
          : [];
        setPortraits(photos);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (portraits.length < 2) return;
    const id = setInterval(
      () => setPortraitIndex((index) => (index + 1) % portraits.length),
      6000
    );
    return () => clearInterval(id);
  }, [portraits.length]);

  useEffect(() => {
    let mounted = true;
    async function fetchSocial() {
      try {
        const socialData = await getSocialData();
        if (!mounted || !socialData) return;
        setSocial((prev) => ({
          github: socialData.github || prev.github,
          linkedin: socialData.linkedin || prev.linkedin,
          email: socialData.email || prev.email,
          resume: socialData.resume_pdf_url || "",
        }));
      } catch {
        // fallback to defaults
      }
    }
    fetchSocial();
    return () => {
      mounted = false;
    };
  }, []);

  const dock = [
    { label: "GitHub", href: safeUrl(social.github), external: true },
    { label: "LinkedIn", href: safeUrl(social.linkedin), external: true },
    { label: "Email", href: safeUrl(`mailto:${social.email}`), external: false },
  ];
  const resumeUrl = safeUrl(social.resume);
  if (resumeUrl) {
    dock.push({ label: "Resume", href: resumeUrl, external: true });
  }

  const proof = Array.isArray(hero.proof) ? hero.proof.filter(Boolean) : [];
  const portraitSrc = safeUrl(
    hero.photo_url || portraits[portraitIndex],
    "/portrait.svg"
  );

  return (
    <section
      id="hero"
      className="dg-screen relative flex min-h-dvh scroll-mt-24 items-center overflow-hidden border-t-2 border-themeAccent"
    >
      {/* Parallax background: blueprint grid + accent glows over the dot HUD */}
      <div className="absolute inset-0" aria-hidden="true">
        <ParallaxLayers className="h-full w-full">
          <div className="dg-blueprint absolute inset-0 opacity-10" />
          <div className="absolute inset-0">
            <div className="absolute -left-24 top-1/4 h-72 w-72 bg-themeSecondary/20 blur-3xl" />
            <div className="absolute -right-16 bottom-0 h-64 w-64 bg-themeAccent/10 blur-3xl" />
          </div>
        </ParallaxLayers>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-24 md:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left: copy */}
          <EntranceReveal variant="slide" delay={0} className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3 border-l-2 border-themeAccent pl-4">
                <span className="dg-ui-mono text-[0.6875rem] font-bold uppercase tracking-[0.4em] text-themeAccentText">
                  {hero.eyebrow}
                </span>
              </div>

              <h1
                aria-label={hero.headline}
                className="dg-f-display dg-glitch text-themeText"
                data-text={hero.headline}
                style={{
                  fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.03em",
                  fontWeight: 800,
                  textWrap: "balance",
                }}
              >
                {hero.headline}
              </h1>

              <p className="dg-f-subhead text-lg leading-relaxed text-themeText">
                {hero.subhead}
              </p>

              {proof.length > 0 && (
                <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-themeBorder/40 pt-6">
                  {proof.map((item) => (
                    <li
                      key={item}
                      className="dg-ui-mono flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.15em] text-themeTextSecondary"
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 bg-themeAccent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a
                  href={safeUrl(hero.ctaPrimaryHref, "#contact")}
                  className="btn btn--primary dg-border-neon-red"
                >
                  {hero.ctaPrimaryLabel} <FiSend className="ml-2 w-4 h-4" />
                </a>
                <a
                  href={safeUrl(hero.ctaSecondaryHref, "#work")}
                  className="btn btn--secondary"
                >
                  {hero.ctaSecondaryLabel} <FiArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </EntranceReveal>

          {/* Right: portrait with 3D tilt */}
          <EntranceReveal
            variant="scale"
            delay={0.2}
            className="relative mx-auto w-72 h-80 sm:w-96 sm:h-112 lg:w-lg lg:h-160"
          >
            <Tilt3D maxRotate={6} perspective={900} scale={1.01} className="h-full w-full">
              <div className="dg-sheen relative h-full w-full overflow-hidden border-2 border-themeAccent bg-themeBg shadow-[8px_8px_0_0_var(--dg-accent-s)] dg-r-0">
                <div className="absolute top-0 left-0 h-16 w-16 border-t-2 border-l-2 border-themeWarn" />
                <div className="absolute right-0 bottom-0 h-16 w-16 border-r-2 border-b-2 border-themeWarn" />
                <AnimatePresence initial={false}>
                  <motion.img
                    key={portraitSrc}
                    src={portraitSrc}
                    alt={hero.portraitAlt || "Portrait of Muhammed Fahim M"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 h-full w-full object-cover grayscale-[30%] transition-[filter] duration-500 hover:grayscale-0"
                    loading="eager"
                  />
                </AnimatePresence>
              </div>
            </Tilt3D>
          </EntranceReveal>
        </div>

        {/* Social dock, in flow at the hero bottom */}
        <EntranceReveal variant="fade" delay={0.4} className="mt-16">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-themeBorder/40 pt-6">
            {dock.map((item) => (
              <a
                key={item.label}
                href={item.href}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="dg-ui-mono text-xs font-bold uppercase tracking-[0.2em] text-themeTextSecondary transition-colors hover:text-themeAccentText"
              >
                {item.label}
              </a>
            ))}
            <span className="dg-ui-mono ml-auto hidden text-[0.625rem] uppercase tracking-[0.3em] text-themeText-secondary/80 md:block">
              {hero.footerLine}
            </span>
          </div>
        </EntranceReveal>
      </div>

      {/* Scroll indicator */}
      <div className="absolute right-6 bottom-6 hidden flex-col items-center gap-2 md:flex">
        <span className="dg-ui-mono text-[0.625rem] font-bold uppercase tracking-[0.4em] text-themeTextSecondary/80">
          Scroll
        </span>
        <div className="flex h-12 w-4 items-start justify-center border-2 border-themeAccent bg-themeBg/70 px-1 backdrop-blur-sm">
          <div className="h-2 w-1 animate-scroll-dot bg-themeAccent" />
        </div>
      </div>
    </section>
  );
}

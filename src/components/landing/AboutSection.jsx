"use client";
import { useEffect, useState } from "react";
import { FiDownload, FiSend } from "react-icons/fi";
import { getConfig, getSocialData } from "@/lib/firestore";
import { useBrandContent } from "@/hooks/useBrandContent";
import { EntranceReveal } from "@/components/ui/EntranceReveal";
import { ParallaxLayers } from "@/components/ui/ParallaxLayers";

export function AboutSection() {
  const { about } = useBrandContent();

  const [resume, setResume] = useState("/resume.pdf");
  // null = availability doc missing or unreadable; the STATUS line only
  // renders when Firestore provides a real answer.
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      let url = "";
      try {
        const social = await getSocialData();
        url = social?.resume_pdf_url || "";
      } catch {
        // fall through to the bundled /resume.pdf
      }
      if (mounted) setResume(url || "/resume.pdf");
      try {
        const availability = await getConfig("availability_data");
        if (mounted && availability && typeof availability.available === "boolean") {
          setStatus(
            availability.available
              ? availability.label || "Open to work"
              : "Not available"
          );
        }
      } catch {
        // leave status null; the line hides itself
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const facts = Array.isArray(about.facts) ? about.facts : [];
  const stats = Array.isArray(about.stats) ? about.stats : [];
  const tech = Array.isArray(about.tech) ? about.tech : [];
  const paragraphs = Array.isArray(about.paragraphs) ? about.paragraphs : [];

  return (
    <section
      id="about"
      className="dg-screen relative overflow-hidden border-t-2 border-themeBorder py-24 px-4"
    >
      {/* Ambient parallax glows over the dot HUD, under the Swiss grid */}
      <div className="absolute inset-0" aria-hidden="true">
        <ParallaxLayers className="h-full w-full">
          <div className="absolute inset-0">
            <div className="absolute -left-32 top-0 h-72 w-72 bg-themeAccent/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 bg-themeSecondary/15 blur-3xl" />
          </div>
        </ParallaxLayers>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <EntranceReveal variant="slide" delay={0}>
          {/* Masthead rule */}
          <div className="flex items-end justify-between gap-4 border-b-2 border-themeAccent pb-4">
            <p className="dg-ui-mono text-[0.6875rem] font-bold uppercase tracking-[0.3em] text-themeAccent">
              [ {about.label} ]
            </p>
            <p className="dg-ui-mono hidden text-[0.625rem] uppercase tracking-[0.2em] text-themeText-secondary sm:block">
              {about.revision}
            </p>
          </div>

          {/* Macro type + registration marks + barcode */}
          <div className="relative mt-10 flex items-start justify-between gap-6">
            <span aria-hidden="true" className="dg-ui-mono absolute -top-5 right-1/4 select-none text-sm font-bold text-themeWarn">
              +
            </span>
            <span aria-hidden="true" className="dg-ui-mono absolute -bottom-7 left-1 select-none text-sm font-bold text-themeWarn">
              +
            </span>
            <h2
              aria-label={about.display}
              className="dg-f-display dg-glitch text-themeText uppercase"
              data-text={about.display}
              style={{
                fontSize: "clamp(3.5rem, 12vw, 10rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                fontWeight: 800,
              }}
            >
              {about.display}
            </h2>
            <div
              aria-hidden="true"
              className="mt-2 hidden h-28 w-16 shrink-0 sm:block"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, var(--themeText) 0 2px, transparent 2px 5px, var(--themeText) 5px 6px, transparent 6px 10px)",
              }}
            />
          </div>

          {/* Razor grid body (1px rules via gap-px on a border-color track) */}
          <div className="mt-14 grid grid-cols-1 gap-px border-2 border-themeBorder bg-themeBorder lg:grid-cols-12">
            {/* Left cell: bio, facts, actions */}
            <div className="bg-themeBg/55 p-8 lg:col-span-7 lg:p-10">
              <p className="dg-f-display text-2xl font-bold leading-tight tracking-tight text-themeAccent sm:text-3xl">
                {about.lead}
              </p>

              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`dg-f-subhead text-lg leading-relaxed text-themeText ${
                    index === 0 ? "mt-6" : "mt-5"
                  }`}
                >
                  {paragraph}
                </p>
              ))}

              <dl className="mt-8 grid grid-cols-1 gap-px border border-themeBorder bg-themeBorder sm:grid-cols-2">
                {facts.map((fact) => (
                  <div key={fact.term} className="bg-themeBg/55 p-4">
                    <dt className="dg-ui-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-themeText-secondary">
                      {fact.term}
                    </dt>
                    <dd className="dg-ui-mono mt-1.5 text-xs font-bold uppercase leading-snug tracking-wide text-themeText">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary dg-border-neon-red"
                >
                  {about.resumeLabel} <FiDownload className="ml-2 w-4 h-4" />
                </a>
                <a href={about.ctaHref || "#contact"} className="btn btn--secondary">
                  {about.ctaLabel} <FiSend className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right cell: stat readouts + telemetry line */}
            <div className="flex flex-col bg-themeBg/55 p-8 lg:col-span-5 lg:p-10">
              {/* Stat readouts: primary stat spans the plate, three secondaries row beneath */}
              <div className="grid grid-cols-3 gap-px border border-themeBorder bg-themeBorder">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`bg-themeBg/55 p-6 transition-colors duration-150 hover:bg-themeSecondary/10 ${
                      index === 0 ? "col-span-3 outline outline-2 outline-themeAccent" : ""
                    }`}
                  >
                    <span
                      className={`dg-f-data block font-bold uppercase leading-none tracking-tighter ${
                        index === 0 ? "text-5xl text-themeAccent" : "text-4xl text-themeText"
                      }`}
                    >
                      {stat.value}
                    </span>
                    <span className="dg-ui-mono mt-3 block text-[0.625rem] font-bold uppercase leading-snug tracking-[0.2em] text-themeText-secondary">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="dg-f-data mt-8 text-[0.625rem] font-bold uppercase tracking-[0.25em] text-themeText-secondary">
                {about.coordinates}
              </p>
              {status && (
                <p className="dg-ui-mono mt-4 border-l-2 border-themeWarn pl-4 text-xs font-bold uppercase tracking-[0.25em] text-themeWarn">
                  STATUS: {status}
                </p>
              )}

              {/* Tech as razor-grid chips */}
              <div className="mt-8 flex flex-wrap gap-2 border-t border-themeBorder pt-6">
                {tech.map((item) => (
                  <span
                    key={item}
                    className="dg-ui-mono border border-themeBorder px-3 py-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-themeText-secondary transition-colors duration-150 hover:border-themeAccent hover:text-themeAccent"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </EntranceReveal>
      </div>
    </section>
  );
}

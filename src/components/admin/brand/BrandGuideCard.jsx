"use client";

import { BRAND_GUIDE } from "@/data/brandDefaults";

// Read-only reference for the brand system. Deliberately not editable: the
// rules are the guardrail that keeps the copy honest, so they ship with the
// code rather than living in a document somebody can quietly rewrite.
export function BrandGuideCard() {
  return (
    <section className="space-y-6 border-4 border-themeWarn bg-themeSurface/20 backdrop-blur-md p-6 shadow-[4px_4px_0_0_var(--dg-bg-deep)] dg-r-0">
      <header>
        <p className="dg-ui-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-themeWarn">
          Brand guide — read only
        </p>
        <h2 className="dg-f-display mt-2 text-xl font-bold uppercase tracking-tight text-themeText">
          {BRAND_GUIDE.positioning}
        </h2>
        <p className="dg-f-subhead mt-2 text-sm text-themeTextSecondary">
          {BRAND_GUIDE.promise} <span className="text-themeAccentText">{BRAND_GUIDE.wedge}</span>
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="border-2 border-themeBorder/70 bg-themeBg/60 backdrop-blur-sm p-4">
          <p className="dg-ui-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-themeAccentText">
            Proof you can publish
          </p>
          <ul className="mt-3 space-y-2">
            {BRAND_GUIDE.proof.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-xs leading-relaxed text-themeTextSecondary"
              >
                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 bg-themeAccent" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-2 border-themeBorder/70 bg-themeBg/60 backdrop-blur-sm p-4">
          <p className="dg-ui-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-themeAccentText">
            Voice
          </p>
          <ul className="mt-3 space-y-2">
            {BRAND_GUIDE.voice.do.map((item) => (
              <li key={item} className="flex gap-2 text-xs leading-relaxed text-themeTextSecondary">
                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 bg-themeWarn" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-2 border-themeAccent bg-themeAccent/10 p-4">
        <p className="dg-ui-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-themeAccentText">
          Never publish
        </p>
        <ul className="mt-3 space-y-2">
          {BRAND_GUIDE.voice.dont.map((item) => (
            <li key={item} className="flex gap-2 text-xs leading-relaxed text-themeText">
              <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 bg-themeAccent" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-1 border-l-2 border-themeBorder pl-4">
        <p className="dg-ui-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-themeTextSecondary">
          Audience
        </p>
        <p className="text-xs leading-relaxed text-themeText">{BRAND_GUIDE.audience}</p>
        <p className="mt-2 text-xs leading-relaxed text-themeTextSecondary">{BRAND_GUIDE.cta}</p>
      </div>
    </section>
  );
}

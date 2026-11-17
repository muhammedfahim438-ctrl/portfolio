"use client";

// Read-only previews rendered with the real design tokens, so the admin sees
// roughly what the landing page will show. These are approximations — the
// live sections have entrance animations and responsive type.

export function HeroPreview({ values = {} }) {
  const proof = Array.isArray(values.proof) ? values.proof.filter(Boolean) : [];

  return (
    <div className="border-2 border-themeBorder/70 bg-themeBg/60 backdrop-blur-sm p-6">
      <p className="dg-ui-mono border-l-2 border-themeAccent pl-3 text-[0.5625rem] font-bold uppercase tracking-[0.3em] text-themeAccentText">
        {values.eyebrow || "—"}
      </p>
      <p
        className="dg-f-display mt-4 font-extrabold leading-[1.03] tracking-tight text-themeText"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
      >
        {values.headline || "—"}
      </p>
      <p className="dg-f-subhead mt-3 text-sm leading-relaxed text-themeText">
        {values.subhead || "—"}
      </p>

      {proof.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-themeBorder/40 pt-4">
          {proof.map((item) => (
            <li
              key={item}
              className="dg-ui-mono flex items-center gap-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-themeTextSecondary"
            >
              <span aria-hidden="true" className="h-1 w-1 bg-themeAccent" />
              {item}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="dg-ui-mono border-2 border-themeAccent bg-themeAccent px-3 py-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-themeText">
          {values.ctaPrimaryLabel || "—"}
        </span>
        <span className="dg-ui-mono border-2 border-themeBorder px-3 py-1.5 text-[0.5625rem] font-bold uppercase tracking-[0.15em] text-themeText">
          {values.ctaSecondaryLabel || "—"}
        </span>
      </div>
    </div>
  );
}

export function AboutPreview({ values = {} }) {
  const facts = Array.isArray(values.facts) ? values.facts : [];
  const paragraphs = Array.isArray(values.paragraphs) ? values.paragraphs : [];

  return (
    <div className="border-2 border-themeBorder/70 bg-themeBg/60 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between gap-3 border-b-2 border-themeAccent pb-2">
        <span className="dg-ui-mono text-[0.5625rem] font-bold uppercase tracking-[0.3em] text-themeAccentText">
          [ {values.label || "—"} ]
        </span>
        <span className="dg-ui-mono text-[0.5rem] uppercase tracking-[0.2em] text-themeTextSecondary">
          {values.revision}
        </span>
      </div>

      <p className="dg-f-display mt-4 text-2xl font-extrabold uppercase tracking-tight text-themeText">
        {values.display || "—"}
      </p>
      <p className="mt-2 text-lg font-bold leading-tight text-themeAccentText">
        {values.lead || "—"}
      </p>
      {paragraphs[0] && (
        <p className="dg-f-subhead mt-3 line-clamp-3 text-sm leading-relaxed text-themeText">
          {paragraphs[0]}
        </p>
      )}

      {facts.length > 0 && (
        <dl className="mt-4 grid grid-cols-2 gap-px border border-themeBorder bg-themeBorder">
          {facts.slice(0, 6).map((fact) => (
            <div key={fact.term} className="bg-themeBg/60 p-2.5">
              <dt className="dg-ui-mono text-[0.5rem] font-bold uppercase tracking-[0.2em] text-themeTextSecondary">
                {fact.term}
              </dt>
              <dd className="dg-ui-mono mt-1 text-[0.625rem] font-bold uppercase leading-snug text-themeText">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export function SeoPreview({ title = "", description = "", url = "muhammedfahimm-portfolio.vercel.app" }) {
  return (
    <div className="space-y-4">
      <div className="border-2 border-themeBorder/70 bg-themeBg/60 backdrop-blur-sm p-5">
        <p className="dg-ui-mono text-[0.5625rem] font-bold uppercase tracking-[0.25em] text-themeTextSecondary">
          Google result
        </p>
        <p className="mt-3 truncate text-xs text-themeTextSecondary">{url}</p>
        <p className="mt-1 truncate text-lg text-themeAccentText underline">{title || "—"}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-themeTextSecondary">
          {description || "—"}
        </p>
      </div>

      <div className="border-2 border-themeBorder/70 bg-themeBg/60 backdrop-blur-sm p-5">
        <p className="dg-ui-mono text-[0.5625rem] font-bold uppercase tracking-[0.25em] text-themeTextSecondary">
          Social card
        </p>
        <div className="mt-3 border border-themeBorder">
          <div className="flex h-24 items-center justify-center bg-themeAccent/10">
            <span className="dg-ui-mono text-[0.5625rem] uppercase tracking-[0.3em] text-themeAccentText">
              og-cover.png
            </span>
          </div>
          <div className="p-3">
            <p className="line-clamp-1 text-xs font-bold text-themeText">{title || "—"}</p>
            <p className="mt-1 line-clamp-2 text-[0.6875rem] leading-relaxed text-themeTextSecondary">
              {description || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

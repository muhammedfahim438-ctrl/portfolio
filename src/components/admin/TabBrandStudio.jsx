"use client";

import { useState } from "react";
import { BrandForm } from "./brand/BrandForm";
import { BrandGuideCard } from "./brand/BrandGuideCard";
import { HeroPreview, AboutPreview, SeoPreview } from "./brand/BrandPreview";
import { BRAND, HERO, ABOUT, SECTIONS, FOOTER } from "@/data/brandDefaults";

const SPLASH_DEFAULTS = { words: [], final: FOOTER.splashFinal };

const TABS = [
  { id: "identity", label: "Identity" },
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "stack", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
  { id: "footer", label: "Footer & Splash" },
  { id: "seo", label: "SEO" },
];

const IDENTITY_SCHEMA = [
  { key: "name", label: "Full name", type: "text", placeholder: "Muhammed Fahim M" },
  { key: "shortName", label: "Short name", type: "text", placeholder: "Fahim" },
  { key: "monogram", label: "Monogram", type: "text", placeholder: "MF", hint: "Two letters, used in the admin header and social cards." },
  { key: "role", label: "Role", type: "text", placeholder: "Data Product Engineer" },
  { key: "tagline", label: "Tagline", type: "text", max: 70, placeholder: "I turn raw data into shipped products." },
  { key: "brandLine", label: "Brand line", type: "text", placeholder: "RAW DATA → MODEL → API → INTERFACE" },
  { key: "location", label: "Location (full)", type: "text", placeholder: "Palakkad, Kerala, India" },
  { key: "locationShort", label: "Location (short)", type: "text", placeholder: "Palakkad, Kerala" },
];

const HERO_SCHEMA = [
  { key: "eyebrow", label: "Eyebrow", type: "text", max: 80, placeholder: "MUHAMMED FAHIM M · DATA PRODUCT ENGINEER" },
  { key: "headline", label: "Headline", type: "text", max: 60, placeholder: "I turn raw data into shipped products." },
  { key: "subhead", label: "Subhead", type: "textarea", rows: 3, max: 220 },
  { key: "proof", label: "Proof points", type: "lines", rows: 3, hint: "One verifiable fact per line. These render under the subhead." },
  { key: "ctaPrimaryLabel", label: "Primary CTA label", type: "text", placeholder: "Start a project" },
  { key: "ctaPrimaryHref", label: "Primary CTA link", type: "text", placeholder: "#contact" },
  { key: "ctaSecondaryLabel", label: "Secondary CTA label", type: "text", placeholder: "See the work" },
  { key: "ctaSecondaryHref", label: "Secondary CTA link", type: "text", placeholder: "#work" },
  { key: "footerLine", label: "Hero footer line", type: "text", placeholder: "PALAKKAD, KERALA · OPEN TO FULL-TIME ROLES" },
  { key: "portraitAlt", label: "Portrait alt text", type: "text" },
  { key: "photo_url", label: "Portrait URL", type: "text", hint: "Leave blank to use the bundled /portrait.svg." },
];

const ABOUT_SCHEMA = [
  { key: "label", label: "Section label", type: "text", placeholder: "SEC.01 // PROFILE" },
  { key: "revision", label: "Revision line", type: "text", placeholder: "DOSSIER MF-01 / REV 2026.1" },
  { key: "display", label: "Macro heading", type: "text", max: 24, placeholder: "ABOUT ME" },
  { key: "lead", label: "Lead line", type: "text", max: 80, placeholder: "I build the part after the notebook." },
  { key: "paragraphs", label: "Bio paragraphs", type: "lines", rows: 8, hint: "One paragraph per line. Keep claims verifiable." },
  {
    key: "facts",
    label: "Profile facts",
    type: "pairs",
    fields: [
      { key: "term", placeholder: "Role" },
      { key: "value", placeholder: "Data Product Engineer" },
    ],
    empty: { term: "", value: "" },
  },
  {
    key: "stats",
    label: "Stat readouts",
    type: "pairs",
    fields: [
      { key: "value", placeholder: "619,246" },
      { key: "label", placeholder: "Village records served" },
    ],
    empty: { value: "", label: "" },
  },
  { key: "tech", label: "Tech chips", type: "tags", hint: "Comma-separated. Ten reads best in the grid." },
  { key: "coordinates", label: "Coordinates line", type: "text" },
  { key: "resumeLabel", label: "Resume button label", type: "text" },
  { key: "ctaLabel", label: "Secondary CTA label", type: "text" },
  { key: "ctaHref", label: "Secondary CTA link", type: "text" },
];

const EXPERIENCE_SCHEMA = [
  { key: "label", label: "Section label", type: "text" },
  { key: "heading", label: "Heading", type: "text", max: 60 },
  { key: "subhead", label: "Subhead", type: "textarea", rows: 3, max: 200 },
  { key: "educationLabel", label: "Education label", type: "text" },
  { key: "educationLine", label: "Education line", type: "text", hint: "Degree only — no CGPA, no college name." },
];

const SKILLS_SCHEMA = [
  { key: "label", label: "Section label", type: "text" },
  { key: "heading", label: "Heading", type: "text", max: 60 },
  { key: "subhead", label: "Subhead", type: "textarea", rows: 3, max: 200 },
];

const WORK_SCHEMA = [
  { key: "label", label: "Section label", type: "text" },
  { key: "heading", label: "Heading", type: "text", max: 60 },
  { key: "subhead", label: "Subhead", type: "textarea", rows: 3, max: 220 },
  { key: "ctaLabel", label: "CTA label", type: "text" },
  { key: "ctaHref", label: "CTA link", type: "text" },
];

const CONTACT_SCHEMA = [
  { key: "label", label: "Section label", type: "text" },
  { key: "heading", label: "Heading", type: "text", max: 60 },
  { key: "subhead", label: "Subhead", type: "textarea", rows: 3, max: 240 },
  { key: "ctaLabel", label: "Primary CTA label", type: "text" },
  { key: "ctaSecondaryLabel", label: "Secondary CTA label", type: "text" },
  { key: "successTitle", label: "Sent message title", type: "text" },
  { key: "successBody", label: "Sent message body", type: "text" },
  { key: "footnote", label: "Privacy footnote", type: "text" },
];

const FOOTER_SCHEMA = [
  { key: "copyright", label: "Copyright line", type: "text" },
  { key: "brandLine", label: "Brand line", type: "text" },
  { key: "credit", label: "Credit line", type: "text" },
  {
    key: "nav",
    label: "Footer navigation",
    type: "pairs",
    fields: [
      { key: "label", placeholder: "About" },
      { key: "href", placeholder: "#about" },
    ],
    empty: { label: "", href: "" },
  },
  { key: "splashFinal", label: "Splash tagline", type: "text", max: 40 },
];

const SEO_SCHEMA = [
  { key: "metaTitle", label: "Meta title", type: "text", max: 60 },
  { key: "metaDescription", label: "Meta description", type: "textarea", rows: 3, max: 160 },
];

export function TabBrandStudio() {
  const [active, setActive] = useState("identity");

  return (
    <div className="space-y-6">
      <div className="border-4 border-themeAccent bg-themeSurface/30 p-5 shadow-[4px_4px_0_0_var(--dg-bg-deep)] dg-r-0">
        <p className="dg-ui-mono text-[0.625rem] font-bold uppercase tracking-[0.3em] text-themeAccentText">
          Brand Studio
        </p>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-themeTextSecondary">
          Every heading, subhead and CTA on the landing page is edited here. Values are
          stored in Firestore and merged over{" "}
          <code className="text-themeText">src/data/brandDefaults.js</code>; a missing
          document falls back to the code defaults. Reload the site to see a saved change.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`border-4 border-themeAccent bg-transparent px-4 py-2 font-mono text-[0.6875rem] uppercase tracking-wider transition-all duration-300 ${
              active === tab.id
                ? "bg-themeAccent text-themeText shadow-[4px_4px_0_0_var(--dg-bg-deep)]"
                : "text-themeText-secondary shadow-[2px_2px_0_0_var(--dg-bg-deep)] hover:text-themeText hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)]"
            } dg-r-0`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === "identity" && (
        <div className="space-y-6">
          <BrandForm
            configKey="brand_data"
            title="Identity & Voice"
            desc="Name, role, tagline and the brand line. These feed the page title, the SEO preview and the footer."
            schema={IDENTITY_SCHEMA}
            defaults={BRAND}
          />
          <BrandGuideCard />
        </div>
      )}

      {active === "hero" && (
        <BrandForm
          configKey="hero_data"
          title="Hero"
          desc="The first screen. One claim, one proof strip, two actions. The preview updates as you type."
          schema={HERO_SCHEMA}
          defaults={HERO}
        >
          {(values) => <HeroPreview values={values} />}
        </BrandForm>
      )}

      {active === "about" && (
        <BrandForm
          configKey="about_data"
          title="About"
          desc="The profile section: lead claim, bio, facts, stat readouts and tech chips."
          schema={ABOUT_SCHEMA}
          defaults={ABOUT}
        >
          {(values) => <AboutPreview values={values} />}
        </BrandForm>
      )}

      {active === "experience" && (
        <div className="space-y-4">
          <BrandForm
            configKey="sections_data"
            path="experience"
            title="Experience — section copy"
            desc="Heading and subhead for the experience band."
            schema={EXPERIENCE_SCHEMA}
            defaults={SECTIONS}
          />
          <p className="border-l-2 border-themeWarn pl-4 text-xs leading-relaxed text-themeTextSecondary">
            The internship entries themselves live in the <strong>Content → Experience</strong>{" "}
            tab, so each role stays a separate, editable record.
          </p>
        </div>
      )}

      {active === "stack" && (
        <BrandForm
          configKey="sections_data"
          path="skills"
          title="Stack — section copy"
          desc="Heading and subhead above the skills grid. The skills themselves are edited in Skills & Links."
          schema={SKILLS_SCHEMA}
          defaults={SECTIONS}
        />
      )}

      {active === "work" && (
        <BrandForm
          configKey="sections_data"
          path="work"
          title="Work — section copy"
          desc="Heading, subhead and the CTA under the case studies. Projects are edited in the Projects tab."
          schema={WORK_SCHEMA}
          defaults={SECTIONS}
        />
      )}

      {active === "contact" && (
        <BrandForm
          configKey="sections_data"
          path="contact"
          title="Contact — section copy"
          desc="The closing pitch, both actions and the confirmation message."
          schema={CONTACT_SCHEMA}
          defaults={SECTIONS}
        />
      )}

      {active === "footer" && (
        <div className="space-y-6">
          <BrandForm
            configKey="footer_data"
            title="Footer"
            desc="Navigation, copyright and the brand line that closes the page."
            schema={FOOTER_SCHEMA}
            defaults={FOOTER}
          />
          <BrandForm
            configKey="splash_data"
            title="Splash screen"
            desc="The tagline shown under the boot grid on first load."
            schema={[{ key: "final", label: "Final tagline", type: "text", max: 40 }]}
            defaults={SPLASH_DEFAULTS}
          />
        </div>
      )}

      {active === "seo" && (
        <div className="space-y-6">
          <BrandForm
            configKey="brand_data"
            title="Search & social metadata"
            desc="The browser tab and in-page description update immediately. Link previews are baked into index.html at build time — update the defaults file and redeploy for those."
            schema={SEO_SCHEMA}
            defaults={BRAND}
          >
            {(values) => (
              <SeoPreview title={values.metaTitle} description={values.metaDescription} />
            )}
          </BrandForm>
          <div className="border-4 border-themeWarn bg-themeSurface/30 p-5 dg-r-0">
            <p className="dg-ui-mono text-[0.625rem] font-bold uppercase tracking-[0.25em] text-themeWarn">
              Build-time limitation
            </p>
            <p className="mt-2 text-xs leading-relaxed text-themeTextSecondary">
              Open Graph and Twitter cards are read by crawlers from{" "}
              <code className="text-themeText">index.html</code>. A Firestore edit updates the
              tab title and the meta description for browsers, but LinkedIn, X and WhatsApp will
              keep the old card until the site is rebuilt and redeployed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

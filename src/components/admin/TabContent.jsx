"use client";

import { useState } from "react";
import { ReusableCrud } from "./ReusableCrud";
import { ICON_KEYS } from "@/lib/iconMap";

const SECTIONS = [
  {
    id: "services",
    label: "Services",
    collection: "services",
    empty: { title: "", desc: "", tags: [], icon: "FiCode" },
    schemas: [
      { key: "title", label: "Service Title", type: "text" },
      { key: "desc", label: "Description", type: "textarea", rows: 3 },
      { key: "tags", label: "Tech Tags (comma-separated)", type: "tags" },
      { key: "icon", label: "Icon", type: "select", options: ICON_KEYS },
    ],
  },
  {
    id: "work_steps",
    label: "Work Process",
    collection: "work_steps",
    empty: { step: "01", title: "", desc: "" },
    schemas: [
      { key: "step", label: "Step Label (e.g. 01)", type: "text" },
      { key: "title", label: "Step Title", type: "text" },
      { key: "desc", label: "Description", type: "textarea", rows: 3 },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    collection: "experience",
    empty: { period: "", title: "", org: "", tag: "Career", points: [] },
    schemas: [
      { key: "period", label: "Period", type: "text", placeholder: "2026 — Present" },
      { key: "title", label: "Title", type: "text" },
      { key: "org", label: "Org / Place", type: "text" },
      {
        key: "tag", label: "Tag", type: "select",
        options: ["Career", "Data", "Education", "Growth", "Freelance"],
      },
      { key: "points", label: "Bullet Points (one per line)", type: "lines", rows: 4 },
    ],
  },
  {
    id: "open_source",
    label: "Open Source",
    collection: "open_source",
    empty: { name: "", blurb: "", lang: "Python" },
    schemas: [
      { key: "name", label: "Repo Name (slug)", type: "text" },
      { key: "blurb", label: "Blurb / Description", type: "textarea", rows: 2 },
      { key: "lang", label: "Language", type: "text" },
    ],
  },
  {
    id: "now_log",
    label: "Now / Stack Log",
    collection: "now_log",
    empty: { type: "building", tag: "BUILD", text: "" },
    schemas: [
      { key: "type", label: "Type Key", type: "text", placeholder: "building | learning | shipping | exploring | open" },
      { key: "tag", label: "Badge Tag", type: "text", placeholder: "BUILD" },
      { key: "text", label: "Log Line", type: "textarea", rows: 2 },
    ],
  },
  {
    id: "recognition",
    label: "Recognition",
    collection: "recognition",
    empty: { title: "", desc: "", icon: "FiAward" },
    schemas: [
      { key: "title", label: "Recognition Title", type: "text" },
      { key: "desc", label: "Description", type: "textarea", rows: 2 },
      { key: "icon", label: "Icon", type: "select", options: ICON_KEYS },
    ],
  },
  {
    id: "certifications",
    label: "Certifications",
    collection: "certifications",
    empty: { title: "", issuer: "", year: "", credential_url: "" },
    schemas: [
      { key: "title", label: "Certification Title", type: "text" },
      { key: "issuer", label: "Issuer", type: "text" },
      { key: "year", label: "Year", type: "text" },
      { key: "credential_url", label: "Credential URL", type: "text" },
    ],
  },
  {
    id: "trusted_by",
    label: "Trusted By",
    collection: "trusted_by",
    empty: { name: "", icon: "SiReact" },
    schemas: [
      { key: "name", label: "Name", type: "text" },
      { key: "icon", label: "Icon", type: "select", options: ICON_KEYS },
    ],
  },
  {
    id: "marquee",
    label: "Marquee Ticker",
    collection: "marquee",
    empty: { text: "" },
    schemas: [{ key: "text", label: "Ticker Text", type: "text" }],
  },
];

export function TabContent() {
  const [active, setActive] = useState("services");

  const sec = SECTIONS.find((s) => s.id === active);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors whitespace-nowrap ${
              active === s.id
                ? "bg-themeAccent text-white"
                : "bg-themeBg-secondary text-themeText-secondary border border-themeBorder hover:text-themeText"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <ReusableCrud
        key={sec.id}
        collection={sec.collection}
        schema={sec.schemas}
        title={sec.label}
        emptyItem={sec.empty}
        buildTitle={(item) => item.title || item.name || item.role || item.text || item.id}
      />
    </div>
  );
}

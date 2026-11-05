"use client";

import { cn } from "@/lib/utils";

export function AboutSection() {
  return (
    <section className="py-12 px-4 border-b border-themeBorder">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-themeText mb-6">About</h2>
        <p className="text-themeText-secondary">
          Data Science & Full-Stack Developer from Kerala, India. I build production APIs, ML models, and scalable web apps.
        </p>
      </div>
    </section>
  );
}
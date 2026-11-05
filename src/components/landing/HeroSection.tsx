"use client";

import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4 border-b border-themeBorder">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-themeAccent mb-4">
          Hi, I'm Muhammed Fahim M
        </h1>
        <p className="text-2xl text-themeText-secondary mb-8 max-w-xl mx-auto">
          Data Science & Full-Stack Developer building production APIs, ML models, and scalable web apps.
        </p>
      </div>
    </section>
  );
}
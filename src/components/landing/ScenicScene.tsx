"use client";

import { cn } from "@/lib/utils";

export function ScenicScene() {
  return (
    <section className="py-12 px-4 border-b border-themeBorder relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-themeText mb-6">Featured Project</h2>
        {/* Featured project loaded from Firestore */}
      </div>
    </section>
  );
}
"use client";

import { cn } from "@/lib/utils";

export function RecognitionSection() {
  return (
    <section className="py-12 px-4 border-b border-themeBorder">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-themeText mb-6">Recognition</h2>
        {/* Recognition items loaded from Firestore */}
      </div>
    </section>
  );
}
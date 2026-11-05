"use client";

import { cn } from "@/lib/utils";

export function ResumeModal({ className, children, ...props }: { className?: string; children: React.ReactNode; }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 items-center justify-center backdrop-blur-sm bg-black/50",
        className,
      )}
      {...props}
    >
      <div className="relative rounded-xl bg-themeBg p-8 shadow-xl max-w-2xl w-full transform scale-100" role="dialog" aria-modal="true">
        <button
          className="absolute top-4 right-4 rounded-lg bg-themeBg-secondary p-1 hover:bg-themeAccent text-themeAccent hover:text-white transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
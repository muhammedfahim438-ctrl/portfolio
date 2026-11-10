"use client";

export function AnimatedPortrait({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      {/* Placeholder — replace with your own image URL in /admin → Settings → Portrait */}
      <div className="h-full w-full rounded-[2rem] bg-themeSurface border border-themeBorder flex items-center justify-center text-themeText-secondary font-mono text-sm">
        Your photo here
      </div>
    </div>
  );
}

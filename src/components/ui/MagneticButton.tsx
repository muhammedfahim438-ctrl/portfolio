"use client";

import { cn } from "@/lib/utils";

export function MagneticButton({ className, children, ...props }: { className?: string; children: React.ReactNode; }) {
  return (
    <button
      className={cn(
        "relative rounded-xl bg-themeAccent text-white px-6 py-3 font-medium transition-all cursor-pointer",
        "overflow-hidden",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
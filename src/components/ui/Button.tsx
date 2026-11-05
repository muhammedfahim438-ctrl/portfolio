"use client";

import { cn } from "@/lib/utils";

export function Button({ className, children, ...props }: { className?: string; children: React.ReactNode; }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        "bg-themeAccent text-white hover:bg-themeAccent-hover",
        "dark:bg-themeAccent-hover",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
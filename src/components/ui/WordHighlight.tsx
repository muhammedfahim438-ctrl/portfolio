"use client";

import { cn } from "@/lib/utils";

export function WordHighlight({ className, children, ...props }: { className?: string; children: React.ReactNode; }) {
  return (
    <div
      className={cn("bg-themeBg-secondary px-2 rounded inline-block", className)}
      {...props}
    >
      {children}
    </div>
  );
}
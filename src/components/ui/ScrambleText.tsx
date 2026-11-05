"use client";

import { cn } from "@/lib/utils";

export function ScrambleText({ className, children, ...props }: { className?: string; children: React.ReactNode; }) {
  return (
    <div
      className={cn("overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}
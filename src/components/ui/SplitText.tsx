"use client";

import { cn } from "@/lib/utils";

export function SplitText({ className, children, ...props }: { className?: string; children: React.ReactNode; }) {
  return (
    <div
      className={cn("whitespace-nowrap", className)}
      {...props}
    >
      {children}
    </div>
  );
}
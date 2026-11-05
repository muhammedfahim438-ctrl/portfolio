"use client";

import { cn } from "@/lib/utils";

export function LoadingSpinner({ className, size = "md", ...props }: { className?: string; size?: "sm" | "md" | "lg"; children?: React.ReactNode; }) {
  const sizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  return (
    <div
      className={cn(
        "rounded-full bg-themeAccent",
        sizeMap[size],
        className,
      )}
    />
  );
}
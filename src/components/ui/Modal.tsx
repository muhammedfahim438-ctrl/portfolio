"use client";

import { cn } from "@/lib/utils";

export function Modal({ className, children, ...props }: { className?: string; children: React.ReactNode; }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 items-center justify-center backdrop-blur-sm bg-black/40",
        className,
      )}
      {...props}
    >
      <div className="relative rounded-xl bg-themeBg p-6 shadow-lg transform scale-100" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}
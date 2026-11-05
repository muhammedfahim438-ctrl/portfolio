"use client";

import { cn } from "@/lib/utils";

export function MarqueeTicker() {
  return (
    <div className="py-6 border-b border-themeBorder overflow-hidden">
      <div className="flex items-center gap-6 marquee">
        <marquee className="text-themeText-secondary" direction="left" scrollamount="5" loop>
          Building production APIs · Training ML models · Shipping full-stack apps · Speaking at meetups
        </marquee>
      </div>
    </div>
  );
}
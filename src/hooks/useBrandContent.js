"use client";

import { useContext } from "react";
import { BrandContentContext } from "@/components/providers/brandContentContext";

// Returns { brand, hero, about, sections, footer, sources, ready }.
// Falls back to the defaults in src/data/brandDefaults.js when rendered
// outside the provider.
export function useBrandContent() {
  return useContext(BrandContentContext);
}

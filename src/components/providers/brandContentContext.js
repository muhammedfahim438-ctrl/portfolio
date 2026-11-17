import { createContext } from "react";
import { BRAND, HERO, ABOUT, SECTIONS, FOOTER } from "@/data/brandDefaults";

export const BRAND_DEFAULTS = {
  brand: BRAND,
  hero: HERO,
  about: ABOUT,
  sections: SECTIONS,
  footer: FOOTER,
};

export const BRAND_DOCS = [
  { prop: "brand", key: "brand_data" },
  { prop: "hero", key: "hero_data" },
  { prop: "about", key: "about_data" },
  { prop: "sections", key: "sections_data" },
  { prop: "footer", key: "footer_data" },
];

// The default value is the full copy deck, so a section rendered outside the
// provider (a 404, a test, a future route) still reads real copy.
export const BrandContentContext = createContext({
  ...BRAND_DEFAULTS,
  sources: {},
  ready: false,
});

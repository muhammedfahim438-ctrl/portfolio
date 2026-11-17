"use client";

import { useEffect, useMemo, useState } from "react";
import { getConfig } from "@/lib/firestore";
import { mergeDeep } from "@/lib/contentMerge";
import {
  BRAND_DEFAULTS,
  BRAND_DOCS,
  BrandContentContext,
} from "./brandContentContext";

export function BrandContentProvider({ children }) {
  const [content, setContent] = useState(BRAND_DEFAULTS);
  const [sources, setSources] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const results = await Promise.allSettled(
        BRAND_DOCS.map((entry) => getConfig(entry.key))
      );
      if (!mounted) return;

      const next = { ...BRAND_DEFAULTS };
      const origin = {};

      results.forEach((result, index) => {
        const { prop } = BRAND_DOCS[index];
        if (
          result.status === "fulfilled" &&
          result.value &&
          typeof result.value === "object"
        ) {
          next[prop] = mergeDeep(BRAND_DEFAULTS[prop], result.value);
          origin[prop] = "custom";
        } else {
          origin[prop] = "default";
        }
      });

      setContent(next);
      setSources(origin);
      setReady(true);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Keep the browser tab and the in-page meta description aligned with the
  // brand copy. Social-card crawlers still read index.html, which is why the
  // Brand Studio tells the owner that a metadata change needs a redeploy.
  useEffect(() => {
    const { metaTitle, metaDescription } = content.brand || {};
    if (metaTitle) document.title = metaTitle;

    const apply = (selector, attribute, value) => {
      if (!value) return;
      const node = document.querySelector(selector);
      if (node) node.setAttribute(attribute, value);
    };

    apply('meta[name="description"]', "content", metaDescription);
    apply('meta[property="og:title"]', "content", metaTitle);
    apply('meta[property="og:description"]', "content", metaDescription);
    apply('meta[name="twitter:title"]', "content", metaTitle);
    apply('meta[name="twitter:description"]', "content", metaDescription);
  }, [content.brand]);

  const value = useMemo(
    () => ({ ...content, sources, ready }),
    [content, sources, ready]
  );

  return (
    <BrandContentContext.Provider value={value}>
      {children}
    </BrandContentContext.Provider>
  );
}

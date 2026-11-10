import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { SITE_URL } from "./src/lib/constants.js";

const SITE = SITE_URL.replace(/\/+$/, "");

/**
 * Keeps every absolute URL in the build derived from src/lib/constants.js:
 *   - index.html: replaces the __SITE_URL__ placeholder (canonical, og:url,
 *     twitter:image, JSON-LD) — plain string replace, so it also works inside
 *     <script type="application/ld+json">.
 *   - robots.txt / sitemap.xml: generated at build time (public/ copies are
 *     deleted so there is no double-write).
 */
function siteMetaPlugin(siteUrl) {
  return {
    name: "site-meta",
    transformIndexHtml(html) {
      return html.replaceAll("__SITE_URL__", siteUrl);
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          "  <url>",
          `    <loc>${siteUrl}/</loc>`,
          "    <changefreq>monthly</changefreq>",
          "    <priority>1.0</priority>",
          "  </url>",
          "</urlset>",
          "",
        ].join("\n"),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), siteMetaPlugin(SITE)],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // --- Firebase: split so auth/storage stay off the landing path ---
          if (
            id.includes("node_modules/@firebase/firestore") ||
            id.includes("node_modules/firebase/firestore")
          ) {
            return "firebase-firestore";
          }
          if (
            id.includes("node_modules/@firebase/auth") ||
            id.includes("node_modules/firebase/auth")
          ) {
            return "firebase-auth";
          }
          if (
            id.includes("node_modules/@firebase/storage") ||
            id.includes("node_modules/firebase/storage")
          ) {
            return "firebase-storage";
          }
          if (
            id.includes("node_modules/@firebase/") ||
            id.includes("node_modules/firebase/app")
          ) {
            return "firebase-core";
          }

          // --- Motion ---
          if (
            id.includes("node_modules/framer-motion") ||
            id.includes("node_modules/motion") ||
            id.includes("node_modules/lenis")
          ) {
            return "motion";
          }

          // --- UI (checked BEFORE react, since react-hot-toast and
          // --- react-icons both contain "node_modules/react" in their path) ---
          if (
            id.includes("node_modules/react-hot-toast") ||
            id.includes("node_modules/react-icons")
          ) {
            return "ui";
          }

          // --- React ---
          if (id.includes("node_modules/react") || id.includes("node_modules/scheduler")) {
            return "react";
          }
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});

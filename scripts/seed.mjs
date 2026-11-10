#!/usr/bin/env node
/**
 * Local-only Firestore seed script.
 *
 *   node scripts/seed.mjs
 *
 * Loads src/data/seed.js through Vite's SSR module loader so the `@/` alias
 * and `import.meta.env.VITE_*` variables resolve outside the browser. Runs
 * the same seedAll() the admin dashboard uses. Idempotent — existing
 * documents are skipped, so re-running is safe.
 *
 * Nothing here is reachable over HTTP: the public /seed route has been
 * removed from the app.
 */

import { createServer } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const REQUIRED = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `Missing Firebase config in the environment: ${missing.join(", ")}\n` +
    "Copy .env.example to .env and fill in your Firebase values."
  );
  process.exit(1);
}

const server = await createServer({
  configFile: path.join(repoRoot, "vite.config.js"),
  root: repoRoot,
  server: { middlewareMode: true, logLevel: "error" },
  appType: "custom",
});

try {
  const { seedAll } = await server.ssrLoadModule("/src/data/seed.js");
  console.log("Starting seed...");
  await seedAll();
  console.log("\nSeed complete.");
} catch (err) {
  console.error("\nSeed failed:", err?.code ? `${err.code} | ${err.message}` : err);
  process.exitCode = 1;
} finally {
  await server.close();
}

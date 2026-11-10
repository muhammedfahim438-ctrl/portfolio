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
 * SIGNS IN as the admin first: firestore.rules restrict every content write
 * to the admin account, so an anonymous seeder is rejected with
 * `permission-denied`.
 *
 * Usage:
 *   SEED_ADMIN_PASSWORD="..." npm run seed
 *   npm run seed -- --dry-run     # sign in, load everything, write nothing
 *
 * Nothing here is reachable over HTTP: the public /seed route has been
 * removed from the app.
 */

import { createServer } from "vite";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run");

// Minimal .env reader: Node never populates process.env from .env, and the
// SEED_* vars must not be VITE_-prefixed (those are inlined into the browser
// bundle by Vite).
function parseDotEnv(file) {
  const out = {};
  if (!existsSync(file)) return out;
  for (const rawLine of readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

const dotenv = parseDotEnv(path.join(repoRoot, ".env"));

const adminEmail =
  process.env.SEED_ADMIN_EMAIL ||
  dotenv.SEED_ADMIN_EMAIL ||
  dotenv.VITE_ADMIN_EMAIL ||
  "muhammedfahim438@gmail.com";

const adminPassword =
  process.env.SEED_ADMIN_PASSWORD || dotenv.SEED_ADMIN_PASSWORD || "";

if (!adminPassword) {
  console.error(
    "\n[seed] Missing admin password.\n" +
      '  Set SEED_ADMIN_PASSWORD in your shell or in .env:\n' +
      '    SEED_ADMIN_PASSWORD="your-password" npm run seed\n' +
      "  (never use a VITE_ prefixed name — those are baked into the browser bundle)\n"
  );
  process.exit(1);
}

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
  const { app } = await server.ssrLoadModule("/src/lib/firebase.js");
  const { signIn } = await server.ssrLoadModule("/src/lib/auth.js");
  const { seedAll } = await server.ssrLoadModule("/src/data/seed.js");

  console.log(`[seed] project   : ${app.options.projectId}`);
  console.log(`[seed] signing in: ${adminEmail}`);

  await signIn(adminEmail, adminPassword);
  console.log("[seed] signed in");

  if (DRY_RUN) {
    console.log("[seed] --dry-run: no writes performed");
  } else {
    await seedAll();
    console.log("\nSeed complete.");
  }
} catch (err) {
  console.error("\nSeed failed:", err?.code ? `${err.code} | ${err.message}` : err);
  process.exitCode = 1;
} finally {
  await server.close();
}

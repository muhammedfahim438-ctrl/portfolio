"use client";

import { useState } from "react";
import { seedAll } from "@/data/seed";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function SeedPage() {
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);

  async function handleSeed() {
    setLoading(true);
    setStatus("Seeding...");
    try {
      await seedAll();
      setStatus("Done! All data seeded. You can close this page and visit /");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setStatus(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-themeBg flex items-center justify-center">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="glass rounded-2xl p-8 max-w-md text-center space-y-6">
        <h1 className="text-2xl font-bold text-themeText">Seed Firestore Database</h1>
        <p className="text-themeText-secondary">
          Click the button below to populate your Firestore with all portfolio data
          (12 projects, 32 skills, 3 certifications, workflow steps, profile).
        </p>
        <button
          onClick={handleSeed}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-linear-to-r from-themeAccent to-themeSecondary text-white font-medium disabled:opacity-50"
        >
          {loading ? "Seeding..." : "Seed Data"}
        </button>
        {status && (
          <p className={`text-sm ${status.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}

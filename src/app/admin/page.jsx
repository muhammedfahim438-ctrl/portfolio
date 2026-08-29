"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TabHeroConfig } from "@/components/admin/TabHeroConfig";
import { TabProjectsManager } from "@/components/admin/TabProjectsManager";
import { TabSkillsLinks } from "@/components/admin/TabSkillsLinks";
import { TabTestimonials } from "@/components/admin/TabTestimonials";
import { TabMessages } from "@/components/admin/TabMessages";
import { TabContent } from "@/components/admin/TabContent";
import { TabSettings } from "@/components/admin/TabSettings";
import { getCollectionDocs, dedupeCollection } from "@/lib/firestore";
import { seedAll } from "@/data/seed";

const tabs = [
  { id: "hero", label: "Hero & Config" },
  { id: "projects", label: "Projects" },
  { id: "content", label: "Content" },
  { id: "settings", label: "Settings" },
  { id: "skills", label: "Skills & Links" },
  { id: "testimonials", label: "Testimonials" },
  { id: "messages", label: "Messages" },
];

const CLEANUP_COLLECTIONS = [
  "projects",
  "skills",
  "certifications",
  "recognition",
  "testimonials",
  "trusted_by",
  "services",
  "work_steps",
  "experience",
  "open_source",
  "now_log",
  "marquee",
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("hero");
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [cleaning, setCleaning] = useState(false);
  const [reseeding, setReseeding] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const entries = await Promise.all(
        CLEANUP_COLLECTIONS.map(async (name) => ({
          name,
          count: (await getCollectionDocs(name)).length,
        }))
      );
      setStats(entries);
    } catch {
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  async function handleCleanup() {
    if (!confirm("Delete duplicate entries across all collections? Keeps the first occurrence of each.")) return;
    setCleaning(true);
    try {
      let removedTotal = 0;
      for (const name of CLEANUP_COLLECTIONS) {
        const result = await dedupeCollection(name);
        removedTotal += result.removed;
      }
      toast.success(
        removedTotal > 0
          ? `Cleaned up ${removedTotal} duplicate(s)`
          : "No duplicates found — all clean"
      );
      await loadStats();
    } catch {
      toast.error("Cleanup failed");
    } finally {
      setCleaning(false);
    }
  }

  async function handleReseed() {
    if (!confirm("Add any missing seed data? Existing entries will be kept (no duplicates).")) return;
    setReseeding(true);
    try {
      await seedAll();
      toast.success("Seed complete — missing items added");
      await loadStats();
    } catch {
      toast.error("Reseed failed");
    } finally {
      setReseeding(false);
    }
  }

  return (
    <div className="min-h-screen bg-themeBg">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-linear-to-r from-themeAccent to-themeSecondary text-white"
                  : "bg-themeBg-secondary text-themeText-secondary hover:text-themeText border border-themeBorder"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mb-6 rounded-2xl border border-themeBorder bg-themeBg-secondary/60 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 flex-1">
              {loadingStats ? (
                <span className="text-sm text-themeText/40">Loading counts…</span>
              ) : stats ? (
                stats.map((s) => (
                  <span key={s.name} className="font-mono text-xs text-themeText-secondary">
                    {s.name.replace("_", " ")}
                    <span className="ml-1.5 text-themeAccent font-semibold">{s.count}</span>
                  </span>
                ))
              ) : (
                <span className="text-sm text-themeText/40">Counts unavailable</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCleanup}
                disabled={cleaning}
                className="px-4 py-2 rounded-lg bg-themeAccent text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {cleaning ? "Cleaning…" : "Cleanup Duplicates"}
              </button>
              <button
                onClick={handleReseed}
                disabled={reseeding}
                className="px-4 py-2 rounded-lg border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors disabled:opacity-50"
              >
                {reseeding ? "Seeding…" : "Re-seed Missing"}
              </button>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          {activeTab === "hero" && <TabHeroConfig />}
          {activeTab === "projects" && <TabProjectsManager />}
          {activeTab === "content" && <TabContent />}
          {activeTab === "settings" && <TabSettings />}
          {activeTab === "skills" && <TabSkillsLinks />}
          {activeTab === "testimonials" && <TabTestimonials />}
          {activeTab === "messages" && <TabMessages />}
        </div>
      </div>
    </div>
  );
}
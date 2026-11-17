"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TabBrandStudio } from "@/components/admin/TabBrandStudio";
import { TabProjectsManager } from "@/components/admin/TabProjectsManager";
import { TabSkillsLinks } from "@/components/admin/TabSkillsLinks";
import { TabTestimonials } from "@/components/admin/TabTestimonials";
import { TabMessages } from "@/components/admin/TabMessages";
import { TabContent } from "@/components/admin/TabContent";
import { TabSettings } from "@/components/admin/TabSettings";
import { getCollectionDocs, dedupeCollection } from "@/lib/firestore";
import { seedAll } from "@/data/seed";

const tabs = [
  { id: "brand", label: "Brand Studio" },
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

const sectionVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("brand");
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
    (async () => {
      await loadStats();
    })();
  }, [loadStats]);

  async function handleCleanup() {
    if (
      !confirm(
        "Delete duplicate entries across all collections? Keeps the first occurrence of each."
      )
    )
      return;
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
          : "No duplicates found. All clean"
      );
      await loadStats();
    } catch {
      toast.error("Cleanup failed");
    } finally {
      setCleaning(false);
    }
  }

  async function handleReseed() {
    if (
      !confirm(
        "Add any missing seed data? Existing entries will be kept (no duplicates)."
      )
    )
      return;
    setReseeding(true);
    try {
      await seedAll();
      toast.success("Seed complete. Missing items added");
      await loadStats();
    } catch {
      toast.error("Reseed failed");
    } finally {
      setReseeding(false);
    }
  }

  return (
    <div className="relative z-10 min-h-dvh overflow-x-hidden">
      <AdminHeader />

      <main className="relative z-10 max-w-[75rem] mx-auto px-4 py-12">
        <div className="border-4 border-themeAccent bg-themeSurface/25 backdrop-blur-md shadow-[4px_4px_0_0_var(--dg-bg-deep)] p-6 mb-12 dg-r-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[0.625rem] font-mono text-themeAccentText uppercase tracking-[0.1em] dg-ui-mono">
                Collection Stats
              </span>
              {loadingStats ? (
                <span className="text-xs text-themeText-secondary">Loading…</span>
              ) : stats ? (
                stats.map((s) => (
                  <span
                    key={s.name}
                    className="flex items-center gap-2 px-4 py-2 border-4 border-themeAccent bg-transparent text-xs font-mono text-themeText-secondary shadow-[2px_2px_0_0_var(--dg-bg-deep)] dg-r-0 dg-chunky"
                  >
                    {s.name.replace("_", " ").toUpperCase()}
                    <span className="text-themeAccentText font-bold">{s.count}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-themeText-secondary">Counts unavailable</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCleanup}
                disabled={cleaning}
                className="flex items-center gap-2 px-5 py-2.5 border-4 border-themeAccent bg-transparent text-themeText text-xs font-medium uppercase tracking-wider hover:bg-themeAccent hover:text-themeText shadow-[2px_2px_0_0_var(--dg-bg-deep)] hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 active:shadow-[1px_1px_0_0_var(--dg-bg-deep)] active:translate-[2px_2px] disabled:opacity-50 disabled:cursor-not-allowed dg-f-mono"
              >
                {cleaning ? "Cleaning…" : "Cleanup Duplicates"}
              </button>
              <button
                onClick={handleReseed}
                disabled={reseeding}
                className="flex items-center gap-2 px-5 py-2.5 border-4 border-themeAccent bg-transparent text-themeText text-xs font-medium uppercase tracking-wider hover:bg-themeAccent hover:text-themeText shadow-[2px_2px_0_0_var(--dg-bg-deep)] hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 active:shadow-[1px_1px_0_0_var(--dg-bg-deep)] active:translate-[2px_2px] disabled:opacity-50 disabled:cursor-not-allowed dg-f-mono"
              >
                {reseeding ? "Seeding…" : "Re-seed Missing"}
              </button>
            </div>
          </div>
        </div>

        <div role="tablist" aria-label="Admin sections" className="flex flex-wrap gap-2 mb-12">
          {tabs.map((tab) => {
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`admin-tab-${tab.id}`}
                aria-controls="admin-panel"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 border-4 border-themeAccent bg-transparent font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-themeAccent text-themeText border-themeAccent shadow-[4px_4px_0_0_var(--dg-bg-deep)]"
                    : "text-themeText-secondary hover:text-themeText hover:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)]"
                } dg-r-0`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-3 space-y-6">
            <QuickActionCard
              title="Brand Studio"
              desc="Identity, hero, about, section copy, CTAs, footer and SEO."
              icon="⚙"
              onClick={() => setActiveTab("brand")}
              active={activeTab === "brand"}
            />
            <QuickActionCard
              title="Projects"
              desc="Manage project case studies and gallery images."
              icon="📁"
              onClick={() => setActiveTab("projects")}
              active={activeTab === "projects"}
            />
            <QuickActionCard
              title="Skills & Links"
              desc="Update skills, certifications, and social links."
              icon="🏷"
              onClick={() => setActiveTab("skills")}
              active={activeTab === "skills"}
            />
          </div>

          <div role="tabpanel" id="admin-panel" aria-labelledby={`admin-tab-${activeTab}`} className="lg:col-span-9">
            {activeTab === "brand" && <TabBrandStudio />}
            {activeTab === "projects" && <TabProjectsManager />}
            {activeTab === "content" && <TabContent />}
            {activeTab === "settings" && <TabSettings />}
            {activeTab === "skills" && <TabSkillsLinks />}
            {activeTab === "testimonials" && <TabTestimonials />}
            {activeTab === "messages" && <TabMessages />}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function QuickActionCard({ title, desc, icon, onClick, active }) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      onClick={onClick}
      aria-pressed={active}
      className={`group w-full cursor-pointer p-6 border-4 border-themeAccent bg-themeSurface/30 relative overflow-hidden text-left transition-all duration-150 ${
        active
          ? "bg-themeAccent/20 border-themeAccent shadow-[4px_4px_0_0_var(--dg-bg-deep)]"
          : "shadow-[2px_2px_0_0_var(--dg-bg-deep)] hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)]"
      } dg-r-0 dg-chunky`}
    >
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs">{icon}</span>
          <span className="ml-auto text-[0.625rem] font-mono uppercase tracking-wider text-themeText-secondary/80 group-hover:text-themeAccentText transition-colors">
            Open
          </span>
        </div>
        <h3 className="font-display font-bold text-themeText text-base leading-tight group-hover:text-themeAccentText transition-colors">
          {title}
        </h3>
        <p className="text-xs text-themeTextSecondary leading-relaxed max-w-[12.5rem]">
          {desc}
        </p>
      </div>
    </motion.button>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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

const sectionVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

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
    (async () => {
      await loadStats();
    })();
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
    <div className="min-h-screen bg-themeBg relative overflow-hidden">
      {/* Ambient background mesh */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `radial-gradient(600px 400px at 20% -10%, rgba(205,242,43,0.08), transparent 60%), radial-gradient(400px 400px at 80% 20%, rgba(205,242,43,0.04), transparent 50%)`,
        backgroundSize: "200% 200%",
        backgroundPosition: "0% 0%",
        backgroundRepeat: "no-repeat",
      }} />

      <AdminHeader />

      <main className="relative z-10 max-w-[1200px] mx-auto px-4 py-12">
        {/* Stats ribbon */}
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          variants={sectionVariants}
          className="flex flex-wrap items-center justify-between gap-4 mb-12 border border-themeBorder bg-themeSurface/20 rounded-none p-6"
        >
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-wider text-themeAccent">
              Collection Stats
            </span>
            {loadingStats ? (
              <span className="text-xs text-themeText-secondary">Loading…</span>
            ) : stats ? (
              stats.map((s) => (
                <span
                  key={s.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-none border border-themeBorder bg-transparent text-xs font-mono text-themeText-secondary hover:bg-themeBg/30 transition-all duration-200"
                >
                  {s.name.replace("_", " ").toUpperCase()}
                  <span className="text-themeAccent font-bold">{s.count}</span>
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
              className="flex items-center gap-2 px-5 py-2.5 rounded-none border-2 border-themeBorder bg-transparent text-themeText text-xs font-medium hover:bg-themeAccent/10 hover:border-themeAccent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cleaning ? "Cleaning…" : "Cleanup Duplicates"}
            </button>
            <button
              onClick={handleReseed}
              disabled={reseeding}
              className="flex items-center gap-2 px-5 py-2.5 rounded-none border-2 border-themeBorder bg-transparent text-themeText text-xs font-medium hover:bg-themeAccent/10 hover:border-themeAccent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {reseeding ? "Seeding…" : "Re-seed Missing"}
            </button>
          </div>
        </motion.div>

        {/* Tab navigation — asymmetrical, left-aligned */}
        <div className="flex flex-wrap gap-2 mb-12">
          {tabs.map((tab) => {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-none border border-themeBorder bg-transparent font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-themeAccent text-themeText border-themeAccent shadow-[4px_4px_0_0_rgba(8,9,11,0.3)]"
                    : "text-themeText-secondary hover:text-themeText hover:border-themeAccent"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main content area — double-bezel cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left: quick actions (asymmetrical split) */}
          <div className="lg:col-span-3 space-y-6">
            <QuickActionCard
              title="Hero Config"
              desc="Edit hero title, voice text, and profile photo."
              icon="⚙"
              onClick={() => setActiveTab("hero")}
              active={activeTab === "hero"}
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

          {/* Right: active tab content */}
          <div className="lg:col-span-9">
            {activeTab === "hero" && <TabHeroConfig />}
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
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`group cursor-pointer p-6 border-2 border-themeBorder rounded-none bg-themeSurface/30 relative overflow-hidden transition-all duration-300 ${
        active ? "border-themeAccent bg-themeAccent/5 shadow-[4px_4px_0_0_rgba(205,242,43,0.15)]" : ""
      }`}
    >
      {/* Double-bezel: outer shell */}
      <div className="absolute inset-0 border border-themeBorder/20 rounded-none pointer-events-none" />
      <div className="relative z-10 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs">{icon}</span>
          <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-themeText-secondary/60 group-hover:text-themeAccent transition-colors">
            Open
          </span>
        </div>
        <h3 className="font-display font-bold text-themeText text-base leading-tight group-hover:text-themeAccent transition-colors">
          {title}
        </h3>
        <p className="text-xs text-themeText-secondary leading-relaxed max-w-[200px]">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

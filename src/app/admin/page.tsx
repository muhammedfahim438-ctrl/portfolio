"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TabHeroConfig } from "@/components/admin/TabHeroConfig";
import { TabProjectsManager } from "@/components/admin/TabProjectsManager";
import { TabSkillsLinks } from "@/components/admin/TabSkillsLinks";
import { TabMessages } from "@/components/admin/TabMessages";

const tabs = [
  { id: "hero", label: "Hero & Config" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills & Links" },
  { id: "messages", label: "Messages" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("hero");

  return (
    <AuthGuard>
      <div className="min-h-screen bg-themeBg">
        <AdminHeader />
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Tab Bar */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-themeAccent to-themeSecondary text-white"
                    : "bg-themeBg-secondary text-themeText-secondary hover:text-themeText border border-themeBorder"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="glass rounded-2xl p-6">
            {activeTab === "hero" && <TabHeroConfig />}
            {activeTab === "projects" && <TabProjectsManager />}
            {activeTab === "skills" && <TabSkillsLinks />}
            {activeTab === "messages" && <TabMessages />}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

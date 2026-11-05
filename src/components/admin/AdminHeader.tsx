"use client";

import { cn } from "@/lib/utils";

export function AdminHeader() {
  return (
    <header className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-themeText">Portfolio Admin</h1>
      <div className="flex items-center gap-4">
        {/* Theme toggle and other header actions */}
      </div>
    </header>
  );
}
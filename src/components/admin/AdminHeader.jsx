"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signOut } from "@/lib/auth";
import { auth } from "@/lib/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";
import { FiExternalLink, FiLogOut } from "react-icons/fi";

export function AdminHeader() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setEmail(user?.email ?? null);
    });
    return () => unsub();
  }, []);

  async function handleSignOut() {
    await signOut();
  }

  return (
    <header className="sticky top-0 z-50">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="border-4 border-themeAccent bg-themeBg/75 backdrop-blur-md shadow-[4px_4px_0_0_var(--dg-bg-deep)] px-5 py-3 flex items-center justify-between dg-r-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-themeAccent text-themeText border-4 border-themeAccent flex items-center justify-center dg-f-logo font-bold text-xs shadow-[2px_2px_0_0_var(--dg-bg-deep)]">
            MF
          </div>
          <h1 className="dg-f-logo font-bold text-themeText text-sm tracking-tight uppercase">
            MF / Brand Studio
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {email && (
            <span className="hidden md:inline-block text-[0.625rem] font-mono text-themeTextSecondary uppercase tracking-widest dg-ui-mono">
              {email}
            </span>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border-4 border-themeAccent bg-transparent text-themeText text-xs font-medium uppercase tracking-wider hover:bg-themeAccent hover:text-themeText shadow-[2px_2px_0_0_var(--dg-bg-deep)] hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 active:shadow-[1px_1px_0_0_var(--dg-bg-deep)] active:translate-[2px_2px] dg-f-mono"
          >
            <FiExternalLink className="w-3 h-3" />
            View Site
          </a>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 border-4 border-themeAccent bg-transparent text-themeText text-xs font-medium uppercase tracking-wider hover:bg-themeAccent hover:text-themeText shadow-[2px_2px_0_0_var(--dg-bg-deep)] hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 active:shadow-[1px_1px_0_0_var(--dg-bg-deep)] active:translate-[2px_2px] dg-f-mono"
          >
            <FiLogOut className="w-3 h-3" />
            Sign Out
          </button>
        </div>
      </motion.div>
    </header>
  );
}

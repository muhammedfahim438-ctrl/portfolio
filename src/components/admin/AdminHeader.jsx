"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signOut } from "@/lib/auth";
import { auth } from "@/lib/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";
import { FiLogOut } from "react-icons/fi";

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
        className="border-4 border-themeAccent bg-themeBg shadow-[4px_4px_0_0_var(--dg-bg-deep)] px-5 py-3 flex items-center justify-between dg-r-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-themeAccent text-themeText border-4 border-themeAccent flex items-center justify-center text-themeText font-display font-bold text-xs shadow-[2px_2px_0_0_var(--dg-bg-deep)]">
            MF
          </div>
          <h1 className="font-display font-bold text-themeText text-sm tracking-tight uppercase dg-f-display">
            Portfolio Admin
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {email && (
            <span className="hidden md:inline-block text-[10px] font-mono text-themeTextSecondary uppercase tracking-[0.1em] dg-ui-mono">
              {email}
            </span>
          )}
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

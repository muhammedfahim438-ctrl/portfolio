"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "@/lib/auth";
import { auth } from "@/lib/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiX } from "react-icons/fi";

export function AdminHeader() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setEmail(user?.email ?? null);
    });
    return () => unsub();
  }, []);

  async function handleSignOut() {
    await signOut();
    setMenuOpen(false);
    navigate("/admin/login");
  }

  return (
    <>
      <header className="sticky top-0 z-50">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="border-4 border-themeAccent bg-themeBg shadow-[4px_4px_0_0_#080808] px-5 py-3 flex items-center justify-between dg-r-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-themeAccent text-themeText border-4 border-themeAccent flex items-center justify-center text-themeText font-display font-bold text-xs shadow-[2px_2px_0_0_#080808]">
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
              className="flex items-center gap-2 px-4 py-2 border-4 border-themeAccent bg-transparent text-themeText text-xs font-medium uppercase tracking-wider hover:bg-themeAccent hover:text-themeText shadow-[2px_2px_0_0_#080808] hover:shadow-[4px_4px_0_0_#080808] transition-all duration-150 active:shadow-[1px_1px_0_0_#080808] active:translate-[2px_2px] dg-f-mono"
            >
              <FiLogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </motion.div>
      </header>

      {menuOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#080808]/80 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 w-72 bg-themeBg border-l-4 border-themeAccent p-6 shadow-[4px_4px_0_0_#080808] dg-r-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-display font-bold text-themeText text-xs uppercase tracking-tighter">
                Menu
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 border-2 border-themeAccent bg-transparent text-themeText hover:bg-themeAccent hover:text-themeText shadow-[2px_2px_0_0_#080808] transition-all duration-150 active:shadow-[1px_1px_0_0_#080808] active:translate-[1px_1px]"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <nav className="space-y-3">
              {[
                { label: "Hero & Config", href: "/admin", icon: "⚙" },
                { label: "Projects", href: "/admin", icon: "📁" },
                { label: "Content", href: "/admin", icon: "📝" },
                { label: "Settings", href: "/admin", icon: "🔧" },
                { label: "Skills & Links", href: "/admin", icon: "🏷" },
                { label: "Testimonials", href: "/admin", icon: "💬" },
                { label: "Messages", href: "/admin", icon: "✉" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 border-2 border-transparent text-themeText-secondary text-sm font-medium uppercase tracking-wider hover:bg-themeAccent/10 hover:border-themeAccent hover:text-themeAccent shadow-[2px_2px_0_0_#080808] hover:shadow-[4px_4px_0_0_#080808] transition-all duration-150 active:shadow-[1px_1px_0_0_#080808] active:translate-[1px_1px] dg-f-mono"
                >
                  <span className="text-xs">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t-4 border-themeAccent">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 border-2 border-themeAccent bg-transparent text-themeText text-xs font-medium uppercase tracking-wider hover:bg-themeAccent hover:text-themeText shadow-[2px_2px_0_0_#080808] transition-all duration-150 active:shadow-[1px_1px_0_0_#080808] active:translate-[1px_1px] dg-f-mono"
              >
                <FiLogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}

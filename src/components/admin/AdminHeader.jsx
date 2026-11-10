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
      {/* Floating glass pill navbar — detached from top edge */}
      <header
        className="sticky top-6 z-50 mx-auto w-full max-w-[1200px] px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="rounded-none border border-themeBorder bg-themeSurface/70 backdrop-blur-2xl px-5 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-none border border-themeBorder bg-themeAccent flex items-center justify-center text-themeText font-display font-bold text-xs">
              MF
            </div>
            <h1 className="font-display font-bold text-themeText text-sm tracking-tight uppercase">
              Portfolio Admin
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {email && (
              <span className="hidden md:inline-block text-xs font-mono text-themeText-secondary uppercase tracking-[0.1em]">
                {email}
              </span>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 rounded-none border border-themeBorder bg-transparent text-themeText text-xs font-medium hover:border-themeAccent hover:text-themeAccent transition-all duration-300"
            >
              <FiLogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile nav overlay */}
      {menuOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 w-72 bg-themeSurface border-l border-themeBorder p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-display font-bold text-themeText text-xs uppercase tracking-tighter">
                Menu
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-none p-2 text-themeText-secondary hover:text-themeText transition-colors"
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
                  className="flex items-center gap-3 px-4 py-3 rounded-none border border-transparent text-themeText-secondary text-sm font-medium hover:bg-themeBg/40 hover:border-themeAccent/20 hover:text-themeAccent transition-all duration-200"
                >
                  <span className="text-xs">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t border-themeBorder">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-none border border-themeBorder text-themeText text-xs font-medium hover:border-themeAccent hover:text-themeAccent transition-all duration-200"
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

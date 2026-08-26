"use client";

import { useState, useEffect } from "react";
import { signOut } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export function AdminHeader() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setEmail(user?.email ?? null);
    });
    return () => unsub();
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate("/admin/login");
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-themeBg-secondary/60 backdrop-blur-xl border-b border-themeBorder">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-lg font-bold text-gradient">
          Portfolio Admin
        </h1>

        <div className="flex items-center gap-4">
          {email && (
            <span className="text-sm text-themeText-secondary hidden sm:inline">
              {email}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-themeBg border border-themeBorder text-themeText hover:border-themeAccent transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

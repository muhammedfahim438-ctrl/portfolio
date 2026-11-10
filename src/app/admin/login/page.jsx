"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { signIn, signOut, onAuthChange } from "@/lib/auth";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/constants";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(() => {
    const reason = location.state?.reason;
    const deniedEmail = location.state?.email;
    if (reason === "not-admin" && deniedEmail) {
      return `Signed out ${deniedEmail}. That account is not the portfolio admin.`;
    }
    if (reason === "signed-out") {
      return "Sign in with the admin account to continue.";
    }
    return "";
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) return;
      if (isAdminEmail(firebaseUser.email)) {
        navigate("/admin", { replace: true });
        return;
      }
      await signOut();
      setError(`Signed out ${firebaseUser.email}. That account is not authorized for the portfolio admin.`);
    });

    return () => unsubscribe();
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const credential = await signIn(ADMIN_EMAIL, password);
      const signedInEmail = credential?.user?.email ?? "";
      if (!isAdminEmail(signedInEmail)) {
        await signOut();
        setError("That account is not authorized for the portfolio admin.");
        return;
      }
      navigate("/admin", { replace: true });
    } catch {
      setError("Invalid password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-themeBg relative overflow-hidden">
      {/* Ambient mesh */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: `radial-gradient(600px 300px at 30% -10%, rgba(205,242,43,0.06), transparent 60%), radial-gradient(400px 400px at 80% 30%, rgba(205,242,43,0.03), transparent 50%)`,
        backgroundSize: "200% 200%",
      }} />

      <main className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-md rounded-none p-8 border border-themeBorder bg-themeSurface/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-none border border-themeBorder bg-themeAccent flex items-center justify-center text-themeText font-display font-bold text-xs">
              MF
            </div>
            <h1 className="font-display font-bold text-themeText text-lg tracking-tight uppercase">
              Portfolio Admin
            </h1>
          </div>

          <p className="text-themeText-secondary text-sm mb-8">
            Sign in to manage your portfolio
          </p>

          {notice && (
            <p className="mb-4 rounded-none border border-themeBorder bg-themeSurface px-4 py-3 text-sm text-themeText-secondary">
              {notice}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="admin-password" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-none border-2 border-themeBorder bg-themeBg px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200 placeholder-themeText-secondary/40"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 text-center font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-none border-2 border-themeAccent bg-themeAccent text-themeText font-display font-semibold hover:bg-themeAccent-hover hover:text-themeText transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Signing in…
                </span>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

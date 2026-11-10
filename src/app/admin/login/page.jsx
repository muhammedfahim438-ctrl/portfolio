"use client";

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signIn, signOut, onAuthChange } from "@/lib/auth";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/constants";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email] = useState(ADMIN_EMAIL);
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

  // Resolve any existing session on mount: admin -> /admin, anyone else ->
  // sign out immediately so nobody is left half-authed.
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (!firebaseUser) return;
      if (isAdminEmail(firebaseUser.email)) {
        navigate("/admin", { replace: true });
        return;
      }
      await signOut();
      setError(`Signed out ${firebaseUser.email}. That account is not the portfolio admin.`);
    });

    return () => unsubscribe();
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const credential = await signIn(email, password);
      const signedInEmail = credential?.user?.email ?? "";
      if (!isAdminEmail(signedInEmail)) {
        await signOut();
        setError("That account is not authorized for the portfolio admin.");
        return;
      }
      navigate("/admin", { replace: true });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-themeBg flex items-center justify-center px-4">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-themeBg-secondary/60 backdrop-blur-xl border border-themeBorder rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2 bg-linear-to-r from-themeAccent to-themeAccent-secondary bg-clip-text text-transparent">
          Portfolio Admin
        </h1>
        <p className="text-themeText-secondary text-center text-sm mb-8">
          Sign in to manage your portfolio
        </p>

        {notice && (
          <p className="mb-4 rounded-xl border border-themeBorder bg-themeBg px-4 py-3 text-sm text-themeText-secondary">
            {notice}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-themeText-secondary mb-1">
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              value={email}
              readOnly
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl bg-themeBg border border-themeBorder text-themeText focus:outline-none focus:border-themeAccent transition-colors opacity-70 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-themeText-secondary mb-1">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 rounded-xl bg-themeBg border border-themeBorder text-themeText placeholder-themeText-secondary/50 focus:outline-none focus:border-themeAccent transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-themeAccent text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

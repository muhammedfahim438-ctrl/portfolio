"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email] = useState("muhammedfahim438@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      router.push("/admin");
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
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-themeAccent to-themeAccent-secondary bg-clip-text text-transparent">
          Portfolio Admin
        </h1>
        <p className="text-themeText-secondary text-center text-sm mb-8">
          Sign in to manage your portfolio
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-themeText-secondary mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-themeBg border border-themeBorder text-themeText focus:outline-none focus:border-themeAccent transition-colors opacity-70 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-themeText-secondary mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

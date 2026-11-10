"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function AuthGuard({ children }) {
  const { loading, status } = useAuthGuard();

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-themeBg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Signed out, or signed in as a non-admin. The hook has already redirected
  // (and revoked the session in the non-admin case); render nothing so the
  // admin UI never flashes.
  if (status !== "authorized") {
    return null;
  }

  return <>{children}</>;
}

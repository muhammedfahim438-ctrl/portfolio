"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function AuthGuard({ children }) {
  const { loading } = useAuthGuard();

  if (loading) {
    return (
      <div className="min-h-screen bg-themeBg flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

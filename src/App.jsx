import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Lenis from "lenis";
import { SplashScreen } from "@/components/landing/SplashScreen";
import { HeroSection } from "@/components/landing/HeroSection";
import { AboutSection } from "@/components/landing/AboutSection";
import { SkillsTabs } from "@/components/landing/SkillsTabs";
import { FeaturedProjects } from "@/components/landing/FeaturedProjects";
import { ContactFooter } from "@/components/landing/ContactFooter";
import { NotFound } from "@/components/landing/NotFound";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const AdminPage = lazy(() => import("@/app/admin/page"));
const LoginPage = lazy(() => import("@/app/admin/login/page"));
const AuthGuard = lazy(() =>
  import("@/components/admin/AuthGuard").then((m) => ({ default: m.AuthGuard }))
);

function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      window.__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  return (
    <main className="min-h-screen bg-themeBg">
      <CustomCursor />
      <SplashScreen />
      <HeroSection />
      <AboutSection />
      <SkillsTabs />
      <FeaturedProjects />
      <ContactFooter />
    </main>
  );
}

function ProtectedAdmin() {
  return (
    <AuthGuard>
      <Suspense fallback={<RouteFallback />}>
        <AdminPage />
      </Suspense>
    </AuthGuard>
  );
}

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-themeBg">
      <LoadingSpinner />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

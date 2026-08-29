import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Lenis from "lenis";
import { SplashScreen } from "@/components/landing/SplashScreen";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarqueeTicker } from "@/components/landing/MarqueeTicker";
import { AboutSection } from "@/components/landing/AboutSection";
import { SkillsTabs } from "@/components/landing/SkillsTabs";
import { ExperienceSection } from "@/components/landing/ExperienceSection";
import { FeaturedProjects } from "@/components/landing/FeaturedProjects";
import { OpenSourceSection } from "@/components/landing/OpenSourceSection";
import { CertificationsSection } from "@/components/landing/CertificationsSection";
import { RecognitionSection } from "@/components/landing/RecognitionSection";
import { NowSection } from "@/components/landing/NowSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TrustedBySection } from "@/components/landing/TrustedBySection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { WorkWithMeSection } from "@/components/landing/WorkWithMeSection";
import { ContactFooter } from "@/components/landing/ContactFooter";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const AdminPage = lazy(() => import("@/app/admin/page"));
const LoginPage = lazy(() => import("@/app/admin/login/page"));
const SeedPage = lazy(() => import("@/pages/SeedPage"));

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
      <MarqueeTicker />
      <AboutSection />
      <SkillsTabs />
      <ExperienceSection />
      <ServicesSection />
      <FeaturedProjects />
      <OpenSourceSection />
      <CertificationsSection />
      <RecognitionSection />
      <NowSection />
      <TestimonialsSection />
      <TrustedBySection />
      <WorkWithMeSection />
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
        <Route path="/seed" element={<SeedPage />} />
      </Routes>
    </Suspense>
  );
}

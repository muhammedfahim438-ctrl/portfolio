import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Lenis from "lenis";
import { SplashScreen } from "@/components/landing/SplashScreen";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarqueeTicker } from "@/components/landing/MarqueeTicker";
import { AboutSection } from "@/components/landing/AboutSection";
import { SkillsTabs } from "@/components/landing/SkillsTabs";
import { FeaturedProjects } from "@/components/landing/FeaturedProjects";
import { CertificationsSection } from "@/components/landing/CertificationsSection";
import { RecognitionSection } from "@/components/landing/RecognitionSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TrustedBySection } from "@/components/landing/TrustedBySection";
import { ContactFooter } from "@/components/landing/ContactFooter";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { AuthGuard } from "@/components/admin/AuthGuard";
import AdminPage from "@/app/admin/page";
import LoginPage from "@/app/admin/login/page";
import SeedPage from "@/pages/SeedPage";

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
      <FeaturedProjects />
      <CertificationsSection />
      <RecognitionSection />
      <TestimonialsSection />
      <TrustedBySection />
      <ContactFooter />
    </main>
  );
}

function ProtectedAdmin() {
  return (
    <AuthGuard>
      <AdminPage />
    </AuthGuard>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin" element={<ProtectedAdmin />} />
      <Route path="/seed" element={<SeedPage />} />
    </Routes>
  );
}

import { Routes, Route } from "react-router-dom";
import { SplashScreen } from "@/components/landing/SplashScreen";
import { HeroSection } from "@/components/landing/HeroSection";
import { TerminalWidget } from "@/components/landing/TerminalWidget";
import { SkillsBentoGrid } from "@/components/landing/SkillsBentoGrid";
import { WorkflowTimeline } from "@/components/landing/WorkflowTimeline";
import { FeaturedProjects } from "@/components/landing/FeaturedProjects";
import { CertificationsSection } from "@/components/landing/CertificationsSection";
import { GitHubHeatmap } from "@/components/landing/GitHubHeatmap";
import { ContactFooter } from "@/components/landing/ContactFooter";
import { AuthGuard } from "@/components/admin/AuthGuard";
import AdminPage from "@/app/admin/page";
import LoginPage from "@/app/admin/login/page";
import SeedPage from "@/pages/SeedPage";

function LandingPage() {
  return (
    <main className="min-h-screen bg-themeBg">
      <SplashScreen />
      <HeroSection />
      <TerminalWidget />
      <SkillsBentoGrid />
      <WorkflowTimeline />
      <FeaturedProjects />
      <CertificationsSection />
      <GitHubHeatmap />
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

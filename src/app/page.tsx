"use client";

import { SplashScreen } from "@/components/landing/SplashScreen";
import { HeroSection } from "@/components/landing/HeroSection";
import { TerminalWidget } from "@/components/landing/TerminalWidget";
import { SkillsBentoGrid } from "@/components/landing/SkillsBentoGrid";
import { WorkflowTimeline } from "@/components/landing/WorkflowTimeline";
import { FeaturedProjects } from "@/components/landing/FeaturedProjects";
import { CertificationsSection } from "@/components/landing/CertificationsSection";
import { GitHubHeatmap } from "@/components/landing/GitHubHeatmap";
import { ContactFooter } from "@/components/landing/ContactFooter";

export default function Home() {
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

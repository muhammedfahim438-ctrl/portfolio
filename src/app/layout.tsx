import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Muhammed Fahim M | Data Science & Full-Stack Developer",
  description:
    "Portfolio of Muhammed Fahim M — Full-Stack Developer & Data Science enthusiast from Kerala, India. Django, React, ML, SaaS platforms.",
  keywords: [
    "Muhammed Fahim",
    "Data Science",
    "Full-Stack Developer",
    "Django",
    "React",
    "Python",
    "Machine Learning",
  ],
  openGraph: {
    title: "Muhammed Fahim M | Data Science & Full-Stack Developer",
    description:
      "Built SaaS platforms processing 600K+ records and ML models with 98.2% accuracy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}

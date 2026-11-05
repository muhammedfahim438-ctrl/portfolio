"use client";

import { cn } from "@/lib/utils";

export function ContactFooter() {
  return (
    <footer className="py-8 px-4 border-t border-themeBorder">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-themeText-secondary">
          Let's build something amazing together. <a href="mailto:muhammedfahim438@gmail.com" className="text-themeAccant hover:underline">muhammedfahim438@gmail.com</a>
        </p>
      </div>
    </footer>
  );
}
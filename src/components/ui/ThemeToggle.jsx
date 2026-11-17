"use client";

import { FiMonitor, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "@/hooks/useTheme";

const ICONS = { dark: FiMoon, light: FiSun, system: FiMonitor };
const NEXT = { dark: "light", light: "system", system: "dark" };

export function ThemeToggle() {
  const { preference, toggleTheme } = useTheme();
  const Icon = ICONS[preference] ?? ICONS.dark;
  const label = `Theme: ${preference}. Switch to ${NEXT[preference]}.`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="dg-theme-toggle fixed right-4 top-4 z-40 flex h-11 w-11 items-center justify-center border border-themeBorder bg-themeCard text-themeText backdrop-blur transition-colors hover:text-themeAccent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-themeAccent"
    >
      <Icon aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}

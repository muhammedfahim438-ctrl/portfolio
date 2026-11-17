"use client";

import { useThemeContext } from "@/components/providers/ThemeProvider";

export function useTheme() {
  const { theme, preference, toggleTheme, setTheme } = useThemeContext();
  return { theme, preference, toggleTheme, setTheme };
}

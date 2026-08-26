"use client";

import { useThemeContext } from "@/components/providers/ThemeProvider";

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useThemeContext();
  return { theme, toggleTheme, setTheme };
}

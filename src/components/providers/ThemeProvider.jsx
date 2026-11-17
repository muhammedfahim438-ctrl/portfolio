"use client";

import { createContext, useContext, useEffect, useState } from "react";

const THEMES = ["dark", "light", "system"];

function resolveTheme(preference) {
  if (preference === "system" && typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return preference === "light" ? "light" : "dark";
}

const ThemeContext = createContext({
  theme: "dark",
  preference: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeContext() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("theme");
    return THEMES.includes(saved) ? saved : "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    function apply() {
      const resolved = resolveTheme(preference);
      root.classList.remove("dark", "light");
      root.classList.add(resolved);
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", resolved === "dark" ? "#080808" : "#F2F0ED");
    }

    apply();
    localStorage.setItem("theme", preference);

    if (preference !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [preference]);

  const setTheme = (value) => {
    if (THEMES.includes(value)) setPreference(value);
  };

  const toggleTheme = () => {
    const next = (THEMES.indexOf(preference) + 1) % THEMES.length;
    setPreference(THEMES[next]);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: resolveTheme(preference), preference, toggleTheme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

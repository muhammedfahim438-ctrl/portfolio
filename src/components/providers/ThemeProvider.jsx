"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function useThemeContext() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setThemeState(stored);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(stored);
    }
  }, []);

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(t);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

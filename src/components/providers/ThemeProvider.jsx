"use client";

import { useEffect } from "react";

/**
 * The portfolio ships dark-only. The palette lives on :root in globals.css,
 * so there is nothing to toggle at runtime. This provider exists only to make
 * the browser chrome (theme-color) explicit and to keep the `dark` class on
 * the root element for any third-party CSS that still looks for it.
 */
export function ThemeProvider({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", "#080808");
  }, []);

  return children;
}

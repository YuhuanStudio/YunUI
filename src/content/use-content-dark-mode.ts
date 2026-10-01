"use client";

import { useEffect, useState } from "react";

/** Keep async content engines in sync with all supported host theme markers. */
export function useContentDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const check = () => {
      const theme = root.getAttribute("data-theme");
      setDark(root.classList.contains("dark") || root.classList.contains("true-black") ||
        theme === "dark" || theme === "true-black");
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

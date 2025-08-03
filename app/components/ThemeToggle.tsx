"use client";

import { useEffect, useState } from "react";
import StaticIcon from "@/app/components/StaticIcon";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = stored === "dark" || (!stored && systemPrefersDark);

    setIsDark(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-0 cursor-pointer transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <StaticIcon iconName="FaMoon" className="text-gray-400" />
      ) : (
        <StaticIcon iconName="FaSun" className="text-gray-400" />
      )}
    </button>
  );
}

"use client";

import { useState } from "react";
import StaticIcon from "@/app/components/StaticIcon";

export default function ThemeToggle({ type }: { type: string }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`hidden md:block absolute end-0 top-2 p-0 cursor-pointer transition-colors z-50`}
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <StaticIcon iconName="FaMoon" className="text-gray-400 md:h-3 md:w-3" />
      ) : (
        <StaticIcon iconName="FaSun" className="text-gray-400 md:h-3 md:w-3" />
      )}
    </button>
  );
}

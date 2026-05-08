"use client";

import { useTheme } from "./ThemeProvider";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-[#007848]/5 dark:hover:bg-gray-700 hover:text-[#007848] dark:hover:text-[#00a35e] transition w-full"
    >
      {theme === "light" ? <FiMoon className="text-lg" /> : <FiSun className="text-lg" />}
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
}

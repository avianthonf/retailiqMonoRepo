"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference
    const savedTheme = localStorage.getItem("retailos-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("retailos-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("retailos-theme", "light");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-secondary/20 hover:bg-secondary/40 text-foreground transition-all duration-300 relative group overflow-hidden border border-border/20"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <motion.div
        animate={{ rotate: isDark ? 0 : 360, scale: isDark ? 1 : 0 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <Moon className="w-5 h-5 text-claude-purple" />
      </motion.div>
      <motion.div
        animate={{ rotate: isDark ? -360 : 0, scale: isDark ? 0 : 1 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <Sun className="w-5 h-5 text-claude-orange" />
      </motion.div>
      <div className="w-5 h-5" /> {/* Spacer */}
    </button>
  );
}

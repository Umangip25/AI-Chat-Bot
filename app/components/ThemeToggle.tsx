"use client";

import { useTheme } from "../lib/ThemeContext";

// A simple button to toggle between light and dark themes
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 1000,
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: "var(--bg-secondary)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
      }}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
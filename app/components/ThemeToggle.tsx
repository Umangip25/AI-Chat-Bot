"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../lib/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const buttonStyle = {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid var(--border)",
    background: "var(--bg-secondary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  };

  if (!mounted) return <button aria-label="Toggle theme" style={buttonStyle} />;

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme" style={buttonStyle}>
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
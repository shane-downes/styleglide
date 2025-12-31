import type { PresetTheme } from "./preset-themes";

export function applyTheme(theme: PresetTheme, mode: "light" | "dark") {
  const root = document.documentElement;
  const colors = mode === "dark" ? theme.colors.dark : theme.colors.light;

  // Apply base colors with smooth transitions (handled by global.css)
  Object.entries(colors.base).forEach(([key, value]) => {
    root.style.setProperty(`--base-${key}`, value);
  });

  // Apply primary colors
  Object.entries(colors.primary).forEach(([key, value]) => {
    root.style.setProperty(`--primary-${key}`, value);
  });

  // Store the current theme in localStorage
  localStorage.setItem("current-preset-theme", theme.id);
}

export function getCurrentThemeId(): string {
  if (typeof window === "undefined") return "default";
  return localStorage.getItem("current-preset-theme") || "default";
}

